from pymilvus import connections, FieldSchema, CollectionSchema, DataType, Collection
from sentence_transformers import SentenceTransformer
from pypdf import PdfReader
import re
import os

def extract_text_from_pdf(pdf_path):


    text = ''
    reader = PdfReader(pdf_path)
    number_of_pages = len(reader.pages)
    
    for i in range(number_of_pages):
        page = reader.pages[i]
        text += page.extract_text()
            
    return text

def read_pdfs_from_folder(files):
    """
    Read all PDF files from a folder and extract text content.
    """

    folder_path = 'D:\\Programming\\Projects\\Automated-Assessment-System\\backend\\pdfFiles'
    if not os.path.isdir(folder_path):
        print(f"Error: {folder_path} is not a valid directory.")
        return
    
    pdf_texts = ""
    for filename in files:
        if filename.endswith(".pdf"):
            pdf_path = os.path.join(folder_path, filename)
            try:
                text = extract_text_from_pdf(pdf_path)
                pdf_texts += text
                print(f"Extracted text from: {filename}")
            except Exception as e:
                print(f"Error extracting text from {filename}: {str(e)}")
    
    return pdf_texts

def connect_to_milvus():
    connections.connect(
        alias="default", 
        host='localhost', 
        port='19530'
    )

    print("Connected to Milvus server")

def disconnect_from_milvus():
    connections.disconnect("default")
    print("Disconnected from Milvus server")


def create_collection():
    DIMENSION = 384

    fields = [
        FieldSchema(name='id', dtype=DataType.INT64, is_primary=True, auto_id=True),
        FieldSchema(name='embedding', dtype=DataType.FLOAT_VECTOR, dim=DIMENSION)
    ]

    schema = CollectionSchema(fields=fields, enable_dynamic_field=True)

    collection = Collection(name='rag', schema=schema)

    index_params = {
        "index_type": 'IVF_FLAT',
        "metric_type": 'L2',
        "params" : {"nlist": 128}
    }

    collection.create_index(field_name='embedding', index_params=index_params)

    collection.load()
    return collection



transformer = SentenceTransformer('all-MiniLM-L12-v2')

def insert_data(files):

    # extract text from pdf file
    pdf_text = read_pdfs_from_folder(files)

    sentences = pdf_text.split(".")

    milvus_input = []

    for sentence in sentences:
        entry = {}
        vector_embedding = transformer.encode(sentence)
        entry['embedding'] = vector_embedding
        entry["sentence"] = sentence
        milvus_input.append(entry)

    connect_to_milvus()
    collection = create_collection()
    collection.insert(milvus_input)
    collection.flush()
    disconnect_from_milvus()

    print("Data inserted into Milvus")

def search(query):
    connect_to_milvus()

    collection = Collection(name='rag')

    q_embedding = transformer.encode(query)

    res = collection.search(
        data = [q_embedding],
        anns_field = 'embedding',
        param = {"metric_type": "L2", "parmas": {"nprobe": 2}},
        limit = 3,
        output_fields = ['sentence']
    )

    context = ""
    for i, hits in enumerate(res):
        for hit in hits:
            context += hit.entity.get('sentence')

    disconnect_from_milvus()

    return context


# insert_data()
# context = search("What is Engineering Economics and Management?")
# print(context)



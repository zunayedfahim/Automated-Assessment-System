from transformers import AutoModelForQuestionAnswering, AutoTokenizer, pipeline
from evaluate import load
import pandas as pd

metrics = load('wer')

def roberta_model():
    model_name = "deepset/roberta-base-squad2"

    question = 'Explain the process of mitosis and its significance in cell division?'
    answer = "Cell division is how cells make copies of themselves. It's important for growth and repair, but the details of the process and its significance are unclear."
    context = "Cell division is how cells make copies of themselves. It's important for growth and repair, but the details of the process and its significance are unclear. Mitosis is a cell division process where a single cell divides into two identical daughter cells. It involves chromosomes condensing and separating, followed by the division of the cytoplasm. This is important for growth and repair, but the specific stages and their roles are not fully explained. Mitosis, a fundamental cell division process in eukaryotes, meticulously ensures the accurate duplication of genetic information. It unfolds through a well-orchestrated sequence of stages: chromosome condensation, where the genetic material becomes visible as distinct structures; spindle fiber formation, involving the assembly of microtubule structures that guide chromosome movement; chromosome alignment, where the replicated chromosomes arrange themselves at the center of the dividing cell; sister chromatid separation, where the replicated copies of each chromosome are pulled towards opposite poles; and finally, nuclear membrane and cytoplasm division, resulting in the formation of two distinct daughter cells, each harboring an identical set of chromosomes. This intricate process underpins various vital functions, including growth, enabling multicellular organisms to increase their cell number; repair, facilitating the replacement of damaged or worn-out cells; and asexual reproduction, allowing some organisms to generate offspring genetically identical to themselves. "

    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model = AutoModelForQuestionAnswering.from_pretrained(model_name)

    # a) Get predictions
    nlp = pipeline('question-answering', model=model, tokenizer=tokenizer)
    QA_input = {
        'question': question,
        'context': context
    }
    res = nlp(QA_input)['answer']

    # answer_ids = tokenizer(answer, padding='max_length', max_length=128)['input_ids']
    # model_ans_ids = tokenizer(res, padding='max_length', max_length=128)['input_ids']
    print(f'answer: {answer} \n prediction: {res}')
    accuracy_score = metrics.compute(references=[answer], predictions=[res])

    print(accuracy_score)

    return res
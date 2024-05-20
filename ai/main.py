from typing import Union
from mistral import mistral_model
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from rag import insert_data, search


class Item(BaseModel):
    question: Union[str, None] = None
    answer: Union[str, None] = None


class Item2(BaseModel):
    files: Union[str, None] = None

app = FastAPI()

origins = [
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost",
    "http://localhost:8080",
    "http://locahost:5000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/")
async def read_root(item: Item):
    # context = search(item.question)
    # print(context)
    # return mistral_model(item.question, item.answer, context)
    return mistral_model(item.question, item.answer)

# To insert data to milvus lite vector database
@app.post("/insert")
async def insert(item: Item2):
    files = item.files.split(",")
    return insert_data(files)
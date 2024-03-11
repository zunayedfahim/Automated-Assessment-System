from typing import Union
from roberta import roberta_model
from mistral import mistral_model
from fastapi import FastAPI
from pydantic import BaseModel


class Item(BaseModel):
    question: Union[str, None] = None
    answer: Union[str, None] = None

app = FastAPI()


@app.post("/")
async def read_root(item: Item):
    return mistral_model(item.question, item.answer)
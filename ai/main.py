from typing import Union
from roberta import roberta_model
from mistral import mistral_model
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return mistral_model()
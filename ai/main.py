from typing import Union
from roberta import roberta_model
from fastapi import FastAPI

app = FastAPI()


@app.get("/")
def read_root():
    return roberta_model()
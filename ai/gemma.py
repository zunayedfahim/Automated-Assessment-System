from transformers import pipeline,AutoTokenizer, AutoModelForCausalLM

model_name = "mlx-community/quantized-gemma-2b"
tokenizer = AutoTokenizer.from_pretrained("mlx-community/quantized-gemma-2b")
model = AutoModelForCausalLM.from_pretrained(model_name)

pipe = pipeline("text-generation", model=model, tokenizer=tokenizer)


def gemma_model(question, answer, context):
    gemma_prompt = f"[INST]Question: {question} \nAnswer: {answer} \nContext: {context}.\nYou're given a question, an answer and a context. How much would you mark the answer based on the given context? 1, 2, 3, or 4? 1 being the lowest and 4 being the highest. Give me the score in JSON object as score being the key in the object.[/INST]"

    res = pipe(gemma_prompt)
    return res

question = "What is Engineering Economics and Management?"
answer = "Engineering Economics and Management focuses on interpreting technology led wealth creation dynamics as reoccurring patterns for scaling up invention & innovation art of economic value creation out of ideas with science, engineering and management practices—for endlessly expanding reservoir of wealth from scarce resources."
context = "Economics deals with the science of optimum allocation of scarce resources—for maximizing welfare.  And innovation is the heroic art of Genius—a magical act. It is about getting jobs don better out of ideas. Engineering Economics and Management focuses on interpreting technology led wealth creation dynamics as reoccurring patterns for scaling up invention & innovation art of economic value creation out of ideas with science, engineering and management practices—for endlessly expanding reservoir of wealth from scarce resources."

res = gemma_model(question, answer, context)
print(res)
# Use a pipeline as a high-level helper
# from transformers import AutoModel, AutoTokenizer, pipeline
from evaluate import load
from ctransformers import AutoModelForCausalLM

metrics = load('bertscore')


def mistral_model(question, answer):

    # Set gpu_layers to the number of layers to offload to GPU. Set to 0 if no GPU acceleration is available on your system.
    llm = AutoModelForCausalLM.from_pretrained("TheBloke/Mistral-7B-v0.1-GGUF", model_file="mistral-7b-v0.1.Q4_K_M.gguf", model_type="mistral", gpu_layers=0)

    # mistral_prompt = f"<s>[INST] {question} [/INST]"
    # mistral_prompt = f"<s>[INST] You're given a question. The highest marks for the given question is 4. Now just answer the question only. [/INST] question: {question}"
    # mistral_prompt = f"<s>[INST] Question: {question} [/INST]</s>[INST] Answer the question in 4-5 sentences. [/INST]"
    # mistral_prompt = f"<s>Question: {question} Answer: {answer}</s>[INST] You're given a question and an answer. The answer is categorized as level 3 which contain 4 marks. Now answer the question in 4-5 sentences. [/INST]"
    # mistral_prompt = f"<s>{question}</s>[INST] Answer the given question as if you are a student. [/INST]"
    # mistral_prompt = f"[INST] Suppose you're an examiner. Answer the given question according to your expectation from your students. [/INST] <s>Question: {question}</s>"
    # mistral_prompt = f"<s>[INST] Question: {question} [/INST]"
    # mistral_prompt = f"<s> Question: {question} Context: {answer}</s> [INST] Answer the given question according to the given context. [/INST]"\

    mistral_prompt = f"Question: {question} Answer: {answer}. [INST] You're given a question and an answer.  How much would you mark the answer? 1, 2, 3, or 4? 1 being the lowest and 4 being the highest. Give me only the score. [/INST]"

    res = llm(mistral_prompt)

    return res
    # accuracy_score = metrics.compute(references=[answer], predictions=[res], lang="en")

    # return accuracy_score




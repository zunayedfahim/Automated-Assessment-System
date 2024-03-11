# Use a pipeline as a high-level helper
# from transformers import AutoModel, AutoTokenizer, pipeline
from evaluate import load
from ctransformers import AutoModelForCausalLM

metrics = load('bertscore')


def mistral_model():

    # Set gpu_layers to the number of layers to offload to GPU. Set to 0 if no GPU acceleration is available on your system.
    llm = AutoModelForCausalLM.from_pretrained("TheBloke/Mistral-7B-v0.1-GGUF", model_file="mistral-7b-v0.1.Q4_K_M.gguf", model_type="mistral", gpu_layers=0)

    # prompt = "What is Process Control in Industrial Automation?"
    question = 'How do arteries differ from veins?'
    answer = "Arteries carry oxygen-rich blood away from the heart, while veins return deoxygenated blood. Arteries have thicker, muscular walls to handle high pressure, while veins have thinner walls and valves to prevent backflow."
    # mistral_prompt = f"<s>[INST] {prompt} [/INST]"

    res = llm(question)
    # print(answer)

    accuracy_score = metrics.compute(references=[answer], predictions=[res], lang="en")

    print(accuracy_score)




    # model_name = "TheBloke/Mistral-7B-Instruct-v0.1-GGUF"
    # # tokenizer = AutoTokenizer.from_pretrained(model_name)
    # model = AutoModel.from_pretrained(model_name)
    # nlp = pipeline("text-generation", model=model)


    # # TODO: Prompt is Dynamic
    # prompt = "AI is going to"
    # res = nlp(prompt)
    # return res




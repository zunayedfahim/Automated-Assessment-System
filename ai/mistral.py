# Use a pipeline as a high-level helper
from transformers import AutoModel, AutoTokenizer, pipeline


# Use a pipeline as a high-level helper



from ctransformers import AutoModelForCausalLM



def mistral_model():

    # Set gpu_layers to the number of layers to offload to GPU. Set to 0 if no GPU acceleration is available on your system.
    llm = AutoModelForCausalLM.from_pretrained("TheBloke/Mistral-7B-v0.1-GGUF", model_file="mistral-7b-v0.1.Q4_K_M.gguf", model_type="mistral", gpu_layers=50)

    return (llm("AI is going to"))



    # model_name = "TheBloke/Mistral-7B-Instruct-v0.1-GGUF"
    # # tokenizer = AutoTokenizer.from_pretrained(model_name)
    # model = AutoModel.from_pretrained(model_name)
    # nlp = pipeline("text-generation", model=model)


    # # TODO: Prompt is Dynamic
    # prompt = "AI is going to"
    # res = nlp(prompt)
    # return res




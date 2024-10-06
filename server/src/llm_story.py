from groq import Groq
from langchain_groq import ChatGroq
from langchain.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser, StrOutputParser

import os
import pprint
import sys
from dotenv import load_dotenv, find_dotenv

_ = load_dotenv(find_dotenv())
GROQ_API_KEY = os.environ["GROQ_API_KEY"]
#GROQ_API_KEY='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'


llm_api = ChatGroq(
    model_name="llama-3.2-3b-preview",
    temperature=0.1
)

prompt_api = PromptTemplate(
    input_variables=["year", "ghg_level", "certificate_level"],
    template="""
    You are a climate change storyteller. 
    Create a brief and short 2-3 sentence story about the state of the US in the year {year}, 
    where the Greenhouse Gas (GHG) level is {ghg_level}. 
    The story should be engaging, informative, and reflect the severity of climate change 
    based on the GHG level. 
    If the year is after 2020, mention the certificate level {certificate_level} and its implications. 
    Adjust the tone to be more urgent and serious for higher GHG levels.
    Your answer cannot be longer than 50 words.
    """
)


output_parser = StrOutputParser()

chain_api = prompt_api | llm_api | output_parser

class Story():
    def __init__(self):
        self.chain = chain_api
    def get_result(self, year, ghg_level, certificate_level):
        result = self.chain.invoke({"year": year, "ghg_level": ghg_level, "certificate_level": certificate_level})
        return result


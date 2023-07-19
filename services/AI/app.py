import os
from langchain.agents import AgentType
from langchain.agents import initialize_agent
from langchain.agents.agent_toolkits.jira.toolkit import JiraToolkit
from langchain.llms import OpenAI
from langchain.utilities.jira import JiraAPIWrapper
from dotenv import load_dotenv
# from flask import Flask, jsonify, request
# from flask_cors import CORS, cross_origin

#Load .env file as evnironment variables
load_dotenv()


llm = OpenAI(temperature=0)
jira = JiraAPIWrapper()
toolkit = JiraToolkit.from_jira_api_wrapper(jira)
agent = initialize_agent(
    toolkit.get_tools(), llm, agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION, verbose=True
)
try:
    agent.run("What tickets are assigned to me under the CX_UserHub project?")
except Exception as e:
    print(e)
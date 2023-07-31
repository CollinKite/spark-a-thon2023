import os, requests
from dotenv import load_dotenv
from requests.auth import HTTPBasicAuth
from flask import Flask, jsonify, request
from flask_cors import CORS
from langchain.document_loaders import ConfluenceLoader
from langchain.text_splitter import CharacterTextSplitter, TokenTextSplitter
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.chat_models import ChatOpenAI
from langchain.vectorstores import Chroma
from langchain.chains import RetrievalQA
app = Flask(__name__)
CORS(app)
#CREATE .env file with OPENAI_API_KEY=''
load_dotenv()

EMB_OPENAI_ADA = "text-embedding-ada-002"
EMB_SBERT = None # Chroma takes care
LLM_OPENAI_GPT35 = "gpt-3.5-turbo"
embedding = OpenAIEmbeddings()


def get_assigned_issues(api_token, email, instance_url="https://YOUR.COMPANY.atlassian.net/"):
    # Construct URL for Jira API
    api_url = f"{instance_url}/rest/api/2/search"

    # Define the headers
    headers = {
        "Accept": "application/json"
    }

    # Define the JQL query parameters
    query = {
        'jql': f'assignee="{email}"',
        'fields': 'summary,project,status'  # include project and status fields
    }

    # Send request to Jira API
    response = requests.get(
        api_url,
        headers=headers,
        params=query,
        auth=HTTPBasicAuth(email, api_token)
    )

    # Raise an exception if the request was unsuccessful
    if response.status_code != 200:
        raise Exception(f"Request to Jira API failed with status {response.status_code}. The response was: {response.text}")

    # Parse response JSON and extract the needed information
    issues_data = response.json()
    issue_str = ""
    for issue in issues_data['issues']:
        project_name = issue['fields']['project']['name']
        ticket_id = issue['key']
        summary = issue['fields']['summary']
        progress = issue['fields']['status']['name']

        # Only add the issue to the list if it's not marked as "Done"
        if progress.lower() != "done":
            issue_str += f"Project: {project_name}, Ticket ID: {ticket_id}, Summary: {summary}, Progress: {progress}\n "
    
    return issue_str


#Create Rest API endpoint for new chat messages that takes in an api_token, username, and message
@app.route('/AI/message', methods=['POST'])
def new_message():
    #Get the data from the request
    api_token = request.json['api_token']
    email = request.json['email']
    #get json array of messages from the request and store them
    messages = request.json['messages']

    #Get the issues assigned to the user that aren't done
    issues = get_assigned_issues(api_token, email)

    llm = ChatOpenAI(model_name=LLM_OPENAI_GPT35, temperature=0.)
    config = {"persist_directory":"./chroma_db/",
          "confluence_url":"https://nice-ce-cxone-prod.atlassian.net/wiki",
          "username":email,
          "api_key":api_token,
          "space_key":"IN"
          }
    
    persist_directory = config.get("persist_directory",None)
    confluence_url = config.get("confluence_url",None)
    username = config.get("username",None)
    api_key = config.get("api_key",None)
    space_key = config.get("space_key",None)
    if persist_directory and os.path.exists(persist_directory):
        ## Load from the persist db
        vectordb = Chroma(persist_directory=persist_directory, embedding_function=embedding)
    else:
        ## 1. Extract the documents
        loader = ConfluenceLoader(
            url=confluence_url,
            username = username,
            api_key= api_key
        )
        documents = loader.load(
            space_key=space_key,
            page_ids=["15752939", "15268348"],
            max_pages=200,
            limit=100)
        ## 2. Split the texts
        text_splitter = CharacterTextSplitter(chunk_size=100, chunk_overlap=0)
        texts = text_splitter.split_documents(documents)
        text_splitter = TokenTextSplitter(chunk_size=1000, chunk_overlap=10, encoding_name="cl100k_base")  # This the encoding for text-embedding-ada-002
        texts = text_splitter.split_documents(texts)

        ## 3. Create Embeddings and add to chroma store
        ##TODO: Validate if self.embedding is not None
        vectordb = Chroma.from_documents(documents=texts, embedding=embedding, persist_directory=persist_directory)

    
    #covert the messages array to a string by concatenating the key valye pairs and appending it to a string variable
    messages_str = ""
    for message in messages:
        #get the key and value the json object
        key = list(message.keys())[0]
        value = message[key]
        #append the key and value to the string variable
        messages_str += f"{key}: {value}\n"
    #question is the last json obejects value in the array of messages
    question =  """
    You're a AI chatbot for the company "Nice". specifically you're a Confluence/Jira chatbot answering users questions. Use the following pieces of jira tasks and context to answer the question at the end. If you don't know the answer, say that you don't know, don't try to make up an answer.

    Users Jira Tasks: """ + issues + """
    Context: """ + messages_str + """
    Question: """ + messages[-1][list(messages[-1].keys())[0]] + """

    Helpful Answer:"""
    
    retriever = vectordb.as_retriever(search_kwargs={"k":4})
    qa = RetrievalQA.from_chain_type(llm=llm, chain_type="stuff",retriever=retriever)
    
    response = qa.run(question)

    #return code 200 and a json object with the key "response" and the value of the response from the chatbot
    return jsonify({"response": response}), 200

#start the flask app
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000, threaded=True)

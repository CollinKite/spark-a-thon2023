"""
WSGI config for socketcontainer project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/howto/deployment/wsgi/
"""

import os
import traceback

import eventlet
import socketio
import requests
import jwt


from django.core.wsgi import get_wsgi_application


os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'socketcontainer.settings')

application = get_wsgi_application()

sio = socketio.Server()
app = socketio.WSGIApp(sio, application)

# NOTE
# All prints in SIO on message methods are placeholder and for DEBUG only
@sio.on("user_prompt")
def handlerUser(sid, data):
    print(data)

    jiraUrl = "https://placeholder.com/jira/getItemsForUser"

    jiraBody = {"uid": data["userId"], "params": data["params"], "jiratoken": data["jiraToken"]}

    response = requests.get(jiraUrl, data=jiraBody)

    responseCode = response.status_code

    if(responseCode != 200):
        sio.emit("error_msg", {"msg": "error retrieving user jira data"}, room=data["roomId"])
        return

    jiraData = response.json()

    print(jiraData)
    # placeholder - not sure how we're using jira data back yet - will tie into finished response 

    promptUrl = "https://placeholderAI.com/ai/sendUserPrompt"

    aiBody = {"uid": data["userId"], "prompt": data["userPrompt"]}

    aiResponse = requests.post(promptUrl, data=aiBody)

    responseAICode = aiResponse.status_code

    if(responseAICode != 200):
        sio.emit("error_msg", {"msg": "error getting a ai response"}, room=data["roomId"])
        return
    

    aiResponseResult = aiResponse.json()

    sio.emit("finished_prompt_msg", {"userPrompt": data["userPrompt"], "jiraData": jiraData, "aiResponse": aiResponseResult}, room=data["roomId"])


    dbServerUrl = "https://placeholderDB.com/database/"

    promptAndResponseDict = {"uid": data["userId"], "prompt": data["userPrompt"], "airesponse":aiResponseResult}

    dbResponse = requests.post(dbServerUrl, data=promptAndResponseDict)
    
    dbResponseCode = dbResponse.status_code

    if(dbResponseCode != 200 or dbResponseCode != 201):
        sio.emit("error_msg", {"msg": "error saving entry to DB"}, room=data["userId"])

@sio.on("handle_connect")
def handleUserRoom(sid, data):
    try:
        decodedToken = jwt.decode(data["token"])
        print(decodedToken)

        sio.enter_room(sid, data["roomId"])
        sio.emit("token_update", {"refresh_token":data["refreshToken"], "authentication_token": data["token"]}, room=data["roomId"])
        sio.emit("entered_room", "user successfully entered own instance", room=data["roomId"])
    except:
        try:
            decodedToken = jwt.decode(data["refreshToken"])

            refreshUrl = "http://placeholderAuthAPI/refresh"

            payload = {"refresh_token": decodedToken}

            refreshResponse = requests.post(refreshUrl, data=payload)

            refreshStatus = refreshResponse.status_code

            if refreshStatus == 400 or refreshStatus != 200:
                sio.emit("token_invalid", "token is expired or invalid")
            
            tokens = refreshResponse.json()

            sio.enter_room(sid, data["roomId"])
            sio.emit("token_update", {"refresh_token": tokens["refreshToken"], "authentication_token": tokens["authenticationToken"]}, room=data["roomId"])
            sio.emit("entered_room", "user successfully entered own instance", room=data["roomId"])

        except Exception as exception:
            sio.disconnect(sid=sid)
            traceback.print_exception(Exception, exception, exception.__traceback__)
            print("token is invalid, refusing connection")

        



sioPort = 8000


# eventlet documentation here: https://eventlet.net/doc/modules/wsgi.html
eventlet.wsgi.server(eventlet.listen(('', sioPort)), app)
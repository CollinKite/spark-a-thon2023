"""
WSGI config for socketcontainer project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/howto/deployment/wsgi/
"""

import os
import eventlet
import socketio
import requests
import jwt


from django.core.wsgi import get_wsgi_application


os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'socketcontainer.settings')

application = get_wsgi_application()

sio = socketio.Server()
app = socketio.WSGIApp(sio, application)

accessToken = ""
refreshToken = ""

def getServerTokens():
    serverAuthUrl = "http://dbPlaceholder/database/auth/validate-server"

    serverUser = os.environ.get("SERVER_USER")
    serverPass = os.environ.get("SERVER_PASSWORD")
    if(serverUser == None or serverPass == None):
        serverUser = "root"
        serverPass = "password"

    requestResult = requests.post(serverAuthUrl, data={"username": serverUser, "password": serverPass})

    if(requestResult.status_code != 200):
        print("ERROR: could not retrieve auth tokens!")
        return
    
    result = requestResult.json()

    accessToken = result["data"]["accessToken"]
    refreshToken = result["data"]["refreshToken"]



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

    promptUrl = "https://placeholderAI.com/ai/message"

    aiBody = {"uid": data["userId"], "messages": data["userMessages"], "api_token":data["apiToken"]}

    aiResponse = requests.post(promptUrl, data=aiBody)

    responseAICode = aiResponse.status_code

    if(responseAICode != 200):
        sio.emit("error_msg", {"msg": "error getting a ai response"}, room=data["roomId"])
        return
    

    aiResponseResult = aiResponse.json()

    sio.emit("finished_prompt_msg", {"userPrompt": data["userPrompt"], "jiraData": jiraData, "aiResponse": aiResponseResult}, room=data["roomId"])


    dbServerUrl = "https://placeholderDB.com/database/"
    getServerTokens()

    authDict = {"Authorization": ("Bearer ", accessToken)}

    promptAndResponseDict = {"uid": data["userId"], "prompt": data["userPrompt"], "airesponse":aiResponseResult}

    dbResponse = requests.post(dbServerUrl, data=promptAndResponseDict, headers=authDict)
    
    dbResponseCode = dbResponse.status_code

    if(dbResponseCode != 200 or dbResponseCode != 201):
        sio.emit("error_msg", {"msg": "error saving entry to DB"}, room=data["userId"])

@sio.on("handle_connect")
def handleUserRoom(sid, data):

    if(checkCredentials(sid, data["accessToken"], data["refreshToken"]) == False):
        sio.emit("error_msg", "Authentication expired!")
        sio.disconnect(sid=sid)
    
    userId = data["userId"]

    userCreateUrl = "https://placeholderDBUrl/database/getUser"

    createPayload = {"userId": userId}

    requestForNewUser = requests.post(userCreateUrl, data=createPayload)

    if(requestForNewUser.status_code != 201):
        sio.emit("error_msg", {"msg": "Error retrieving new user"}, to=sid)
        sio.disconnect(sid)
        return
    
    userData = requestForNewUser.json()


    sio.emit("update_user_id", {"userId": userData["userId"]})

@sio.on("create_room")
def createRoom(sid, data):

    if(checkCredentials(sid, data["accessToken"], data["refreshToken"]) == False):
        sio.emit("error_msg", "Authentication expired!")
        sio.disconnect(sid=sid)

    roomRequestUrl = "https://placeholderGetRoomId/database/rooms"

    roomPayload = {"userId": data["userId"]}

    requestForNewRoom = requests.post(roomRequestUrl, params=roomPayload)

    if(requestForNewRoom.status_code != 201):
        sio.emit("error_msg", {"msg": "Error creating new room"}, to=sid)
        return
    
    roomDict = {"roomId": requestForNewRoom.json()["roomId"]}

    sio.emit("update_room_id", data=roomDict)

    sio.enter_room(sid, roomDict["roomId"])
    sio.emit("entered_room", "user successfully entered own room", room=roomDict["roomId"])


def checkCredentials(sid:str, authToken:str, refreshToken:str):
    try:
        decodedToken = jwt.decode(authToken)
        print(decodedToken)

        sio.emit("token_update", {"refresh_token": refreshToken, "authentication_token": authToken}, to=sid)
        return True
    except:
        try:
            decodedRefreshToken = jwt.decode(refreshToken)

            print(decodedRefreshToken)

            refreshUrl = "http://placeholderAuthAPI/database/refresh-token"

            payload = {"refresh_token": refreshToken}

            refreshResponse = requests.post(refreshUrl, data=payload)

            refreshStatus = refreshResponse.status_code

            if refreshStatus == 400 or refreshStatus != 201:
                sio.emit("token_invalid", "token is expired or invalid")
            
            tokens = refreshResponse.json()

            sio.emit("token_update", {"refresh_token": tokens["refreshToken"], "authentication_token": tokens["accessToken"]}, to=sid)
            return True
        except:
            return False



sioPort = 8000


# eventlet documentation here: https://eventlet.net/doc/modules/wsgi.html
eventlet.wsgi.server(eventlet.listen(('', sioPort)), app)
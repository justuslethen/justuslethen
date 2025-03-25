from flask import Flask, send_from_directory, request
from flask_socketio import SocketIO
from modules import database, users, rooms

app = Flask(__name__, static_folder="chat-app/build")
socketio = SocketIO(app, cors_allowed_origins="*")


@app.route("/")
def index():
    return send_from_directory(app.static_folder, "index.html") # send the react index.html file


@app.route("/room/<code>")
def room_page(code):
    # if the user joins a room via the link serve the index.html file
    return send_from_directory(app.static_folder, "index.html")


@app.route("/<path:path>")
def serve_static(path):
    if path == "database.db":
        return "Access to database file is restricted", 403 # dont allow to get the database file
    return send_from_directory(app.static_folder, path) # server all react components and files


@socketio.on("disconnect")
def delete_and_disconnect():
    # handle socket disconnect and delete the user from the room
    code = rooms.get_room_code_by_sid(request.sid)
    users.delete_user(request.sid)
    rooms.emit_online_users(socketio, code) # emit the new online-number to the other users in the room


@socketio.on("connect")
def handle_connect():
    # send the public-rooms list when user connects
    socketio.emit("data-public-rooms", rooms.get_all_public_rooms(), to=request.sid)


# emited by the client when the app is started
@socketio.on("start-app")
def handle_app_start():
    last_sid = request.cookies.get("last_sid")
    success, room_code = rooms.try_join_user_in_room(request.sid, request.args.get("url"), last_sid)
    
    # success defines whether the user was able to join the room
    if success:
        return {"sid": request.sid, "roomdata": rooms.get_full_room_data(room_code)}
    return {"sid": request.sid}


# emited by the client on the page create-room
@socketio.on("create-room")
def create_room(config):
    # catch if the roomname is empty
    if config["roomname"].strip() == "":
        return "roomname is empty"
    
    # config contains the roomname and the choises of the config options
    code, room_name = rooms.create_new_room(config)
    
    # room-name and code for the user to display it in the header and share page
    if room_name:
        return {"code": code, "roomname": room_name}
    return 404


@socketio.on("open-room")
def open_room(code):
    # check if the time the room is open is over
    if rooms.has_room_ended(code):
        return "room has ended"
    
    # get the code, online.users and roomname to display it in the header and share page
    code, room_name, online_users = rooms.get_room_data(code)

    # if room-name is none the room-code doesnt exist for a room
    if room_name is not None:
        return {"code": code, "roomname": room_name, "online": online_users}
    return "room not found"


@socketio.on("join-room")
def join_room(data):
    # check if the room is stil available and the user has entered a username
    res = rooms.validate_join_room(data)
    if res is not None:
        return res
    
    code, user_data = data["code"], data["userdata"] # copy the code and userdata from the data
    rooms.join_room(request.sid, code, user_data)
    rooms.emit_online_users(socketio, data["code"]) # send the new online-number to the other users in the room
    
    # return all the messages in the room
    chat = rooms.get_chat_history(code)
    return chat


@socketio.on("send-message")
def send_message(message):
    # check if the message is empty
    if message.strip() == "":
        return
    
    # create the new message and save it in the database
    data = rooms.send_message(request.sid, message)
    
    # emit the new message to all users in the room
    rooms.emit_new_message(socketio, data)


if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=4000, debug=True)

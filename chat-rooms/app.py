from flask import Flask, send_from_directory, request
from flask_socketio import SocketIO
from modules import database, users, rooms

app = Flask(__name__, static_folder="chat-app/build")
socketio = SocketIO(app, cors_allowed_origins="*")


@app.route("/")
def index():
    return send_from_directory(app.static_folder, "index.html")


@app.route("/room/<code>")
def room_page(code):
    return send_from_directory(app.static_folder, "index.html")


@app.route("/<path:path>")
def serve_static(path):
    if path == "database.db":
        return "Access to database file is restricted", 403
    return send_from_directory(app.static_folder, path)


@socketio.on("disconnect")
def delete_and_disconnect():
    code = rooms.get_room_code_by_sid(request.sid)
    users.delete_user(request.sid)
    rooms.emit_online_users(socketio, code)


@socketio.on("connect")
def handle_connect():
    socketio.emit("data-public-rooms", rooms.get_all_public_rooms(), to=request.sid)


@socketio.on("start-app")
def handle_app_start():
    last_sid = request.cookies.get("last_sid")
    print(f"last_sid: {last_sid}")
    success, room_code = rooms.try_join_user_in_room(request.sid, request.args.get("url"), last_sid)
    print(f"room_code: {room_code}")
    if success:
        print(f"success joined room: {room_code}")
        return {"sid": request.sid, "roomdata": rooms.get_full_room_data(room_code)}
    return {"sid": request.sid}


@socketio.on("create-room")
def create_room(config):
    code, room_name = rooms.create_new_room(config)
    if room_name:
        return {"code": code, "roomname": room_name}
    return 404


@socketio.on("open-room")
def open_room(code):
    if rooms.has_room_ended(code):
        return "room has ended"
    
    code, room_name, online_users = rooms.get_room_data(code)
    print(f"room data: {code}, {room_name}, {online_users}")
    if room_name is not None:
        return {"code": code, "roomname": room_name, "online": online_users}
    return "room not found"


@socketio.on("join-room")
def join_room(data):
    if data["userdata"]["username"].strip() == "":
        return "username is empty"
    if rooms.has_room_ended(data["code"]):
        return "room has ended"
    if rooms.is_room_full(data["code"]):
        return "room is full"
    
    code, user_data = data["code"], data["userdata"]
    rooms.join_room(request.sid, code, user_data)
    rooms.emit_online_users(socketio, data["code"])
    chat = rooms.get_chat_history(code)
    print(f"chat: {chat}")
    return chat


@socketio.on("send-message")
def send_message(message):
    if message.strip() == "":
        return
    data = rooms.send_message(request.sid, message)
    rooms.emit_new_message(socketio, data)


if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=4000, debug=True)

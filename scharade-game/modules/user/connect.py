from modules.database import database
from modules.user import userdata
from markupsafe import escape


def mark_user_invalid(sid):
    cur, conn = database.load_database()
    query = "UPDATE users SET valid = 0 WHERE sid = ?"
    cur.execute(query, (sid,))
    conn.commit()
    conn.close()


def emit_new_user_to_others(socketio, sid, pin):
    print("emit_new_user_to_others")
    cur, conn = database.load_database()
    username = userdata.get_username(sid)
    team_name = userdata.get_users_team_name(cur, sid)
    conn.close()
    
    username = escape(username)
    users = userdata.get_users_from_lobby(pin)
    for i in users:
        socketio.emit("new_user_joined", {"username": username, "team_name": team_name}, to=i["sid"])
    
    
def emit_new_team_name_to_others(socketio, new_team_name, old_team_name, pin):
    users = userdata.get_users_from_lobby(pin)

    for i in users:
        print(f"Sending new team name to {i['sid']}")
        socketio.emit("new_team_name", {"team_name": new_team_name, "old_team_name": old_team_name}, to=i["sid"])


def emit_new_team_to_others(socketio, team_name, pin):
    users = userdata.get_users_from_lobby(pin)

    for i in users:
        print(f"Sending new team to {i['sid']}")
        socketio.emit("new_team", {"team_name": team_name}, to=i["sid"])


def emit_start_word_round_to_others(socketio, pin):
    users = userdata.get_users_from_lobby(pin)
    print("emit_start_word_round_to_others")
    print(users)

    for i in users:
        print(f"Sending start word round to {i['sid']}")
        socketio.emit("start_word_round", to=i["sid"])


def emit_start_game_to_others(socketio, game_data, pin):
    users = userdata.get_users_from_lobby(pin)

    for i in users:
        print(f"username: {i['username']}, current_turn_user: {game_data['currentturnuser']}")
        
        # Config data personal for user
        if i["username"] != game_data["currentturnuser"]:
            game_data["isownturn"] = False
        else:
            game_data["isownturn"] = True
            
        socketio.emit("start_game", {"gamedata": game_data}, to=i["sid"])


def emit_start_round_to_others(socketio, pin, sid, word, is_last_word, time_at_start, start_date):
    users = userdata.get_users_from_lobby(pin)
    print("emit_start_round_to_others")
    print(users)
    
    for i in users:
        print(f"Sending start round to {i['sid']}")
        if i["sid"] != sid:
            socketio.emit("start_round", to=i["sid"])
        else:
            socketio.emit("start_round", {"word": word, "is_last_word": is_last_word, "timeatstart": time_at_start, "startdate": start_date}, to=i["sid"])


def emit_end_round_to_others(socketio, pin, game_data):
    users = userdata.get_users_from_lobby(pin)
    print("emit_end_round_to_others")
    print(users)

    for i in users:
        print(f"Sending end round to {i['sid']}")
        socketio.emit("end_round", {"game_data": game_data}, to=i["sid"])


def emit_end_game_to_others(socketio, pin, team_score):
    users = userdata.get_users_from_lobby(pin)
    print("emit_end_game_to_others")
    print(users)

    for i in users:
        print(f"Sending end game to {i['sid']}")
        socketio.emit("end_game", team_score, to=i["sid"])


def emit_removed_user_to_others(socketio, removed_sid, removed_username, pin):
    users = userdata.get_users_from_lobby(pin)

    for i in users:
        print(f"Sending removed user to {i['sid']}")
        socketio.emit("removed_user", {"username": removed_username, "sid": removed_sid}, to=i["sid"])
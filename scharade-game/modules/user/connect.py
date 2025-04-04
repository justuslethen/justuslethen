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
    cur, conn = database.load_database()
    username = userdata.get_username(sid)
    team_name = userdata.get_users_team_name(cur, sid)
    conn.close()
    
    username = escape(username)
    users = userdata.get_users_from_lobby(pin)
    for i in users:
        socketio.emit("new_user_joined", {"username": username, "teamname": team_name}, to=i["sid"])
    
    
def emit_new_team_name_to_others(socketio, new_team_name, old_team_name, pin):
    users = userdata.get_users_from_lobby(pin)

    for i in users:
        socketio.emit("new_team_name", {"teamname": new_team_name, "oldteamname": old_team_name}, to=i["sid"])


def emit_new_team_to_others(socketio, team_name, pin):
    users = userdata.get_users_from_lobby(pin)

    for i in users:
        socketio.emit("new_team", {"teamname": team_name}, to=i["sid"])


def emit_start_word_round_to_others(socketio, pin):
    users = userdata.get_users_from_lobby(pin)

    for i in users:
        socketio.emit("start_word_round", to=i["sid"])


def emit_start_game_to_others(socketio, game_data, pin):
    users = userdata.get_users_from_lobby(pin)

    for i in users:
        # Config data personal for user
        if i["username"] != game_data["currentturnuser"]:
            game_data["isownturn"] = False
        else:
            game_data["isownturn"] = True
            
        socketio.emit("start_game", {"gamedata": game_data}, to=i["sid"])


def emit_start_round_to_others(socketio, pin, sid, word, is_last_word, time_at_start, start_date):
    users = userdata.get_users_from_lobby(pin)
    
    for i in users:
        if i["sid"] != sid:
            socketio.emit("start_round", to=i["sid"])
        else:
            socketio.emit("start_round", {"word": word, "islastword": is_last_word, "timeatstart": time_at_start, "startdate": start_date}, to=i["sid"])


def emit_end_round_to_others(socketio, pin, game_data):
    users = userdata.get_users_from_lobby(pin)

    for i in users:
        socketio.emit("end_round", {"gamedata": game_data}, to=i["sid"])


def emit_end_game_to_others(socketio, pin, team_score):
    users = userdata.get_users_from_lobby(pin)

    for i in users:
        socketio.emit("end_game", team_score, to=i["sid"])


def emit_removed_user_to_others(socketio, removed_sid, removed_username, pin):
    users = userdata.get_users_from_lobby(pin)

    for i in users:
        am_i_removed = False
        if i["sid"] == removed_sid:
            am_i_removed = True
        socketio.emit("removed_user", {"username": removed_username, "sid": removed_sid, "amiremoved": am_i_removed}, to=i["sid"])
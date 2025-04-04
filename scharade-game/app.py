from flask import Flask, render_template, send_from_directory, request
from flask_socketio import SocketIO, send

from modules.database import database
from modules.lobby import lobby, game, check_for_swear_words
from modules.user import connect, userdata

app = Flask(__name__, static_folder="game-app/build", static_url_path="")
app.config["SECRET_KEY"] = "your_secret_key"
socketio = SocketIO(app)


swear_words = check_for_swear_words.load_swear_words()


# Serve the index.html file
@app.route("/")
def index():
    return send_from_directory(app.static_folder, "index.html")


# Serve other static files (CSS, JS, images)
@app.route("/<path:path>")
def serve_static(path):
    if path == "database.db":
        return "Access to database file is restricted", 403
    return send_from_directory(app.static_folder, path)


@socketio.on("connect")
def on_connect():
    sid = request.sid
    userdata.create_new_user_row(sid)

    # Give user random username
    username = userdata.get_random_username()
    userdata.set_username(sid, username)

    return {"username": username}


@socketio.on("disconnect")
def on_connect():
    sid = request.sid
    connect.mark_user_invalid(sid)


@socketio.on("join_lobby")
def on_join_lobby(data):
    sid = request.sid
    pin = data["pin"]
    lobby_data = lobby.join_user_in_lobby(sid, pin)

    if lobby_data is None:
        return "game not found"

    # Remove the user from the game data, to prevent double user when creating a name
    lobby_data = userdata.remove_own_user_from_lobby_data(lobby_data, sid)

    username = userdata.get_username(sid)
    if username is None:
        username = "Unknown"
    lobby_data["username"] = username

    return {"lobbydata": lobby_data}


@socketio.on("create_lobby")
def on_create_lobby(config_data):
    sid = request.sid
    
    if check_for_swear_words.censor(config_data["lobbyname"], swear_words)[1]:
        return "name contains swear words"
    
    # Create new lobby and join the user in it
    lobby_data, host_code = lobby.create_new_lobby(sid, config_data)
    
    if host_code == None:
        return "any field empty"

    lobby.join_user_in_lobby(sid, lobby_data["lobbycode"])
    lobby_data["ishost"] = True

    return {"lobbydata": lobby_data, "hostcode": host_code}


@socketio.on("set_username")
def on_set_username(data):
    sid = request.sid
    username = data["username"]
    pin = userdata.get_users_lobby_code(sid)
    
    if check_for_swear_words.censor(username, swear_words)[1]:
        return "name contains swear words"
    if username.strip() == "":
        return "username empty"
    if userdata.is_username_taken(pin, username):
        return "username is taken"

    userdata.set_username(sid, username)  # Set the username in the database

    # Emit the user to the other users in the lobby
    connect.emit_new_user_to_others(socketio, sid, pin)
    return {"username": username}


@socketio.on("set_team_name")
def on_set_team_name(data):
    sid = request.sid
    new_team_name = data["teamname"]
    
    if check_for_swear_words.censor(new_team_name, swear_words)[1]:
        return "name contains swear words"
    if new_team_name.strip() == "":
        return "teamname empty"

    cur, conn = database.load_database()
    old_team_name = userdata.get_users_team_name(cur, sid)
    conn.close()

    userdata.set_team_name(sid, new_team_name)

    # Emit the new team name to the other users in the lobby
    pin = userdata.get_users_lobby_code(sid)
    connect.emit_new_team_name_to_others(socketio, new_team_name, old_team_name, pin)
    return {"teamname": new_team_name, "oldteamname": old_team_name}


@socketio.on("start_word_round")
def on_start_word_round():
    sid = request.sid
    pin = userdata.get_users_lobby_code(sid)
    lobby.write_page_to_database(pin, "words")
    connect.emit_start_word_round_to_others(socketio, pin)


@socketio.on("add_word")
def on_add_word(data):
    sid = request.sid
    word = data["word"]
    
    if check_for_swear_words.censor(word, swear_words)[1]:
        return "word contains swear words"
    if word.strip() == "":
        return "word empty"
    
    pin = userdata.get_users_lobby_code(sid)
    lobby.add_word_to_list(word, pin, sid)


@socketio.on("host_back_to_lobby")
def on_host_back_to_lobby(data):
    host_code = data["hostcode"]
    sid = request.sid

    # Update the old sid for the host
    pin = lobby.foward_as_host(host_code, sid)

    cur, conn = database.load_database()
    lobby_data = lobby.get_lobby_data(cur, pin, sid)
    countdown = game.get_countdown(cur, pin)
    conn.close()
    
    lobby_data["ishost"] = True
    game_data = game.get_game_data(pin, sid)

    return {
        "lobbydata": lobby_data,
        "page": lobby_data["page"],
        "gamedata": game_data,
        "timeatstart": countdown[0],
        "startdate": countdown[1]
    }


@socketio.on("forward_as_player")
def on_forward_as_player(data):
    sid = request.sid
    old_sid = data["playersid"]

    pin = lobby.forward_as_player(sid, old_sid)

    cur, conn = database.load_database()
    lobby_data = lobby.get_lobby_data(cur, pin, sid)
    countdown = game.get_countdown(cur, pin)
    conn.close()

    game_data = game.get_game_data(pin, sid)
 

    return {
        "lobbydata": lobby_data,
        "page": lobby_data["page"],
        "gamedata": game_data,
        "timeatstart": countdown[0],
        "startdate": countdown[1]
    }

@socketio.on("remove_user")
def on_remove_user(data):
    sid = request.sid
    user_to_remove = data["username"]
    pin = userdata.get_users_lobby_code(sid)
    sid_to_remove = lobby.get_sid_from_username(user_to_remove, pin)
    
    connect.emit_removed_user_to_others(socketio, sid_to_remove, user_to_remove, pin)
    lobby.remove_user_from_lobby(user_to_remove, pin)

    return True

@socketio.on("start_game")
def on_get_to_start_page():
    sid = request.sid
    pin = userdata.get_users_lobby_code(sid)
    lobby.write_page_to_database(pin, "game")
    game_data = game.start_game(pin, sid)

    connect.emit_start_game_to_others(socketio, game_data, pin)


@socketio.on("start_round")
def on_start_round():
    sid = request.sid
    pin = userdata.get_users_lobby_code(sid)
    game.start_round(pin, sid)

    cur, conn = database.load_database()
    round_number = game.get_round_number(cur, pin)
    word = game.get_random_word(cur, pin)
    is_last_word = game.check_if_is_last_word(cur, pin)
    time_at_start, start_date = game.get_countdown(cur, pin)
    
    conn.close()

    connect.emit_start_round_to_others(socketio, pin, sid, word, is_last_word, time_at_start, start_date)


@socketio.on("guessed_word_correct")
def on_guessed_word_correct(data):
    sid = request.sid
    pin = userdata.get_users_lobby_code(sid)

    cur, conn = database.load_database()
    round_number = game.get_round_number(cur, pin)
    team_name = userdata.get_users_team_name(cur, sid)
    game.guessed_word_correctly(cur, pin, sid, data["word"], round_number, team_name)
    new_word = game.get_random_word(cur, pin)
    is_last_word = game.check_if_is_last_word(cur, pin)
    conn.commit()
    conn.close()

    return {"word": new_word, "islastword": is_last_word}


@socketio.on("next_player")
def on_next_player():
    sid = request.sid
    pin = userdata.get_users_lobby_code(sid)
    game.next_player(pin, sid)
    game_data = game.get_game_data(pin, sid)
    
    connect.emit_start_game_to_others(socketio, game_data, pin)


@socketio.on("end_round")
def on_end_round(data):
    sid = request.sid
    pin = userdata.get_users_lobby_code(sid)
    word = data["word"]
    
    cur, conn = database.load_database()
    team_name = userdata.get_users_team_name(cur, sid)
    round_number = game.get_round_number(cur, pin)
    game.guessed_word_correctly(cur, pin, sid, word, round_number, team_name)
    conn.commit()
    conn.close()
    
    if game.is_game_over(pin):
        lobby.write_page_to_database(pin, "endData")
        team_score = game.get_team_scores_for_rounds(pin)
        connect.emit_end_game_to_others(socketio, pin, team_score)
    else:
        game_data = game.get_game_data(pin, sid)
        game.set_lost_time(pin)
        lobby.write_page_to_database(pin, "roundScore")

        connect.emit_end_round_to_others(socketio, pin, game_data)


@socketio.on("next_round")
def on_next_round():
    sid = request.sid
    pin = userdata.get_users_lobby_code(sid)
    
    game_data = game.next_round(pin)
    lobby.write_page_to_database(pin, "game")
    connect.emit_start_game_to_others(socketio, game_data, pin)


@socketio.on("end_game")
def on_end_game():
    sid = request.sid
    pin = userdata.get_users_lobby_code(sid)
    team_score = game.get_team_scores_for_rounds(pin)
    lobby.write_page_to_database(pin, "endData")

    connect.emit_end_game_to_others(socketio, pin, team_score)


if __name__ == "__main__":
    socketio.run(app, debug=True, host="0.0.0.0", port=4500)
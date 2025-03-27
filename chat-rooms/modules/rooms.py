from datetime import datetime
from modules import database, check_for_swear_words, users
import random

swear_words = check_for_swear_words.load_swear_words()


# return the name and code for every room that is public and not expired yet
def get_all_public_rooms():
    cur, conn = database.connect_db()
    res = cur.execute("SELECT roomname, code, expiring_at FROM rooms WHERE private = 0")
    
    publ_rooms = []
    for row in res:
        if not is_expiring_date_reached(row[2]):
            publ_rooms.append({"roomname": row[0], "code": row[1]})
    
    conn.close()
    return publ_rooms


def is_expiring_date_reached(expiring_date):
    # convert string in usable format
    expiring_at = datetime.strptime(expiring_date, "%Y-%m-%d")

    # compare it with the current date
    return expiring_at.date() <= datetime.now().date() # comparing only the date part


def prepare_room_data(config):
    # the choises also displayed on the react interface
    members_choise = [3, 10, 15, 30]
    duration_choise = [1, 3, 7, 30]

    # set members and duration based on the emited index from the choice array
    return {
        "roomname": config["roomname"],
        "code": gen_random_code(),
        "max_members": members_choise[config["maxmembers"]["selected"]],
        "private": config["privacy"]["selected"],
        "duration": duration_choise[config["roomduration"]["selected"]],
    }


def insert_room_into_db(room_data):
    cur, conn = database.connect_db()

    # insert new row in the table rooms
    # automatically set the time when the room was created
    query = """
        INSERT INTO rooms (roomname, code, created_at, duration, max_members, private)
        VALUES (?, ?, CURRENT_TIMESTAMP, ?, ?, ?)
    """

    # insert the prepared data based on the user inputs and configs
    cur.execute(
        query,
        (
            room_data["roomname"],
            room_data["code"],
            room_data["duration"],
            room_data["max_members"],
            room_data["private"],
        ),
    )

    conn.commit()
    conn.close()

    # return code and name for the client to display it
    return room_data["code"], room_data["roomname"]


def create_new_room(config):
    # get the prepared data for the new room
    room_data = prepare_room_data(config)

    # insert the data into the database and return roomname and code
    return insert_room_into_db(room_data)


def gen_random_code():
    # all possible letters for the code
    letters = "QWERTZUIOPASDFGHJKLYXCVNBM"
    code = ""
    code_exists = True  # set to true to make the while loop run

    # generate a new code until it is unique
    while code_exists:
        # add a random letter to the code 6 times
        for _ in range(6):
            code += random.choice(letters)

        code_exists = does_code_exist(code)  # checks if the code already exists

    return code


# look for the code in the database and tell if it exists
def does_code_exist(code):
    cur, conn = database.connect_db()

    cur.execute("SELECT * FROM rooms WHERE code = ?", (code,))
    res = cur.fetchone()  # save the response to return it later

    conn.close()  # dont commit because of no changes in the database
    return res


# get the the online-number and roomname by the given code
def get_room_data(code):
    code = code.upper()  # make the code uppercase to avoid case sensitivity

    cur, conn = database.connect_db()
    cur.execute("SELECT code, roomname FROM rooms WHERE code = ?", (code,))
    res = cur.fetchone()

    # get the number of online users in the room
    online_users = len(
        cur.execute(
            "SELECT username FROM users WHERE room_code = ?", (code,)
        ).fetchall()
    )
    conn.close()  # dont commit because of no changes in the database

    if res is None:
        return None, None, None  # return every three values as None to avoid errors
    return res[0], res[1], online_users  # res[0] is basicaly just the value code


def get_chat_history(code):
    cur, conn = database.connect_db()

    # first get the room-id by the code, because the room-id is needed to find the messages
    cur.execute("SELECT room_id FROM rooms WHERE code = ?", (code,))
    room_id = cur.fetchone()[0]

    # get all messages from the room with the room-id
    cur.execute(
        """SELECT sender_name, color, messages.message 
        FROM messages
        WHERE room_id = ?""",
        (room_id,),
    )
    res = cur.fetchall()

    conn.close()

    # return all messages as a list with the sender name, color and text for every message
    return [{"sender": row[0], "color": row[1], "message": row[2]} for row in res]


def join_room(sid, code, user_data):
    users.delete_user(sid)
    # get the username and the chosen color from the user-data
    username, color = prepare_user_data(user_data)

    cur, conn = database.connect_db()

    # create new row for the new user joined in the room
    cur.execute(
        "INSERT INTO users (sid, username, room_code, color) VALUES (?, ?, ?, ?)",
        (sid, username, code, color),
    )
    conn.commit()
    conn.close()


def prepare_user_data(user_data):
    # all possible colors for the user to choose
    color_selections = ["blue", "purple", "pink", "red", "green", "orange"]

    # set the color based on the index of the selected color
    color = color_selections[user_data["color"]["selected"]]

    # return the username and the color as a tuple
    return user_data["username"], color


def send_message(sid, message):
    # censor the message if it contains swear words
    message = check_for_swear_words.censor(message, swear_words)[0]

    cur, conn = database.connect_db()

    # first get the user-id, color, room-id and code of the user by the sid
    query = """
        SELECT users.user_id, users.color, rooms.room_id, rooms.code, users.username
        FROM users 
        JOIN rooms ON users.room_code = rooms.code 
        WHERE users.sid = ?
    """
    cur.execute(
        query,
        (sid,),
    )
    res = cur.fetchone()

    # avoid errors if the user is not in the database, so maybe has not joined any room yet
    if res is None:
        return

    # create readable values for all the values fetched
    user_id, color, room_id, code, sender_name = res[0], res[1], res[2], res[3], res[4]

    # insert the new message with data like username, color, and text into the database
    # also insert the username in case of the user has left and his row is deleted
    cur.execute(
        "INSERT INTO messages (sender_id, message, color, room_id, sender_name) VALUES (?, ?, ?, ?, ?)",
        (user_id, message, color, room_id, sender_name),
    )
    conn.commit()
    conn.close()

    # return the data for the new message to emit it to the other users
    return {"sender": sender_name, "color": color, "message": message, "code": code}


# emit the new message to all users in the room
def emit_new_message(socketio, data):
    user_sids = get_all_sids_in_room(data["code"])
    for sid in user_sids:
        socketio.emit("new-message", data, to=sid)


# get all sids of the users in the room by the code to emit data to them
def get_all_sids_in_room(code):
    cur, conn = database.connect_db()
    res = cur.execute("SELECT sid FROM users WHERE room_code = ?", (code,))
    sids = [row[0] for row in res]
    conn.close()
    return sids


# full room data also includes the messages
# just get_room_data only inludes the code, roomname and online users
def get_full_room_data(code):
    room_data = get_room_data(code)

    # just add the messages to the other room data
    return {
        "messages": get_chat_history(code),
        "code": room_data[0],
        "roomname": room_data[1],
        "online": room_data[3],
    }


def try_join_user_in_room(sid, url, last_sid):
    cur, conn = database.connect_db()
    cur.execute("SELECT room_code FROM users WHERE sid = ?", (last_sid,))
    code = cur.fetchone()

    if code is None:
        return False, False
    if get_code_from_url(url) != code:
        return False, False

    cur.execute("UPDATE users SET sid = ? WHERE sid = ?", (sid, last_sid))
    conn.commit()
    conn.close()

    return True, code


def get_code_from_url(url):
    return url.split("/")[-1]


# look for the room code from the user that has the given sid
def get_room_code_by_sid(sid):
    cur, conn = database.connect_db()

    cur.execute("SELECT room_code FROM users WHERE sid = ?", (sid,))
    res = cur.fetchone()
    conn.close()

    return res[0] if res is not None else None


# emit the new online-number to all users in the room
def emit_online_users(socket, code):
    user_sids = get_all_sids_in_room(
        code
    )  # count the sids in the room to find the online-number
    for sid in user_sids:
        socket.emit("online-users", len(user_sids), to=sid)


# check if the room has ended by the expiring date
def has_room_ended(code):
    cur, conn = database.connect_db()

    # get the expiring date as datime object of the room by the code
    cur.execute("SELECT expiring_at FROM rooms WHERE code = ?", (code,))
    res = cur.fetchone()
    conn.close()

    if res is None:
        return False

    expiring_at = datetime.strptime(
        res[0], "%Y-%m-%d"
    )  # convert the date string to a datetime object
    return expiring_at < datetime.now()  # compare the date with the current date


# check if all max members are in the room
def is_room_full(code):
    cur, conn = database.connect_db()

    # get the max members of the room by the code
    cur.execute("SELECT max_members FROM rooms WHERE code = ?", (code,))
    max_members = cur.fetchone()[0]

    # count the members in the room by the code
    cur.execute("SELECT * FROM users WHERE room_code = ?", (code,))
    members = len(cur.fetchall())

    conn.close()

    return members >= max_members  # return true if the room is full


def validate_join_room(data):
    # username check
    if data["userdata"]["username"].strip() == "":
        return "username is empty"

    # username swear word check
    if check_for_swear_words.censor(data["userdata"]["username"], swear_words)[1] > 0:
        return "username contains swear words"

    # room duration check
    if has_room_ended(data["code"]):
        return "room has ended"

    # room members check
    if is_room_full(data["code"]):
        return "room is full"


def is_username_taken(code, username):
    cur, conn = database.connect_db()

    # check if the username is already taken in the room
    cur.execute(
        "SELECT * FROM users WHERE room_code = ? AND username = ?", (code, username)
    )
    res = cur.fetchone()

    conn.close()
    return res is not None

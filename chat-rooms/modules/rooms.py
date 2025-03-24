from datetime import datetime
from modules import database
import random


def get_all_public_rooms():
    cur, conn = database.connect_db()
    res = cur.execute(
        "SELECT roomname, code FROM rooms WHERE private = 0 AND expiring_at >= DATE('NOW')"
    )
    publ_rooms = [{"roomname": row[0], "code": row[1]} for row in res]
    conn.close()
    return publ_rooms


def prepare_room_data(config):
    members_choise = [3, 10, 15, 30]
    duration_choise = [1, 3, 7, 30]

    return {
        "roomname": config["roomname"],
        "code": gen_random_code(),
        "max_members": members_choise[config["maxmembers"]["selected"]],
        "private": config["privacy"]["selected"],
        "duration": duration_choise[config["roomduration"]["selected"]],
    }


def insert_room_into_db(room_data):
    cur, conn = database.connect_db()

    cur.execute(
        """
        INSERT INTO rooms (roomname, code, created_at, duration, max_members, private)
        VALUES (?, ?, CURRENT_TIMESTAMP, ?, ?, ?)
    """,
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

    return room_data["code"], room_data["roomname"]


def create_new_room(config):
    print(f"config: {config}")
    room_data = prepare_room_data(config)
    print(f"room data: {room_data}")
    return insert_room_into_db(room_data)


def gen_random_code():
    letters = "QWERTZUIOPASDFGHJKLYXCVNBM"
    code = ""
    code_exists = True

    while code_exists:
        for _ in range(6):
            code += random.choice(letters)
        code_exists = does_code_exist(code)
        print(code_exists)
    return code


def does_code_exist(code):
    cur, conn = database.connect_db()
    cur.execute("SELECT * FROM rooms WHERE code = ?", (code,))
    res = cur.fetchone()
    conn.close()
    return res


def get_room_data(code):
    code = code.upper()
    cur, conn = database.connect_db()
    cur.execute("SELECT code, roomname FROM rooms WHERE code = ?", (code,))
    res = cur.fetchone()
    online_users = len(
        cur.execute(
            "SELECT username FROM users WHERE room_code = ?", (code,)
        ).fetchall()
    )
    conn.close()
    if res is None:
        return None, None, None
    return res[0], res[1], online_users


def get_chat_history(code):
    cur, conn = database.connect_db()
    cur.execute("SELECT room_id FROM rooms WHERE code = ?", (code,))
    room_id = cur.fetchone()[0]
    print(f"room_id: {room_id}")
    cur.execute(
        """SELECT sender_name, color, messages.message 
        FROM messages
        WHERE room_id = ?""",
        (room_id,),
    )
    res = cur.fetchall()
    cur.execute("SELECT * FROM users WHERE user_id IN (14, 15)")
    print(cur.fetchall())  # Sollte Benutzer mit IDs 14 und 15 ausgeben
    conn.close()
    return [{"sender": row[0], "color": row[1], "message": row[2]} for row in res]


def join_room(sid, code, user_data):
    username, color = prepare_user_data(user_data)
    cur, conn = database.connect_db()
    cur.execute(
        "INSERT INTO users (sid, username, room_code, color) VALUES (?, ?, ?, ?)",
        (sid, username, code, color),
    )
    conn.commit()
    conn.close()


def prepare_user_data(user_data):
    color_selections = ["blue", "purple", "pink", "red", "green", "orange"]
    color = color_selections[user_data["color"]["selected"]]
    return user_data["username"], color


def send_message(sid, message):
    cur, conn = database.connect_db()
    cur.execute(
        """
        SELECT users.user_id, users.color, rooms.room_id, rooms.code, users.username
        FROM users 
        JOIN rooms ON users.room_code = rooms.code 
        WHERE users.sid = ?
        """,
        (sid,),
    )
    res = cur.fetchone()
    if res is None:
        return
    user_id, color, room_id, code, sender_name = res[0], res[1], res[2], res[3], res[4]
    cur.execute(
        "INSERT INTO messages (sender_id, message, color, room_id, sender_name) VALUES (?, ?, ?, ?, ?)",
        (user_id, message, color, room_id, sender_name),
    )
    conn.commit()
    conn.close()
    return {"sender": sender_name, "color": color, "message": message, "code": code}


def emit_new_message(socketio, data):
    user_sids = get_all_sids_in_room(data["code"])
    for sid in user_sids:
        socketio.emit("new-message", data, to=sid)


def get_all_sids_in_room(code):
    cur, conn = database.connect_db()
    res = cur.execute("SELECT sid FROM users WHERE room_code = ?", (code,))
    sids = [row[0] for row in res]
    conn.close()
    return sids


def get_full_room_data(code):
    room_data = get_room_data(code)
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


def get_room_code_by_sid(sid):
    cur, conn = database.connect_db()
    cur.execute("SELECT room_code FROM users WHERE sid = ?", (sid,))
    res = cur.fetchone()
    conn.close()
    return res[0] if res is not None else None


def emit_online_users(socket, code):
    user_sids = get_all_sids_in_room(code)
    for sid in user_sids:
        socket.emit("online-users", len(user_sids), to=sid)


def has_room_ended(code):
    cur, conn = database.connect_db()
    cur.execute("SELECT expiring_at FROM rooms WHERE code = ?", (code,))
    res = cur.fetchone()
    conn.close()
    
    if res is None:
        return False
    
    expiring_at = datetime.strptime(res[0], "%Y-%m-%d")
    return expiring_at < datetime.now()


def is_room_full(code):
    cur, conn = database.connect_db()
    cur.execute("SELECT max_members FROM rooms WHERE code = ?", (code,))
    max_members = cur.fetchone()[0]
    cur.execute("SELECT * FROM users WHERE room_code = ?", (code,))
    members = len(cur.fetchall())
    conn.close()
    return members >= max_members
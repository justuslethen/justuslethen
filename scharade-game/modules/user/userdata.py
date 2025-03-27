from modules.database import database
import random
from markupsafe import escape

    
def set_username(sid, username):
    username = escape(username)
    cur, conn = database.load_database()
    query = "UPDATE users SET username = ? WHERE sid = ?"
    cur.execute(query, (username, sid))
    conn.commit()
    conn.close()


def get_username(sid):
    cur, conn = database.load_database()
    query = "SELECT username FROM users WHERE sid = ?"
    cur.execute(query, (sid,))
    res = cur.fetchone()
    conn.close()
    return res[0] if res else None


def set_team_name(sid, team_name):
    cur, conn = database.load_database()
    old_team_name = get_users_team_name(cur, sid)
    pin = get_users_lobby_code(sid)
    
    # change every users team name with the old team name
    query = "UPDATE users SET team_name = ? WHERE lobby_code = ? and team_name = ?"
    cur.execute(query, (team_name, pin, old_team_name))
    
    conn.commit()
    conn.close()


# get the team name of the user
def get_users_team_name(cur, sid):
    query = "SELECT team_name FROM users WHERE sid = ?"
    cur.execute(query, (sid,))
    res = cur.fetchone()
    return res[0] if res else None


def get_users_from_lobby(pin):
    cur, conn = database.load_database()
    query = "SELECT sid, username FROM users WHERE valid = 1 AND lobby_code = ?"
    cur.execute(query, (pin,))
    response = cur.fetchall()
    conn.close()
    
    members = []
    for row in response:
        members.append({"sid": row[0], "username": row[1]})
        
    print(f"members: {members}")
    return members


def get_users_lobby_code(sid):
    cur, conn = database.load_database()
    query = "SELECT lobby_code FROM users WHERE sid = ?"
    cur.execute(query, (sid,))
    res = cur.fetchone()
    conn.close()
    return res[0] if res else None


def get_random_username():
    names = [
        "Cool Cat",
        "Funky Monkey",
        "Funny Goose",
        "Crazy Wizard",
        "Wild Ninja",
        "Happy Jester",
        "Lucky Hippo",
        "Crazy Zebra",
        "Jumping Bear",
        "Curious Quokka"
    ]
    return random.choice(names)


def create_new_user_row(sid):
    cur, conn = database.load_database()
    query = "INSERT INTO users (sid, username, valid, lobby_code, team_name, turns) VALUES (?, '', 1, '', 'hasNoTeamYet', 0)"
    cur.execute(query, (sid,))
    conn.commit()
    conn.close()


def remove_own_user_from_lobby_data(lobby_data, sid):
    username = get_username(sid)
    print(f"lobby_data: {lobby_data}")
    
    for team in lobby_data["teams"]:
        for member in team["members"]:
            if member == username:
                team["members"].remove(member)
                break
    
    return lobby_data


def update_sid_for_user(new_sid, old_sid):
    cur, conn = database.load_database()
    
    query = "UPDATE users SET sid = ?, valid = 1 WHERE sid = ?"
    cur.execute(query, (new_sid, old_sid))
    
    query = "UPDATE words SET user_sid = ? WHERE user_sid = ?"
    cur.execute(query, (new_sid, old_sid))
    
    query = "UPDATE rounds SET current_turn_user = ? WHERE current_turn_user = ?"
    cur.execute(query, (new_sid, old_sid))
    
    query = "UPDATE score SET user_sid = ? WHERE user_sid = ?"
    cur.execute(query, (new_sid, old_sid))
    
    conn.commit()
    conn.close()
    

def is_username_taken(pin, username):
    cur, conn = database.load_database()
    cur.execute("SELECT * FROM users WHERE username = ? AND lobby_code = ?", (username, pin,))
    return cur.fetchone()
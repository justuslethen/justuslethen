from flask import Blueprint, request, make_response
from modules import database
import random

permission_bp = Blueprint("permission", __name__)


@permission_bp.route("/data/create/permission-to-event/<event_id>", methods=["POST"])
def get_events(event_id):
    data = request.get_json()
    token = request.cookies.get("token")
    
    cur, conn = database.load()
    
    # create new permission
    access = check_access(cur, token, event_id, data["pin"])
    
    # create res with cockie
    res = make_response({"error": False if access else "no permission"})
    res.set_cookie("token", token, max_age=60*60*24*365*10)
    
    conn.commit()
    conn.close()
    return res


def build_new_token():
    cur, conn = database.load()
    token = create_random_token(cur)
    create_token_row(cur, token)
    
    conn.commit()
    conn.close()
    
    return token


def create_random_token(cur):
    string = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890abcdefghijklmnopqrstuvwxyz"
    token = ""
    
    token_exists = True
    
    # avoid creating a token that already exists
    while token_exists:
        # create random 20 char string
        for i in range(20):
            token += random.choice(string)
            
        token_exists = get_token(cur, token)
        
    return token


def get_token(cur, token):
    # select any if token exists
    cur.execute("SELECT token_id FROM tokens WHERE token = ?", (token,))
    res = cur.fetchone()
    return res[0] if res else False # return token_id


def create_token_row(cur, token):
    cur.execute("INSERT INTO tokens (token) VALUES (?)", (token,))
    
    return cur.lastrowid # return token_id


def check_event_permissions(event_id, pin):
    token = request.cookies.get("token") # get token from cockie
    token_existed = True
    
    cur, conn = database.load()
    
    # check if token exists in db
    if not get_token_id(cur, token):
        token = build_new_token()
        
        # return False for the function that has called to set a new cockie as res
        token_existed = False
    
    has_access = check_access(cur, token, event_id, pin)
    
    conn.commit()
    conn.close()
    
    return has_access, token_existed, token


def check_access(cur, token, event_id, pin):
    # check if user already has permissions
    if has_token_access_to_event(cur, token, event_id):
        return True
    
    # if entered pin is coreect give permissions
    elif check_pin(cur, event_id, pin):
        add_event_to_permissions(cur, token, event_id) # create new permissions row
        return True
        
    # if pin is empty give permissions
    elif not has_event_a_pin(cur, event_id):
        add_event_to_permissions(cur, token, event_id) # create new permissions row
        return True
    
    return False


def has_event_a_pin(cur, event_id):
    # select pin from event
    cur.execute("SELECT pin FROM main_events WHERE event_id = ?", (event_id))
    res = cur.fetchone()
    
    # return False if pin is empty ("") or pin was not found
    if res:
        return not res[0] == ""
    else:
        return False


def has_token_access_to_event(cur, token, event_id):
    token_id = get_token_id(cur, token)
    cur.execute("SELECT * FROM permissions WHERE token_id = ? AND event_id = ?", (token_id, event_id))
    res = cur.fetchone()
    
    return res[0] if res else False # when no res then False


def add_event_to_permissions(cur, token, event_id):
    token_id = get_token_id(cur, token)
    
    cur.execute("INSERT INTO permissions (token_id, event_id) VALUES (?, ?)", (token_id, event_id,))


def get_token_id(cur, token):
    print(f"token: {token}")
    cur.execute("SELECT token_id FROM tokens WHERE token = ?", (token,))
    res = cur.fetchone()
    
    return res[0] if res else False # when no res then False


def check_pin(cur, event_id, pin):
    # look for event with this pin and event_id
    cur.execute("SELECT * FROM main_events WHERE event_id = ? AND pin = ?", (event_id, pin))
    res = cur.fetchone()
    
    return res[0] if res else False # when no res then False
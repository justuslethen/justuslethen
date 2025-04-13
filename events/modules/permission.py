from flask import Blueprint
from modules import database
import random

permission_bp = Blueprint("permission", __name__)

def build_new_token():
    cur, conn = database.load()
    token = create_random_token(cur)
    create_token_row(cur, token)
    
    conn.commit()
    conn.close()


def create_random_token(cur):
    string = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890abcdefghijklmnopqrstuvwxyz"
    token = ""
    
    token_exists = True
    
    # avoid creating a token that already exists
    while token_exists:
        # create random 20 char string
        for i in range(20):
            token += random.choise(string)
            
        token_exists = get_token(cur, token)
        
    return token


def get_token(cur, token):
    # select any if token exists
    cur.execute("SELECT * FROM tokens WHERE token = ?", token)
    res = cur.fetchone()
    return res # return tuple


def create_token_row(cur, token):
    cur.execute("INSERT INTO tokens (token) VALUES (?)", (token))
    
    return cur.lastrowid # return token_id
from modules.database import database

def print_users_words():
    cur, conn = database.load_database()
    query = """
    SELECT words.word, words.user_sid, users.username
    FROM words
    INNER JOIN users ON words.user_sid = users.sid
    """
    cur.execute(query)
    rows = cur.fetchall()
    for word, user_sid, username in rows:
        print(f"{word} - {username}")
    
    conn.close()
    
print_users_words()
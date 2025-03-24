def does_username_exist(cur, username):
    cur.execute("SELECT user_id FROM users WHERE LOWER(username) = ?", (username.lower(),))
    res = cur.fetchall()
    
    if len(res) > 0:
        return True
    else:
        return False


def update_session_score(cur, user_id, number):
    query = """
    UPDATE score
    SET sessions = sessions + ?
    WHERE user_id = ?;
    """
    cur.execute(query, (number, user_id,))


def update_score(cur, user_id, value):
    column = ""
    if value == 1:
        column = "correct"
    else:
        column = "incorrect"
    
    query = f"""
    UPDATE score
    SET {column} = {column} + 1
    WHERE user_id = ?;
    """
    cur.execute(query, (user_id,))


def delete_user(cur, user_id):
    cur.execute("DELETE FROM learning_level WHERE user_id = ?", (user_id,))
    cur.fetchall()
    cur.execute("DELETE FROM tokens WHERE user_id = ?", (user_id,))
    cur.fetchall()
    cur.execute("DELETE FROM users WHERE user_id = ?", (user_id,))
    cur.fetchall()
    cur.execute("DELETE FROM score WHERE user_id = ?", (user_id,))
    cur.fetchall()
    

def get_user_list(cur):
    query = """
    SELECT username, user_id
    FROM users
    """
    cur.execute(query)
    res = cur.fetchall()
    users = []

    for i in res:
        user = {
            "username": i[0],
            "user_id": i[1],
        }
        users.append(user)

    print(f"cards: {users}")
    return users
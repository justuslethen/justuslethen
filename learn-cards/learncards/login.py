from learncards import encryption


def is_password_correct(cur, password, username):
    query = """
    SELECT user_id
    FROM users
    WHERE username = ? AND password = ?
    """
    
    hashed_password = encryption.hash_password(password)
    cur.execute(query, (username, hashed_password,))
    res = cur.fetchall()
    
    if len(res) == 1:
        return res[0][0]
    else:
        return False
from learncards import user_data, encryption


def registrate_new_user(cur, username, password):
    if user_data.does_username_exist(cur, username):
        print(f"username already exists {username}")
        return "username already exists"
    
    if len(password) < 6:
        print("short password")
        return "short password"
    
    create_new_user(cur, username, password)
    user_id = user_data.does_username_exist(cur, username)
    create_new_user_score(cur, user_id)
    
    return False


def create_new_user(cur, username, password):
    hashed_password = encryption.hash_password(password)
    
    query = """
    INSERT INTO users (username, password) 
    VALUES (?, ?)
    """

    cur.execute(query, (username, hashed_password))


def create_new_user_score(cur, user_id):
    query = """
    INSERT INTO score (user_id, correct, incorrect, sessions)
    VALUES (?, 0, 0, 0)
    """
    cur.execute(query, (user_id,))
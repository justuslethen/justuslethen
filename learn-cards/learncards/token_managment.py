import random


def new_login_token(cur, user_id):
    token = create_random_string(20)
    
    while does_token_exist(cur, token):
        token = create_random_string(20)

    query = """
        INSERT INTO tokens (user_id, token)
        VALUES (?, ?)
    """
    
    cur.execute(query, (user_id, token,))
    return token


def create_random_string(length):
    chars = "ABCDEFGHIJKLNMOPQRSTUVWXYZ1234567890"
    string = ""
    for _ in range(length):
        index = random.randint(0, len(chars) - 1)
        string += chars[index]
    return string


def does_token_exist(cur, token):
    query = f"""
        SELECT user_id 
        FROM tokens 
        WHERE token = '{token}';
    """
    
    cur.execute(query)
    response = cur.fetchall()

    if response:
        user_id = response[0][0]
        return user_id
    else:
        False


def delete_token(cur, token):
    print(f"cur: {cur}")

    query = """
    DELETE
    FROM tokens
    WHERE token = ?
    """

    cur.execute(query, (token,))
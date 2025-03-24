import html
import time
import math
from learncards import learn_session


def get_card_list(cur, userid):
    query = """
    SELECT COALESCE(u.username, 'deleted_user') as username, c.user_id, c.id, c.front, c.back, c.name
    FROM cards c
    LEFT JOIN users u ON c.user_id = u.user_id
    """

    cur.execute(query)
    res = cur.fetchall()

    cards = []

    for i in res:
        next_time_to_learn = get_time_until_next_learning(cur, userid, i[2]) if True else "Heute"
        card = {
            "username": i[0],
            "id": i[2],
            "name": i[5],
            "next_time_to_learn": next_time_to_learn,
        }
        cards.append(card)

    print(f"cards: {cards}")
    return cards


def add_card(cur, user_id, card_name, front, back):
    if does_card_name_exist(cur, card_name):
        return "name does already exist"
    
    query = """
    INSERT INTO cards (user_id, name, front, back) 
    VALUES (?, ?, ?, ?)
    """
    
    card_name = html.escape(card_name)
    front = html.escape(front)
    back = html.escape(back)
    
    cur.execute(query, (user_id, card_name, front, back))


def does_card_name_exist(cur, card_name):
    cur.execute("SELECT * FROM cards WHERE LOWER(name) = ?", (card_name.lower(),))
    res = cur.fetchall()
    
    if len(res) > 0:
        return True
    else:
        return False


def get_card(cur, card_id):
    print(f"get_card id: {card_id}")
    query = """
    SELECT name, front, back
    FROM cards
    WHERE id = ?
    """
    
    cur.execute(query, (card_id,))
    res = cur.fetchone()
    
    if res:
        data = {
            "name": res[0],
            "front": res[1],
            "back": res[2],
            "card_id": card_id,
        }
        return data
    else:
        return False


def get_next_and_last_card_id(cur, card_id):
    card_ids = get_all_card_ids(cur)
    print(f"card_ids: {card_ids}, card_id: {card_id}")
    index = 0
    last_card_id = 0
    next_card_id = 0
    
    for i in range(len(card_ids)):
        if int(card_ids[i]) == int(card_id):
            index = i
            break
    
    if not index == 0:
        last_card_id = card_ids[index - 1]
    else:
        last_card_id = card_ids[len(card_ids) - 1]
        
    if not index == len(card_ids) - 1:
        next_card_id = card_ids[index + 1]
    else:
        next_card_id = card_ids[0]
    
    return next_card_id, last_card_id



def get_all_card_ids(cur):
    cur.execute("SELECT id FROM cards")
    res = cur.fetchall()
    ids = []
    
    for i in res:
        ids.append(i[0])
    
    return ids


def get_time_until_next_learning(cur, user_id, card_id):
    next_time_to_learn = 0
    now = int(time.time() * 1000)
    
    query = """
    SELECT next_time_to_learn 
    FROM learning_level 
    WHERE user_id = ? AND card_id = ?
    """
    cur.execute(query, (user_id, card_id,))
    res = cur.fetchone()
    
    if res:
        next_time_to_learn = res[0]
    else:
        next_time_to_learn = now
    
    amount_of_time = next_time_to_learn - now
    return milliseconds_to_days(amount_of_time)


def milliseconds_to_days(milliseconds):
    if milliseconds <= 0:
        return "Heute"
    
    milliseconds_per_day = 24 * 60 * 60 * 1000
    days = milliseconds / milliseconds_per_day
    days_rounded = math.ceil(days)
    
    if days_rounded == 1:
        return f"{days_rounded} Tag"
    else:
        return f"{days_rounded} Tage"


def delete_card(cur, card_id):
    cur.execute("DELETE FROM cards WHERE id = ?", (card_id,))
    cur.fetchall()
    
    cur.execute("DELETE FROM learning_level WHERE card_id = ?", (card_id,))
    cur.fetchall()
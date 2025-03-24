from learncards import token_managment, render, user_data
import time
import datetime
import random
from flask import redirect

day = 60 * 60 * 24 * 1000
week = 60 * 60 * 24 * 7 * 1000
# minute = 60 * 1000

time_periods = [day, day, day * 2, day * 3, day * 4, week * 2, week * 6, week * 25]
#time_periods = [minute * 10, day / 4, day, day * 3, week, week * 2, week * 6, week * 25]
# time_periods = [minute / 12, minute / 5, minute, minute, minute, minute, minute, minute]


def create_new_session(cur, user_id):
    key = create_new_key(cur, user_id, 0, False)
    user_data.update_session_score(cur, user_id, 1)
    return key


def create_new_session_keys(cur, user_id):
    card_id = next_card_to_learn_id(cur, user_id)
    create_learning_level(cur, user_id, card_id)
    incorrect_guess_key = create_new_key(cur, user_id, card_id, False)
    correct_guess_key = create_new_key(cur, user_id, card_id, True)
    return incorrect_guess_key, correct_guess_key


def next_card_to_learn_id(cur, user_id):
    cur.execute("SELECT id FROM cards")
    res = cur.fetchall()

    cards = make_cards_array_from_res(cur, user_id, res)
    next_card = min(cards, key=lambda x: x["next_time_to_learn"])
    now = int(time.time() * 1000)
    
    if next_card["next_time_to_learn"] <= now:
        return next_card["id"]
    else:
        # get_cards_by_level(cards, lowest_level)
        if not is_todays_session_finished(cur, user_id):
            return False
        card = get_radnom_object_from_array(cards)
        return card["id"]


def get_cards_by_level(cards, level):
    final_cards = []
    for card in cards:
        if card["level"] == level:
            final_cards.append(card)
    
    return final_cards


def get_radnom_object_from_array(array):
    index = random.randint(0, len(array) - 1)
    return array[index]


def make_cards_array_from_res(cur, user_id, res):
    cards = []
    for i in res:
        next_time_to_learn = 0
        last_learned = 0
        level = 0
        card_id = i[0]
        found_time, found_last_learned, found_level = get_learning_level_data(cur, user_id, card_id)
        if found_time != False or found_time != 0:
            next_time_to_learn = found_time
            last_learned = found_last_learned
            level = found_level
        cards.append({
            "id": card_id,
            "next_time_to_learn": next_time_to_learn,
            "last_learned": last_learned,
            "level": level,
        })
    return cards


def create_new_key(cur, user_id, card_id, value):
    key = token_managment.create_random_string(10)
    while does_session_key_exist(cur, key):
        key = token_managment.create_random_string(10)
    
    query = """
    INSERT INTO session_keys (user_id, card_id, value, key) 
    VALUES (?, ?, ?, ?)
    """

    cur.execute(query, (user_id, card_id, value, key))
    return key


def does_session_key_exist(cur, key):
    cur.execute("SELECT user_id FROM session_keys WHERE key = ?;", (key,))
    res = cur.fetchone()
    
    if res:
        return res[0]
    else:
        return False


def next_card(cur, user_id, key):
    key_user_id = does_session_key_exist(cur, key)
    
    if not user_id == key_user_id:
        key = create_new_session(cur, user_id)
        return redirect(f"/learn-session/{key}")

    update_learning_level(cur, user_id, key)
    card_id = next_card_to_learn_id(cur, user_id)
    delete_old_session_keys(cur, user_id, card_id)
    if card_id:
        incorrect_guess_key, correct_guess_key = create_new_session_keys(cur, user_id)
        return render.render_learn_card_view(cur, card_id, incorrect_guess_key, correct_guess_key)
    else:
        return redirect("/learn-session-finished")


def update_learning_level(cur, user_id, key):
    cur.execute("SELECT value, card_id FROM session_keys WHERE key = ? AND user_id = ?;", (key, user_id,))
    res = cur.fetchone()
    
    value = res[0]
    card_id = res[1]
    print(f"card_id: {card_id}")
    
    if card_id is not 0:
        print(f"card_id is valid")
        level = get_card_level(cur, user_id, card_id)
        is_reached = is_next_learn_time_reached(cur, user_id, card_id)
        if value == 0:
            level = 0
            update_next_time_to_learn(cur, user_id, card_id, level)
            
        if is_reached:
            if value == 1:
                level += 1
            update_next_time_to_learn(cur, user_id, card_id, level)

        user_data.update_score(cur, user_id, value)
        set_new_card_level(cur, user_id, card_id, level)
        update_last_learned(cur, user_id, card_id)
        write_learn_data(cur, user_id, card_id, value)
    return card_id


def get_card_level(cur, user_id, card_id):
    query = """
    SELECT level
    FROM learning_level
    WHERE user_id = ? AND card_id = ?;
    """
    cur.execute(query, (user_id, card_id,))
    res = cur.fetchall()
    
    if res:
        return res[0][0]
    else:
        return False


def set_new_card_level(cur, user_id, card_id, level):
    query = """
    UPDATE learning_level 
    SET level = ? 
    WHERE user_id = ? AND card_id = ?;
    """
    cur.execute(query, (level, user_id, card_id))


def delete_old_session_keys(cur, user_id, card_id):
    query = """
    DELETE FROM session_keys
    WHERE user_id = ? AND NOT card_id = ?;
    """
    cur.execute(query, (user_id, card_id,))
    cur.fetchall()


def is_next_learn_time_reached(cur, user_id, card_id):
    query = """
    SELECT next_time_to_learn
    FROM learning_level
    WHERE user_id = ? AND card_id = ?;
    """
    
    cur.execute(query, (user_id, card_id,))
    res = cur.fetchone()
    
    if res:
        next_time_to_learn = res[0]
        now = int(time.time() * 1000)
    
        if next_time_to_learn <= now:
            return True
        else:
            return False
    else:
        return True


def update_last_learned(cur, user_id, card_id):
    now = int(time.time() * 1000)
    query = """
    UPDATE learning_level
    SET last_learned = ?
    WHERE user_id = ? AND card_id = ?;
    """
    cur.execute(query, (now, user_id, card_id,))


def update_next_time_to_learn(cur, user_id, card_id, level):
    next_time_to_learn = calc_next_time_to_learn(level)
    now = int(time.time() * 1000)
    query = """
    UPDATE learning_level
    SET next_time_to_learn = ?,
        last_learned = ?
    WHERE user_id = ? AND card_id = ?;
    """
    cur.execute(query, (next_time_to_learn, now, user_id, card_id,))


def calc_next_time_to_learn(level):
    tomorrow = get_the_next_day()
    date = 0
    if level == 0:
        date = tomorrow + time_periods[0]
    if level == 1:
        date = tomorrow + time_periods[1]
    elif level == 2:
        date = tomorrow + time_periods[2]
    elif level == 3:
        date = tomorrow + time_periods[3]
    elif level == 4:
        date = tomorrow + time_periods[4]
    elif level == 5:
        date = tomorrow + time_periods[5]
    elif level == 6:
        date = tomorrow + time_periods[6]
    elif level == 7:
        date = tomorrow + time_periods[7]
    else:
        date = tomorrow
    
    return date


def get_the_next_day():
    current_time = time.time()
    current_date = datetime.datetime.fromtimestamp(current_time)
    next_day = (current_date + datetime.timedelta(days=1)).replace(hour=0, minute=0, second=0, microsecond=0)
    next_day_timestamp = next_day.timestamp()
    next_day_milliseconds = int(next_day_timestamp * 1000)
    return next_day_milliseconds


def create_learning_level(cur, user_id, card_id):
    cur.execute("SELECT * FROM learning_level WHERE user_id = ? AND card_id = ?", (user_id, card_id,))
    res = cur.fetchone()
    now = int(time.time() * 1000)
    
    if not res:
        query = """
        INSERT INTO learning_level (user_id, card_id, level, last_learned, next_time_to_learn) 
        VALUES (?, ?, ?, ?, ?)
        """
        cur.execute(query, (user_id, card_id, 0, now, now,))


def get_learning_level_data(cur, user_id, card_id):
    query = """
    SELECT next_time_to_learn, last_learned, level
    FROM learning_level
    WHERE user_id = ? AND card_id = ?
    """
    cur.execute(query, (user_id, card_id,))
    res = cur.fetchone()
    if res:
        return res[0], res[1], res[2]
    else:
        return False, False, False


def get_today():
    current_date = datetime.datetime.now().date()
    return int(time.mktime(current_date.timetuple()) * 1000)


def write_learn_data(cur, user_id, card_id, value):
    level = get_card_level(cur, user_id, card_id)
    now = int(time.time() * 1000)
    today = get_today()
    query = """
    INSERT INTO learn_data (user_id, card_id, date, day, value, level)
    VALUES (?, ?, ?, ?, ?, ?)
    """

    cur.execute(query, (user_id, card_id, now, today, value, level))


def is_todays_session_finished(cur, user_id):
    today = get_today()
    query = """
    SELECT *
    FROM finished_lessons
    WHERE user_id = ? AND day = ?;
    """
    cur.execute(query, (user_id, today))
    res = cur.fetchall()
    
    if res:
        return True
    else:
        query = """
        INSERT INTO finished_lessons (user_id, day)
        VALUES (?, ?)
        """
        cur.execute(query, (user_id, today,))
        return False
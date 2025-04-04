import time
import random
from modules.database import database
from modules.lobby import lobby
from modules.user import userdata


def start_game(pin, sid):
    cur, conn = database.load_database()
    team_name, sid = random_players_turn(cur, pin)

    round_number = get_round_number(cur, pin)
    create_new_round_for_user(cur, pin, round_number)
    conn.commit()
    conn.close()

    game_data = get_game_data(pin, sid)

    return game_data


def next_player(pin, sid):
    cur, conn = database.load_database()
    team_name, sid = random_players_turn(cur, pin)

    round_number = get_round_number(cur, pin)
    create_new_round_for_user(cur, pin, round_number)
    conn.commit()

    game_data = get_game_data(pin, sid)
    conn.close()

    return game_data


def random_players_turn(cur, pin):
    
    print("random_players_turn was called")
    
    team_with_least_turns = get_team_with_least_turns(cur, pin)
    cur.execute(
        "SELECT team_name, sid, turns FROM users WHERE lobby_code = ? AND team_name = ? ORDER BY turns ASC LIMIT 1",
        (pin, team_with_least_turns),
    )
    selected_player = cur.fetchone()

    return selected_player[0], selected_player[1]


def get_team_with_least_turns(cur, pin):
    query = "SELECT team_name, turns from users WHERE lobby_code = ?"
    cur.execute(query, (pin,))
    teams = cur.fetchall()
    team_turns = []
    for team in teams:
        team_exists = False
        for team_turn in team_turns:
            if team_turn["team_name"] == team[0]:
                team_turn["turns"] += team[1]
                team_exists = True
                break
        if not team_exists:
            team_turns.append({"team_name": team[0], "turns": team[1]})
    return min(team_turns, key=lambda x: x["turns"])["team_name"]


def get_turns_from_player(cur, pin):
    cur.execute("SELECT turns FROM users WHERE lobby_code = ?", (pin,))
    players = cur.fetchall()

    return players


def get_random_word(cur, pin):
    cur.execute(
        "SELECT word FROM words WHERE lobby_code = ? AND round = (SELECT MIN(round) FROM words WHERE lobby_code = ?)",
        (pin, pin),
    )
    words = cur.fetchall()
    if not words:
        return False
    new_word = random.choice(words)[0]
    return new_word


def get_game_data(pin, sid):
    cur, conn = database.load_database()
    query = """
    SELECT time_left_at_start, round, current_turn_user, current_turn_team, round_started
    FROM rounds
    WHERE lobby_code = ?
    ORDER BY rowid DESC
    LIMIT 1
    """
    cur.execute(query, (pin,))
    result = cur.fetchone()

    if not result:
        conn.close()
        return None

    round_time = get_round_time(cur, pin)
    game_data = format_game_data(result, round_time)
    game_data["teamsscore"] = get_teams_total_score(cur, pin)
    game_data["isroundrunning"] = is_round_still_running(cur, pin)
    game_data["islastword"] = check_if_is_last_word(cur, pin)
    conn.close()

    # defining is_own_turn bfor the client
    game_data["isownturn"] = game_data["currentturnuser"] == userdata.get_username(sid)

    return game_data


def format_game_data(result, round_time):
    time_left_at_start, round, current_turn_sid, current_turn_team, round_started = (
        result
    )
    current_turn_user = userdata.get_username(current_turn_sid)
    return {
        "currentturnuser": current_turn_user,
        "isownturn": False,  # This should be set based on the current user's SID, which is not provided here
        "currentturnteam": current_turn_team,
        "round": round,
        "roundstarted": round_started,
        "timeleftatstart": time_left_at_start if True else round_time,
    }


def get_round_number(cur, pin):
    query = """
    SELECT MIN(round)
    FROM words
    WHERE lobby_code = ?
    """
    cur.execute(query, (pin,))
    result = cur.fetchone()

    return result[0] if result[0] is not None else 1


def get_all_team_names(cur, pin):
    cur.execute("SELECT DISTINCT team_name FROM users WHERE lobby_code = ?", (pin,))
    res = cur.fetchall()
    return [i[0] for i in res if i[0] is not None]


def get_teams_total_score(cur, pin):
    teams = get_all_team_names(cur, pin)
    teams_score = []

    for team in teams:
        cur.execute(
            "SELECT COUNT(*) as score FROM score WHERE lobby_code = ? AND team = ?",
            (pin, team),
        )
        score = cur.fetchone()
        teams_score.append(
            {
                "teamname": team,
                "score": score[0] if score and score[0] is not None else 0,
                "members": get_team_members(cur, pin, team),
            }
        )

    # Sorting by score in descending order
    teams_score.sort(key=lambda x: x["score"], reverse=True)

    return teams_score


def get_team_members(cur, pin, team_name):
    cur.execute(
        "SELECT username FROM users WHERE team_name = ? AND lobby_code = ?",
        (
            team_name,
            pin,
        ),
    )
    res = cur.fetchall()

    return [i[0] for i in res] if res else []


def get_round_time(cur, pin):
    query = """
    SELECT round_time
    FROM lobbies
    WHERE code = ?
    """
    cur.execute(query, (pin,))
    result = cur.fetchone()

    return result[0] if result else 0


def create_new_round_for_user(cur, pin, round_number):
    team_name, random_user_sid = whos_turn_now(cur, pin)
    time_left_at_start = get_round_time(cur, pin) + get_missed_time_last_round(
        cur, pin, team_name
    )
    
    print(f"user_sid: {random_user_sid}")
    print(f"team_name: {team_name}")
    
    query = """
    INSERT INTO rounds 
    (round, 
    current_turn_user, 
    current_turn_team,
    time_left_at_start, 
    time_left_at_end,
    round_started,
    lobby_code)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    """
    cur.execute(
        query, (round_number, random_user_sid, team_name, time_left_at_start, 0, 0, pin)
    )
    cur.execute(
        "UPDATE users SET turns = turns + 1 WHERE lobby_code = ? AND sid = ?",
        (
            pin,
            random_user_sid,
        ),
    )
    return cur.lastrowid, random_user_sid


def get_missed_time_last_round(cur, pin, team_name):
    query = """
    SELECT time_left_at_end
    FROM rounds
    WHERE lobby_code = ? AND current_turn_team = ?
    ORDER BY rowid DESC
    """
    cur.execute(query, (pin, team_name))
    res = cur.fetchone()

    print(f"missde_time: {res}")

    return res[0] if res else 0


def start_round(pin, sid):
    cur, conn = database.load_database()

    # Mark the round with the start time
    start_new_round_for_user(cur, pin, sid)
    conn.commit()
    conn.close()


def start_new_round_for_user(cur, pin, sid):
    now = round(time.time() * 1000)

    query = """
    UPDATE rounds 
    SET round_started = ? 
    WHERE rowid = (
        SELECT rowid FROM rounds 
        WHERE lobby_code = ? AND current_turn_user = ?
        ORDER BY rowid DESC 
        LIMIT 1
    );
    """
    cur.execute(query, (now, pin, sid))


def guessed_word_correctly(cur, pin, sid, word, round_number, team_name):
    new_round = round_number + 1
    query = "UPDATE words SET round = round + 1 WHERE lobby_code = ? AND word = ?"
    cur.execute(query, (pin, word))  # update the word for the next round

    if word is not None:
        query = "INSERT INTO score (lobby_code, round_number, team, score, user_sid, word) VALUES (?, ?, ?, ?, ?, ?)"
        cur.execute(query, (pin, round_number, team_name, 1, sid, word))


def check_if_is_last_word(cur, pin):
    query = "SELECT COUNT(*) FROM words WHERE lobby_code = ? AND round = (SELECT MIN(round) FROM words WHERE lobby_code = ?)"
    cur.execute(query, (pin, pin))
    result = cur.fetchone()

    last_word = result[0] < 2 if result else False

    return last_word


def next_round(pin):
    cur, conn = database.load_database()

    # Mark the round with the end time
    round_number = get_round_number(cur, pin)
    
    sid = create_new_round_for_user(cur, pin, round_number)[1]

    # Start a new round
    start_new_round_for_user(cur, pin, sid)

    conn.commit()
    conn.close()

    return get_game_data(pin, sid)


def whos_turn_now(cur, pin):
    print("whos_turn_now was called")
    team_name, sid = has_player_time_left(cur, pin)
    if sid:
        return team_name, sid
        
    team_name, sid = random_players_turn(cur, pin)
    return team_name, sid


def has_player_time_left(cur, pin):
    
    print("has_player_time_left was called")
    
    # select the most recent round and check if time_left_at_end is greater than 0
    query = """
    SELECT current_turn_user, time_left_at_end, current_turn_team
    FROM rounds
    WHERE lobby_code = ?
    ORDER BY rowid DESC
    LIMIT 1
    """
    cur.execute(query, (pin,))
    res = cur.fetchone()

    if res and res[1] > 0:
        print(f"user {res[0]} has time left: {res[1]}")
        return res[2], res[0]  # return the sid (current_turn_user)
    
    print(f"user {res[0] if res else False} has no time left")
    return None, None  # return None if time_left_at_end is not greater than 0


def get_team_scores_for_rounds(pin):
    cur, conn = database.load_database()
    results = fetch_team_scores(cur, pin)
    conn.close()
    return process_team_scores(results)


def fetch_team_scores(cur, pin):
    query = """
    SELECT round_number, team, SUM(score) as total_score
    FROM score
    WHERE lobby_code = ?
    GROUP BY round_number, team
    ORDER BY round_number ASC
    """
    cur.execute(query, (pin,))
    return cur.fetchall()


def process_team_scores(results):
    rounds_scores = []
    current_round = None
    round_scores = []

    for result in results:
        round, team, score = result
        if current_round is None:
            current_round = round

        if round != current_round:
            rounds_scores.append(round_scores)
            round_scores = []
            current_round = round

        round_scores.append({"team_name": team, "score": score})

    if round_scores:
        rounds_scores.append(round_scores)

    return rounds_scores


def is_game_over(pin):
    cur, conn = database.load_database()
    max_rounds = lobby.get_max_rounds(cur, pin)
    query = "SELECT MIN(round) FROM words WHERE lobby_code = ?"
    cur.execute(query, (pin,))
    round_number = cur.fetchone()[0]

    conn.close()

    if not round_number:
        round_number = 0

    return round_number >= max_rounds


# get the countdown data for current round for clients
def get_countdown(cur, pin):
    # get the time the user has at start of the round
    # get the date the round has started
    cur.execute(
        "SELECT time_left_at_start, round_started FROM rounds WHERE lobby_code = ? ORDER BY rowid DESC LIMIT 1",
        (pin,),
    )
    res = cur.fetchone()

    if not res:
        return 0, 0

    round_started = res[1]

    return res[0], round_started


def is_round_still_running(cur, pin):
    cur.execute(
        """
        SELECT round_started, time_left_at_start 
        FROM rounds 
        WHERE lobby_code = ? 
        ORDER BY rowid DESC 
        LIMIT 1
    """,
        (pin,),
    )

    result = cur.fetchone()
    if not result:
        return False

    round_started, time_left_at_start = result
    if round_started is None or time_left_at_start is None:
        return False

    current_time = round(time.time() * 1000)

    return current_time < round_started + time_left_at_start * 1000


def set_lost_time(pin):
    cur, conn = database.load_database()
    time_left_at_start, round_started = get_countdown(cur, pin)
    
    now = round(time.time() * 1000)
    elapsed = now - round_started
    missed_time = round(time_left_at_start - elapsed / 1000) 
    print(f"missed_time: {missed_time}")

    cur.execute(
        """UPDATE rounds 
        SET time_left_at_end = ? 
        WHERE rowid = (
            SELECT rowid FROM rounds 
            WHERE lobby_code = ? 
            ORDER BY rowid DESC 
            LIMIT 1
        )""",
        (missed_time, pin),
    )
    conn.commit()
    conn.close()

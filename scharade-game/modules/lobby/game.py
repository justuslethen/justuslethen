import time
import random
from modules.database import database
from modules.lobby import lobby
from modules.user import userdata


def start_game(pin, sid):
    cur, conn = database.load_database()
    team_name, sid = random_players_turn(cur, pin)
    
    round_number = get_round_number(cur, pin)
    create_new_round_for_user(cur, pin, sid, round_number)
    conn.commit()
    conn.close()
    
    game_data = get_game_data(pin, sid)
    
    return game_data


def next_player(pin, sid):
    cur, conn = database.load_database()
    team_name, sid = random_players_turn(cur, pin)
    
    round_number = get_round_number(cur, pin)
    create_new_round_for_user(cur, pin, sid, round_number)
    conn.commit()
    
    game_data = get_game_data(pin, sid)
    conn.close()
    
    return game_data


def random_players_turn(cur, pin):
    team_with_least_turns = get_team_with_least_turns(cur, pin)
    cur.execute("SELECT team_name, sid, turns FROM users WHERE lobby_code = ? AND team_name = ? ORDER BY turns ASC LIMIT 1", (pin, team_with_least_turns))
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
    cur.execute("SELECT word FROM words WHERE lobby_code = ? AND round = (SELECT MIN(round) FROM words WHERE lobby_code = ?)", (pin, pin))
    words = cur.fetchall()
    if not words:
        return False
    new_word = random.choice(words)[0]
    return new_word


def get_game_data(pin, sid):
    print(f"get_game_data pin: {pin}")
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
    print(f"round: {game_data['round']}")
    game_data["teamsscore"] = get_teams_total_score(cur, pin)
    game_data["islastword"] = check_if_is_last_word(cur, pin)
    conn.close()
    
    # defining is_own_turn bfor the client
    game_data["isownturn"] = game_data["currentturnuser"] == userdata.get_username(sid)
    
    return game_data


def format_game_data(result, round_time):
    time_left_at_start, round, current_turn_sid, current_turn_team, round_started = result
    current_turn_user = userdata.get_username(current_turn_sid)
    return {
        "currentturnuser": current_turn_user,
        "isownturn": False,  # This should be set based on the current user's SID, which is not provided here
        "currentturnteam": current_turn_team,
        "round": round,
        "roundstarted": round_started,
        "timeleftatstart": time_left_at_start if True else round_time
    }


def get_round_number(cur, pin):
    print(f"get_round_number pin: {pin}")
    query = """
    SELECT MIN(round)
    FROM words
    WHERE lobby_code = ?
    """
    cur.execute(query, (pin,))
    result = cur.fetchone()
    print(f"max round result: {result}")
    
    return result[0] if result[0] is not None else 1


def get_teams_total_score(cur, pin):
    teams = lobby.get_team_users(cur, pin)
    for team in teams:
        # count words and add as score to team
        query = """
        SELECT SUM(score)
        FROM score
        WHERE team = ?
        """
        cur.execute(query, (team['team_name'],))
        result = cur.fetchone()
        team['score'] = result[0] if result else 0
    
    print(f"teams score: {teams}")
    teams.sort(key=lambda x: x['score'] if x['score'] is not None else 0, reverse=True)
    return teams


def get_round_time(cur, pin):
    query = """
    SELECT round_time
    FROM lobbies
    WHERE code = ?
    """
    cur.execute(query, (pin,))
    result = cur.fetchone()
    
    return result[0] if result else None


def create_new_round_for_user(cur, pin, sid, round_number):
    print(f"pin: {pin}")
    team_name, random_user_sid = random_players_turn(cur, pin)
    time_left_at_start = get_round_time(cur, pin) + get_missed_time_last_round(cur, pin, team_name)
    round_time = get_round_time(cur, pin)
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
    cur.execute(query, (round_number, random_user_sid, team_name, round_time, time_left_at_start, 0, pin))
    cur.execute("UPDATE users SET turns = turns + 1 WHERE lobby_code = ? AND sid = ?", (pin, sid,))
    return cur.lastrowid


def get_missed_time_last_round(cur, pin, team_name):
    query = """
    SELECT time_left_at_end
    FROM rounds
    WHERE lobby_code = ? AND current_turn_team = ?
    ORDER BY rowid DESC
    """
    cur.execute(query, (pin, team_name))
    result = cur.fetchone()
    
    return result[0] if result else 0


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
    cur.execute(query, (pin, word)) # update the word for the next round
    
    if word is not None:
        query = "INSERT INTO score (lobby_code, round_number, team, score, user_sid, word) VALUES (?, ?, ?, ?, ?, ?)"
        cur.execute(query, (pin, round_number, team_name, 1, sid, word))


def check_if_is_last_word(cur, pin):
    query = "SELECT COUNT(*) FROM words WHERE lobby_code = ? AND round = (SELECT MIN(round) FROM words WHERE lobby_code = ?)"
    cur.execute(query, (pin, pin))
    result = cur.fetchone()
    
    last_word = result[0] < 2 if result else False
    
    print(f"last_word: {last_word}")
    
    return last_word


def next_round(pin):
    cur, conn = database.load_database()
    
    # Mark the round with the end time
    round_number = get_round_number(cur, pin)
    
    team_name, sid = random_players_turn(cur, pin)
    create_new_round_for_user(cur, pin, sid, round_number)
    
    # Start a new round
    start_new_round_for_user(cur, pin, sid)
    
    conn.commit()
    conn.close()
    
    return get_game_data(pin, sid)


def get_team_scores_for_rounds(pin):
    cur, conn = database.load_database()
    results = fetch_team_scores(cur, pin)
    conn.close()
    return process_team_scores(results)


def fetch_team_scores(cur, pin):
    query = """
    SELECT round, team, SUM(score) as total_score
    FROM score
    WHERE lobby_code = ?
    GROUP BY round, team
    ORDER BY round ASC
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
    return round_number or 0 >= max_rounds
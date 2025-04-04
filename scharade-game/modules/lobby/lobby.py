from modules.database import database
import random
from markupsafe import escape
from modules.user import userdata


def create_new_lobby(sid, config_data):
    cur, conn = database.load_database()
    try:
        check_config_data(config_data) # checking for empty inputs or too low config numbers
    except ValueError as e:
        # return the error to the client
        return str(e), None
    
    pin = generate_lobby_code(cur) # random 6 digit number
    host_code = generate_host_code(cur) # random 6 letter string
    
    query = """
    INSERT INTO lobbies 
    (code, name, number_of_rounds, number_of_teams, round_time, host_sid, host_code, page)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'players')
    """
    cur.execute(query,(
            pin,
            escape(config_data["lobbyname"]),
            config_data["numberofrounds"],
            config_data["numberofteams"],
            config_data["roundtime"],
            sid,
            host_code,
        ),)
    lobby_data = get_lobby_data(cur, pin, sid) # get the data of the lobby
    
    conn.commit()
    conn.close()

    return lobby_data, host_code


def get_lobby_data(cur, pin, sid):
    print(f"get_lobby_data pin: {pin}")
    query = """
    SELECT code, name, number_of_rounds, number_of_teams, round_time, host_sid, page
    FROM lobbies 
    WHERE code = ?
    """
    cur.execute(query, (pin,))
    result = cur.fetchone()
    # compile the response to a json to send it to the client
    data = compile_lobby_data_to_json(result)
    data["teams"] = get_team_users(cur, pin)
    data["playersid"] = sid
    data["words"] = get_players_added_words(cur, sid)
    
    return data


def get_players_added_words(cur, sid):
    query = "SELECT word FROM words WHERE user_sid = ?"
    cur.execute(query, (sid,))
    result = cur.fetchall()
    return [row[0] for row in result]


def compile_lobby_data_to_json(response):
    if not response:
        return None
    return {
        "lobbycode": response[0],
        "lobbyname": response[1],
        "numberofrounds": response[2],
        "numberofteams": response[3],
        "roundtime": response[4],
        "hostsid": response[5],
        "page": response[6]
    }


def get_team_users(cur, pin):
    response = get_users_from_lobby(cur, pin)
    teams = []
    for row in response:
        print(f"row: {row}")
        if row[1] not in [team["teamname"] for team in teams]: # Check if the team is already in the list
            # add if not in list
            teams.append({"teamname": row[1], "members": []})
            
        # Iterate over the teams to find the correct team
        for team in teams:
            if team["teamname"] == row[1]:
                # Add the member to the team
                team["members"].append(row[0])
                
    print(f"teams: {teams}")
    # Return the list of teams with their members
    return teams if True else []


def get_users_from_lobby(cur, pin):
    query = """
    SELECT username, team_name
    FROM users 
    WHERE lobby_code = ?
    """
    cur.execute(query, (pin,))
    return cur.fetchall()


def check_config_data(config_data):
    if not config_data["lobbyname"] or config_data["lobbyname"] == "":
        raise ValueError("lobbyname not set")
    
    if not config_data["numberofrounds"] or config_data["numberofrounds"] == 0:
        raise ValueError("numberofrounds not set")
    
    if not config_data["numberofteams"] or config_data["numberofteams"] <= 1:
        raise ValueError("numberofteams too low")
    
    if not config_data["roundtime"] or config_data["roundtime"] == 0:
        raise ValueError("roundtime not set")


def join_user_in_lobby(sid, pin):
    cur, conn = database.load_database()
    print(f"pin: {pin}, sid: {sid}")

    # check if lobby exists
    if not check_if_lobby_exists(cur, pin):
        return None

    # if lobby exists, add user to lobby
    query = "UPDATE users SET lobby_code = ? WHERE sid = ?"
    cur.execute(query, (pin, sid))
    
    put_user_in_team(cur, pin, sid)
    
    conn.commit()
    
    # get the game data of the lobby
    lobby_data = get_lobby_data(cur, pin, sid)
    
    conn.close()
    return lobby_data


def put_user_in_team(cur, code, sid):
    max_teams = get_max_teams(cur, code)
    teams = get_teams_counter(cur, code)
    team_name = ""
    
    # Filter out teams with the name "hasNoTeamYet"
    teams = [team for team in teams if team["teamname"] != "hasNoTeamYet"]
    
    if len(teams) < max_teams:
        # Create a new team if the maximum number of teams is not reached
        team_name = f"Team {len(teams) + 1}"
    else:
        # Find the team with the least members
        team_name = min(teams, key=lambda team: team["members"])["teamname"]
    
    # Put the user in the team
    query = "UPDATE users SET team_name = ? WHERE sid = ?"
    cur.execute(query, (team_name, sid,))


def get_max_teams(cur, code):
    query = "SELECT number_of_teams FROM lobbies WHERE code = ?"
    cur.execute(query, (code,))
    result = cur.fetchone()
    return result[0]


def get_teams_counter(cur, code):
    query = "SELECT team_name FROM users WHERE lobby_code = ? AND valid = 1"
    cur.execute(query, (code,))
    result = cur.fetchall()
    teams = []
    
    for row in result:
        team_name = row[0]
        
        print(f"team_name: {team_name}")
        
        # Dont count users without team
        if team_name is not "hasNoTeamYet":
            team_element = next((team for team in teams if team["teamname"] == team_name), None)
            print(f"team_element: {team_element}")
            if team_element:
                team_element["members"] += 1
            else:
                teams.append({"teamname": team_name, "members": 1})
    
    return teams


# looks for lobby with the given code returns True or False
def check_if_lobby_exists(cur, code):
    query = "SELECT * FROM lobbies WHERE code = ?"
    cur.execute(query, (code,))
    result = cur.fetchone()
    return result is not None


def generate_lobby_code(cur):
    code = ""
    exists = True
    # generate new while code already exists
    while exists or code[0] == "0":
        code = "{:06d}".format(random.randint(0, 999999))
        exists = check_if_lobby_exists(cur, code)
    
    return code


def generate_host_code(cur):
    code = ""
    exists = True
    # generate new while code already exists
    while exists:
        # pick a random letter 6 times
        for _ in range(6):
            code += random.choice("ABCDEFGHIJKLMNOPQRSTUVWXYZ")
        exists = check_if_host_code_exists(cur, code)

    return code


def check_if_host_code_exists(cur, code):
    query = "SELECT code FROM lobbies WHERE host_code = ?"
    cur.execute(query, (code,))
    result = cur.fetchone()
    return result[0] if result else None


def add_word_to_list(word, pin, sid):
    word = escape(word)
    cur, conn = database.load_database()
    query = "INSERT INTO words (word, lobby_code, user_sid, round) VALUES (?, ?, ?, 1)"
    cur.execute(query, (word, pin, sid))
    conn.commit()
    conn.close()


def write_page_to_database(pin, page):
    cur, conn = database.load_database()
    query = "UPDATE lobbies SET page = ? WHERE code = ?"
    cur.execute(query, (page, pin))
    conn.commit()
    conn.close()


def foward_as_host(host_code, sid):
    cur, conn = database.load_database()
    
    # delete new created user cause its not needed anymore
    query = "DELETE FROM users WHERE sid = ?"
    cur.execute(query, (sid,))
    
    # get the sid of the host
    query = "SELECT host_sid, code FROM lobbies WHERE host_code = ?"
    cur.execute(query, (host_code,))
    response = cur.fetchone()
    old_sid = response[0]
    lobby_code = response[1]
    
    # set the new sid of the host in the lobby
    query = "UPDATE lobbies SET host_sid = ? WHERE host_code = ?"
    cur.execute(query, (sid, host_code))
    
    conn.commit()
    conn.close()
    
    userdata.update_sid_for_user(sid, old_sid)
    return lobby_code


def forward_as_player(sid, old_sid):
    cur, conn = database.load_database()
    
    # get the lobby code of the user
    query = "SELECT lobby_code FROM users WHERE sid = ?"
    cur.execute(query, (old_sid,))
    result = cur.fetchone()
    pin = result[0] if result else None
    
    # delete new created user cause its not needed anymore
    query = "DELETE FROM users WHERE sid = ?"
    cur.execute(query, (sid,))
    
    conn.commit()
    conn.close()
    
    userdata.update_sid_for_user(sid, old_sid)
    return pin


def get_max_rounds(cur, pin):
    query = "SELECT number_of_rounds FROM lobbies WHERE code = ?"
    cur.execute(query, (pin,))
    result = cur.fetchone()
    return result[0] if result else 1


def remove_user_from_lobby(user_to_remove, pin):
    cur, conn = database.load_database()
    print(f"remove_user_from_lobby: {user_to_remove}, {pin}")
    cur.execute("UPDATE users SET lobby_code = '', team_name = '' WHERE username = ? AND lobby_code = ?", (user_to_remove, pin,))
    
    conn.commit()
    conn.close()


def get_sid_from_username(username, pin):
    cur, conn = database.load_database()
    query = "SELECT sid FROM users WHERE username = ? AND lobby_code = ?"
    cur.execute(query, (username, pin))
    result = cur.fetchone()
    conn.close()
    return result[0] if result else None


def is_team_name_taken(pin, team_name):
    team_name = team_name.strip()
    cur, conn = database.load_database()
    query = """
    SELECT * FROM users 
    WHERE LOWER(team_name) = LOWER(?) AND lobby_code = ?
    """
    cur.execute(query, (team_name, pin))
    result = cur.fetchone()
    conn.close()
    return result is not None
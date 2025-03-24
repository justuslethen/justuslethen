import sqlite3


def load_database():
    conn = sqlite3.connect('database.db')
    cur = conn.cursor()
    init_database(cur)
    
    return cur, conn


def init_database(cur):
    create_user_table(cur)
    create_words_table(cur)
    create_lobbies_table(cur)
    create_score_table(cur)
    create_round_table(cur)
    
    cur.connection.commit()


def create_user_table(cur):
    query = """
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        username TEXT NOT NULL,
        sid TEXT NOT NULL,
        lobby_code TEXT NOT NULL,
        team_name TEXT NOT NULL,
        valid INTEGER NOT NULL,
        turns INTEGER NOT NULL
    )"""
    cur.execute(query)


def create_words_table(cur):
    query = """
    CREATE TABLE IF NOT EXISTS words (
        id INTEGER PRIMARY KEY,
        word TEXT NOT NULL,
        lobby_code TEXT NOT NULL,
        user_sid TEXT NOT NULL,
        round INTEGER NOT NULL
    )"""
    cur.execute(query)


def create_lobbies_table(cur):
    query = """
    CREATE TABLE IF NOT EXISTS lobbies (
        id INTEGER PRIMARY KEY,
        code TEXT NOT NULL,
        name TEXT NOT NULL,
        host_sid TEXT NOT NULL,
        host_code TEXT NOT NULL,
        number_of_rounds INTEGER NOT NULL,
        number_of_teams INTEGER NOT NULL,
        round_time INTEGER NOT NULL,
        page TEXT NOT NULL
    )"""
    cur.execute(query)


def create_score_table(cur):
    query = """
    CREATE TABLE IF NOT EXISTS score (
        lobby_code TEXT NOT NULL,
        round_number INTEGER NOT NULL,
        team TEXT NOT NULL,
        score INTEGER NOT NULL,
        user_sid TEXT NOT NULL,
        word TEXT NOT NULL
    )"""
    cur.execute(query)


def create_round_table(cur):
    query = """
    CREATE TABLE IF NOT EXISTS rounds (
        lobby_code TEXT NOT NULL,
        round INTEGER NOT NULL,
        current_turn_user TEXT NOT NULL,
        current_turn_team TEXT NOT NULL,
        round_started INTEGER NOT NULL,
        time_left_at_start INTEGER NOT NULL,
        time_left_at_end INTEGER NOT NULL
    )"""
    cur.execute(query)
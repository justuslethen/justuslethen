import os
import sqlite3


# returns the path based on the file type
def get_file_path(filename):
    path = ""
    if filename.endswith(".css"):
        path = f"frontend-files/style/{filename}"
    elif filename.endswith(".ttf"):
        path = f"frontend-files/fonts/{filename}"
    elif filename.endswith(".js"):
        path = f"frontend-files/script/{filename}"
    elif filename.endswith(".svg"):
        path = f"frontend-files/svg/{filename}"
    elif filename.endswith(".html"):
        path = f"frontend-files/html/{filename}"

    if os.path.exists(path):
        return path

    return False


def get_file(filename):
    path = get_file_path(filename)
    if path:
        return path
    else:
        return "frontend-files/html/file_not_found.html"


def open_file(path):
    # return the file as a variable
    print(path)
    with open(path, "r") as f:
        return f.read()


def open_db():
    conn = sqlite3.connect("database.db")
    cur = conn.cursor()

    create_user_table(cur)
    create_token_table(cur)
    create_card_table(cur)

    create_learning_level_table(cur)
    create_session_keys_table(cur)
    create_score_table(cur)
    create_learn_data_table(cur)
    create_finished_sessions_table(cur)
    create_admin_table(cur)
    create_folders_table(cur)
    create_logs_table(cur)

    return cur, conn


def create_user_table(cur):
    query = """
        CREATE TABLE IF NOT EXISTS users (
        user_id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        password TEXT NOT NULL
        );
    """

    response = cur.execute(query)
    response.fetchall()


def create_admin_table(cur):
    query = """
        CREATE TABLE IF NOT EXISTS admins (
        user_id INTEGER PRIMARY KEY AUTOINCREMENT
        );
    """

    response = cur.execute(query)
    response.fetchall()


def create_token_table(cur):
    query = """
        CREATE TABLE IF NOT EXISTS tokens (
        user_id INTEGER NOT NULL,
        token TEXT NOT NULL
        );
    """

    response = cur.execute(query)
    response.fetchall()


def create_card_table(cur):
    query = """
        CREATE TABLE IF NOT EXISTS cards (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        folder_id INT NOT NULL,
        user_id INTEGER NOT NULL,
        front TEXT NOT NULL,
        back TEXT NOT NULL
        );
    """

    response = cur.execute(query)
    response.fetchall()


def create_learning_level_table(cur):
    query = """
        CREATE TABLE IF NOT EXISTS learning_level (
        user_id INTEGER NOT NULL,
        card_id INTEGER NOT NULL,
        level INTEGER NOT NULL,
        last_learned INTEGER NOT NULL,
        next_time_to_learn INTEGER NOT NULL
        );
    """

    response = cur.execute(query)
    response.fetchall()


def create_session_keys_table(cur):
    query = """
        CREATE TABLE IF NOT EXISTS session_keys (
        user_id INTEGER NOT NULL,
        card_id INTEGER NOT NULL,
        value INTEGER NOT NULL,
        folder_id TEXT NOT NULL,
        key TEXT NOT NULL
        );
    """

    response = cur.execute(query)
    response.fetchall()


def create_score_table(cur):
    query = """
        CREATE TABLE IF NOT EXISTS score (
        user_id INTEGER NOT NULL,
        correct INTEGER NOT NULL,
        incorrect INTEGER NOT NULL,
        sessions INTEGER NOT NULL
        );
    """

    response = cur.execute(query)
    response.fetchall()


def create_learn_data_table(cur):
    query = """
        CREATE TABLE IF NOT EXISTS learn_data (
        user_id INTEGER NOT NULL,
        card_id INTEGER NOT NULL,
        date INTEGER NOT NULL,
        day INTEGER NOT NULL,
        value INTEGER NOT NULL,
        level INTEGER NOT NULL
        );
    """

    response = cur.execute(query)
    response.fetchall()


def create_logs_table(cur):
    query = """
        CREATE TABLE IF NOT EXISTS logs (
        log_id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        date INTEGER NOT NULL,
        action TEXT NOT NULL
        );
    """

    response = cur.execute(query)
    response.fetchall()


def create_finished_sessions_table(cur):
    query = """
        CREATE TABLE IF NOT EXISTS finished_lessons (
        user_id INTEGER NOT NULL,
        day INTEGER NOT NULL
        );
    """

    response = cur.execute(query)
    response.fetchall()


def create_folders_table(cur):
    query = """
        CREATE TABLE IF NOT EXISTS folders (
            folder_id INTEGER PRIMARY KEY AUTOINCREMENT,
            path TEXT NOT NULL,
            name TEXT NOT NULL
        );
    """

    response = cur.execute(query)
    response.fetchall()


def create_route_folder(cur):
    cur.execute("SELECT * FROM folders WHERE path = '/'")
    res = cur.fetchall()
    if len(res) > 0:
        return
    
    cur.execute("INSERT INTO folders (path, name) VALUES ('/', 'route')")
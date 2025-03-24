import sqlite3

DB_PATH = "database.db"


def connect_db():
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    return cur, conn


def create_tables():
    cur, conn = connect_db()
    create_users_table(cur)
    create_rooms_tabel(cur)
    create_messages_table(cur)
    conn.commit()
    conn.close()


def create_users_table(cur):
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS users (
            user_id INTEGER PRIMARY KEY AUTOINCREMENT,
            sid TEXT NOT NULL,
            username TEXT NOT NULL,
            room_code TEXT NOT NULL,
            color TEXT NOT NULL,
            joined_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """
    )


def create_rooms_tabel(cur):
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS rooms (
            room_id INTEGER PRIMARY KEY AUTOINCREMENT,
            roomname TEXT NOT NULL,
            code TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            duration INTEGER NOT NULL,
            expiring_at DATE GENERATED ALWAYS AS (
                date(created_at, '+' || duration || ' days', '+1 day')
            ) VIRTUAL,
            max_members INTEGER NOT NULL,
            private BOOLEAN NOT NULL
        )
    """
    )


def create_messages_table(cur):
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS messages (
            message_id INTEGER PRIMARY KEY AUTOINCREMENT,
            sender_id INTEGER NOT NULL,
            message TEXT NOT NULL,
            send_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            room_id INTEGER NOT NULL,
            color TEXT NOT NULL,
            sender_name TEXT NOT NULL,
            FOREIGN KEY (sender_id) REFERENCES users(user_id) ON DELETE CASCADE,
            FOREIGN KEY (room_id) REFERENCES rooms(room_id) ON DELETE CASCADE
        )
    """
    )


create_tables()

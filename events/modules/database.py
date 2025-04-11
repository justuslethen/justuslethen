import sqlite3
import os

DB_NAME = "database.db"

def build():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    # create all necessary tables
    build_main_event_table(cursor)
    build_sub_event_table(cursor)
    build_cols_event_table(cursor)

    conn.commit()
    conn.close()
 

def build_main_event_table(cur):
    cur.execute("""
        CREATE TABLE IF NOT EXISTS main_events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT,
            pin INTEGER DEFAULT 0,
            public INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    """)
 

def build_sub_event_table(cur):
    cur.execute("""
        CREATE TABLE IF NOT EXISTS main_events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            start_date TIMESTAMP NOT NULL,
            end_date TIMESTAMP NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    """)
 

def build_cols_event_table(cur):
    cur.execute("""
        CREATE TABLE IF NOT EXISTS main_events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            subevent_id INTEGER NOT NULL,
            name TEXT NOT NULL,
            context TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    """)
 

def load():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    return cursor, conn
 

if __name__ == "__main__":
    build()
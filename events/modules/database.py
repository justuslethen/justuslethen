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
            event_id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            pin INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    """)
 

def build_sub_event_table(cur):
    cur.execute("""
        CREATE TABLE IF NOT EXISTS sub_events (
            subevent_id INTEGER PRIMARY KEY AUTOINCREMENT,
            event_id INTEGER NOT NULL,
            name TEXT NOT NULL,
            start_date TIMESTAMP NOT NULL,
            end_date TIMESTAMP NOT NULL
        );
    """)
 

def build_cols_event_table(cur):
    cur.execute("""
        CREATE TABLE IF NOT EXISTS rows (
            row_id INTEGER PRIMARY KEY AUTOINCREMENT,
            event_id INTEGER NOT NULL,
            subevent_id INTEGER NOT NULL,
            name TEXT NOT NULL,
            context TEXT NOT NULL
        );
    """)
 

def load():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    return cursor, conn
 

build()
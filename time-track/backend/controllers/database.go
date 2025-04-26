package controllers

import (
	"database/sql"
	_ "github.com/mattn/go-sqlite3"
)

var DB *sql.DB

func InitDB() {
	var err error
	DB, err = sql.Open("sqlite3", "./timetrack.db")
	if err != nil {
		panic(err)
	}

	// Create necessary tables
	createTables()
}

func createTables() {
	createUsersTable()
	createTokensTable()
	createTasksTable()
	createSessionsTable()
	createTagsTable()
	createLogsTable()
}

func createUsersTable() {
	query := `
    CREATE TABLE IF NOT EXISTS users (
        user_id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_name TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        firstname TEXT NOT NULL,
        created_by_token_id INTEGER NOT NULL,
        created_at INTEGER DEFAULT (strftime('%s','now') * 1000)
    );`
	executeCreateTableQuery(query)
}

func createTokensTable() {
	query := `
    CREATE TABLE IF NOT EXISTS tokens (
        token_id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        token TEXT NOT NULL,
        revoked INTEGER DEFAULT 0,
        user_agent TEXT NOT NULL,
        initial_ip TEXT NOT NULL,
        last_ip TEXT NOT NULL,
        last_used INTEGER DEFAULT (strftime('%s','now') * 1000),
        created_at INTEGER DEFAULT (strftime('%s','now') * 1000),
        FOREIGN KEY (user_id) REFERENCES users(user_id)
    );`
	executeCreateTableQuery(query)
}

func createTasksTable() {
	query := `
    CREATE TABLE IF NOT EXISTS tasks (
        task_id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        token_id INTEGER NOT NULL,
        task_name TEXT NOT NULL,
        task_description TEXT NOT NULL,
        task_start INTEGER DEFAULT (strftime('%s','now') * 1000),
        task_end INTEGER DEFAULT (strftime('%s','now') * 1000),
        task_duration INTEGER DEFAULT 0,
        task_status TEXT NOT NULL,
        created_at INTEGER DEFAULT (strftime('%s','now') * 1000),
        FOREIGN KEY (user_id) REFERENCES users(user_id),
        FOREIGN KEY (token_id) REFERENCES tokens(token_id)
    );`
	executeCreateTableQuery(query)
}

func createSessionsTable() {
	query := `
    CREATE TABLE IF NOT EXISTS sessions (
        session_id INTEGER PRIMARY KEY AUTOINCREMENT,
        task_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        token_id INTEGER NOT NULL,
        end_time INTEGER DEFAULT (strftime('%s','now') * 1000),
        start_time INTEGER DEFAULT (strftime('%s','now') * 1000),
        FOREIGN KEY (task_id) REFERENCES tasks(task_id),
        FOREIGN KEY (user_id) REFERENCES users(user_id),
        FOREIGN KEY (token_id) REFERENCES tokens(token_id)
    );`
	executeCreateTableQuery(query)
}

func createTagsTable() {
	query := `
    CREATE TABLE IF NOT EXISTS tags (
        tag_id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        task_id INTEGER NOT NULL,
        tag_name TEXT NOT NULL,
        token_id INTEGER NOT NULL,
        created_at INTEGER DEFAULT (strftime('%s','now') * 1000),
        FOREIGN KEY (user_id) REFERENCES users(user_id),
        FOREIGN KEY (task_id) REFERENCES tasks(task_id),
        FOREIGN KEY (token_id) REFERENCES tokens(token_id)
    );`
	executeCreateTableQuery(query)
}

func createLogsTable() {
	query := `
    CREATE TABLE IF NOT EXISTS logs (
        log_id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        task_id INTEGER,
        token_id INTEGER,
        log_type TEXT NOT NULL,
        log_name TEXT NOT NULL,
        log_description TEXT NOT NULL,
        created_at INTEGER DEFAULT (strftime('%s','now') * 1000),
        FOREIGN KEY (user_id) REFERENCES users(user_id)
    );`
	executeCreateTableQuery(query)
}

func executeCreateTableQuery(query string) {
	_, err := DB.Exec(query)
	if err != nil {
		panic("Failed to create table: " + err.Error())
	}
}

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
}
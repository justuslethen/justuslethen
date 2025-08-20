package internal

import (
	"database/sql"
	"fmt"
	"go-backend/config"
	"log"

	_ "github.com/go-sql-driver/mysql"
)

var DB *sql.DB


func Connect() error {
	// get server config with db config
	config := config.ServerConfig

	// login data
	dsn := fmt.Sprintf("%s:%s@tcp(%s)/%s", config.DBUser, config.DBPassword, config.DBPort, config.DBName)

	// get connection to sql database
	database, err := sql.Open("mysql", dsn)
	if err != nil {
		return err
	}

	// check connection to database
	if err := database.Ping(); err != nil {
		return err
	}

	DB = database

	setupDatabase()
	return nil
}


func setupDatabase() {
	createUserTable()
}


func createUserTable() {
	_, err := DB.Exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        username VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
		ip_created VARCHAR(20) NOT NULL,
        last_used TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
	`)
	if err != nil {
		log.Fatal("Failed creating table:", err)
	}
}

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
	createTokensTable()
	createLoginAttempts()
}

func createUserTable() {
	_, err := DB.Exec(`
    CREATE TABLE IF NOT EXISTS users (
        userid INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        username VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
		ip_created VARCHAR(20) NOT NULL,
		password VARCHAR(40) NOT NULL,
        last_used TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
	`)
	if err != nil {
		log.Fatal("Failed creating table:", err)
	}
}

func createTokensTable() {
	_, err := DB.Exec(`
    CREATE TABLE IF NOT EXISTS tokens (
        tokenid INT AUTO_INCREMENT PRIMARY KEY,
        userid INT AUTO_INCREMENT PRIMARY KEY,
        token VARCHAR(100) NOT NULL,
        username VARCHAR(100) NOT NULL,
        ip_last_used VARCHAR(20) UNIQUE NOT NULL,
		ip_created VARCHAR(20) NOT NULL,
		number_used VARCHAR(9) NOT NULL,
        last_used TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
	`)
	if err != nil {
		log.Fatal("Failed creating table:", err)
	}
}

func createLoginAttempts() {
	_, err := DB.Exec(`
    CREATE TABLE IF NOT EXISTS login_attempts (
        loginid INT AUTO_INCREMENT PRIMARY KEY,
		ip VARCHAR(20) NOT NULL,
		userid VARCHAR(20) NOT NULL,
		number_used VARCHAR(9) NOT NULL,
        tried_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
	`)
	if err != nil {
		log.Fatal("Failed creating table:", err)
	}
}

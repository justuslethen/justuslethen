package database

import (
	"database/sql"
	"fmt"
	"go-backend/config"
	"log"

	_ "github.com/go-sql-driver/mysql"
)

var DB *sql.DB

func ConnectDB() error {
	// get server config with db config
	config := config.ServerConfig

	// login data
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s", config.DBUser, config.DBPassword, config.DBHost, config.DBPort, config.DBName)

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
	createAPIKeysTable()
	create2FACodesTable()

	fmt.Println("created tables")
}

func createUserTable() {
	_, err := DB.Exec(`
    CREATE TABLE IF NOT EXISTS users (
        userid INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        username VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
		email_verified BOOLEAN NOT NULL DEFAULT FALSE,
		ip_created VARCHAR(20) NOT NULL,
		password VARCHAR(255) NOT NULL,
		agent VARCHAR(255) NOT NULL,
		bio VARCHAR(100) NOT NULL,
        last_used TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
	`)
	if err != nil {
		log.Fatal("Failed creating users table:", err)
	}
}

func createTokensTable() {
	_, err := DB.Exec(`
    CREATE TABLE IF NOT EXISTS tokens (
        tokenid INT AUTO_INCREMENT PRIMARY KEY,
        userid INT NOT NULL,
        token VARCHAR(255) NOT NULL,
        ip_last_used VARCHAR(20) NOT NULL,
		ip_created VARCHAR(20) NOT NULL,
		number_used INT NOT NULL,
		agent VARCHAR(255) NOT NULL,
		device_name VARCHAR(20) NOT NULL,
		app_name VARCHAR(20) NOT NULL,
        last_used TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
	`)
	if err != nil {
		log.Fatal("Failed creating tokens table:", err)
	}
}

func createLoginAttempts() {
	_, err := DB.Exec(`
    CREATE TABLE IF NOT EXISTS login_attempts (
        loginid INT AUTO_INCREMENT PRIMARY KEY,
		ip VARCHAR(20) NOT NULL,
		userid INT NOT NULL,
		number_used INT NOT NULL,
        tried_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
	`)
	if err != nil {
		log.Fatal("Failed creating login_attempts table:", err)
	}
}

func createAPIKeysTable() {
	_, err := DB.Exec(`
    CREATE TABLE IF NOT EXISTS API_keys (
        keyid INT AUTO_INCREMENT PRIMARY KEY,
		API_key VARCHAR(30) NOT NULL,
		key_name VARCHAR(20) NOT NULL,
		userid INT NOT NULL,
		was_viewed BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
	`)
	if err != nil {
		log.Fatal("Failed creating API_keys table:", err)
	}
}

func create2FACodesTable() {
	_, err := DB.Exec(`
    CREATE TABLE IF NOT EXISTS 2_fa_codes (
        codeid INT AUTO_INCREMENT PRIMARY KEY,
		code VARCHAR(4) NOT NULL,
		userid INT NOT NULL,
		was_used BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
	`)
	if err != nil {
		log.Fatal("Failed creating 2FACodes table:", err)
	}
}

// config/server_config.go
package config

import (
    "log"
    "os"

    "github.com/joho/godotenv"
)

type Config struct {
    DBUser          string
    DBPassword      string
    DBName          string
    DBPort          string
    DBHost          string
    ServerPort      string
    JWTKey          string
    JWTExpiration   string
    TimeoutDuration string
    LoginAttempts   string
    PasswordMinLen  string
}

// global var
var ServerConfig Config

func LoadConfig() error {
    // load the .env file
    err := godotenv.Load()
    if err != nil {
        // return if .env cannot be loaded
        log.Fatalf("Error no .env file found")
        return err
    }

    ServerConfig = Config{
        // server config
        DBUser:             os.Getenv("DB_USER"),
        DBPassword:         os.Getenv("DB_PASSWORD"),
        DBPort:             os.Getenv("DB_PORT"),
        DBName:             os.Getenv("DB_NAME"),
        DBHost:             os.Getenv("DB_HOST"),
        ServerPort:         os.Getenv("SERVER_PORT"),
        
        // app config
        JWTKey:             os.Getenv("JWT_SECRET"),
        JWTExpiration:      os.Getenv("JWT_EXPIRATION"),
        TimeoutDuration:    os.Getenv("MAX_WRONG_ATTEMPTS"),
        LoginAttempts:      os.Getenv("TIMEOUT_DURATION"),
        PasswordMinLen:     os.Getenv("PASSWORD_MIN_LENGTH"),
    }

    // no err
    return nil
}
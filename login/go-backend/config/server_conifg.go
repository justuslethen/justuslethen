// config/server_config.go
package config

import (
    "fmt"
    "os"

    "github.com/joho/godotenv"
)

type Config struct {
    DBUser          string
    DBPassword      string
    DBPort          string
    ServerPort      string
    JWTKey          string
    JWTExpiration   string
    TimeoutDuration string
    LoginAttempts   string
    PasswordMinLen  string
}

// global var
var ServerConfig Config

func LoadConfig() {
    err := godotenv.Load()
    if err != nil {
        fmt.Println("Error no .env file found")
    }

    ServerConfig = Config{
        // server config
        DBUser:             os.Getenv("DB_USER"),
        DBPassword:         os.Getenv("DB_PASSWORD"),
        DBPort:             os.Getenv("DB_PORT"),
        ServerPort:         os.Getenv("SERVER_PORT"),
        
        // app config
        JWTKey:             os.Getenv("JWT_SECRET"),
        JWTExpiration:      os.Getenv("JWT_EXPIRATION"),
        TimeoutDuration:    os.Getenv("MAX_WRONG_ATTEMPTS"),
        LoginAttempts:      os.Getenv("TIMEOUT_DURATION"),
        PasswordMinLen:     os.Getenv("PASSWORD_MIN_LENGTH"),
    }
}
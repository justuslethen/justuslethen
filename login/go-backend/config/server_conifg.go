// config/server_config.go
package config

import (
    "fmt"
    "os"

    "github.com/joho/godotenv"
)

type Config struct {
    DBUser      string
    DBPassword  string
    DBPort      string
    ServerPort  string
}

// global var
var AppConfig Config

func LoadConfig() {
    err := godotenv.Load()
    if err != nil {
        fmt.Println("Error no .env file found")
    }

    AppConfig = Config{
        DBUser:         os.Getenv("DB_USER"),
        DBPassword:     os.Getenv("DB_PASSWORD"),
        DBPort:         os.Getenv("DB_PORT"),
        ServerPort:     os.Getenv("SERVER_PORT"),
    }
}
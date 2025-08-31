package config

import (
    "log"
    "os"

    "github.com/joho/godotenv"
)

type ServerConfigStruct struct {
    ServerPort  int
    AppName     string
}

// global var
var ServerConfig ServerConfigStruct

func loadServerConfig() error {
    // load the .env file
    err := godotenv.Load()
    if err != nil {
        // return if .env cannot be loaded
        log.Fatalf("Error no .env file found")
        return err
    }

    ServerConfig = ServerConfigStruct{
        ServerPort: GetEnvAsInt("SERVER_PORT"),
        AppName:    os.Getenv("login"),
    }

    // no err
    return nil
}
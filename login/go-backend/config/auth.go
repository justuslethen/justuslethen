package config

import (
    "log"
    "os"

    "github.com/joho/godotenv"
)

type AuthConfigStruct struct {
    JWTKey         	string
    AccessDuration 	string
    RefreshDuration	string
    TimeoutDuration	string
    LoginAttempts  	string
    PasswordMinLen 	string
}

// global var
var AuthConfig AuthConfigStruct

func loadAuthConfig() error {
    // load the .env file
    err := godotenv.Load()
    if err != nil {
        // return if .env cannot be loaded
        log.Fatalf("Error no .env file found")
        return err
    }

    AuthConfig = AuthConfigStruct{
        JWTKey:         	os.Getenv("JWT_SECRET"),
        AccessDuration: 	os.Getenv("ACCESS_EXPIRATION"),
        RefreshDuration:	os.Getenv("REFRESH_EXPIRATION"),
        TimeoutDuration:	os.Getenv("MAX_WRONG_ATTEMPTS"),
        LoginAttempts:  	os.Getenv("TIMEOUT_DURATION"),
        PasswordMinLen: 	os.Getenv("PASSWORD_MIN_LENGTH"),
    }

    // no err
    return nil
}
package config

import (
    "log"
    "os"

    "github.com/joho/godotenv"
)

type AuthConfigStruct struct {
    JWTKey         	string
    AccessDuration 	int
    RefreshDuration	int
    TimeoutDuration	int
    LoginAttempts  	int
    PasswordMinLen 	int
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
        AccessDuration: 	GetEnvAsInt("ACCESS_EXPIRATION"),
        RefreshDuration:	GetEnvAsInt("REFRESH_EXPIRATION"),
        TimeoutDuration:	GetEnvAsInt("MAX_WRONG_ATTEMPTS"),
        LoginAttempts:  	GetEnvAsInt("TIMEOUT_DURATION"),
        PasswordMinLen: 	GetEnvAsInt("PASSWORD_MIN_LENGTH"),
    }

    // no err
    return nil
}
package config

import (
    "log"
    "os"

    "github.com/joho/godotenv"
)

type DBConfigStruct struct {
    DBUser    	string
    DBPassword	string
    DBName    	string
    DBPort    	int
    DBHost    	string
}

// global var
var DBConfig DBConfigStruct

func loadDBConfig() error {
    // load the .env file
    err := godotenv.Load()
    if err != nil {
        // return if .env cannot be loaded
        log.Fatalf("Error no .env file found")
        return err
    }

    DBConfig = DBConfigStruct{
        DBUser:    	os.Getenv("DB_USER"),
        DBPassword:	os.Getenv("DB_PASSWORD"),
        DBPort:    	GetEnvAsInt("DB_PORT"),
        DBName:    	os.Getenv("DB_NAME"),
        DBHost:    	os.Getenv("DB_HOST"),
    }

    // no err
    return nil
}
package config

import (
    "log"
    "os"

    "github.com/joho/godotenv"
)

type MailerConfigStruct struct {
    Host		string
    Port		string
    Username	string
    Password	string
}

// global var
var MailerConfig MailerConfigStruct

func loadMailerConfig() error {
    // load the .env file
    err := godotenv.Load()
    if err != nil {
        // return if .env cannot be loaded
        log.Fatalf("Error no .env file found")
        return err
    }

    MailerConfig = MailerConfigStruct{
        Host:		os.Getenv("EMAIL_HOST"),
        Port:		os.Getenv("EMAIL_PORT"),
        Username:	os.Getenv("EMAIL_USERNAME"),
        Password:	os.Getenv("EMAIL_PASSOWORD"),
    }

    // no err
    return nil
}
package config

import (
    "os"
	"fmt"
    "strconv"
)

func LoadAllConfigs() error {
	err := loadAuthConfig()
	if err != nil {
		return err
	}

	err = loadDBConfig()
	if err != nil {
		return err
	}

	err = loadMailerConfig()
	if err != nil {
		return err
	}

	err = loadServerConfig()
	if err != nil {
		return err
	}

	return nil
}

func GetEnvAsInt(name string) int {
    integer, err := strconv.Atoi(os.Getenv(name))
    if err != nil {
		fmt.Println("Error converting env string to int")
        return 0
    }

	return integer
}
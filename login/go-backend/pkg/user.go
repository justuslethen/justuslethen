package pkg

import (
	"go-backend/database"
)

func IsUsernameTaken(username string) (bool, error) {
	// check if username is already taken in the database
	// SELECT and retur boolean

	var exists bool
	err := database.DB.QueryRow("SELECT EXISTS(SELECT 1 FROM users WHERE username=?)", username).Scan(&exists)
	if err != nil {
		return false, err
	}
	return exists, nil
}
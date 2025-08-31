package pkg

import (
	"fmt"
	"go-backend/database"
)

type AllUserData struct {
	Username  string
	Userid    string
	Agent     string
	IpCreated string
	Name      string
	Email     string
	Bio       string
}

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

func GetAllUserData(userid int) AllUserData {
	userData := getAllUserDataFromDB(userid)

	fmt.Println("userData: ", userData)

	return userData
}

func getAllUserDataFromDB(userid int) AllUserData {
	var username, agent, ip, name, email, bio string

	fmt.Println("userid: ", userid)

	err := database.DB.QueryRow("SELECT username, agent, ip_created, name, email, bio FROM users WHERE userid = ?",
		userid,
	).Scan(&username, &agent, &ip, &name, &email, &bio)

	if err != nil {
		fmt.Println("allUserData err: ", err)
		return AllUserData{}
	}

	useridStr := fmt.Sprint(userid)

	userData := setAllUserDataStruct(username, useridStr, agent, ip, name, email, bio)

	return userData
}

func setAllUserDataStruct(username, userid, agent, ip, name, email, bio string) AllUserData {
	return AllUserData{
		Username:  username,
		Userid:    userid,
		Agent:     agent,
		IpCreated: ip,
		Name:      name,
		Email:     email,
		Bio:       bio,
	}
}

func GetUsernameAndEmail(userid int) (string, string, error) {
	var username, email string

	err := database.DB.QueryRow("SELECT username, email FROM users WHERE userid = ?",
		userid,
	).Scan(&username, &email)

	return username, email, err
}
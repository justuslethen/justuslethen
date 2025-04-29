package controllers

import (
	"crypto/rand"
	"fmt"
	"github.com/gin-gonic/gin"
	"html"
	"math/big"
	"net/http"
	"strings"
)

type NewUser struct {
	Username  string `json:"username"`
	Password  string `json:"password"`
	Email     string `json:"email"`
	FirstName string `json:"firstname"`
}

func validateRegisterInputs(u *NewUser) map[string]string {
	errors := make(map[string]string)

	validateUsernameInput(&errors, u.Username)
	validateEmailInput(&errors, u.Email)
	validateFirstNameInput(&errors, u.FirstName)
	validatePasswordInput(&errors, u.Password)

	return errors
}

func createNewUser(c *gin.Context, u *NewUser) (int, error) {
	hashedPassword, err := HashPassword(u.Password)

	if err != nil {
		return 0, err
	}

	// Trim spaces and escape to avoid XSS attacks
	username := html.EscapeString(strings.TrimSpace(u.Username))
	firstName := html.EscapeString(strings.TrimSpace(u.FirstName))

	// Prepare data for insertion
	data := map[string]string{
		"username":  username,
		"password":  hashedPassword,
		"email":     u.Email,
		"firstName": firstName,
	}

	// Create user row and get user_id
	userID, err := insertUserIntoDB(&data)
	if err != nil {
		return 0, err
	}

	token, tokenID, err := buildRefreshToken(c, userID)
	if err != nil {
		return 0, err
	}

	// Add token to user as token that has created the account
	addNewTokenToUser(userID, tokenID)

	fmt.Println("Token created:", token)

	fmt.Println("User created with ID:", userID)

	return int(userID), nil
}

func buildRefreshToken(c *gin.Context, userID int) (string, int, error) {
	token, err := generateRefreshToken()
	if err != nil {
		return "", 0, err
	}

	// UserAgent and IP
	userData := getUserDataForToken(c)
	tokenID := saveRefreshTokenToDB(userID, token, &userData)
	
	if tokenID == 0 {
		return "", 0, fmt.Errorf("failed to save token to DB")
	}

	return token, tokenID, nil
}

func addNewTokenToUser(userID int, tokenID int) {
	// Add token to the user
	// Save what token created the account
	_, err := DB.Exec(`
		UPDATE users
		SET created_by_token_id = ?
		WHERE user_id = ?
	`, tokenID, userID)

	if err != nil {
		fmt.Println("Error while adding new token to user:", err)
	}
}

func saveRefreshTokenToDB(userID int, token string, userData *map[string]string) (int) {
	// Save the refresh token to the database
	// Save user_agent, ip and token
	result, err := DB.Exec(`
		INSERT INTO tokens (user_id, token, revoked, user_agent, initial_ip, last_ip)
		VALUES (?, ?, ?, ?, ?, ?)
	`, userID, token, 0, (*userData)["userAgent"], (*userData)["ipAdress"], (*userData)["ipAdress"])

	if err != nil {
		return 0
	}
	
	tokenID, _ := result.LastInsertId()

	return int(tokenID)
}

func getUserDataForToken(c *gin.Context) map[string]string {
	// Get user agent and IP address
	// For security reasons
	userAgent := c.Request.UserAgent()
	ip := c.ClientIP()

	return map[string]string{
		"userAgent": userAgent,
		"ipAdress":  ip,
	}
}

func generateRefreshToken() (string, error) {
	// Create a random token
	// Using crypto/rand package
	// Small and big sized chars + numbers between 0-9

	const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	const tokenLength = 20
	var token string

	for i := 0; i < tokenLength; i++ {
		// Get random number for random char
		// Use crypto/rand for better security
		n, err := rand.Int(rand.Reader, big.NewInt(int64(len(charset))))
		if err != nil {
			return "", err
		}
		// Add char to token
		token += string(charset[n.Int64()])
	}

	return token, nil
}

func insertUserIntoDB(data *map[string]string) (int, error) {
	// Insert the user into the database
	result, err := DB.Exec(`
		INSERT INTO users (user_name, password, email, firstname, created_by_token_id)
		VALUES (?, ?, ?, ?, ?)
	`, (*data)["username"], (*data)["password"], (*data)["email"], (*data)["firstName"], 0)
	if err != nil {
		return 0, err
	}

	// Get the last inserted row ID (user_id)
	userID, err := result.LastInsertId()
	if err != nil {
		return 0, err
	}

	return int(userID), nil
}

func makeRegisterResponse(c *gin.Context, user *NewUser, errors map[string]string) {
	// If there are any validation errors, return them
	if len(errors) > 0 {
		c.JSON(http.StatusOK, gin.H{
			"error": errors,
		})
		return
	}

	// If everything is fine, return success message
	c.JSON(http.StatusOK, gin.H{
		"message": "Register OK",
		"user":    user,
	})
}

func RegisterUser(c *gin.Context) {
	var user NewUser

	// Automatically bind JSON input to NewUser struct
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": EM("invalid_request")})
		return
	}

	// Validate user input
	errors := validateRegisterInputs(&user)

	// If no errors, create the user
	if len(errors) == 0 {
		createNewUser(c, &user)
	}

	// Send response back to client
	makeRegisterResponse(c, &user, errors)
}

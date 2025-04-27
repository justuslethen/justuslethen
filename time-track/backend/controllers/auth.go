package controllers

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"net/http"
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

func createNewUser(u *NewUser) (int, error) {
	fmt.Println("Creating new user")
	fmt.Println(*u)
	userID := 0
	return userID, nil
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
		createNewUser(&user)
	}

	// Send response back to client
	makeRegisterResponse(c, &user, errors)
}

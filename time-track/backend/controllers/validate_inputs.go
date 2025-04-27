package controllers


import (
	"regexp"
	"strings"
)

func validateUsernameInput(errors *map[string]string, username string) {
	if strings.TrimSpace(username) == "" {
		(*errors)["username"] = EM("username_required")
		return
	}
	
	// only letters, numbers, dots, underscores and dashes are allowed
	re := regexp.MustCompile(`^[a-zA-Z0-9._-]+$`)

	if !re.MatchString(username) {
		(*errors)["username"] = EM("invalid_username")
		return
	}
}

func validateEmailInput(errors *map[string]string, email string) {
	if strings.TrimSpace(email) == "" {
		(*errors)["email"] = EM("email_required")
		return
	}
	
	// basic email pattern
	re := regexp.MustCompile(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`)

	if !re.MatchString(email) {
		(*errors)["email"] = EM("invalid_email")
		return
	}
}

func validateFirstNameInput(errors *map[string]string, firstName string) {
	if strings.TrimSpace(firstName) == "" {
		(*errors)["firstname"] = EM("first_name_required")
		return
	}
	
	// Only big and small letters are allowed
	re := regexp.MustCompile(`^[a-zA-Z]+$`)

	if !re.MatchString(firstName) {
		(*errors)["firstname"] = EM("invalid_first_name")
		return
	}
}

func validatePasswordInput(errors *map[string]string, password string) {
	if strings.TrimSpace(password) == "" {
		(*errors)["password"] = EM("password_required")
		return
	}

	// password length: at least 8 characters
	if len(password) < 8 {
		(*errors)["password"] = EM("password_too_short")
		return
	}

	// create regex patterns for password validation
	// password: at least one lowercase, one uppercase, one number, one special char
	hasLower := regexp.MustCompile(`[a-z]`).MatchString(password)
	hasUpper := regexp.MustCompile(`[A-Z]`).MatchString(password)
	hasDigit := regexp.MustCompile(`\d`).MatchString(password)
	hasSpecial := regexp.MustCompile(`[!@#$%^&*(),.?":{}|<>]`).MatchString(password)

	if !(hasLower && hasUpper && hasDigit && hasSpecial) {
		(*errors)["password"] = EM("invalid_password")
		return
	}
}
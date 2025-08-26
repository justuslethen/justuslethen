package internal

import (
	"fmt"
	"net/http"
	// "io/ioutil"
	"encoding/json"
	// "log"
	// "time"
	"regexp"
)

type RegisterRequestForm struct {
	Email    string `json:"email"`
	Username string `json:"username"`
	Password string `json:"password"`
	Name     string `json:"name"`
	Bio      string `json:"bio"`
}

type FormPatternErrors struct {
	EmailError    string `json:"email_error,omitempty"`
	UsernameError string `json:"username_error,omitempty"`
	PasswordError string `json:"password_error,omitempty"`
	NameError     string `json:"name_error,omitempty"`
	BioError      string `json:"bio_error,omitempty"`
}

func RegisterUser(w http.ResponseWriter, r *http.Request) {
	// only allow POST requests
	if r.Method != http.MethodPost {
		return
	}

	// new struct variable
	var requestData RegisterRequestForm

	// decode JSON body into a struct
	err := json.NewDecoder(r.Body).Decode(&requestData)
	if err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}
	defer r.Body.Close()

	fmt.Printf("Received data: %+v\n", requestData)

	// valdiate inputs with regex and other checks
	errors := checkRegisterFormPatterns(&requestData)

	// send response with username or errors
	// check if errors struct is empty
	if errors == (FormPatternErrors{}) {
		fmt.Println("success")
		sendRegisterGoodResponse(w, &requestData)
		return
	} else {
		fmt.Println("failed", errors)
		sendRegisterBadResponse(w, &errors)
		return
	}
}

func sendRegisterGoodResponse(w http.ResponseWriter, requestData *RegisterRequestForm) {
	// send response back

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{
		"status":   "success",
		"username": requestData.Username,
	})
}

func sendRegisterBadResponse(w http.ResponseWriter, errors *FormPatternErrors) {
	// send response back with errors

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusBadRequest)
	json.NewEncoder(w).Encode(map[string]any{
		"status": "error",
		"errors": errors,
	})
}

func checkRegisterFormPatterns(body *RegisterRequestForm) FormPatternErrors {
	fmt.Println(body)

	// create new var according to struct
	var errors FormPatternErrors

	// check patterns and set errors
	// give pointer to errors struct to set errors
	checkEmailPattern(body.Email, &errors)
	checkUsernamePattern(body.Username, &errors)
	checkPasswordPattern(body.Password, &errors)
	checkNamePattern(body.Name, &errors)
	checkBioPattern(body.Bio, &errors)

	fmt.Println("erros", errors)

	return errors
}

func checkEmailPattern(email string, errors *FormPatternErrors) {
	// check if email is empty
	if email == "" {
		errors.EmailError = "email_required"
		return
	}

	// regex pattern for email validation
	var emailRegex = regexp.MustCompile(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`)

	// check if email is valid
	if !emailRegex.MatchString(email) {
		errors.EmailError = "email_invalid"
		return
	}
}

func checkUsernamePattern(username string, errors *FormPatternErrors) {
	// check if username is empty
	if username == "" {
		errors.UsernameError = "username_required"
		return
	}

	// regex pattern for username validation
	var usernameRegex = regexp.MustCompile(`^[a-zA-Z0-9_.]{3,20}$`)

	// check if username is valid
	if !usernameRegex.MatchString(username) {
		errors.UsernameError = "username_invalid"
		return
	}

	userNameTaken, err := isUsernameTaken(username)
	if err != nil {
		errors.UsernameError = "username_check_failed"
		return
	}

	if userNameTaken {
		errors.UsernameError = "username_taken"
		return
	}
}

func checkPasswordPattern(password string, errors *FormPatternErrors) {
	// check if password is empty
	if password == "" {
		errors.PasswordError = "password_required"
		return
	}

	// check if password is at least 8 characters long
	if len(password) < 8 {
		errors.PasswordError = "password_too_short"
		return
	}

	// regex patterns for password validation
	// separate regex checks to avoid complex patterns
	// at least one lowercase letter, one uppercase letter, one number and one special character

	// special characters: @$!%*?&
	lower := regexp.MustCompile(`[a-z]`)
	upper := regexp.MustCompile(`[A-Z]`)
	number := regexp.MustCompile(`[0-9]`)
	special := regexp.MustCompile(`[@$!%*?&]`)

	// do all checks
	if !lower.MatchString(password) ||
		!upper.MatchString(password) ||
		!number.MatchString(password) ||
		!special.MatchString(password) {
		errors.PasswordError = "password_invalid"
		return
	}
}

func checkNamePattern(name string, errors *FormPatternErrors) {
	// check if name is empty
	if name == "" {
		errors.NameError = "name_required"
		return
	}

	// check if name is at least 2 characters long
	if len(name) < 4 {
		errors.NameError = "name_too_short"
		return
	}

	// regex pattern for name validation
	var nameRegex = regexp.MustCompile(`^[a-zA-Z\s]{2,50}$`)

	// check if name is valid
	if !nameRegex.MatchString(name) {
		errors.NameError = "name_invalid"
		return
	}
}

func checkBioPattern(bio string, errors *FormPatternErrors) {
	// check if bio is max 100 characters long
	if len(bio) > 100 {
		errors.BioError = "bio_too_long"
		return
	}
}

func isUsernameTaken(username string) (bool, error) {
	// check if username is already taken in the database
	// SELECT and retur boolean

	var exists bool
	err := DB.QueryRow("SELECT EXISTS(SELECT 1 FROM users WHERE username=?)", username).Scan(&exists)
	if err != nil {
		return false, err
	}
	return exists, nil
}

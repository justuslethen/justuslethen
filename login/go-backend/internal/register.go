package internal

import (
	"fmt"
	"net/http"
	// "io/ioutil"
	"encoding/json"
	// "go-backend/internal/database"
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
	checkRegisterFormPatterns(&requestData)

	// send response with username or errors
	sendregisterResponse(w, &requestData)
}


func sendregisterResponse(w http.ResponseWriter, requestData *RegisterRequestForm) {
	// send response back

	// w.Header().Set("Content-Type", "application/json")
	// w.WriteHeader(http.StatusOK)
	// json.NewEncoder(w).Encode(map[string]string{
	// 	"status": "success",
	// 	"username":   requestData.Username,
	// })
}

func checkRegisterFormPatterns(body *RegisterRequestForm) {
	fmt.Println(body)

	var errors FormPatternErrors

	checkEmailPattern(body.Email ,&errors)
	// checkUsernamePattern()
	// checkPasswordPattern()
	// checkNamePattern()
	// checkBioPattern()
}

func checkEmailPattern(email string, errors *FormPatternErrors) {
	// check if email is empty
	if email == "" {
		errors.EmailError = "email is required"
		return
	}

	// regex pattern for email validation
	var emailRegex = regexp.MustCompile(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`)

	// check if email is valid
	if !emailRegex.MatchString(email) {
		errors.EmailError = "invalid email format"
		return
	}
}
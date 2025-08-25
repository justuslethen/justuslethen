package internal

import (
	"fmt"
	"net/http"
	// "io/ioutil"
	"encoding/json"
	// "go-backend/internal/database"
	// "log"
	// "time"
)

type RegisterRequestForm struct {
	Email    string `json:"email"`
	Username string `json:"username"`
	Password string `json:"password"`
	Name     string `json:"name"`
	Bio      string `json:"bio"`
}

func RegisterUser(w http.ResponseWriter, r *http.Request) {
	// Ensure method is POST
	if r.Method != http.MethodPost {
		return
	}

	// Decode JSON body into a struct
	var requestData RegisterRequestForm

	err := json.NewDecoder(r.Body).Decode(&requestData)
	if err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}
	defer r.Body.Close()

	fmt.Printf("Received data: %+v\n", requestData)

	// Example: run validations
	// checkRegisterFormPatterns(&requestData)

	// sendregisterResponse(w, &requestData)
}


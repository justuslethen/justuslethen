package auth

import (
	"crypto/rand"
	"fmt"
	"math/big"
	"go-backend/database"
	"go-backend/mailer"
	"encoding/json"

	"net/http"
)

func SendVerificationEmail(w http.ResponseWriter, r *http.Request) {
	userid, success, err := AuthUser(w, r)
	if !success || err != nil {
		return
	}

	email, err := createEmailVerificationEmail(userid)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		fmt.Println("error sending email-verification email")
	}

	fmt.Println("email-verification email was send")

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]any{
		"success": true,
		"email": email,
	})
}

func createEmailVerificationEmail(userid int) (string, error) {
	code := create2FACode()

	err := saveEmailVerificationCode(code, userid)
	if err != nil {
		return "", err
	}

	email, err := mailer.SendVerificationEmail(userid, code)
	if err != nil {
		return "", err
	}

	return email, nil
}

func create2FACode() string {
	max := big.NewInt(9999)
	n, err := rand.Int(rand.Reader, max)
	if err != nil {
		return "0001"
	}
	num := n.Int64() + 1
	return fmt.Sprintf("%04d", num)
}

func saveEmailVerificationCode(code string, userid int) error {
	_, err := database.DB.Exec("INSERT INTO 2_fa_codes (code, userid) VALUES (?, ?)",
		code, userid)

	if err != nil {
		return err
	}

	return nil
}
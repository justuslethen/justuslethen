package auth

import (
	"crypto/rand"
	"fmt"
	"math/big"
	"go-backend/database"

	"net/http"
)

func SendVerificationEmail(w http.ResponseWriter, r *http.Request) {
	userid, success, err := AuthUser(w, r)
	if !success || err != nil {
		return
	}

	code, err := createEmailVerificationCode(userid)
	
}

func createEmailVerificationCode(userid int) (string, error) {
	code := create2FACode()

	err := saveEmailVerificationCode(code, userid)
	if err != nil {
		return "", err
	}

	return code, nil
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
	_, err := database.DB.Exec("INSERT INTO tokens (code, userid) VALUES (?, ?, ?)",
		code, userid)

	if err != nil {
		return err
	}

	return nil
}
package auth

import (
	"crypto/rand"
	"fmt"
	"math/big"
	"go-backend/database"
	"go-backend/mailer"

	"net/http"
)

func SendVerificationEmail(w http.ResponseWriter, r *http.Request) {
	userid, success, err := AuthUser(w, r)
	if !success || err != nil {
		return
	}

	code, err := createEmailVerificationCode(userid)
	fmt.Println("code", code, err)
}

func createEmailVerificationCode(userid int) (string, error) {
	code := create2FACode()

	err := saveEmailVerificationCode(code, userid)
	if err != nil {
		return "", err
	}

	mailer.SendVerificationEmail(userid, code)

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
	_, err := database.DB.Exec("INSERT INTO 2_fa_codes (code, userid) VALUES (?, ?)",
		code, userid)

	if err != nil {
		return err
	}

	return nil
}
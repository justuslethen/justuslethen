package auth

import (
	"crypto/rand"
	"encoding/json"
	"fmt"
	"go-backend/database"
	"go-backend/mailer"
	"math/big"

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
		"email":   email,
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

func VerifyEmailWithCode(w http.ResponseWriter, r *http.Request) {
	fmt.Println("chack email verification code")
	userid, success, err := AuthUser(w, r)
	if !success || err != nil {
		fmt.Println("not authenticated", err)
		return
	}

	code, err := getCodeFromBody(w, r)
	if err != nil {
		fmt.Println("error get code from body", err)
		return
	}

	valid, err := validateVerificationCode(userid, code)
	if err != nil {
		fmt.Println("not valid", err)
		return
	}

	if valid {
		err := setEmailVerifiedInDB(userid)
		if err != nil {
			return
		}

		fmt.Println("email verified")
	}

	// verifyEmailSendGoodResponse(w)
}

func getCodeFromBody(w http.ResponseWriter, r *http.Request) (string, error) {
	var body struct {
		Code string `json:"code"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return "", err
	}
	return body.Code, nil
}

func validateVerificationCode(userid int, code string) (bool, error) {
    var valid bool
    err := database.DB.QueryRow(`
        SELECT EXISTS(
            SELECT 1 FROM 2_fa_codes
            WHERE userid = ? AND code = ? AND created_at > NOW() - INTERVAL 15 MINUTE
        )`, userid, code).Scan(&valid)
    if err != nil {
        return false, err
    }

    return valid, nil
}

func setEmailVerifiedInDB(userid int) error {
	_, err := database.DB.Exec("UPDATE users SET email_verified = ? WHERE userid = ?", true, userid)
	if err != nil {
		fmt.Println("error updating email_verified:", err)
		return err
	}

	return nil
}

// func verifyEmailSendGoodResponse(w http.ResponseWriter) {
// 	w.Header().Set("Content-Type", "application/json")
// 	w.WriteHeader(http.StatusOK)
// 	json.NewEncoder(w).Encode(map[string]any{
// 		"success": true,
// 	})
// }

// func verifyEmailSendBadResponse(w http.ResponseWriter) {
// 	w.Header().Set("Content-Type", "application/json")
// 	w.WriteHeader(http.StatusOK)
// 	json.NewEncoder(w).Encode(map[string]any{
// 		"success": true,
// 	})
// }
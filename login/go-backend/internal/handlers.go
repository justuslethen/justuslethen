package internal

import (
	"fmt"
	"net/http"
	"encoding/json"

	"go-backend/auth"
	"go-backend/pkg"
)

func SendLogInCheck(w http.ResponseWriter, r *http.Request) {
	fmt.Println("login-check")

	token, _ := auth.GetRefreshTokenCockie(w, r)
	userid, loggedIn, _ := auth.CheckRefreshToken(r, token)

	if !loggedIn {
		return
	}
	userData := pkg.GetAllUserData(userid)
	fmt.Println("userData", userData)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]any{
		"data": userData,
		"loggedIn": true,
	})
}

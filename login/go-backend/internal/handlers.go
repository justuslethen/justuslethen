package internal

import (
	"fmt"
	"net/http"

	"go-backend/pkg"
)

func SendLogInCheck(w http.ResponseWriter, r *http.Request) {
	token, _ := pkg.GetRefreshTokenCockie(w, r)

	loggedIn, userid, _ := pkg.CheckRefreshToken(r, token)

	if loggedIn {
		userData := pkg.GetAllUserData(userid)
		fmt.Println("userData", userData)
	}
}

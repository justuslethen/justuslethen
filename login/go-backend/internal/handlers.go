package internal

import (
	"fmt"
	"net/http"

	"go-backend/pkg"
)

func SendLogInCheck(w http.ResponseWriter, r *http.Request) {
	fmt.Println("login-check")
	
	token, _ := pkg.GetRefreshTokenCockie(w, r)

	fmt.Println("token", token)
	
	loggedIn, userid, _ := pkg.CheckRefreshToken(r, token)
	
	fmt.Println("loggedIn", loggedIn)
	fmt.Println("userid", userid)

	if loggedIn {
		userData := pkg.GetAllUserData(userid)
		fmt.Println("userData", userData)
	}
}

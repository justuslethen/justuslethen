package auth

import (
	// "crypto/rand"
	// "encoding/hex"
	"fmt"
	"net/http"
	"time"

	"go-backend/config"
	"go-backend/database"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

type JWTClaims struct {
	Username string `json:"useranme"`
	Userid   int    `json:"useride"`
	jwt.RegisteredClaims
}

type RefreshClaims struct {
	Userid int `json:"userid"`
	jwt.RegisteredClaims
}

func HashPassword(password string) (string, error) {
	// hash password to store securely
	// bcrypt automatically generates a salt and embeds it in the hash
	hashedBytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(hashedBytes), nil
}

func CheckPassword(hashedPassword, password string) bool {
	// compare hashed password with plain password
	// bycript automaticaly uses salt
	err := bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
	return err == nil
}

func GenerateAccessToken(userid int) (string, error) {
	expirationTime := calcAccessTokenExpirationTime()

	// get pointer to claims
	claims := createJWTClaims(userid, expirationTime)

	// create new jwt token with claims
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	JWTKey := config.AuthConfig.JWTKey

	// add sign with JWT secret
	tokenString, err := token.SignedString([]byte(JWTKey))
	if err != nil {
		return "", err
	}
	return tokenString, nil
}

func createJWTClaims(userid int, expirationTime time.Time) *JWTClaims {
	// create JWT claims
	// with userid
	claims := &JWTClaims{
		Userid: userid,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	return claims
}

func calcAccessTokenExpirationTime() time.Time {
	duration := config.AuthConfig.AccessDuration

	expirationTime := time.Now().Add(time.Duration(duration) * time.Second)
	return expirationTime
}

func calcRefreshTokenExpirationTime() time.Time {
	duration := config.AuthConfig.RefreshDuration

	expirationTime := time.Now().Add(time.Duration(duration) * time.Second)
	return expirationTime
}

func ValidateAccessToken(tokenString string) (*JWTClaims, error) {
	claims := &JWTClaims{}

	token, err := jwt.ParseWithClaims(tokenString, claims, func(t *jwt.Token) (interface{}, error) {
		return config.AuthConfig.JWTKey, nil
	})

	if err != nil || !token.Valid {
		return nil, err
	}

	return claims, nil
}

func LoginNewDevice(w http.ResponseWriter, r *http.Request, userid int, username string) {
	refreshToken, err := GenerateRefreshToken(userid, username)
	if err != nil {
		fmt.Println("generate refresh token error", err)
		return
	}

	err = saveRefreshToken(r, userid, refreshToken)
	if err != nil {
		fmt.Println("save refresh token error", err)
		return
	}

	accessToken, err := GenerateAccessToken(userid)
	if err != nil {
		fmt.Println("generate access token error", err)
		return
	}

	setTokens(w, accessToken, refreshToken)
}

func GenerateRefreshToken(userid int, usernmae string) (string, error) {
	expirationTime := calcRefreshTokenExpirationTime()

	claims := createJWTClaims(userid, expirationTime)

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	// signiere mit dem gleichen Secret wie Session-Token
	tokenString, err := token.SignedString([]byte(config.AuthConfig.JWTKey))
	if err != nil {
		return "", err
	}

	return tokenString, nil
}

func setTokens(w http.ResponseWriter, accessToken, refreshToken string) {
	setAccessToken(w, accessToken)
	setRefreshToken(w, refreshToken)

	fmt.Println("setAccessToken and setRefreshToken")
}

func setAccessToken(w http.ResponseWriter, accessToken string) {
	duartion := config.AuthConfig.AccessDuration
	http.SetCookie(w, &http.Cookie{
		Name:     "access_token",
		Value:    accessToken,
		Path:     "/",
		HttpOnly: true,
		Secure:   true, // only https
		MaxAge:   duartion,
		SameSite: http.SameSiteStrictMode,
	})
}

func setRefreshToken(w http.ResponseWriter, refreshToken string) {
	duartion := config.AuthConfig.RefreshDuration
	http.SetCookie(w, &http.Cookie{
		Name:     "refresh_token",
		Value:    refreshToken,
		Path:     "/",
		HttpOnly: true,
		Secure:   true, // only https
		MaxAge:   duartion,
		SameSite: http.SameSiteStrictMode,
	})
}

func saveRefreshToken(r *http.Request, userid int, token string) error {
	// insert token, userdata, useragent, ip in database
	_, err := database.DB.Exec("INSERT INTO tokens (userid, token, ip_last_used, ip_created, number_used, device_name, agent, app_name) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
		userid, token, r.RemoteAddr, r.RemoteAddr, 0, "unnamed device", r.Header.Get("User-Agent"), config.ServerConfig.AppName)

	if err != nil {
		return err
	}

	return nil
}

func CheckRefreshToken(r *http.Request, token string) (int, bool, error) {
	// var userid int
	var userid int
	var agent string

	err := database.DB.QueryRow("SELECT agent, userid FROM tokens WHERE token = ?", token).Scan(&agent, &userid)
	if err != nil {
		return 0, false, err
	}

	if agent == r.Header.Get("User-Agent") {
		return userid, true, nil
	}

	return 0, false, nil
}

func doesRefreshTokenExist(token string) (bool, error) {
	var exists bool

	// check in database if the token exists
	err := database.DB.QueryRow("SELECT EXISTS(SELECT 1 FROM tokens WHERE token = ?)", token).Scan(&exists)
	if err != nil {
		return false, err
	}
	return exists, nil
}

func GetRefreshTokenCockie(w http.ResponseWriter, r *http.Request) (string, bool) {
	cookie, err := r.Cookie("refresh_token")
	if err != nil {
		// http.Error(w, "No refresh token found", http.StatusUnauthorized)
		return "", false
	}
	return cookie.Value, true
}

func GetAccessTokenCockie(w http.ResponseWriter, r *http.Request) (string, error) {
	cookie, err := r.Cookie("access_token")
	if err != nil {
		// http.Error(w, "No access token found", http.StatusUnauthorized)
		return "", err
	}
	return cookie.Value, nil
}

func AuthUser(w http.ResponseWriter, r *http.Request) (int, bool, error) {
	userid, err := authWithAccessToken(w, r)
	success := err == nil

	if err != nil {
		// if access-token is not valid
		// check refresh-token

		userid, success, err := authWithRefreshToken(w, r)

		// if refresh-token is valid create new access-token

		if !success || err != nil {
			// redirect to login page
			http.Error(w, "Unauthorized", http.StatusUnauthorized)

			return 0, false, err
		}

		err = refreshAccessToken(w, userid)
		if err != nil {
			return 0, false, err
		}

		return userid, true, err
	}

	return userid, success, err
}

func authWithAccessToken(w http.ResponseWriter, r *http.Request) (int, error) {
	token, err := GetAccessTokenCockie(w, r)

	if err != nil {
		return 0, err
	}

	// returns JWT claims with userid in it
	claims, err := ValidateAccessToken(token)

	if err != nil {
		return 0, err
	}

	return claims.Userid, nil
}

func authWithRefreshToken(w http.ResponseWriter, r *http.Request) (int, bool, error) {
	token, found := GetRefreshTokenCockie(w, r)

	// when cockie is not found return no success
	if !found {
		return 0, false, nil
	}

	// when cockie was found check validity
	userid, success, err := CheckRefreshToken(r, token)

	return userid, success, err
}

func refreshAccessToken(w http.ResponseWriter, userid int) error {
	// generate new accesstoken and set it as cockie

	token, err := GenerateAccessToken(userid)

	if err != nil {
		return err
	}

	setAccessToken(w, token)

	return nil
}

package pkg

import (
	// "crypto/rand"
	// "encoding/hex"
	"fmt"
	"net/http"
	"strconv"
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

func GenerateAccessToken(userid int, username string) (string, error) {
	expirationTime := calcAccessTokenExpirationTime()

	// get pointer to claims
	claims := createJWTClaims(userid, username, expirationTime)

	// create new jwt token with claims
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	JWTKey := config.ServerConfig.JWTKey

	// add sign with JWT secret
	tokenString, err := token.SignedString([]byte(JWTKey))
	if err != nil {
		return "", err
	}
	return tokenString, nil
}

func createJWTClaims(userid int, username string, expirationTime time.Time) *JWTClaims {
	// create JWT claims
	// with username and userid
	claims := &JWTClaims{
		Username: username,
		Userid:   userid,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	return claims
}

func calcAccessTokenExpirationTime() time.Time {
	duration := calcAccessTokenDuration()

	expirationTime := time.Now().Add(time.Duration(duration))
	return expirationTime
}

func calcRefreshTokenExpirationTime() time.Time {
	duration := calcRefreshTokenDuration()

	expirationTime := time.Now().Add(time.Duration(duration))
	return expirationTime
}

func ValidateAccessToken(tokenString string) (*JWTClaims, error) {
	claims := &JWTClaims{}

	token, err := jwt.ParseWithClaims(tokenString, claims, func(t *jwt.Token) (interface{}, error) {
		return config.ServerConfig.JWTKey, nil
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

	accessToken, err := GenerateAccessToken(userid, username)
	if err != nil {
		fmt.Println("generate access token error", err)
		return
	}

	setTokens(w, accessToken, refreshToken)
}

func GenerateRefreshToken(userid int, usernmae string) (string, error) {
	expirationTime := calcRefreshTokenExpirationTime()

	claims := createJWTClaims(userid, usernmae, expirationTime)

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	// signiere mit dem gleichen Secret wie Session-Token
	tokenString, err := token.SignedString([]byte(config.ServerConfig.JWTKey))
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
	duartion := calcAccessTokenDuration()
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
	duartion := calcRefreshTokenDuration()
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

func calcAccessTokenDuration() int {
	// convert .env config to int
	duration, err := strconv.Atoi(config.ServerConfig.AccessDuration)
	if err != nil {
		fmt.Println("failed to convert config to int!")
	}

	return duration
}

func calcRefreshTokenDuration() int {
	// convert .env config to int
	duration, err := strconv.Atoi(config.ServerConfig.RefreshDuration)
	if err != nil {
		fmt.Println("failed to convert config to int!")
	}

	return duration
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

func CheckRefreshToken(r *http.Request, token string) (bool, int, error) {
	// var userid int
	var userid int
	var agent string

	err := database.DB.QueryRow("SELECT agent, userid FROM tokens WHERE token = ?", token).Scan(&agent, &userid)
	if err != nil {
		return false, 0, err
	}

	if agent == r.Header.Get("User-Agent") {
		return true, userid, nil
	}

	return false, 0, nil
}

func doesRefreshToeknExist(token string) (bool, error) {
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

func GetAccessTokenCockie(w http.ResponseWriter, r *http.Request) (string, bool) {
	cookie, err := r.Cookie("access_token")
	if err != nil {
		// http.Error(w, "No access token found", http.StatusUnauthorized)
		return "", false
	}
	return cookie.Value, true
}

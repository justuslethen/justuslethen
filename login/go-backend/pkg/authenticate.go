package pkg

import (
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"strconv"
	"time"
	"net/http"

	"go-backend/config"
	"go-backend/database"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

type JWTClaims struct {
	Username string `json:"useranme"`
	Userid int `json:"useride"`
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

func GenerateJWT( userid int, username string) (string, error) {
	expirationTime := calcAccessJWTExpirationTime()
	
	// get pointer to claims
	claims := createJWTClaims(userid, username, expirationTime)

	// create new jwt token with claims
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	JWTKey := config.ServerConfig.JWTKey

	// add sign with JWT secret
	tokenString, err := token.SignedString(JWTKey)
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
		Userid: userid,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	return claims
}

func calcAccessJWTExpirationTime() time.Time {
	// convert .env config to int
	duration, err := strconv.Atoi(config.ServerConfig.JWTExpiration)
	if err != nil {
		fmt.Println("failed to convert config to int!")
	}

	expirationTime := time.Now().Add(time.Duration(duration) * time.Hour)

	return expirationTime
}

func ValidateJWT(tokenString string) (*JWTClaims, error) {
	claims := &JWTClaims{}

	token, err := jwt.ParseWithClaims(tokenString, claims, func(t *jwt.Token) (interface{}, error) {
		return config.ServerConfig.JWTKey, nil
	})

	if err != nil || !token.Valid {
		return nil, err
	}

	return claims, nil
}

func LoginNewDevice(w http.ResponseWriter, userid int, username string) {
	refreshToken, err := GenerateRefreshToken(userid, username)
	if err != nil {
		fmt.Println("error", err)
		return
	}
	
	accessToken, err := GenerateJWT(userid, username)
	if err != nil {
		fmt.Println("error", err)
		return
	}

	setTokens(w, accessToken, refreshToken)
}

func GenerateRefreshToken( userid int, usernmae string) (string, error) {
	expirationTime := calcRefreshJWTExpirationTime()

	claims := createJWTClaims(userid, usernmae, expirationTime)

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	// signiere mit dem gleichen Secret wie Session-Token
	tokenString, err := token.SignedString(config.ServerConfig.JWTKey)
	if err != nil {
		return "", err
	}

	return tokenString, nil
}

func calcRefreshJWTExpirationTime() time.Time {
	// convert .env config to int
	duration, err := strconv.Atoi(config.ServerConfig.RefreshJWTDuration)
	if err != nil {
		fmt.Println("failed to convert config to int!")
	}

	// duration in days
	expirationTime := time.Now().Add(time.Duration(duration) * 24 * time.Hour)

	return expirationTime
}

func setTokens(w http.ResponseWriter, accessToken, refreshToken string) {
	setAccessToken(w, accessToken)
	setRefreshToken(w, refreshToken)
}

func setAccessToken(w http.ResponseWriter, accessToken string) {
	http.SetCookie(w, &http.Cookie{
		Name:     "access_token",
		Value:    accessToken,
		Path:     "/",
		HttpOnly: true,
		Secure:   true, // only https
		MaxAge:   15 * 60, 
		SameSite: http.SameSiteStrictMode,
	})
}

func setRefreshToken(w http.ResponseWriter, refreshToken string) {
	http.SetCookie(w, &http.Cookie{
		Name:     "refresh_token",
		Value:    refreshToken,
		Path:     "/",
		HttpOnly: true,
		Secure:   true, // only https
		MaxAge:   30 * 24 * 60 * 60,
		SameSite: http.SameSiteStrictMode,
	})
}
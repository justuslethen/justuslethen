package pkg

import (
	"fmt"
	"strconv"
	"time"

	"go-backend/config"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

type JWTClaims struct {
	Username string `json:"useranme"`
	Userid int `json:"useride"`
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

func GenerateJWT(username string, userid int) (string, error) {
	expirationTime := calcJWTExpirationTime()
	
	// get pointer to claims
	claims := createJWTClaims(username, userid, expirationTime)

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

func createJWTClaims(username string, userid int, expirationTime time.Time) *JWTClaims {
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

func calcJWTExpirationTime() time.Time {
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
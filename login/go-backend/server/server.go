package server

import (
    "fmt"
    "net/http"
    "go-backend/internal"
    // "go-backend/pkg"
)

func Start(addr string) error {
    mux := http.NewServeMux()

    fmt.Println("server started at", addr)

    // APIs
    
    // server dist files for frontend
    mux.HandleFunc("/", internal.ServeFrontend)

    mux.HandleFunc("/api/register-new-user", internal.RegisterUser)

    mux.HandleFunc("/api/amiloggedin", internal.SendLogInCheck)

    mux.HandleFunc("/api/email/send-verification-code", )

    return http.ListenAndServe(addr, mux)
}
package server

import (
    "net/http"
    // "go-backend/internal"
    // "go-backend/pkg"
)

func Start(addr string) error {
    mux := http.NewServeMux()

    // APIs
    // mux.HandleFunc("/", pkg.RootHandler)

    // mux.HandleFunc("/api/hello", internal.HelloHandler)

    return http.ListenAndServe(addr, mux)
}
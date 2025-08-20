package main

import (
	"go-backend/config"
	"go-backend/server"
	"go-backend/internal"
    // "database/sql"
    "log"
    // "net/http"
    // _ "github.com/go-sql-driver/mysql"
)

func main() {
	// load configs into global var "ServerConfig" in pkg "configs"
	err := config.LoadConfig()
	if err != nil {
		log.Fatalf("Error loading config: %v", err)
	}

	if err := internal.ConnectDB(); err!= nil {
		log.Fatalf("Error loading DB: %v", err)
	}

	// try starting the server with configs
	addr := ":" + config.ServerConfig.ServerPort
    if err := server.Start(addr); err != nil {
		log.Fatal(err)
    }
}

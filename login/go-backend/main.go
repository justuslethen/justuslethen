package main

import (
	"fmt"
	"go-backend/config"
	"go-backend/database"
	"go-backend/server"

	// "database/sql"
	"log"
	// "net/http"
	// _ "github.com/go-sql-driver/mysql"
)

func main() {
	// load configs into global var "ServerConfig" in pkg "configs"
	err := config.LoadAllConfigs()
	if err != nil {
		log.Fatalf("Error loading config: %v", err)
	}

	if err := database.ConnectDB(); err!= nil {
		log.Fatalf("Error loading DB: %v", err)
	}

	// try starting the server with configs
	portStr := fmt.Sprint(config.ServerConfig.ServerPort)
	
	addr := ":" + portStr
    if err := server.Start(addr); err != nil {
		log.Fatal(err)
    }
}

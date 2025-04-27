package main

import (
    "github.com/gin-gonic/gin"
    "timetrack/router"
    "timetrack/controllers"
)

func main() {
    // Create DB
    controllers.InitDB()

    // Start the server
    r := gin.Default()

    // Set the routes for diffecerent APIs
    router.RegisterAuthRoutes(r)

    r.Run(":8080")
}
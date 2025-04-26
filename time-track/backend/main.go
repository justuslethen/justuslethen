package main

import (
    "github.com/gin-gonic/gin"
    "timetrack/router"
)

func main() {
    r := gin.Default()

    router.RegisterAuthRoutes(r)

    r.Run(":8080")
}
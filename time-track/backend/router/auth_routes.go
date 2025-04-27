package router


import (
    "github.com/gin-gonic/gin"
    "timetrack/controllers"
)


func RegisterAuthRoutes(r *gin.Engine) {
    r.POST("/register-new-user", controllers.RegisterUser)
}
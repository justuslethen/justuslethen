package controllers

var errorMessages = map[string]string{
	"username_required":   "username_reqired",
	"password_required":   "password_required",
	"email_required":      "email_required",
	"first_name_required": "first_name_required",

	"invalid_username":   "invalid_username",
	"invalid_password":   "invalid_password",
	"invalid_email":      "invalid_email",
	"invalid_first_name": "invalid_first_name",

	"password_too_short": "password_too_short",

	"invalid_request": "invalid_request",
}

var logTypes = map[string]string{
	"create_account":   "create_account",
	"change_name":   	"change_name",

	"new_token":   		"new_token",
	"new_device":   	"new_device",
	"revoke_token":   	"revoke_token",

	"create_task":  	"create_task",
	"change_task":   	"change_task",
}

// server centralized error messages
// returns the error message for the given key
// if the key is not found, it returns "unknown_error"
func EM(key string) string {

	message, exists := errorMessages[key]

	// if error message is not defined return an unknown error
	if !exists {
		return "unknown_error"
	}

	return message
}

func LogType(key string) string {
	logType, exists := logTypes[key]

	// if error message is not defined return an unknown error
	if !exists {
		return "no_type"
	}

	return logType
}

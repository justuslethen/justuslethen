package mailer

import (
// "fmt"
)

func SendVerificationEmail(userid int, code string) {
	email := Email{
		RecieverAddr:	"test-mail@mail.com",
		Subject:		"Subject",
		HtmlBody: 		"Hallo",
	}
	SendHTMLEmail(email)
}

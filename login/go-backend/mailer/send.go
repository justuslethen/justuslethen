package mailer

import (
	"go-backend/config"
	"gopkg.in/gomail.v2"
)

type Email struct {
	RecieverAddr 	string
	Subject			string
	HtmlBody 		string
}


func SendHTMLEmail(email Email) error {
	c := config.MailerConfig

	// build email
	m := gomail.NewMessage()
	m.SetHeader("From", c.Username)
	m.SetHeader("To", email.RecieverAddr)
	m.SetHeader("Subject", email.Subject)
	m.SetBody("text/html", email.HtmlBody)

	d := gomail.NewDialer(c.Host, c.Port, c.Username, c.Password)

	return d.DialAndSend(m)
}
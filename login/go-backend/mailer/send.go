package mailer

import (
	"go-backend/config"
	"gopkg.in/gomail.v2"
)

func SendHTMLEmail(to, subject, htmlBody string) error {
	m := gomail.NewMessage()
	m.SetHeader("From", "deine-email@example.com")
	m.SetHeader("To", to)
	m.SetHeader("Subject", subject)
	m.SetBody("text/html", htmlBody)

	c := config.MailerConfig

	d := gomail.NewDialer(c.Host, c.Port, c.Username, c.Password)

	return d.DialAndSend(m)
}
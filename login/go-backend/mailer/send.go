package mailer

import (
	"bytes"
	"go-backend/config"
	"gopkg.in/gomail.v2"
	"html/template"
)

type Email struct {
	RecieverAddr string
	Subject      string
	HtmlBody     string
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

func parseHtmlAndStyle(htmlPath string, data interface{}) (string, error) {
	tmpl, err := template.ParseFiles(
		"templates/base.html",
		"templates/"+htmlPath,
	)
	if err != nil {
		return "", err
	}

	var buf bytes.Buffer
	if err := tmpl.ExecuteTemplate(&buf, "base.html", data); err != nil {
		return "", err
	}

	return buf.String(), nil
}

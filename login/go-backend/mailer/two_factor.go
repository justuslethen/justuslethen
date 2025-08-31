package mailer

import (
    "bytes"
    "html/template"
    "log"
    "go-backend/pkg"
)

type VerificationEmailData struct {
	Username 	string
	Code 		string
}


func SendVerificationEmail(userid int, code string) {
    username, emailAddress, err := pkg.GetUsernameAndEmail(userid)
    if err != nil {
        log.Println("error while loading userdata", err)
        return
    }

    data := VerificationEmailData{
        Username: username,
        Code:     code,
    }

    tmpl, err := template.ParseFiles("templates/verification_email.html")
    if err != nil {
        log.Println("error while loading templates:", err)
        return
    }

    var body bytes.Buffer
    if err := tmpl.Execute(&body, data); err != nil {
        log.Println("error while rendering templates:", err)
        return
    }

    email := Email{
        RecieverAddr: emailAddress,
        Subject:      "Your verification code",
        HtmlBody:     body.String(),
    }

    SendHTMLEmail(email)
}
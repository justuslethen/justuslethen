package mailer

import (
    // "bytes"
    "log"
    "go-backend/pkg"
)

type VerificationEmailData struct {
	Username 	string
	Code 		string
}


func SendVerificationEmail(userid int, code string) (string, error) {
    username, emailAddress, err := pkg.GetUsernameAndEmail(userid)
    if err != nil {
        log.Println("error while loading userdata", err)
        return "", err
    }

    data := VerificationEmailData{
        Username: username,
        Code:     code,
    }

    body, err := parseHtmlAndStyle("verification_email.html", data)
    if err != nil {
        log.Println("error while loading templates:", err)
        return "", err
    }


    email := Email{
        RecieverAddr: emailAddress,
        Subject:      "Your verification code",
        HtmlBody:     body,
    }

    SendHTMLEmail(email)

    return emailAddress, nil
}
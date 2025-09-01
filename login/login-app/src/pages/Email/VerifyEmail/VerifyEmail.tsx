// import styles from "./VerifyEmail.module.css"

import Text from "../../../components/Text/Text.tsx"
import Container from "../../../components/Container/Container.tsx"
import Input from "../../../components/Input/Input.tsx"
import Button from "../../../components/Button/Button.tsx"
import LoadingScreen from "../../../components/LoadingScreen/LoadingScreen.tsx"
import { t } from "../../../i18n.ts"
import { API_URL } from "../../../config.ts"
import { useState } from "react"
import { useNavigate } from "react-router-dom"


const VerifyEmail = () => {
    const navigate = useNavigate();

    const [wasEmailSend, setWasEmailSend] = useState(false);
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [isLoading, setIsLoading] = useState(false);


    const requestAuthMail = () => {
        const url = API_URL;
        setIsLoading(true);

        fetch(url + "/api/email/send-verification-code")
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    setEmail(data.email);
                    setWasEmailSend(true);
                }
                setIsLoading(false);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const checkVerificationCode = () => {
        const url = API_URL;

        fetch(url + "/api/email/check-verification-code", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code: code })
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    return (
        <>
            {isLoading ? (
                <LoadingScreen />
            ) : null}

            <Text text={t("email.verify.title")} type="h2" center={true} />

            <div className="content">
                <Container maxWidth={380}>
                    {wasEmailSend ? (
                        <Text text={t("email.verify.text") + email} type="p1" center={true} />
                    ) : null}
                    <Input
                        label={t("input.verification.label")}
                        placeholder={t("input.verification.placeholder")}
                        onChange={(e) => { setCode(e.target.value) }}
                    />
                    <Text text={t("email.verify.button.send-again")} type="h3" center={false} onclick={() => { requestAuthMail() }} />

                    <Button text={t("email.verify.button.skip")} color="grey" onclick={() => { navigate("/") }} />
                    <Button text={t("email.verify.button.verify")} color="black" onclick={() => { checkVerificationCode() }} />
                </Container>
            </div>
        </>
    )
}

export default VerifyEmail;
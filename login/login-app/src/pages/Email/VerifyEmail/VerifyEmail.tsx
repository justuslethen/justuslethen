// import styles from "./VerifyEmail.module.css"

import Text from "../../../components/Text/Text.tsx"
import Container from "../../../components/Container/Container.tsx"
import Input from "../../../components/Input/Input.tsx"
import Button from "../../../components/Button/Button.tsx"
import { t } from "../../../i18n.ts"


const VerifyEmail = () => {
    const user = {
        email: "email"
    }

    return (
        <>
            <Text text={t("email.verify.title")} type="h2" center={true} />

            <div className="content">
                <Container maxWidth={380}>
                    <Text text={`${t("email.verify.text")} ${user.email}`} type="p2" center={true} />
                    <Input
                        label={t("input.verification.label")}
                        placeholder={t("input.verification.placeholder")}
                    />
                    <Text text={t("email.verify.button.send-again")} type="h3" center={false} onclick={() => { }} />


                    <Button text={t("email.verify.button.skip")} color="grey" onclick={() => { }} />
                    <Button text={t("email.verify.button.verify")} color="black" onclick={() => { }} />
                </Container>
            </div>
        </>
    )
}

export default VerifyEmail;
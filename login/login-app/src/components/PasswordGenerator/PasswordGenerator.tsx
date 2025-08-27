import { useState } from "react"
import { t } from '../../i18n.ts';

import styles from "./PasswordGenerator.module.css"

import Button from "../Button/Button.tsx"
import Text from "../Text/Text.tsx"

interface PasswordGeneratorProps {
    size: string
}

const PasswordGenerator = (props: PasswordGeneratorProps) => {
    const [generatedPassword, changeGeneratedPassword] = useState("Passw-orT")

    // 
    // 
    props
    changeGeneratedPassword
    // 
    // 

    return (
        <>
            <div className={styles.mainContainer}>
                <Text text={t("password_generator.header")} center={true} type="h2" />
                <div className={styles.passwordContainer}>
                    <>
                        {Array.from(generatedPassword).map(char => {
                            return (
                                <div className={styles.charBox}>
                                    {char}
                                </div>
                            )
                        })}
                    </>
                </div>
                <Text text={t("password_generator.description")} center={true} type="description" />
                <Button color="white" text={t("password_generator.buttons.generate_new")} onclick={() => { }} />
                <Button color="grey" text={t("password_generator.buttons.insert")} onclick={() => { }} />
            </div>
        </>
    )
}

export default PasswordGenerator;
import { useState } from "react"

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
                <Text text="Header" center={true} type="h2" />
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
                <Button color="blue" text="Button" onclick={() => { }} />
            </div>
        </>
    )
}

export default PasswordGenerator;
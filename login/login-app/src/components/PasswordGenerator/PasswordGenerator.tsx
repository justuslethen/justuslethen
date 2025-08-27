import { useState } from "react"
import { t } from '../../i18n.ts';
import { PASSWORD_LENGTH } from '../../config.ts';

import styles from "./PasswordGenerator.module.css"

import Button from "../Button/Button.tsx"
import Text from "../Text/Text.tsx"

interface PasswordGeneratorProps {
    size: string
}

const PasswordGenerator = (props: PasswordGeneratorProps) => {
    const [generatedPassword, changeGeneratedPassword] = useState("Passw-orT")

    const createPassword = () => {
        let password = "";

        const charsCount = getDifferentCharsCount()

        password = getCharsForCount(password, charsCount);
        password = mixPassword(password);

        changeGeneratedPassword(password);
    }


    const getDifferentCharsCount = () => {
        let charsCount = {
            numbers: 0,
            upperChars: 0,
            lowerChars: 0,
            specialChars: 0
        };

        const random: number = getRandomIntCrypto(2, PASSWORD_LENGTH - 2)

        if (random == 2) {
            charsCount = calcCharsCountV1(charsCount);
        } else if (random == PASSWORD_LENGTH - 2) {
            charsCount = calcCharsCountV2(charsCount);
        } else {
            charsCount = calcCharsCountV3(charsCount, random);
        }

        console.log("charsCount: ", charsCount)

        return charsCount;
    }


    const calcCharsCountV1 = (charsCount: any) => {
        charsCount.numbers = 1;
        charsCount.upperChars = 1;

        charsCount.lowerChars = getRandomIntCrypto(1, PASSWORD_LENGTH - 3);
        charsCount.specialChars = PASSWORD_LENGTH - charsCount.numbers - charsCount.upperChars - charsCount.lowerChars;

        return charsCount;
    }


    const calcCharsCountV2 = (charsCount: any) => {
        charsCount.lowerChars = 1;
        charsCount.specialChars = 1;

        charsCount.numbers = getRandomIntCrypto(1, PASSWORD_LENGTH - 3);
        charsCount.upperChars = PASSWORD_LENGTH - charsCount.numbers - charsCount.specialChars - charsCount.lowerChars;

        return charsCount;
    }


    const calcCharsCountV3 = (charsCount: any, random: number) => {
        charsCount.lowerChars = getRandomIntCrypto(1, random - 1);
        charsCount.numbers = random - charsCount.lowerChars;

        charsCount.specialChars = getRandomIntCrypto(1, PASSWORD_LENGTH - random);
        charsCount.upperChars = PASSWORD_LENGTH - random - charsCount.specialChars;

        return charsCount;
    }


    const getCharsForCount = (password: string, charsCount: any) => {
        const uperChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const lowerChars = "abcdefghijklmnopqrstuvwxyz";
        const numbers = "0123456789";
        const specialChars = "!$%&/()=?*+-_:;,.'{}[]";

        password += getRandomCharsFromArray(uperChars, charsCount.upperChars);
        password += getRandomCharsFromArray(lowerChars, charsCount.lowerChars);
        password += getRandomCharsFromArray(numbers, charsCount.numbers);
        password += getRandomCharsFromArray(specialChars, charsCount.specialChars);

        return password;
    }


    const getRandomIntCrypto = (min: number, max: number): number => {
        // nclude max in min
        const range = max + 1 - min;
        if (range <= 0) throw new Error("max must be greater than min");

        // empty array of length 1
        const randomArray = new Uint32Array(1);

        // fill with random number
        crypto.getRandomValues(randomArray);

        // calc number with range and add min
        return min + (randomArray[0] % range);
    }


    const getRandomCharsFromArray = (chars: string, count: number) => {
        let result = "";
        for (let i = 0; i < count; i++) {
            // secure random index
            const randomArray = new Uint32Array(1);
            crypto.getRandomValues(randomArray);
            const index = randomArray[0] % chars.length;

            result += chars.charAt(index);
        }
        return result;
    }


    const mixPassword = (password: string) => {
        // Convert string to array
        let chars = password.split("");

        // Fisher-Yates shuffle
        for (let i = chars.length - 1; i > 0; i--) {
            const j = getRandomIntCrypto(0, i);
            [chars[i], chars[j]] = [chars[j], chars[i]];
        }

        return chars.join("");
    }


    // 
    props
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
                <Button color="white" text={t("password_generator.buttons.generate_new")} onclick={() => { createPassword() }} />
                <Button color="grey" text={t("password_generator.buttons.insert")} onclick={() => { }} />
            </div>
        </>
    )
}

export default PasswordGenerator;
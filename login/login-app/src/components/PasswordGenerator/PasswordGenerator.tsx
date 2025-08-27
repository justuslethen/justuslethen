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
    }


    const calcCharsCountV1 = (charsCount: any) => {
        charsCount.numbers = 1;
        charsCount.upperChars = 1;

        charsCount.lowerChars = getRandomIntCrypto(1, PASSWORD_LENGTH - 3);
        charsCount.specialChars = charsCount.numbers + charsCount.upperChars + charsCount.lowerChars - PASSWORD_LENGTH;

        return charsCount;
    }


    const calcCharsCountV2 = (charsCount: any) => {
        charsCount.lowerChars = 1;
        charsCount.specialChars = 1;

        charsCount.numbers = getRandomIntCrypto(1, PASSWORD_LENGTH - 3);
        charsCount.upperChars = charsCount.numbers + charsCount.specialChars + charsCount.lowerChars - PASSWORD_LENGTH;

        return charsCount;
    }


    const calcCharsCountV3 = (charsCount: any, random: number) => {
        charsCount.lowerChars = getRandomIntCrypto(1, random - 1);
        charsCount.numbers = random - charsCount.lowerChars;

        charsCount.specialChars = getRandomIntCrypto(1, PASSWORD_LENGTH - random);
        charsCount.upperChars = PASSWORD_LENGTH - random - charsCount.specialChars;

        return charsCount;
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
    };


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
                <Button color="white" text={t("password_generator.buttons.generate_new")} onclick={() => { }} />
                <Button color="grey" text={t("password_generator.buttons.insert")} onclick={() => { }} />
            </div>
        </>
    )
}

export default PasswordGenerator;
import React, { useState } from 'react';
import { t } from '../../i18n.ts';
import { API_URL } from '../../config.ts';

import Text from '../../components/Text/Text.tsx';
import Spaceholder from '../../components/Spaceholder/Spaceholder.tsx';
import Button from '../../components/Button/Button.tsx';
import Input from '../../components/Input/Input.tsx';
import styles from './Registrate.module.css';
import Container from '../../components/Container/Container.tsx';
// import { useNavigate } from 'react-router-dom';

const Registrate = () => {
    // const navigate = useNavigate();

    // all form states to registrate
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [userName, setUserName] = useState("");
    const [bio, setBio] = useState("");
    const [password, setPassword] = useState("");


    // adjust input to email pattern
    const setEmailToPattern = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        // set lowercase
        let lowercased = e.target.value.toLowerCase();

        // delete chars that are not prat of email
        lowercased = lowercased.replace(/[^a-z0-9@._-]/g, '');

        setEmail(lowercased);
    }


    const getFormDataJSON = () => {
        return {
            email: email,
            name: name,
            username: userName,
            bio: bio,
            password: password
        }
    }


    const sendFormular = () => {
        // send the formular data to backend
        const data: any = getFormDataJSON();
        fetchData(data);
    }







    return (
        <>
            <div className="text-content">
                <Text text={t("app_name")} type="h1" />
                <Text text={t("registrate.title")} type="h2" center={true} />
            </div>

            <div className={`content ${styles.content}`}>
                <Container maxWidth={380}>
                    <section className={styles.section}>
                        <Input
                            value={email}
                            label={t("input.email.label")}
                            onChange={(e) => { setEmailToPattern(e) }}
                            placeholder={t("input.email.placeholder")}
                        />
                    </section>

                    <section className={styles.section}>
                        <Input
                            value={name}
                            label={t("input.name.label")}
                            onChange={(e) => { setName(e.target.value) }}
                            placeholder={t("input.name.placeholder")}
                        />
                    </section>

                    <section className={styles.section}>
                        <Input
                            value={userName}
                            label={t("input.username.label")}
                            onChange={(e) => { setUserName(e.target.value) }}
                            placeholder={t("input.username.placeholder")}
                        />
                        <Text
                            text={t("registrate.username.description")}
                            type="description"
                        />
                    </section>

                    <section className={styles.section}>
                        <Input
                            type="password"
                            value={password}
                            label={t("input.password.label")}
                            onChange={(e) => { setPassword(e.target.value) }}
                            placeholder={t("input.password.placeholder")}
                        />
                        <Text
                            text={t("registrate.password.description")}
                            type="description"
                        />
                    </section>

                    <section className={styles.section}>
                        <Input
                            value={bio}
                            multiline={true}
                            label={t("input.bio.label")}
                            onChange={(e) => { setBio(e.target.value) }}
                            placeholder={t("input.bio.placeholder")} />
                        <Spaceholder size={1} />
                    </section>

                    <section className={styles.section}>
                        <Button
                            text={t("registrate.button")}
                            color="black"
                            onclick={() => { sendFormular() }}
                        />
                    </section>
                </Container>
            </div>
        </>
    )
}

export default Registrate;
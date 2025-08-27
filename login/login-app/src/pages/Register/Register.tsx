import React, { useState } from 'react';
import { t } from '../../i18n.ts';
import { API_URL } from '../../config.ts';

import styles from './Register.module.css';

import Text from '../../components/Text/Text.tsx';
import Spaceholder from '../../components/Spaceholder/Spaceholder.tsx';
import Button from '../../components/Button/Button.tsx';
import Input from '../../components/Input/Input.tsx';
import Container from '../../components/Container/Container.tsx';
import PasswordGenerator from '../../components/PasswordGenerator/PasswordGenerator.tsx';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const navigate = useNavigate();

    // all form states to register
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [userName, setUserName] = useState("");
    const [bio, setBio] = useState("");
    const [password, setPassword] = useState("");

    const [emailInputTip, setEmailInputTip] = useState("");
    const [nameInputTip, setNameInputTip] = useState("");
    const [userNameInputTip, setUserNameInputTip] = useState("");
    const [bioInputTip, setBioInputTip] = useState("");
    const [passwordInputTip, setPasswordInputTip] = useState("");

    const [showPassword, setShowPassword] = useState(false)


    // adjust input to email pattern
    const setEmailToPattern = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        // set lowercase
        let email = e.target.value.toLowerCase();

        // delete chars that are not prat of email
        email = email.replace(/[^a-z0-9@._-]/g, '');

        setEmail(email);
    }


    // adjust input to username pattern
    const setUsernameToPattern = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        // set lowercase
        let username = e.target.value.toLowerCase();

        username = username.replace(" ", "_");

        // remove not allowed chars in username
        username = username.replace(/[^a-z0-9._]/g, '');

        setUserName(username);
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
        const res: any = fetchData(data);

        if (res.success) {
            // handle success
            navigate("/");
        }
    }


    const fetchData = async (data: any) => {
        const url = API_URL;

        fetch(url + "/api/register-new-user", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }).then(response => response.json())
            .then(data => {
                handleResponse(data);

                return { "success": true, data: data };
            })
            .catch((error) => {
                handleServerError(error);

                return { "success": false, error: error };
            });
    }


    const handleResponse = (data: any) => {
        // handle success that come from backend
        setInputTips(data);

        console.log(data);
    }


    const handleServerError = (error: any) => {
        // handle errors that come from backend
        console.log(error);
    }


    const setInputTips = (data: any) => {
        clearAllInputTips();

        if (!data.errors) return;

        const errors: any = data.errors;

        // set email input tip
        if (errors.email_error) {
            setEmailInputTip(t("input_tips." + errors.email_error));
        }

        // set username input tip
        if (errors.username_error) {
            setUserNameInputTip(t("input_tips." + errors.username_error));
        }

        // set name input tip
        if (errors.name_error) {
            setNameInputTip(t("input_tips." + errors.name_error));
        }

        // set password input tip
        if (errors.password_error) {
            setPasswordInputTip(t("input_tips." + errors.password_error));
        }

        // set bio input tip
        if (errors.bio_error) {
            setBioInputTip(t("input_tips." + errors.bio_error));
        }
    }


    const clearAllInputTips = () => {
        setEmailInputTip("");
        setNameInputTip("");
        setUserNameInputTip("");
        setBioInputTip("");
        setPasswordInputTip("");
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
                            inputTip={emailInputTip}
                            placeholder={t("input.email.placeholder")}
                        />
                    </section>

                    <section className={styles.section}>
                        <Input
                            value={name}
                            label={t("input.name.label")}
                            onChange={(e) => { setName(e.target.value) }}
                            inputTip={nameInputTip}
                            placeholder={t("input.name.placeholder")}
                        />
                    </section>

                    <section className={styles.section}>
                        <Input
                            value={userName}
                            label={t("input.username.label")}
                            onChange={(e) => { setUsernameToPattern(e) }}
                            inputTip={userNameInputTip}
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
                            inputTip={passwordInputTip}
                            placeholder={t("input.password.placeholder")}
                        />
                        <Text text={showPassword ? t("login.close_password_generator") : t("login.use_password_generator")} type="h3" onclick={() => { showPassword ? setShowPassword(false) : setShowPassword(true) }} />
                        {showPassword ? (
                            <PasswordGenerator size="small" onClick={setPassword} />
                        ) : null}
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
                            inputTip={bioInputTip}
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

export default Register;
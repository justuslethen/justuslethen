import { t } from '../../i18n.ts';
import Text from '../../components/Text/Text.tsx';
// import Spaceholder from '../../components/Spaceholder/Spaceholder.tsx';
import Button from '../../components/Button/Button.tsx';
import Input from '../../components/Input/Input.tsx';
import Container from '../../components/Container/Container.tsx';
import styles from './Login.module.css';
// import { useNavigate } from 'react-router-dom';

const Login = () => {
    // const navigate = useNavigate();

    return (
        <>
            <div className="text-content">
                <Text text={t("app_name")} type="h1" />
                <Text text={t("login.title")} type="h2" center={true} />
            </div>

            <div className={`content ${styles.content}`}>
                <Container maxWidth={380}>
                    <section className={styles.section}>
                        <Input label={t("input.username-email.label")} placeholder={t("input.username-email.placeholder")} />
                    </section>

                    <section className={styles.section}>
                        <Input label={t("input.password.label")} placeholder={t("input.password.placeholder")} />
                        <Text text={t("login.forgot_password")} type="h3" onclick={() => { }} />
                    </section>

                    <Button text={t("login.button")} color="black" onclick={() => { /* Handle login */ }} />
                </Container>
            </div>
        </>
    )
}

export default Login;
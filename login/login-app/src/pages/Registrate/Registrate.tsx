import { t } from '../../i18n.ts';
import Text from '../../components/Text/Text.tsx';
import Spaceholder from '../../components/Spaceholder/Spaceholder.tsx';
import Button from '../../components/Button/Button.tsx';
import Input from '../../components/Input/Input.tsx';
import styles from './Registrate.module.css';
import Container from '../../components/Container/Container.tsx';
// import { useNavigate } from 'react-router-dom';

const Registrate = () => {
    // const navigate = useNavigate();

    return (
        <>
            <div className="text-content">
                <Text text={t("app_name")} type="h1" />
                <Text text={t("registrate.title")} type="h2" center={true} />
            </div>

            <div className={`content ${styles.content}`}>
                <Container maxWidth={380}>
                    <section className={styles.section}>
                        <Input label={t("input.email.label")} placeholder={t("input.email.placeholder")} />
                    </section>

                    <section className={styles.section}>
                        <Input label={t("input.username.label")} placeholder={t("input.username.placeholder")} />
                        <Text text={t("registrate.username.description")} type="description" />
                    </section>

                    <section className={styles.section}>
                        <Input label={t("input.name.label")} placeholder={t("input.name.placeholder")} />
                    </section>

                    <section className={styles.section}>
                        <Input label={t("input.password.label")} placeholder={t("input.password.placeholder")} />
                        <Text text={t("registrate.password.description")} type="description" />
                    </section>

                    <section className={styles.section}>
                        <Input multiline={true} label={t("input.bio.label")} placeholder={t("input.bio.placeholder")} />
                        <Spaceholder size={1} />
                    </section>

                    <section className={styles.section}>
                        <Button text={t("registrate.button")} color="black" onclick={() => { /* Handle login */ }} />
                    </section>
                </Container>
            </div>
        </>
    )
}

export default Registrate;
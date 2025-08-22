import { t } from '../../i18n.ts';
import Text from '../../components/Text/Text.tsx';
import Spaceholder from '../../components/Spaceholder/Spaceholder.tsx';
import Button from '../../components/Button/Button.tsx';
import styles from './Home.module.css';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    return (
        <>
            <div className={`content ${styles.content}`}>
                <Text text={t("app_name")} type="h1" center={true} />
                <Text text={t("home.description")} type="p2" center={true} />
                <section className={styles.section}>
                    <Spaceholder size={1} />
                    <Button text={t("links.create_account")} color="grey" onclick={() => { navigate("/registrate") }} />
                    <Button text={t("links.login")} color="black" onclick={() => { navigate("/login") }}  />
                </section>
            </div>
        </>
    )
}

export default Home;
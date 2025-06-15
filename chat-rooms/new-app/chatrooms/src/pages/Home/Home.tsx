import { t } from '../../i18n.ts';
import Text from '../../components/Text/Text.tsx';
import Spaceholder from '../../components/Spaceholder/Spaceholder.tsx';
import Button from '../../components/Button/Button.tsx';
import Background from '../../components/Background/Background.tsx';
import styles from './Home.module.css';

const Home = () => {
    return (
        <>
            <Background design={1} />
            <div className={`content ${styles.content}`}>
                <section className={styles.section}>
                    <Text text={t("welcome")} type="h1" center={true} />
                    <Text text={t("general_description")} type="description" center={true} />
                    <Spaceholder size={3} />
                    <Button text={t("links.dicover_rooms")} color="grey" />
                    <Button text={t("links.create_room")} color="black" />
                </section>
            </div>
        </>
    )
}

export default Home;
import { t } from '../../i18n.ts';
import styles from './NotFound.module.css';
import Background from '../../components/Background/Background.tsx';
import Text from '../../components/Text/Text.tsx';
import Button from '../../components/Button/Button.tsx';
import Spaceholder from '../../components/Spaceholder/Spaceholder.tsx';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <>
            <Background design={2} />
            <div className={`content ${styles.content}`}>
                <section className={styles.section}>
                    <Text text={t("notFound.title")} type="h1" center={true} />
                    <Text text={t("notFound.description")} type="description" center={true} />
                    <Spaceholder size={1} />
                    <Button text={t("notFound.button")} color="black" onclick={() => { navigate("/") }}  />
                </section>
            </div>
        </>
    )
}

export default NotFound;
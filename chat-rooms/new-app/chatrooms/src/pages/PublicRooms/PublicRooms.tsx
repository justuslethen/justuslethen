import { t } from '../../i18n.ts';
import Text from '../../components/Text/Text.tsx';
import Spaceholder from '../../components/Spaceholder/Spaceholder.tsx';
import Button from '../../components/Button/Button.tsx';
import Background from '../../components/Background/Background.tsx';
import styles from './PublicRooms.module.css';
import { useNavigate } from 'react-router-dom';

const PublicRooms = () => {
    const navigate = useNavigate();

    return (
        <>
            <Background design={3} />
            <div className={`content ${styles.content}`}>
                <Text text={t("publicRooms.title")} type="h2" />
            </div>
        </>
    )
}

export default PublicRooms;
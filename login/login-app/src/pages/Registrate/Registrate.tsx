import { t } from '../../i18n.ts';
import Text from '../../components/Text/Text.tsx';
// import Spaceholder from '../../components/Spaceholder/Spaceholder.tsx';
// import Button from '../../components/Button/Button.tsx';
import styles from './Home.module.css';
// import { useNavigate } from 'react-router-dom';

const Registrate = () => {
    // const navigate = useNavigate();

    return (
        <>
            <div className="text-content">
                <Text text={t("rooms.title")} type="h1" />
            </div>

            <div className={`content ${styles.content}`}>
                
            </div>
        </>
    )
}

export default Registrate;
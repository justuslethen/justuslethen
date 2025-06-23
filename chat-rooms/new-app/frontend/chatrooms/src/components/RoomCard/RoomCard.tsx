import styles from './RoomCard.module.css';
import Button from '../Button/Button.tsx';
import { t } from '../../i18n.ts';
import { useNavigate } from 'react-router-dom';

interface RoomCardProps {
    online: number
    code: string
    name: string
}

const RoomCard = (props: RoomCardProps) => {
    const navigate = useNavigate();
    const onclick = () => {navigate(`/join-room/${props.code}`)};
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.col} />

                <div className={styles.col}>
                    <p className={styles.code}>{props.code}</p>
                </div>

                <div className={styles.col}>
                    <p className={styles.online}>{props.online} Online</p>
                </div>
            </div>

            <p className={styles.name}>{props.name}</p>

            <Button text={t("rooms.join_btn")} color="grey" onclick={onclick}/>
        </div>
    )
}

export default RoomCard;
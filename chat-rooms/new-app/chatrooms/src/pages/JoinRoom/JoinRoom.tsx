import styles from './JoinRoom.module.css';
import Text from '../../components/Text/Text.tsx';
import Profile from '../../components/Profile/Profile.tsx';
import { t } from '../../i18n.ts';

const JoinRoom = () => {
    return (
        <>
            <div className='text-content'>
                <Text text={t("app_name")} type="h1" />
                <Text text={t("join_room.title")} type="h2" />
            </div>
            <div className='content'>
                <Profile />
            </div>
        </>
    )
}

export default JoinRoom;
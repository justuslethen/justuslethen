import Text from '../../components/Text/Text.tsx';
import Profile from '../../components/Profile/Profile.tsx';
import Button from '../../components/Button/Button.tsx';
import Spaceholder from '../../components/Spaceholder/Spaceholder.tsx';
import { t } from '../../i18n.ts';

const JoinRoom = () => {
    return (
        <>
            <div className='text-content'>
                <Text text={t("app_name")} type="h1" />
                <Text text={t("join_room.title")} type="h2" />
            </div>
            <div className='content'>
                <Text text={t("join_room.title_2")} type="h3" />
                <Profile />
                <Text text={t("join_room.description_1")} type="description" />
                <Spaceholder size={3} />
                <Button text={t("join_room.join_btn")} color="black" onclick={() => { }} />
            </div>
        </>
    )
}

export default JoinRoom;
import Text from '../../../components/Text/Text.tsx';
import Profile from '../../../components/Profile/Profile.tsx';
import Button from '../../../components/Button/Button.tsx';
import Spaceholder from '../../../components/Spaceholder/Spaceholder.tsx';
import { t } from '../../../i18n.ts';

const RoomUserProfile = () => {
    return (
        <>
            <Text text={t("room.profile.title")} type="h2" />
            <Profile />
            <Spaceholder size={3} />
            <Button text={t("room.profile.save_changes_btn")} color="black" onclick={() => { }} />
            <Button text={t("room.profile.leave_btn")} color="grey" onclick={() => { }} />
        </>
    )
}

export default RoomUserProfile;
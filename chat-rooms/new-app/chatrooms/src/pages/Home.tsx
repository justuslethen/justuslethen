import { t } from '../i18n';
import Text from '../components/Text/Text.tsx';
import Spaceholder from '../components/Spaceholder/Spaceholder.tsx';
import Button from '../components/Button/Button.tsx';
import Background from '../components/Background/Background.tsx';

const Home = () => {
    return (
        <>
        <Background design={1} />
            <div className='content'>
                <Text text={t("welcome")} type="h1" />
                <Text text={t("general_description")} type="description" />
                <Spaceholder size={3} />
                <Button text={t("links.dicover_rooms")} color="white"/>
                <Button text={t("links.create_room")} color="black"/>
            </div>
        </>
    )
}

export default Home;
import { t } from '../../i18n.ts';
import Text from '../../components/Text/Text.tsx';
import Navbar from '../../components/Navbar/Navbar.tsx';
import styles from './Rooms.module.css';
import { useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import BottomBar from '../../components/BottomBar/BottomBar.tsx';
import Button from '../../components/Button/Button.tsx';

const Rooms = () => {
    const navigate = useNavigate();
    const links = [
        { path: "public", tag: t("rooms.public.name") },
        { path: "recent", tag: t("rooms.recent.name") }
    ];

    return (
        <>
            <BottomBar>
                <Button text={t("rooms.create_room_btn")} color="black" onclick={() => { navigate("/create-room") }} />
            </BottomBar>

            <div className="text-content">
                <Text text={t("rooms.title")} type="h1" />
            </div>

            <Navbar links={links} />

            <div className={`content ${styles.content}`}>
                <Outlet />
            </div>
        </>
    )
}

export default Rooms;
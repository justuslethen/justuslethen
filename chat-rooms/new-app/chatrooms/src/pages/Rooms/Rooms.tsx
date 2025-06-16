import { t } from '../../i18n.ts';
import Text from '../../components/Text/Text.tsx';
import Navbar from '../../components/Navbar/Navbar.tsx';
import styles from './Rooms.module.css';
import { Outlet } from 'react-router-dom';

const Rooms = () => {
    return (
        <>
            <div className={`content ${styles.content1}`}>
                <Text text={t("rooms.title")} type="h1" />
            </div>

            <Navbar links={[{ path: "public", tag: t("rooms.public.name") },
            { path: "recent", tag: t("rooms.recent.name") }
            ]} />

            <div className={`content ${styles.content}`}>
                <Outlet />
            </div>
        </>
    )
}

export default Rooms;
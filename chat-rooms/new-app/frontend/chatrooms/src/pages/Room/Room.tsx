import Navbar from '../../components/Navbar/Navbar.tsx';
import Text from '../../components/Text/Text.tsx';
import { t } from '../../i18n.ts';
import { Outlet } from 'react-router-dom';

const Room = () => {
    const links = [
        { path: "info", tag: t("room.link.info") },
        { path: "users", tag: t("room.link.user") },
        { path: "profile", tag: t("room.link.profile") }
    ];

    return (
        <>
            <div className="text-content">
                <Text text={t("app_name")} type="h1" />
            </div>
            <Navbar links={links} />

            <div className="content">
                <Outlet />
            </div>
        </>
    )
}

export default Room;
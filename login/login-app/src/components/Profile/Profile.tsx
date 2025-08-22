import styles from './Profile.module.css';
import ColorSelect from '../ColorSelect/ColorSelect.tsx';
import { t } from '../../i18n.ts';

const Profile = () => {
    // const profile = {
    //     name: "Justus",
    //     color: "purple"
    // }

    return (
        <>
            <div className={styles.profileContainer}>
                <div className={styles.name}>
                    <p className={styles.label}>{t("join_room.profile.name.title")}</p>
                    <input className={styles.input} placeholder={t("join_room.profile.name.placeholder")}></input>
                </div>
                <ColorSelect />
            </div>
        </>
    )
}

export default Profile;
import { t } from '../../../i18n.ts';
import Text from '../../../components/Text/Text.tsx';
// import styles from './Recent.module.css';

const Recent = () => {
    return (
        <>
            <Text text={t("rooms.recent.title")} type="h2" />
        </>
    )
}

export default Recent;
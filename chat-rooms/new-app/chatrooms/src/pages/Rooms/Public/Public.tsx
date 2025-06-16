import { t } from '../../../i18n.ts';
import Text from '../../../components/Text/Text.tsx';
import Card from '../../../components/Card/Card.tsx'
import RoomCard from '../../../components/RoomCard/RoomCard.tsx'
import styles from './Public.module.css';

const Public = () => {
    return (
        <>
            <Text text={t("rooms.public.title")} type="h2" />
            <Card>
                <RoomCard online={1} code="JHGDIE" name="Room" />
            </Card>
        </>
    )
}

export default Public;
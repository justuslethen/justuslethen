import { t } from '../../../i18n.ts';
import Text from '../../../components/Text/Text.tsx';
import Card from '../../../components/Card/Card.tsx'
import RoomCard from '../../../components/RoomCard/RoomCard.tsx'
import styles from './Public.module.css';
import BottomBar from '../../../components/BottomBar/BottomBar.tsx';
import { useState, useEffect } from 'react';

const Public = () => {
    const [rooms, setRooms] = useState([
        {
            name: "Room",
            "code": "KHDIEK",
            "online": 4
        }]);


    return (
        <>

            <BottomBar>

            </BottomBar>
            <Text text={t("rooms.public.title")} type="h2" />
            {rooms.map(room => {
                return (
                    <>
                        <Card>
                            <RoomCard online={room.online} code={room.code} name={room.name} />
                        </Card>
                    </>
                )
            })}
        </>
    )
}

export default Public;
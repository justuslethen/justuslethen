import Text from '../../../components/Text/Text.tsx';
import Table from '../../../components/Table/Table.tsx';
import Spaceholder from '../../../components/Spaceholder/Spaceholder.tsx';
import { t } from '../../../i18n.ts';


const RoomInfo = () => {
    const tableData_1 = [
        ["Members online:", "10 / 20 (50%)"],
        ["Duration alive:", "4h / 1d (17%)"],
        ["Duration alive:", "4h / 1d (17%)"],
        ["Accessability:", "private"]
    ];

    const tableData_2 = [
        ["Messages sent:", "213"],
        ["Number of users over lifetime:", "27"],
        ["Users kicked:", "2"],
        ["Users timeouted:", "1"]
    ];


    return (
        <>
            <Text text={t("room.info.title")} type="h2" />
            <Spaceholder size={3} />

            <Text text={t("room.info.specs.title")} type="h3" />
            <Table table={tableData_1} />
            <Spaceholder size={3} />

            <Text text={t("room.info.data.title")} type="h3" />
            <Table table={tableData_2} />
        </>
    )
}

export default RoomInfo;
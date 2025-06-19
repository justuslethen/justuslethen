import styles from './CreateRoom.module.css';
import Text from '../../components/Text/Text.tsx';
import Button from '../../components/Button/Button.tsx';
import Selection from '../../components/Selection/Selection.tsx';
import Spaceholder from '../../components/Spaceholder/Spaceholder.tsx';
import Input from '../../components/Input/Input.tsx';
import { t } from '../../i18n.ts';

const CreateRoom = () => {
    const accessibilityOptions = [
        { value: "private", label: t("create_room.options.private") },
        { value: "public", label: t("create_room.options.public") }];

    const maxMembersOptions = [
        { value: "5", label: "5" },
        { value: "20", label: "20" },
        { value: "50", label: "50" },
        { value: "100", label: "100" }];

    const roomDurationOprions = [
        {value: "0", label: "0"},
        {value: "1", label: "1"},
        {value: "3", label: "3"},
        {value: "7", label: "7"},
        {value: "30", label: "30"},
    ]

    return (
        <>
            <div className='text-content'>
                <Text text={t("app_name")} type="h1" />
            </div>

            <div className={styles.content}>
                <Text text={t("create_room.description")} type="h2" />
                <Spaceholder size={3} />

                <Input
                    placeholder={t("create_room.inputs.name_input.placeholder")}
                    label={t("create_room.inputs.name_input.label")}
                />
                <Spaceholder size={5} />

                <Selection options={accessibilityOptions} title={t("create_room.options.header.accessibility")} />
                <Text text={t("create_room.select_description_1")} type="description" />
                <Spaceholder size={3} />

                <Selection options={maxMembersOptions} title={t("create_room.options.header.max_members")} />
                <Text text={t("create_room.select_description_2")} type="description" />
                <Spaceholder size={3} />

                <Selection options={roomDurationOprions} title={t("create_room.options.header.room_duraction")} />
                <Text text={t("create_room.select_description_3")} type="description" />
                <Spaceholder size={5} />

                <Button text={t("create_room.create_btn")} color="green" onclick={() => { }} />
                <Spaceholder size={5} />
            </div>
        </>
    )
}

export default CreateRoom;
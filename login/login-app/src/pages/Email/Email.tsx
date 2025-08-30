// import styles from "./Email.module.css"

import Text from "../../components/Text/Text.tsx"
import { t } from "../../i18n.ts"
import { Outlet } from "react-router-dom"

const Email = () => {
    return (
        <>
            <div className="text-content">
                <Text text={t("app_name")} type="h1" />
            </div>
            <Outlet />
        </>
    )
}

export default Email;
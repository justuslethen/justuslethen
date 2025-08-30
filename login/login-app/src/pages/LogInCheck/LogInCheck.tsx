import styles from "./LoginCheck.module.css"

import { useEffect, useState } from "react";
import { API_URL } from "../../config";

const LoginCheck = () => {
    const [amILoggedIn, setAmILoggedIn] = useState(false);
    const [data, setData] = useState({});

    useEffect(() => {
        fetch(`${API_URL}/api/amiloggedin`)
            .then((res) => res.json())
            .then((data: any) => {
                console.log(data);
                setAmILoggedIn(data.loggedIn);
                setData(data.data);
            })
            .catch((err) => {
                console.error("error fetching login status:", err);
            });
    }, []);

    return (
        <>
            {amILoggedIn ? (
                <>
                    <p className={styles.text}>You are logged in</p>
                    <p className={styles.text}>{JSON.stringify(data)}</p>
                </>
            ) : (
                <>
                    <p className={styles.text}>You are not loged in</p>
                    <p className={styles.text}>{JSON.stringify(data)}</p>
                </>
            )}
        </>
    )
}

export default LoginCheck;
// import styles from "./LoginCheck.module.css"

import { useEffect, useState } from "react";
import { API_URL } from "../../config";

const LoginCheck = () => {
    const [amILoggedIn, setAmILoggedIn] = useState(false);
    const [data, setData] = useState({});

    useEffect(() => {
        fetch(`${API_URL}/api/amiloggedin`)
            .then((res) => res.json())
            .then((data: any) => {
                setAmILoggedIn(data.amILoggedIn);
                setData(data.data);
            })
            .catch((err) => {
                console.error("Error fetching login status:", err);
            });
    }, []);

    return (
        <>
            {amILoggedIn ? (
                <>
                    <p>i am logged in</p>
                    <p>{JSON.stringify(data)}</p>
                </>
            ) : (
                <>
                    <p>i am not logged in</p>
                    <p>{JSON.stringify(data)}</p>
                </>
            )}
        </>
    )
}

export default LoginCheck;
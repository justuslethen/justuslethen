// import styles from "./Test.module.css"

import { useEffect, useState } from "react";
import { API_URL } from "../../config";

const Test = () => {
    const [amILoggedIn, setAmILoggedIn] = useState(false);
    const [data, setData] = useState({});

    useEffect(() => {
        fetch(`${API_URL}/amiloggedin`)
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
                    <p>i am logged in"</p>
                    {data}
                </>
            ) : (
                <>
                    <p>i am not logged in</p>
                    {data}
                </>
            )}
        </>
    )
}

export default Test;
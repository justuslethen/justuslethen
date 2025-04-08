import { usePin } from '../contexts/PinContext';
import React from 'react';

const Create = () => {
    const { pin } = usePin();
    return (
        <>
            <h1>Event erstellen</h1>
            <p>Der aktuelle PIN ist: {pin}</p>
        </>
    )
};

export default Create;
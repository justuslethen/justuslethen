import Header from '../components/Header';
import React from 'react';

const Create = () => {
    document.title = "Events - Neues Event erstellen";

    return (
        <>
            <Header title="Neues Event erstellen" backButton={true} addButton={false}/>
        </>
    )
};

export default Create;
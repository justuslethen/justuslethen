import React from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';

const Edit = () => {
    document.title = "Events - Event 1 bearbeiten";

    const { eventId } = useParams();  // get eventId from the URL
    const addAction = `/edit/${eventId}`;  // construct the addPage URL

    return (
        <>
            <Header title="Event 1 bearbeiten" backButton={true} addButton={false}/>
        </>
    );
};

export default Edit;
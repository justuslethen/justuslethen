import React from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import ListElement from '../components/ListElement';

const Event = () => {
    document.title = "Events - Event 1";

    const { eventId } = useParams();  // get eventId from the URL
    const addPage = `/edit/${eventId}`;  // construct the addPage URL

    return (
        <>
            <Header title="Event 1" backButton={true} addButton={true} addAction={addPage}/>
        </>
    );
};

export default Event;
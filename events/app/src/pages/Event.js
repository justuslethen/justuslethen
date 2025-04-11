import React from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import ListElement from '../components/ListElement';

const Event = () => {
    const { eventId } = useParams();  // Get eventId from the URL

    return (
        <>
            <Header title="Event 1" backButton={true} />
            
        </>
    );
};

export default Event;
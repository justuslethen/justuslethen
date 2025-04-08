import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import ListElement from '../components/ListElement';

const Event = () => {
    const navigate = useNavigate();  // Hook to handle navigation

    return (
        <>
            <Event
                title="Event"
                backButton={false}
                data=""
            />
        </>
    );
};

export default Event;
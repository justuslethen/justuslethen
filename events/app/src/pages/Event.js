import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import WindowContainer from '../components/WindowContainer';

const Event = () => {
    document.title = "Events - Event 1";

    const { eventId } = useParams();  // get eventId from the URL
    const addPage = `/edit/${eventId}`;  // construct the addPage URL
    const [eventData, setEventData] = React.useState({});
    const [pageData, setPageData] = React.useState({
        pinInputWindow: false,
        addSubeventEventWindow: false
    });
    const domain = "http://127.0.0.1:4000";

    // fetch event_data from api
    useEffect(() => {
        fetch(`${domain}/data/get/main-event/${eventId}`)
            .then(res => res.json())
            .then(data => {
                if (data.error == "no permission") {
                    setPageData(prev => ({ ...prev, pinInputWindow: true }))
                }
                setEventData(data); // set events to fetched data
            })
            .catch(console.error);
    }, []);


    return (
        <>
            {pageData.pinInputWindow ? (
                <WindowContainer title={"PIN für " + eventData.event.eventname + " benötigt"} innerContent=''/>
            ) : pageData.addSubeventEventWindow ? (
                <WindowContainer title={"Neuen Programmpunkt für " + eventData.event.eventname + " erstellen"} innerContent='' />
            ) : null}

            <Header title="Event 1" backButton={true} addButton={true} addAction={addPage} />
            {console.log(eventData)}
        </>
    );
};

export default Event;
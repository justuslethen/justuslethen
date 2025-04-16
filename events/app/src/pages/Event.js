import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import SubEventsTimeline from '../components/SubEventsTimeline';
import PinInputBox from '../components/PinInputBox';
import WindowContainer from '../components/WindowContainer';

const Event = () => {
    const { eventId } = useParams();  // get eventId from the URL
    const addPage = `/edit/${eventId}`;  // construct the addPage URL
    const [eventData, setEventData] = React.useState({});
    const [pageData, setPageData] = React.useState({
        pinInputWindow: false,
        addSubeventEventWindow: false
    });
    const domain = "http://127.0.0.1:4000";

    const setTitle = (eventName) => {
        document.title = `${eventName || 'Event'} - Events`;
    }

    // fetch event_data from api
    useEffect(() => {
        getEventFromAPI();
    }, []);

    const getEventFromAPI = () => {
        fetch(`${domain}/data/get/main-event/${eventId}`)
            .then(res => res.json())
            .then(data => {
                if (data.error == "no permission") {
                    setPageData(prev => ({ ...prev, pinInputWindow: true }))
                }
                setEventData(data); // set events to fetched data
                setTitle(data.event.eventname);
            })
            .catch(console.error);
    }

    const hidePinInput = () => {
        setPageData(prev => ({ ...prev, pinInputWindow: false }))
    }

    const tryForPermission = () => {
        // get PIN from input
        const pin = document.querySelector('.pinInput').value || '';

        fetch(`${domain}/data/create/permission-to-event/${eventId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            body: JSON.stringify({ pin: pin }), // send PIN in body
        })
            .then((response) => response.json())
            .then((data) => {
                if (!data.error) {
                    hidePinInput();
                    getEventFromAPI(); // try to load the event now
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    return (
        <>
            {pageData.pinInputWindow ? (
                <WindowContainer
                    title={"PIN für " + eventData.event.eventname + " benötigt"}
                    innerContent={<PinInputBox onclick={() => { tryForPermission() }} />}
                    onclick={() => { hidePinInput() }}
                />
            ) : pageData.addSubeventEventWindow ? (
                <WindowContainer title={"Neuen Programmpunkt für " + eventData.event.eventname + " erstellen"} innerContent={
                    <SubeventCreate />
                } />
            ) : null}

            <Header title="Event 1" backButton={true} editButton={true} addButton={true} addAction={addPage} />

            <div className='content'>
                {console.log(eventData)}
                {eventData.error === "no permission" ? (
                    <h3>Du hast keine Berechtigung für dieses Event.</h3>
                ) : eventData.event ? (
                    <SubEventsTimeline subevents={eventData.event.subevents || []} />
                ) : null}
            </div>
        </>
    );
};

export default Event;
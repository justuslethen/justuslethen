import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import Create from '../pages/Create'
import PinInputBox from '../components/PinInputBox';
import WindowContainer from '../components/WindowContainer';

const Edit = () => {
    const { eventId } = useParams();  // get eventId from the URL
    const [eventData, setEventData] = React.useState({});
    const [pageData, setPageData] = React.useState({
        pinInputWindow: false,
    });

    document.title = "Events - bearbeiten";
    const domain = 'http://127.0.0.1:4000';

    useEffect(() => {
        getEventFromAPI();
    }, [setEventData]);

    const getEventFromAPI = () => {
        // get eventData from API
        fetch(`${domain}/data/get/main-event/${eventId}`)
            .then(res => res.json())
            .then(data => {
                // open PIN input if user has no access
                if (data.error == "no permission") {
                    setPageData(prev => ({ ...prev, pinInputWindow: true }))
                }

                setEventData(data.event); // set events to fetched data

                setTitle(data.event.eventname); // set new dynamic title
            })
            .catch(console.error);
    }

    const setTitle = (eventName) => {
        document.title = `${eventName || 'Event'} bearbeiten - Events`;
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
            {console.log(eventData)}
            {pageData.pinInputWindow ?? (
                <WindowContainer
                    title={"PIN für " + eventData.eventname + " benötigt"}
                    innerContent={<PinInputBox onclick={() => { tryForPermission() }} />}
                    onclick={() => { hidePinInput() }}
                />
            )}
            <Create title={eventData.eventname + ' bearbeiten'} url={domain + '/data/change/main-event/' + eventId} eventData={eventData.eventname? eventData : false} />
        </>
    );
};

export default Edit;
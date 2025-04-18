import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import SubEventsTimeline from '../components/SubEventsTimeline';
import PinInputBox from '../components/PinInputBox';
import IconButton from '../components/IconButton';
import WindowContainer from '../components/WindowContainer';
import NextEventTimer from '../components/NextEventTimer';
import AddSubevent from '../components/AddSubevent';
import { useNavigate } from 'react-router-dom';

const Event = () => {
    const { eventId } = useParams();  // get eventId from the URL
    const addPage = `/edit/${eventId}`;  // construct the addPage URL
    const [eventData, setEventData] = React.useState({});
    const [pageData, setPageData] = React.useState({
        pinInputWindow: false,
        addSubeventEventWindow: false
    });
    const domain = "http://127.0.0.1:4000";
    const navigate = useNavigate();

    const setTitle = (eventName) => {
        document.title = `${eventName || 'Event'} - Events`;
    }

    useEffect(() => {
        getEventFromAPI();
    }, []);

    useEffect(() => {
        setTimeout(() => {
            scrollToLatestEvent();
        }, 100);
    }, []);

    const scrollToLatestEvent = () => {
        // get all elements with .event-running and .event-over classes
        const running = Array.from(document.querySelectorAll('.event-running'));
        const over = Array.from(document.querySelectorAll('.event-over'));

        // chose the latest in list
        // if no event-running choose the latest event-over
        const target = running.length > 0 ? running[running.length - 1] : over[over.length - 1];

        if (target) scrollToTarget(target)
    }

    const scrollToTarget = (target) => {
        const rect = target.getBoundingClientRect();
        const offsetTop = window.pageYOffset + rect.top;
        const targetPosition = offsetTop - (window.innerHeight / 2) + (rect.height / 2);

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }

    const getEventFromAPI = () => {
        // fetch the API to get the eventData by the eventId
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

    const hideAddSubevent = () => {
        // set the display value for AddSubevent to false
        setPageData(prev => ({ ...prev, addSubeventEventWindow: false }))
    }

    const showAddSubevent = () => {
        // set the display value for AddSubevent to true
        setPageData(prev => ({ ...prev, addSubeventEventWindow: true }))
    }

    return (
        <>
            <div className='floating-buttons'>
                <IconButton icon='clock' type='primary' onclick={scrollToLatestEvent} />
            </div>

            {pageData.pinInputWindow ? (
                <WindowContainer
                    title={"PIN für " + eventData.event.eventname + " benötigt"}
                    innerContent={<PinInputBox onclick={() => { tryForPermission() }} />}
                    onclick={() => { hidePinInput() }}
                />
            ) : pageData.addSubeventEventWindow ? (
                <WindowContainer
                    title={"Neuen Programmpunkt für " + eventData.event.eventname + " erstellen"}
                    innerContent={
                        <AddSubevent eventid={eventId} refresh={getEventFromAPI} />
                    }
                    onclick={() => { hideAddSubevent() }}
                />
            ) : null}

            <Header
                title={<NextEventTimer subevents={eventData.event?.subevents || []} />}
                backButton={true}
                editButton={true}
                addButton={true}
                editAction={() => { navigate("/edit/" + eventId) }}
                addAction={showAddSubevent}
            />

            <div className='content content-small'>
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
import React, { useEffect, useState } from 'react';

const NextEventTimer = (props) => {
    const subevents = props.subevents || [];
    const [nextEvent, setNextEvent] = useState({ eventName: "", timeLeft: "" });

    // get the next event based on startdate and now
    const getNextEvent = () => {
        for (let subevent of subevents) {
            const start = new Date(subevent.startdate);
            const now = new Date();
            // if isn't over or running yet
            if (start > now) {
                // calc time left to event
                const timeLeftMs = start - now;
                const hours = String(Math.floor(timeLeftMs / (1000 * 60 * 60))).padStart(2, '0');
                const minutes = String(Math.floor((timeLeftMs % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
                const seconds = String(Math.floor((timeLeftMs % (1000 * 60)) / 1000)).padStart(2, '0');

                // save data
                setNextEvent({
                    eventName: subevent.subeventname,
                    timeLeft: `${hours} Std. ${minutes} Min. ${seconds} Sek.`,
                });
                return;
            }
        }
        setNextEvent({ eventName: "", timeLeft: "" });
    };

    useEffect(() => {
        getNextEvent();
        const interval = setInterval(getNextEvent, 1000);
        return () => clearInterval(interval);
    }, [subevents]);

    return (
        <div className='timer'>
            <p>{nextEvent.eventName} in: {nextEvent.timeLeft}</p>
        </div>
    );
};

export default NextEventTimer;
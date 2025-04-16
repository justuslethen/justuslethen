import React, { useState, useEffect } from 'react';
import SubEventContainer from './SubEventContainer'
import TimelineStroke from './TimelineStroke'

const SubEventsTimeline = (props) => {
    const [subevents, setSubevents] = useState(props.subevents);

    const changeFocused = (index) => {
        // set the event that was clicked on on the other focused state than it is
        const updated = [...subevents];
        updated[index] = {
            ...updated[index],
            focused: !updated[index].focused,
        };
        setSubevents(updated); // save updated version
    };

    return (
        <div className='section-container'>
            {/*<div className='timeline-stroke'>
                <TimelineStroke key={JSON.stringify(subevents)} subevents={subevents} />
            </div>*/}
            <div className='event-list'>
                {subevents.map((subevent, index) => (
                    <SubEventContainer key={index} subevent={subevent} onclick={() => { changeFocused(index) }} />
                ))}
            </div>
        </div>
    )
}

export default SubEventsTimeline;
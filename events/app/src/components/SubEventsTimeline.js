import React, { useState } from 'react';
import SubEventContainer from './SubEventContainer'

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
            <div className='timeline-stroke'></div>
            <div className='event-list'>
                {subevents.map((subevent, index) => (
                    <SubEventContainer key={index} subevent={subevent} onclick={() => { changeFocused(index) }} />
                ))}
            </div>
        </div>
    )
}

export default SubEventsTimeline;
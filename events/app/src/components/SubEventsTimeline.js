import React from 'react';
import SubEventContainer from './SubEventContainer'

const SubEventsTimeline = (props) => {
    return (
        <div className='section-container'>
            <div className='timeline-stroke'></div>
            <div className='event-list'>
                {console.log(props.subevents)}
                {props.subevents.map((subevent, index) => (
                    <SubEventContainer key={index} subevent={subevent} />
                ))}
            </div>
        </div>
    )
}

export default SubEventsTimeline;
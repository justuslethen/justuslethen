import React from 'react';
import IconButton from './IconButton';

const SubEventContainer = (props) => {
    // make from yyyy-mm-ddThh:mm to hh:mm
    const startTime = new Date(props.subevent.startdate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }).replace(':', '.');

    return (
        <div className='subevent-container'>
            <div className='header'>
                <p className='event-time'>{startTime}</p>
                <p className='event-name'>{props.subevent.subeventname}</p>
                <IconButton type='secondary' icon='arrow' rotate={0.75}/>
            </div>
        </div>
    )
}

export default SubEventContainer;
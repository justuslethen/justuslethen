import React from 'react';
import IconButton from './IconButton';

const SubEventContainer = (props) => {
    // make from yyyy-mm-ddThh:mm to hh:mm
    const startTime = new Date(props.subevent.startdate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    
    // get all date data
    const now = new Date();
    const startDate = new Date(props.subevent.startdate);
    const endDate = new Date(props.subevent.enddate);

    // calc if event is running or over
    const isEventRunning = now >= startDate && now <= endDate;
    const isEventOver = now > endDate;

    return (
        <div
            className={
                "subevent-container" +
                (isEventRunning ? " event-running" : isEventOver ? " event-over" : "")
            }
            onClick={props.onclick}
        >
            <div className='header'>
                <p className='event-time'>{startTime}Uhr</p>
                <p className='event-name'>{props.subevent.subeventname}</p>
                {props.subevent.rows.length > 0 ? (
                    <IconButton type='secondary' icon='arrow' rotate={props.subevent.focused ? 0.25 : 0.75} />
                ) : (null)}
            </div>
            {props.subevent.rows.length > 0 && props.subevent.focused ? (
                <div className='table'>
                    {props.subevent.rows.map((row, index) => (
                        <div className='row' key={index}>
                            <div className='col'>{row.name}</div>
                            <div className='col'>{row.context}</div>
                        </div>
                    ))}
                </div>
            ) : (null)}
        </div>
    )
}

export default SubEventContainer;
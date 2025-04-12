import React from 'react';
import SubeventColumnCreate from './SubeventColumnCreate';
import IconButton from './IconButton';

const SubeventCreate = (props) => {
  console.log("subevent", props.subevent);

  return (
    <div key={props.index} className='subevent-box'>
      <div className='side-line'></div>
      <div className='subevent-inputs'>
        <div className='subevent-header'>
          <h3>Event {props.index + 1}</h3>
          <IconButton onclick={() => { console.log(`iconButton click`) }} type="red" icon="bin" />
          <IconButton onclick={() => { console.log(`iconButton click`) }} type="secondary" icon="arrow" rotate={0.25} />
        </div>
        <div className='subevent-body'>
          <input
            value={props.subevent.subeventname}
            onChange={(e) => props.handleSubeventChange(props.index, "subeventname", e.target.value)}
            placeholder="Subeventname"
          />

          <input
            type="datetime-local"
            value={props.subevent.startdate}
            onChange={(e) => props.handleSubeventChange(props.index, "startdate", e.target.value)}
          />

          <input
            type="datetime-local"
            value={props.subevent.enddate}
            onChange={(e) => props.handleSubeventChange(props.index, "enddate", e.target.value)}
          />

          <div className='columns-box'>
            <div className='side-line'></div>
            <div className='columns'>
              {props.subevent.columns.map((column, colIndex) => (
                <SubeventColumnCreate
                  column={column} colIndex={colIndex} index={props.index} focus={true} action={props.handleColumnChange}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};

export default SubeventCreate;
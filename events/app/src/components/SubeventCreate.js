import React from 'react';
import SubeventColumnCreate from './SubeventColumnCreate';
import IconButton from './IconButton';
import Button from './Button';

const SubeventCreate = (props) => {
  return (
    <div key={props.index} className='subevent-inputs'>

      {/* header */}
      <div className='subevent-header'>
        <h3>Event {props.index + 1}</h3>
        <IconButton onclick={() => { props.handleDeleteSubevent(props.index) }} type="red" icon="bin" />
        <IconButton onclick={() => { console.log(`iconButton click`) }} type="secondary" icon="arrow" rotate={0.25} />
      </div>

      {/* body for information like start-, enddate and name*/}
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
                column={column}
                colIndex={colIndex}
                index={props.index}
                focus={true}
                action={props.handleColumnChange}
                handleDeleteColumn={props.handleDeleteColumn}
              />
            ))}
            <Button type='secondary' text='+ Spalte' onclick={() => { props.handleAddColumn(props.index) }} />
          </div>
        </div>
      </div>
    </div>
  )
};

export default SubeventCreate;
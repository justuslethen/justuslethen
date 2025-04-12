import React from 'react';
import SubeventRowCreate from './SubeventRowCreate';
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

        <div className='rows-box'>
          <div className='side-line'></div>
          <div className='rows'>
            {props.subevent.rows.map((row, rowIndex) => (
              <SubeventRowCreate
                row={row}
                rowindex={rowIndex}
                index={props.index}
                focus={true}
                action={props.handleRowChange}
                handleDeleterow={props.handleDeleteRow}
              />
            ))}
            <Button type='secondary' text='+ Spalte' onclick={() => { props.handleAddRow(props.index) }} />
          </div>
        </div>
      </div>
    </div>
  )
};

export default SubeventCreate;
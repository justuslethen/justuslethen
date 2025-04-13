import React from 'react';
import SubeventRowCreate from './SubeventRowCreate';
import IconButton from './IconButton';
import Button from './Button';

const SubeventCreate = (props) => {
  return (
    <div key={props.index} className='subevent-inputs'>

      {/* header */}
      <div className='subevent-header'>
        <h3 onClick={() => { props.setFocusedSubevent(props.index) }}>{props.subevent.subeventname}</h3>
        <IconButton onclick={() => { props.handleDeleteSubevent(props.index) }} type="red" icon="bin" />
        <IconButton onclick={() => { props.setFocusedSubevent(props.index) }} type="secondary" icon="arrow" rotate={props.focus ? 0.25 : 0.75} />
      </div>

      {/* body for information like start-, enddate and name*/}
      {props.focus && (
        <div className='subevent-body'>
          <input
            value={props.subevent.subeventname}
            onChange={(e) => props.handleSubeventChange(props.index, "subeventname", e.target.value)}
            placeholder="Subeventname"
          />

          <h4>Startzeit</h4>
          <input
            type="datetime-local"
            value={props.subevent.startdate}
            onChange={(e) => props.handleSubeventChange(props.index, "startdate", e.target.value)}
          />

          <h4>Endzeit</h4>
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
                  focus={rowIndex == props.focusedRowIndex}
                  action={props.handleRowChange}
                  handleDeleterow={props.handleDeleteRow}
                  setFocusedRow={props.setFocusedRow}
                />
              ))}
              <Button type='secondary' text='+ Reihe' onclick={() => { props.handleAddRow(props.index) }} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
};

export default SubeventCreate;
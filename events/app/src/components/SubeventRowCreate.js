import React from 'react';
import IconButton from "./IconButton";

const SubeventRowCreate = (props) => {
  return (
    <div key={props.rowindex} className='row-input'>
      <div className='row-header'>
        <h3 onClick={() => { props.setFocusedRow(props.rowindex) }}>Reihe {props.rowindex + 1}</h3>
        <IconButton onclick={() => { props.handleDeleterow(props.index, props.rowindex) }} type="red" icon="bin" />
        <IconButton onclick={() => { props.setFocusedRow(props.rowindex) }} type="secondary" icon="arrow" rotate={props.focus ? 0.25 : 0.75} />
      </div>

      {props.focus && (
        <div className='row-body'>
          <input
            value={props.row.rowname}
            onChange={(e) => props.action(props.index, props.rowindex, "rowname", e.target.value)}
            placeholder="Name"
          />
          <input
            value={props.row.rowcontext}
            onChange={(e) => props.action(props.index, props.rowindex, "rowcontext", e.target.value)}
            placeholder="Inhalt"
          />
        </div>
      )}
    </div>
  )
};

export default SubeventRowCreate;
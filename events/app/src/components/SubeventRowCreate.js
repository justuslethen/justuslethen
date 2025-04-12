import React from 'react';
import IconButton from "./IconButton";

const SubeventRowCreate = (props) => {
  return (
    <div key={props.rowindex} className='row-input'>
      <div className='row-header'>
        <h3>Reihe {props.rowindex + 1}</h3>
        <IconButton onclick={() => { props.handleDeleterow(props.index, props.rowindex) }} type="red" icon="bin" />
        <IconButton onclick={() => { console.log(`iconButton click`) }} type="secondary" icon="arrow" rotate={0.25} />
      </div>

      {props.focus && (
        <div className='row-body'>
          <input
            value={props.row.rowname}
            onChange={(e) => props.action(props.index, props.rowindex, "rowname", e.target.value)}
            placeholder="Spaltenname"
          />
          <input
            value={props.row.rowcontext}
            onChange={(e) => props.action(props.index, props.rowindex, "rowcontext", e.target.value)}
            placeholder="Spalteninhalt"
          />
        </div>
      )}
    </div>
  )
};

export default SubeventRowCreate;
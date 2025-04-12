import React from 'react';
import IconButton from "./IconButton";

const SubeventColumnCreate = (props) => {
  return (
    <div key={props.colIndex} className='column-input'>
      <div className='column-header'>
        <h3>Reihe {props.colIndex + 1}</h3>
        <IconButton onclick={() => { props.handleDeleteColumn(props.index, props.colIndex) }} type="red" icon="bin" />
        <IconButton onclick={() => { console.log(`iconButton click`) }} type="secondary" icon="arrow" rotate={0.25} />
      </div>

      {props.focus && (
        <div className='column-body'>
          <input
            value={props.column.columnname}
            onChange={(e) => props.action(props.index, props.colIndex, "columnname", e.target.value)}
            placeholder="Spaltenname"
          />
          <input
            value={props.column.columncontext}
            onChange={(e) => props.action(props.index, props.colIndex, "columncontext", e.target.value)}
            placeholder="Spalteninhalt"
          />
        </div>
      )}
    </div>
  )
};

export default SubeventColumnCreate;
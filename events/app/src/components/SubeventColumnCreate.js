import React from 'react';
import IconButton from "./IconButton";

const SubeventColumnCreate = ({ column, colIndex, index, focus, action }) => {
  return (
    <div key={colIndex} className='column-input'>
      <div className='column-header'>
        <h3>Reihe {colIndex + 1}</h3>
        <IconButton onclick={() => {console.log(`iconButton click`)}} type="red" icon="bin"/>
        <IconButton onclick={() => {console.log(`iconButton click`)}} type="secondary" icon="arrow" rotate={0.25}/>
      </div>

      {focus && (
        <div className='column-body'>
          <input
            value={column.columnname}
            onChange={(e) => action(index, colIndex, "columnname", e.target.value)}
            placeholder="Spaltenname"
          />
          <input
            value={column.columncontext}
            onChange={(e) => action(index, colIndex, "columncontext", e.target.value)}
            placeholder="Spalteninhalt"
          />
        </div>
      )}
    </div>
  )
};

export default SubeventColumnCreate;
import React from 'react';
import IconButton from './IconButton'

const ListElement = ({ name, startDate, endDate, onClick }) => {
  const formatDate = (isoDate) => {
    if (!isoDate) return '';
    
    const [year, month, day] = isoDate.split('T')[0].split('-');
    
    return `${day}.${month}.${year}`;
  }
  

  return (
    <div className="list-element" onClick={onClick} style={{ cursor: 'pointer' }}>
      <div className='body'>
        <div className="header">
          <p>{name}</p>
        </div>
        <div className="bottom">
          <p>{formatDate(startDate)} - {formatDate(endDate)}</p>
        </div>
      </div>
      <IconButton onclick={() => { }} type="secondary" icon="arrow" />
    </div>
  );
};

export default ListElement;
import React from 'react';

const ListElement = ({ name, startDate, endDate, onClick }) => {
  const formatDate = (isoDate) => {
    if (!isoDate) return '';
    const [year, month, day] = isoDate.split('-');
    return `${day}.${month}.${year}`;
  };

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
      <button className='iconButtomSecondary'>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-right">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>
    </div>
  );
};

export default ListElement;
import React from 'react';

const Header = ({ title, backButton, data }) => {

  if (!data) {
    return (
      <header>
        {backButton && (
          <button className='iconButtomSecondary' onClick={() => window.history.back()}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-right" style={{ transform: 'rotate(180deg)' }}>
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        )}
        <h1>{title}</h1>
      </header>
    );
  }

  return null;
};

export default Header;
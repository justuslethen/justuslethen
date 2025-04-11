import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = ({ title, backButton, addButton, addAction, data }) => {
  const navigate = useNavigate();

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
        {addButton && (
          <button className='iconButtonPrimary' onClick={() => navigate(addAction)}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 8L15 8" stroke="white" stroke-width="1.5" stroke-linecap="round" />
              <path d="M8 15V1" stroke="white" stroke-width="1.5" stroke-linecap="round" />
            </svg>
          </button>
        )}
      </header>
    );
  }

  return null;
};

export default Header;
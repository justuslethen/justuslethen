import React from 'react';

const Header = ({ title, backButton, data }) => {
  if (!data) {
    return (
      <header>
        <h1>{title}</h1>
      </header>
    );
  }

  return null;
};

export default Header;
import React from 'react';
import Header from './Header';
import EventElement from './EventElement';

const Layout = ({ children }) => {
  return (
    <>
      <Header />
      <main style={{ padding: '1rem' }}>{children}</main>
    </>
  );
};

export default Layout;
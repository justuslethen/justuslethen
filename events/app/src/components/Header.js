import React from 'react';
import { useNavigate } from 'react-router-dom';
import IconButton from './IconButton';

const Header = (props) => {
  const navigate = useNavigate();


  if (!props.data) {
    return (
      <header>
        {props.backButton && (
          <IconButton onclick={() => { window.history.back() }} type="secondary" icon="arrow" />
        )}
        <h1>{props.title}</h1>
        {props.addButton && (
          <IconButton onclick={() => { navigate(props.addAction) }} type="primary" icon="plus" />
        )}
      </header>
    );
  }

  return null;
};

export default Header;
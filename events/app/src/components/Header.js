import React from 'react';
import { useNavigate } from 'react-router-dom';
import IconButton from './IconButton';

const Header = (props) => {
  const navigate = useNavigate();


  if (!props.data) {
    // render without next event display
    return (
      <header>
        {props.backButton && (
          <IconButton onclick={() => { window.history.back() }} type="secondary" icon="arrow" />
        )}
        <h1>{props.title}</h1>
        <div className='buttons'>
          {props.editButton && (
            <IconButton onclick={() => { props.editAction()}} type="primary" icon="pencil" />
          )}
          {props.addButton && (
            <IconButton onclick={() => { props.addAction() }} type="primary" icon="plus" />
          )}
        </div>
      </header>
    );
  }

  return null;
};

export default Header;
import React from 'react';

const Button = (props) => {
    const className = "button-" + props.type;

    retrun (
        <button className={className + " button"} onClick={props.onclick}>
            <p>{props.text}</p>
        </button>
    );
};

export default Button;
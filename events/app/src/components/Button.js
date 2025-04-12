import React from 'react';

const Button = (props) => {
    // define the className based on the given type name
    const className = "button-" + props.type;

    return (
        <button className={className + " button"} onClick={props.onclick}>
            <p>{props.text}</p>
        </button>
    );
};

export default Button;
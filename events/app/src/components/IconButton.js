import React from 'react';
import { ReactComponent as BinIcon } from '../icons/bin.svg';
import { ReactComponent as PlusIcon } from '../icons/plus.svg';
import { ReactComponent as ArrowIcon } from '../icons/arrow.svg';

const IconButton = (props) => {
    // define the className based on the given type name
    const className = 'icon-button-' + props.type;

    // calc the rotation based on the rotate prop
    // rotate prop is a number between 0 and 1
    const rotation = props.rotate * 360 || 0;


    // serve icon based on prop
    return (
        <button className={className} onClick={props.onclick}>
            {props.icon === 'bin' ? (
                <BinIcon className="icon" style={{ transform: `rotate(${rotation}deg)` }} />
            ) : props.icon === 'plus' ? (
                <PlusIcon className="icon" style={{ transform: `rotate(${rotation}deg)` }} />
            ) : props.icon === 'arrow' ? (
                <ArrowIcon className="icon" style={{ transform: `rotate(${rotation}deg)` }} />
            ) : null}
        </button>
    )
};

export default IconButton;
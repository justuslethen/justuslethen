import React from 'react'
import Button from './Button';

const PinInputBox = (props) => {
    return (
        <div class='PinInputBox'>
            <input placeholder='PIN' type='password' />
            <Button text='Prüfen' onclick={ props.onclick } type='primary' />
        </div>
    )
}

export default PinInputBox;
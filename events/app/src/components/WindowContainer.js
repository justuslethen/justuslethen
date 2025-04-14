import React from 'react'
import IconButton from './IconButton';

const WindowContainer = (props) => {
    return (
        <div className='main-window-container'>
            <div className='window-container'>
                <div className='header'>
                    <p>{props.title}</p>
                    <IconButton type='secondary' icon="plus" rotate="0.125" onclick/>
                </div>
                <div className='body'>
                    {/* Render innerContent from props */}
                    {props.innerContent}
                </div>
            </div>
        </div>
    )
}

export default WindowContainer;
import React from "react";

const RoomContainer = ({ code, name, openRoom, setPage, setRoomData, socket, showMessage}) => {
    return (
        <div className="roomContainer">
            <div className="header">
                <p className="roomName">{name}</p>
            </div>
            <p className="code">{code}</p>
            <button className='buttonWhite' onClick={() => openRoom(code, setPage, setRoomData, socket, showMessage)}>Beitreten</button>
        </div>
    );
};

export default RoomContainer;
import React from "react";

const RoomContainer = ({ code, name, openRoom, setPage, setRoomData, socket, setWindowMessages}) => {
    return (
        <div className="roomContainer">
            <div className="header">
                <p className="roomCode">{code}</p>
            </div>
            <p className="roomName">{name}</p>
            <button className='buttonWhite' onClick={() => openRoom(code, setPage, setRoomData, socket, setWindowMessages)}>Beitreten</button>
        </div>
    );
};

export default RoomContainer;
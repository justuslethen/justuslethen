import React from "react";

const Header = ({ online, name, setPage, recentPage, share, socket }) => {
    return (
        <header>
            <div className="headerSideConatiner headerLeft">
                <button className="iconButton" onClick={() => {
                    setPage(recentPage);
                    socket.emit("request-public-rooms");
                    if (recentPage == "home") {
                        window.history.pushState({}, "", "/");
                    }
                    document.title = "Chat Rooms"; // set the title of the page
                }}>
                    <img src="/arrowLeft.svg" />
                </button>
            </div>
            <div className="headerCenterContainer">
                {online >= 0 && <p className="onlineUsers">{online} Online</p>}
                {/* <p className="roomName" onClick={() => setPage("chat")}>{name}</p> */}
                <p className="roomName">{name}</p>
            </div>
            <div className="headerSideConatiner">
                {share && (
                    <button className='iconButton' onClick={() => setPage("shareRoom")}>
                        <img src="/shareIcon.svg" />
                    </button>
                )}
            </div>
        </header>
    );
};

export default Header;
import React from "react";

const Header = ({ online, name, setPage, recentPage, share, socket }) => {
    return (
        <header>
            <div className="headerSideConatiner headerLeft">
                <button className="smallButton" onClick={() => {
                    setPage(recentPage);
                    socket.emit("request-public-rooms");
                    window.history.pushState({}, "", "/");
                }}>&lt;</button>
            </div>
            <div className="headerCenterContainer">
                <p className="onlineUsers">{online} Online</p>
                <p className="roomName" onClick={() => setPage("chat")}>{name}</p>
            </div>
            <div className="headerSideConatiner">
                {share && (
                    <button className='iconButton' onClick={() => setPage("shareRoom")}>
                        <svg width="21" height="28" viewBox="0 0 21 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="1.25" y="8.25" width="18.5" height="18.5" rx="1.75" stroke="#4F8AF0" stroke-width="2.5" />
                            <path d="M9.28333 17C9.28333 17.6904 9.84297 18.25 10.5333 18.25C11.2237 18.25 11.7833 17.6904 11.7833 17H9.28333ZM11.7833 17L11.7833 2H9.28333L9.28333 17H11.7833Z" fill="#4F8AF0" />
                            <path d="M6 5.14751L10.5485 2.11125" stroke="#4F8AF0" stroke-width="2.5" stroke-linecap="round" />
                            <path d="M15.3318 5.03625L10.7833 2" stroke="#4F8AF0" stroke-width="2.5" stroke-linecap="round" />
                        </svg>
                    </button>
                )}
            </div>
        </header>
    );
};

export default Header;
import React from "react";

const Header = ({ online, name, setPage, recentPage, share, socket }) => {
    return (
        <header>
            <div className="headerSideConatiner headerLeft">
                <button className="iconButton" onClick={() => {
                    setPage(recentPage);
                    socket.emit("request-public-rooms");
                    window.history.pushState({}, "", "/");
                    document.title = "Chat Rooms"; // set the title of the page
                }}>
                    <svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M10.4454 2.92318C10.9533 2.45557 10.986 1.66479 10.5183 1.15692C10.0507 0.649046 9.25995 0.61641 8.75208 1.08402L1.16345 8.07109C1.1485 8.08459 1.13381 8.09851 1.11938 8.11285C0.877513 8.35262 0.753382 8.66895 0.750068 8.98722C0.748081 9.17808 0.789536 9.36963 0.875098 9.5458C0.933932 9.66714 1.01342 9.78071 1.11335 9.88113C1.12915 9.89704 1.14527 9.91244 1.16171 9.92734L9.0118 17.1907C9.51853 17.6595 10.3094 17.6288 10.7782 17.1221C11.2471 16.6154 11.2164 15.8245 10.7097 15.3557L3.843 9.00225L10.4454 2.92318Z" fill="#4F8AF0" />
                    </svg>
                </button>
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
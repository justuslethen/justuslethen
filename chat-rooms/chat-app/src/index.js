import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { io } from 'socket.io-client';
import './index.css';
import './chat.css';
import RoomContainer from './components/RoomContainer';
import Selection from './components/Selection';
import Header from './components/Header';
import ChatMessages from './components/ChatMessages';
import { createRoom, joinRoom, openRoom, sendMessage } from './room';

const socket = io('chatrooms.justuslethen.de');

const App = () => {
  const contentRef = useRef(null);
  const [page, setPage] = useState("home");
  const [publicRooms, setPublicRooms] = useState([])
  const [configRoomData, setConfigRoomData] = useState({
    roomname: "",
    maxmembers: {
      selections: [3, 10, 15, 30],
      selected: 0
    },
    privacy: {
      selections: ["Öffentlich", "Privat"],
      selected: 0
    },
    roomduration: {
      selections: ["1 Tag", "3 Tage", "7 Tage", "30 Tage"],
      selected: 0
    },
  });
  const [userData, setUserData] = useState({
    username: "",
    color: {
      selections: ["Blau", "Lila", "Pink", "Rot", "Grün", "Orange"],
      selected: 0
    }
  })
  const [roomData, setRoomData] = useState({
    roomname: "",
    code: "",
    online: 0,
    messages: []
  });

  useEffect(() => {
    socket.on("connect", () => {
      socket.emit("request-public-rooms");
    });

    socket.on("data-public-rooms", (rooms) => {
      setPublicRooms(rooms);
    });

    socket.on("new-message", (data) => {
      setRoomData((prev) => ({
        ...prev,
        messages: [...prev.messages, data],
      }));

      setTimeout(() => {
        if (contentRef.current) {
          contentRef.current.scrollTop = contentRef.current.scrollHeight;
        }
      }, 10);
    });

    socket.on("disconnect", () => {
      console.log("Verbindung zum Server getrennt.");
    });

    socket.on("online-users", (online) => {
      setRoomData((prev) => ({
        ...prev,
        online: online,
      }));
    });

    socket.on("message", (message) => {
      setRoomData((prev) => ({
        ...prev,
        messages: [...prev.messages, message],
      }));
    });

    return () => {
      socket.off("connect");
      socket.off("data-public-rooms");
      socket.off("disconnect");
      socket.off("message");
    };
  }, []);

  useEffect(() => {
    const pathSegments = window.location.pathname.split("/");
    if (pathSegments.length === 3 && pathSegments[1] === "room") {
      const code = pathSegments[2];
      openRoom(code, setPage, setRoomData, socket);
    }
  }, []);

  useEffect(() => {
    socket.emit("start-app", (response) => {
      document.cookie = `last_sid=${response.sid}; path=/; SameSite=None; expires=Fri, 31 Dec 9999 23:59:59 GMT;`;
      console.log(response);
      if (typeof response.roomdata !== "undefined") {
        setRoomData({
          roomname: response.roomdata.roomname,
          code: response.roomdata.code,
          online: response.roomdata.online,
          messages: response.roomdata.messages
        });
        setPage("chat");
      }
    });

  }, []);

  return (
    <>
      {page === "home" && (
        <>
          <div className='content'>
            <h1>Privatem Raum beitreten</h1>
            <div className="container">
              <input placeholder='Code' className='codeInput'></input>
              <button
                onClick={() => {
                  const code = document.querySelector('.codeInput')?.value;
                  if (code) {
                    openRoom(code, setPage, setRoomData, socket);
                  } else {
                    console.log("Kein Code eingegeben");
                  }
                }}>Beitreten</button>
            </div>
            <h1>Öffentliche Chat Räume</h1>
            {publicRooms.map((room, index) => (
              <RoomContainer
                key={index}
                code={room.code}
                name={room.roomname}
                openRoom={openRoom}
                setPage={setPage}
                setRoomData={setRoomData}
                socket={socket}
              />
            ))}
          </div>
          <div className='footerContainer'>
            <footer>
              <button onClick={() => setPage("createRoom")}>Raum erstellen</button>
            </footer>
          </div>
        </>
      )}

      {page === "createRoom" && (
        <>
          <div className='content'>
            <h1>Raum erstellen</h1>
            <input
              placeholder='Name'
              value={configRoomData.roomname}
              onChange={(e) =>
                setConfigRoomData(prev => ({
                  ...prev,
                  roomname: e.target.value
                }))
              }
            />
            <Selection
              header="Max. Teilnehmer"
              className="selectionRow"
              selections={configRoomData.maxmembers.selections}
              selected={configRoomData.maxmembers.selected}
              setSelected={(newSelected) =>
                setConfigRoomData(prev => ({
                  ...prev,
                  maxmembers: {
                    ...prev.maxmembers,
                    selected: newSelected
                  }
                }))
              }
            />
            <Selection
              header="Raum Sichtbarkeit"
              className="selectionRow"
              selections={configRoomData.privacy.selections}
              selected={configRoomData.privacy.selected}
              setSelected={(newSelected) =>
                setConfigRoomData(prev => ({
                  ...prev,
                  privacy: {
                    ...prev.privacy,
                    selected: newSelected
                  }
                }))
              }
            />
            <Selection
              header="Raum Dauer"
              className="selectionCol"
              selections={configRoomData.roomduration.selections}
              selected={configRoomData.roomduration.selected}
              setSelected={(newSelected) =>
                setConfigRoomData(prev => ({
                  ...prev,
                  roomduration: {
                    ...prev.roomduration,
                    selected: newSelected
                  }
                }))
              }
            />
          </div>
          <footer>
            <button onClick={() => createRoom(socket, configRoomData, setRoomData, setPage)}>Raum Starten</button>
          </footer>
        </>
      )}
      {page === "createUser" && (
        <>
          <Header online={roomData.online} name={roomData.roomname} setPage={setPage} share="true" />
          <div className='content content-mid-size'>
            <input
              placeholder='Username'
              className='usernameInput'
              value={userData.username}
              onChange={(e) => setUserData(prev => ({
                ...prev,
                username: e.target.value
              }))}
              socket={socket}
            />
            <Selection
              header="Farbe"
              className="selectionCol"
              type="color"
              selections={userData.color.selections}
              selected={userData.color.selected}
              setSelected={(newSelected) =>
                setUserData(prev => ({
                  ...prev,
                  color: {
                    ...prev.color,
                    selected: newSelected
                  }
                }))
              }
            />
          </div>
          <footer>
            <button onClick={() => joinRoom(setPage, roomData, setRoomData, userData, socket, contentRef)}>Beitreten</button>
          </footer>
        </>
      )}

      {page === "shareRoom" && (
        <>
          <Header
            online={roomData.online}
            name={roomData.roomname}
            setPage={setPage}
            socket={socket} />
          <div className='content'>
            <h1>{roomData.code}</h1>
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${window.location.href}`}
              alt="QR-Code für Raum"
            />
            <button onClick={() => navigator.clipboard.writeText(window.location.href)}>
              Link Kopieren
            </button>
          </div>
        </>
      )}

      {page === "chat" && (
        <>
          <Header
            online={roomData.online}
            name={roomData.roomname}
            setPage={setPage}
            share="true"
            socket={socket} />
          <div className='content content-small' ref={contentRef}>
            <ChatMessages messages={roomData.messages} />
          </div>
          <footer>
            <textarea placeholder='Nachicht' className='messageInput'></textarea>
            <button onClick={(e) => {
              const messageInput = e.target.previousElementSibling;
              if (messageInput && messageInput.classList.contains('messageInput')) {
                sendMessage(socket, messageInput.value);
                messageInput.value = "";
              }
            }}>Senden</button>
          </footer>
        </>
      )}
    </>
  );
};

const root = createRoot(document.getElementById('root'));
root.render(<App />);
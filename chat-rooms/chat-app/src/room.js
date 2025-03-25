// send all the data configed to create a room
const createRoom = (socket, configData, setRoomData, setPage) => {
  socket.emit("create-room", configData, (response) => {
    // set the roomdata to the new room
    setRoomData(prev => ({
      ...prev,
      code: response.code,
      roomname: response.roomname,
      online: response.online,
    }));

    // switch the page to create user
    setPage("createUser")
    window.history.pushState({}, "", `/room/${response.code}`); // show in history
  });
};

const openRoom = (code, setPage, setRoomData, socket) => {
  socket.emit("open-room", code, (response) => {
    if (evalate_response(response)) return; // stop execution if there's an error

    // set the roomdata to the room that was opened
    setRoomData(prev => ({
      ...prev,
      code: response.code,
      roomname: response.roomname,
      online: response.online
    }));

    // switch the page to create user
    setPage("createUser");
    window.history.pushState({}, "", `/room/${response.code}`); // show in history
  });
}

const joinRoom = (setPage, roomData, setRoomData, userData, socket, contentRef) => {
  socket.emit("join-room", { code: roomData.code, userdata: userData }, (response) => {
    if (evalate_response(response)) return; // Stop execution if there's an error


    setRoomData(prev => ({
      ...prev,
      messages: response,
    }));
    setPage("chat");
    
    // set a timeout to avoid errors in case of a slow rendering
    setTimeout(() => {
      if (contentRef.current) {
        contentRef.current.scrollTop = contentRef.current.scrollHeight; // scroll the messages to the bottom
      }
    }, 10);
  });
}

const sendMessage = (socket, message) => {
  socket.emit("send-message", message);
}


// check the response for any of the error string
// return true if there is an error
const evalate_response = (response) => {
  let error = true;
  if (response == "room not found") {
    alert("Raum existiert nicht");
  } else if (response == "room is full") {
    alert("Raum ist voll");
  } else if (response == "room has ended") {
    alert("Raum ist beendet");
  } else if (response == "username is empty") {
    alert("Nutzername fehlt");
  } else {
    error = false;
  }
  return error;
};

export {
  createRoom,
  openRoom,
  joinRoom,
  sendMessage
}
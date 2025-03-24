const createRoom = (socket, configData, setRoomData, setPage) => {
  socket.emit("create-room", configData, (response) => {
    setRoomData(prev => ({
      ...prev,
      code: response.code,
      roomname: response.roomname,
      online: response.online,
    }));
    setPage("createUser")
    window.history.pushState({}, "", `/room/${response.code}`);
  });
};

const openRoom = (code, setPage, setRoomData, socket) => {
  socket.emit("open-room", code, (response) => {
    if (evalate_response(response)) return; // Stop execution if there's an error

    setRoomData(prev => ({
      ...prev,
      code: response.code,
      roomname: response.roomname,
      online: response.online
    }));
    setPage("createUser");
    window.history.pushState({}, "", `/room/${response.code}`);
  });
}

const joinRoom = (setPage, roomData, setRoomData, userData, socket, contentRef) => {
  socket.emit("join-room", { code: roomData.code, userdata: userData }, (response) => {
    if (evalate_response(response)) return; // Stop execution if there's an error
    console.log(response);
    setRoomData(prev => ({
      ...prev,
      messages: response,
    }));
    setPage("chat");
    
    setTimeout(() => {
      if (contentRef.current) {
        contentRef.current.scrollTop = contentRef.current.scrollHeight;
      }
    }, 10);
  });
}

const sendMessage = (socket, message) => {
  socket.emit("send-message", message);
}

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
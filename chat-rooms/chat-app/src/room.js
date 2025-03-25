// send all the data configed to create a room
const createRoom = (socket, configData, setRoomData, setPage, setWindowMessages) => {
  socket.emit("create-room", configData, (response) => {
    if (evalate_response(response, setWindowMessages)) return; // stop execution if there's an error

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
    document.title = `${response.roomname} - Chat Rooms`; // set the title of the page
  });
};

const openRoom = (code, setPage, setRoomData, socket, setWindowMessages) => {
  socket.emit("open-room", code, (response) => {
    if (evalate_response(response, setWindowMessages)) return; // stop execution if there's an error

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
    document.title = `${response.roomname} - Chat Rooms`; // set the title of the page
  });
}

const joinRoom = (setPage, roomData, setRoomData, userData, socket, contentRef, setWindowMessages) => {
  // save the user config for the lobby in localstorage
  
  socket.emit("join-room", { code: roomData.code, userdata: userData }, (response) => {
    if (evalate_response(response, setWindowMessages)) return; // Stop execution if there's an error
    saveUserConfigForLobby(userData);

    // set the roomdata to the room that was joined
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
const evalate_response = (response, setWindowMessages) => {
  let error = true;
  let message = "";
  if (response == "room not found") {
    message = "Raum existiert nicht";
  } 
  else if (response == "room is full") {
    message = "Raum ist voll";
  } 
  else if (response == "room has ended") {
    message = "Raum ist beendet";
  } 
  else if (response == "username is empty") {
    message = "Nutzername fehlt";
  } 
  else if (response == "username is taken") {
    message = "Nutzername ist schon vergeben";
  } 
  else if (response == "username contains swear words") {
    message = "Bitte anderen Nutzernamen wählen";
  } 
  else if (response == "roomname is empty") {
    message = "Raumname fehlt";
  } 
  else {
    error = false;
  }
  
  setWindowMessages(prev => ([
    ...prev,
    message,
  ]));

  return error;
};


// save all the lobby config in localstorage to reconnect later
const saveUserConfigForLobby = (userData) => {
  let userConfigData = JSON.parse(localStorage.getItem("userConfigData")) || {};
  const code = extractCodeFromUrl();
  userConfigData[code] = {
    username: userData.username || "Name",
    colorChoise: userData.color.selected || 0,
  };
  localStorage.setItem("userConfigData", JSON.stringify(userConfigData));
}


// extract the code from the last snipet from the url
const extractCodeFromUrl = () => {
  const url = window.location.href;
  const code = url.split("/")[url.split("/").length - 1];
  return code;
}


// try to join the room when its known
const tryToJoin = (setPage, contentRef, setRoomData, setUserData, userData, setWindowMessages, socket) => {
  const code = extractCodeFromUrl(); // get the code
  const userConfigData = JSON.parse(localStorage.getItem("userConfigData")) || {}; // load config from localstorage

  // is a config for this room known?
  if (userConfigData[code]) {
    // set the userData to the config stored in localstorage
    setUserData(prev => ({
      ...prev,
      username: userConfigData[code].username,
      color: {
        ...prev.color,
        selected: userConfigData[code].colorChoise,
      }
    }));

    // change userDaata to the fiting format
    const dataOfUser = { color: { selected: userConfigData[code].colorChoise }, username: userConfigData[code].username }

    console.log(dataOfUser);

    // {code: code} represents the needet part of roomData
    joinRoom(setPage, { code: code }, setRoomData, dataOfUser, socket, contentRef, setWindowMessages);
  }
}


export {
  createRoom,
  openRoom,
  joinRoom,
  sendMessage,
  tryToJoin
}
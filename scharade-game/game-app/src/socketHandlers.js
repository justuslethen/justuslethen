import socketio from 'socket.io-client';
import { useRef } from 'react';

const socket = socketio('http://127.0.0.1:4500');

const joinLobby = (pin, setLobbyData, setPage, setTitle, setWindowMessages) => {
    socket.emit('join_lobby', { pin: pin }, (data) => {

        // check for errors or missing inputs
        if (evalateResponse(data, setWindowMessages)) return;

        if (data && data.lobbydata) {

            // delete hostCode to avoid conflicts
            localStorage.setItem('playerSid', data.lobbydata.playersid);
            localStorage.removeItem('hostCode');

            // set page, lobbyData and title
            setUpLobby(data, setTitle, setLobbyData, setPage);
        }
    });
};


const createLobby = (config_data, setLobbyData, setPage, setTitle, setWindowMessages) => {
    socket.emit('create_lobby', config_data, (data) => {

        // check for errors or missing inputs
        if (evalateResponse(data, setWindowMessages)) return;
        if (data && data.lobbydata) {

            // delete playerSid to avoid conflicts
            localStorage.setItem('hostCode', data.hostcode);
            localStorage.removeItem('playerSid');

            // set page, lobbyData and title
            setUpLobby(data, setTitle, setLobbyData, setPage);
        }
    });
};


const setUpLobby = (data, setTitle, setLobbyData, setPage) => {
    setLobbyData(data.lobbydata);
    setPage("createName");
    updateTitle(setTitle, data.lobbydata.lobbycode, data.lobbydata.lobbyname);
}


const setUserName = (username, setPage, setWindowMessages) => {
    socket.emit('set_username', { username: username }, (data) => {

        // check for errors creating the name
        if (evalateResponse(data, setWindowMessages)) return;

        if (data.username) {
            // show other teams and their players
            setPage("players");
        }
    });
};


const setTeamName = (teamName, setWindowMessages) => {
    socket.emit('set_team_name', { teamname: teamName }, (data) => {
        // check for errors creating the name
        if (evalateResponse(data, setWindowMessages)) return;
    });
};


const addNewUserToTeam = (lobbyData, data) => {
    const username = data.username;
    const teamName = data.teamname;

    if (!lobbyData.teams) return // return if array is missing

    // look for existing team name and return if team was found or not
    const teamExists = lobbyData.teams.some(team => team.teamname === teamName);

    // map teams and add new member to team
    const updatedTeams = teamExists
        ? lobbyData.teams.map((team) => {
            if (team.teamname === teamName) {
                return {
                    ...team,
                    members: [...team.members, username]
                };
            }
            return team;
        })
        : [...lobbyData.teams, { teamname: teamName, members: [username] }]; // add new team and member if team was not found
    lobbyData.teams = updatedTeams;
};


const handleHostContinuation = (hostCode, setLobbyData, setGameData, setTitle, setPage, setCountdown, timerRef) => {
    const continueLobby = window.confirm("Möchtest du als Host in der vorherigen Runde vortfahren?");
    if (continueLobby) {
        socket.emit('host_back_to_lobby', { hostcode: hostCode }, (data) => {
            // setup all important configs and data
            fowardWithGame(data, setLobbyData, setGameData, setTitle, setPage, setCountdown, timerRef);
        });
    } else {
        localStorage.removeItem('hostCode'); // remove hostCode to avoid the popup after reload
    }
};


const handlePlayerContinuation = (playerSid, setLobbyData, setGameData, setTitle, setPage, setCountdown, timerRef) => {
    const continueAsPlayer = window.confirm("Möchtest du als Spieler in der vorherigen Runde vortfahren?");
    if (continueAsPlayer) {
        socket.emit('forward_as_player', { playersid: playerSid }, (data) => {
            // update playerSid to new one
            localStorage.setItem('playerSid', data.lobbydata.playersid);

            // setup all important configs and data
            fowardWithGame(data, setLobbyData, setGameData, setTitle, setPage, setCountdown, timerRef);
        });
    } else {
        localStorage.removeItem('playerSid'); // remove playerSid to avoid the popup after reload
    }
};


const fowardWithGame = (data, setLobbyData, setGameData, setTitle, setPage, setCountdown, timerRef) => {
    // if data is not given dont execute
    if (!data || !data.page || !data.lobbydata) return false;
    console.log("fowardWithGame", data);

    // set title, gameData, lobbyData, coundown and page
    configAllForwardingData(data, setPage, setGameData, setLobbyData, setTitle, setCountdown);


    setPage(data.page);

    // start a new time with the new coundown timer
    // if the round is still running
    startTimerIfRoundRunning(data, setCountdown, timerRef);
    if (data.gamedata.isownturn) {
        if (data.gamedata.isroundrunning || data.gamedata.isroundover) {
            // when round is running and its own turn
            // set page to ownRound to continue the round
            setPage("ownRound");
        }
    }
}


const configAllForwardingData = (data, setPage, setGameData, setLobbyData, setTitle, setCountdown) => {
    // update all important jsons to the data recieved

    setPage(data.page);
    setLobbyData(data.lobbydata);
    setGameData(data.gamedata);
    setCountdownData(data, setCountdown)

    // set title to "{lobbyname} - {code}"
    updateTitle(setTitle, data.lobbydata.lobbycode, data.lobbydata.lobbyname)
}


const setCountdownData = (data, setCountdown) => {
    // setCountdown with the data
    // use the time converted from UTC to local

    setCountdown({
        timeleft: data.timeatstart,
        timeatstart: data.timeatstart,
        startdate: new Date(data.startdate).getTime()
    });
}


const startTimerIfRoundRunning = (data, setCountdown, timerRef) => {
    if (!data.gamedata) return false;

    // if the round has started and not endet yet
    if (data.gamedata.isroundrunning || data.gamedata.isroundover) {
        // start a new timer with the new given countdown data
        startTimerWithData(data, setCountdown, timerRef);

        // return if the round is still running
        return true;
    }
    return false;
}



const changeTeamName = (lobbyData, setLobbyData, teamName, oldTeamName) => {
    // if teams object is in lobbydata
    if (lobbyData.teams) {
        // map the teams and replace the team name with the new one
        // dont change the other data
        const updatedTeams = lobbyData.teams.map((team) => {
            if (team.teamname === oldTeamName) {
                return {
                    ...team,
                    teamname: teamName
                };
            }
            return team;
        });

        // update the game data with the new team name
        setLobbyData({ ...lobbyData, teams: updatedTeams });
    }
};


// set the title with the given name and code
// like this: {name} - {code}
const updateTitle = (setTitle, lobbyCode, lobbyName) => {
    setTitle(lobbyCode + " - " + lobbyName);
}


const startTimer = (countdown, setCountdown, timerRef) => {
    // execute first to update as fast as possible
    setTimerToState(timerRef, countdown, setCountdown);

    // update every 100 millis to provide a smoth and synced countdown
    timerRef.current = setInterval(() => {
        setTimerToState(timerRef, countdown, setCountdown);
    }, 100);
}


const setTimerToState = (timerRef, countdown, setCountdown) => {
    // calc the time left since start
    // starttime - countdowntime (timeatstart) - now
    let timeLeft = (countdown.startdate + countdown.timeatstart * 1000 - Date.now()) / 1000;

    // is time is up clear intervall and round timer to 0
    if (timeLeft <= 0) {
        clearInterval(timerRef.current);
        timeLeft = 0;
    }

    // set the coundown data to calculated times to display changes
    setCountdown(prevCountdown => {
        return {
            ...prevCountdown,
            timeleft: timeLeft
        }
    });
}


const clearTimer = (timerRef) => {
    // clear the timer countdown
    if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
    }
}


const handleRemovedUser = (data, setLobbyData, username) => {
    // if removed user is client itself
    if (data.amiremoved) {
        // delete stored data and reload
        localStorage.removeItem('playerSid');
        window.location.reload();
    }

    // update teams in lobbyData
    // map through teams and delete the user
    setLobbyData(prevLobbyData => {
        const newLobbyData = { ...prevLobbyData };
        newLobbyData.teams = newLobbyData.teams.map((team) => {
            team.members = team.members.filter((member) => member !== data.username);
            return team;
        }).filter(team => team.members.length > 0); // remove team if empty now
        return newLobbyData;
    });
}


// check the response for any of the error string
// return true if there is an error
const evalateResponse = (response, setWindowMessages) => {
    let error = true;

    // set the message to the massage that should be displayed for an error
    let message = "";
    if (response == "game not found") {
        message = "Spiel existiert nicht";
    } else if (response == "username empty") {
        message = "Bitte Nutzernamen angeben";
    } else if (response == "teamname empty") {
        message = "Bitte Teamnamen eingeben";
    } else if (response == "word empty") {
        message = "Bitte Wort eingeben";
    } else if (response == "any field empty") {
        message = "Bitte alle Felder ausfüllen";
    } else if (response == "username is taken") {
        message = "Nutzername ist schon vergeben";
    } else if (response == "word contains swear words") {
        message = "Bitte anderes Wort wählen";
    } else if (response == "name contains swear words") {
        message = "Bitte anderen Namen wählen";
    } else if (response == "teamname is taken") {
        message = "Der Teamname ist schon vergeben";
    } else if (response == "roomname is empty") {
        message = "Bitte Raumnamen angeben";
    } else {
        error = false;
    }

    // set window message with the defined message
    setWindowMessages(prev => ([
        ...prev,
        message,
    ]));

    // return bool if error was found
    return error;
};


const calcBottomHeight = (page, lobbyData, gameData) => {
    console.log("calcBottomHeight", page, lobbyData, gameData);

    let bottomHeight = 0;
    // set every height manually for every page
    if (page === "gamePin" || page === "createName" || page === "words" || page === "players") {
        bottomHeight = 156;
    } else if (page === "createLobby") {
        bottomHeight = 384;
    } else if (page === "start" && gameData.isownturn) {
        bottomHeight = 80;
    } else if (page === "game" && gameData.isownturn) {
        bottomHeight = 80;
    } else if (page === "ownRound" || page === "endData") {
        bottomHeight = 80;
    }

    // different sizes für host because host has extra buttons that need more space
    if (lobbyData.ishost) {
        if (page === "words" || page === "players") {
            bottomHeight = 232;
        } else if (page === "roundScore") {
            bottomHeight = 80;
        }
    }

    return bottomHeight;
}


const startTimerWithData = (data, setCountdown, timerRef) => {
    // use data values because the countdown isnt stored yet

    startTimer({
        timeleft: data.timeleftatstart,
        timeatstart: data.timeatstart,
        startdate: new Date(data.startdate).getTime()
    }, setCountdown, timerRef);
}


const updateGameDataNextWord = (data, setGameData) => {
    setGameData(prevGameData => {
        return {
            ...prevGameData,
            currentword: data.word,
        };
    });
}


export {
    socket,
    joinLobby,
    createLobby,
    setUserName,
    setTeamName,
    addNewUserToTeam,
    changeTeamName,
    handleHostContinuation,
    handlePlayerContinuation,
    startTimer,
    clearTimer,
    handleRemovedUser,
    evalateResponse,
    calcBottomHeight,
    setCountdownData,
    startTimerWithData,
    updateGameDataNextWord
};
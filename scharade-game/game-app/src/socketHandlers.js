import socketio from 'socket.io-client';
import { useRef } from 'react';

const socket = socketio('http://127.0.0.1:4500');

const joinLobby = (pin, setLobbyData, setPage, setTitle, setWindowMessages) => {
    socket.emit('join_lobby', { pin: pin }, (data) => {
        if (evalateResponse(data, setWindowMessages)) return;
        if (data && data.lobbydata) {
            localStorage.setItem('playerSid', data.lobbydata.playersid);
            localStorage.removeItem('hostCode'); // delete playerSid to avoid conflicts
            setLobbyData(data.lobbydata);
            setPage("createName");
            updateTitle(setTitle, data.lobbydata.lobbycode, data.lobbydata.lobbyname);
        }
    });
};

const createLobby = (config_data, setLobbyData, setPage, setTitle, setWindowMessages) => {
    socket.emit('create_lobby', config_data, (data) => {
        if (evalateResponse(data, setWindowMessages)) return;
        if (data && data.lobbydata) {
            localStorage.setItem('hostCode', data.hostcode);
            localStorage.removeItem('playerSid'); // delete playerSid to avoid conflicts

            setLobbyData(data.lobbydata);
            setPage("createName");
            updateTitle(setTitle, data.lobbydata.lobbycode, data.lobbydata.lobbyname);
        }
    });
};

const setUserName = (username, setPage, setWindowMessages) => {
    socket.emit('set_username', { username: username }, (data) => {
        if (evalateResponse(data, setWindowMessages)) return;
        if (data.username) {
            setPage("players");
        }
    });
};

const setTeamName = (teamName, setWindowMessages) => {
    socket.emit('set_team_name', { team_name: teamName }, (data) => {
        if (evalateResponse(data, setWindowMessages)) return;
        if (data.team_name) {
            console.log("Team name set to:", data.team);
        }
    });
};

const addNewUserToTeam = (lobbyData, data) => {
    const username = data.username;
    const teamName = data.team_name;

    if (lobbyData.teams) {
        const teamExists = lobbyData.teams.some(team => team.team_name === teamName);
        const updatedTeams = teamExists
            ? lobbyData.teams.map((team) => {
                if (team.team_name === teamName) {
                    return {
                        ...team,
                        members: [...team.members, username]
                    };
                }
                return team;
            })
            : [...lobbyData.teams, { team_name: teamName, members: [username] }];
        lobbyData.teams = updatedTeams;
    }
};

const handleHostContinuation = (hostCode, setLobbyData, setGameData, setTitle, setPage, setCountdown, timerRef) => {
    const continueLobby = window.confirm("Möchtest du als Host in der vorherigen Runde vortfahren?");
    if (continueLobby) {
        socket.emit('host_back_to_lobby', { hostcode: hostCode }, (data) => {
            if (data && data.page && data.lobbydata) {
                setPage(data.page);
                setLobbyData(data.lobbydata);
                setGameData(data.gamedata);
                setTitle(data.lobbydata.lobbyname + " - " + data.lobbydata.lobbycode);
                setCountdown({
                    timeleft: data.timeatstart,
                    timeatstart: data.timeatstart,
                    startdate: new Date(data.startdate).getTime()
                });
                if (data.gamedata.isroundrunning) {
                    startTimer({
                        timeleft: data.timeatstart,
                        timeatstart: data.timeatstart,
                        startdate: new Date(data.startdate).getTime()
                    }, setCountdown, timerRef);
                    if (data.gamedata.isownturn) {
                        setPage("ownRound");
                    }
                }
            }

            console.log("data:", data);
        });
    } else {
        localStorage.removeItem('hostCode');
    }
};

const handlePlayerContinuation = (playerSid, setLobbyData, setGameData, setTitle, setPage, setCountdown, timerRef) => {
    const continueAsPlayer = window.confirm("Möchtest du als Spieler in der vorherigen Runde vortfahren?");
    if (continueAsPlayer) {
        socket.emit('forward_as_player', { playersid: playerSid }, (data) => {
            if (data && data.page && data.lobbydata) {
                localStorage.setItem('playerSid', data.lobbydata.playersid);
                const [gameData, lobbyData] = defineNewData(data, setGameData, setLobbyData);
                setCountdown({
                    timeleft: data.timeatstart,
                    timeatstart: data.timeatstart,
                    startdate: new Date(data.startdate).getTime()
                });
                setPage(data.page);
                setTitle(lobbyData.lobbyname + " - " + lobbyData.lobbycode);
                if (data.gamedata.isroundrunning) {
                    startTimer({
                        timeleft: data.timeatstart,
                        timeatstart: data.timeatstart,
                        startdate: new Date(data.startdate).getTime()
                    }, setCountdown, timerRef);
                    if (data.gamedata.isownturn) {
                        setPage("ownRound");
                    }
                }
            }
            console.log("data:", data);
        });
    } else {
        localStorage.removeItem('playerSid');
    }
};

const defineNewData = (data, setGameData, setLobbyData) => {
    if (data.gamedata) {
        setGameData(data.gamedata);
    }
    if (data.lobbydata) {
        setLobbyData(data.lobbydata);
    }

    return [data.gamedata, data.lobbydata];
}

const changeTeamName = (lobbyData, setLobbyData, teamName, oldTeamName) => {
    // Check if the game data contains teams
    if (lobbyData.teams) {
        // Map through the teams and update the team name if it matches the old team name
        const updatedTeams = lobbyData.teams.map((team) => {
            if (team.team_name === oldTeamName) {
                return {
                    ...team,
                    team_name: teamName
                };
            }
            return team;
        });

        // Update the game data with the new team names
        setLobbyData({ ...lobbyData, teams: updatedTeams });
    }
};

const updateTitle = (setTitle, lobbyCode, lobbyName) => {
    setTitle(lobbyName + " - " + lobbyCode);
}

const startTimer = (countdown, setCountdown, timerRef) => {
    console.log("countdown:");
    console.log(countdown);
    timerRef.current = setInterval(() => {
        let timeLeft = (countdown.startdate + countdown.timeatstart * 1000 - Date.now()) / 1000;
        if (timeLeft <= 0) {
            clearInterval(timerRef.current);
            timeLeft = 0;
        }

        // console.log(`now: ${Date.now()} startdate:${countdown.startdate} timeatstart:${countdown.timeatstart} timeLeft:${timeLeft}`);

        setCountdown(prevCountdown => {
            return {
                ...prevCountdown,
                timeleft: timeLeft
            }
        });
    }, 400);
}

const clearTimer = (timerRef) => {
    if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
    }
}

const handleRemovedUser = (data, setLobbyData, username) => {
    if (data.username === username) {
        localStorage.removeItem('playerSid');
        window.location.reload();
    }
    setLobbyData(prevLobbyData => {
        const newLobbyData = { ...prevLobbyData };
        newLobbyData.teams = newLobbyData.teams.map((team) => {
            team.members = team.members.filter((member) => member !== data.username);
            return team;
        }).filter(team => team.members.length > 0); // Remove empty teams
        return newLobbyData;
    });
}

// check the response for any of the error string
// return true if there is an error
const evalateResponse = (response, setWindowMessages) => {
    let error = true;
    let message = "";
    if (response == "game not found") {
        message = "Spiel existiert nicht";
    }
    else if (response == "username empty") {
        message = "Bitte Nutzernamen angeben";
    }
    else if (response == "teamname empty") {
        message = "Bitte Teamnamen eingeben";
    }
    else if (response == "word empty") {
        message = "Bitte Wort eingeben";
    }
    else if (response == "any field empty") {
        message = "Bitte alle Felder ausfüllen";
    }
    else if (response == "username is taken") {
        message = "Nutzername ist schon vergeben";
    }
    else if (response == "word contains swear words") {
        message = "Bitte anderes Wort wählen";
    }
    else if (response == "name contains swear words") {
        message = "Bitte anderen Namen wählen";
    }
    else if (response == "roomname is empty") {
        message = "Bitte Raumnamen angeben";
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
};
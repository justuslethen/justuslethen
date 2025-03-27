import socketio from 'socket.io-client';
import { useRef } from 'react';

const socket = socketio('http://127.0.0.1:4500');

const joinLobby = (pin, setLobbyData, setPage, setTitle, setWindowMessages) => {
    socket.emit('join_lobby', { pin: pin }, (data) => {
        if (evalateResponse(data, setWindowMessages)) return;
        if (data && data.lobby_data) {
            const newLobbyData = convertLobbyData(data.lobby_data);
            localStorage.setItem('playerSid', data.lobby_data.player_sid);
            localStorage.removeItem('hostCode'); // delete playerSid to avoid conflicts
            setLobbyData(newLobbyData);
            setPage("createName");
            updateTitle(setTitle, newLobbyData.lobbyCode, newLobbyData.lobbyName);
        }
    });
};

const createLobby = (config_data, setLobbyData, setPage, setTitle, setWindowMessages) => {
    socket.emit('create_lobby', config_data, (data) => {
        if (evalateResponse(data, setWindowMessages)) return;
        if (data && data.lobby_data) {
            localStorage.setItem('hostCode', data.host_code);
            localStorage.removeItem('playerSid'); // delete playerSid to avoid conflicts

            const lobbyData = convertLobbyData(data.lobby_data);
            setLobbyData(lobbyData);
            setPage("createName");
            updateTitle(setTitle, lobbyData.lobbyCode, lobbyData.lobbyName);
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

const handleHostContinuation = (hostCode, setLobbyData, setGameData, setTitle, setPage) => {
    const continueLobby = window.confirm("Möchtest du als Host in der vorherigen Runde vortfahren?");
    if (continueLobby) {
        socket.emit('host_back_to_lobby', { host_code: hostCode }, (data) => {
            if (data && data.page && data.lobby_data) {
                const [gameData, lobbyData] = defineNewData(data, setGameData, setLobbyData);
                setPage(data.page);
                setTitle(lobbyData.lobbyName + " - " + lobbyData.lobbyCode);
            }
        });
    } else {
        localStorage.removeItem('hostCode');
    }
};

const handlePlayerContinuation = (playerSid, setLobbyData, setGameData, setTitle, setPage) => {
    const continueAsPlayer = window.confirm("Möchtest du als Spieler in der vorherigen Runde vortfahren?");
    if (continueAsPlayer) {
        socket.emit('forward_as_player', { player_sid: playerSid }, (data) => {
            if (data && data.page && data.lobby_data) {
                localStorage.setItem('playerSid', data.lobby_data.player_sid);
                const [gameData, lobbyData] = defineNewData(data, setGameData, setLobbyData);
                setPage(data.page);
                setTitle(lobbyData.lobbyName + " - " + lobbyData.lobbyCode);
            }
        });
    } else {
        localStorage.removeItem('playerSid');
    }
};

const defineNewData = (data, setGameData, setLobbyData) => {
    let newGameData = {};
    let newLobbyData = {};
    if (data.game_data) {
        newGameData = convertGameData(data.game_data);
        setGameData(newGameData);
    }
    if (data.lobby_data) {
        newLobbyData = convertLobbyData(data.lobby_data);
        setLobbyData(newLobbyData);
    }

    return [newGameData, newLobbyData];
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

const convertLobbyData = (data) => {
    return {
        lobbyCode: data.lobby_code,
        isHost: data.is_host || false,
        lobbyName: data.lobby_name,
        numberOfRounds: data.number_of_rounds,
        numberOfTeams: data.number_of_teams,
        amountOfTime: data.round_time,
        teams: data.teams || [],
        words: data.words || [],
        playerSid: data.player_sid,
        header: data.lobbyName + " - " + data.lobbyCode
    };
};

const convertGameData = (data) => {
    console.log("game data:", data);
    return {
        currentTurnUser: data.current_turn_user,
        isOwnTurn: data.is_own_turn,
        currentTurnTeam: data.current_turn_team,
        timeLeft: data.time_left_at_start,
        amountOfTime: data.time_left_at_start,
        currentWord: data.current_word || "",
        teamsScore: data.teams_score || [],
        round: data.current_round,
        roundStarted: data.round_started,
        isLastWord: data.is_last_word || false,
    };
};


const updateTitle = (setTitle, lobbyCode, lobbyName) => {
    setTitle(lobbyName + " - " + lobbyCode);
}

const startTimer = (setCountdown, amountOfTime, timerRef) => {
    const start = Date.now();
    amountOfTime = 30; // amountOfTime in seconds
    timerRef.current = setInterval(() => {
        const timePassed = Date.now() - start;
        const timeLeft = amountOfTime - timePassed / 1000;

        setCountdown(prevCountdown => {
            console.log(`timeLeft: ${timeLeft}, amountOfTime: ${amountOfTime}, timePassed: ${timePassed}`);
            if (timeLeft <= 0) {
                clearInterval(timerRef.current);
                return { ...prevCountdown, timeLeft: 0 };
            } else {
                return { ...prevCountdown, timeLeft: timeLeft };
            }
        });
    }, 200);
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
    convertGameData,
    startTimer,
    clearTimer,
    handleRemovedUser,
    evalateResponse,
};
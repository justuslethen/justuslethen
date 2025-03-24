import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import Header from './components/header';
import PrimaryButton from './components/primaryButton';
import DeleteButton from './components/deleteButton';
import SecondaryButton from './components/secondaryButton';
import Timer from './components/timer';
import PlayerCircle from './components/playerCirle';
import Input from './components/input';
import '../src/design1.css';
import {
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
    handleRemovedUser
} from './socketHandlers';

const App = () => {
    const [page, setPage] = useState("start");
    const [title, setTitle] = useState("Scharade");
    const [gameData, setGameData] = useState({
        currentTurnUser: "",
        isOwnTurn: false,
        currentTurnTeam: "",
        timeLeft: 0,
        currentWord: "",
        teamsScore: [],
        round: 0,
    });
    const [lobbyData, setLobbyData] = useState({
        teams: [],
        words: [],
    });
    const [countdown, setCountdown] = useState({
        timeLeft: 30,
    });
    const [teamScore, setTeamScore] = useState([]);

    const timerRef = useRef(null);

    useEffect(() => {
        const hostCode = localStorage.getItem('hostCode');
        const playerSid = localStorage.getItem('playerSid');

        if (hostCode) {
            handleHostContinuation(hostCode, setLobbyData, setGameData, setTitle, setPage);
            console.log("lobby data:", lobbyData);
        } else if (playerSid && !hostCode) {
            handlePlayerContinuation(playerSid, setLobbyData, setGameData, setTitle, setPage);
            console.log("lobby data:", lobbyData);
        }
    }, []);

    const handleJoinLobby = () => {
        const pin = parseInt(document.querySelector('input').value, 10);
        joinLobby(pin, setLobbyData, setPage, setTitle);
    };

    const handleCreateLobby = () => {
        const config_data = getcreateLobbyData();
        createLobby(config_data, setLobbyData, setPage, setTitle);
        console.log("game data:", lobbyData);
    };

    const handleSetUserName = () => {
        const username = document.querySelector('#username').value;
        setUserName(username, setPage);
        console.log(lobbyData);
    };

    const handleSetTeamName = () => {
        const teamName = document.querySelector('#teamName').value;
        if (teamName.trim() !== "") {
            setTeamName(teamName);
            document.querySelector('#teamName').value = '';
        }
    };

    const getcreateLobbyData = () => {
        return {
            number_of_rounds: parseInt(document.querySelector('#numberOfRounds').value, 10),
            number_of_teams: parseInt(document.querySelector('#numberOfTeams').value, 10),
            round_time: parseInt(document.querySelector('#amountOfTime').value, 10),
            lobby_name: document.querySelector('#lobbyName').value
        };
    };

    const startWordRound = () => {
        socket.emit('start_word_round');
    };

    const addWord = () => {
        const word = document.querySelector('#wordInput').value;
        document.querySelector('#wordInput').value = '';
        socket.emit('add_word', { word: word });
        setLobbyData(prevlobbyData => ({
            ...prevlobbyData,
            words: [...prevlobbyData.words, word]
        }));
    };

    const startGame = () => {
        socket.emit('start_game');
    };

    const startRound = () => {
        socket.emit('start_round');
    };

    const guessedWordCorrect = () => {
        setGameData(prevGameData => {
            if (prevGameData.isOwnTurn) {
                socket.emit('guessed_word_correct', { word: prevGameData.currentWord }, (data) => {
                    console.log("data:", data);
                    setGameData({ ...prevGameData, currentWord: data.word, isLastWord: data.is_last_word });
                    console.log("data after update:", data);
                });
            }
            return prevGameData;
        });
    };

    const nextPlayer = () => {
        socket.emit('next_player');
        clearTimer(timerRef);
        setPage("game");
    };

    const nextRound = () => {
        socket.emit('next_round');
        clearTimer(timerRef);
        setPage("game");
    };

    const endRound = () => {
        socket.emit('end_round', { word: gameData.currentWord });
        clearTimer(timerRef);
    };

    const backToStart = () => {
        localStorage.removeItem('hostCode');
        localStorage.removeItem('playerSid');
        window.location.reload();
    }

    const removeUser = (username) => {
        socket.emit('remove_user', { username: username });
    }

    useEffect(() => {
        socket.on('end_game', (data) => {
            setTeamScore(prevTeamScore => {
                return data.teamScore;
            });
            clearTimer(timerRef);
            setPage("endData");
        });
    }, []);

    useEffect(() => {
        socket.on('end_round', (data) => {
            setGameData(prevGameData => {
                const newGameData = convertGameData(data.game_data);
                return newGameData;
            });
            clearTimer(timerRef);
            setPage("roundScore");
        });
    }, []);

    useEffect(() => {
        socket.on('new_user_joined', (data) => {
            if (data && data.username && data.team_name) {
                console.log("Before adding new user:", lobbyData);
                setLobbyData(prevLobbyData => {
                    const newLobbyData = { ...prevLobbyData };
                    addNewUserToTeam(newLobbyData, data);
                    console.log("After adding new user:", newLobbyData);
                    return newLobbyData;
                });
            }
        });
    }, []);

    useEffect(() => {
        socket.on('new_team_name', (data) => {
            console.log(`new team name: ${data.team_name} old team name: ${data.old_team_name}`);
            setLobbyData(prevLobbyData => {
                const newLobbyData = { ...prevLobbyData };
                changeTeamName(newLobbyData, setLobbyData, data.team_name, data.old_team_name);
                return newLobbyData;
            });
        });
    }, []);

    useEffect(() => {
        socket.on('start_word_round', () => {
            setPage("words");
        });
    }, []);

    useEffect(() => {
        socket.on('end_round', (data) => {
            const newGameData = convertGameData(data.game_data);
            setGameData(newGameData);
            clearTimer(timerRef);
            setPage("roundScore");
        });
    }, []);

    useEffect(() => {
        socket.on('start_game', (data) => {
            console.log("game data:", data);
            setGameData(prevGameData => {
                const newGameData = convertGameData(data.game_data);
                return newGameData;
            });
            clearTimer(timerRef);
            console.log("start_game")
            setPage("game");
        });
    }, []);

    useEffect(() => {
        socket.on('start_round', (data) => {
            console.log("start round data:", data);
            if (data) {
                setGameData(prevGameData => {
                    const newGameData = { ...prevGameData, currentWord: data.word, amountOfTime: data.amountOfTime };
                    console.log("start_round game data:", newGameData);
                    return newGameData;
                });
                setPage("ownRound");
            }
            clearTimer(timerRef);
            startTimer(setCountdown, 60, timerRef);
        });
    }, []);

    useEffect(() => {
        socket.on('removed_user', (data) => {
            console.log("removed user:", data);
            if (data) {
                console.log("data.username:", data.username, "lobbyData.username:", lobbyData.username);
                const username = lobbyData.username;
                handleRemovedUser(data, setLobbyData, username);
            }
        });
    }, []);

    return (
        <>
            <Header title={title} />
            <div className="backgroundAmbiente">
                <div id="div1" />
                <div id="div2">
                    <div>
                    </div>
                </div>
                <div id="div3" />
                <div id="div4" />
                <div id="div5" />
            </div>
            {page === "start" && (
                <section className="bottomContainer">
                    <SecondaryButton name="Lobby Erstellen" onClick={() => setPage("createLobby")} />
                    <PrimaryButton name="Lobby Beitreten" onClick={() => setPage("gamePin")} />
                </section>
            )}

            {page === "gamePin" && (
                <section className="bottomContainer">
                    <Input placeholder="Spiel Pin" className="numberInput" id="gamePin" />
                    <PrimaryButton name="Spiel Starten" onClick={() => handleJoinLobby()} />
                </section>
            )}

            {page === "createLobby" && (
                <section className="bottomContainer">
                    <Input placeholder="Lobbyname" className="textInput" id="lobbyName" />
                    <Input placeholder="Runden" className="textInput" id="numberOfRounds" />
                    <Input placeholder="Teams" className="textInput" id="numberOfTeams" />
                    <Input placeholder="Zeit" className="textInput" id="amountOfTime" />
                    <PrimaryButton name="Lobby Erstellen" onClick={() => handleCreateLobby()} />
                </section>
            )}

            {page === "createName" && (
                <section className="bottomContainer">
                    <Input placeholder="Spielername" className="textInput" id="username" />
                    <PrimaryButton name="Bestätigen" onClick={() => handleSetUserName()} />
                </section>
            )}

            {page === "players" && (
                <div>
                    <section className="teamsView">
                        {lobbyData.teams && lobbyData.teams.map((team, i) => (
                            <div key={i} className="mainContainer">
                                <h2>{team.team_name}</h2>
                                {team.members && team.members.map((member, a) => (
                                    <div key={a} className="row">
                                        <p key={a}>{member}</p>
                                        {lobbyData.isHost && (
                                            <DeleteButton name="Kicken" onClick={() => removeUser(member)} />
                                        )}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </section>
                    <section className="bottomContainer">
                        <Input placeholder="Teamname" className="textInput" id="teamName" />
                        {lobbyData.isHost ? (
                            <>
                                <PrimaryButton name="Team benennen" onClick={() => handleSetTeamName()} />
                                <SecondaryButton name="Weiter" onClick={() => startWordRound()} />
                            </>
                        ) : (
                            <PrimaryButton name="Team benennen" onClick={() => handleSetTeamName()} />
                        )}
                    </section>
                </div>
            )}

            {page === "words" && (
                <div>
                    <h2>Deine Wörter</h2>
                    <div className="mainContainer" id="wordsContainer">
                        {lobbyData.words && lobbyData.words.map((word, i) => (
                            <p key={i}>{word}</p>
                        ))}
                    </div>
                    <section className="bottomContainer">
                        <Input placeholder="Neues Wort" className="textInput" id="wordInput" />
                        {lobbyData.isHost ? (
                            <>
                                <PrimaryButton name="Wort hinzufügen" onClick={() => addWord()} />
                                <SecondaryButton name="Weiter" onClick={() => startGame()} />
                            </>
                        ) : (
                            <SecondaryButton name="Wort hinzufügen" onClick={() => addWord()} />
                        )}
                    </section>
                </div>
            )}

            {page === "game" && (
                <div>
                    {!gameData.isOwnTurn ? (
                        <div className="topContainer">
                            <Timer timeLeft={countdown.timeLeft} />
                        </div>
                    ) : (
                        <div className="topContainer" />
                    )}
                    <PlayerCircle currentTurnUser={gameData.currentTurnUser} isOwnTurn={gameData.isOwnTurn} />
                    <h2>Teammitglieder</h2>
                    <div className="mainContainer" id="teamMembers">
                        {lobbyData.teams && lobbyData.teams.map((team, i) => (
                            team.team_name === gameData.currentTurnTeam && team.members.map((member, j) => (
                                member !== gameData.currentTurnUser && <p key={j}>{member}</p>
                            ))
                        ))}
                    </div>
                    {gameData.isOwnTurn && (
                        <section className="bottomContainer">
                            <PrimaryButton name="Bereit" onClick={() => startRound()} />
                        </section>
                    )}
                </div>
            )}

            {page === "ownRound" && (
                <div>
                    <div className="topContainer">
                        <Timer timeLeft={countdown.timeLeft} />
                    </div>
                    <h2 className="wordHeader">Dein Wort</h2>
                    <div className="mainContainer" id="wordContainer">
                        <h1>{gameData.currentWord}</h1>
                    </div>
                    <h2>Teammitglieder</h2>
                    <div className="mainContainer" id="teamMembers">
                        {lobbyData.teams && lobbyData.teams.map((team, i) => (
                            team.team_name === gameData.currentTurnTeam && team.members.map((member, j) => (
                                member !== gameData.currentTurnUser && <p key={j}>{member}</p>
                            ))
                        ))}
                    </div>
                    {!gameData.isLastWord ? (
                        countdown.timeLeft > 0 ? (
                            <section className="bottomContainer">
                                <PrimaryButton name="Wort richtig" onClick={() => guessedWordCorrect()} />
                            </section>
                        ) : (
                            <section className="bottomContainer">
                                <SecondaryButton name="Nächster Spieler" onClick={() => nextPlayer()} />
                            </section>
                        )
                    ) : (
                        <section className="bottomContainer">
                            <SecondaryButton name="Runde Beenden" onClick={() => endRound()} />
                        </section>
                    )}
                </div>
            )}

            {page === "roundScore" && (
                <div>
                    <h2 className="wordHeader">Punktestand</h2>
                    {gameData.teamsScore && gameData.teamsScore.map((team, i) => (
                        <div key={i} className="mainContainer" id="scoreContainer">
                            <h2>{team.team_name} Punkte: {team.score}</h2>
                            {team.members && team.members.map((member, j) => (
                                <p key={j}>{member}</p>
                            ))}
                        </div>
                    ))}
                    {lobbyData.isHost && (
                        <section className="bottomContainer">
                            <PrimaryButton name="Nächste Runde starten" onClick={() => nextRound()} />
                        </section>
                    )}
                </div>
            )}

            {page === "endData" && (
                <div>
                    <h2 className="wordHeader">Spiel Vorbei</h2>
                    {gameData.teamsScore && gameData.teamsScore.map((team, i) => (
                        <div key={i} className="mainContainer" id="scoreContainer">
                            <h2>{team.team_name}</h2>
                            <p>Punkte: {team.score}</p>
                        </div>
                    ))}
                    <section className="bottomContainer">
                        <PrimaryButton name="Zurück zum Start" onClick={() => backToStart()} />
                    </section>
                </div>
            )}
        </>
    );
};

const root = createRoot(document.getElementById('root'));
root.render(<App />);
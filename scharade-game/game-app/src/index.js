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
    startTimer,
    clearTimer,
    handleRemovedUser,
    evalateResponse,
} from './socketHandlers';

const App = () => {
    const [page, setPage] = useState("start");
    const [title, setTitle] = useState("Scharade");
    const [gameData, setGameData] = useState({
        currentturnuser: "",
        isownturn: false,
        currentturnteam: "",
        timeleft: 0,
        currentword: "",
        teamsscore: [],
        round: 0,
    });
    const [lobbyData, setLobbyData] = useState({
        teams: [],
        words: [],
    });
    const [countdown, setCountdown] = useState({
        timeleft: 0,
        timeatstart: 0,
        startdate: 0
    });
    const [teamScore, setTeamScore] = useState([]);

    const timerRef = useRef(null);
    const [windowMessages, setWindowMessages] = useState([]);

    useEffect(() => {
        const hostCode = localStorage.getItem('hostCode');
        const playerSid = localStorage.getItem('playerSid');

        if (hostCode) {
            handleHostContinuation(hostCode, setLobbyData, setGameData, setTitle, setPage, setCountdown, timerRef);
        } else if (playerSid && !hostCode) {
            handlePlayerContinuation(playerSid, setLobbyData, setGameData, setTitle, setPage, setCountdown, timerRef);
        }
    }, []);

    const handleJoinLobby = () => {
        const pin = parseInt(document.querySelector('input').value, 10);
        joinLobby(pin, setLobbyData, setPage, setTitle, setWindowMessages);
    };

    const handleCreateLobby = () => {
        const config_data = createLobbyData();
        createLobby(config_data, setLobbyData, setPage, setTitle, setWindowMessages);
        console.log("game data:", lobbyData);
    };

    const handleSetUserName = () => {
        const username = document.querySelector('#username').value;
        setUserName(username, setPage, setWindowMessages);
        console.log(lobbyData);
    };

    const handleSetTeamName = () => {
        const teamName = document.querySelector('#teamName').value;
        if (teamName.trim() !== "") {
            setTeamName(teamName, setWindowMessages);
            document.querySelector('#teamName').value = '';
        }
    };

    const createLobbyData = () => {
        return {
            numberofrounds: parseInt(document.querySelector('#numberOfRounds').value, 10),
            numberofteams: parseInt(document.querySelector('#numberOfTeams').value, 10),
            roundtime: parseInt(document.querySelector('#amountOfTime').value, 10),
            lobbyname: document.querySelector('#lobbyName').value
        };
    };

    const startWordRound = () => {
        socket.emit('start_word_round');
    };

    const addWord = () => {
        const word = document.querySelector('#wordInput').value;
        document.querySelector('#wordInput').value = '';
        socket.emit('add_word', { word: word }, (res) => {
            if (evalateResponse(res, setWindowMessages)) return;
            setLobbyData(prevlobbyData => ({
                ...prevlobbyData,
                words: [...prevlobbyData.words, word]
            }));
        });
    };

    const startGame = () => {
        socket.emit('start_game');
    };

    const startRound = () => {
        socket.emit('start_round');
    };

    const guessedWordCorrect = () => {
        setGameData(prevGameData => {
            if (prevGameData.isownturn) {
                socket.emit('guessed_word_correct', { word: prevGameData.currentword }, (data) => {
                    console.log("data:", data);
                    setGameData({ ...prevGameData, currentword: data.word, isLastWord: data.is_last_word });
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
        socket.emit('end_round', { word: gameData.currentword });
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


    // adjust the middleContainer to avoid the body to be scrollable
    const adjustMiddleContainerHeight = () => {
        const middleContainer = document.querySelector('.middleContainer');
        let bottomHeight = 0;

        // set every height manually for every page
        if (page === "start" || page === "gamePin" || page === "createName" || page === "words" || page === "players") {
            bottomHeight = 156;
        } else if (page === "createLobby") {
            bottomHeight = 384;
        } else if (page === "game" && gameData.isownturn) {
            bottomHeight = 80;
        } else if (page === "ownRound") {
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

        // set the calculated height if element is available
        if (middleContainer) {
            const availableHeight = window.innerHeight - 70 - bottomHeight - 40;
            middleContainer.style.height = `${availableHeight}px`;
        }
    };

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
            setGameData(data.gamedata);
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
            setGameData(data.gamedata);
            clearTimer(timerRef);
            setPage("roundScore");
        });
    }, []);

    useEffect(() => {
        socket.on('start_game', (data) => {
            console.log("game data:", data);
            setGameData(data.gamedata);
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
                    return {
                        ...prevGameData,
                        currentword: data.word,
                        amountOfTime: data.amountoftime
                    };
                });

                setCountdown({
                    timeleft: data.timeatstart,
                    timeatstart: data.timeatstart,
                    startdate: new Date(data.startdate).getTime()
                });
                setPage("ownRound");
                clearTimer(timerRef);

                // use data values because the countdown isnt stored yet
                startTimer({
                    timeleft: data.timeatstart,
                    timeatstart: data.timeatstart,
                    startdate: new Date(data.startdate).getTime()
                }, setCountdown, timerRef);
            }
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

    useEffect(() => {

        adjustMiddleContainerHeight(); // Initial setzen
        window.addEventListener('resize', adjustMiddleContainerHeight); // Bei Resize anpassen

        return () => {
            window.removeEventListener('resize', adjustMiddleContainerHeight); // Cleanup
        };
    }, []);

    return (
        <>
            {windowMessages.map((message, index) => (
                message !== "" && (
                    <div key={index} className="windowMessage">
                        <img src="/windowMessage.svg" />
                        <p>{message}</p>
                    </div>
                )
            ))}

            <div className='topContainer'>
                <Header title={title} />
            </div>
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

            <div className='middleContainer'>
                {page === "players" && (
                    <section className="teamsView">
                        {lobbyData.teams && lobbyData.teams.map((team, i) => (
                            <div key={i} className="mainContainer">
                                <h2>{team.team_name}</h2>
                                {team.members && team.members.map((member, a) => (
                                    <div key={a} className="row">
                                        <p key={a}>{member}</p>
                                        {lobbyData.ishost && (
                                            <DeleteButton name="Kicken" onClick={() => removeUser(member)} />
                                        )}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </section>
                )}
                {page === "words" && (
                    <>
                        <h2>Deine Wörter</h2>
                        <div className="mainContainer" id="wordsContainer">
                            {lobbyData.words && lobbyData.words.map((word, i) => (
                                <p key={i}>{word}</p>
                            ))}
                        </div>
                    </>
                )}
                {page === "game" && (
                    <div>
                        {!gameData.isownturn ? (
                            <div className="topContainer">
                                <Timer timeLeft={countdown.timeleft} />
                            </div>
                        ) : (
                            <div className="topContainer" />
                        )}
                        <PlayerCircle currentTurnUser={gameData.currentturnuser} isOwnTurn={gameData.isownturn} />
                        <h2>Teammitglieder</h2>
                        <div className="mainContainer" id="teamMembers">
                            {lobbyData.teams && lobbyData.teams.map((team, i) => (
                                team.team_name === gameData.currentturnteam && team.members.map((member, j) => (
                                    member !== gameData.currentturnuser && <p key={j}>{member}</p>
                                ))
                            ))}
                        </div>
                    </div>
                )}
                {page === "ownRound" && (
                    <div>
                        <div className="topContainer">
                            <Timer timeLeft={countdown.timeleft} />
                        </div>
                        <h2 className="wordHeader">Dein Wort</h2>
                        <div className="mainContainer" id="wordContainer">
                            <h1>{gameData.currentword}</h1>
                        </div>
                        <h2>Teammitglieder</h2>
                        <div className="mainContainer" id="teamMembers">
                            {lobbyData.teams && lobbyData.teams.map((team, i) => (
                                team.team_name === gameData.currentturnteam && team.members.map((member, j) => (
                                    member !== gameData.currentturnuser && <p key={j}>{member}</p>
                                ))
                            ))}
                        </div>

                    </div>
                )}

                {page === "roundScore" && (
                    <div>
                        <h2 className="wordHeader">Punktestand</h2>
                        {gameData.teamsscore && gameData.teamsscore.map((team, i) => (
                            <div key={i} className="mainContainer" id="scoreContainer">
                                <h2>{team.team_name} Punkte: {team.score}</h2>
                                {team.members && team.members.map((member, j) => (
                                    <p key={j}>{member}</p>
                                ))}
                            </div>
                        ))}
                    </div>
                )}

                {page === "endData" && (
                    <div>
                        <h2 className="wordHeader">Spiel Vorbei</h2>
                        {gameData.teamsscore && gameData.teamsscore.map((team, i) => (
                            <div key={i} className="mainContainer" id="scoreContainer">
                                <h2>{team.team_name}</h2>
                                <p>Punkte: {team.score}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>


            {/* Bottom */}
            <section className="bottomContainer">
                {page === "start" && (
                    <>
                        <SecondaryButton name="Lobby Erstellen" onClick={() => setPage("createLobby")} />
                        <PrimaryButton name="Lobby Beitreten" onClick={() => setPage("gamePin")} />
                    </>
                )}
                {page === "gamePin" && (
                    <>
                        <Input placeholder="Spiel Pin" className="numberInput" id="gamePin" />
                        <PrimaryButton name="Spiel Starten" onClick={() => handleJoinLobby()} />
                    </>
                )}
                {page === "createLobby" && (
                    <>
                        <Input placeholder="Lobbyname" className="textInput" id="lobbyName" />
                        <Input placeholder="Runden" className="textInput" id="numberOfRounds" />
                        <Input placeholder="Teams" className="textInput" id="numberOfTeams" />
                        <Input placeholder="Zeit" className="textInput" id="amountOfTime" />
                        <PrimaryButton name="Lobby Erstellen" onClick={() => handleCreateLobby()} />
                    </>
                )}
                {page === "createName" && (
                    <>
                        <Input placeholder="Spielername" className="textInput" id="username" />
                        <PrimaryButton name="Bestätigen" onClick={() => handleSetUserName()} />
                    </>
                )}
                {page === "players" && (
                    <>
                        <Input placeholder="Teamname" className="textInput" id="teamName" />
                        {lobbyData.ishost ? (
                            <>
                                <PrimaryButton name="Team benennen" onClick={() => handleSetTeamName()} />
                                <SecondaryButton name="Weiter" onClick={() => startWordRound()} />
                            </>
                        ) : (
                            <PrimaryButton name="Team benennen" onClick={() => handleSetTeamName()} />
                        )}
                    </>
                )}
                {page === "words" && (
                    <>
                        <Input placeholder="Neues Wort" className="textInput" id="wordInput" />
                        {lobbyData.ishost ? (
                            <>
                                <PrimaryButton name="Wort hinzufügen" onClick={() => addWord()} />
                                <SecondaryButton name="Weiter" onClick={() => startGame()} />
                            </>
                        ) : (
                            <SecondaryButton name="Wort hinzufügen" onClick={() => addWord()} />
                        )}
                    </>
                )}
                {page === "ownRound" && (
                    !gameData.isLastWord ? (
                        countdown.timeleft > 0 ? (
                            <PrimaryButton name="Wort richtig" onClick={() => guessedWordCorrect()} />
                        ) : (
                            <SecondaryButton name="Nächster Spieler" onClick={() => nextPlayer()} />
                        )
                    ) : (
                        <SecondaryButton name="Runde Beenden" onClick={() => endRound()} />
                    )
                )}
                {page === "game" && gameData.isownturn && (
                    <PrimaryButton name="Bereit" onClick={() => startRound()} />
                )}
                {page === "roundScore" && lobbyData.ishost && (
                    <PrimaryButton name="Nächste Runde starten" onClick={() => nextRound()} />
                )}
                {page === "endData" && (
                    <PrimaryButton name="Zurück zum Start" onClick={() => backToStart()} />
                )}
            </section>


            {adjustMiddleContainerHeight()}
        </>
    );
};

const root = createRoot(document.getElementById('root'));
root.render(<App />);
import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import Header from './components/header';
import PrimaryButton from './components/primaryButton';
import DeleteButton from './components/deleteButton';
import SecondaryButton from './components/secondaryButton';
import Timer from './components/timer';
import PlayerCircle from './components/playerCirle';
import Input from './components/input';
import '../src/design.css';
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
    clearTimer,
    handleRemovedUser,
    evalateResponse,
    calcBottomHeight,
    setCountdownData,
    startTimerWithData,
    updateGameDataNextWord
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

        // if data from last lobby is stored
        // ask user to continue in that lobby
        if (hostCode) {
            handleHostContinuation(hostCode, setLobbyData, setGameData, setTitle, setPage, setCountdown, timerRef);
        } else if (playerSid) {
            handlePlayerContinuation(playerSid, setLobbyData, setGameData, setTitle, setPage, setCountdown, timerRef);
        }
    }, []);


    const handleJoinLobby = () => {
        // triggert with button
        const pin = parseInt(document.querySelector('input').value, 10);
        joinLobby(pin, setLobbyData, setPage, setTitle, setWindowMessages);
    };


    const handleCreateLobby = () => {
        // triggert with button
        const configData = createLobbyData();
        createLobby(configData, setLobbyData, setPage, setTitle, setWindowMessages);
        console.log("game data:", lobbyData);
    };


    const handleSetUserName = () => {
        // triggert with button
        const username = document.querySelector('#username').value;
        setUserName(username, setPage, setWindowMessages);
        console.log(lobbyData);
    };


    const handleSetTeamName = () => {
        // triggert with button
        const teamName = document.querySelector('#teamName').value;
        setTeamName(teamName, setWindowMessages);
        document.querySelector('#teamName').value = '';
    };


    const createLobbyData = () => {
        // select all data from the inputs
        // put them in a json and return
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

        // emit the new word
        socket.emit('add_word', { word: word }, (res) => {
            // check errors
            if (evalateResponse(res, setWindowMessages)) return;

            // add new word to list
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
            // check if user is allowed to mark as correct
            if (prevGameData.isownturn) {
                // emit the guessed word
                socket.emit('guessed_word_correct', { word: prevGameData.currentword }, (data) => {
                    // update the word to the next word
                    console.log("guesseed word correct data:", data);
                    setGameData({ ...prevGameData, currentword: data.word, isLastWord: data.islastword });
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
        // triggert with button when word was last word
        socket.emit('end_round', { word: gameData.currentword });
        clearTimer(timerRef);
    };


    const backToStart = () => {
        // if game is endet
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
        const bottomHeight = calcBottomHeight(page, lobbyData, gameData);

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
        socket.on('new_user_joined', (data) => {
            // does needet data exist
            if (data && data.username && data.teamname) {
                // add user to team
                // update lobbyData
                setLobbyData(prevLobbyData => {
                    const newLobbyData = { ...prevLobbyData };
                    addNewUserToTeam(newLobbyData, data);
                    return newLobbyData;
                });
            }
        });
    }, []);


    useEffect(() => {
        socket.on('new_team_name', (data) => {
            console.log(`new team name: ${data.teamname} old team name: ${data.oldteamname}`);
            setLobbyData(prevLobbyData => {
                const newLobbyData = { ...prevLobbyData };
                changeTeamName(newLobbyData, setLobbyData, data.teamname, data.oldteamname);
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
            console.log(data);
            setGameData(data.gamedata);
            clearTimer(timerRef);
            setPage("roundScore");
        });
    }, []);


    useEffect(() => {
        socket.on('start_game', (data) => {
            // update data
            setGameData(data.gamedata);

            // clear timer if exist
            clearTimer(timerRef);
            setPage("game");
        });
    }, []);


    useEffect(() => {
        socket.on('start_round', (data) => {
            if (!data) return;

            // update word to new word
            updateGameDataNextWord(data, setGameData);

            setPage("ownRound");
            setCountdownData(data, setCountdown);

            //clear old timer if exist
            clearTimer(timerRef);

            // start timer
            startTimerWithData(data, setCountdown, timerRef);
        });
    }, []);


    useEffect(() => {
        socket.on('removed_user', (data) => {
            if (!data) return;
            handleRemovedUser(data, setLobbyData, data.amiremoved);
        });
    }, []);


    useEffect(() => {
        // recalculate bottom with everytime window is resized
        adjustMiddleContainerHeight();
        window.addEventListener('resize', adjustMiddleContainerHeight); // adjust when resize

        return () => {
            window.removeEventListener('resize', adjustMiddleContainerHeight); // cleanum
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
                                <h2>{team.teamname}</h2>
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
                                team.teamname === gameData.currentturnteam && team.members.map((member, j) => (
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
                                team.teamname === gameData.currentturnteam && team.members.map((member, j) => (
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
                                <h2>{team.teamname} Punkte: {team.score}</h2>
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
                                <h2>{team.teamname}</h2>
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
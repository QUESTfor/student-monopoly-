// Real-time multiplayer game state
const multiplayerState = {
    gameId: null,
    playerId: null,
    isHost: false,
    database: null,
    listeners: []
};

// Game State
const gameState = {
    players: [],
    currentPlayerIndex: 0,
    currentRound: 1,
    turnCount: 0,
    startTime: null,
    maxRounds: 4,
    timerInterval: null,
    gameLog: [],
    skipNextTurn: {} // Track players who skip turns
};

// Player colors
const PLAYER_COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A'];

// Space type colors
const SPACE_COLORS = {
    'start': '#FFD700',
    'academic': '#4169E1',
    'life': '#32CD32',
    'financial': '#FFD700',
    'career': '#9370DB'
};

// Initialize game
function initGame() {
    multiplayerState.database = firebase.database();
    setupEventListeners();
    console.log('Game initialized!');
}

function setupEventListeners() {
    // Lobby buttons
    document.getElementById('createGameBtn').onclick = showCreateForm;
    document.getElementById('joinGameBtn').onclick = showJoinForm;
    document.getElementById('backFromCreate').onclick = showMainLobby;
    document.getElementById('backFromJoin').onclick = showMainLobby;
    document.getElementById('startCreateBtn').onclick = createGameRoom;
    document.getElementById('startJoinBtn').onclick = joinGameRoom;
    document.getElementById('startGameFromLobby').onclick = startMultiplayerGame;
    document.getElementById('leaveRoom').onclick = leaveRoom;
    
    // Game buttons
    document.getElementById('rollBtn').addEventListener('click', rollDice);
    document.getElementById('resultOkBtn').addEventListener('click', closeResultModal);
    document.getElementById('saveBtn').addEventListener('click', saveGame);
    document.getElementById('loadBtn').addEventListener('click', loadGame);
    document.getElementById('newGameBtn').addEventListener('click', resetGame);
}

function showMainLobby() {
    document.getElementById('createGameForm').classList.add('hidden');
    document.getElementById('joinGameForm').classList.add('hidden');
    document.getElementById('waitingRoom').classList.add('hidden');
}

function showCreateForm() {
    document.getElementById('createGameForm').classList.remove('hidden');
    document.getElementById('joinGameForm').classList.add('hidden');
    document.getElementById('waitingRoom').classList.add('hidden');
}

function showJoinForm() {
    document.getElementById('joinGameForm').classList.remove('hidden');
    document.getElementById('createGameForm').classList.add('hidden');
    document.getElementById('waitingRoom').classList.add('hidden');
}

function generateGameCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function generatePlayerId() {
    return 'player_' + Math.random().toString(36).substring(2, 15);
}

async function createGameRoom() {
    const hostName = document.getElementById('hostName').value.trim() || 'Host';
    const maxPlayers = parseInt(document.getElementById('maxPlayers').value) || 4;
    
    multiplayerState.gameId = generateGameCode();
    multiplayerState.playerId = generatePlayerId();
    multiplayerState.isHost = true;
    
    const gameRef = multiplayerState.database.ref(`games/${multiplayerState.gameId}`);
    
    try {
        await gameRef.set({
            hostId: multiplayerState.playerId,
            maxPlayers: maxPlayers,
            status: 'waiting',
            createdAt: Date.now(),
            players: {
                [multiplayerState.playerId]: {
                    name: hostName,
                    color: PLAYER_COLORS[0],
                    ready: true,
                    isHost: true,
                    joinedAt: Date.now()
                }
            },
            gameState: null
        });
        
        console.log('Game room created:', multiplayerState.gameId);
        showWaitingRoom();
        listenToGameUpdates();
    } catch (error) {
        console.error('Error creating game:', error);
        alert('Failed to create game room. Please try again.');
    }
}

async function joinGameRoom() {
    const playerName = document.getElementById('playerName').value.trim() || 'Player';
    const gameCode = document.getElementById('gameCode').value.toUpperCase().trim();
    
    if (!gameCode || gameCode.length !== 6) {
        alert('Please enter a valid 6-character game code');
        return;
    }
    
    const gameRef = multiplayerState.database.ref(`games/${gameCode}`);
    
    try {
        const snapshot = await gameRef.once('value');
        
        if (!snapshot.exists()) {
            alert('Game not found! Please check the code.');
            return;
        }
        
        const gameData = snapshot.val();
        
        if (gameData.status !== 'waiting') {
            alert('Game already started!');
            return;
        }
        
        const currentPlayers = Object.keys(gameData.players || {}).length;
        if (currentPlayers >= gameData.maxPlayers) {
            alert('Game is full!');
            return;
        }
        
        multiplayerState.gameId = gameCode;
        multiplayerState.playerId = generatePlayerId();
        multiplayerState.isHost = false;
        
        await gameRef.child(`players/${multiplayerState.playerId}`).set({
            name: playerName,
            color: PLAYER_COLORS[currentPlayers],
            ready: true,
            isHost: false,
            joinedAt: Date.now()
        });
        
        console.log('Joined game:', multiplayerState.gameId);
        showWaitingRoom();
        listenToGameUpdates();
    } catch (error) {
        console.error('Error joining game:', error);
        alert('Failed to join game. Please try again.');
    }
}

function showWaitingRoom() {
    document.getElementById('createGameForm').classList.add('hidden');
    document.getElementById('joinGameForm').classList.add('hidden');
    document.getElementById('waitingRoom').classList.remove('hidden');
    document.getElementById('roomCode').textContent = multiplayerState.gameId;
    
    if (multiplayerState.isHost) {
        document.getElementById('startGameFromLobby').classList.remove('hidden');
    }
}

function listenToGameUpdates() {
    const gameRef = multiplayerState.database.ref(`games/${multiplayerState.gameId}`);
    
    const playersListener = gameRef.child('players').on('value', (snapshot) => {
        const players = snapshot.val() || {};
        updatePlayerList(players);
    });
    multiplayerState.listeners.push({ ref: gameRef.child('players'), type: 'value' });
    
    const gameStateListener = gameRef.child('gameState').on('value', (snapshot) => {
        if (snapshot.exists()) {
            const remoteGameState = snapshot.val();
            syncGameState(remoteGameState);
        }
    });
    multiplayerState.listeners.push({ ref: gameRef.child('gameState'), type: 'value' });
    
    const statusListener = gameRef.child('status').on('value', (snapshot) => {
        if (snapshot.val() === 'playing') {
            startGameFromLobby();
        }
    });
    multiplayerState.listeners.push({ ref: gameRef.child('status'), type: 'value' });
}

function updatePlayerList(players) {
    const playerList = document.getElementById('playerList');
    playerList.innerHTML = '<h4>Players in Room:</h4>';
    
    Object.entries(players).forEach(([id, player]) => {
        const playerDiv = document.createElement('div');
        playerDiv.className = 'player-item';
        playerDiv.style.cssText = `
            padding: 12px;
            margin: 8px 0;
            background: ${player.color};
            color: white;
            border-radius: 8px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-weight: 600;
        `;
        playerDiv.innerHTML = `
            <span>${player.name} ${player.isHost ? '👑' : ''}</span>
            <span>${player.ready ? '✅ Ready' : '⏳ Waiting'}</span>
        `;
        playerList.appendChild(playerDiv);
    });
}

async function startMultiplayerGame() {
    if (!multiplayerState.isHost) {
        alert('Only the host can start the game!');
        return;
    }
    
    const gameRef = multiplayerState.database.ref(`games/${multiplayerState.gameId}`);
    
    try {
        const snapshot = await gameRef.once('value');
        const gameData = snapshot.val();
        
        if (Object.keys(gameData.players).length < 2) {
            alert('Need at least 2 players to start!');
            return;
        }
        
        const players = Object.entries(gameData.players).map(([id, data], index) => ({
            id: id,
            name: data.name,
            position: 0,
            totalPoints: 0,
            color: data.color
        }));
        
        const initialGameState = {
            players: players,
            currentPlayerIndex: 0,
            currentRound: 1,
            turnCount: 0,
            startTime: Date.now(),
            skipNextTurn: {},
            gameLog: [{
                message: '🎮 Game Started! Good luck!',
                type: 'roll',
                time: Date.now()
            }]
        };
        
        await gameRef.update({
            status: 'playing',
            gameState: initialGameState
        });
        
        console.log('Game started!');
    } catch (error) {
        console.error('Error starting game:', error);
        alert('Failed to start game. Please try again.');
    }
}

function startGameFromLobby() {
    document.getElementById('setupScreen').classList.add('hidden');
    document.getElementById('gameScreen').classList.remove('hidden');
    startTimer();
}

async function leaveRoom() {
    if (!multiplayerState.gameId || !multiplayerState.playerId) return;
    
    const gameRef = multiplayerState.database.ref(`games/${multiplayerState.gameId}`);
    
    try {
        await gameRef.child(`players/${multiplayerState.playerId}`).remove();
        
        if (multiplayerState.isHost) {
            await gameRef.remove();
        }
        
        cleanupListeners();
        
        multiplayerState.gameId = null;
        multiplayerState.playerId = null;
        multiplayerState.isHost = false;
        
        showMainLobby();
    } catch (error) {
        console.error('Error leaving room:', error);
    }
}

function cleanupListeners() {
    multiplayerState.listeners.forEach(listener => {
        listener.ref.off(listener.type);
    });
    multiplayerState.listeners = [];
}

function syncGameState(remoteState) {
    if (!remoteState) return;
    
    gameState.players = remoteState.players || [];
    gameState.currentPlayerIndex = remoteState.currentPlayerIndex || 0;
    gameState.currentRound = remoteState.currentRound || 1;
    gameState.turnCount = remoteState.turnCount || 0;
    gameState.gameLog = remoteState.gameLog || [];
    gameState.skipNextTurn = remoteState.skipNextTurn || {};
    
    if (!gameState.startTime) {
        gameState.startTime = remoteState.startTime || Date.now();
    }
    
    updatePlayerCards();
    drawBoard();
    
    document.getElementById('yearDisplay').textContent = `Year: ${gameState.currentRound}/4`;
    document.getElementById('turnDisplay').textContent = `Turn: ${gameState.turnCount}`;
    
    const logContent = document.getElementById('logContent');
    logContent.innerHTML = gameState.gameLog.slice(0, 20).map(log => 
        `<div class="log-entry ${log.type}">${log.message}</div>`
    ).join('');
    
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    const isMyTurn = currentPlayer && currentPlayer.id === multiplayerState.playerId;
    const rollBtn = document.getElementById('rollBtn');
    rollBtn.disabled = !isMyTurn;
    
    if (isMyTurn) {
        rollBtn.textContent = '🎲 Roll Dice (Your Turn!)';
    } else {
        rollBtn.textContent = `⏳ Waiting for ${currentPlayer?.name}...`;
    }
}

function drawBoard() {
    const canvas = document.getElementById('boardCanvas');
    const ctx = canvas.getContext('2d');
    
    ctx.clearRect(0, 0, 700, 700);
    
    const boardSize = 600;
    const startX = 50;
    const startY = 50;
    const cornerSize = 80;
    const sideSpaceWidth = (boardSize - 2 * cornerSize) / 8;
    const sideSpaceHeight = 60;
    
    // Draw board background
    ctx.fillStyle = '#e8f4f8';
    ctx.fillRect(startX, startY, boardSize, boardSize);
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 3;
    ctx.strokeRect(startX, startY, boardSize, boardSize);
    
    // Draw center
    const centerX = startX + boardSize / 2;
    const centerY = startY + boardSize / 2;
    
    ctx.fillStyle = '#667eea';
    ctx.font = 'bold 28px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`Year ${gameState.currentRound}`, centerX, centerY - 15);
    
    ctx.font = '20px Arial';
    ctx.fillText('大學四年', centerX, centerY + 15);
    
    // Draw all 36 spaces
    GAME_DATA.spaces.forEach((space, index) => {
        let x, y, width, height;
        
        // Bottom row (spaces 0-9)
        if (index <= 9) {
            x = startX + (index * sideSpaceWidth);
            if (index === 0) { x = startX; width = cornerSize; } 
            else if (index === 9) { width = cornerSize; }
            else { width = sideSpaceWidth; }
            y = startY + boardSize - sideSpaceHeight;
            height = sideSpaceHeight;
        }
        // Right column (spaces 10-18)
        else if (index <= 18) {
            const offset = index - 10;
            x = startX + boardSize - cornerSize;
            y = startY + boardSize - sideSpaceHeight - ((offset + 1) * sideSpaceWidth);
            width = cornerSize;
            height = sideSpaceWidth;
        }
        // Top row (spaces 19-27)
        else if (index <= 27) {
            const offset = index - 19;
            x = startX + boardSize - cornerSize - ((offset + 1) * sideSpaceWidth);
            y = startY;
            width = sideSpaceWidth;
            height = sideSpaceHeight;
        }
        // Left column (spaces 28-35)
        else {
            const offset = index - 28;
            x = startX;
            y = startY + sideSpaceHeight + (offset * sideSpaceWidth);
            width = cornerSize;
            height = sideSpaceWidth;
        }
        
        // Draw space
        ctx.fillStyle = SPACE_COLORS[space.type] || '#CCC';
        ctx.fillRect(x, y, width, height);
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, width, height);
        
        // Draw number
        ctx.fillStyle = '#000';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(index, x + width / 2, y + 5);
        
        // Draw name
        ctx.font = '10px Arial';
        const words = space.name.split(' ');
        words.forEach((word, i) => {
            ctx.fillText(word, x + width / 2, y + 22 + (i * 11));
        });
    });
    
    // Draw players
    gameState.players.forEach((player, pIndex) => {
        drawPlayerToken(ctx, player, pIndex, startX, startY, boardSize, cornerSize, sideSpaceWidth, sideSpaceHeight);
    });
}

function drawPlayerToken(ctx, player, pIndex, startX, startY, boardSize, cornerSize, sideSpaceWidth, sideSpaceHeight) {
    const index = player.position;
    let spaceX, spaceY, spaceWidth, spaceHeight;
    
    if (index <= 9) {
        spaceX = startX + (index * sideSpaceWidth);
        if (index === 0) { spaceX = startX; spaceWidth = cornerSize; }
        else if (index === 9) { spaceWidth = cornerSize; }
        else { spaceWidth = sideSpaceWidth; }
        spaceY = startY + boardSize - sideSpaceHeight;
        spaceHeight = sideSpaceHeight;
    } else if (index <= 18) {
        const offset = index - 10;
        spaceX = startX + boardSize - cornerSize;
        spaceY = startY + boardSize - sideSpaceHeight - ((offset + 1) * sideSpaceWidth);
        spaceWidth = cornerSize;
        spaceHeight = sideSpaceWidth;
    } else if (index <= 27) {
        const offset = index - 19;
        spaceX = startX + boardSize - cornerSize - ((offset + 1) * sideSpaceWidth);
        spaceY = startY;
        spaceWidth = sideSpaceWidth;
        spaceHeight = sideSpaceHeight;
    } else {
        const offset = index - 28;
        spaceX = startX;
        spaceY = startY + sideSpaceHeight + (offset * sideSpaceWidth);
        spaceWidth = cornerSize;
        spaceHeight = sideSpaceWidth;
    }
    
    const playersOnSpace = gameState.players.filter(p => p.position === player.position);
    const indexOnSpace = playersOnSpace.indexOf(player);
    const offsetX = (indexOnSpace % 2) * 20 - 10;
    const offsetY = Math.floor(indexOnSpace / 2) * 20 - 10;
    
    const playerX = spaceX + spaceWidth / 2 + offsetX;
    const playerY = spaceY + spaceHeight / 2 + offsetY;
    
    ctx.beginPath();
    ctx.arc(playerX, playerY, 15, 0, 2 * Math.PI);
    ctx.fillStyle = player.color;
    ctx.fill();
    
    const isCurrent = pIndex === gameState.currentPlayerIndex;
    ctx.strokeStyle = isCurrent ? '#FFD700' : '#000';
    ctx.lineWidth = isCurrent ? 4 : 2;
    ctx.stroke();
    
    ctx.fillStyle = '#FFF';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(player.name.charAt(0), playerX, playerY);
}

function updatePlayerCards() {
    const container = document.getElementById('playerStats');
    container.innerHTML = '';
    
    gameState.players.forEach((player, index) => {
        const isActive = index === gameState.currentPlayerIndex;
        const card = document.createElement('div');
        card.className = 'player-card' + (isActive ? ' active' : '');
        
        card.innerHTML = `
            <h3>
                <span class="player-token" style="background: ${player.color}"></span>
                ${player.name}
            </h3>
            <div class="stat"><span>Points</span><span>${player.totalPoints || 0}</span></div>
        `;
        
        container.appendChild(card);
    });
    
    drawBoard();
}

async function rollDice() {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    
    if (currentPlayer.id !== multiplayerState.playerId) {
        alert("It's not your turn!");
        return;
    }
    
    // Check if player must skip turn
    if (gameState.skipNextTurn[currentPlayer.id]) {
        delete gameState.skipNextTurn[currentPlayer.id];
        addLogEntry(`${currentPlayer.name} skipped turn (caught by professor!)`, 'event');
        await updateGameStateInFirebase();
        nextTurn();
        return;
    }
    
    const rollBtn = document.getElementById('rollBtn');
    rollBtn.disabled = true;
    
    const diceRoll = Math.floor(Math.random() * 6) + 1;
    
    // Dice animation
    let frame = 0;
    const diceAnimation = setInterval(() => {
        rollBtn.textContent = `🎲 ${Math.floor(Math.random() * 6) + 1}`;
        frame++;
        if (frame > 10) {
            clearInterval(diceAnimation);
            rollBtn.textContent = `🎲 ${diceRoll}`;
            animatePlayerMovement(diceRoll);
        }
    }, 100);
}

async function animatePlayerMovement(spaces) {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    const startPos = currentPlayer.position;
    const endPos = (startPos + spaces) % GAME_DATA.spaces.length;
    
    for (let i = 1; i <= spaces; i++) {
        await new Promise(resolve => setTimeout(resolve, 300));
        currentPlayer.position = (startPos + i) % GAME_DATA.spaces.length;
        drawBoard();
    }
    
    const newSpace = GAME_DATA.spaces[currentPlayer.position];
    addLogEntry(`${currentPlayer.name} rolled ${spaces} → ${newSpace.name}`, 'roll');
    
    if (endPos < startPos) {
        currentPlayer.totalPoints += 100;
        addLogEntry(`${currentPlayer.name} passed Start! +100 points`, 'event');
    }
    
    await updateGameStateInFirebase();
    
    setTimeout(() => {
        checkForEvents(currentPlayer);
    }, 500);
}

function checkForEvents(player) {
    if (player.id !== multiplayerState.playerId) return;
    
    const randomEvent = GAME_DATA.randomEvents.find(event => 
        event.triggerSpaces.includes(player.position)
    );
    
    if (randomEvent && Math.random() < 0.6) {
        showEventModal(randomEvent, player);
        return;
    }
    
    if (Math.random() < 0.2) {
        const question = getRandomQuestion();
        showQuestionModal(question, player);
        return;
    }
    
    nextTurn();
}

function getRandomQuestion() {
    const randomIndex = Math.floor(Math.random() * GAME_DATA.questions.length);
    return GAME_DATA.questions[randomIndex];
}

function showEventModal(event, player) {
    document.getElementById('eventTitle').textContent = `⚡ ${event.name}`;
    document.getElementById('eventDescription').textContent = event.description;
    
    const optionsContainer = document.getElementById('eventOptions');
    optionsContainer.innerHTML = '';
    
    if (event.requiresHost) {
        // Host decision events
        if (multiplayerState.isHost) {
            optionsContainer.innerHTML = `
                <p style="margin: 15px 0; font-weight: bold;">Host: Did ${player.name} succeed?</p>
                <button class="btn-choice" onclick="handleHostDecision('${event.id}', true)">✅ Yes - Success!</button>
                <button class="btn-choice" onclick="handleHostDecision('${event.id}', false)">❌ No - Failed</button>
            `;
        } else {
            optionsContainer.innerHTML = `<p>Waiting for host decision...</p>`;
        }
    } else if (event.targetPlayer) {
        // Player selection events
        const otherPlayers = gameState.players.filter(p => p.id !== player.id);
        optionsContainer.innerHTML = '<p style="margin: 15px 0;">Choose a player:</p>';
        otherPlayers.forEach(p => {
            const btn = document.createElement('button');
            btn.className = 'btn-choice';
            btn.textContent = `${p.name}`;
            btn.onclick = () => handleTargetPlayerChoice(event, player, p);
            optionsContainer.appendChild(btn);
        });
    } else {
        // Regular choice events
        const optionA = document.createElement('button');
        optionA.className = 'btn-choice';
        optionA.textContent = `A) ${event.optionA.text} ${event.optionA.successRate ? `(${event.optionA.successRate}% success)` : ''}`;
        optionA.onclick = () => handleEventChoice(event, player, 'A');
        
        const optionB = document.createElement('button');
        optionB.className = 'btn-choice';
        optionB.textContent = `B) ${event.optionB.text}`;
        optionB.onclick = () => handleEventChoice(event, player, 'B');
        
        optionsContainer.appendChild(optionA);
        optionsContainer.appendChild(optionB);
    }
    
    document.getElementById('eventModal').classList.remove('hidden');
}

window.handleHostDecision = async function(eventId, success) {
    const event = GAME_DATA.randomEvents.find(e => e.id == eventId);
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    
    document.getElementById('eventModal').classList.add('hidden');
    
    let message, result;
    if (success) {
        result = event.optionA.successResult;
        message = `✅ ${result.message}`;
    } else {
        result = event.optionA.failResult || { message: 'Failed' };
        message = `❌ ${result.message}`;
    }
    
    applyEventResult(currentPlayer, result);
    addLogEntry(`${currentPlayer.name}: ${event.name} - ${message}`, 'event');
    await updateGameStateInFirebase();
    showResultModal('Challenge Result', message);
}

async function handleTargetPlayerChoice(event, currentPlayer, targetPlayer) {
    document.getElementById('eventModal').classList.add('hidden');
    
    const stealAmount = 200;
    currentPlayer.totalPoints += stealAmount;
    targetPlayer.totalPoints = Math.max(0, targetPlayer.totalPoints - stealAmount);
    
    const message = `${currentPlayer.name} stole ${stealAmount} points from ${targetPlayer.name}!`;
    addLogEntry(message, 'event');
    await updateGameStateInFirebase();
    showResultModal('Steal Success!', message);
}

async function handleEventChoice(event, player, choice) {
    document.getElementById('eventModal').classList.add('hidden');
    
    let result, message;
    
    if (choice === 'A') {
        const roll = Math.random() * 100;
        const success = roll < (event.optionA.successRate || 100);
        
        if (success) {
            result = event.optionA.successResult;
            message = `✅ ${result.message}`;
        } else {
            result = event.optionA.failResult;
            message = `❌ ${result.message}`;
        }
    } else {
        result = event.optionB.result;
        message = `✅ ${result.message}`;
    }
    
    applyEventResult(player, result);
    addLogEntry(`${player.name}: ${event.name} - ${message}`, 'event');
    await updateGameStateInFirebase();
    showResultModal('Event Result', message);
}

function applyEventResult(player, result) {
    if (result.points !== undefined) {
        player.totalPoints += result.points;
        player.totalPoints = Math.max(0, player.totalPoints);
    }
    if (result.skipTurn) {
        gameState.skipNextTurn[player.id] = true;
    }
}

function showQuestionModal(question, player) {
    document.getElementById('questionText').textContent = question.text;
    
    const options = document.querySelectorAll('.btn-option');
    question.options.forEach((option, index) => {
        options[index].textContent = `${option.label}) ${option.text}`;
        options[index].onclick = () => handleAnswer(question, player, option.label);
    });
    
    document.getElementById('questionModal').classList.remove('hidden');
}

async function handleAnswer(question, player, answer) {
    document.getElementById('questionModal').classList.add('hidden');
    
    const correct = answer === question.correctAnswer;
    let message = question.explanation;
    
    if (correct) {
        player.totalPoints += question.points;
        message = `✅ Correct! +${question.points} points\n${question.explanation}`;
        addLogEntry(`${player.name} answered correctly! +${question.points}`, 'question');
    } else {
        message = `❌ Incorrect. ${question.explanation}`;
        addLogEntry(`${player.name} answered incorrectly`, 'question');
    }
    
    await updateGameStateInFirebase();
    showResultModal(correct ? 'Correct!' : 'Incorrect', message);
}

function showResultModal(title, message) {
    document.getElementById('resultTitle').textContent = title;
    document.getElementById('resultMessage').textContent = message;
    document.getElementById('resultModal').classList.remove('hidden');
}

function closeResultModal() {
    document.getElementById('resultModal').classList.add('hidden');
    nextTurn();
}

async function nextTurn() {
    gameState.turnCount++;
    gameState.currentPlayerIndex = (gameState.currentPlayerIndex + 1) % gameState.players.length;
    
    if (gameState.turnCount > 0 && gameState.turnCount % (gameState.players.length * 9) === 0) {
        if (gameState.currentRound < gameState.maxRounds) {
            gameState.currentRound++;
            addLogEntry(`🎓 Advancing to Year ${gameState.currentRound}!`, 'roll');
        } else {
            await endGame();
            return;
        }
    }
    
    await updateGameStateInFirebase();
}

function addLogEntry(message, type = 'info') {
    gameState.gameLog.unshift({
        message: message,
        type: type,
        time: Date.now()
    });
    
    if (gameState.gameLog.length > 20) {
        gameState.gameLog = gameState.gameLog.slice(0, 20);
    }
}

async function updateGameStateInFirebase() {
    if (!multiplayerState.gameId) return;
    
    try {
        const gameRef = multiplayerState.database.ref(`games/${multiplayerState.gameId}/gameState`);
        await gameRef.set({
            players: gameState.players,
            currentPlayerIndex: gameState.currentPlayerIndex,
            currentRound: gameState.currentRound,
            turnCount: gameState.turnCount,
            startTime: gameState.startTime,
            skipNextTurn: gameState.skipNextTurn,
            gameLog: gameState.gameLog
        });
    } catch (error) {
        console.error('Error updating game state:', error);
    }
}

function startTimer() {
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
    }
    
    gameState.timerInterval = setInterval(() => {
        const elapsed = Date.now() - gameState.startTime;
        const minutes = Math.floor(elapsed / 60000);
        const seconds = Math.floor((elapsed % 60000) / 1000);
        document.getElementById('timerDisplay').textContent = 
            `Time: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // No auto-end - just counting
    }, 1000);
}

async function endGame() {
    clearInterval(gameState.timerInterval);
    
    const finalScores = gameState.players.map(player => ({
        name: player.name,
        total: player.totalPoints || 0
    })).sort((a, b) => b.total - a.total);
    
    const scoresContainer = document.getElementById('finalScores');
    scoresContainer.innerHTML = finalScores.map((score, index) => `
        <div class="score-item ${index === 0 ? 'winner' : ''}">
            <span>${index === 0 ? '🏆 ' : ''}${score.name}</span>
            <span><strong>${score.total} points</strong></span>
        </div>
    `).join('');
    
    document.getElementById('gameOverModal').classList.remove('hidden');
    
    if (multiplayerState.gameId) {
        await multiplayerState.database.ref(`games/${multiplayerState.gameId}`).update({
            status: 'finished'
        });
    }
}

function saveGame() {
    const saveData = {
        gameState: gameState,
        multiplayerState: {
            gameId: multiplayerState.gameId,
            playerId: multiplayerState.playerId,
            isHost: multiplayerState.isHost
        },
        timestamp: new Date().toISOString()
    };
    localStorage.setItem('collegeGameSave', JSON.stringify(saveData));
    alert('Game saved locally! 遊戲已儲存！');
}

function loadGame() {
    const saveData = localStorage.getItem('collegeGameSave');
    if (!saveData) {
        alert('No saved game found! 沒有儲存的遊戲！');
        return;
    }
    
    const data = JSON.parse(saveData);
    Object.assign(gameState, data.gameState);
    Object.assign(multiplayerState, data.multiplayerState);
    
    document.getElementById('setupScreen').classList.add('hidden');
    document.getElementById('gameScreen').classList.remove('hidden');
    
    updatePlayerCards();
    drawBoard();
    startTimer();
    
    if (multiplayerState.gameId) {
        listenToGameUpdates();
    }
    
    alert('Game loaded! 遊戲已載入！');
}

async function resetGame() {
    document.getElementById('gameOverModal').classList.add('hidden');
    document.getElementById('gameScreen').classList.add('hidden');
    document.getElementById('setupScreen').classList.remove('hidden');
    
    clearInterval(gameState.timerInterval);
    
    cleanupListeners();
    
    if (multiplayerState.gameId) {
        await leaveRoom();
    }
    
    gameState.players = [];
    gameState.currentPlayerIndex = 0;
    gameState.currentRound = 1;
    gameState.turnCount = 0;
    gameState.startTime = null;
    gameState.gameLog = [];
    gameState.skipNextTurn = {};
    
    showMainLobby();
}

window.onload = initGame;

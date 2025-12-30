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
    gameLog: []
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
    
    // Listen to player list updates
    const playersListener = gameRef.child('players').on('value', (snapshot) => {
        const players = snapshot.val() || {};
        updatePlayerList(players);
    });
    multiplayerState.listeners.push({ ref: gameRef.child('players'), type: 'value' });
    
    // Listen to game state updates
    const gameStateListener = gameRef.child('gameState').on('value', (snapshot) => {
        if (snapshot.exists()) {
            const remoteGameState = snapshot.val();
            syncGameState(remoteGameState);
        }
    });
    multiplayerState.listeners.push({ ref: gameRef.child('gameState'), type: 'value' });
    
    // Listen to game status
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
        
        // Initialize game state
        const players = Object.entries(gameData.players).map(([id, data], index) => ({
            id: id,
            name: data.name,
            position: 0,
            credits: 5000,
            energy: 3,
            academicPoints: 0,
            socialPoints: 0,
            careerPoints: 0,
            color: data.color
        }));
        
        const initialGameState = {
            players: players,
            currentPlayerIndex: 0,
            currentRound: 1,
            turnCount: 0,
            startTime: Date.now(),
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
        // Remove player from room
        await gameRef.child(`players/${multiplayerState.playerId}`).remove();
        
        // If host leaves, delete the room
        if (multiplayerState.isHost) {
            await gameRef.remove();
        }
        
        // Clean up listeners
        cleanupListeners();
        
        // Reset state
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
    
    // Update local game state
    gameState.players = remoteState.players || [];
    gameState.currentPlayerIndex = remoteState.currentPlayerIndex || 0;
    gameState.currentRound = remoteState.currentRound || 1;
    gameState.turnCount = remoteState.turnCount || 0;
    gameState.gameLog = remoteState.gameLog || [];
    
    if (!gameState.startTime) {
        gameState.startTime = remoteState.startTime || Date.now();
    }
    
    // Update UI
    updatePlayerCards();
    drawBoard();
    
    document.getElementById('yearDisplay').textContent = `Year: ${gameState.currentRound}/4`;
    document.getElementById('turnDisplay').textContent = `Turn: ${gameState.turnCount}`;
    
    // Update game log
    const logContent = document.getElementById('logContent');
    logContent.innerHTML = gameState.gameLog.slice(0, 20).map(log => 
        `<div class="log-entry ${log.type}">${log.message}</div>`
    ).join('');
    
    // Enable/disable roll button based on current player
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
    const centerX = 350;
    const centerY = 350;
    const radius = 280;
    
    ctx.clearRect(0, 0, 700, 700);
    
    // Draw center
    ctx.fillStyle = '#f0f0f0';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 100, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.fillStyle = '#667eea';
    ctx.font = 'bold 28px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`Year ${gameState.currentRound}`, centerX, centerY - 20);
    
    ctx.font = '20px Arial';
    ctx.fillText('大學四年', centerX, centerY + 15);
    
    // Draw spaces
    GAME_DATA.spaces.forEach((space, index) => {
        const angle = (index / GAME_DATA.spaces.length) * 2 * Math.PI - Math.PI / 2;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        
        // Draw space circle
        ctx.beginPath();
        ctx.arc(x, y, 22, 0, 2 * Math.PI);
        ctx.fillStyle = SPACE_COLORS[space.type] || '#CCC';
        ctx.fill();
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw space number
        ctx.fillStyle = '#FFF';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(index, x, y);
        
        // Draw space name (small)
        ctx.fillStyle = '#333';
        ctx.font = '9px Arial';
        const nameAngle = angle + Math.PI / 2;
        const textX = x + 30 * Math.cos(nameAngle);
        const textY = y + 30 * Math.sin(nameAngle);
        
        ctx.save();
        ctx.translate(textX, textY);
        ctx.rotate(angle + Math.PI / 2);
        ctx.fillText(space.name.substring(0, 4), 0, 0);
        ctx.restore();
    });
    
    // Draw players
    gameState.players.forEach((player, pIndex) => {
        const angle = (player.position / GAME_DATA.spaces.length) * 2 * Math.PI - Math.PI / 2;
        
        // Offset players if on same space
        const playersOnSpace = gameState.players.filter(p => p.position === player.position);
        const indexOnSpace = playersOnSpace.indexOf(player);
        const offsetAngle = (indexOnSpace - playersOnSpace.length / 2) * 0.3;
        
        const playerRadius = radius - 60;
        const x = centerX + playerRadius * Math.cos(angle + offsetAngle);
        const y = centerY + playerRadius * Math.sin(angle + offsetAngle);
        
        // Draw player token
        ctx.beginPath();
        ctx.arc(x, y, 16, 0, 2 * Math.PI);
        ctx.fillStyle = player.color;
        ctx.fill();
        
        // Highlight current player
        const isCurrent = pIndex === gameState.currentPlayerIndex;
        ctx.strokeStyle = isCurrent ? '#FFD700' : '#000';
        ctx.lineWidth = isCurrent ? 4 : 2;
        ctx.stroke();
        
        // Draw player initial
        ctx.fillStyle = '#FFF';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(player.name.charAt(0), x, y);
    });
}

function updatePlayerCards() {
    const container = document.getElementById('playerStats');
    container.innerHTML = '';
    
    gameState.players.forEach((player, index) => {
        const isActive = index === gameState.currentPlayerIndex;
        const card = document.createElement('div');
        card.className = 'player-card' + (isActive ? ' active' : '');
        
        const totalPoints = player.academicPoints + player.socialPoints + player.careerPoints;
        
        card.innerHTML = `
            <h3>
                <span class="player-token" style="background: ${player.color}"></span>
                ${player.name}
            </h3>
            <div class="stat"><span>💰 Credits</span><span>${player.credits}</span></div>
            <div class="stat"><span>⚡ Energy</span><span>${player.energy}/5</span></div>
            <div class="stat"><span>🎓 Academic</span><span>${player.academicPoints}</span></div>
            <div class="stat"><span>👥 Social</span><span>${player.socialPoints}</span></div>
            <div class="stat"><span>💼 Career</span><span>${player.careerPoints}</span></div>
            <div class="stat"><strong><span>Total Points</span><span>${totalPoints}</span></strong></div>
        `;
        
        container.appendChild(card);
    });
    
    drawBoard();
}

async function rollDice() {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    
    // Check if it's this player's turn
    if (currentPlayer.id !== multiplayerState.playerId) {
        alert("It's not your turn!");
        return;
    }
    
    const rollBtn = document.getElementById('rollBtn');
    rollBtn.disabled = true;
    
    const diceRoll = Math.floor(Math.random() * 6) + 1;
    
    // Animate dice
    rollBtn.classList.add('dice-animation');
    rollBtn.textContent = `🎲 ${diceRoll}`;
    
    setTimeout(async () => {
        rollBtn.classList.remove('dice-animation');
        
        // Move player
        const oldPosition = currentPlayer.position;
        currentPlayer.position = (currentPlayer.position + diceRoll) % GAME_DATA.spaces.length;
        
        const newSpace = GAME_DATA.spaces[currentPlayer.position];
        addLogEntry(`${currentPlayer.name} rolled ${diceRoll} and moved to ${newSpace.name}`, 'roll');
        
        // Check for passing start
        if (currentPlayer.position < oldPosition) {
            currentPlayer.credits += 1000;
            addLogEntry(`${currentPlayer.name} passed Start! +1000 credits`, 'event');
        }
        
        // Update Firebase
        await updateGameStateInFirebase();
        
        setTimeout(() => {
            checkForEvents(currentPlayer);
        }, 800);
    }, 500);
}

function checkForEvents(player) {
    // Only the current player processes events
    if (player.id !== multiplayerState.playerId) return;
    
    // Check for random events (based on position)
    const randomEvent = GAME_DATA.randomEvents.find(event => 
        event.triggerSpaces.includes(player.position)
    );
    
    if (randomEvent && Math.random() < 0.6) { // 60% chance to trigger
        showEventModal(randomEvent, player);
        return;
    }
    
    // Check for questions (20% chance)
    if (Math.random() < 0.2) {
        const question = getRandomQuestion();
        showQuestionModal(question, player);
        return;
    }
    
    // No event, end turn
    nextTurn();
}

function getRandomQuestion() {
    const randomIndex = Math.floor(Math.random() * GAME_DATA.questions.length);
    return GAME_DATA.questions[randomIndex];
}

function showEventModal(event, player) {
    document.getElementById('eventTitle').textContent = `⚡ ${event.name}`;
    document.getElementById('eventDescription').textContent = event.description;
    
    const optionA = document.getElementById('optionA');
    const optionB = document.getElementById('optionB');
    
    optionA.textContent = `A) ${event.optionA.text} (${event.optionA.successRate}% success)`;
    optionB.textContent = `B) ${event.optionB.text}`;
    
    optionA.onclick = () => handleEventChoice(event, player, 'A');
    optionB.onclick = () => handleEventChoice(event, player, 'B');
    
    document.getElementById('eventModal').classList.remove('hidden');
}

async function handleEventChoice(event, player, choice) {
    document.getElementById('eventModal').classList.add('hidden');
    
    let result;
    let message;
    
    if (choice === 'A') {
        const roll = Math.random() * 100;
        const success = roll < event.optionA.successRate;
        
        if (success) {
            result = event.optionA.successResult;
            message = `✅ ${result.message}`;
            applyEventResult(player, result);
        } else {
            result = event.optionA.failResult;
            message = `❌ ${result.message}`;
            applyEventResult(player, result);
        }
    } else {
        result = event.optionB.result;
        message = `✅ ${result.message}`;
        applyEventResult(player, result);
    }
    
    addLogEntry(`${player.name}: ${event.name} - ${message}`, 'event');
    await updateGameStateInFirebase();
    showResultModal('Event Result', message);
}

function applyEventResult(player, result) {
    if (result.credits !== undefined) {
        player.credits += result.credits;
        player.credits = Math.max(0, player.credits);
    }
    if (result.academicPoints !== undefined) {
        player.academicPoints += result.academicPoints;
        player.academicPoints = Math.max(0, player.academicPoints);
    }
    if (result.socialPoints !== undefined) {
        player.socialPoints += result.socialPoints;
        player.socialPoints = Math.max(0, player.socialPoints);
    }
    if (result.careerPoints !== undefined) {
        player.careerPoints += result.careerPoints;
        player.careerPoints = Math.max(0, player.careerPoints);
    }
    if (result.energy !== undefined) {
        player.energy += result.energy;
        player.energy = Math.max(0, Math.min(5, player.energy));
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
        player.academicPoints += question.points;
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
    
    // Check if round should advance (every 9 turns per player)
    if (gameState.turnCount > 0 && gameState.turnCount % (gameState.players.length * 9) === 0) {
        if (gameState.currentRound < gameState.maxRounds) {
            gameState.currentRound++;
            addLogEntry(`🎓 Advancing to Year ${gameState.currentRound}!`, 'roll');
            
            // Restore energy for all players
            gameState.players.forEach(p => p.energy = Math.min(5, p.energy + 1));
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
    
    // Keep only last 20 logs
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
        
        // Auto end game after 45 minutes
        if (minutes >= 45) {
            endGame();
        }
    }, 1000);
}

async function endGame() {
    clearInterval(gameState.timerInterval);
    
    const finalScores = gameState.players.map(player => ({
        name: player.name,
        total: player.academicPoints + player.socialPoints + player.careerPoints,
        details: {
            academic: player.academicPoints,
            social: player.socialPoints,
            career: player.careerPoints,
            credits: player.credits
        }
    })).sort((a, b) => b.total - a.total);
    
    const scoresContainer = document.getElementById('finalScores');
    scoresContainer.innerHTML = finalScores.map((score, index) => `
        <div class="score-item ${index === 0 ? 'winner' : ''}">
            <span>${index === 0 ? '🏆 ' : ''}${score.name}</span>
            <span><strong>${score.total} points</strong></span>
        </div>
        <div style="font-size: 0.9em; color: #666; padding-left: 20px; margin-bottom: 10px;">
            🎓 ${score.details.academic} | 👥 ${score.details.social} | 💼 ${score.details.career} | 💰 ${score.details.credits}
        </div>
    `).join('');
    
    document.getElementById('gameOverModal').classList.remove('hidden');
    
    // Update game status in Firebase
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
    
    // Clean up Firebase listeners
    cleanupListeners();
    
    // Leave current game room
    if (multiplayerState.gameId) {
        await leaveRoom();
    }
    
    // Reset state
    gameState.players = [];
    gameState.currentPlayerIndex = 0;
    gameState.currentRound = 1;
    gameState.turnCount = 0;
    gameState.startTime = null;
    gameState.gameLog = [];
    
    showMainLobby();
}

// Initialize on load
window.onload = initGame;
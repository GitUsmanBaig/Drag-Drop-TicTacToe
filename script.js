document.getElementById('start-button').addEventListener('click', function() {
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('game-container').style.display = 'block';
});


const cells = document.querySelectorAll('.cell');
let currentPlayer = 'x';
let moves = 0;

cells.forEach(cell => {
    cell.addEventListener('dragover', e => {
        e.preventDefault();
    });

    cell.addEventListener('dragstart', e => {
        if (cell.textContent !== currentPlayer) {
            e.preventDefault();
        } else {
            e.dataTransfer.setData('text/plain', cell.dataset.cellIndex);
        }
    });

    cell.addEventListener('drop', e => {
        const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
        const toIndex = parseInt(cell.dataset.cellIndex);

        if (cell.textContent === '' && isAdjacent(fromIndex, toIndex)) {
            cells[fromIndex].textContent = '';
            cell.textContent = currentPlayer;
            if (checkWinner(currentPlayer)) {
                showWinnerModal(currentPlayer);
                return;
            }
            
            switchPlayer();
        }
    });

    cell.addEventListener('click', () => {
        if (cell.textContent === '' && moves < 6) {
            cell.textContent = currentPlayer;
            cell.draggable = true;
            moves++;
            if (checkWinner(currentPlayer)) {
                showWinnerModal(currentPlayer);
                return;
            }
            
            switchPlayer();
        }
    });
});

const turnDisplay = document.getElementById('turn-display');

function updateTurnDisplay() {
    turnDisplay.textContent = `Current turn: ${currentPlayer}`;
}

function switchPlayer() {
    currentPlayer = currentPlayer === 'x' ? 'o' : 'x';
    updateTurnDisplay();
}

// Update the display when the script first runs
updateTurnDisplay();

function isAdjacent(fromIndex, toIndex) {
    const adjacentIndices = [
        [1, 3, 4],        
        [0, 2, 4],    
        [1,4, 5],       
        [0, 4, 6],    
        [1, 3, 5, 7, 0, 2, 6, 8],
        [2, 4, 8],
        [3, 4, 7],
        [4, 6, 8],
        [5, 7, 4]
    ];
    return adjacentIndices[fromIndex].includes(toIndex);
}

function checkWinner(player) {
    const winningCombinations = [
        // Rows
        [0, 1, 2], [3, 4, 5], [6, 7, 8], 
        // Columns
        [0, 3, 6], [1, 4, 7], [2, 5, 8], 
        // Diagonals
        [0, 4, 8], [2, 4, 6]  
    ];

    for (let combination of winningCombinations) {
        if (cells[combination[0]].textContent === player &&
            cells[combination[1]].textContent === player &&
            cells[combination[2]].textContent === player) {
            return true;
        }
    }
    for (let combination of winningCombinations) {
        if (cells[combination[0]].textContent === player &&
            cells[combination[1]].textContent === player &&
            cells[combination[2]].textContent === player) {
            
            // Call the showWinnerModal function instead of alert
            showWinnerModal(player);
            return true;
        }
    }
    return false;
}

// Function to show the winner modal
function showWinnerModal(winner) {
    const winnerModal = document.getElementById('winnerModal');
    const victoryMessage = document.getElementById('victoryMessage');

    victoryMessage.textContent = `Player '${winner}' wins!`;
    winnerModal.style.display = 'block';
}

//click event listener to the close button of the modal
document.getElementById('closeModal').addEventListener('click', function() {
    document.getElementById('winnerModal').style.display = 'none';
});

//click event listener to the restart button of the modal
document.getElementById('restartButton').addEventListener('click', function() {
    document.getElementById('winnerModal').style.display = 'none';
    restartGame();
});

// Function to restart the game
function restartGame() {
    cells.forEach(cell => {
        cell.textContent = '';
        cell.draggable = false;
    });
    currentPlayer = 'x';
    moves = 0;
    updateTurnDisplay();
}




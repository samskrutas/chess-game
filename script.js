const boardElement = document.getElementById("chess-board");
const statusElement = document.getElementById("status");

let turn = "white";
let selectedSquare = null;

// Standard initial board array map configuration
const initialBoard = [
    ["♜", "♞", "♝", "♛", "♚", "♝", "♞", "♜"],
    ["♟", "♟", "♟", "♟", "♟", "♟", "♟", "♟"],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["♙", "♙", "♙", "♙", "♙", "♙", "♙", "♙"],
    ["♖", "♘", "♗", "♕", "♔", "♗", "♘", "♖"]
];

let currentBoardState = [];

initGame();

function initGame() {
    // Clone starting map setup states into current active state arrays
    currentBoardState = JSON.parse(JSON.stringify(initialBoard));
    turn = "white";
    selectedSquare = null;
    statusElement.innerText = "White's Turn";
    renderBoard();
}

function renderBoard() {
    boardElement.innerHTML = ""; // Clear existing grid tiles
    
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const square = document.createElement("div");
            
            // Assign light or dark color patterns based on grid layout indices
            const isLight = (r + c) % 2 === 0;
            square.className = `square ${isLight ? "light" : "dark"}`;
            
            square.dataset.row = r;
            square.dataset.col = c;
            
            // Render piece icons inside element grids
            square.innerText = currentBoardState[r][c];
            
            // Track highlights on target selections
            if (selectedSquare && selectedSquare.row === r && selectedSquare.col === c) {
                square.classList.add("selected");
            }
            
            square.addEventListener("click", () => handleSquareClick(r, c));
            boardElement.appendChild(square);
        }
    }
}

function handleSquareClick(row, col) {
    const piece = currentBoardState[row][col];
    
    // Step 1: No piece is currently selected
    if (selectedSquare === null) {
        if (piece === "") return; // Clicked on an empty square
        
        // Ensure white can only select white pieces, and black can only select black pieces
        const isWhitePiece = "♙♖♘♗♕♔".includes(piece);
        if (turn === "white" && !isWhitePiece) return;
        if (turn === "black" && isWhitePiece) return;
        
        selectedSquare = { row, col };
        renderBoard();
    } 
    // Step 2: A piece is already selected, handling a move or reselection
    else {
        const fromRow = selectedSquare.row;
        const fromCol = selectedSquare.col;
        const targetPiece = currentBoardState[fromRow][fromCol];
        
        // If clicking a piece of the same color, switch selection to the new piece
        const isWhitePiece = "♙♖♘♗♕♔".includes(piece);
        if (piece !== "" && ((turn === "white" && isWhitePiece) || (turn === "black" && !isWhitePiece && piece !== ""))) {
            selectedSquare = { row, col };
            renderBoard();
            return;
        }

        // Execute piece position transfer
        currentBoardState[row][col] = targetPiece;
        currentBoardState[fromRow][fromCol] = "";
        
        // Switch turns
        turn = turn === "white" ? "black" : "white";
        statusElement.innerText = turn === "white" ? "White's Turn" : "Black's Turn";
        
        selectedSquare = null;
        renderBoard();
    }
}

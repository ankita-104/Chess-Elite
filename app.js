const gameBoard = document.querySelector('#gameboard');
const playerDisplay = document.querySelector('#player');
const infoDisplay = document.querySelector('#info-display');

const width = 8;
let playerGo = 'black'
playerDisplay.textContent = 'black';
const startPieces = [
    rook, knight, bishop, queen, king, bishop, knight, rook,
    pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn,
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn,
    rook, knight, bishop, queen, king, bishop, knight, rook
];
// console.log(startPieces);


function createBoard() {
    startPieces.forEach((startPiece, i) => {
        const square = document.createElement('div');
        square.classList.add('square');
        square.innerHTML = startPiece;

        //    draggable square
        square.firstChild?.setAttribute('draggable', true)



        //to set alternate colour of the board squares
        square.setAttribute('square-id', i);
        // square.classList.add('beige'); 
        const row = Math.floor((63 - i) / 8) + 1;
        if (row % 2 === 0) {
            square.classList.add(i % 2 === 0 ? "beige" : "brown");
        } else {
            square.classList.add(i % 2 === 0 ? "brown" : "beige");
        }


        // Add piece color based on position
        if (i <= 15) {
            if (square.firstChild) {
                square.firstChild.classList.add('black');
                // console.log( square.firstChild.classList, startPieces[i]);
            }
        }
        if (i >= 48) {
            if (square.firstChild) {
                square.firstChild.classList.add('white');
                // console.log( square.firstChild.classList, startPieces[i]);
            }
        }


        gameBoard.append(square);
    })
}

createBoard();

//Dragging of pieces--->
const allSquares = document.querySelectorAll(".square");

allSquares.forEach(square => {
    square.addEventListener('dragstart', dragStart)
    square.addEventListener('dragover', dragOver)
    square.addEventListener('drop', dragDrop)
})

let startPositionId;
let draggedElement;
function dragStart(e) {
    startPositionId = e.target.parentNode.getAttribute('square-id');
    draggedElement = e.target;
    console.log(startPositionId)
    console.log(draggedElement)
}

function dragOver(e) {
    e.preventDefault();
}
function dragDrop(e) {
    e.stopPropagation();
    // console.log('player go', playerGo);
    // console.log('e.target',e.target);
    const correctGo = draggedElement.firstChild.classList.contains(playerGo);
    const taken = e.target.classList.contains('piece');

    const valid = checkIfValid(e.target);

    const opponentGo = playerGo === 'white' ? 'black' : 'white';
    // console.log('opponent go',opponentGo);
    const takenByOpponent = e.target.firstChild?.classList.contains(opponentGo);
    if (correctGo) {
        // check this 1st 
        if (takenByOpponent && valid) {
            e.target.parentNode.append(draggedElement);
            e.target.remove();
            changePlayer();
            return;
        }

        // then check this 
        if (taken && !takenByOpponent) {
            infoDisplay.textContent = "You cannot move to this cell!";
            setTimeout(() => infoDisplay.textContent = "", 2000);
            return;
        }
        if (valid) {
            e.target.append(draggedElement);
            changePlayer();
            return;
        }
    }

    // changePlayer();
}


function checkIfValid(target){
    const targetId = Number(target.getAttribute('square-id'))|| Number(target.parentNode.getAttribute('square-id'));
    const startId = Number(startPositionId);
    const piece = draggedElement.id;
    console.log('targetId', targetId);
    console.log('startId', startId);
    console.log('piece', piece);

    switch(piece){
        case 'rook':
            return checkRook(targetId, startId);
        case 'knight':
            return checkKnight(targetId, startId);
        case 'bishop':
            return checkBishop(targetId, startId);
        case 'queen':
            return checkQueen(targetId, startId);
        case 'king':
            return checkKing(targetId, startId);
        case 'pawn':
            return checkPawn(targetId, startId);
        default:
            return false;
    }
}



function changePlayer() {
    if (playerGo === "black") {
        //reverse id when player goes to white
        reverseIds();
        playerGo = "white";
        playerDisplay.textContent = 'white';
    } else {
        //revert id when player goes to black
        revertIds();
        playerGo = "black";
        playerDisplay.textContent = 'black';
    }

}

function reverseIds() {
    const allSquares = document.querySelectorAll(".square");
    allSquares.forEach((square, i) => square.setAttribute('square-id', (width * width - 1) - i));
}

function revertIds() {
    const allSquares = document.querySelectorAll(".square");
    allSquares.forEach((square, i) => square.setAttribute('square-id', i));
}
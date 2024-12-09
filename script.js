const cells = document.querySelectorAll(".cell");
const piecesPlayer1 = document.querySelectorAll("#player-one-pieces .piece");
const piecesPlayer2 = document.querySelectorAll("#player-two-pieces .piece");
const resetButton = document.getElementById("reset");
const winnerMessage = document.getElementById("winner-message");
const turnIndicator = document.getElementById("turn-indicator");

let currentPlayer = Math.random() < 0.5 ? "player1" : "player2";
let moves = { player1: [], player2: [] };

// Combinaciones ganadoras
const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

// Actualiza el indicador de turno
function updateTurnIndicator() {
  turnIndicator.textContent = `Turno: ${
    currentPlayer === "player1" ? "Jugador 1" : "Jugador 2"
  }`;
}

// Detectar empate
function checkDraw() {
  const totalPiecesUsed =
    [...piecesPlayer1].filter((piece) => piece.style.visibility === "hidden")
      .length +
    [...piecesPlayer2].filter((piece) => piece.style.visibility === "hidden")
      .length;

  return totalPiecesUsed === 6; // Todas las piezas están usadas
}

// Mostrar ganador o empate
function showWinnerOrDraw(player) {
  if (player) {
    winnerMessage.textContent = `¡${
      player === "player1" ? "Jugador 1" : "Jugador 2"
    } gana!`;
  } else {
    winnerMessage.textContent = "¡Empate!";
  }
  winnerMessage.classList.remove("hidden");
  turnIndicator.classList.add("hidden");
}

// Arrastrar y soltar
piecesPlayer1.forEach((piece) => {
  piece.addEventListener("dragstart", (e) => {
    if (currentPlayer === "player1") {
      e.dataTransfer.setData("text", e.target.id);
    } else {
      e.preventDefault();
    }
  });
});

piecesPlayer2.forEach((piece) => {
  piece.addEventListener("dragstart", (e) => {
    if (currentPlayer === "player2") {
      e.dataTransfer.setData("text", e.target.id);
    } else {
      e.preventDefault();
    }
  });
});

cells.forEach((cell) => {
  cell.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  cell.addEventListener("drop", (e) => {
    e.preventDefault();

    const pieceId = e.dataTransfer.getData("text");
    const piece = document.getElementById(pieceId);

    if (!cell.classList.contains("occupied")) {
      const index = parseInt(cell.dataset.index);
      cell.classList.add("occupied");

      // Ajusta el ícono al tamaño del cuadrado
      const imgClone = document.createElement("img");
      imgClone.src = piece.src;
      cell.appendChild(imgClone);

      piece.style.visibility = "hidden";

      moves[currentPlayer].push(index);

      if (checkWinner(currentPlayer)) {
        showWinnerOrDraw(currentPlayer);
      } else if (checkDraw()) {
        showWinnerOrDraw(null); // Empate
      } else {
        currentPlayer = currentPlayer === "player1" ? "player2" : "player1";
        updateTurnIndicator();
      }
    }
  });
});

// Reiniciar el juego
resetButton.addEventListener("click", () => {
  cells.forEach((cell) => {
    cell.innerHTML = "";
    cell.classList.remove("occupied");
  });

  [...piecesPlayer1, ...piecesPlayer2].forEach((piece) => {
    piece.style.visibility = "visible";
  });

  moves = { player1: [], player2: [] };
  currentPlayer = Math.random() < 0.5 ? "player1" : "player2";
  winnerMessage.classList.add("hidden");
  turnIndicator.classList.remove("hidden");
  updateTurnIndicator();
});

// Verificar ganador
function checkWinner(player) {
  return winningCombinations.some((combination) =>
    combination.every((index) => moves[player].includes(index))
  );
}

// Inicializa el indicador de turno
updateTurnIndicator();

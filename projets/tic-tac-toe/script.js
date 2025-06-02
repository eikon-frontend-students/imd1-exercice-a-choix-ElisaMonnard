const board = document.getElementById("board");
const statusText = document.getElementById("status");
const resetBtn = document.getElementById("reset");

let currentPlayer = "X";
let grid = Array(9).fill(null);

const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8], // lignes
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8], // colonnes
  [0, 4, 8],
  [2, 4, 6], // diagonales
];

function checkWinner() {
  for (const combo of winningCombinations) {
    const [a, b, c] = combo;
    if (grid[a] && grid[a] === grid[b] && grid[a] === grid[c]) {
      return grid[a];
    }
  }
  if (!grid.includes(null)) return "Egalité";
  return null;
}

function handleClick(e) {
  const index = e.target.dataset.index;
  if (grid[index] || checkWinner()) return;

  grid[index] = currentPlayer;
  const img = document.createElement("img");
  img.src = currentPlayer === "X" ? "images/mouton.png" : "images/loup.jpg";
  img.alt = currentPlayer;
  img.className = "symbol";
  e.target.appendChild(img);
  e.target.classList.add("taken");

  const winner = checkWinner();
  if (!statusText) return;
  if (winner) {
    statusText.textContent =
      winner === "Egalité" ? "Match nul !" : `Joueur ${winner} a gagné !`;
  } else {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusText.textContent = `À ${currentPlayer} de jouer`;
    if (currentPlayer === "O") {
      setTimeout(iaPlay, 500); // l'IA joue après 0.5s
    }
  }
}

function resetGame() {
  grid = Array(9).fill(null);
  currentPlayer = "X";
  if (!statusText) return;
  statusText.textContent = "Joueur X commence";
  board.querySelectorAll(".cell").forEach((cell) => {
    cell.innerHTML = "";
    cell.classList.remove("taken");
  });
}

function createBoard() {
  board.innerHTML = "";
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.dataset.index = i;
    cell.addEventListener("click", handleClick);
    board.appendChild(cell);
  }
}

resetBtn.addEventListener("click", resetGame);

createBoard();

function iaPlay() {
  // Vérifie que le jeu n’est pas déjà fini
  if (checkWinner()) return;

  // Cherche une case vide au hasard
  const emptyIndices = grid
    .map((val, idx) => (val === null ? idx : null))
    .filter((val) => val !== null);

  if (emptyIndices.length === 0) return;

  const randomIndex =
    emptyIndices[Math.floor(Math.random() * emptyIndices.length)];

  // Simule un clic de l’IA sur la cellule
  const cell = board.querySelector(`.cell[data-index="${randomIndex}"]`);
  if (cell) {
    cell.click();
  }
}

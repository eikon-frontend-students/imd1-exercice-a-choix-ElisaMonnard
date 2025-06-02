const board = document.getElementById("board");
const statusText = document.getElementById("status");
const resetBtn = document.getElementById("reset");

// pumpkin shape from https://thenounproject.com/icon/pumpkin-5253388/
var pumpkin = confetti.shapeFromPath({
  path: "M449.4 142c-5 0-10 .3-15 1a183 183 0 0 0-66.9-19.1V87.5a17.5 17.5 0 1 0-35 0v36.4a183 183 0 0 0-67 19c-4.9-.6-9.9-1-14.8-1C170.3 142 105 219.6 105 315s65.3 173 145.7 173c5 0 10-.3 14.8-1a184.7 184.7 0 0 0 169 0c4.9.7 9.9 1 14.9 1 80.3 0 145.6-77.6 145.6-173s-65.3-173-145.7-173zm-220 138 27.4-40.4a11.6 11.6 0 0 1 16.4-2.7l54.7 40.3a11.3 11.3 0 0 1-7 20.3H239a11.3 11.3 0 0 1-9.6-17.5zM444 383.8l-43.7 17.5a17.7 17.7 0 0 1-13 0l-37.3-15-37.2 15a17.8 17.8 0 0 1-13 0L256 383.8a17.5 17.5 0 0 1 13-32.6l37.3 15 37.2-15c4.2-1.6 8.8-1.6 13 0l37.3 15 37.2-15a17.5 17.5 0 0 1 13 32.6zm17-86.3h-82a11.3 11.3 0 0 1-6.9-20.4l54.7-40.3a11.6 11.6 0 0 1 16.4 2.8l27.4 40.4a11.3 11.3 0 0 1-9.6 17.5z",
  matrix: [
    0.020491803278688523, 0, 0, 0.020491803278688523, -7.172131147540983,
    -5.9016393442622945,
  ],
});
// tree shape from https://thenounproject.com/icon/pine-tree-1471679/
var tree = confetti.shapeFromPath({
  path: "M120 240c-41,14 -91,18 -120,1 29,-10 57,-22 81,-40 -18,2 -37,3 -55,-3 25,-14 48,-30 66,-51 -11,5 -26,8 -45,7 20,-14 40,-30 57,-49 -13,1 -26,2 -38,-1 18,-11 35,-25 51,-43 -13,3 -24,5 -35,6 21,-19 40,-41 53,-67 14,26 32,48 54,67 -11,-1 -23,-3 -35,-6 15,18 32,32 51,43 -13,3 -26,2 -38,1 17,19 36,35 56,49 -19,1 -33,-2 -45,-7 19,21 42,37 67,51 -19,6 -37,5 -56,3 25,18 53,30 82,40 -30,17 -79,13 -120,-1l0 41 -31 0 0 -41z",
  matrix: [
    0.03597122302158273, 0, 0, 0.03597122302158273, -4.856115107913669,
    -5.071942446043165,
  ],
});
// heart shape from https://thenounproject.com/icon/heart-1545381/
var heart = confetti.shapeFromPath({
  path: "M167 72c19,-38 37,-56 75,-56 42,0 76,33 76,75 0,76 -76,151 -151,227 -76,-76 -151,-151 -151,-227 0,-42 33,-75 75,-75 38,0 57,18 76,56z",
  matrix: [
    0.03333333333333333, 0, 0, 0.03333333333333333, -5.566666666666666,
    -5.533333333333333,
  ],
});

var defaults = {
  scalar: 2,
  spread: 180,
  particleCount: 30,
  origin: { y: -0.1 },
  startVelocity: -35,
};

let playerSymbol = "X"; // Par défaut, joueur est mouton
let iaSymbol = "O";

let currentPlayer = "X";
let grid = Array(9).fill(null);
let aiLevel = "easy"; // Niveau par défaut

function chooseCamp(symbol) {
  playerSymbol = symbol;
  iaSymbol = symbol === "X" ? "O" : "X";
  currentPlayer = "X"; // Le joueur X commence toujours

  resetGame(); // On réinitialise le jeu

  // Si l'IA commence, elle joue tout de suite
  if (currentPlayer === iaSymbol) {
    setTimeout(iaPlay, 500);
  }
}

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

    confetti({
      ...defaults,
      shapes: [pumpkin],
      colors: ["#ff9a00", "#ff7400", "#ff4d00"],
    });
    confetti({
      ...defaults,
      shapes: [tree],
      colors: ["#8d960f", "#be0f10", "#445404"],
    });
    confetti({
      ...defaults,
      shapes: [heart],
      colors: ["#f93963", "#a10864", "#ee0b93"],
    });
  } else {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusText.textContent = `À ${currentPlayer} de jouer`;
    if (currentPlayer === "O") {
      setTimeout(iaPlay, 500); // l'IA joue après 0.5s
    }
  }
  if (currentPlayer !== playerSymbol) return; // Ignore le clic si ce n’est pas le tour du joueur
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
  document.querySelectorAll("#level-choice button").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      aiLevel = e.target.dataset.level;
      chooseCamp("X"); // Le joueur joue toujours X au départ ici, ou adapte si besoin
      let currentLevel = "easy";

      function chooseLevel(level) {
        currentLevel = level;
        chooseCamp("X"); // ou "O", selon ce que tu veux
      }
    });
  });
}

resetBtn.addEventListener("click", resetGame);

createBoard();
function iaPlay() {
  if (checkWinner()) return;

  let move;

  const emptyIndices = grid
    .map((val, idx) => (val === null ? idx : null))
    .filter((val) => val !== null);

  if (aiLevel === "easy") {
    // IA débile
    move = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
  } else if (aiLevel === "medium") {
    // IA prend le centre si possible, sinon au pif
    if (grid[4] === null) {
      move = 4;
    } else {
      move = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    }
  } else if (aiLevel === "hard") {
    // IA Minimax
    move = getBestMove(iaSymbol);
  }

  const cell = board.querySelector(`.cell[data-index="${move}"]`);
  if (cell) {
    cell.click();
  }
}

function getBestMove(player) {
  let bestScore = -Infinity;
  let move;

  for (let i = 0; i < 9; i++) {
    if (grid[i] === null) {
      grid[i] = player;
      let score = minimax(grid, 0, false);
      grid[i] = null;
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }

  return move;
}

function minimax(newGrid, depth, isMaximizing) {
  const winner = checkWinner();
  if (winner === iaSymbol) return 10 - depth;
  if (winner === playerSymbol) return depth - 10;
  if (!newGrid.includes(null)) return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (newGrid[i] === null) {
        newGrid[i] = iaSymbol;
        let score = minimax(newGrid, depth + 1, false);
        newGrid[i] = null;
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 9; i++) {
      if (newGrid[i] === null) {
        newGrid[i] = playerSymbol;
        let score = minimax(newGrid, depth + 1, true);
        newGrid[i] = null;
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

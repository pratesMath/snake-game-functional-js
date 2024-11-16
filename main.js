const boardSize = 20;
const board = document.getElementById("board");

const directions = {
  right: { x: 1, y: 0 },
  left: { x: -1, y: 0 },
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
}

const gameInitialState = {
  snake: [{ x: 0, y: 0 }],
  fruit: generateFruit(),
  direction: directions.right,
  gameOver: false,
};


for (let index = 0; index < boardSize * boardSize; index++) {
  const cell = document.createElement("div");
  cell.classList.add("cell");
  board.appendChild(cell);
}

const drawBoard = (state) => {
  const cells = document.querySelectorAll(".cell");

  cells.forEach((cell) => (cell.className = "cell"));
  
  const [head, ...snake_tail] = state.snake;
  const index = head.y * boardSize + head.x;
  
  cells[index].classList.add("snake");
  
  snake_tail.forEach((piece) => {
    const index = piece.y * boardSize + piece.x;
    cells[index].classList.add("snake_tail");
  });

  const fruitIndex = state.fruit.y * boardSize + state.fruit.x;
  cells[fruitIndex].classList.add("fruit");
};

const moveSnake = (snake, direction) => {
  const newHead = {
    x: snake[0].x + direction.x,
    y: snake[0].y + direction.y,
  };

  newHead.x = (newHead.x + boardSize) % boardSize;
  newHead.y = (newHead.y + boardSize) % boardSize;

  return [newHead, ...snake.slice(0, -1)];
};

const checkCollision = (snake) => {
  const [head, ...body] = snake;
  return body.some((segment) => segment.x === head.x && segment.y === head.y);
};

function generateFruit() {
  return {
    x: Math.floor(Math.random() * boardSize),
    y: Math.floor(Math.random() * boardSize),
  };
}

const gameLoop = (state) => {
  if (state.gameOver) {
    alert("Game over!");
    return;
  }

  const newSnake = moveSnake(state.snake, gameInitialState.direction);
  if (checkCollision(newSnake)) {
    state.gameOver = true;
  }

  let newFruit = state.fruit;
  if (newSnake[0].x === state.fruit.x && newSnake[0].y === state.fruit.y) {
    newSnake.push({ ...newSnake[newSnake.length - 1] });
    newFruit = generateFruit();
  }

  const newState = {
    ...state,
    snake: newSnake,
    fruit: newFruit,
  };

  drawBoard(newState);
  setTimeout(() => gameLoop(newState), 200);
};

const handleKeyPress = (event) => {
  const keyMap = {
    ArrowRight: directions.right,
    ArrowLeft: directions.left,
    ArrowUp: directions.up,
    ArrowDown: directions.down,
  };

  if (keyMap[event.key]) {
    gameInitialState.direction = keyMap[event.key];
  }
};

document.addEventListener("keydown", handleKeyPress);
drawBoard(gameInitialState);
gameLoop(gameInitialState);
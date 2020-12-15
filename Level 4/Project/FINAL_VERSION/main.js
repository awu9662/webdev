function initialize() {
  gameContainer = document.getElementById("gameContainer");
  startScreenDisplay = document.getElementById("startScreen");
  messages = document.getElementById("messages");

  // 0 for empty, 'x' and 'o' will be used for each player
  firstLayerBoard = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  secondLayerBoard = [0, 0, 0, 0, 0, 0, 0, 0, 0];

  // keep track of how many turns a square is taken so the opposite
  // player can't take a spot immediately after the other player took it
  turnsOccupied = [0, 0, 0, 0, 0, 0, 0, 0, 0];

  // player will choose if they want to be X or O
  playerSymbol = "";
  computerSymbol = "";

  isPlayersTurn = false;
  gameOver = false;

  // variable for tracking the bottom bar condition
  bottomBarShown = true;

  display();
}

function initializePlayer(sym) {
  playerSymbol = sym;

  // see if player wants smart computer
  var computerForm = document.getElementById('computerForm');
  smartComputer = computerForm.smart.checked;

  // X always goes first
  if (playerSymbol == "x") {
    isPlayersTurn = true;
    computerSymbol = "o";
  } else {
    isPlayersTurn = false;
    computerSymbol = "x";
    computerMakesMove();
  }

  display();
}

function makeMove(pos) {
  if (gameOver) return;
  if (!isPlayersTurn) return;

  var validMove = false;

  // let player play on the any layer if it is empty
  if (firstLayerBoard[pos] == 0) {
    // firstLayerBoard[pos] = playerSymbol;
    takeSquare(1, pos);
    validMove = true;
  } else if (secondLayerBoard[pos] == 0) {
    // if the first layer is the player's then claim it for good, else take it away from the other player
    if (firstLayerBoard[pos] == playerSymbol) {
      // secondLayerBoard[pos] = playerSymbol;
      takeSquare(2, pos);
      validMove = true;
    } else {
      // can only take away other player's square if it is not recently claimed
      if (turnsOccupied[pos] > 1) {
        takeSquare(1, pos, resetTurnsOccupied=true);
        validMove = true;
      }
    }
  }

  if (validMove) {
    checkGameOver();
    updateOccupiedList();

    isPlayersTurn = false;
    computerMakesMove();
  }

  display();
}

function takeSquare(layer, position, resetTurnsOccupied=false) {
  /* layer will either be 1 or 2 for which layer to put the x or o
   * will automatically put x or o depending on isPlayersTurn boolean value */
  if (isPlayersTurn) {
    if (layer == 1) firstLayerBoard[position] = playerSymbol;
    else if (layer == 2) secondLayerBoard[position] = playerSymbol;
  } else {
    if (layer == 1) firstLayerBoard[position] = computerSymbol;
    else if (layer == 2) secondLayerBoard[position] = computerSymbol;
  }

  if (resetTurnsOccupied) {
    turnsOccupied[position] = 0;
  }
}

function computerMakesMove() {
  if (gameOver) return;

  if (smartComputer) {
    computerSmartMakeMove();
    return;
  }

  var legalMove = false;
  var i = 0;

  while (!legalMove) {
    var randomPos = Math.floor(Math.random() * 9);

    /* the move is allowed if the firstLayer is untaken */
    if (firstLayerBoard[randomPos] == 0) {
      legalMove = true;
      // firstLayerBoard[randomPos] = computerSymbol;
      takeSquare(1, randomPos);
    } else if (secondLayerBoard[randomPos] == 0) {
      if (firstLayerBoard[randomPos] == computerSymbol) {
        // secondLayerBoard[randomPos] = computerSymbol;
        takeSquare(2, randomPos);
        legalMove = true;
      } else {
        if (turnsOccupied[randomPos] > 1) {
          // firstLayerBoard[randomPos] = computerSymbol;
          takeSquare(1, randomPos, resetTurnsOccupied=true);
          legalMove = true;
        }
      }
    }

    i++;
    if (i > 150) {
      console.log("too many loops");
      break;
    }
  }

  checkGameOver();
  updateOccupiedList();
  isPlayersTurn = true;

  display();
}

function updateOccupiedList() {
  for (var i = 0; i < firstLayerBoard.length; i++) {
    if (firstLayerBoard[i] != 0) {
      turnsOccupied[i] += 1;
    }
  }
}

function checkGameOver() {
  // helper function will return true if the list has the same items at index a, b, and c
  function positionChecker(list, a, b, c) {
    if (list[a] == list[b] && list[b] == list[c]) {
      if (list[a] != 0 && list[b] != 0 && list[c] != 0) {
        return true;
      }
    } else {
      return false;
    }
  }

  if (positionChecker(firstLayerBoard, 0, 1, 2) || positionChecker(firstLayerBoard, 0, 3, 6)) {
    endGame(firstLayerBoard[0]);
  }

  if (positionChecker(firstLayerBoard, 2, 5, 8) || positionChecker(firstLayerBoard, 6, 7, 8)) {
    endGame(firstLayerBoard[8]);
  }

  if (positionChecker(firstLayerBoard, 1, 4, 7) || positionChecker(firstLayerBoard, 3, 4, 5)) {
    endGame(firstLayerBoard[4]);
  }

  if (positionChecker(firstLayerBoard, 0, 4, 8) || positionChecker(firstLayerBoard, 2, 4, 6)) {
    endGame(firstLayerBoard[4]);
  }

  /* check if there is a tie */
  if (!gameOver) {
    // determine if the next player carn play anything
    var nextPlayerSymbol = isPlayersTurn ? computerSymbol : playerSymbol;
    var legalMove = false;

    for (var i = 0; i < 9; i++) {
      if (firstLayerBoard[i] == 0) {
        legalMove = true;
      } else if (secondLayerBoard[i] == 0) {
        if (firstLayerBoard[i] == nextPlayerSymbol) {
          legalMove = true;
        } else {
          if (turnsOccupied[i] > 1) {
            legalMove = true;
          }
        }
      }
    }

    if (!legalMove) endGame("tie");
  }
}

function endGame(winner) {
  gameOver = true;
  if (playerSymbol == winner) {
    messages.style.color = "#00aa44";
    messages.innerHTML = "You win!";
  } else if (computerSymbol == winner) {
    messages.style.color = "#fc0320";
    messages.innerHTML = "You lose!";
  } else if (winner == "tie") {
    messages.style.color = "#ff8800";
    messages.innerHTML = "It's a tie!";
  }
}

function display() {
  // start the game if player has chosen their symbol
  if (playerSymbol != "") {
    startScreenDisplay.style.display = "none";
    gameContainer.style.display = "block";
  } else {
    startScreenDisplay.style.display = "block";
    gameContainer.style.display = "none";
  }

  for (var i = 0; i < firstLayerBoard.length; i++) {
    var currentPos = document.getElementById("position" + i);

    if (firstLayerBoard[i] == 0) {
      currentPos.innerHTML = "";
    } else if (firstLayerBoard[i] == "x") {
      currentPos.innerHTML = "X";
      if (secondLayerBoard[i] == "x") currentPos.style.backgroundColor = "#9bff85";
    } else if (firstLayerBoard[i] == "o") {
      currentPos.innerHTML = "O";
      if (secondLayerBoard[i] == "o") currentPos.style.backgroundColor = "#9bff85";
    }
  }
}

function reset() {
  firstLayerBoard = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  secondLayerBoard = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  turnsOccupied = [0, 0, 0, 0, 0, 0, 0, 0, 0];

  playerSymbol = "";
  computerSymbol = "";

  isPlayersTurn = false;
  gameOver = false;

  messages.style.color = "black";
  messages.innerHTML = "";

  // reset the background colors for each square
  for (var i = 0; i < firstLayerBoard.length; i++) {
    var currentPos = document.getElementById("position" + i);
    currentPos.style.backgroundColor = "rgb(240, 217, 243)";
  }

  display();
}

function toggleBottomBar() {
  bottomBarShown = !bottomBarShown;

  var bottomBarContainer = document.getElementById("bottomBar");
  var bottomBarContent = document.getElementById("bottomBarContent");
  var bottomBarButton = document.getElementById("bottomBarToggleButton");

  var bottomBarContentHeight = bottomBarContent.scrollHeight;

  if (bottomBarShown) {
    bottomBarContent.style.transform = "translateY(0)";
    bottomBarButton.style.transform = 'translateY(0)'
    bottomBarButton.innerHTML = "Hide ↓";
    bottomBarContainer.style.zIndex = "1";
  } else {
    bottomBarContent.style.transform = "translateY(100%)"
    bottomBarButton.style.transform = `translateY(${bottomBarContentHeight + 4}px)`;
    bottomBarButton.innerHTML = "Show ↑";

    setTimeout(() => bottomBarContainer.style.zIndex = "-1", 500);
  }
}

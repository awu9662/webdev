function getValidMoves() {
  // returns a list of the possible positions to play
  var validMoves = [];

  for (var i = 0; i < 9; i++) {
    if (firstLayerBoard[i] == 0) {
      validMoves.push(i);
    } else if (secondLayerBoard[i] == 0) {
      if (firstLayerBoard[i] == computerSymbol) {
        validMoves.push(i);
      } else {
        if (turnsOccupied[i] > 1) {
          validMoves.push(i);
        }
      }
    }
  }
  return validMoves;
}

// function getEnemyPosition() {
//   var enemySquares = [];

//   for (var i = 0; i < 9; i++) {
//     if (firstLayerBoard[i] == playerSymbol) enemySquares.push(i);
//   }
// }

function checkHowCloseToWinning(currentMove, symbol, firstLayer) {
  // symbol is who to check against, for the computer's case playerSymbol
  function positionChecker(a, b, c) {
    var movesAwayFromWinning = 3;

    if (firstLayer[a] == symbol) {
      movesAwayFromWinning -= 1;
    }
    if (firstLayer[b] == symbol) {
      movesAwayFromWinning -= 1;
    }
    if (firstLayer[c] == symbol) {
      movesAwayFromWinning -= 1;
    }

    // return a lower score if the symbol is 1 move away from winning
    if (movesAwayFromWinning == 1) return -10;
    else return movesAwayFromWinning;
  }

  var score = 0;

  if (currentMove >= 0 && currentMove <= 2) {
    score += positionChecker(0, 1, 2);
    score += positionChecker(currentMove, currentMove + 3, currentMove + 6);

    if (currentMove == 0) score += positionChecker(0, 4, 8);
    else if (currentMove == 2) score += positionChecker(2, 4, 6);
    else score += 3;

  } else if (currentMove >= 3 && currentMove <= 5) {
    score += positionChecker(3, 4, 5);
    score += positionChecker(currentMove, currentMove + 3, currentMove - 3);
    if (currentMove == 4) score += positionChecker(0, 4, 8);
    else score += 3;

  } else if ((currentMove >= 6 && currentMove <= 8)) {
    score += positionChecker(6, 7, 8);
    score += positionChecker(currentMove, currentMove - 3, currentMove - 6);

    if (currentMove == 6) score += positionChecker(2, 4, 6);
    else if (currentMove == 8) score += positionChecker(0, 4, 8);
    else score += 3;
  }

  return score;
}

function checkIfWinPossible() {
  // determine if the computer can win in a move and returns that index, otherwise -1

  var winningPos = -1;

  function positionChecker(a, b, c) {
    // no return for this nested function
    var movesAwayFromWinning = 3;

    if (firstLayerBoard[a] == computerSymbol) {
      movesAwayFromWinning--;
    }
    if (firstLayerBoard[b] == computerSymbol) {
      movesAwayFromWinning--;
    }
    if (firstLayerBoard[c] == computerSymbol) {
      movesAwayFromWinning--;
    }

    // determine which position will win the game if possible
    if (movesAwayFromWinning == 1) {
      if ((firstLayerBoard[a] != computerSymbol) && (firstLayerBoard[a] == 0 || turnsOccupied[a] > 1 && secondLayerBoard[a] == 0))
        winningPos = a;
      else if ((firstLayerBoard[b] != computerSymbol) && (firstLayerBoard[b] == 0 || turnsOccupied[b] > 1 && secondLayerBoard[b] == 0))
        winningPos = b;
      else if ((firstLayerBoard[c] != computerSymbol) && (firstLayerBoard[c] == 0 || turnsOccupied[c] > 1 && secondLayerBoard[c] == 0))
        winningPos = c;
    }
  }

  positionChecker(0, 1, 2);
  positionChecker(0, 3, 6);

  positionChecker(2, 5, 8);
  positionChecker(6, 7, 8);

  positionChecker(1, 4, 7);
  positionChecker(3, 4, 5);

  positionChecker(0, 4, 8);
  positionChecker(2, 4, 6);

  return winningPos;
}

function bestMoveToPlay() {
  var winningIndex = checkIfWinPossible();
  if (winningIndex > -1) return winningIndex;

  // all scores of each possible move
  var possibleOutcomes = [];

  var validMoves = getValidMoves();

  // play out each move and see how close player is to winning
  for (var i = 0; i < validMoves.length; i++) {
    possibleOutcomes.push(checkHowCloseToWinning(validMoves[i], playerSymbol, firstLayerBoard));
  }

  if (firstLayerBoard.every((i) => i == 0)) {
    // always take the center square if going first
    return 4;
  } else {
    // claim center for good if going first
    if (firstLayerBoard[4] == computerSymbol && secondLayerBoard[4] == 0) {
      var count = 0;
      for (var i = 0; i < firstLayerBoard.length; i++) {
        if (firstLayerBoard[i] == 0) count++;
      }

      if (count >= 7) {
        return 4;
      }

    } else {
      // normal move
      var index = possibleOutcomes.indexOf(Math.min(...possibleOutcomes));
      return validMoves[index];
    }
  }
}

function computerSmartMakeMove() {
  // use second layer if it doesnt work
  var best = bestMoveToPlay();
  if (firstLayerBoard[best] == 0) {
    takeSquare(1, best);
  } else if (firstLayerBoard[best] == computerSymbol) {
    takeSquare(2, best);
  } else if (turnsOccupied[best] > 1) {
    takeSquare(1, best, resetTurnsOccupied = true);
  }


  checkGameOver();
  updateOccupiedList();
  isPlayersTurn = true;

  display();
}

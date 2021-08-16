function initialize() {
  rockDisplayCount = document.getElementById("rockDisplay");
  paperDisplayCount = document.getElementById("paperDisplay");
  scissorsDisplayCount = document.getElementById("scissorsDisplay");

  computerRockDisplayCount = document.getElementById("computerRockDisplay");
  computerPaperDisplayCount = document.getElementById("computerPaperDisplay");
  computerScissorsDisplayCount = document.getElementById("computerScissorsDisplay");

  message = document.getElementById("message");
  logTable = document.getElementById("log");

  playerCardToDisplay = document.getElementById("playerCardToDisplay");
  computerCardToDisplay = document.getElementById("computerCardToDisplay");
  roundStatusDisplay = document.getElementById("roundStatusDisplay");

  // the td object of each player card img
  rock = document.getElementById("rock");
  paper = document.getElementById("paper");
  scissors = document.getElementById("scissors");

  // extra enchancements
  numCardsForm = document.getElementById("numCardsForm"); // custom number of starting cards
  buildModeButton = document.getElementById("buildModeButton"); // enchancement for builders

  buildModeStatus = false; // false for off, true for on
  firstCardSelectedForBuild = "";
  secondCardSelectedForBuild = "";
  cardBuiltByComputer = ""; // track what card the computer built

  smartComputer = false; // allow user to select a smart computer that plays cards intelligently

  // used to toggle the display statuses of the navbars
  navBarLeftToggle = true;
  navBarRightToggle = true;

  playerRock = 5;
  playerPaper = 5;
  playerScissors = 5;

  computerRock = 5;
  computerPaper = 5;
  computerScissors = 5;

  currentClickedCard = "";
  currentComputerCard = "";

  lastRoundStatus = "";

  cardBroken = false;

  // variables to check if player plays three cards in a row
  lastPlayerCard = "";
  timesInRowPlayer = 1;
  lastComputerCard = "";
  timesInRowComputer = 1;

  winnerOfGame = "";

  numMoves = 0;

  /* extra variables */
  instructionToggle = true;

  // keep track of all the rounds in a list
  roundStatuses = [];

  // used to set a custom amount of starting cards
  newRockNumber = 5;
  newPaperNumber = 5;
  newScissorsNumber = 5;
  /**/

  display();
}

function selectCard(card) {
  var allowClick = false;

  if (buildModeStatus) {

    if (card == "rock" && playerRock > 0) allowClick = true;
    if (card == "paper" && playerPaper > 0) allowClick = true;
    if (card == "scissors" && playerScissors > 0) allowClick = true;

    if (allowClick) {
      if (firstCardSelectedForBuild != "" && firstCardSelectedForBuild != card) secondCardSelectedForBuild = card;
      else firstCardSelectedForBuild = card;
    }

    if (secondCardSelectedForBuild != "") buildCard();

  } else {
    // prevent clicking if the game is over
    if (winnerOfGame == "player") {
      message.innerHTML = "You won already!";
    } else if (winnerOfGame == "computer") {
      message.innerHTML = "Give up! You lost!";
    } else {
      if (card == "rock" && playerRock > 0) allowClick = true;
      if (card == "paper" && playerPaper > 0) allowClick = true;
      if (card == "scissors" && playerScissors > 0) allowClick = true;
      if (allowClick) currentClickedCard = card;
      makePlay();
    }
  }
  display();
}

function toggleBuildMode() {
  buildModeStatus = !buildModeStatus;

  if (buildModeStatus) {
    buildModeButton.style.backgroundColor = "#ff0000";
    buildModeButton.innerHTML = "Build Mode - ON";
  } else {
    buildModeButton.style.backgroundColor = "rgba(90, 255, 23, 0.5)";
    buildModeButton.innerHTML = "Build Mode - OFF";
  }

  firstCardSelectedForBuild = "";
  secondCardSelectedForBuild = "";

  display();
}

function buildCard() {
  // keep track of previous card amounts to use later
  originalRock = playerRock;
  originalPaper = playerPaper;
  originalScissors = playerScissors;

  if (firstCardSelectedForBuild == "rock") playerRock--;
  else if (firstCardSelectedForBuild == "paper") playerPaper--;
  else if (firstCardSelectedForBuild == "scissors") playerScissors--;

  if (secondCardSelectedForBuild == "rock") playerRock--;
  else if (secondCardSelectedForBuild == "paper") playerPaper--;
  else if (secondCardSelectedForBuild == "scissors") playerScissors--;

  // determine which cards have decreased and increase the other one
  if (originalRock > playerRock && originalPaper > playerPaper) {
    playerScissors++;
  } else if (originalRock > playerRock && originalScissors > playerScissors) {
    playerPaper++;
  } else if (originalPaper > playerPaper && originalScissors > playerScissors) {
    playerRock++;
  }

  firstCardSelectedForBuild = "";
  secondCardSelectedForBuild = "";
  determineWinner();
}

function buildCardForComputer() {
  cardBuiltByComputer = "";

  if (computerRock == 0 && computerPaper > 1 && computerScissors > 1) {
    computerRock++;
    computerPaper--;
    computerScissors--;
    cardBuiltByComputer = "rock";
  } else if (computerPaper == 0 && computerRock > 1 && computerScissors > 1) {
    computerRock--;
    computerPaper++;
    computerScissors--;
    cardBuiltByComputer = "paper";
  } else if (computerScissors == 0 && computerRock > 1 && computerPaper > 1) {
    computerRock--;
    computerPaper--;
    computerScissors++;
    cardBuiltByComputer = "scissors";
  }
}

function makePlay() {
  cardBroken = false;

  if (currentClickedCard == "") {
    message.innerHTML = "Pick a valid card!";
  } else {
    message.innerHTML = "";
    numMoves++;

    // increment the timesInRow variable for player by 1 if the last card is the same as the current card
    if (lastPlayerCard == currentClickedCard) timesInRowPlayer++;
    else timesInRowPlayer = 1;

    if (timesInRowPlayer == 3) {
      breakCard("player");
    } else {

      // there is a 10% chance that the computer will not be smart if enabled
      if (smartComputer && ( (Math.random() * 100) > 10 )) {
        currentComputerCard = smartComputerPicksCard();
      } else {
        currentComputerCard = computerPicksCard();
      }

      // increment the timesInRow variable for computer by 1 if the last card is the same as the current card
      if (lastComputerCard == currentComputerCard) timesInRowComputer++;
      else timesInRowComputer = 1;

      if (timesInRowComputer == 3) breakCard("computer");
      else evaluateMove(currentClickedCard, currentComputerCard);

      lastPlayerCard = currentClickedCard;
      lastComputerCard = currentComputerCard;
      currentClickedCard = "";
      currentComputerCard = "";

      // the computer will automatically build other cards if it doesn't have one type
      if (smartComputer) buildCardForComputer();

    }
  }

  determineWinner();
  display();
}

function breakCard(playerToBreak) {
  // used to display the last round status
  cardBroken = true;

  if (playerToBreak == "player") {
    if (lastPlayerCard == "rock") playerRock--;
    if (lastPlayerCard == "paper") playerPaper--;
    if (lastPlayerCard == "scissors") playerScissors--;
  }

  if (playerToBreak == "computer") {
    if (lastComputerCard == "rock") computerRock--;
    if (lastComputerCard == "paper") computerPaper--;
    if (lastComputerCard == "scissors") computerScissors--;
  }

  logBrokenCard(playerToBreak);

  lastPlayerCard = "";
  timesInRowPlayer = 1;
  lastComputerCard = "";
  timesInRowComputer = 1;

  currentClickedCard = "";
  currentComputerCard = "";
}

function computerPicksCard() {
  var cardToPlay;
  var possiblePlay = false;

  while (!possiblePlay) {
    // stop the loop if computer has no cards
    if (computerRock + computerPaper + computerScissors == 0) break;

    var randNum = Math.floor(Math.random() * 3 + 1);

    if (randNum == 1 && computerRock > 0) {
      cardToPlay = "rock";
      possiblePlay = true;
    }
    if (randNum == 2 && computerPaper > 0) {
      cardToPlay = "paper";
      possiblePlay = true;
    }
    if (randNum == 3 && computerScissors > 0) {
      cardToPlay = "scissors";
      possiblePlay = true;
    }
  }

  return cardToPlay;
}

function smartComputerPicksCard() {
  var cardToPlay;
  var possiblePlay = false;
  var i = 0

  while (!possiblePlay) {
    // stop the loop if computer has no cards
    if (computerRock + computerPaper + computerScissors == 0) break;

    var randNum = Math.floor(Math.random() * 3 + 1);

    if (randNum == 1 && computerRock > 0) {
      cardToPlay = "rock";
      possiblePlay = true;
    }
    if (randNum == 2 && computerPaper > 0) {
      cardToPlay = "paper";
      possiblePlay = true;
    }
    if (randNum == 3 && computerScissors > 0) {
      cardToPlay = "scissors";
      possiblePlay = true;
    }

    // computer will not play same card 3 times
    if ((lastComputerCard == cardToPlay) && (timesInRowComputer == 2)) {
      possiblePlay = false;
    }

    // computer will not play a card that the player does not have
    if ((playerRock == 0 && cardToPlay == "rock") || (playerPaper == 0 && cardToPlay == "paper") || (playerScissors == 0 && cardToPlay == "scissors")) {
      possiblePlay = false;
    }

    // stop at 100 iterations and do it normally
    if (i == 100) return computerPicksCard();

    i++;
  }

  return cardToPlay;
}

function evaluateMove(playerCard, computerCard) {
  lastRoundStatus = "tie";

  if (playerCard == "rock") {
    if (computerCard == "rock") {
      // tie
    } else if (computerCard == "paper") {
      // lose
      playerRock--;
      computerRock++;
      lastRoundStatus = "lost";
    } else {
      // win
      playerScissors++;
      computerScissors--;
      lastRoundStatus = "win";
    }
  } else if (playerCard == "paper") {
    if (computerCard == "rock") {
      // win
      playerRock++;
      computerRock--;
      lastRoundStatus = "win";
    } else if (computerCard == "paper") {
      // tie
    } else {
      // lose
      playerPaper--;
      computerPaper++;
      lastRoundStatus = "lost";
    }
  } else if (playerCard == "scissors") {
    if (computerCard == "rock") {
      // lose
      playerScissors--;
      computerScissors++;
      lastRoundStatus = "lost";
    } else if (computerCard == "paper") {
      // win
      playerPaper++;
      computerPaper--;
      lastRoundStatus = "win";
    } else {
      // tie
    }
  }
  roundStatuses.push(lastRoundStatus);

  logLastMove(playerCard, computerCard, lastRoundStatus);
  checkTies();
}

function checkTies() {
  // remove a card at random from both players if there is a tie three rounds in a row
  if (
    roundStatuses[roundStatuses.length - 1] == "tie" &&
    roundStatuses[roundStatuses.length - 2] == "tie" &&
    roundStatuses[roundStatuses.length - 3] == "tie"
  ) {
    var playerCardRemoved = false;
    var playerCardToRemove = "";
    while (!playerCardRemoved) {
      randNum = Math.floor(Math.random() * 3 + 1);
      if (randNum == 1 && playerRock > 0) {
        playerCardToRemove = "rock";
        playerCardRemoved = true;
      }
      if (randNum == 2 && playerPaper > 0) {
        playerCardToRemove = "paper";
        playerCardRemoved = true;
      }
      if (randNum == 3 && playerScissors > 0) {
        playerCardToRemove = "scissors";
        playerCardRemoved = true;
      }
    }

    var computerCardRemoved = false;
    var computerCardToRemove = "";
    while (!computerCardRemoved) {
      randNum = Math.floor(Math.random() * 3 + 1);
      if (randNum == 1 && computerRock > 0) {
        computerCardToRemove = "rock";
        computerCardRemoved = true;
      }
      if (randNum == 2 && computerPaper > 0) {
        computerCardToRemove = "paper";
        computerCardRemoved = true;
      }
      if (randNum == 3 && computerScissors > 0) {
        computerCardToRemove = "scissors";
        computerCardRemoved = true;
      }
    }

    if (playerCardToRemove == "rock") playerRock--;
    else if (playerCardToRemove == "paper") playerPaper--;
    else if (playerCardToRemove == "scissors") playerScissors--;

    if (computerCardToRemove == "rock") computerRock--;
    else if (computerCardToRemove == "paper") computerPaper--;
    else if (computerCardToRemove == "scissors") computerScissors--;

    logTie();
  }
}

function logLastMove(playerCard, computerCard, lastRoundStatus) {
  /* add images to the table to show which person won the last round */
  newTr = logTable.insertRow(0);

  newCell = newTr.insertCell();
  newCell.style.color = "green";
  newCell.innerHTML = numMoves.toString() + ". ";

  var playerCardToInsert;
  var computerCardToInsert;
  if (playerCard == "rock") playerCardToInsert = "rock";
  else if (playerCard == "paper") playerCardToInsert = "paper";
  else if (playerCard == "scissors") playerCardToInsert = "scissors";

  if (computerCard == "rock") computerCardToInsert = "rock";
  else if (computerCard == "paper") computerCardToInsert = "paper";
  else if (computerCard == "scissors") computerCardToInsert = "scissors";

  // insert appropriate image
  newCell = newTr.insertCell();
  cardImage = document.createElement("img");
  cardImage.src = "img/" + playerCardToInsert + ".PNG";
  newCell.appendChild(cardImage);

  newCell = newTr.insertCell();

  var color;
  if (lastRoundStatus == "win") color = "green";
  else if (lastRoundStatus == "lost") color = "red";
  else color = "black";
  newCell.style.color = color;
  newCell.innerHTML = lastRoundStatus.charAt(0).toUpperCase() + lastRoundStatus.slice(1); // capitalize

  newCell = newTr.insertCell();
  cardImage = document.createElement("img");
  cardImage.src = "img/" + computerCardToInsert + ".PNG";
  newCell.appendChild(cardImage);
}

function logBrokenCard(playerToBreak) {
  var newTr = logTable.insertRow(0);
  newCell = newTr.insertCell();
  newCell.style.color = "green";
  newCell.innerHTML = numMoves.toString() + ". ";

  newCell = newTr.insertCell();
  newCell.colSpan = "3";

  // display the broken card in the center and add it to the table
  roundStatusDisplay.style.fontSize = "1.2em";
  roundStatusDisplay.style.color = "black";
  if (playerToBreak == "player") {
    var text = "You have broken your " + lastPlayerCard + ".";
    newCell.innerHTML = text;
    roundStatusDisplay.innerHTML = text;
  } else {
    var text = "The computer has broken its " + lastComputerCard + ".";
    newCell.innerHTML = text;
    roundStatusDisplay.innerHTML = text;
  }
}

function logTie() {
  var newTr = logTable.insertRow(0);
  newCell = newTr.insertCell();
  newCell.style.color = "green";
  newCell.innerHTML = numMoves.toString() + ". ";

  newCell = newTr.insertCell();
  newCell.colSpan = "3";

  // display the broken card in the center and add it to the table
  roundStatusDisplay.style.fontSize = "1.2em";
  roundStatusDisplay.style.color = "black";
  var text = "Too many ties! 1 card removed from each hand!";
  newCell.innerHTML = text;
  roundStatusDisplay.innerHTML = text;
}

function logLostCause(playerToLog) {
  var newTr = logTable.insertRow(0);

  newCell = newTr.insertCell();
  newCell.colSpan = "4";
  newCell.style.color = "#f58442";

  // display the broken card in the center and add it to the table
  roundStatusDisplay.style.fontSize = "1.2em";
  roundStatusDisplay.style.color = "black";
  var text = "";
  if (playerToLog == "player") {
    text = "You are a lost cause.";
  } else if (playerToLog == "computer") {
    text = "The computer is a lost cause.";
  }
  newCell.innerHTML = text;
  roundStatusDisplay.innerHTML = text;

  lostCauseDisplay = document.getElementById("lostCause");
  lostCauseDisplay.style.margin = "1%";
  lostCauseDisplay.style.fontSize = "2em";
  lostCauseDisplay.style.color = "#f58442";

  if (playerToLog == "player") {
    lostCauseDisplay.innerHTML = "You only have one type of card left. <br>" + text;
  } else if (playerToLog == "computer") {
    lostCauseDisplay.innerHTML = "The computer only has one type of card left. <br>" + text;
  }
}

function determineWinner() {
  // determine if a player only has one type of card
  var playerWithOnlyOneTypeOfCard = "";
  if (playerRock > 0 && playerPaper == 0 && playerScissors == 0) {
    playerWithOnlyOneTypeOfCard = "player";
  } else if (playerRock == 0 && playerPaper > 0 && playerScissors == 0) {
    playerWithOnlyOneTypeOfCard = "player";
  } else if (playerRock == 0 && playerPaper == 0 && playerScissors > 0) {
    playerWithOnlyOneTypeOfCard = "player";
  }

  if (computerRock > 0 && computerPaper == 0 && computerScissors == 0) {
    playerWithOnlyOneTypeOfCard = "computer";
  } else if (computerRock == 0 && computerPaper > 0 && computerScissors == 0) {
    playerWithOnlyOneTypeOfCard = "computer";
  } else if (computerRock == 0 && computerPaper == 0 && computerScissors > 0) {
    playerWithOnlyOneTypeOfCard = "computer";
  }

  if (playerWithOnlyOneTypeOfCard == "player") {
    computerRock += playerRock;
    computerPaper += playerPaper;
    computerScissors += playerScissors;

    playerRock = 0;
    playerPaper = 0;
    playerScissors = 0;

    logLostCause("player");
  } else if (playerWithOnlyOneTypeOfCard == "computer") {
    playerRock += computerRock;
    playerPaper += computerPaper;
    playerScissors += computerScissors;

    computerRock = 0;
    computerPaper = 0;
    computerScissors = 0;

    logLostCause("computer");
  }

  if (playerRock + playerPaper + playerScissors == 0) {
    winnerOfGame = "computer";
  } else if (computerRock + computerPaper + computerScissors == 0) {
    winnerOfGame = "player";
  }
}

function display() {
  rockDisplayCount.innerHTML = playerRock;
  paperDisplayCount.innerHTML = playerPaper;
  scissorsDisplayCount.innerHTML = playerScissors;

  computerRockDisplayCount.innerHTML = computerRock;
  computerPaperDisplayCount.innerHTML = computerPaper;
  computerScissorsDisplayCount.innerHTML = computerScissors;

  if (currentClickedCard != "") message.innerHTML = "";

  // enlarge last played cards
  if (lastPlayerCard == "rock") {
    playerCardToDisplay.innerHTML = "<img src='img/rock.PNG' />";
  } else if (lastPlayerCard == "paper") {
    playerCardToDisplay.innerHTML = "<img src='img/paper.PNG' />";
  } else if (lastPlayerCard == "scissors") {
    playerCardToDisplay.innerHTML = "<img src='img/scissors.PNG' />";
  } else {
    playerCardToDisplay.innerHTML = "";
  }

  if (lastComputerCard == "rock") {
    computerCardToDisplay.innerHTML = "<img src='img/rock.PNG' />";
  } else if (lastComputerCard == "paper") {
    computerCardToDisplay.innerHTML = "<img src='img/paper.PNG' />";
  } else if (lastComputerCard == "scissors") {
    computerCardToDisplay.innerHTML = "<img src='img/scissors.PNG' />";
  } else {
    computerCardToDisplay.innerHTML = "";
  }

  // show who won the last round, unless a card is broken
  if (!cardBroken) {
    roundStatusDisplay.style.fontSize = "1.2em";
    if (lastRoundStatus == "win") {
      roundStatusDisplay.style.color = "green";
      roundStatusDisplay.innerHTML = "Win";
    } else if (lastRoundStatus == "lost") {
      roundStatusDisplay.style.color = "red";
      roundStatusDisplay.innerHTML = "Lost";
    } else if (lastRoundStatus == "tie") {
      roundStatusDisplay.style.color = "black";
      roundStatusDisplay.innerHTML = "Tie";
    }
  }

  // highlight card that player has selected for building another card
  // the second card isn't highlighted because it will be submitted automatically
  if (firstCardSelectedForBuild == "rock") {
    rockDisplayCount.style.textDecoration = 'overline';
    rockDisplayCount.style.fontWeight = "1000";
    rockDisplayCount.style.color = "#00cf10";
  } else if (firstCardSelectedForBuild == "paper") {
    paperDisplayCount.style.textDecoration = 'overline';
    paperDisplayCount.style.fontWeight = "1000";
    paperDisplayCount.style.color = "#00cf10";
  } else if (firstCardSelectedForBuild == "scissors") {
    scissorsDisplayCount.style.textDecoration = 'overline';
    scissorsDisplayCount.style.fontWeight = "1000";
    scissorsDisplayCount.style.color = "#00cf10";
  } else {
    rockDisplayCount.style.textDecoration = 'none';
    rockDisplayCount.style.fontWeight = "normal";
    rockDisplayCount.style.color = "black";
    paperDisplayCount.style.textDecoration = 'none';
    paperDisplayCount.style.fontWeight = "normal";
    paperDisplayCount.style.color = "black";
    scissorsDisplayCount.style.textDecoration = 'none';
    scissorsDisplayCount.style.fontWeight = "normal";
    scissorsDisplayCount.style.color = "black";
  }

  // highlight if the computer built a card; green for card it built, red for ones it used
  if (cardBuiltByComputer != "") {
    if (cardBuiltByComputer == "rock") {
      computerRockDisplayCount.style.textDecoration = 'overline';
      computerRockDisplayCount.style.fontWeight = "1000";
      computerRockDisplayCount.style.color = "#00cf10";

      computerPaperDisplayCount.style.fontWeight = "1000";
      computerPaperDisplayCount.style.color = "#ff1050";
      computerScissorsDisplayCount.style.fontWeight = "1000";
      computerScissorsDisplayCount.style.color = "#ff1050";

    } else if (cardBuiltByComputer == "paper") {
      computerPaperDisplayCount.style.textDecoration = 'overline';
      computerPaperDisplayCount.style.fontWeight = "1000";
      computerPaperDisplayCount.style.color = "#00cf10";

      computerRockDisplayCount.style.fontWeight = "1000";
      computerRockDisplayCount.style.color = "#ff1050";
      computerScissorsDisplayCount.style.fontWeight = "1000";
      computerScissorsDisplayCount.style.color = "#ff1050";

    } else if (cardBuiltByComputer == "scissors") {
      computerScissorsDisplayCount.style.textDecoration = 'overline';
      computerScissorsDisplayCount.style.fontWeight = "1000";
      computerScissorsDisplayCount.style.color = "#00cf10";

      computerRockDisplayCount.style.fontWeight = "1000";
      computerRockDisplayCount.style.color = "#ff1050";
      computerPaperDisplayCount.style.fontWeight = "1000";
      computerPaperDisplayCount.style.color = "#ff1050";

    }
  } else {
    computerRockDisplayCount.style.textDecoration = 'none';
    computerRockDisplayCount.style.fontWeight = "normal";
    computerRockDisplayCount.style.color = "black";
    computerPaperDisplayCount.style.textDecoration = 'none';
    computerPaperDisplayCount.style.fontWeight = "normal";
    computerPaperDisplayCount.style.color = "black";
    computerScissorsDisplayCount.style.textDecoration = 'none';
    computerScissorsDisplayCount.style.fontWeight = "normal";
    computerScissorsDisplayCount.style.color = "black";
  }

  // big text to show winner
  if (winnerOfGame == "player") {
    playerCardToDisplay.style.fontSize = "4.5em";
    playerCardToDisplay.innerHTML = "You win!";
    computerCardToDisplay.innerHTML = "";
    roundStatusDisplay.innerHTML = "";
  } else if (winnerOfGame == "computer") {
    playerCardToDisplay.style.fontSize = "4.5em";
    playerCardToDisplay.innerHTML = "The computer wins!";
    computerCardToDisplay.innerHTML = "";
    roundStatusDisplay.innerHTML = "";
  }
}

function reset() {
  playerRock = newRockNumber > 0 ? newRockNumber : 5;
  playerPaper = newPaperNumber > 0 ? newPaperNumber : 5;
  playerScissors = newScissorsNumber > 0 ? newScissorsNumber : 5;

  // computer has same number as player
  computerRock = playerRock;
  computerPaper = playerPaper;
  computerScissors = playerScissors;

  currentClickedCard = "";
  currentComputerCard = "";

  lastRoundStatus = "";
  cardBroken = false;

  lastPlayerCard = "";
  timesInRowPlayer = 1;
  lastComputerCard = "";
  timesInRowComputer = 1;

  winnerOfGame = "";

  numMoves = 0;

  message.innerHTML = "";
  logTable.innerHTML = "";
  roundStatusDisplay.innerHTML = "";

  document.getElementById("lostCause").innerHTML = "";

  display();
}

function displayInstructions() {
  instructions = document.getElementById("instructionText");
  instructionButton = document.getElementById("instructionButton");
  afterInstruction = document.getElementById("afterInstruction");

  instructionToggle = !instructionToggle;

  if (instructionToggle) {
    instructions.style.display = "inline";
    afterInstruction.innerHTML = "";
    instructionButton.innerHTML = "I know the rules";
  } else {
    instructions.style.display = "none";
    h2 = document.createElement("h2");
    h2.innerHTML = "Get playing!";
    afterInstruction.appendChild(h2);
    instructionButton.innerHTML = "Let me see the rules again";
  }
}

function readNumCardsForm() {
  newRockNumber = parseInt(numCardsForm.nRock.value);
  newPaperNumber = parseInt(numCardsForm.nPaper.value);
  newScissorsNumber = parseInt(numCardsForm.nScissors.value);

  // reset the inputs
  numCardsForm.nRock.value = "5";
  numCardsForm.nPaper.value = "5";
  numCardsForm.nScissors.value = "5";

  smartComputer = numCardsForm.smartComputer.checked;

  numCardsForm.smartComputer.checked = false;

  // show the play if the computer is smart of not
  computerType = document.getElementById("computerType");
  if (smartComputer) {
    computerType.innerHTML = "Smart computer's hand";
  } else {
    computerType.innerHTML = "Computer's hand";
  }

  // reset the game and use the new values when person sumbits
  reset();
}

function hideBar(bar) {
  if (bar == "left") {
    sidenavLeft = document.getElementById("sidenav-left");
    hideButtonLeftContainer = document.getElementById("hideButtonLeftContainer");
    hideButtonLeft = document.getElementById("hideButtonLeft");

    navBarLeftToggle = !navBarLeftToggle;

    if (navBarLeftToggle) {
      sidenavLeft.style.display = "block";
      hideButtonLeftContainer.style.left = "25%";
      hideButtonLeft.innerHTML = "< Hide";
    } else {
      sidenavLeft.style.display = "none";
      hideButtonLeftContainer.style.left = "2px";
      hideButtonLeft.innerHTML = "Show >";
    }
  }

  if (bar == "right") {
    sidenavRight = document.getElementById("sidenav-right");
    hideButtonRightContainer = document.getElementById("hideButtonRightContainer");
    hideButtonRight = document.getElementById("hideButtonRight");

    navBarRightToggle = !navBarRightToggle;

    if (navBarRightToggle) {
      sidenavRight.style.display = "block";
      hideButtonRightContainer.style.right = "23%";
      hideButtonRight.innerHTML = "Hide >";
    } else {
      sidenavRight.style.display = "none";
      hideButtonRightContainer.style.right = "2px";
      hideButtonRight.innerHTML = "< Show";
    }
  }
}

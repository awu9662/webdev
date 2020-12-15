let ranks = ["A", 2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K"];
let suits = ["C", "D", "H", "S"];
let kingIndex = [0, 3, 12, 15];
let queenIndex = [1, 2, 13, 14];
let jackIndex = [4, 7, 8, 11];
let middleIndex = [5, 6, 9, 10];

class Card {
  constructor(rank, suit) {
    this.rank = rank == "A" ? 1 : rank; // ace will be treated as 1 for convenience
    this.suit = suit;
    this.imgFile = `img/${rank}${suit}.png`;
    this.indexOnBoard = -1;
  }
}

// initialize deck
let deck = [];
for (let r = 0; r < ranks.length; r++) {
  for (let s = 0; s < suits.length; s++) {
    let card = new Card(ranks[r], suits[s]);
    deck.push(card);
  }
}

// shuffle deck
for (let i = 0; i < deck.length; i++) {
  let rand = Math.floor(Math.random() * deck.length);
  [deck[i], deck[rand]] = [deck[rand], deck[i]];
}

let discardDeck = [];

let cardbackSrc = "img/blue_back.png";
let discardDeckEmptySrc = "img/red_back.png";
let kingSrc = "img/king.png";
let queenSrc = "img/queen.png";
let jackSrc = "img/jack.png";

// variables
let deckDisplay = document.getElementById("deck");
let cardsDisplay = document.getElementsByClassName("card");


// list for tracking cards on board
let board = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}];
let currentCard = {};

// used for undo button
let previousMoves = [];

let removalPhase = false;
let cardSelectedForRemoval = null;

let score = 0;

let cheats = false;
let gameState;


function drawCard() {
  if (deck.length == 0) finalCheck();

  let card = deck.pop();
  currentCard = card;

  checkCardPlayable();
}


function checkCardPlayable() {
  // only need to check if the king, queen, or jack is playable
  if (
    (currentCard.rank == "K" && kingIndex.every(i => board[i].rank != undefined)) ||
    (currentCard.rank == "Q" && queenIndex.every(i => board[i].rank != undefined)) ||
    (currentCard.rank == "J" && jackIndex.every(i => board[i].rank != undefined)) ||
    (board.every(i => i.rank != undefined))
    // && (!cheats)
  ) {
    gameState = "lose";
  }
}


// final check to see if game over
function finalCheck() {
  if (
    (kingIndex.every((i) => board[i].rank != undefined)) &&
    (queenIndex.every((i) => board[i].rank != undefined)) &&
    (jackIndex.every((i) => board[i].rank != undefined)) &&
    (middleIndex.every(i => board[i].rank == undefined))
    // && (!cheats)
  ) {
    gameState = "win";
    score += 12;
    score += deck.length + (currentCard.rank != undefined ? 1 : 0);
  } else {
    gameState = "lose";
  }

  display();
}


function clickedOnBoard(index) {
  if (gameState == "win" || gameState == "lose") return;

  previousMoves.push({
    tBoard: board.slice(),
    tCurrentCard: currentCard,
    tDeck: deck.slice(),
    tDiscardDeck: discardDeck.slice(),
    tRemovalPhase: removalPhase,
    tGameState: gameState,
    tScore: score,
  });

  if (!removalPhase) {
    /* normal phase */

    // only allow card to be placed if it is empty
    if (!cardsDisplay[index].classList.contains("empty")) return;

    // check that kings, queens, and jacks go to their correct spots
    if (
      (currentCard.rank == "K" && kingIndex.includes(index)) ||
      (currentCard.rank == "Q" && queenIndex.includes(index)) ||
      (currentCard.rank == "J" && jackIndex.includes(index)) ||
      !["K", "Q", "J"].includes(currentCard.rank)
    ) {
      currentCard.indexOnBoard = index;
      board[index] = currentCard;

      // +1 score if picture card is placed
      if (["K","Q","J"].includes(currentCard.rank)) {
        score++;

        // give +4 upon completion of a royalty
        if (
          (kingIndex.every(i => board[i].rank == "K") && currentCard.rank == "K") ||
          (queenIndex.every(i => board[i].rank == "Q") && currentCard.rank == "Q") ||
          (jackIndex.every(i => board[i].rank == "J") && currentCard.rank == "J")
        ) {
          score += 4;
        }
      }

      currentCard = {};

      checkBoard();
      if (!removalPhase) drawCard();
    }

  } else {
    // removal phase

    // if the card is a 10, remove it
    if (board[index].rank == 10) {
      discardDeck.push(board[index]);
      board[index] = {};
    } else {
      // select the first card to remove and highlight it
      if (
        cardSelectedForRemoval == null &&
        !["K", "Q", "J"].includes(board[index].rank) &&
        board[index].rank != undefined
      ) {
        cardSelectedForRemoval = board[index];
        cardsDisplay[index].classList.add("selected");
      } else if (cardSelectedForRemoval != null && cardSelectedForRemoval.indexOnBoard != index) {
        // select a second card and remove both if they add up to 10
        if (cardSelectedForRemoval.rank + board[index].rank == 10) {
          discardDeck.push(cardSelectedForRemoval);
          discardDeck.push(board[index]);
          board[cardSelectedForRemoval.indexOnBoard] = {};
          board[index] = {};
        }

        cardSelectedForRemoval = null;
        for (let i = 0; i < cardsDisplay.length; i++) {
          cardsDisplay[i].classList.remove("selected");
        }
      }
    }

    checkBoard();
    if (!removalPhase) drawCard();
  }

  display();
}


function checkBoard() {
  if (
    (kingIndex.every(i => board[i].rank == "K")) &&
    (queenIndex.every(i => board[i].rank == "Q")) &&
    (jackIndex.every(i => board[i].rank == "J")) &&
    (middleIndex.every(i => board[i].rank == undefined))
  ) {
    gameState = "win";
    score += 12;
    score += deck.length + (currentCard.rank != undefined ? 1 : 0);
  }

  // check if whole board is filled, then enable the removal phase
  if (!removalPhase) removalPhase = board.every(i => i.rank != undefined);

  // check that there are no more combinations for removal
  if (removalPhase) {
    removalPhase = board.some(i => {
    for (let j = 0; j < board.length; j++) {
      if (i.indexOnBoard == board[j].indexOnBoard) return false;
      else if (i.rank + board[j].rank == 10) return true;
    }});

    if (board.some(i => i.rank == 10)) removalPhase = true;
  }
}


function undo() {
  if (previousMoves.length == 0) return;
  let lastMove = previousMoves.pop();

  board = lastMove["tBoard"];
  currentCard = lastMove["tCurrentCard"];
  deck = lastMove["tDeck"];
  discardDeck = lastMove["tDiscardDeck"];
  removalPhase = lastMove["tRemovalPhase"];
  gameState = lastMove["tGameState"];
  score = lastMove["tScore"];

  display();
}


let discardDeckHTML = document.getElementById("discardDeck");
let deckCount = document.getElementById("deckCount");
let discardCount = document.getElementById("discardCount");
let afterGameStatus = document.getElementById("game-status");
let scoreDisplay = document.getElementById("scoreDisplay");
function display() {
  // display the board to the user
  for (let i = 0; i < board.length; i++) {
    if (kingIndex.includes(i) && board[i].imgFile == undefined) cardsDisplay[i].src = kingSrc;
    else if (queenIndex.includes(i) && board[i].imgFile == undefined) cardsDisplay[i].src = queenSrc;
    else if (jackIndex.includes(i) && board[i].imgFile == undefined) cardsDisplay[i].src = jackSrc;
    else if (board[i].imgFile == undefined) cardsDisplay[i].src = cardbackSrc;
    else cardsDisplay[i].src = board[i].imgFile;

    if (board[i].rank != undefined) {
      cardsDisplay[i].classList.add("taken");
      cardsDisplay[i].classList.remove("empty");
    } else {
      cardsDisplay[i].classList.remove("taken");
      cardsDisplay[i].classList.add("empty");
    }
  }

  // don't highlight cards when it's not removal phase
  if (!removalPhase) {
    for (let i = 0; i < cardsDisplay.length; i++) {
      cardsDisplay[i].classList.remove("selected");
    }
  }


  // show the current card on top of the deck
  if (deck.length != 0 || currentCard.rank != undefined) deckDisplay.src = currentCard.imgFile;
  else deckDisplay.src = cardbackSrc;

  if (removalPhase) deckDisplay.src = cardbackSrc;

  deckCount.innerHTML = deck.length + (deck.length == 0 && currentCard.rank == undefined ? 0 : 1);

  if (discardDeck.length == 0) discardDeckHTML.src = discardDeckEmptySrc;
  if (discardDeck.length > 0) discardDeckHTML.src = discardDeck[discardDeck.length - 1].imgFile;
  discardCount.innerHTML = discardDeck.length;


  // effects for gameover
  if (gameState != undefined) {
    if (gameState == "win") {
      afterGameStatus.innerHTML = "You Win";
      afterGameStatus.style.color = "lightseagreen";
    } else if (gameState == "lose") {
      afterGameStatus.innerHTML = "You Lose";
      afterGameStatus.style.color = "crimson";
    }

    let gameOverScreen = document.getElementsByClassName("gameover")[0];
    setTimeout(() => {gameOverScreen.setAttribute("onclick", "removeMessage()")}, 1500);
    if (!animationsOff) gameOverScreen.style.transition = "opacity 2s ease-in-out";
    gameOverScreen.style.opacity = "1";
    gameOverScreen.style.visibility = "visible";

    document.body.style.backgroundColor = "rgba(255, 228, 196, 0.5)";
    document.getElementsByClassName("page")[0].style.opacity = "0.18";
  }

  scoreDisplay.innerHTML = score;
}


// functions for after game is over
function removeMessage() {
  let gameOverScreen = document.getElementsByClassName("gameover")[0];
  gameOverScreen.setAttribute("onclick", "");
  if (!animationsOff) gameOverScreen.style.transition = "opacity .8s ease-in-out";
  gameOverScreen.style.opacity = "0";
  setTimeout(() => {gameOverScreen.style.visibility = "hidden"}, (animationsOff ? 0 : 1000));

  document.body.style.backgroundColor = "rgb(255, 228, 196)";
  document.getElementsByClassName("page")[0].style.opacity = "1";
}


function cheatModeToggle() {
  cheats = !cheats;

  let cheatsButton = document.getElementById("cheats-button");
  if (cheats) {
    cheatsButton.style.backgroundColor = "lightgreen";
  } else {
    cheatsButton.style.backgroundColor = "rgba(255, 255, 255, 0.7)";
  }
}


function burnCard() {
  if (!cheats) return;

  if (!["K", "Q", "J"].includes(currentCard.rank)) {
    discardDeck.push(currentCard);
    drawCard();
  }

  display();
}


function reset() {
  deck = [];
  for (let r = 0; r < ranks.length; r++) {
    for (let s = 0; s < suits.length; s++) {
      let card = new Card(ranks[r], suits[s]);
      deck.push(card);
    }
  }

  for (let i = 0; i < deck.length; i++) {
    let rand = Math.floor(Math.random() * deck.length);
    [deck[i], deck[rand]] = [deck[rand], deck[i]];
  }

  discardDeck = [];

  board = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}];
  currentCard = {};

  removalPhase = false;
  cardSelectedForRemoval = null;

  gameState = undefined;

  score = 0;

  drawCard();
  display();
}


// start screen and animations
let startScreen = document.getElementsByClassName("startscreen")[0];
let page = document.getElementsByClassName("page")[0];
let howToPlayScreen = document.getElementsByClassName("howtoplay")[0];
let rulesContent = document.getElementsByClassName("howtoplay-content")[0];
let settingsScreen = document.getElementsByClassName("settings")[0];
let settingsContent = document.getElementsByClassName("settings-content")[0];
function showMenu() {
  if (!animationsOff) startScreen.style.transition = "opacity 2s ease-in";
  startScreen.style.visibility = "visible";
  startScreen.style.opacity = 1;

  page.style.opacity = "0";

  document.body.style.backgroundColor = "rgba(255, 228, 196, 0.5)";


  howToPlayScreen.style.visibility = "hidden";
  howToPlayScreen.style.top = "571px";

  rulesContent.style.visibility = "hidden";
  rulesContent.style.opacity = "0";

  settingsScreen.style.visibility = "hidden";
  settingsScreen.style.top = "639px";

  settingsContent.style.visibility = "hidden";
  settingsContent.style.opacity = "0";
}

function startGame() {
  page.style.visibility = "visible";
  page.style.opacity = "1";

  document.body.style.backgroundColor = "rgba(255, 228, 196)";

  setTimeout(() => {
    startScreen.style.visibility = "hidden";
  }, (animationsOff ? 0 : 1000));
  if (!animationsOff) startScreen.style.transition = "opacity 1s ease-out";
  startScreen.style.opacity = 0;

  display();
}

function showRules() {
  howToPlayScreen.style.visibility = "visible";
  howToPlayScreen.style.top = "0";

  rulesContent.style.visibility = "visible";
  setTimeout(() => {
    rulesContent.style.opacity = "1";
  }, (animationsOff ? 0 : 1250));

  startScreen.style.opacity = "0";
  startScreen.style.visibility = "hidden";
}

function showSettings() {
  settingsScreen.style.visibility = "visible";
  settingsScreen.style.top = "0";

  settingsContent.style.visibility = "visible";
  setTimeout(() => {
    settingsContent.style.opacity = "1";
  }, (animationsOff ? 0 : 1250));

  startScreen.style.opacity = "0";
  startScreen.style.visibility = "hidden";
}


let animationsOff = false;
let cheatsOn = false;

let sliderContainers = document.getElementsByClassName("slider-container");
let sliders = document.getElementsByClassName("slider");
function disableAnimations() {
  let animationsOffSlider = sliders[0];
  let container = sliderContainers[0];

  animationsOff = !animationsOff;
  localStorage.setItem("animationsOff", animationsOff);
  if (animationsOff) {
    animationsOffSlider.style.transform = "translateX(22px)";
    container.style.backgroundColor = "#0070c9";

    // turn the transitions off
    document.body.style.transition = "none";
    page.style.transition = "none";
    for (let i = 0; i < document.getElementsByClassName("overlay").length; i++) {
      document.getElementsByClassName("overlay")[i].style.transition = "none";
    }
    startScreen.style.transition = "none";
    for (let i = 0; i < document.getElementsByClassName("overlay-block").length; i++) {
      document.getElementsByClassName("overlay-block")[i].style.transition = "none";
    }
    howToPlayScreen.style.transition = "none";
    rulesContent.style.transition = "none";
    settingsScreen.style.transition = "none";
    settingsContent.style.transition = "none";
  } else {
    animationsOffSlider.style.transform = "translateX(0)";
    container.style.backgroundColor = "#ccc";

    // turn the transitions back on
    document.body.style.transition = "background-color 1s ease-in-out";
    page.style.transition = "opacity 1s ease-in-out";
    for (let i = 0; i < document.getElementsByClassName("overlay").length; i++) {
      document.getElementsByClassName("overlay")[i].style.transition = "opacity 2s ease-in-out";
    }
    startScreen.style.transition = "opacity 2s ease-in";
    for (let i = 0; i < document.getElementsByClassName("overlay-block").length; i++) {
      document.getElementsByClassName("overlay-block")[i].style.transition = "background-color 0.2s ease-in-out";
    }
    howToPlayScreen.style.transition = "top 1.25s ease-out";
    rulesContent.style.transition = "opacity 1s ease-in-out";
    settingsScreen.style.transition = "top 1.25s ease-out";
    settingsContent.style.transition = "opacity 1s ease-in-out";
  }
}

function enableCheats() {
  let cheatsOnSlider = sliders[1];
  let container = sliderContainers[1];

  let cheatsButton = document.getElementById("cheats-button");

  cheatsOn = !cheatsOn;
  localStorage.setItem("cheatsOn", cheatsOn);
  if (cheatsOn) {
    cheatsOnSlider.style.transform = "translateX(22px)";
    container.style.backgroundColor = "#0070c9";
    cheatsButton.style.visibility = "visible";
  } else {
    cheatsOnSlider.style.transform = "translateX(0)";
    container.style.backgroundColor = "#ccc";
    cheatsButton.style.visibility = "hidden";
  }
}

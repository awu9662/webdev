function initialize() {
  cardBackSrc = "img/cardback.png";

  cardsHTML = [
    document.getElementById("card1"),
    document.getElementById("card2"),
    document.getElementById("card3"),
    document.getElementById("card4"),

    document.getElementById("card5"),
    document.getElementById("card6"),
    document.getElementById("card7"),
    document.getElementById("card8"),

    document.getElementById("card9"),
    document.getElementById("card10"),
    document.getElementById("card11"),
    document.getElementById("card12"),

    document.getElementById("card13"),
    document.getElementById("card14"),
    document.getElementById("card15"),
    document.getElementById("card16")
  ];

  scoreDisplay = document.getElementById("scoreDisplay");
  messages = document.getElementById("messages");
  currentMessage = "Waiting for your next move..."; // current message that the computer will say

  instructionsText = document.getElementById("instruction-text");
  instructionsToggle = false; // toggle the instructions text on or off

  // randomize each card
  cardSrcs = [
    "img/cardA.png",
    "img/cardA.png",
    "img/cardB.png",
    "img/cardB.png",
    "img/cardC.png",
    "img/cardC.png",
    "img/cardD.png",
    "img/cardD.png",
    "img/cardE.png",
    "img/cardE.png",
    "img/cardF.png",
    "img/cardF.png",
    "img/cardG.png",
    "img/cardG.png",
    "img/cardH.png",
    "img/cardH.png"
  ];

  for (var i = 0; i < cardSrcs.length; i++) {
    var randomIndex = Math.floor(Math.random() * 16);
    var temp = cardSrcs[i];
    cardSrcs[i] = cardSrcs[randomIndex];
    cardSrcs[randomIndex] = temp;
  }

  /* list is used to check for what cards to flip or unflip;
  0 for not flipped; 1 for is flipped; 2 for flipped and matching pair found */
  cardsFlipped = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  currentImagesFlipped = 0;

  // keep track of which cards are flipped
  firstFlippedCard = -1;
  secondFlippedCard = -1;

  score = 0;
  gameOver = false;

  display();
}

function flipCard(cardNum) {
  /* keep two images flipped at most and
  turn over the others ones when a third is pressed
  unless the image has a match */
  if (currentImagesFlipped == 2) {
    for (var i = 0; i < cardsFlipped.length; i++) {
      if (cardsFlipped[i] != 2) cardsFlipped[i] = 0;
    }

    currentImagesFlipped = 0;
    firstFlippedCard = -1;
    secondFlippedCard = -1;
  }

  var flippedAnImage = false;

  // prevent clicking the same card
  if (firstFlippedCard != cardNum) {
    if (cardsFlipped[cardNum] == 0) {
      cardsFlipped[cardNum] = 1;
      flippedAnImage = true;
    }
  }

  if (currentImagesFlipped == 0) firstFlippedCard = cardNum;
  if (currentImagesFlipped == 1) secondFlippedCard = cardNum;

  if (flippedAnImage) {
    score += 1;
    currentImagesFlipped += 1;
    currentMessage = "Waiting for your next move..."; // get rid of current message if player clicks another card
    messages.style.color = "#A52A2A";
  }

  if (currentImagesFlipped == 2) checkCardMatches();

  display();
}

function checkCardMatches() {
  /* Check if the card sources are the same; if so, then they match */
  if (cardSrcs[firstFlippedCard] == cardSrcs[secondFlippedCard]) {
    cardsFlipped[firstFlippedCard] = 2;
    cardsFlipped[secondFlippedCard] = 2;

    cardsHTML[firstFlippedCard].classList.remove("unflipped");
    cardsHTML[secondFlippedCard].classList.remove("unflipped");

    var foundMatchingPair = true;
  }

  // check if every card matches, and if so, the player wins
  var totalCardFlipped = 0;
  for (var i = 0; i < cardsFlipped.length; i++) {
    if (cardsFlipped[i] == 2) totalCardFlipped += 1;
    else break;
  }

  // say special comments if player finds a matching pair
  if (foundMatchingPair) sayComment((foundMatch = true));
  else sayComment((foundMatch = false));

  if (totalCardFlipped == 16) gameOver = true;

  display();
}

function sayComment(foundMatch) {
  var greatMessages = [
    "Great job!",
    "Spectacular!",
    "Marvelous!"
  ];

  var goodMessages = [
    "Keep going!",
    "You got this!",
    "I have great expectations of you."
  ];

  var okayMessages = [
    "You can do it!",
    '"In the middle of every difficulty lies opportunity." - Einstein',
    "Bring out your best!"
  ];

  var badMessages = [
    "It's taking quite some time.",
    "This is like watching paint dry.",
    "Can I go home now?",
    "Any second now..."
  ];

  if (score <= 40 && foundMatch) {
    currentMessage = greatMessages[Math.floor(Math.random() * greatMessages.length)];
  } else if (score <= 16) {
    currentMessage = goodMessages[Math.floor(Math.random() * goodMessages.length)];
  } else if (score <= 40) {
    currentMessage = okayMessages[Math.floor(Math.random() * okayMessages.length)];
  } else {
    if (score >= 75) currentMessage = "One eternity later...";
    else currentMessage = badMessages[Math.floor(Math.random() * badMessages.length)];
  }

  messages.style.color = "#00a86b";
}

function reset() {
  cardSrcs = [
    "img/cardA.png",
    "img/cardA.png",
    "img/cardB.png",
    "img/cardB.png",
    "img/cardC.png",
    "img/cardC.png",
    "img/cardD.png",
    "img/cardD.png",
    "img/cardE.png",
    "img/cardE.png",
    "img/cardF.png",
    "img/cardF.png",
    "img/cardG.png",
    "img/cardG.png",
    "img/cardH.png",
    "img/cardH.png"
  ];

  for (var i = 0; i < cardSrcs.length; i++) {
    var randomIndex = Math.floor(Math.random() * 16);
    var temp = cardSrcs[i];
    cardSrcs[i] = cardSrcs[randomIndex];
    cardSrcs[randomIndex] = temp;
  }

  // add the 'unflipped' class back to each card element
  for (var i = 0; i < cardsHTML.length; i++) {
    cardsHTML[i].classList.add("unflipped");
  }

  cardsFlipped = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  currentImagesFlipped = 0;

  firstFlippedCard = -1;
  secondFlippedCard = -1;

  score = 0;
  gameOver = false;

  currentMessage = "Waiting for your next move...";
  messages.style.color = "#A52A2A";

  display();
}

function display() {
  // using the cardsFlipped list, decide if the card is flipped or unflipped
  for (var i = 0; i < cardsFlipped.length; i++) {
    if (cardsFlipped[i] == 1 || cardsFlipped[i] == 2) {
      cardsHTML[i].src = cardSrcs[i];
    } else {
      cardsHTML[i].src = cardBackSrc;
    }
  }

  scoreDisplay.innerHTML = score;

  if (score <= 40) scoreDisplay.style.color = "#00a86b";
  else if (score <= 50) scoreDisplay.style.color = "#fcd116";
  else scoreDisplay.style.color = "red"

  if (gameOver) {
    var extra = "";
    if (score == 16) extra = "Perfect game!";
    else if (score <= 40) extra = "Not bad!";
    else if (score > 40) extra = "Took you long enough.";

    messages.innerHTML = "You win! " + extra;
  } else {
    messages.innerHTML = currentMessage;
  }
}

function win() {
  gameOver = true;
  display();
}

function displayInstructions() {
  instructionsToggle = !instructionsToggle;

  if (instructionsToggle) {
    instructionsText.style.display = "inline";
  } else {
    instructionsText.style.display = "none";
  }
}

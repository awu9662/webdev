const JACK = 11, QUEEN = 12, KING = 13, ACE = 1;
const CLUB = 0, DIAMOND = 1, HEART = 2, SPADE = 3;
const TOP_DECK = 0;


function Card(rank, suit, imgFile)
{
  this.rank = rank;
  this.suit = suit;
  this.imageFileName = imgFile;
}


function generateStandardDeck()
{
  var deck = new CardDeck();

  for (var r = ACE; r < KING + 1; r++)
  {
    for (var s = CLUB; s < SPADE + 1; s++)
    {
      deck.push(new Card(r, s, `${r}-${s}.png`));
    }
  }

  return deck;
}


function CardDeck()
{
  this.deck = [];
}

CardDeck.prototype = Array.prototype;

CardDeck.prototype.shuffleDeck = function()
{
  var tmpDeck = new CardDeck();

  while (this.length > 0)
  {
    var tmpCard = this.splice(getRandomInteger(0, this.length - 1), 1)[0];
    tmpDeck.push(tmpCard);
  }

  this.push.apply(this, tmpDeck);
}

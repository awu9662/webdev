function getRandomInteger(lower, upper) {
  var multiplier = upper - lower + 1;
  var rnd = parseInt(Math.random() * multiplier + lower);

  return rnd;
}

function getRandomInteger2(lower, upper) {
  return Math.floor(Math.random() * (upper - lower + 1) + lower + 1);
}

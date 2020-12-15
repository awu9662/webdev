function countDuplicates(array, item) {
  /* return the number of times 'item' appears in 'array' */
  var itemCount = 0;

  for (var i = 0; i < array.length; i++) {
    if (array[i] == item) itemCount++;
  }

  return itemCount;
}

function indexesOf(array, item) {
  /* return a list of indices in which 'item' appears in 'array' */
  var indexList = [];

  for (var i = 0; i < array.length; i++) {
    if (array[i] == item) indexList.push(i);
  }

  return indexList;
}

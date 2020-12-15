var productImage = document.getElementById("product-image");
var imgNumber = document.getElementById("image-number");

var productImagesSrc = ['img/macpro.jpg', 'img/cheesegrater.jpg', 'img/macpro2.jpg'];
var imgIndex = 0;
var imgFading = false; // var used to make a fade in out effect for image number

// used to determine the number of stars to highlight for writing reviews
var starsIndex = 0;

var originalPrice = 5999.99;

var cheeseCoresPrices = [0, 1000, 2000, 6000, 8000, 21000];
var currentCheeseCorePrice = 0;
var priceToCore = {
  0: "6 cores",
  1000: "12 cores",
  2000: "18 cores",
  6000: "24 cores",
  8000: "32 cores",
  21000: "64 cores"
}

var memoryPrices = [0, 400, 800, 2500, 5000, 10000, 20000];
var currentMemoryPrice = 0;
var priceToMemory = {
  0: "16GB",
  400: "32GB",
  800: "64GB",
  2500: "128GB",
  5000: "256GB",
  10000: "512GB",
  20000: "1024GB"
}

var storagePrices = [0, 400, 1000, 2100, 3400, 10000, 20000];
var currentStoragePrice = 0;
var priceToStorage = {
  0: "8KG",
  400: "16KG",
  1000: "64KG",
  2100: "128KG",
  3400: "512KG",
  10000: "1000KG",
  20000: "2000KG"
}

// only 2 choices for configuring wheels
var wheelPrices = [0, 400];
var currentWheelsPrice = 0;


// set cartItems equal to the cart in localStorage if there is one
var cartItems;
if (window.localStorage.getItem("cartItems") != null) {
  cartItems = JSON.parse(window.localStorage.getItem("cartItems"));
} else {
  cartItems = [];
}

var imageGalleryVisible = false;

// var to toggle the cart
var showCartOrNot = false;

function showImageGallery() {
  var imageGallery = document.getElementsByClassName("image-gallery")[0];
  imageGalleryVisible = !imageGalleryVisible;
  if (imageGalleryVisible) {
    imageGallery.style.visibility = "visible";
  } else {
    imageGallery.style.visibility = "hidden";
  }
}

function nextImage(increment) {
  // prevent non existant indices of the image list
  if (increment == 1 && ((imgIndex + 1) < productImagesSrc.length))
    imgIndex++;
  else if (increment == -1 && (imgIndex - 1) >= 0)
    imgIndex--;
  else if (imgIndex + increment == productImagesSrc.length)
    // reset back to the first image if index is beyond the total number of images
    imgIndex = 0;
  else if (imgIndex + increment == -1)
    imgIndex = productImagesSrc.length - 1;

  imgNumber.style.opacity = "1";
  display();

  if (!imgFading) {
    imgFading = true;
    setTimeout(() => {
      imgNumber.style.opacity = "0"; imgFading = false;
    }, 3000);
  }

}

function selectButton(categoryNumber, buttonNumber) {
  // used to update the price according to the selected config
  var allButtons = document.getElementsByClassName("buttons")[categoryNumber].children;

  // record the price of the selected configuration
  if (categoryNumber == 0) {
    currentCheeseCorePrice = cheeseCoresPrices[buttonNumber];
  } else if (categoryNumber == 1) {
    currentMemoryPrice = memoryPrices[buttonNumber];
  } else if (categoryNumber == 2) {
    currentStoragePrice = storagePrices[buttonNumber];
  } else if (categoryNumber == 3) {
    currentWheelsPrice = wheelPrices[buttonNumber];
  }

  for (var i = 0; i < allButtons.length; i++) {
    allButtons[i].classList.remove('current-config');
  }
  allButtons[buttonNumber].classList.add('current-config');

  display();
}

function addToCart() {
  var currentItem = {
    cores: priceToCore[currentCheeseCorePrice],
    memory: priceToMemory[currentMemoryPrice],
    storage: priceToStorage[currentStoragePrice],
    wheels: ((currentWheelsPrice == 0) ? false : true),
    price: originalPrice + currentCheeseCorePrice + currentMemoryPrice + currentStoragePrice + currentWheelsPrice
  }
  cartItems.push(currentItem);

  // add to localStorage
  window.localStorage.setItem("cartItems", JSON.stringify(cartItems));

  display();
}

function removeCartItem(index) {
  cartItems.splice(index, 1);
  window.localStorage.setItem("cartItems", JSON.stringify(cartItems));

  // remove from cart display
  var cartDisplay = document.getElementsByClassName("cart-item-display")[0];
  var collapsible = document.getElementsByClassName("collapsible")[index];
  var content = document.getElementsByClassName("content")[index];
  cartDisplay.removeChild(collapsible);
  cartDisplay.removeChild(content);

  display();
}

function composeReview(showReview) {
  var reviewPopup = document.getElementsByClassName("review-popup")[0];

  if (showReview) reviewPopup.style.visibility = "visible";
  else reviewPopup.style.visibility = "hidden";
}

function lightUpStarsInReview(onOrOff, index) {
  var allStars = document.getElementById("reviewFormRating").children; // list of the 5 stars

  // show changes in the stars when hovering
  for (var i = 0; i < allStars.length; i++) {
    allStars[i].src = "img/white_star.png";
  }

  if (onOrOff == "on") {
    for (var i = 0; i < index + 1; i++) {
      allStars[i].src = "img/gold_star.png";
    }
  } else {
    for (var i = 0; i < allStars.length; i++) {
      allStars[i].src = "img/white_star.png";
    }
    display();
  }
}

function clickedOnStars(index) {
  starsIndex = index;
  display();
}

function submitReview() {
  var form = document.getElementById("review-form");
  var name = form.name.value.trim();
  var title = form.title.value.trim();
  var descrip = form.description.value.trim();

  var validForm = true;

  // highlight box if is empty
  var nameForm = document.getElementById("name");
  if (name == "") {
    validForm = false;
    nameForm.style.border = "1px solid red";
    nameForm.style.backgroundColor = "rgba(255, 0, 0, 0.10)";
  } else {
    nameForm.style.border = "1px solid #a6a6a6";
    nameForm.style.backgroundColor = "";
  }

  var titleForm = document.getElementById("title");
  if (title == "") {
    validForm = false;
    titleForm.style.border = "1px solid red";
    titleForm.style.backgroundColor = "rgba(255, 0, 0, 0.10)";
  } else {
    titleForm.style.border = "1px solid #a6a6a6";
    titleForm.style.backgroundColor = "";
  }

  var descripForm = document.getElementById("description");
  if (descrip == "") {
    validForm = false;
    descripForm.style.border = "1px solid red";
    descripForm.style.backgroundColor = "rgba(255, 0, 0, 0.10)";
  } else {
    descripForm.style.border = "1px solid #a6a6a6";
    descripForm.style.backgroundColor = "";
  }

  if (validForm) {
    reviewsData.push(name + ";" + (starsIndex + 1) + ";" + title + ";" + descrip);

    form.name.value = "";
    form.title.value = "";
    form.description.value = "";

    starsIndex = 0;

    document.getElementsByClassName("review-popup")[0].style.visibility = "hidden";
    displayReviews();

    var thanks = document.getElementsByClassName("thankyou-popup")[0];
    thanks.style.visibility = "visible";

    setTimeout(() => {
      thanks.style.visibility = "hidden";
    }, 2000);
  }
}

function displayReviews() {
  var reviewsContainer = document.getElementById("all-reviews");
  reviewsContainer.innerHTML = "";

  // reviewsData is from datafile.js
  for (var i = 0; i < reviewsData.length; i++) {
    // create div for each review
    var currentDiv = document.createElement("div");
    reviewsContainer.appendChild(currentDiv);

    var currentData = reviewsData[i].split(";");

    var title = document.createElement("div");
    title.classList.add("review-title");

    var profilePic = document.createElement("img");
    profilePic.classList.add("review-profile-picture")
    profilePic.src = "img/profile_picture.jpg";
    title.appendChild(profilePic);

    var name = currentData[0];
    var nameSpan = document.createElement("span");
    nameSpan.classList.add("review-name");
    nameSpan.innerHTML = name;

    title.appendChild(nameSpan);
    title.innerHTML += "<span style='font-weight: normal'> - </span>" + currentData[2];
    currentDiv.appendChild(title);

    // create stars
    for (var j = 0; j < currentData[1]; j++) {
      var star = document.createElement('img');
      star.classList.add("review-star");
      star.src = "img/gold_star.png";
      currentDiv.appendChild(star);
    }
    // add white stars so it totals 5
    for (var j = 0; j < 5 - currentData[1]; j++) {
      var star = document.createElement('img');
      star.classList.add("review-star");
      star.src = "img/white_star.png";
      currentDiv.appendChild(star);
    }

    var text = document.createElement("div");
    text.classList.add("review-text");
    text.innerHTML = currentData[3];
    currentDiv.appendChild(text);
  }
}

function showCart() {
  var cart = document.getElementsByClassName("cart-display")[0];

  showCartOrNot = !showCartOrNot;
  if (showCartOrNot) {
    cart.style.visibility = "visible";
  } else {
    cart.style.visibility = "hidden";
  }
}

function buyCartItems() {
  cartItems = [];
  window.localStorage.setItem("cartItems", JSON.stringify(cartItems));
  display();
}

function display() {
  // image gallery
  productImage.src = productImagesSrc[imgIndex];
  imgNumber.innerHTML = (imgIndex + 1) + " / " + productImagesSrc.length;

  // display config prices
  var everything = document.getElementsByClassName("buttons");
  // change to everything.length later from 1
  for (var i = 0; i < everything.length; i++) {

    var category = everything[i].children;

    // loop through each of the spans in the buttons

    if (i == 0) { // cores config
      for (var j = 0; j < category.length; j++) {
        var current = category[j].children[0];
        var currentPrice = (cheeseCoresPrices[j] - currentCheeseCorePrice);

        if (currentPrice > 0) current.innerHTML = "+ $" + currentPrice.toString();
        else current.innerHTML = "- $" + Math.abs(currentPrice).toString();
      }
    } else if (i == 1) { // memory config
      for (var j = 0; j < category.length; j++) {
        var current = category[j].children[0];
        var currentPrice = (memoryPrices[j] - currentMemoryPrice);

        if (currentPrice > 0) current.innerHTML = "+ $" + currentPrice.toString();
        else current.innerHTML = "- $" + Math.abs(currentPrice).toString();
      }
    } else if (i == 2) { // storage config
      for (var j = 0; j < category.length; j++) {
        var current = category[j].children[0];
        var currentPrice = (storagePrices[j] - currentStoragePrice);

        if (currentPrice > 0) current.innerHTML = "+ $" + currentPrice.toString();
        else current.innerHTML = "- $" + Math.abs(currentPrice).toString();
      }
    } else if (i == 3) { // wheels
      for (var j = 0; j < category.length; j++) {
        var current = category[j].children[0];
        var currentPrice = (wheelPrices[j] - currentWheelsPrice);

        if (currentPrice > 0) current.innerHTML = "+ $" + currentPrice.toString();
        else current.innerHTML = "- $" + Math.abs(currentPrice).toString();
      }
    }
  }

  var totalPrice = originalPrice + currentCheeseCorePrice + currentMemoryPrice + currentStoragePrice + currentWheelsPrice;
  document.querySelector(".purchase-price").innerHTML = "$" + totalPrice.toFixed(2).toString();

  // stars in the compose review
  var allStars = document.getElementById("reviewFormRating").children; // list of the 5 stars
  for (var i = 0; i < starsIndex + 1; i++) {
    allStars[i].src = "img/gold_star.png";
  }
  for (var j = starsIndex + 1; j < 5; j++) {
    allStars[j].src = "img/white_star.png";
  }

  // topnav number that shows the number of items in the cart
  document.getElementById("cart-number").innerHTML = cartItems.length;

  var cartDisplay = document.getElementsByClassName("cart-item-display")[0];
  cartDisplay.innerHTML = "";
  for (var i = 0; i < cartItems.length; i++) {
    var collapsible = document.createElement("div");
    collapsible.classList.add("collapsible");
    var clickable = document.createElement('div');
    clickable.classList.add("clickable");
    clickable.setAttribute("onclick", `toggleCollapsible(${i});`)
    clickable.innerHTML = "<span class='collapsible-triangle'>&#x25B8;</span> Cheese Grater Pro - $" + cartItems[i]["price"].toFixed(2) + `<span class="remove-button" onclick="removeCartItem(${i});";><img src="img/x_button.png" alt=""></span>`;
    collapsible.appendChild(clickable);

    var content = document.createElement("div");
    content.classList.add("content");

    var content = document.createElement("div");
    content.classList.add("content");
    var uList = document.createElement("ul");
    var cores = document.createElement("li");
    cores.innerHTML = cartItems[i]["cores"];
    var memory = document.createElement("li");
    memory.innerHTML = cartItems[i]["memory"] + " Memory";
    var storage = document.createElement("li");
    storage.innerHTML = cartItems[i]["storage"] + " Storage";
    var wheels = document.createElement("li");
    wheels.innerHTML = (cartItems[i]["wheels"] ? "With wheels" : "No wheels");

    uList.appendChild(cores);
    uList.appendChild(memory);
    uList.appendChild(storage);
    uList.appendChild(wheels);

    content.appendChild(uList);

    cartDisplay.appendChild(collapsible);
    cartDisplay.appendChild(content);
  }

  // display price of everything
  var priceOfAll = 0;
  for (var i = 0; i < cartItems.length; i++) {
    priceOfAll += cartItems[i].price;
  }
  var cartTotalPrice = document.getElementById("cart-total-price");
  cartTotalPrice.innerHTML = "$" + priceOfAll.toFixed(2).toString();
}

function toggleCollapsible(index) {
  var triangle = document.getElementsByClassName("collapsible-triangle")[index];
  var content = document.getElementsByClassName("content")[index];
  if (content.style.maxHeight == "" || content.style.maxHeight == "0px") {
    content.style.maxHeight = content.scrollHeight + "px";
    triangle.innerHTML = "&#9662";
  }
  else {
    content.style.maxHeight = "0px";
    triangle.innerHTML = "&#x25B8;";
  }
}

display();

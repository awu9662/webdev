function loadPage() {
  setTimeout(showMenu, 500);
  drawCard();

  let tAnimationsOff = localStorage.getItem("animationsOff");
  if (!(tAnimationsOff == null)) {
    animationsOff = tAnimationsOff;
    // run this twice because the turning it off/on is in the function
    disableAnimations(); disableAnimations();
  }

  let tCheatsOn = localStorage.getItem("cheatsOn");
  if (!(tCheatsOn == null)) {
    cheatsOn = tCheatsOn;
    // run this twice because the turning it off/on is in the function
    enableCheats(); enableCheats();
  }
}

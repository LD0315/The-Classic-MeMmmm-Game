
// css class for different card image
const CARD_TECHS = [
  'html5',
  'css3',
  'js',
  'sass',
  'nodejs',
  'react',
  'linkedin',
  'heroku',
  'github',
  'aws'
];

// only list out some of the properties,
// add more when needed
const game = {
  score: 0,
  timer: 60,
  level: 1,
  preSelected: null,
  checkMatching: false,
  timerDisplay: null,
  scoreDisplay: null,
  levelDisplay: null,
  timerInterval: null,
  startButton: null,
  endButton: null,
  gameBoard: null,
  totalCards: 0,
  clearedCards: 0,
  gameOver: false
  // and much more
};

setGame();


/*******************************************
/     game process
/******************************************/
function setGame() {
  // register any element in your game object
  game.gameBoard = document.querySelector('.game-board');
  game.timerDisplay = document.querySelector('.game-timer__bar');
  game.scoreDisplay = document.querySelector('.game-stats__score--value');
  game.levelDisplay = document.querySelector('.game-stats__level--value');
  game.startButton = document.querySelector('.game-stats__button');
  bindStartButton();
  game.gameOver = true;
}

function startGame() {
  // reset game
  game.levelDisplay.innerHTML = game.level;
  game.scoreDisplay.innerHTML = game.score;

  clearGameBoard();
  game.startButton.innerHTML = 'End Game';
  // init game
  game.checkMatching = false;
  
  game.level = 1;
  game.score = 0;
  game.timer = 60;
  game.preSelected = null;
  game.clearedCards = 0;
  game.totalCards = 0;
  pickCards();
  createCards();
  bindCardClick();
  startTimer();
  
  //handleCardFlip();
}

function createCards(){ 
const techData = CARD_TECHS[Math.floor(Math.random() * CARD_TECHS.length)];

      const card = document.createElement("div");
      const cardFront = document.createElement("div");
      const cardBack = document.createElement("div"); 
      card.classList.add('card', techData);
      cardFront.classList.add('card__face');
      cardFront.classList.add('card__face--front');
      cardBack.classList.add('card__face');
      cardBack.classList.add('card__face--back');
      card.setAttribute("data-tech", techData);
      card.appendChild(cardFront);
      card.appendChild(cardBack);
      console.log(card);
      return card;
}

function pickCards(){
  // set up gameboard
  // const gameBoard = document.querySelector(".game-board");
  const gameBoard = game.gameBoard;
  gameBoard.setAttribute("style", `grid-template-columns: repeat(${game.level * 2}, 1fr);`);
  //gameBoard.style['grid-template-columns'] = `repeat(${gameSize}, 1fr)`;
  //gameBoard.innerHTML = ""; 
  const cards = [];
  let cardPairs = (game.level*2)**2/2;
  for (let i = 0; i < cardPairs; i++){
    const card = createCards(); 
    cards.push(card);
    cards.unshift(card.cloneNode(true));
    console.log("!!!!!!!!!!!!!!!!!!!!!!!!");
    console.log(cards.length);
    //bindCardClick();
    //handleCardFlip();
  }

  while (cards.length > 0) {
    const index = Math.floor(Math.random() * cards.length);
    const card = cards.splice(index, 1)[0];
    gameBoard.appendChild(card);
    //handleCardFlip();

  }
}

/*
function shuffleCards(cardArr){
  let length = cardsArr.length;
  while(length !== 0){
    const randomIndex = Math.floor(Math.random()*CARD_TECHS.length);
    const currentIndex = length-1;
    temp = cardArr[currentIndex];
    cardsArr[currentIndex] = cardsArr[randomIndex];
    cardsArr[randomI] = temp;
    length--;
  }
  return cardArr;
}
*/

function nextLevel(){
  // level 4 is the end;
  if (game.level === 3) {
    handleGameOver();
    return;
  }
  // clear current game board
  clearGameBoard();
  // unBindCardClick();

  game.level++;
  game.levelDisplay.innerHTML = game.level;
  game.clearedCards = 0;
  game.totalCards = 0;

  pickCards();
  startTimer();
  bindCardClick();
}

function handleGameOver() {
  //game.startButton.innerHTML = 'Start Game';
  clearInterval(game.timerInterval);
  game.gameOver = true;
  //alert('Congratulations, your score is ' + game.score);
  }



/*******************************************
/     UI update
/******************************************/
function updateScore() {
  const score = game.level * game.level * game.timer;
  game.score += score;
  game.scoreDisplay.innerHTML = game.score;
} 
 

function updateTimerDisplay() {
  game.timerDisplay.innerHTML = `${game.timer}s`;
  //console.log(game.timer);
  const percentage = (game.timer / 60) * 100;
  game.timerDisplay.style.width = percentage + '%';
}

function stopTimer() {
  clearInterval(game.timerInterval);
  game.timerInterval = null;
}

function startTimer() {
  if (game.timerInterval) {
    stopTimer();
  }
  game.timer = 60;
  updateTimerDisplay();
  game.timerInterval = setInterval(() => {
    game.timer--;
    updateTimerDisplay();
    if (game.timer === 0) {
      handleGameOver();
    }
  }, 1000);
}

/*******************************************
/     bindings
/******************************************/

function bindStartButton() {
  game.startButton.addEventListener("click",() => {
  // end game
  console.log("game", game.gameOver);
  if (game.gameOver) {
    startGame();
    //bindCardClick();
    //game.startButton.innerHTML = "End Game";
  } else {
    handleGameOver();
  }
})
}

function bindCardClick() {
  const cards = document.querySelectorAll('.card');
  console.log("click: KKKKKKKKKKKKKKKKKKKKKKKKKK");
  cards.forEach(card => {
    card.addEventListener('click', handleCardFlip());
  });
}

function unBindCardClick(card) {
  card.removeEventListener('click', handleCardFlip());
}


function handleCardFlip() {
  console.log("test !!!!!!!!!!!!");
  if (game.checkMatching || game.gameOver) {
    return;
  }
  // understand why this === card element, you can also pass a card element param in
  console.log("this",this);
  const currentSelected = this;
  
  // check if same card
  if (currentSelected === game.preSelected) {
    currentSelected.classList.remove('card--flipped');
    game.preSelected = null;
    return;
  }
  
  currentSelected.classList.add('card--flipped');
  //console.log("game.preSelected");
  // check if preselected already
  if (game.preSelected) {
    // check match
    console.log("#######################");
    checkCardMatching(currentSelected, game.preSelected);
    return;
  }
  game.preSelected = currentSelected;
}

function checkCardMatching(card1, card2) {
  if (card1.dataset.techData === card2.dataset.techData) {
    unBindCardClick(card1);
    unBindCardClick(card2);
    console.log("???????????????????????????");
    game.preSelected = null;
    game.clearedCards += 2;
    updateScore();

    if (game.clearedCards === game.totalCards) {
      stopTimer();
      setTimeout(() => nextLevel(), 1500);
    }
  } else {
    game.checkMatching = true;
    setTimeout(() => {
      card1.classList.remove('card--flipped');
      card2.classList.remove('card--flipped');
      game.preSelected = null;
      game.checkMatching = false;
    }, 1000);
  }
}

/*
function handleCardClick(){
  // penalty if two cards are not the same 
  if (game.checkMatching){
    return;
  }
  // add flipped function to current card
  this.classList.add('card--flipped');
  const currentSelected = this;
  
  // check if this is the second card
  if (game.preSelected){

  // click on the same card
  if (currentSelected === game.preSelected){
    currentSelected.classList.remove('card--flipped');
    game.preSelected = null;
    return;
  }
  // match
  if(game.preSelected.dataset.tech === currentSelected.dataset.tech){
    unBindCardClick(game.preSelected);
    unBindCardClick(currentSelected);
    game.preSelected = null;

    if (game.clearedCards === game.totalCards) {
      stopTimer();
      setTimeout(() => nextLevel(), 1500);
    }
  }
  

  // not match
  // display card for 1.5 sec
  game.checkMatching = true;
  setTimeout(()=>{
    currentSelected.classList.remove('card--flipped');
    game.preSelected.classList.remove('card--flipped');
    game.preSelected = null;
    game.checkMatching = false;
    }, 1000);
  return;

}
//if haven't pick second card yet
game.preSelected = currentSelected;
}
*/

function clearGameBoard() {
  const { gameBoard } = game;
  // remove existing click hander and remove node
  while (gameBoard.firstChild) {
    gameBoard.firstChild.removeEventListener('click', handleCardFlip());
    gameBoard.removeChild(gameBoard.firstChild);
  }
}





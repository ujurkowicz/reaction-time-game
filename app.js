const gameBoard = document.querySelector('#game-board');
const instruction = document.querySelector('.aside .trigger');
const counter = document.querySelector('.counter');
const timer = document.querySelector('.timer');
const input = document.querySelector('input[type="text"');
const resultsBtn = document.querySelector('#results-btn');
let balloons;
const levels = ['Easy', 'Medium', 'Hard'];
///const modes = ['Time', 'Click'];
const TIME = 30000;
const CLICKS = 10;
const minFreq = 600; //min frequenzy of showing up balloon
const maxFreq = 1200; //max frequenzy of showing up balloon
const TOP = 10; //number of users to display in result table
let users = JSON.parse(localStorage.getItem('users')) || [];
let reactionTimes = [];
let level;
let mode;
let lastBox;
let ableToClick = true;
let score = 0;
let time = { min: 0, sec: 0 }
let startReactionTime;
let gameActive; //condition of game over
let counterActive;

//game
function startGame(e) {
    e.preventDefault();
    const id = '_' + Math.random().toString(36).substr(2, 9);
    users.push(user = {
        id,
        name: input.value,
        score: 0,
        level,
        mode
    });
    localStorage.setItem('users', JSON.stringify(users));
    gameBoard.innerHTML = '';
    instruction.classList.add('hidden');
    displayGameboard();
    displayWarningBeforeStart();
    update();
}
//display time left ot start
function displayWarningBeforeStart(){
    const timeBeforeStart = document.createElement('p');
    timeBeforeStart.setAttribute('id', 'time-before-start');
    gameBoard.appendChild(timeBeforeStart);
    let i = 3;
    timeBeforeStart.textContent = `${i}`;
    let timeLeft = setInterval(() => {
        i--;
        timeBeforeStart.textContent = `${i}`;
        if (i == 0) {
            timeBeforeStart.remove();
            clearInterval(timeLeft);
        }
    }, 1000);
}
//add gameboard suitable to level
function displayGameboard() {
    counter.textContent = `Score: ${score}`;
    if (mode == 'Time') timer.textContent = `00 : ${TIME/1000}`;
    else timer.textContent = `00 : 00`;
    let size = {};
    switch (level) {
        case 'Easy':
            size.width = 2;
            size.height = 2;
            break;
        case 'Medium':
            size.width = 3;
            size.height = 3;
            break;
        case 'Hard':
            size.width = 4;
            size.height = 3;
            break;
        default:
            alert('Error while choosing level');
            break;
    }
    for (j = 0; j < size.height; j++) {
        let flex = document.createElement('div');
        flex.setAttribute('class', `flex`);
        gameBoard.appendChild(flex);
    for (i = 0; i < size.width; i++) {
        let box = document.createElement('div');
        box.setAttribute('class', 'box');
        let balloon = document.createElement('div');
        balloon.setAttribute('class', 'balloon');
        box.appendChild(balloon);
        flex.appendChild(box);
        }
    }
    balloons = document.querySelectorAll('.balloon');
}

function update() {
    setTimeout(() => { //delay cause of counting 3 seconds before start
        gameActive = setInterval(() => {
            checkEndGame();
            showUp();
        }, maxFreq + 400);
    }, 1400);
    setTimeout(() => {
        counterActive = setInterval(() => {
            checkEndGame();
            if (gameActive) countTime();
        }, 1000);
    }, 3000)
}

// displaying one balloon
function showUp() {
    //random time
    let timeBreak = Math.floor(Math.random() * (maxFreq - minFreq)) + minFreq;
    const box = randomBox();
    box.classList.add('up');
    //start measure reaction time
    startReactionTime = new Date();
    ableToClick = true;
    const balloon = box.querySelector('.balloon');
    balloon.addEventListener('transitionend', randomBalloonColor(balloon));
    //remove class after while
    setTimeout(() => {
        box.classList.remove('up');
    }, timeBreak);
}
//random color for balloon
function randomBalloonColor(balloon) {
    const balloonsBackground = ['balloon-b.svg', 'balloon-g.svg', 'balloon-p.svg'];
    let index = Math.floor(Math.random() * balloonsBackground.length)
    balloon.style.setProperty('background-image', `url(img/${balloonsBackground[index]}`);
    if (index == 2) balloon.classList.add('pink')
    else if (balloon.classList.contains('pink')) balloon.classList.remove('pink');
}

//random balloon's box
function randomBox() {
    const boxes = document.querySelectorAll('.box');
    const index = Math.floor(Math.random() * boxes.length);
    let box = boxes[index];
    if (lastBox == box) {
       return randomBox();
    }
    lastBox = box;
    return box;
}
//click event
function checkForClick(e) {  
    if (ableToClick) {
        //check if balloon is above box
        if (e.target && e.target.matches('.box')) {
            let balloonTop = e.target.children[0].getBoundingClientRect().top;
            let boxTop = e.target.getBoundingClientRect().top;
            if (Math.round(balloonTop - boxTop) < e.target.children[0].offsetTop) {
                checkColorOfClickedBalloon(e);
            }
        }
    }
}
//check if clicked right balloon
function checkColorOfClickedBalloon(e) {
    if (e.target.children[0].matches('.pink')) {
        score++;
        counter.textContent = `Score: ${score}`;
        ableToClick = false;
        //audio with correct tone
        let correct = new Audio('sounds/good.wav');
        correct.play();
        e.target.classList.remove('up');
        reactionTime(e.target);
    }
    else {
        console.log('Oops click at only pink balloon');
        //audio with wrong tone
        let wrong = new Audio('sounds/wrong.wav');
        wrong.play();
    }
}
//counting time left
function countTime() {
    time.sec++;
    if (time.sec == 60) {
        time.sec = 0;
        time.min++;
    }
    if (time.sec < 10) time.sec = '0' + time.sec;
    if (time.min < 10 && ((time.min).toString()).length < 2) time.min = '0' + time.min;
    let leftSec = TIME / 1000 - time.sec;
    if (leftSec < 10) leftSec = '0' + leftSec;
    if (mode == 'Time') timer.textContent = `00 : ${leftSec}`;
    else timer.textContent = `${time.min} : ${time.sec}`;
}
//reaction time
function reactionTime(box) {
    let endReactionTime = new Date();
    console.log(endReactionTime - startReactionTime);
    let reactionText = document.createElement('span');
    reactionText.setAttribute('class', 'reaction-time');
    reactionText.textContent = endReactionTime - startReactionTime + ' ms';
    reactionTimes.push(endReactionTime - startReactionTime);
    box.appendChild(reactionText);
    setTimeout(() => {reactionText.remove() },1000)
    
}
//2 condition of game end
function checkEndGame() {
    if (mode == 'Time' && timer.textContent=='00 : 00') 
        endGame();
    else if (score == CLICKS) {
        endGame();
    };
}
//end game
function endGame() {
    clearInterval(gameActive);
    clearInterval(counterActive);
    gameActive = false;
    displayEndOfGame();
}
//display window for ended game
function displayEndOfGame() {
    const gameOverFormBg = document.querySelector('#game-over-bg');
    const gameOverForm = document.querySelector('#game-over-form');
    const meanReactionTime = document.querySelector('#mean-reaction-time');
    const result = document.querySelector('#result')
    gameOverFormBg.classList.add('form-bg-active');
    gameOverForm.classList.remove('hidden');
    //checking if user score although 1 point
    let meanTime = Math.round((reactionTimes.reduce((a, b) => a + b, 0)) / reactionTimes.length);
    if (isNaN(meanTime)) meanTime = '-';
    meanReactionTime.textContent = `Your mean reaction time is  ${meanTime} ms.`;
    (mode == 'Time') ? result.textContent = `Your score is ${score} clicks in 30s.`
        : result.textContent = `You got 10 clicks in ${time.min}:${time.sec}.`;
    updateLocalStorage(meanTime);

}
//update local storage
function updateLocalStorage(meanTime) {
    users[users.length - 1].score = score;
    users[users.length - 1].meanTime = meanTime;
    users[users.length - 1].time = `${time.min}:${time.sec}`;
    localStorage.setItem('users', JSON.stringify(users));
}
//display table with results
function displayResults(e) {
    e.preventDefault()
    const table = document.querySelector('#results-table');
    const gameOverForm = document.querySelector('#game-over-form');
    const gameOverBg = document.querySelector('.game-over-form-container');
    gameOverBg.classList.add('hidden');
    gameOverForm.textContent = '';
    table.classList.remove('hidden');
    sortUsers();
    //while is less than top users add rows to table
    for (let i = 0;  i<users.length && i<TOP; i++) {
        let row = document.createElement('tr');
        table.appendChild(row);
        for (let j = 0; j < 6; j++) {
            let col = document.createElement('td');
            switch (j) {
                case 0:
                    col.textContent = i + 1;
                    break;
                case 1:
                    col.textContent = users[i].name;
                    break;
                case 2:
                    col.textContent = users[i].meanTime;
                    break;
                case 3:
                    col.textContent = users[i].level;
                    break;
                case 4:
                    col.textContent = users[i].mode;
                    break;
                case 5:
                    if (users[i].mode == 'Time') col.textContent = users[i].score;
                    else col.textContent = users[i].time;
                    break;
            }
            row.appendChild(col);
        }
    }
}
//sort user table
function sortUsers() {
    users.sort((user1, user2) => {
        if (isNaN(user1.meanTime) && !isNaN(user2.meanTime)) return 1;
        else if (!isNaN(user1.meanTime) && isNaN(user2.meanTime)) return -1;
        else return user1.meanTime - user2.meanTime;
});
    localStorage.setItem('users', JSON.stringify(users));
}
gameBoard.addEventListener('click', checkForClick);
resultsBtn.addEventListener('click', displayResults)
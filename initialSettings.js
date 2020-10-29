const triggers = document.querySelectorAll('.trigger');
const background = document.querySelector('.dropdownBackground');
//const modeOpt = document.querySelector('#mode-options');
const levelOptions = document.querySelector('#level-options').querySelectorAll('.child');
const modeOptions = document.querySelector('#mode-options').querySelectorAll('.trigger');
const startBtn = document.querySelector('#start');
const form = document.querySelector('#form');
const formBg = document.querySelector('.form-bg');
const formClose = document.querySelector('.form-close');


//DROPDOWN
function handleEnter() {
    this.classList.add('enter');
    setTimeout(() => {
        if (this.classList.contains('enter')) {
            this.classList.add('enter-active');
        }
    }, 150);
    background.classList.add('open');
    const dropdown = this.querySelector('.dropdown');
    const dropdownCoords = dropdown.getBoundingClientRect();
    //const modeCoords = modeOpt.getBoundingClientRect();
    const coords = {
        height: dropdownCoords.height,
        width: dropdownCoords.width,
        top: dropdownCoords.top,
        left:dropdownCoords.left
    }
    background.style.setProperty('width', `${coords.width}px`);
    background.style.setProperty('height', `${coords.height}px`);
    background.style.setProperty('transform', `translate(${coords.left}px,${coords.top}px)`);
}
function handleLeave() {
    this.classList.remove('enter', 'enter-active');
    background.classList.remove('open');
}

//GAME OPTIONS
//highlight one option
function highlightOneOption(options) {
    options.forEach(option => option.addEventListener('click', () => {
        options.forEach(option => option.classList.remove('chosen'));
        option.classList.add('chosen');
        (levels.includes(option.textContent)) ? level = option.textContent : mode = option.querySelector('.txt-mode').textContent;
    }))
}
//USER NAME FORM
//displaying form to enter name
function enterName() {
    if (!level || !mode) return alert('Choose game options');
    console.log({ level, mode });
    form.reset();
    startBtn.setAttribute('class', 'clicked');
    formBg.classList.add('form-bg-active');
}
function closeForm() {
    formBg.classList.remove('form-bg-active');
}

triggers.forEach(trigger => trigger.addEventListener('mouseenter', handleEnter));
triggers.forEach(trigger => trigger.addEventListener('mouseleave', handleLeave));

highlightOneOption(levelOptions);
highlightOneOption(modeOptions);

form.addEventListener('submit', startGame);
formClose.addEventListener('click', closeForm);

startBtn.addEventListener('click', enterName);
const questionEl = document.querySelector(".question");
const startBtn = document.querySelector(".started");
const optionsContainer = document.querySelector(".option");
const optionBtns = document.querySelectorAll(".btn-option");

let questions = [];
let currentIdx = 0;
let score = 0;

class Question {
    constructor(text, answer, choices) {
        this.text = text;
        this.answer = answer;
        this.choices = choices;
    }

    render() {
        questionEl.textContent = this.text;
        optionBtns.forEach((btn, i) => {
            btn.textContent = this.choices[i];
            btn.style.display = "block";
            btn.style.backgroundColor = "";
        });
    }
}

function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function getRandomOperator() {
    return ['+', '-', '*', '/'][Math.floor(Math.random() * 4)];
}

function generateQnA() {
    const num1 = Math.floor(Math.random() * 31);
    const num2 = Math.floor(Math.random() * 30) + 1;
    const op = getRandomOperator();
    const text = `${num1} ${op} ${num2}`;
    const answer = Math.round(eval(text));
    return { text, answer };
}

function generateQuestions(count = 7) {
    questions = [];
    for (let i = 0; i < count; i++) {
        const { text, answer } = generateQnA();
        let choices = [answer];
        while (choices.length < 5) {
            const fake = Math.floor(Math.random() * 51);
            if (!choices.includes(fake)) choices.push(fake);
        }
        shuffle(choices);
        questions.push(new Question(text, answer, choices));
    }
}

function showNextQuestion() {
    if (currentIdx < questions.length) {
        questions[currentIdx].render();
    } else {
        endGame();
    }
}

function endGame() {
    const accuracy = currentIdx ? Math.round((score * 100) / currentIdx) : 0;
    questionEl.textContent = `You gave ${score} correct answer${score !== 1 ? 's' : ''} from ${currentIdx}. Accuracy - ${accuracy}%`;
    optionBtns.forEach(btn => btn.textContent = '');
    optionBtns.forEach(btn => btn.style.display = "none");

    let restartBtn = document.getElementById('restart-btn');
    if (!restartBtn) {
        restartBtn = document.createElement('div');
        restartBtn.id = 'restart-btn';
        restartBtn.textContent = 'Start Game Again';
        restartBtn.style.alignItems = "center";
        restartBtn.style.justifyContent = "center";
        restartBtn.style.border = "1px solid black";
        restartBtn.style.padding = "13px";
        restartBtn.style.fontSize = "0.8rem";
        restartBtn.style.width = "100%";
        restartBtn.style.maxWidth = "365px";
        restartBtn.style.textAlign = "center";
        restartBtn.style.boxSizing = "border-box";
        restartBtn.style.wordBreak = "break-word";
        restartBtn.onclick = function() {
            restartBtn.remove();
            startGame();
        };
        questionEl.parentNode.insertBefore(restartBtn, questionEl.nextSibling);
    } else {
        restartBtn.style.display = 'block';
    }
}

function handleOptionClick(e) {
    const btn = e.currentTarget;
    const selected = parseInt(btn.textContent);
    const correct = questions[currentIdx].answer;
    let color = selected === correct ? "#05f531" : "#f50505";
    if (selected === correct) {
        score++;
    }
    btn.style.backgroundColor = color;

    btn.removeEventListener('transitionend', btn._transitionHandler);

    btn._transitionHandler = function transitionHandler() {
        btn.removeEventListener('transitionend', btn._transitionHandler);
        btn.style.backgroundColor = "";
        currentIdx++;
        console.log("Current Index:", currentIdx);
        showNextQuestion();
    };
    btn.addEventListener('transitionend', btn._transitionHandler);
}


optionBtns.forEach(btn => {
    btn.addEventListener("click", handleOptionClick);
});

function startGame() {
    score = 0;
    currentIdx = 0;
    generateQuestions();
    startBtn.style.display = "none";
    optionsContainer.style.display = "flex";
    showNextQuestion();
    setTimeout(endGame, 10000);
}

startBtn.addEventListener("click", startGame);


function init() {
    questionEl.textContent = "Ready to Start?";
    startBtn.style.display = "flex";
    optionsContainer.style.display = "none";
    optionBtns.forEach(btn => btn.style.display = "none");
}
init();
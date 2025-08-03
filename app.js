let options = document.querySelectorAll(".btn-option");
let question = document.querySelector(".question");
let start_btn = document.querySelector(".started")
let options_container = document.querySelector(".option")

let questionArray = [];
let currentQuestionIndex = 0;
let score = 0;

class Question {
    constructor(text, correct, options) {
        this.text = text;
        this.correct = correct;
        this.options = options;
    }

    display() {
        question.innerHTML = this.text;
        options.forEach((btn, index) => {
            btn.innerHTML = this.options[index];
        });
    }
}

function hidden_end () {
    options.forEach(choice => {
        choice.style.display = "none";
    })
}

function shuffle(array) {
  let currentIndex = array.length,  randomIndex;

  while (currentIndex != 0) { // The loop repeats until there are elements to mix
    randomIndex = Math.floor(Math.random() * currentIndex); // Select the remaining element.
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [    // Swapping with the current element.
      array[randomIndex], array[currentIndex]];
  }
  return array; // Returning the shuffled array
}

// Generate 7 questions
function generateQuestions() {
    for (let i = 0; i < 7; i++) {
        let qna = rand_qna();
        let choices = [
            qna.answer,
            Math.floor(Math.random() * 51),
            Math.floor(Math.random() * 41),
            Math.floor(Math.random() * 31),
            Math.floor(Math.random() * 21),
        ];

        // Shuffle choices
        choices = shuffle(choices);

        let q = new Question(qna.text, qna.answer, choices);
        questionArray.push(q);
    }
}

// Random operator and question
function getRandomOperator() {
    const ops = ['+', '-', '*', '/'];
    return ops[Math.floor(Math.random() * ops.length)];
}

function rand_qna() {
    let num1 = Math.floor(Math.random() * 31);
    let num2 = Math.floor(Math.random() * 31) || 1; // avoid divide by 0
    let op = getRandomOperator();
    let text = `${num1} ${op} ${num2}`;
    let answer = Math.round(eval(text));
    return { text, answer };
}

// Show next question
function showNextQuestion() {
    if (currentQuestionIndex < questionArray.length) {
        questionArray[currentQuestionIndex].display();
    } else {
        question.innerHTML = `You gave ${score} correct answer from ${currentQuestionIndex}. Accuracy - ${Math.round(score * 100 / currentQuestionIndex)}% `;
        options.forEach(btn => btn.innerHTML = '');
        alert(
            "Correct: " + score + "\n" +
            "Total: " + currentQuestionIndex + "\n" +
            "Accuracy: " + Math.round((score * 100) / currentQuestionIndex) + "%"
            );
        hidden_end();
    }
}

options.forEach(btn => {
    btn.addEventListener("click", function () {
        const btn_choices = this
        let currentQ = questionArray[currentQuestionIndex];
        if (parseInt(this.innerHTML) === currentQ.correct) {
            console.log("Correct!");
            score++;
            anime({
                targets: this,
                duration: 1000,
                'background-color': "#05f531",
                easing: 'linear'
            })
        } else {
            console.log("Incorrect!");
            anime({
                targets: this,
                duration: 1000,
                'background-color': "#f50505",
                easing: 'linear'
            })
        }

        setTimeout(() => {
            btn_choices.style.backgroundColor = "";
            currentQuestionIndex++;
            showNextQuestion();
        }, 2000)
    });
});

function start_game () {
    question.innerHTML = "Ready to Start?";
    start_btn.style.display = "flex";

    start_btn.addEventListener("click", function () {
        start_btn.style.display = "none";
        options_container.style.display = "flex";

/*        setTimeout(function () {
            question.innerHTML = `You gave ${score} correct answer from ${currentQuestionIndex}. Accuracy - ${Math.round(score * 100 / currentQuestionIndex)}% `;
            options.forEach(btn => btn.innerHTML = '');
            alert(
                "Correct: " + score + "\n" +
                "Total: " + currentQuestionIndex + "\n" +
                "Accuracy: " + Math.round((score * 100) / currentQuestionIndex) + "%"
                );
            hidden_end();
        }, 10000) */

        generateQuestions();
        showNextQuestion();
    })
}

start_game();
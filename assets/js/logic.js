const timeSpan = document.querySelector('#time');
const startBtn = document.querySelector('#start');
const questionsContainer = document.querySelector('#questions');
const questionTitle = document.querySelector('#question-title');
const choices = document.querySelector('#choices');
const feedback = document.querySelector('#feedback');
const startScreen = document.querySelector('#start-screen');
const endScreen = document.querySelector('#end-screen');
const finalScore = document.querySelector('#final-score');
const initials = document.querySelector('#initials');
const submitBtn = document.querySelector('#submit');

let timeLeft = 95;
let score = 0;
let timerId;

const startTimer = () => {
  timerId = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      timeSpan.textContent = timeLeft;
    } else {
      clearInterval(timerId);
      window.location.href = './highscores.html';
    }
  }, 1000);
}

//Start quiz
const startTheQuiz = () => {
  startScreen.classList.add('hide');
  startTimer();
  askQuestion(questions[0]);
  checkTheAnswer(questions[0], 0)
}

startBtn.addEventListener('click', startTheQuiz);


function checkTheAnswer(question, questionIndex) {

  choices.addEventListener('click', checkResult);

  function checkResult(e) {
    //Check if user selected answer  = correct answer
    if (e.target.dataset.index == question.correctAnswer) {
      score++;
      localStorage.setItem('score', score);
      feedback.textContent = 'Correct!'
    } else {
      timeLeft -= 15;
      feedback.textContent = 'Wrong!'
    }
    //Display question feedback
    feedback.classList.remove('hide');

    //Removed event listener
    choices.removeEventListener('click', checkResult);

    //If more questions available repeat the proccess. Ask question and check question.
    //Else display results
    if (questionIndex + 1 === questions.length) {
      clearInterval(timerId);
      displayResults();
    } else {
      askQuestion(questions[questionIndex + 1]);
      checkTheAnswer(questions[questionIndex + 1], questionIndex + 1);
    }
  }
}


//Display question and variants
function askQuestion(question) {
  //Unhide if hidden
  if (questionsContainer.classList.contains('hide')) {
    questionsContainer.classList.remove('hide');
  }
  //Display question
  questionTitle.textContent = question.question;
  //Clear previous variants and populate current question variants
  choices.innerHTML = '';
  question.answers.forEach((answer, index) => {
    const variant = document.createElement('button');
    variant.textContent = `${index + 1}. ${answer}`;
    variant.dataset.index = index;
    choices.append(variant);
  });
}

function displayResults() {
  questionsContainer.classList.add('hide');
  endScreen.classList.remove('hide');
  finalScore.textContent = score;
}




// GIVEN I am taking a code quiz
// WHEN I click the start button
// THEN a timer starts and I am presented with a question
// WHEN I answer a question
// THEN I am presented with another question
// WHEN I answer a question incorrectly
// THEN time is subtracted from the clock
// WHEN all questions are answered or the timer reaches 0
// THEN the game is over
// WHEN the game is over
// THEN I can save my initials and score
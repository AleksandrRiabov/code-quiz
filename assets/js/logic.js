const timeSpan = document.querySelector("#time");
const startBtn = document.querySelector("#start");
const questionsContainer = document.querySelector("#questions");
const questionTitle = document.querySelector("#question-title");
const choices = document.querySelector("#choices");
const feedback = document.querySelector("#feedback");
const startScreen = document.querySelector("#start-screen");
const endScreen = document.querySelector("#end-screen");
const finalScore = document.querySelector("#final-score");
const initials = document.querySelector("#initials");
const submitBtn = document.querySelector("#submit");

let timeLeft = 75;
let score = 0;
let timerId;

startBtn.addEventListener("click", startTheQuiz);

//=== Main Function to start the quiz
function startTheQuiz() {
  //remove starting screen
  startScreen.classList.add("hide");

  startTimer();
  askQuestion(questions[0]);
  checkTheAnswer(questions[0], 0);
}

//=== Function to start timer
function startTimer() {
  timerId = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      timeSpan.textContent = timeLeft;
    } else {
      clearInterval(timerId);
      // window.location.href = './highscores.html';
      displayResults();
    }
  }, 1000);
}

//=== Function to display question and variants
function askQuestion(question) {
  //Unhide if hidden
  if (questionsContainer.classList.contains("hide")) {
    questionsContainer.classList.remove("hide");
  }
  //Display question
  questionTitle.textContent = question.question;
  //Clear previous variants and populate current question variants
  choices.innerHTML = "";
  question.answers.forEach((answer, index) => {
    const variant = document.createElement("button");
    variant.textContent = `${index + 1}. ${answer}`;
    variant.dataset.index = index;
    choices.append(variant);
  });
}

//=== Function to check if user selected correct answer and display feedback
//If some questions left will call askQuestion function to repeat the proccess
function checkTheAnswer(question, questionIndex) {
  choices.addEventListener("click", checkResult);

  function checkResult(e) {
    //Check if user answered correct
    if (e.target.dataset.index == question.correctAnswer) {
      score++;
      localStorage.setItem("score", score);
      feedback.textContent = "Correct!";
    } else {
      timeLeft -= 15;
      feedback.textContent = "Wrong!";
    }
    //Display question feedback
    feedback.classList.remove("hide");

    //Removed event listener
    choices.removeEventListener("click", checkResult);

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

//=== Function show final score screen
function displayResults() {
  questionsContainer.classList.add("hide");
  endScreen.classList.remove("hide");
  endScreen.querySelector("h2").textContent = timeLeft
    ? "All questions complete!"
    : "You run out of time!";
  finalScore.textContent = score;
  submitBtn.addEventListener("click", saveResultToLocalStorage);
}

//=== Function saves current score and initials to local storage
const saveResultToLocalStorage = () => {
  const currentPersonResult = {
    score,
    initials: initials.value,
  };

  //If some results exists add to existing array new result
  //Else just add result to local storage
  if (localStorage.getItem("results")) {
    //retrive from local storage
    const allResults = JSON.parse(localStorage.getItem("results"));
    //Add current result to array with all results
    const updatedResults = [...allResults, currentPersonResult];
    //Save updated list of all results to local storage
    localStorage.setItem("results", JSON.stringify(updatedResults));
  } else {
    // Save result to local storage
    localStorage.setItem("results", JSON.stringify([currentPersonResult]));
  }
  submitBtn.removeEventListener("click", saveResultToLocalStorage);
};
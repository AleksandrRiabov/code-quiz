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

const soundCorrect = new Audio("./assets/sfx/correct.wav");
const soundIncorrect = new Audio("./assets/sfx/incorrect.wav");
const letsGoSound = new Audio("./assets/sfx/088186_let39s-gowav-86025.wav");
const surprisedChildSound = new Audio(
  "./assets/sfx/surprised-child-voice-sound-113127.wav"
);
const claps = new Audio("./assets/sfx/claps-44774.wav");

let timeLeft = 76;
let score = 0;
let timerId;

startBtn.addEventListener("click", startTheQuiz);

//=== Main Function to start the quiz
function startTheQuiz() {
  letsGoSound.play();
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
      surprisedChildSound.play();
      clearInterval(timerId);
      displayResults();
    }
  }, 1000);
}

//=== Function to display question and variants
function askQuestion(question) {
  if (timeLeft <= 0) return;
  //Unhide questions container if hidden
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
  //When user selects the answer
  choices.addEventListener("click", checkResult);

  function checkResult(e) {
    if (e.target.id === "choices") return;

    e.target.style.background = "#bd60e7";
    feedback.classList.add("hide");

    //Check if user answered correct
    if (e.target.dataset.index == question.correctAnswer) {
      soundCorrect.play();
      score++;
      delay(changeFeedback, 600, "Correct!");
    } else {
      soundIncorrect.play();
      timeLeft -= 15;
      delay(changeFeedback, 600, "Wrong!");
    }

    //Removed event listener
    choices.removeEventListener("click", checkResult);

    //Ask another question after delay (callBack, timeout, nextQuestion Index);
    delay(repeatProccess, 600, questionIndex + 1);
  }
}

//=== Function change feedback
function changeFeedback(text) {
  feedback.textContent = text;
  feedback.classList.remove("hide");
}

//=== Function to ask question again
function repeatProccess(nextQuestionIndex) {
  //If more questions available repeat the proccess. Ask question and check results.
  //Else display results
  if (nextQuestionIndex === questions.length) {
    clearInterval(timerId);
    displayResults();
  } else {
    askQuestion(questions[nextQuestionIndex]);
    checkTheAnswer(questions[nextQuestionIndex], nextQuestionIndex);
  }
}

//=== Function show final score screen
function displayResults() {
  if (timeLeft >= 0) claps.play();
  //hide questions screen
  questionsContainer.classList.add("hide");
  //show result screen
  endScreen.classList.remove("hide");
  //display message deppending on the result
  endScreen.querySelector("h2").textContent =
    timeLeft > 0 ? "All questions complete!" : "No more time left!";

  finalScore.textContent = score;
  //if time left less than 0 still show 0. excludes showing negative number
  timeSpan.textContent = timeLeft >= 0 ? timeLeft : 0;

  submitBtn.addEventListener("click", saveResultToLocalStorage);
}

//=== Function saves current score and initials to local storage
function saveResultToLocalStorage() {
  const validatedInitials = validateInitials(initials.value);
  if (!validatedInitials) return;

  const currentPersonResult = {
    score,
    initials: validatedInitials,
  };

  //Get results array from localstorage or create an empty array
  const allResults = JSON.parse(localStorage.getItem("results")) || [];
  //add new score to the reulst array
  allResults.push(currentPersonResult);
  //save updated results array to localstorage
  localStorage.setItem("results", JSON.stringify(allResults));

  submitBtn.removeEventListener("click", saveResultToLocalStorage);
  //transfer to highscores page
  window.location.href = "./highscores.html";
}
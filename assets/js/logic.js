const timeSpan = document.querySelector('#time');
const startBtn = document.querySelector('#start');
const questionsContainer = document.querySelector('#questions');
const questionTitle = document.querySelector('#question-title');


let timeLeft = 5;





const startTimer = () => {
  const timerId = setInterval( () => {
    if (timeLeft > 0 ) {
      timeLeft--;
      timeSpan.textContent = timeLeft;
    } else {
      clearInterval(timerId);
      console.log('No more time left!')
      // window.location.href = './highscores.html'
    }
  },1000);
}

const startTheQuiz = () => {
  questionsContainer.class = '';
  const askQuestion = (question) => {

    questionTitle.textContent = question.question; 
  }

  askQuestion(questions[1])
}


startBtn.addEventListener('click', startTimer);
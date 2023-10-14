
document.addEventListener("DOMContentLoaded", function () {
  const regnumber = localStorage.getItem("regnumber");

  const nameInput = document.getElementById("name");

  if (regnumber) {
    nameInput.value = regnumber; // Set the default value of the input field
  } else {
    nameInput.value = "Guest";
  }

});

///////////////////////////////////////////////////////////////////////////////////////////////
const customAlert = document.getElementById("custom-alert");
const customAlertMessage = document.getElementById("custom-alert-message");
const customAlertOkayButton = document.getElementById("custom-alert-okay");

function showCustomAlert(message) {
  customAlertMessage.textContent = message;
  customAlert.style.display = "flex";
}

function hideCustomAlert() {
  customAlert.style.display = "none";
}

customAlertOkayButton.addEventListener("click", hideCustomAlert);
//////////////////////////////////////////////////////////////////////////////

const firebaseConfig = {
  apiKey: "AIzaSyDuWMgZzdi1XUkF5K9n2QJnmNM6nADD0Js",
  authDomain: "proctoshield-8eaf3.firebaseapp.com",
  databaseURL: "https://proctoshield-8eaf3-default-rtdb.firebaseio.com",
  projectId: "proctoshield-8eaf3",
  storageBucket: "proctoshield-8eaf3.appspot.com",
  messagingSenderId: "27994814767",
  appId: "1:27994814767:web:e4cc3c9315633df85949da"
};

firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();
async function fetchData(type) {
  try {
    const questionsRef = db.collection('questions');
    const querySnapshot = await questionsRef.where("type", "==", type).get();
    const questions = querySnapshot.docs.map(doc => {
      const data = doc.data();
      const question = {
        id: doc.id,
        question: data.question,
        correctOption: data.correctOption,
        options: data.options
      };
      return question;
    });

    return questions;
  }
  catch (err) {
    console.error("Error fetching data:", err);
    return [];
  }
}

const nameForm = document.getElementById("name-form");
const nameInput = document.getElementById("name");
const quizContainer = document.getElementById("quiz");
const scoreContainer = document.getElementById("score");

let currentQuestion = 0;
let score = 0;
let timer;



async function startQuizWrapper(type) {
  try {

    document.getElementById("loading-spinner").style.display = 'block';
    playAudio('proc.mp3');
    const questions = await fetchData(type);
    if (questions.length === 0) {
      showCustomAlert('No questions found in Firestore. Please add questions before starting the quiz.');
      document.getElementById("loading-spinner").style.display = 'none';
      return;
    }

    const regnumber = localStorage.getItem("regnumber");
    const quizSettingsRef = db.collection('quizattempts').doc(type);
    const quizSettingsDoc = await quizSettingsRef.get();

    if (quizSettingsDoc.exists) {
      const fieldValue = quizSettingsDoc.data()[regnumber];
      if (fieldValue > 0) {
        await quizSettingsRef.update({
          [regnumber]: fieldValue - 1
        });

        startQuiz(questions, type);

      } else {
        showCustomAlert(`You have ${fieldValue} attempts available`);
        document.getElementById("loading-spinner").style.display = 'none';
      }
    } else {
      showCustomAlert('Please try again later.');
      document.getElementById("loading-spinner").style.display = 'none';
    }
  } catch (error) {
    console.error('Error:', error);
    showCustomAlert('An error occurred. Please try again.');
    document.getElementById("loading-spinner").style.display = 'none';
  }
}
async function playAudio(audioSrc) {
  try {
    const audio = new Audio(audioSrc);
    await audio.play();
  } catch (error) {
    console.error('Error playing audio:', error);
  }
}


function startQuiz(questions, type) {
  var rollNoInput = document.getElementById('name').value;

  if (rollNoInput.trim() === '') {
    showCustomAlert('Please enter your roll number.');

    return;
  }

  const nameInput = document.getElementById('name');
  const name = nameInput.value;
  nameForm.style.display = "none";
  document.getElementById("loading-spinner").style.display = 'none';
  quizContainer.style.display = "block";
  video.style.display = "block";
  printName();
  showQuestion(questions, type);
}

async function sendPostRequest(reason) {
  try {
    await fetch("https://sheet.best/api/sheets/c24d0b28-bcab-443a-8344-369e33269500", {
      method: "POST",
      body: JSON.stringify({ name: nameInput.value, score: "Cheated", date: currentDate, time: currentTime, malpractice: reason }),
      headers: {
        "Content-Type": "application/json"
      },
    });
    console.log(`POST request sent for: ${reason}`);
  } catch (error) {
    console.error(`Error sending POST request for: ${reason}`, error);
  }
}


function showQuestion(questionsProps, type) {
  const questions = questionsProps;
  const question = questions[currentQuestion];

  const questionElement = document.createElement("h2");
  questionElement.innerText = question.question;

  const answerContainer = document.createElement("div");
  answerContainer.classList.add("answer-container");

  question.options.forEach(option => {
    const answerButton = document.createElement("button");
    answerButton.innerText = option;


    // document.addEventListener('visibilitychange', async function () {
    //   showCustomAlert("Tab switching Detected!!");
    //   await sendPostRequest("Switched His/Her Tab");

    //   window.location.href = "main.html";
    // });

    document.addEventListener('fullscreenchange', async function () {
      if (document.fullscreenElement === null) {
        showCustomAlert('Tab exited full screen');
        await sendPostRequest("Minimized screen");
        window.location.href = "main.html";
      }
    });

    answerButton.addEventListener("click", () => {
      if (option === question.correctOption) {
        score++;

      }
      clearInterval(timer);
      currentQuestion++;
      if (currentQuestion < questions.length) {
        showQuestion(questions, type);
      } else {
        showScore(questions, type);
      }
    });
    answerContainer.appendChild(answerButton);
  });

  quizContainer.innerHTML = "";
  quizContainer.appendChild(questionElement);
  quizContainer.appendChild(answerContainer);

  const timerElement = document.createElement("p");
  timerElement.classList.add("timer");
  let timeLeft = 60;
  timerElement.innerHTML = `<i class="fas fa-clock"></i> Time left: ${timeLeft}s`;
  timer = setInterval(() => {
    timeLeft--;
    timerElement.innerHTML = `<i class="fas fa-clock"></i> Time left: ${timeLeft}s`;
    if (timeLeft <= 10) {
      timerElement.classList.add("red");
    }
    if (timeLeft === 0) {
      clearInterval(timer);
      currentQuestion++;
      if (currentQuestion < questions.length) {
        showQuestion(questions, type);
      } else {
        showScore(questions, type);
      }
    }
  }, 1000);

  quizContainer.appendChild(timerElement);
}

function printName() {
  const name = document.getElementById("name").value;
  const watermark = document.createElement("z");
  watermark.innerHTML = name;
  document.body.appendChild(watermark);
}

async function showScore(questions, type) {
  quizContainer.style.display = "none";
  scoreContainer.style.display = "block";
  const name = nameInput.value;
  const scoreElement = document.createElement("p");

  if (score === 0) {
    scoreElement.innerText = `Try Again ${name}! , you have scored ${score} out of ${questions.length}!`;
  } else {
    scoreElement.innerText = `Congratulations ${name}, you Have scored ${score} out of ${questions.length}!`;
  }
  fetch("https://sheet.best/api/sheets/c24d0b28-bcab-443a-8344-369e33269500", {
    method: "POST",
    body: JSON.stringify({ name: nameInput.value, score: score, date: currentDate, time: currentTime, malpractice: "No Cheating", subject: type }),
    headers: {
      "Content-Type": "application/json"
    },
  });

  scoreContainer.appendChild(scoreElement);
}

window.addEventListener('load', function () {
  var spinner = document.getElementById('loading-spinner');
  spinner.style.display = 'none';
});








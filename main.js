

window.addEventListener('load', function() {
  var spinner = document.getElementById('loading-spinner');
  var content = document.getElementById('content');
  
  spinner.style.display = 'none';
  content.classList.remove('blur');
});
// function hideDiv() {
//   var hiddenDiv = document.getElementById('hiddenDiv');
//   hiddenDiv.style.display = 'none';
// }


// hideDiv();
const email=localStorage.getItem('email');
const sname = localStorage.getItem('sname');
const snamePlaceholder = document.getElementById('sname-placeholder');

if (sname) {
  snamePlaceholder.textContent = sname;
} else {
  snamePlaceholder.textContent = "Guest";
}


///////////////////////////////////////////////////////////////////////////////
const quizContent = document.querySelector('.quiz-content');

function filterQuizzes() {
  var input, filter, quizOptions, option, i, txtValue;
  input = document.getElementById("searchInput");
  filter = input.value.toLowerCase();
  quizOptions = document.getElementsByClassName("quiz-option");


  if (!filter) {
    showAllQuizzes();
    return;
  }

  for (i = 0; i < quizOptions.length; i++) {
    option = quizOptions[i];
    txtValue = option.querySelector("h2").textContent || option.querySelector("h2").innerText;
    if (txtValue.toLowerCase().indexOf(filter) > -1) {
      option.style.display = "";
    } else {
      option.style.display = "none";
    }
  }
}

function showAllQuizzes() {
  var quizOptions = document.getElementsByClassName("quiz-option");


  for (var i = 0; i < quizOptions.length; i++) {
    quizOptions[i].style.display = "";
  }

  document.getElementById("searchInput").value = "";
}


document.getElementById("searchButton").addEventListener("click", function () {
  filterQuizzes();
});


document.getElementById("searchInput").addEventListener("keyup", function (event) {


  if (this.value.trim() === "") {
    showAllQuizzes();
  }
});

const regnumber = localStorage.getItem("regnumber");
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
const db = firebase.firestore();

const subjects = [
  'Cloud Computing',
  'Computer Networks',
  'Blockchain Technology',
  'Artificial Intelligence',
  'Data Science',
  'Internet of Things',
  'Database Management',
  'Data Analytics',
  'Quantum Computing',
  'Web Devolopment',
  'Programming with C',
  'Python Programming',

];

subjects.forEach((subject, index) => {
  const quizSettingsRef = db.collection('quizattempts').doc(subject);
  const attemptsMessage = document.getElementById(`attempts-message${index + 1}`);

  quizSettingsRef.get().then(quizSettingsDoc => {
    if (!quizSettingsDoc.exists) {
      displayAttempts(attemptsMessage, 0);
      return;
    }

    const fieldValue = quizSettingsDoc.data()[regnumber] || 0;
    displayAttempts(attemptsMessage, fieldValue);
  }).catch(error => {
    console.error(`Error fetching quiz settings for ${subject}:`, error);
  });
});

function displayAttempts(element, attempts) {
  element.textContent = `Attempts: ${attempts}`;
}

//////////////////////////////////////////////////////////////////////////////////////////////

const imageContainer = document.getElementById('imageContainer');
const slideImageContainer = document.getElementById('slideImageContainer');
const hamburgerMenu = document.getElementById('hamburgerMenu');
const userName = document.getElementById('userName');
const signButton = document.getElementById('sign-out-button');
const userNamePlaceholder = document.getElementById('sname-placeholder'); 
const signOutButton = document.getElementById('signOutButton');
const profileImage = document.getElementById('imageContainer');
profileImage.addEventListener('click', () => {
    hamburgerMenu.classList.toggle('show-menu');
});

/////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////

// Display user image
const photosRef = db.collection('emails').where('email', '==', email);
photosRef.get().then(querySnapshot => {
  querySnapshot.forEach(doc => {
    const imageUrl = doc.data().imageUrl;

    const mainNavImgStyles = {
      width: '55px',
      height: '55px',
      borderRadius: '50%',
      margin: '10px'
    };
    displayImageWithStyles(imageUrl, 'imageContainer', mainNavImgStyles);

    const mobileNavImgStyles = {
      width: '120px',
      height: '120px',
      borderRadius: '50%'
    };

    displayImageWithStyles(imageUrl, 'slideImageContainer', mobileNavImgStyles);
  });
}).catch(error => {
  console.error('Error fetching photos:', error);
});



userName.textContent = userNamePlaceholder.textContent;


signButton.addEventListener("click", () => {
  sessionStorage.clear();
  localStorage.clear();
  window.location.href = 'index.html';
});
signOutButton.addEventListener("click", () => {
  sessionStorage.clear();
  localStorage.clear();
  window.location.href = 'index.html';
});


function displayImageWithStyles(imageUrl, containerId, imgStyles) {
  const container = document.getElementById(containerId);
  const imgElement = document.createElement('img');
  imgElement.src = imageUrl || 'https://static.vecteezy.com/system/resources/previews/005/544/718/original/profile-icon-design-free-vector.jpg';

  for (const style in imgStyles) {
    imgElement.style[style] = imgStyles[style];
  }

  container.appendChild(imgElement);
}



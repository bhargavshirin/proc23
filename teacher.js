

window.addEventListener('load', function() {
  var spinner = document.getElementById('loading-spinner');
  var content = document.getElementById('content');
  
  spinner.style.display = 'none';
  content.classList.remove('blur');
});


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
const quizSettingsRef = db.collection('quizattempts').doc('gLkt5gdlO89rGEEPik8l');


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


function displayImageWithStyles(imageUrl, containerId, imgStyles) {
  const container = document.getElementById(containerId);
  const imgElement = document.createElement('img');
  imgElement.src = imageUrl || 'https://static.vecteezy.com/system/resources/previews/005/544/718/original/profile-icon-design-free-vector.jpg';

  for (const style in imgStyles) {
    imgElement.style[style] = imgStyles[style];
  }

  container.appendChild(imgElement);
}


import { initializeApp } from "https://www.gstatic.com/firebasejs/9.5.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/9.5.0/firebase-auth.js";

/////////////////////////////   TOKEN     //////////////////////////////////////
function generateSecureToken(length) {
  const values = new Uint8Array(length);
  window.crypto.getRandomValues(values);

  let token = '';
  for (let i = 0; i < length; i++) {
    token += values[i].toString(16).padStart(2, '0');
  }

  return token;
}
///////////////////////// STUDENT LOGIN ////////////////////////////////////////

function loginUser() {
  const user = {
      username: "AuThenticatedUser",
      role: "AuthUserVerified" 
  };

  sessionStorage.setItem("user", JSON.stringify(user));
  window.location.href = "main.html"; 
}

///////////////////////// FACULTY LOGIN ////////////////////////////////////////

function floginUser() {

  const user = {
      username: "AuThenticatedUser",
      role: "FaCuLtyisaAuthUserAndAllOwed" 
  };

  sessionStorage.setItem("user", JSON.stringify(user));
  window.location.href = urlWithToken; 
}

//secure token 



const tokenLength = 32;
const secureToken = generateSecureToken(tokenLength);
const urlWithToken = `N0pJ3hTgV5cXqAzH6bZ8mVnG1kC.html?token=${encodeURIComponent(secureToken)}`;

//////////////////       FIREBASE     ///////////////////////////////////////////

const firebaseConfig = {
    apiKey: "AIzaSyDuWMgZzdi1XUkF5K9n2QJnmNM6nADD0Js",
    authDomain: "proctoshield-8eaf3.firebaseapp.com",
    projectId: "proctoshield-8eaf3",
    storageBucket: "proctoshield-8eaf3.appspot.com",
    messagingSenderId: "27994814767",
    appId: "1:27994814767:web:e4cc3c9315633df85949da"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
firebase.initializeApp(firebaseConfig);
const db =firebase.firestore();

/////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////
document.getElementById("reg-btn").addEventListener('click', function(){
  document.getElementById("register-div").style.display="inline";
  document.getElementById("login-div").style.display="none";
});

document.getElementById("log-btn").addEventListener('click', function(){
  document.getElementById("register-div").style.display="none";
  document.getElementById("login-div").style.display="inline";
});
/////////////////////////////////////////////////////////////////////////////////////


document.getElementById("register-btn").addEventListener('click', function(){
  document.getElementById("loading-spinner").style.display = 'block';

  const registerName = document.getElementById("register-name").value;
  const registerRegnumber = document.getElementById("register-regnumber").value;
  const registerEmail = document.getElementById("register-email").value;
  const registerPassword = document.getElementById("register-password").value;

  if (!isValidEmail(registerEmail)) {
    showCustomAlert("Please enter an email address ending with @gitam.in or @gitam.edu");
    document.getElementById("loading-spinner").style.display = 'none';
    return;
  }
  
  const auth = firebase.auth();
  auth.createUserWithEmailAndPassword(registerEmail, registerPassword)
    .then(function (userCredential) {
      const user = userCredential.user;
      user.sendEmailVerification()
        .then(function () {
          console.log("Email verification sent!");
          document.getElementById("result-box").style.display = "inline";
          document.getElementById("register-div").style.display = "none";
          document.getElementById("result").innerHTML = "A verification link has been sent to  " + registerEmail;
          document.getElementById("loading-spinner").style.display = 'none';
          const db = firebase.firestore();
          if (isstudentEmail(registerEmail)) {
          db.collection("quizattempts").get()
          .then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
             

              db.collection("quizattempts").doc(doc.id).update({
        
                [registerRegnumber] : 0
              })
                .then(function () {
                  console.log("Document successfully updated!");
                })
                .catch(function (error) {
                  console.error("Error updating document: ", error);
                });
            });
          })
          .catch(function (error) {
            console.error("Error getting documents: ", error);
          });
        }
          db.collection("emails").doc(registerRegnumber).set({
            sname: registerName,
            regnumber: registerRegnumber,
            email: registerEmail,
            imageUrl: '', 
            cloudcomputing: ['', '', '', '', ''], 
            computernetworks: ['', '', '', '', ''],
          }).then(function() {
            console.log("Document successfully written!");
          }).catch(function(error) {
            console.error("Error writing document: ", error);
          });
        })
        .catch(function (error) {
          showCustomAlert(error);
          document.getElementById("loading-spinner").style.display = 'none';
        });
    })
    .catch(function (error) {
      console.error(error);
      document.getElementById("result-box").style.display = "inline";
      document.getElementById("register-div").style.display = "none";
      document.getElementById("result").innerHTML = "Sorry! <br>" + error.message;
      document.getElementById("loading-spinner").style.display = 'none';
    });
});

function isValidEmail(email) {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@(gitam\.in|gitam\.edu)$/i;
  return emailPattern.test(email);
}
function isstudentEmail(email) {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@(gitam\.in)$/i;
  return emailPattern.test(email);
}




document.getElementById("log-out-btn").addEventListener('click', function(){
  signOut(auth).then(() => {
    document.getElementById("result-box").style.display="none";
    document.getElementById("login-div").style.display="inline";
  })
  .catch((error) => {
    document.getElementById("result").innerHTML="Error connecting to Proctoshield!!, <br>"+errorMessage;
  });
});

document.getElementById("login-btn").addEventListener('click', function(){
  const loginEmail = document.getElementById("login-email").value;
  const loginPassword = document.getElementById("login-password").value;
  document.getElementById("loading-spinner").style.display = 'block';

  signInWithEmailAndPassword(auth, loginEmail, loginPassword)
    .then((userCredential) => {
      const user = userCredential.user;
      if (user.emailVerified) {
        if (loginEmail.endsWith("@gitam.edu")) {
          db.collection("emails").where("email", "==", loginEmail)
            .get()
            .then((querySnapshot) => {
              if (!querySnapshot.empty) {
                const doc = querySnapshot.docs[0];
                const sname = doc.data().sname; 
                const regnumber = doc.data().regnumber;       
                if (sname && regnumber && loginEmail) { 
                  localStorage.setItem('sname', sname);
                  localStorage.setItem('email', loginEmail);
                  localStorage.setItem('regnumber', regnumber);
                  floginUser();
                  document.getElementById("loading-spinner").style.display = 'none';
                } else {
                  showCustomAlert("User Not Found, Please contact your Administrator!!");
                  document.getElementById("loading-spinner").style.display = 'none';
                }
              } else {
                showCustomAlert("User Not Found, Please contact your Administrator!!");
                document.getElementById("loading-spinner").style.display = 'none';
              }
            })
            .catch((error) => {
              console.error("Error:", error);
              showCustomAlert("User Not Allowed!!");
            });
        } else {
          db.collection("emails").where("email", "==", loginEmail)
            .get()
            .then((querySnapshot) => {
              if (!querySnapshot.empty) {
                const doc = querySnapshot.docs[0];
                const regnumber = doc.data().regnumber;
                const sname = doc.data().sname;      
                if (regnumber && sname && loginEmail) { 
                  localStorage.setItem('regnumber', regnumber);
                  localStorage.setItem('sname', sname);
                  localStorage.setItem('email', loginEmail);
                  loginUser();
                  document.getElementById("loading-spinner").style.display = 'none';
                } else {
                  showCustomAlert("User Not Found, Please contact your Administrator!!");
                  document.getElementById("loading-spinner").style.display = 'none';
                }
              } else {
                showCustomAlert("User Not Found, Please contact your Administrator!!");
                document.getElementById("loading-spinner").style.display = 'none';
              }
            })
            .catch((error) => {
              console.error("Error:", error);
              showCustomAlert("User Not Allowed!!");
              document.getElementById("loading-spinner").style.display = 'none';
            });
        }
      } else {

        showCustomAlert("Please verify your email address before logging in.");
        document.getElementById("loading-spinner").style.display = 'none';
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      showCustomAlert("Login failed. Please check your credentials.");
      document.getElementById("loading-spinner").style.display = 'none';
    });
});


document.getElementById("google-signin-btn").addEventListener("click", function() {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider)
    .then((result) => {
   
      const user = result.user;

      document.getElementById("loading-spinner").style.display = 'block';
//////////////////  GOOGLE FACULTY LOGIN   ///////////////////////////////////////////
      if (user.email.endsWith("@gitam.edu")) {
        db.collection("emails").where("email", "==", user.email)
        .get()
        .then((querySnapshot) => {
          if (!querySnapshot.empty) {
               const doc = querySnapshot.docs[0];
               const regnumber = doc.data().regnumber;
               const sname = doc.data().sname;
               if(regnumber && sname && user.email){
                localStorage.setItem('sname', sname);
                localStorage.setItem('email', user.email);
                localStorage.setItem('regnumber', regnumber);
                floginUser();
                document.getElementById("loading-spinner").style.display = 'none';
              }
              else {
                showCustomAlert("User Not Found, Please contact your Administrator!!");
                document.getElementById("loading-spinner").style.display = 'none';
              }
          } 
          else {
            showCustomAlert("User Not Found, Please contact your Administrator!!");
              document.getElementById("loading-spinner").style.display = 'none';

          }
         
          
        })
        .catch((error) => {
          showCustomAlert("User Not Allowed!!");
          document.getElementById("loading-spinner").style.display = 'none';

        });
        
      } 
      else {
  //////////////////  GOOGLE STUDENT LOGIN   ///////////////////////////////////////////     
        db.collection("emails").where("email", "==", user.email)
          .get()
          .then((querySnapshot) => {
            if (!querySnapshot.empty) {
                 const doc = querySnapshot.docs[0];
                 const regnumber = doc.data().regnumber;
                 const sname = doc.data().sname;
                 if(regnumber && sname && user.email){

                 localStorage.setItem('regnumber', regnumber);
                 localStorage.setItem('sname', sname);
                 localStorage.setItem('email', user.email);
                 loginUser();
                 document.getElementById("loading-spinner").style.display = 'none';
                }
                else {
                  showCustomAlert("User Not Found, Please contact your Administrator!!");
                  document.getElementById("loading-spinner").style.display = 'none';
                }
            } 
            else {
              showCustomAlert("User Not Found, Please contact your Administrator!!");
                document.getElementById("loading-spinner").style.display = 'none';
 
            }
           
            
          })
          .catch((error) => {
            showCustomAlert("User Not Allowed!!");
            document.getElementById("loading-spinner").style.display = 'none';
 
          });
        

      }
    })
    .catch((error) => {

      showCustomAlert("Login failed. Please check your credentials.");
      document.getElementById("loading-spinner").style.display = 'none';
 
    });
})


window.addEventListener('load', function() {
  var spinner = document.getElementById('loading-spinner');
  spinner.style.display = 'none';
});
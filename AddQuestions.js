function goBack() {
  window.location.href = "N0pJ3hTgV5cXqAzH6bZ8mVnG1kC.html";
}

const selectedAll = document.querySelectorAll(".wrapper-dropdown");

selectedAll.forEach((selected) => {
  const optionsContainer = selected.children[2];
  const optionsList = selected.querySelectorAll("ul.dropdown li");

  selected.addEventListener("click", () => {
    let arrow = selected.children[1];

    if (selected.classList.contains("active")) {
      handleDropdown(selected, arrow, false);
    } else {
      let currentActive = document.querySelector(".wrapper-dropdown.active");

      if (currentActive) {
        let anotherArrow = currentActive.children[1];
        handleDropdown(currentActive, anotherArrow, false);
      }

      handleDropdown(selected, arrow, true);
    }
  });

  for (let o of optionsList) {
    o.addEventListener("click", () => {
      const selectedOption = o.textContent;
      selected.querySelector(".selected-display").innerHTML = selectedOption;
      updateType(selectedOption);
    });
  }
});

window.addEventListener("click", function (e) {
  if (e.target.closest(".wrapper-dropdown") === null) {
    closeAllDropdowns();
  }
});

function closeAllDropdowns() {
  const selectedAll = document.querySelectorAll(".wrapper-dropdown");
  selectedAll.forEach((selected) => {
    const optionsContainer = selected.children[2];
    let arrow = selected.children[1];

    handleDropdown(selected, arrow, false);
  });
}

// open all the dropdowns
function handleDropdown(dropdown, arrow, open) {
  if (open) {
    arrow.classList.add("rotated");
    dropdown.classList.add("active");
  } else {
    arrow.classList.remove("rotated");
    dropdown.classList.remove("active");
  }
}

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

var formCounter = 1;

document.getElementById("multiplyButton").onclick = function () {
  var formContainer = document.getElementById("formContainer");

  var questionForm = document.getElementById("questionForm0");
  var clonedForm = questionForm.cloneNode(true);
  clonedForm.id = "questionForm" + formCounter;
  formContainer.appendChild(clonedForm);

  formCounter++;

  const removeButton = clonedForm.querySelector(".removeButton");
  removeButton.addEventListener("click", () => {
    formContainer.removeChild(clonedForm);
  });
};

document.addEventListener("submit", async (event) => {
  if (event.target && event.target.matches(".questionForm")) {
    event.preventDefault();

    const currentForm = event.target;

    const question = currentForm.querySelector(".question").value;
    const correctOption = currentForm.querySelector(".correctOption").value;
    const optionsString = currentForm.querySelector(".options").value;

    const options = optionsString.split(",");

    if (!question || !correctOption || options.length < 2) {
      alert("Please fill out all fields and provide at least two options.");
      return;
    }

    if (!options.includes(correctOption)) {
      alert("The correct option must be one of the provided options.");
      return;
    }

    try {
      const selectedOption = getSelectedOption();
      await db.collection("questions").add({
        type: selectedOption,
        question: question,
        correctOption: correctOption,
        options: options,
      });

      alert("Question successfully added to Firestore!");
      currentForm.reset();
    } catch (error) {
      alert("Error adding question to Firestore: " + error.message);
    }
  }
});

function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (decodeURIComponent(pair[0]) == variable) {
      return decodeURIComponent(pair[1]);
    }
  }
  return null;
}

function getSelectedOption() {
  const selectedDisplay = document.querySelector(".selected-display");
  return selectedDisplay.textContent;
}

function updateType(selectedOption) {
  const selectedOptionHeader = document.getElementById("selectedOptionHeader");
  selectedOptionHeader.textContent = selectedOption;
}

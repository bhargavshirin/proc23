
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

const dataList = document.getElementById("data-list");
const questionTypeDropdown = document.getElementById("question-type");
function getSelectedType() {
  return questionTypeDropdown.value;
}
function updateDisplayedQuestions() {
  const selectedType = getSelectedType();
  dataList.innerHTML = "";
  firebase.firestore()
    .collection("questions")
    .where("type", "==", selectedType)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const dataItem = document.createElement("div");
        dataItem.classList.add("data-item");

        let fieldList = "<table class='field-table'>";
        fieldList += `<tr><td><strong>Question</strong></td><td class="editable" data-field="question">${data.question}</td></tr>`;
        fieldList += `<tr><td><strong>Correct Option</strong></td><td class="editable" data-field="correctOption">${data.correctOption}</td></tr>`;

        if (Array.isArray(data.options)) {
          fieldList += `<tr><td><strong>Options</strong></td><td class="editable" data-field="options">${data.options.join(", ")}</td></tr>`;
        } else {
          fieldList += `<tr><td><strong>Options</strong></td><td class="editable" data-field="options">${data.options}</td></tr>`;
        }

        fieldList += `<tr><td><strong>Type</strong></td><td class="editable" data-field="type">${data.type}</td></tr>`;
        fieldList += `<tr><td colspan="2"><button class="edit-button" data-id="${doc.id}">Edit</button> <button class="save-button" data-id="${doc.id}" style="display: none;">Save</button> <button class="delete-button" data-id="${doc.id}">Delete</button></td></tr>`;
        fieldList += "</table>";

        dataItem.innerHTML = fieldList;
        dataList.appendChild(dataItem);

        const editButton = dataItem.querySelector(".edit-button");
        editButton.addEventListener("click", () => {
          const editableFields = dataItem.querySelectorAll(".editable");
          editableFields.forEach((editableField) => {
            const value = editableField.textContent;
            editableField.innerHTML = "";
            editableField.appendChild(createEditableInput(editableField.dataset.field, value));
          });
          editButton.style.display = "none";
          dataItem.querySelector(".save-button").style.display = "inline";
          dataItem.querySelector(".delete-button").style.display = "none";
        });

        const saveButton = dataItem.querySelector(".save-button");
        saveButton.addEventListener("click", () => {
          const documentId = saveButton.getAttribute("data-id");
          const editableFields = dataItem.querySelectorAll(".editable");
          const newData = {};

          editableFields.forEach((editableField) => {
            const fieldName = editableField.dataset.field;
            let newValue = editableField.querySelector("input").value;

            if (fieldName === "options") {
              newValue = newValue.split(", ");
            }

            newData[fieldName] = newValue;
            editableField.innerHTML = "";
            editableField.appendChild(createNonEditableSpan(newValue));
          });

          saveChanges(documentId, newData);
        });

        const deleteButton = dataItem.querySelector(".delete-button");
        deleteButton.addEventListener("click", () => {
          const documentId = deleteButton.getAttribute("data-id");
          deleteDocument(documentId);
        });
      });
    })
    .catch((error) => {
      alert("Error fetching data", error);
    });
}
questionTypeDropdown.addEventListener("change", updateDisplayedQuestions);
updateDisplayedQuestions();
function createEditableInput(name, value) {
  const input = document.createElement("input");
  input.type = "text";
  input.name = name;
  input.value = value;
  return input;
}

function createNonEditableSpan(value) {
  const span = document.createElement("span");
  span.textContent = value;
  return span;
}
function saveChanges(documentId, newData) {
  firebase.firestore().collection("questions").doc(documentId).update(newData)
    .then(() => {
      alert("Successfully updated!");
      location.reload();
    })
    .catch((error) => {
      alert("Error updating document:", error);
    });
}

function deleteDocument(documentId) {
  firebase.firestore().collection("questions").doc(documentId).delete()
    .then(() => {
      alert("Question successfully deleted!");
      location.reload();
    })
    .catch((error) => {
      alert("Error deleting document:", error);
    });
}


function goBack() {
  window.location.href = "N0pJ3hTgV5cXqAzH6bZ8mVnG1kC.html";
}

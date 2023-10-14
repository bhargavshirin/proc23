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
const collectionName = "quizattempts";
const sheetContainer = document.getElementById("sheet");
const documentSelect = document.getElementById("document-select");
const selectedSubjectDisplay = document.getElementById("selected-subject");

documentSelect.addEventListener("change", () => {
    const selectedDocumentId = documentSelect.value;
    fetchData(selectedDocumentId);
    updateSelectedSubject(selectedDocumentId);
});

function fetchData(documentId) {
    db.collection(collectionName)
        .doc(documentId)
        .get()
        .then((doc) => {
            if (doc.exists) {
                const data = doc.data();
                displayData(data);
            } else {
                console.log("Document not found!");
            }
        })
        .catch((error) => {
            console.error("Error fetching document:", error);
        });
}

function displayData(data) {
    const keys = Object.keys(data);
    const table = document.createElement("table");
    const headerRow = document.createElement("tr");
    const headerCell1 = document.createElement("th");
    headerCell1.textContent = "Roll Numbers";
    headerRow.appendChild(headerCell1);

    const headerCell2 = document.createElement("th");
    headerCell2.textContent = "Attempts";
    headerRow.appendChild(headerCell2);

    table.appendChild(headerRow);

    keys.forEach((key) => {
        const row = document.createElement("tr");

        const fieldCell = document.createElement("td");
        fieldCell.textContent = key;
        row.appendChild(fieldCell);

        const valueCell = document.createElement("td");
        const input = document.createElement("input");
        input.type = "number";
        input.value = data[key];
        valueCell.appendChild(input);
        row.appendChild(valueCell);

        table.appendChild(row);
    });

    // Clear previous content and append the new table
    sheetContainer.innerHTML = '';
    sheetContainer.appendChild(table);
}

function updateSelectedSubject(subject) {
    selectedSubjectDisplay.textContent = `Subject: ${subject}`;
}

sheetContainer.addEventListener("input", event => {
    if (event.target.tagName === "INPUT") {
        const fieldName = event.target.parentNode.parentNode.childNodes[0].textContent;
        const newValue = parseFloat(event.target.value);
        if (!isNaN(newValue)) {
            const selectedDocumentId = documentSelect.value;
            updateFirestoreData(selectedDocumentId, fieldName, newValue);
        }
    }
});


function updateFirestoreData(documentId, fieldName, newValue) {
    const docRef = db.collection(collectionName).doc(documentId);

    docRef.get()
        .then(doc => {
            if (doc.exists) {
                const data = doc.data();
                data[fieldName] = newValue;
                return docRef.update(data);
            } else {
                console.log("Document not found!");
            }
        })
        .then(() => {
            console.log("Value updated successfully");
        })
        .catch(error => {
            console.error("Error updating value:", error);
        });
}

const defaultDocumentId = "Cloud Computing";
fetchData(defaultDocumentId);
updateSelectedSubject(defaultDocumentId);

function goBack() {
    window.location.href = "N0pJ3hTgV5cXqAzH6bZ8mVnG1kC.html";
}
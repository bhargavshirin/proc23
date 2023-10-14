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
const storage = firebase.storage();
const firestore = firebase.firestore();

const uploadImage = () => {
  document.getElementById("loading-spinner").style.display = 'block';
  const imageInput = document.getElementById('imageInput');
  const imageFile = imageInput.files[0];

  const sname = localStorage.getItem("sname");
  const email = localStorage.getItem("email");

  if (!sname || !email) {
    return;
  }

  if (imageFile) {
      if (imageFile.size <= 150 * 1024) {
          const storageRef = storage.ref().child(`images/${imageFile.name}`);
          storageRef.put(imageFile)
            .then(snapshot => storageRef.getDownloadURL())
            .then(imageUrl => {
              console.log('New image URL:', imageUrl);
        
              firestore.collection('emails')
                .where('sname', '==', sname)
                .where('email', '==', email)
                .get()
                .then(querySnapshot => {
                  querySnapshot.forEach(doc => {
                    const oldImageUrl = doc.data().imageUrl;
        
                    if (oldImageUrl) {
                      const oldImageRef = storage.refFromURL(oldImageUrl);
                      oldImageRef.delete()
                        .then(() => console.log('Old image deleted from storage'))
                        .catch(error => console.error('Error deleting old image:', error));
                    }
        
                    doc.ref.update({
                      imageUrl: imageUrl,
                    })
                    .then(() => {
                      console.log('Image URL updated in Firestore');
                      document.getElementById("loading-spinner").style.display = 'none';
                      alert('Image uploaded successfully'); 
                      
                    })
                    .catch(error => console.error('Error updating image URL:', error));
                  });
                })
                .catch(error => console.error('Error querying Firestore:', error));
            })
            .catch(error => console.error('Error getting image download URL:', error));
        } else {
          document.getElementById("loading-spinner").style.display = 'none';
          alert('Image size exceeds 150KB');
         

        }
  } else {
    firestore.collection('emails')
      .where('sname', '==', sname)
      .where('email', '==', email)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          doc.ref.update({
            imageUrl: '', 
          })
          .then(() => console.log('Image URL updated in Firestore'))
          .catch(error => console.error('Error updating image URL:', error));
        });
      })
      .catch(error => console.error('Error querying Firestore:', error));
  }
};

const previewImage = () => {
  const imageInput = document.getElementById('imageInput');
  const imagePreview = document.getElementById('imagePreview');

  const file = imageInput.files[0];
  if (file) {
    const allowedTypes = ['image/jpeg', 'image/png'];

    if (allowedTypes.includes(file.type)) {
      const reader = new FileReader();
      reader.onload = function (e) {
        imagePreview.src = e.target.result;
        imagePreview.style.display = 'block';
        imagePreview.style.width = '100px';
        imagePreview.style.height = '100px';
        imagePreview.style.borderRadius = '50%';
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please select a valid JPG or PNG image.');
      imageInput.value = '';
      imagePreview.style.display = 'none';
    }
  } else {
    imagePreview.style.display = 'none';
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const regnumber = localStorage.getItem("regnumber");
  const sname = localStorage.getItem("sname");
  const email = localStorage.getItem("email");
  const nameInput = document.getElementById("name");
  const snameInput = document.getElementById("regNo");
  const emailInput = document.getElementById("email");

  nameInput.value = sname || "Guest";
  snameInput.value = regnumber || "Guest";
  emailInput.value = email || "Guest";
});

const goBack = () => {
  window.history.back();
};
window.addEventListener('load', function() {
  var spinner = document.getElementById('loading-spinner');
  spinner.style.display = 'none';
});
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
  const storageRef = storage.ref();
  const folderName = "cheaters";

  async function fetchAndDisplayImages() {
    try {
      const folderRef = storageRef.child(folderName);
      const images = await folderRef.listAll();

      // Group images by name
      const groupedImages = images.items.reduce((group, imageRef) => {
        const imageName = imageRef.name;
        if (!group[imageName]) {
          group[imageName] = [];
        }
        group[imageName].push(imageRef);
        return group;
      }, {});

      const imageContainer = document.getElementById("image-container");

      // Loop through grouped images and create image cards
      for (const imageName in groupedImages) {
        const imageRefs = groupedImages[imageName];

        const imageCard = document.createElement("div");
        imageCard.className = "image-card";

        imageRefs.forEach(async (imageRef) => {
          const imageURL = await imageRef.getDownloadURL();

          const image = document.createElement("img");
          image.src = imageURL;
          image.alt = imageName;


          const imageNameElement = document.createElement("p");
          imageNameElement.textContent = imageName;

          const imageContainer = document.createElement("div");
          imageContainer.appendChild(image);
          imageContainer.appendChild(imageNameElement);

          imageCard.appendChild(imageContainer);
        });

        imageContainer.appendChild(imageCard);
      }
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  }

  fetchAndDisplayImages();

  function goBack() {
    window.location.href = "N0pJ3hTgV5cXqAzH6bZ8mVnG1kC.html";
  }

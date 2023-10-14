
//AIzaSyBnRC3NJbAzNiDForAnItHO1cpFBQIpN3A
const apiKey = 'AIzaSyC3c8KGz4nnBVLncJ_M9wZGNVO8n9ibZj8';


const regc = localStorage.getItem('regnumber');
const video = document.createElement('video');
const storage = firebase.storage();
const storageRef = storage.ref();
const MALPRACTICE_URL = "https://sheet.best/api/sheets/c24d0b28-bcab-443a-8344-369e33269500";
const TIMER_DURATION = 3000;

let headTurnTimer;
let noFaceTimer;
let executionCount = 0;

async function captureAndUploadImage(reason, imageData) {
  try {
    const imageName = `${regc}.jpg`;
    const folderRef = storageRef.child("cheaters/");
    const imageRef = folderRef.child(imageName);

    await Promise.all([
      (async () => {
        const response = await fetch(imageData);
        const blob = await response.blob();
        await imageRef.put(blob);
        console.log('Image uploaded successfully');
      })(),

      fetch(MALPRACTICE_URL, {
        method: "POST",
        body: JSON.stringify({
          name: nameInput.value,
          score: "Cheated",
          date: currentDate,
          time: currentTime,
          malpractice: reason,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }),
    ]);
    executionCount++;
    // if (executionCount >= 2) {
    //   window.location.href = "main.html";
    // }
  } catch (error) {
    console.error('Error uploading image or fetching:', error);
    // window.location.href = "main.html";
  }
}

function logMalpractice(reason, imageData) {
  captureAndUploadImage(reason, imageData);
}

function handleViolation(reason, imageData) {
  showCustomAlert(reason);
  logMalpractice(reason, imageData);
}

async function startVideo() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    video.style.position = 'fixed';
    video.style.left = '0';
    video.style.top = '0';
    video.style.width = '300px';
    video.style.height = '300px';
    video.style.marginTop = '70px';
    video.style.marginLeft = '40px';
    video.style.borderRadius = '20px';
    // video.style.border = '2px solid red';




    video.style.display = 'none';
    document.body.appendChild(video);

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    video.addEventListener('play', function () {
      setInterval(function () {
        if (video.paused || video.ended) return;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        processImage(imageData);
      }, 800);
    });
    video.play();
  } catch (err) {
    console.error('Error starting video:', err);
  }
}

async function processImage(imageData) {
  const base64Image = imageData.split(',')[1];

  const response = await fetch('https://vision.googleapis.com/v1/images:annotate?key=' + apiKey, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      requests: [
        {
          image: {
            content: base64Image,
          },
          features: [
            {
              type: 'FACE_DETECTION',
            },
            {
              type: 'OBJECT_LOCALIZATION',
            },
          ],
        },
      ],
    }),
  });

  const data = await response.json();
  const faces = data.responses[0].faceAnnotations;
  const objects = data.responses[0].localizedObjectAnnotations;
  if (faces && faces.length >= 2) {
    handleViolation("Multiple Persons Detected", imageData);
  }
  if (faces && faces.length > 0) {
    const face = faces[0];
    const panAngle = face.panAngle;
    const pitchAngle = face.tiltAngle;

    if (Math.abs(panAngle) > 30) {
      if (!headTurnTimer) {
        headTurnTimer = setTimeout(() => handleHeadTurn(imageData), TIMER_DURATION);
      }
    } else {
      clearTimeout(headTurnTimer);
      headTurnTimer = null;
    }
    clearTimeout(noFaceTimer);
    if (Math.abs(pitchAngle) > 30) {
      handleViolation("Head Down Detected", imageData);
    }
  } else {
    clearTimeout(headTurnTimer);

    if (!noFaceTimer) {
      noFaceTimer = setTimeout(() => handleNoFaceDetected(imageData), TIMER_DURATION);
    }
  }

  if (objects && objects.length > 0) {
    const objectLabels = objects.map((obj) => obj.name.toLowerCase());
    if (objectLabels.includes('paper')) {
      handleViolation("Paper and Pen Detected", imageData);
    }
    if (objectLabels.includes('mobile phone')) {
      handleViolation("Mobile Phone Detected", imageData);
    }
  }
}

function handleHeadTurn(imageData) {
  handleViolation("Turned Head for more than " + (TIMER_DURATION / 1000) + " seconds", imageData);
  clearTimeout(headTurnTimer);
  headTurnTimer = null;
}

function handleNoFaceDetected(imageData) {
  handleViolation("No Face Detected for more than " + (TIMER_DURATION / 1000) + " seconds", imageData);
  clearTimeout(noFaceTimer);
  noFaceTimer = null;
}

var isCameraOn = false;

function checkCameraStatus() {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(function (stream) {
      var videoTrack = stream.getVideoTracks()[0];

      if (videoTrack.enabled && !isCameraOn) {
        console.log('Camera verified');
        isCameraOn = true;
      } else if (!videoTrack.enabled && isCameraOn) {
        console.log('camera not detected');
        showCustomAlert('Please turn on your camera');
        window.location.href = "main.html";
        isCameraOn = false;
      }
    })
    .catch(function (err) {
      console.error('Error: ' + err);
      isCameraOn = false;
      showCustomAlert('Please Turn on your camera');
      window.location.href = "main.html";
    });
}

checkCameraStatus();

startVideo();

setInterval(checkCameraStatus, 2000);
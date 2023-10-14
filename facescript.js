const video = document.getElementById("video");

Promise.all([
  faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
  faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
  faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
]).then(startVideo);

async function startVideo() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
  } catch (error) {
    console.error("Error accessing the camera:", error);
  }
}

function getLabeledFaceDescriptions() {
  const labels = ["BU21CSEN0300231", "BU21CSEN0500246", "BU21CSCI0100014"];
  return Promise.all(
    labels.map(async (label) => {
      const descriptions = [];
      for (let i = 1; i <= 2; i++) {
        const img = await faceapi.fetchImage(`labels/${label}/${i}.png`);
        const detections = await faceapi
          .detectSingleFace(img)
          .withFaceLandmarks()
          .withFaceDescriptor();
        descriptions.push(detections.descriptor);
      }
      return new faceapi.LabeledFaceDescriptors(label, descriptions);
    })
  );
}

video.addEventListener("play", async () => {
  const labeledFaceDescriptors = await getLabeledFaceDescriptions();
  const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors);

  const canvas = faceapi.createCanvasFromMedia(video);
  document.body.append(canvas);

  const displaySize = { width: video.videoWidth, height: video.videoHeight };
  faceapi.matchDimensions(canvas, displaySize);

  const labelInput = document.getElementById("labelInput");

  setInterval(async () => {
    const detections = await faceapi
      .detectAllFaces(video)
      .withFaceLandmarks()
      .withFaceDescriptors();

    const resizedDetections = faceapi.resizeResults(detections, displaySize);

    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);

    const results = resizedDetections.map((d) => {
      return faceMatcher.findBestMatch(d.descriptor);
    });

    if (results.length > 0) {
      const label = results[0].toString();
      labelInput.value = label;
    } 
    else {
      labelInput.value = "";
      document.getElementById("veri").innerText = "Unable to verify the user";
    }

    results.forEach((result, i) => {
      const box = resizedDetections[i].detection.box;
      const drawBox = new faceapi.draw.DrawBox(box, {
        label: result.toString(),
      });
      drawBox.draw(canvas);
    });
  }, 100);
});

function getQueryParam(quiz) {
  const urlSearchParams = new URLSearchParams(window.location.search);
  return urlSearchParams.get(quiz);
}

function redirectToOtherPage() {
  const quizParamValue = getQueryParam("quiz");

  if (quizParamValue) {
    const url = "http://127.0.0.1:5500/" + quizParamValue;
    window.location.href = url;
  }
}

document.addEventListener("DOMContentLoaded", function () {
  let inputElement = document.getElementById("labelInput");
  let consecutiveFailures = 0;
  let authorizedTime = 0;
  let authorizedLabel = "BU21CSEN0300231";

  function extractBaseValue(value) {
    return value.replace(/\(.+\)/, '').trim();
  }

  function checkInputValue() {
    const currentValue = extractBaseValue(inputElement.value);

    if (currentValue === authorizedLabel) {
      consecutiveFailures = 0;
      authorizedTime += 1;
  
      if (authorizedTime >= 5) {
        redirectToOtherPage();
      }
    } else {
      consecutiveFailures++;
      authorizedTime = 0;
      if (consecutiveFailures >= 5) {
        alert("Warning, Unauthorized access!!");
        consecutiveFailures = 0;
        location.reload();
      }
    }

    setTimeout(checkInputValue, 1000);
  }

  navigator.mediaDevices.getUserMedia({ video: true })
    .then(function () {
      checkInputValue();
    })
    .catch(function (error) {
      console.error("Error accessing the camera:", error);
    });
});

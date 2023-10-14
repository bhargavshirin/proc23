const options = { timeZone: 'Asia/Kolkata', hour12: false };
const currentDate = new Date().toLocaleDateString('en-IN', options);
const opt = {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: true
};
const currentTime = new Date().toLocaleTimeString('en-IN', opt);
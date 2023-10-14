document.addEventListener('contextmenu', event => event.preventDefault());
document.addEventListener('touchstart', event => {
  if (event.touches.length > 1) {
    event.preventDefault();
   
  }
}, { passive: false });
document.addEventListener('keydown', event => {
  if (event.ctrlKey && (event.keyCode === 67 || event.keyCode === 88)) {
    event.preventDefault();
    alert('This Action is not allowed!');
  }
});
document.addEventListener('keydown', function (event) {
  if (event.ctrlKey && (event.key === 'c' || event.key === 'C')) {
    event.preventDefault();
    alert('This Action is not allowed!');
  }
});
document.addEventListener('keydown', function (event) {
  if ((event.ctrlKey || event.metaKey) && (event.key === 'c' || event.key === 'C')) {
    event.preventDefault();
    alert('This Action is not allowed!');
  }
});
document.addEventListener('keydown', function (event) {
  if (event.ctrlKey || event.metaKey) {
    switch (String.fromCharCode(event.which).toLowerCase()) {
      case 'c':
        event.preventDefault();
        alert('This Action is not allowed!');
        break;
    }
  }
});
const blackDiv = document.getElementById('blackDiv');

document.addEventListener('mouseout', (event) => {
    if (event.relatedTarget === null) {
        blackDiv.style.display = 'block';
    }
});

document.addEventListener('mouseover', () => {
    blackDiv.style.display = 'none';
});
/** TO DISABLE SCREEN CAPTURE **/
document.addEventListener('keyup', (e) => {
  if (e.key == 'PrintScreen') {
      navigator.clipboard.writeText('');
      alert('Not Allowed due to security reasons!');
  }
});

/** TO DISABLE PRINTS WHIT CTRL+P **/
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.key == 'p') {
      alert('This section is not allowed to print or export to PDF');
      e.cancelBubble = true;
      e.preventDefault();
      e.stopImmediatePropagation();
  }
});


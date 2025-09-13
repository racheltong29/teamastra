const egg = document.getElementById('egg');
const cat = document.getElementById('cat');
const wishBtn = document.getElementById('wishBtn');
const celebration = document.getElementById('celebration');
const resultText = document.getElementById('resultText');
const resultImage = document.getElementById('resultImage');
const okayBtn = document.getElementById('okayBtn');

const cats = ['cat.png', 'cat2.png'];

if (localStorage.getItem('cat') === null) {
  localStorage.setItem('cat',0);
}
if (localStorage.getItem('cat2') === null) {
  localStorage.setItem('cat2',0);
}


if (localStorage.getItem('wishTickets') === null) {
  localStorage.setItem('wishTickets',5);
}
let wishTickets = localStorage.getItem('wishTickets');

const ticketDisplay = document.getElementById('ticketCount');
ticketDisplay.textContent = `🎟️ Tickets: ${wishTickets}`;
//localStorage.setItem('wishTickets', wishTickets);

wishBtn.addEventListener('click', () => {
  if (wishTickets <= 0) {
    alert('No more wish tickets!');
    return;
  }

  wishTickets--;
  localStorage.setItem('wishTickets', wishTickets);
  ticketDisplay.textContent = `🎟️ Tickets: ${wishTickets}`;
  egg.src = 'egg_cracked.png';

  setTimeout(() => {
    const chosenCat = cats[Math.floor(Math.random() * cats.length)];
    resultText.textContent = `🎉 You got ${chosenCat === 'cat.png' ? 'Cat 1' : 'Cat 2'}!`;
    if(chosenCat==='cat.png'){
      localStorage.setItem('cat',parseInt(localStorage.getItem('cat'))+1);
    }
    else{
      localStorage.setItem('cat2',parseInt(localStorage.getItem('cat2'))+1);
    }
    resultImage.src = chosenCat;
    celebration.style.display = 'flex';

    // Hide egg and cat during celebration
    egg.style.display = 'none';
    cat.style.display = 'none';
  }, 1000);
});

okayBtn.addEventListener('click', () => {
  celebration.style.display = 'none';
  egg.src = 'egg.png';
  egg.style.display = 'block';
});

// toggleSidebar function moved to shared-scripts.js

const egg = document.getElementById('egg');
const cat = document.getElementById('cat');
const wishBtn = document.getElementById('wishBtn');
const celebration = document.getElementById('celebration');
const resultText = document.getElementById('resultText');
const resultImage = document.getElementById('resultImage');
const okayBtn = document.getElementById('okayBtn');

const cats = ['cats/cat1.png', 'cats/cat2.png', 'cats/cat3.png', 'cats/cat4.png', 'cats/cat5.png', 'cats/cat6.png','cats/ghostCat.gif'];
const catsNames = ['obedient cat', 'sleepy cat', 'angry cat', 'stupid cat', 'big back cat', 'shhhh kitty', 'ghosty kity'];

for(let i = 0; i < cats.length; i++){
  if (localStorage.getItem(cats[i]) === null) {
    localStorage.setItem(cats[i],0);
  }
}


if (localStorage.getItem('wishTickets') === null) {
  localStorage.setItem('wishTickets',5);
}
let wishTickets = localStorage.getItem('wishTickets');

const ticketDisplay = document.getElementById('ticketCount');
ticketDisplay.textContent = `🎟️ Tickets: ${wishTickets}`;

//const starDisplay = document.getElementById('stars');
//starDisplay.textContent = localStorage.getItem('stars') || 0;
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
    const chosenCatIdx = Math.floor(Math.random() * cats.length);
    const chosenCat = cats[chosenCatIdx];
    resultText.textContent = `🎉 You got ${catsNames[chosenCatIdx]}!`;
    localStorage.setItem(chosenCat,parseInt(localStorage.getItem(chosenCat))+1);
    
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

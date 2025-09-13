const egg = document.getElementById('egg');
const cat = document.getElementById('cat');
const wishBtn = document.getElementById('wishBtn');
const celebration = document.getElementById('celebration');
const resultText = document.getElementById('resultText');
const resultImage = document.getElementById('resultImage');
const okayBtn = document.getElementById('okayBtn');

const cats = ['cat.png', 'cat2.png'];

let wishTickets = 5; // Starting number of tickets
const ticketDisplay = document.getElementById('ticketCount');
ticketDisplay.textContent = `🎟️ Tickets: ${wishTickets}`;

wishBtn.addEventListener('click', () => {
  if (wishTickets <= 0) {
    alert('No more wish tickets!');
    return;
  }

  wishTickets--;
  ticketDisplay.textContent = `🎟️ Tickets: ${wishTickets}`;
  egg.src = 'egg_cracked.png';

  setTimeout(() => {
    const chosenCat = cats[Math.floor(Math.random() * cats.length)];
    resultText.textContent = `🎉 You got ${chosenCat === 'cat.png' ? 'Cat 1' : 'Cat 2'}!`;
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

function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  if (sidebar.style.left === '0px') {
    sidebar.style.left = '-200px';
  } else {
    sidebar.style.left = '0px';
  }
}

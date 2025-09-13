const cat = document.getElementById('cat');
let direction = 1;
let position = 0;

function walkCat() {
  position += direction * 2;
  if (position > window.innerWidth - 100 || position < 0) {
    direction *= -1;
    cat.style.transform = direction === 1 ? 'scaleX(1)' : 'scaleX(-1)';
  }
  cat.style.left = position + 'px';
  requestAnimationFrame(walkCat);
}

function spawnCat(name) {
  const garden = document.getElementById('garden');
  const cat = document.createElement('img');

  cat.src = name;
  cat.alt = 'Cute Cat';
  cat.className = 'walking-cat';

  // Random vertical position within garden
  const gardenHeight = garden.offsetHeight;
  const gardenWidth = garden.offsetWidth;
  const randomBottom = Math.floor(Math.random() * (gardenHeight - 120)) + 20; // Keep cats within bounds

  // Initial styles
  cat.style.position = 'absolute';
  cat.style.left = '0px';
  cat.style.bottom = `${randomBottom}px`;
  cat.style.width = '100px';
  cat.style.height = 'auto';
  cat.style.transition = 'transform 0.5s';
  cat.style.zIndex = '10'; // Ensure cats appear on top of background
  cat.style.filter = 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))'; // Add shadow for better visibility

  garden.appendChild(cat);

  // Random speed and direction
  let direction = Math.random() < 0.5 ? -1 : 1;
  let position = Math.floor(Math.random() * (gardenWidth - 100));
  let speed = Math.random() * 1.5 + 0.5; // Between 0.5 and 2.0 pixels per frame

  cat.style.left = position + 'px';
  cat.style.transform = direction === 1 ? 'scaleX(1)' : 'scaleX(-1)';

  // Optional: random delay before starting
  const delay = Math.random() * 1000;

  setTimeout(() => {
    function animateCat() {
      position += direction * speed;
        const maxRight = gardenWidth - 100;
        const minLeft = 0;

        if (position >= maxRight) {
        position = maxRight;
        direction = -1;
        cat.style.transform = 'scaleX(-1)';
        } else if (position <= minLeft) {
        position = minLeft;
        direction = 1;
        cat.style.transform = 'scaleX(1)';
        }
      cat.style.left = position + 'px';
      requestAnimationFrame(animateCat);
    }

    animateCat();
  }, delay);
}

// toggleSidebar function moved to shared-scripts.js

// Available cat images
const catImages = [
  'cats/cat1.png',
  'cats/cat2.png', 
  'cats/cat3.png',
  'cats/cat4.png',
  'cats/cat5.png',
  'cats/cat6.png',
  'cats/Classical/IdleCat.png',
  'cats/BlackCat/IdleCatb.png',
  'cats/Brown/IdleCattt.png',
  'cats/White/IdleCatttt.png',
  'cats/Siamese/IdleCattt.png',
  'cats/TigerCatFree/IdleCatt.png',
  'cats/ThreeColorFree/IdleCatt.png',
  'cats/BatmanCatFree/IdleCatt.png',
  'cats/DemonicFree/IdleCatd.png',
  'cats/EgyptCatFree/IdleCatb.png',
  'cats/Xmas/Idle2Cattt.png'
];

const cats = ['cats/cat1.png', 'cats/cat2.png', 'cats/cat3.png', 'cats/cat4.png', 'cats/cat5.png', 'cats/cat6.png','cats/ghostCat.gif','cats/whiteCat.gif'];
let noCats = true;

for(let i = 0; i < cats.length; i++){
  for(let j = 0; j < parseInt(localStorage.getItem(cats[i]))||0; j++){
    spawnCat(cats[i]);
    noCats = false;
  }
}

for(let i = 0; i < cats.length; i++){
  if (localStorage.getItem(cats[i]) === null) {
    localStorage.setItem(cats[i],0);
  }
}

if(noCats){
  const chosenCatIdx = Math.floor(Math.random() * cats.length);
  const chosenCat = cats[chosenCatIdx];
  localStorage.setItem(chosenCat,parseInt(localStorage.getItem(chosenCat))+1);
  spawnCat(chosenCat);
}

//walkCat();
//spawnCat();
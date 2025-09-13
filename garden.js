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

  // Random vertical position
  const gardenHeight = garden.offsetHeight;
  const randomBottom = Math.floor(Math.random() * (gardenHeight - 100));

  // Initial styles
  cat.style.position = 'absolute';
  cat.style.left = '0px';
  cat.style.bottom = `${randomBottom}px`;
  cat.style.width = '100px';
  cat.style.transition = 'transform 0.5s';

  garden.appendChild(cat);

  // Random speed and direction
  let direction = Math.random() < 0.5 ? -1 : 1;
  let position = Math.floor(Math.random() * window.innerWidth);
  let speed = Math.random() * 1.5 + 0.5; // Between 0.5 and 2.0 pixels per frame

  cat.style.left = position + 'px';
  cat.style.transform = direction === 1 ? 'scaleX(1)' : 'scaleX(-1)';

  // Optional: random delay before starting
  const delay = Math.random() * 1000;

  setTimeout(() => {
    function animateCat() {
      position += direction * speed;
        const maxRight = window.innerWidth - 100;
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

const cats = ['cats/cat1.png', 'cats/cat2.png', 'cats/cat3.png', 'cats/cat4.png', 'cats/cat5.png', 'cats/cat6.png','cats/ghostCat.gif'];
for(let i = 0; i < cats.length; i++){
  for(let j = 0; j < parseInt(localStorage.getItem(cats[i]))||0; j++){
    spawnCat(cats[i]);
  }
}

//walkCat();
//spawnCat();
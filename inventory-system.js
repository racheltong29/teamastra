// ========================================
// INVENTORY SYSTEM FOR GARDEN PAGE
// ========================================

let inventoryOpen = false;
let draggedItem = null;

// Initialize inventory system
document.addEventListener('DOMContentLoaded', function() {
  createInventoryButton();
  createInventoryPopup();
  updateInventoryDisplay();
  initializeDragAndDrop();
});

// Create inventory button
function createInventoryButton() {
  const inventoryBtn = document.createElement('button');
  inventoryBtn.id = 'inventoryBtn';
  inventoryBtn.innerHTML = '📦';
  inventoryBtn.className = 'inventory-btn';
  inventoryBtn.onclick = toggleInventory;
  
  // Position the button
  inventoryBtn.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 1000;
    background: var(--gradient-candy);
    border: none;
    border-radius: 50%;
    width: 60px;
    height: 60px;
    font-size: 1.5rem;
    cursor: pointer;
    box-shadow: var(--shadow-soft);
    transition: all 0.3s ease;
  `;
  
  inventoryBtn.addEventListener('mouseenter', function() {
    this.style.transform = 'scale(1.1)';
  });
  
  inventoryBtn.addEventListener('mouseleave', function() {
    this.style.transform = 'scale(1)';
  });
  
  document.body.appendChild(inventoryBtn);
}

// Create inventory popup
function createInventoryPopup() {
  const popup = document.createElement('div');
  popup.id = 'inventoryPopup';
  popup.className = 'inventory-popup hidden';
  
  popup.innerHTML = `
    <div class="inventory-content">
      <div class="inventory-header">
        <h3>📦 Inventory</h3>
        <button class="inventory-close-btn" onclick="toggleInventory()">✕</button>
      </div>
      <div class="inventory-items" id="inventoryItems">
        <!-- Items will be populated here -->
      </div>
      <div class="inventory-empty" id="inventoryEmpty" style="display: none;">
        <p>Your inventory is empty!</p>
        <p>Visit the shop to buy some food for your cats.</p>
      </div>
    </div>
  `;
  
  // Style the popup
  popup.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: var(--bg-cream);
    border: 3px solid var(--primary-pink);
    border-radius: var(--radius-large);
    box-shadow: var(--shadow-strong);
    z-index: 2000;
    min-width: 400px;
    max-width: 600px;
    max-height: 80vh;
    overflow-y: auto;
  `;
  
  document.body.appendChild(popup);
}

// Toggle inventory popup
function toggleInventory() {
  const popup = document.getElementById('inventoryPopup');
  const btn = document.getElementById('inventoryBtn');
  
  inventoryOpen = !inventoryOpen;
  
  if (inventoryOpen) {
    popup.classList.remove('hidden');
    btn.innerHTML = '✕';
    btn.title = 'Close Inventory';
    updateInventoryDisplay();
  } else {
    popup.classList.add('hidden');
    btn.innerHTML = '📦';
    btn.title = 'Open Inventory';
  }
}

// Update inventory display
function updateInventoryDisplay() {
  const itemsContainer = document.getElementById('inventoryItems');
  const emptyContainer = document.getElementById('inventoryEmpty');
  
  if (!itemsContainer) return;
  
  const inventory = dataManager.getInventory();
  const items = Object.keys(inventory).filter(item => inventory[item] > 0);
  
  if (items.length === 0) {
    itemsContainer.style.display = 'none';
    emptyContainer.style.display = 'block';
    return;
  }
  
  itemsContainer.style.display = 'block';
  emptyContainer.style.display = 'none';
  
  itemsContainer.innerHTML = items.map(item => {
    const quantity = inventory[item];
    return `
      <div class="inventory-item" draggable="true" data-item="${item}" data-quantity="${quantity}">
        <img src="shop_items/${getItemImage(item)}" alt="${item}" class="item-image">
        <div class="item-info">
          <h4>${item}</h4>
          <p>Quantity: ${quantity}</p>
        </div>
      </div>
    `;
  }).join('');
}

// Get item image filename
function getItemImage(itemName) {
  const imageMap = {
    'Apple Pie': '05_apple_pie.png',
    'Bacon': '13_bacon.png',
    'Burger': '15_burger.png',
    'Cheesecake': '22_cheesecake.png',
    'Chocolate': '26_chocolate.png',
    'Cookies': '28_cookies.png',
    'Donut': '34_donut.png',
    'Ice Cream': '57_icecream.png',
    'Pizza': '81_pizza.png',
    'Sushi': '97_sushi.png',
    'Taco': '99_taco.png',
    'Waffle': '101_waffle.png'
  };
  return imageMap[itemName] || '01_dish.png';
}

// Initialize drag and drop
function initializeDragAndDrop() {
  const garden = document.getElementById('garden');
  
  // Drag start
  document.addEventListener('dragstart', function(e) {
    if (e.target.classList.contains('inventory-item')) {
      draggedItem = {
        name: e.target.dataset.item,
        quantity: parseInt(e.target.dataset.quantity)
      };
      e.target.style.opacity = '0.5';
    }
  });
  
  // Drag end
  document.addEventListener('dragend', function(e) {
    if (e.target.classList.contains('inventory-item')) {
      e.target.style.opacity = '1';
    }
  });
  
  // Drag over garden
  garden.addEventListener('dragover', function(e) {
    e.preventDefault();
    garden.style.border = '3px dashed var(--primary-pink)';
  });
  
  // Drag leave garden
  garden.addEventListener('dragleave', function(e) {
    garden.style.border = '3px solid var(--primary-pink)';
  });
  
  // Drop on garden
  garden.addEventListener('drop', function(e) {
    e.preventDefault();
    garden.style.border = '3px solid var(--primary-pink)';
    
    if (draggedItem) {
      feedCats(draggedItem);
    }
  });
}

// Feed cats with item
function feedCats(item) {
  if (!dataManager.removeFromInventory(item.name, 1)) {
    showNotification('Not enough items!', 'error');
    return;
  }
  
  // Find a random cat to feed
  const cats = document.querySelectorAll('.walking-cat');
  if (cats.length === 0) {
    showNotification('No cats in the garden to feed!', 'error');
    dataManager.addToInventory(item.name, 1); // Return the item
    return;
  }
  
  const randomCat = cats[Math.floor(Math.random() * cats.length)];
  const catRect = randomCat.getBoundingClientRect();
  const gardenRect = document.getElementById('garden').getBoundingClientRect();
  
  // Create food item at cat's position
  const foodItem = document.createElement('div');
  foodItem.className = 'food-item';
  foodItem.innerHTML = `<img src="shop_items/${getItemImage(item.name)}" alt="${item.name}">`;
  
  foodItem.style.cssText = `
    position: absolute;
    left: ${catRect.left - gardenRect.left}px;
    top: ${catRect.top - gardenRect.top}px;
    width: 40px;
    height: 40px;
    z-index: 10;
    pointer-events: none;
  `;
  
  document.getElementById('garden').appendChild(foodItem);
  
  // Animate cat walking to food
  animateCatFeeding(randomCat, foodItem, item);
  
  // Update inventory display
  updateInventoryDisplay();
  
  // Show notification
  showNotification(`Fed the cats with ${item.name}!`, 'success');
}

// Animate cat feeding
function animateCatFeeding(cat, foodItem, item) {
  const foodRect = foodItem.getBoundingClientRect();
  const catRect = cat.getBoundingClientRect();
  const gardenRect = document.getElementById('garden').getBoundingClientRect();
  
  // Calculate distance to food
  const distance = Math.sqrt(
    Math.pow(foodRect.left - catRect.left, 2) + 
    Math.pow(foodRect.top - catRect.top, 2)
  );
  
  // Move cat towards food
  const duration = Math.min(distance / 100, 2000); // Max 2 seconds
  
  cat.style.transition = `all ${duration}ms ease-in-out`;
  cat.style.left = `${foodRect.left - gardenRect.left}px`;
  cat.style.top = `${foodRect.top - gardenRect.top}px`;
  
  // Start eating animation after cat reaches food
  setTimeout(() => {
    startEatingAnimation(foodItem, item);
  }, duration);
}

// Start eating animation
function startEatingAnimation(foodItem, item) {
  let opacity = 1;
  const fadeInterval = setInterval(() => {
    opacity -= 0.1;
    foodItem.style.opacity = opacity;
    
    if (opacity <= 0) {
      clearInterval(fadeInterval);
      foodItem.remove();
      
      // Add XP for feeding cats
      dataManager.addXP(5);
      dataManager.addStars(2);
    }
  }, 300); // Fade every 300ms (3 increments total)
}

// Add CSS for inventory system
const inventoryStyles = document.createElement('style');
inventoryStyles.textContent = `
  .inventory-popup.hidden {
    display: none;
  }
  
  .inventory-content {
    padding: 2rem;
  }
  
  .inventory-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 2px solid var(--primary-pink);
  }
  
  .inventory-header h3 {
    font-family: 'Press Start 2P', cursive;
    color: var(--primary-pink);
    margin: 0;
    font-size: 1.2rem;
  }
  
  .inventory-close-btn {
    background: var(--primary-pink);
    color: var(--text-white);
    border: none;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .inventory-close-btn:hover {
    background: var(--primary-blue);
    transform: scale(1.1);
  }
  
  .inventory-items {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 1rem;
  }
  
  .inventory-item {
    background: rgba(255, 255, 255, 0.9);
    border: 2px solid rgba(255, 107, 157, 0.3);
    border-radius: var(--radius-medium);
    padding: 1rem;
    cursor: grab;
    transition: all 0.3s ease;
    text-align: center;
  }
  
  .inventory-item:hover {
    border-color: var(--primary-pink);
    transform: translateY(-2px);
    box-shadow: var(--shadow-soft);
  }
  
  .inventory-item:active {
    cursor: grabbing;
  }
  
  .item-image {
    width: 60px;
    height: 60px;
    object-fit: contain;
    margin-bottom: 0.5rem;
  }
  
  .item-info h4 {
    font-family: 'Orbitron', monospace;
    font-size: 0.9rem;
    color: var(--text-dark);
    margin: 0 0 0.5rem 0;
  }
  
  .item-info p {
    font-family: 'Orbitron', monospace;
    font-size: 0.8rem;
    color: var(--text-medium);
    margin: 0;
  }
  
  .inventory-empty {
    text-align: center;
    padding: 2rem;
    color: var(--text-medium);
  }
  
  .inventory-empty p {
    font-family: 'Orbitron', monospace;
    margin: 0.5rem 0;
  }
  
  .food-item {
    animation: foodBounce 0.5s ease;
  }
  
  @keyframes foodBounce {
    0% { transform: scale(0.5); }
    50% { transform: scale(1.2); }
    100% { transform: scale(1); }
  }
`;
document.head.appendChild(inventoryStyles);

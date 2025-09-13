const items = [
  { name: "Apple Pie", price: 20, img: "shop_items/05_apple_pie.png" },
  { name: "Bacon", price: 15, img: "shop_items/13_bacon.png" },
  { name: "Burger", price: 25, img: "shop_items/15_burger.png" },
  { name: "Cheesecake", price: 30, img: "shop_items/22_cheesecake.png" },
  { name: "Chocolate", price: 18, img: "shop_items/26_chocolate.png" },
  { name: "Cookies", price: 12, img: "shop_items/28_cookies.png" },
  { name: "Donut", price: 16, img: "shop_items/34_donut.png" },
  { name: "Ice Cream", price: 22, img: "shop_items/57_icecream.png" },
  { name: "Pizza", price: 35, img: "shop_items/81_pizza.png" },
  { name: "Sushi", price: 40, img: "shop_items/97_sushi.png" },
  { name: "Taco", price: 20, img: "shop_items/99_taco.png" },
  { name: "Waffle", price: 18, img: "shop_items/101_waffle.png" }
];

// Initialize with data manager
document.addEventListener('DOMContentLoaded', function() {
  updateStarDisplay();
});

function updateStarDisplay() {
  // Stars are now handled by star-system.js
  syncStars();
}

const shopContainer = document.getElementById("shop-container");

items.forEach(item => {
  const card = document.createElement("div");
  card.className = "item-card";

  card.innerHTML = `
    <img src="${item.img}" alt="${item.name}" style="width: 80px; height: 80px; object-fit: contain; margin-bottom: 1rem;">
    <h3>${item.name}</h3>
    <p class="price">${item.price} ⭐</p>
    <button class="buy-btn" onclick="buyItem('${item.name}', ${item.price})">Buy</button>
  `;

  shopContainer.appendChild(card);
});

function buyItem(name, price) {
  if (spendStars(price)) {
    // Add to inventory using dataManager
    dataManager.addToInventory(name, 1);
    
    // Update star display
    updateStarDisplay();
    
    // Show success message
    showNotification(`You bought ${name}! Check your inventory in the garden.`, 'success');
  } else {
    showNotification("Not enough stars!", 'error');
  }
}

// Buy wish ticket function
function buyWishTicket() {
  const ticketPrice = 10;
  
  if (spendStars(ticketPrice)) {
    // Add wish ticket to localStorage
    let wishTickets = parseInt(localStorage.getItem('wishTickets')) || 0;
    wishTickets += 1;
    localStorage.setItem('wishTickets', wishTickets);
    
    // Update star display
    updateStarDisplay();
    
    // Show success message
    showNotification(`You bought a Wish Ticket! You now have ${wishTickets} tickets.`, 'success');
  } else {
    showNotification("Not enough stars! You need 10 stars to buy a ticket.", 'error');
  }
}


// toggleSidebar function moved to shared-scripts.js

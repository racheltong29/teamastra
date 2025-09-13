const items = [
  { name: "Fish", price: 20, img: "🐟" },
  { name: "Toy", price: 15, img: "🧸" },
  { name: "Yarn", price: 10, img: "🧶" },
  { name: "Ticket", price: 25, img: "🎟️" }
];

let stars = parseInt(localStorage.getItem("stars")) || 100;
let ownedItems = JSON.parse(localStorage.getItem("ownedItems")) || [];

document.getElementById("star-count").textContent = stars;

const shopContainer = document.getElementById("shop-container");

items.forEach(item => {
  const card = document.createElement("div");
  card.className = "item-card";

  card.innerHTML = `
    <div style="font-size: 2rem;">${item.img}</div>
    <h3>${item.name}</h3>
    <p>${item.price} ⭐</p>
    <button onclick="buyItem('${item.name}', ${item.price})">Buy</button>
  `;

  shopContainer.appendChild(card);
});

function buyItem(name, price) {
  if (stars >= price) {
    stars -= price;
    ownedItems.push(name);
    localStorage.setItem("stars", stars);
    localStorage.setItem("ownedItems", JSON.stringify(ownedItems));
    document.getElementById("star-count").textContent = stars;
    alert(`You bought a ${name}!`);
  } else {
    alert("Not enough stars!");
  }
}


function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  if (sidebar.style.left === '0px') {
    sidebar.style.left = '-200px';
  } else {
    sidebar.style.left = '0px';
  }
}

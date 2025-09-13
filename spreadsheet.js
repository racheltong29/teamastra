let xp = 0;
let stars = 0;

// Elements
const starsEl = document.getElementById("stars");
const xpEl = document.getElementById("xp");
const tableBody = document.querySelector("#jobTable tbody");
const addRowBtn = document.getElementById("addRowBtn");

// Modal elements
const catModal = document.getElementById("catModal");
const closeCatModal = document.getElementById("closeCatModal");

// Job status options in order
const statusOptions = ["Applying", "Applied", "Interview", "Offer", "Accepted", "Rejected"];

// Rewards for progressing
const rewards = {
  "Applied": { xp: 30, stars: 15 },
  "Interview": { xp: 50, stars: 25 },
  "Offer": { xp: 80, stars: 40 },
  "Accepted": { xp: 100, stars: 50 },
  "Rejected": { xp: 100, stars: 0 }
};

// Add row
addRowBtn.addEventListener("click", () => {
  const row = document.createElement("tr");

  row.innerHTML = `
    <td><input type="text" placeholder="e.g. Software Engineer"></td>
    <td><input type="text" placeholder="Company"></td>
    <td>
      <select>
        ${statusOptions.map(s => `<option value="${s}">${s}</option>`).join("")}
      </select>
    </td>
    <td><input type="number" placeholder="Salary"></td>
    <td>
      <select>
        <option>High</option>
        <option>Medium</option>
        <option>Low</option>
      </select>
    </td>
    <td class="reward-cell">—</td>
    <td><button class="delete-btn"><i class="fas fa-trash"></i></button></td>
  `;

  // Delete button
  row.querySelector(".delete-btn").addEventListener("click", () => {
    row.remove();
  });

  // Track status progress
  const statusSelect = row.querySelector("select");
  let lastIndex = 0;

  statusSelect.addEventListener("change", (e) => {
    const newStatus = e.target.value;
    const newIndex = statusOptions.indexOf(newStatus);

    if (newStatus === "Rejected") {
      // Show cat modal
      catModal.classList.add("show");
    }
    if (newIndex > lastIndex && rewards[newStatus]) {
      // Only reward if moved forward
      const { xp: xpAmount, stars: starAmount } = rewards[newStatus];
      addRewards(xpAmount, starAmount);
      row.querySelector(".reward-cell").textContent = `+${starAmount}⭐ +${xpAmount}XP`;
    }

    lastIndex = newIndex;
  });

  tableBody.appendChild(row);
});

// Rewards
function addRewards(xpAmount, starAmount) {
  xp += xpAmount;
  stars += starAmount;
  starsEl.textContent = stars;
  xpEl.textContent = xp + " XP";
}

// Close modal
closeCatModal.addEventListener("click", () => {
  catModal.classList.remove("show");
});
catModal.addEventListener("click", (e) => {
  if (e.target.id === "catModal") catModal.classList.remove("show");
});

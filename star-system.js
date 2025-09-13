// ========================================
// UNIFIED STAR SYSTEM
// Based on spreadsheet.js implementation
// ========================================

// Global star management
let stars = parseInt(localStorage.getItem('stars')) || 0;

// Initialize stars if not set
if (localStorage.getItem('stars') === null) {
  localStorage.setItem('stars', '0');
  stars = 0;
}

// Update stars display across all pages
function updateStarsDisplay() {
  const starElements = document.querySelectorAll('#stars, #star-count');
  starElements.forEach(el => {
    if (el) {
      el.textContent = stars.toString();
    }
  });
}

// Add stars
function addStars(amount) {
  stars += amount;
  localStorage.setItem('stars', stars.toString());
  updateStarsDisplay();
}

// Spend stars (returns true if successful, false if insufficient)
function spendStars(amount) {
  if (stars >= amount) {
    stars -= amount;
    localStorage.setItem('stars', stars.toString());
    updateStarsDisplay();
    return true;
  }
  return false;
}

// Get current stars
function getStars() {
  return stars;
}

// Sync stars from localStorage (useful when stars are updated elsewhere)
function syncStars() {
  stars = parseInt(localStorage.getItem('stars')) || 0;
  updateStarsDisplay();
}

// Initialize stars display when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  syncStars();
});

// Also initialize immediately if DOM is already loaded
if (document.readyState === 'loading') {
  // DOM is still loading, wait for DOMContentLoaded
} else {
  // DOM is already loaded, initialize immediately
  syncStars();
}

// Make functions globally available
window.addStars = addStars;
window.spendStars = spendStars;
window.getStars = getStars;
window.syncStars = syncStars;
window.updateStarsDisplay = updateStarsDisplay;

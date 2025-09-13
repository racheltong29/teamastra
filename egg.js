const circles = document.querySelectorAll('.circle');
const popup = document.getElementById('popup');

circles.forEach(circle => {
  circle.addEventListener('click', () => {
    popup.textContent = circle.dataset.info;
    popup.classList.remove('hidden');
  });
});


// toggleSidebar function moved to shared-scripts.js
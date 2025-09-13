const circles = document.querySelectorAll('.circle');
const popup = document.getElementById('popup');

circles.forEach(circle => {
  circle.addEventListener('click', () => {
    popup.textContent = circle.dataset.info;
    popup.classList.remove('hidden');
  });
});


function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  if (sidebar.style.left === '0px') {
    sidebar.style.left = '-200px';
  } else {
    sidebar.style.left = '0px';
  }
}
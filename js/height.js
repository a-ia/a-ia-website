function syncMainBodyHeight() {

  const sidebar = document.querySelector('.left-sidebar');
  const mainBody = document.querySelector('.main-body');

  if (sidebar && mainBody) {
    const sidebarHeight = sidebar.offsetHeight;
    mainBody.style.maxHeight = `${sidebarHeight}px`;
  }
}

window.addEventListener('DOMContentLoaded', syncMainBodyHeight);
window.addEventListener('resize', syncMainBodyHeight);


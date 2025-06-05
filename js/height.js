function syncMainBodyHeight() {

  if (!window.matchMedia('(min-width: 800px)').matches) return;

  const sidebar = document.querySelector('.left-sidebar');
  const mainBody = document.querySelector('.main-body');

  if (sidebar && mainBody) {
    const sidebarHeight = sidebar.offsetHeight;
    mainBody.style.maxHeight = `${sidebarHeight}px`;
  }
}

window.addEventListener('DOMContentLoaded', syncMainBodyHeight);
window.addEventListener('resize', syncMainBodyHeight);


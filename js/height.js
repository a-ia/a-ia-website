  function syncMainBodyHeight() {
    const isDesktop = window.matchMedia('(min-width: 768px)').matches;

    if (!isDesktop) return; 

    const sidebar = document.querySelector('.left-sidebar');
    const mainBody = document.querySelector('.main-body');

    if (sidebar && mainBody) {
      if (isDesktop) {
        const sidebarHeight = sidebar.offsetHeight;
        mainBody.style.maxHeight = `${sidebarHeight}px`;
      } else {
        mainBody.style.maxHeight = '';
      }
    }
  }
  
  window.addEventListener('DOMContentLoaded', syncMainBodyHeight);
  window.addEventListener('resize', syncMainBodyHeight);


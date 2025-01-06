document.addEventListener("DOMContentLoaded", function () {
    const gradientBg = document.getElementById('gradient-bg');
    const sidebarTitle = document.querySelector('.left-sidebar-title');
    const mainHeader = document.querySelector('.main-body .main-header');
    const mainHeaderH1 = document.querySelector('.main-body .main-header h1');
    
    if (!gradientBg) {
        console.error('gradient-bg element not found');
        return;
    }
    
    const layer = document.createElement('div');
    layer.className = 'star-layer';
    gradientBg.appendChild(layer);
    
    let isDark = false;
    
    const darkModeButton = document.getElementById('darkModeToggle');
    if (darkModeButton) {
        darkModeButton.addEventListener('click', function() {
            isDark = !isDark;
            
            [gradientBg, sidebarTitle, mainHeader, mainHeaderH1].forEach(element => {
                if (element) element.style.opacity = '0';
            });
            
            setTimeout(() => {
                if (isDark) {
                    [gradientBg, sidebarTitle, mainHeader, mainHeaderH1].forEach(element => {
                        if (element) element.style.background = 'var(--gradient-main-dark)';
                    });
                } else {
                    [gradientBg, sidebarTitle, mainHeader, mainHeaderH1].forEach(element => {
                        if (element) element.style.background = 'var(--gradient-main)';
                    });
                }
                
                [gradientBg, sidebarTitle, mainHeader, mainHeaderH1].forEach(element => {
                    if (element) element.style.opacity = '1';
                });
            }, 500);
        });
    }
});

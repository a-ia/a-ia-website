document.addEventListener("DOMContentLoaded", function () {
    const gradientBg = document.getElementById('gradient-bg');
    const sidebarTitle = document.querySelector('.left-sidebar-title');
    const mainHeader = document.querySelector('.main-body .main-header');
    const mainHeaderH1 = document.querySelector('.main-body .main-header h1');
    
    if (!gradientBg) {
        console.error('gradient-bg element not found');
        return;
    }
    
    const starLayer = document.createElement('div');
    starLayer.className = 'star-layer';
    gradientBg.appendChild(starLayer);
    
    let isDark = localStorage.getItem('darkMode') === 'true';
    
    const updateGradient = () => {
        const newGradient = isDark ? 'var(--gradient-main-dark)' : 'var(--gradient-main)';
        gradientBg.style.background = newGradient;
        [sidebarTitle, mainHeader, mainHeaderH1].forEach(element => {
            if (element) {
                element.style.background = newGradient;
            }
        });
    };
    
    updateGradient();
    
    const darkModeButton = document.getElementById('darkModeToggle');
    if (darkModeButton) {
        darkModeButton.addEventListener('click', function() {
            isDark = !isDark;
            localStorage.setItem('darkMode', isDark);
            
            const toggleName = document.getElementById('toggleName');
            if (toggleName) {
                toggleName.textContent = isDark ? 'Light Mode' : 'Dark Mode';
            }
            
            gradientBg.style.transition = 'opacity 0.6s';
            gradientBg.style.opacity = '0';
 
            setTimeout(() => {
                updateGradient();
                gradientBg.style.opacity = '1';
            }, 500);
        });
    }
});


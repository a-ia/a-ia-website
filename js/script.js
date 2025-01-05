document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM Content Loaded");
    const gradientBg = document.getElementById('gradient-bg');
    if (!gradientBg) {
        console.error('gradient-bg element not found');
        return;
    }
    
    const layer = document.createElement('div');
    layer.className = 'star-layer';
    gradientBg.appendChild(layer);
    console.log("Base star layer added successfully.");
    
    let isDark = false;
    
    // Add event listener to the button
    const darkModeButton = document.getElementById('darkModeToggle');
    console.log('Dark mode:', isDark);
    if (darkModeButton) {
        darkModeButton.addEventListener('click', function() {
            isDark = !isDark;
            if (isDark) {
                gradientBg.style.background = 'var(--gradient-main-dark)';
            } else {
                gradientBg.style.background = 'var(--gradient-main)';
            }
        });
    } 
});

document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM Content Loaded");
    const gradientBg = document.getElementById('gradient-bg');
    if (!gradientBg) {
        console.error('gradient-bg element not found');
        return;
    }

    // Add a single star-layer for the base repeated effect
    const layer = document.createElement('div');
    layer.className = 'star-layer';
    gradientBg.appendChild(layer);

    console.log("Base star layer added successfully.");
       
});  

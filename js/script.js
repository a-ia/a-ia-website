document.addEventListener("DOMContentLoaded", function() {
    console.log("DOM Content Loaded");
    
    const gradientBg = document.getElementById('gradient-bg');
    console.log("Gradient bg found:", gradientBg);
    
    if (!gradientBg) {
        console.error('gradient-bg element not found');
        return;
    }
    
    try {
        const layer = document.createElement('div');
        layer.className = 'star-layer';
        
        const randomXOffset = Math.floor(Math.random() * 41) + 10;
        const randomYOffset = Math.floor(Math.random() * 21) + 5;
        const randomDuration = Math.floor(Math.random() * 21) + 30;
        
        console.log('Values:', {
            x: randomXOffset,
            y: randomYOffset,
            duration: randomDuration
        });
        
        layer.style.transform = `translate(${randomXOffset}px, ${randomYOffset}px)`;
        layer.style.animationDuration = `${randomDuration}s`;
        
        gradientBg.appendChild(layer);
        console.log("Layer added successfully");
    } catch (error) {
        console.error('Error:', error);
    }
});
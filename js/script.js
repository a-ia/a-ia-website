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
  function randomBlink() {
    const elements = document.querySelectorAll('.left-sidebar-title .title-text, .left-sidebar-title .star');
    if (!elements.length) return;

    // Loops through all elements to randomly apply blinking effects
    elements.forEach((el) => {
        // Decide the blink type: smooth or glitchy
        const isGlitchy = Math.random() < 0.3; // 30% chance for a glitchy blink
        const blinkClass = isGlitchy ? 'glitch-blink' : 'blink';

        // Adds the selected blink class
        el.classList.add(blinkClass);

        // Removes the class after the animation/transition completes
        const duration = isGlitchy ? 600 : 500; 
        setTimeout(() => {
            el.classList.remove(blinkClass);
        }, duration);
    });

    // Schedules the next blink at a random interval
    const nextBlink = Math.random() * 3000 + 1000; // Random point in time between 1s and 4s
    setTimeout(randomBlink, nextBlink);
  }

  randomBlink();
});

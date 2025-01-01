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


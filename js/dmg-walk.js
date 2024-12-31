const gif = document.querySelector('.moving-gif');
const container = document.querySelector('.dmg-container');
let positionX = 0;
let positionY = 0;
let movingRight = true;
const speed = 6;
let autoAnimate = true;
let isFullScreen = false;

const originalContainerStyle = {
    position: container.style.position,
    top: container.style.top,
    left: container.style.left,
    width: container.style.width,
    height: container.style.height,
    overflow: container.style.overflow,
    zIndex: container.style.zIndex
};

const originalGifStyle = {
    position: gif.style.position,
    top: gif.style.top,
    left: gif.style.left,
    zIndex: gif.style.zIndex
};

function animate() {
    if (autoAnimate) {
        const maxPosition = container.offsetWidth - gif.offsetWidth;
        if (movingRight) {
            positionX += 0.7;
            gif.style.transform = 'scaleX(1)';
            if (positionX >= maxPosition) {
                positionX = maxPosition;
                movingRight = false;
            }
        } else {
            positionX -= 0.7;
            gif.style.transform = 'scaleX(-1)';
            if (positionX <= 0) {
                positionX = 0;
                movingRight = true;
            }
        }
        gif.style.left = positionX + 'px';
        requestAnimationFrame(animate);
    }
}
gif.addEventListener('click', (event) => {
    if (!isFullScreen) {
        isFullScreen = true;
        autoAnimate = false;
        // Get click coordinates relative to the viewport
        const clickX = event.clientX;
        const clickY = event.clientY;
        // Expand container to cover the whole page
        container.style.position = 'fixed';
        container.style.top = '0';
        container.style.left = '0';
        container.style.width = '100%';
        container.style.height = '100%';
        container.style.overflow = 'hidden';
        container.style.zIndex = '-1'; /*Places container below all content*/
        container.style.pointerEvents = 'none';
        // Position the GIF at the click coordinates
        gif.style.position = 'fixed'; /* Changed to fixed positioning */
        gif.style.zIndex = '2147483647'; /*lol this doesn't work*/
        gif.style.transition = 'none'; /* Ensures no transition delay */
        gif.style.left = clickX - (gif.offsetWidth / 2) + 'px';
        gif.style.top = clickY - (gif.offsetHeight / 2) + 'px';
        gif.style.pointerEvents = 'auto';
        // Update stored positions
        positionX = clickX - (gif.offsetWidth / 2);
        positionY = clickY - (gif.offsetHeight / 2);
        // Add key movement listeners
        document.addEventListener('keydown', handleKeyPress);
    } else {
        /*
        // Return to original container and animation
        isFullScreen = false;
        autoAnimate = true;
        
        // Restore original container styles
        Object.assign(container.style, originalContainerStyle);
        
        // Restore original gif styles
        Object.assign(gif.style, originalGifStyle);
        
        // Reset position for animation
        positionX = 0;
        positionY = 0;
        movingRight = true;
        
        document.removeEventListener('keydown', handleKeyPress);
        */
        
        // Return to original container and animationi
        isFullScreen = false;

        // Restore origin container styles
        Object.assign(container.style, originalContainerStyle);
        
        // Restore original gif styles
        Object.assign(gif.style, originalGifStyle);
        
        // Reset position for animation
        positionX = 0;
        positionY = 0;
        movingRight = true;
        
        // Remove key listener and restart animation
        document.removeEventListener('keydown', handleKeyPress);
        autoAnimate = true; /* Enable animation before calling animate */
        animate(); /* Restart the animation */
    }
});

function handleKeyPress(event) {
    /*event.preventDefault();
    const maxX = window.innerWidth - gif.offsetWidth;
    const maxY = window.innerHeight - gif.offsetHeight;
    */
    if (!isFullScreen) return;

    const maxX = window.innerWidth - gif.offsetWidth;
    const maxY = window.innerHeight - gif.offsetWidth;

    switch (event.key) {
        case 'ArrowRight':
            positionX = Math.min(positionX + speed, maxX);
            gif.style.transform = 'scaleX(1)';
            break;
        case 'ArrowLeft':
            positionX = Math.max(positionX - speed, 0);
            gif.style.transform = 'scaleX(-1)';
            break;
        case 'ArrowUp':
            positionY = Math.max(positionY - speed, 0);
            break;
        case 'ArrowDown':
            positionY = Math.min(positionY + speed, maxY);
            break;
        default:
            return;
    }
    gif.style.left = positionX + 'px';
    gif.style.top = positionY + 'px';
}
animate();

/*Create way to click dmg and rever to original container or allow clickable webpage*/

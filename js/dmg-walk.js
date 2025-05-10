const gif = document.querySelector('.moving-gif');
const container = document.querySelector('.dmg-container');
let positionX = 0;
let positionY = 0;
let movingRight = true;
const speed = 6;
let autoAnimate = true;
let isFullScreen = false;
let isMoving = false; 

const originalContainerStyle = {
    position: container.style.position,
    top: container.style.top,
    left: container.style.left,
    width: container.style.width,
    height: container.style.height,
    overflow: container.style.overflow,
    zIndex: container.style.zIndex,
    borderBottom: container.style.borderBottom
};

const originalGifStyle = {
    position: gif.style.position,
    top: gif.style.top,
    left: gif.style.left,
    zIndex: gif.style.zIndex
};

const bubbleGif = document.createElement('img');
bubbleGif.src = './images/bubble.gif'; 
bubbleGif.className = 'bubble-gif';
bubbleGif.style.position = 'absolute';
bubbleGif.style.display = 'none';
container.appendChild(bubbleGif);

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

        if (bubbleGif.style.display === 'block') {
            bubbleGif.style.left = positionX + gif.offsetWidth + 'px';
            bubbleGif.style.top = gif.offsetTop + 'px';
        }

        requestAnimationFrame(animate);
    }
}

gif.addEventListener('click', (event) => {
    if (!isFullScreen) {
        isFullScreen = true;
        autoAnimate = false;

        bubbleGif.style.display = 'none';

        const clickX = event.clientX;
        const clickY = event.clientY;

        container.style.position = 'fixed';
        container.style.top = '0';
        container.style.left = '0';
        container.style.width = '100%';
        container.style.height = '100%';
        container.style.overflow = 'hidden';
        container.style.zIndex = '2'; 
        container.style.pointerEvents = 'none';

        container.style.borderBottom = 'none';

        gif.style.position = 'fixed';
        gif.style.zIndex = '2147483647';
        gif.style.transition = 'none';
        gif.style.left = clickX - (gif.offsetWidth / 2) + 'px';
        gif.style.top = clickY - (gif.offsetHeight / 2) + 'px';
        gif.style.pointerEvents = 'auto';

        positionX = clickX - (gif.offsetWidth / 2);
        positionY = clickY - (gif.offsetHeight / 2);

        document.addEventListener('keydown', handleKeyPress);
    } else {

        isFullScreen = false;

        Object.assign(container.style, originalContainerStyle);

        Object.assign(gif.style, originalGifStyle);

        positionX = 0;
        positionY = 0;
        movingRight = true;

        container.style.borderBottom = originalContainerStyle.borderBottom;

        document.removeEventListener('keydown', handleKeyPress);
        autoAnimate = true;
        animate();
    }
});

function handleKeyPress(event) {
    const maxX = window.innerWidth - gif.offsetWidth;
    const maxY = window.innerHeight - gif.offsetHeight;
    let moved = false;

    switch (event.key) {
        case 'ArrowRight':
            positionX = Math.min(positionX + speed, maxX);
            gif.style.transform = 'scaleX(1)';
            moved = true;
            break;
        case 'ArrowLeft':
            positionX = Math.max(positionX - speed, 0);
            gif.style.transform = 'scaleX(-1)';
            moved = true;
            break;
        case 'ArrowUp':
            positionY = Math.max(positionY - speed, 0);
            moved = true;
            break;
        case 'ArrowDown':
            positionY = Math.min(positionY + speed, maxY);
            moved = true;
            break;
        default:
            return;
    }

    if (moved) {
        positionGif(); 
        resumeGifAnimation();
    } else {
        pauseGifAnimation();
    }
}

function positionGif() {
    gif.style.left = positionX + 'px';
    gif.style.top = positionY + 'px';
}

function pauseGifAnimation() {
    if (isMoving) {
        gif.style.animationPlayState = 'paused';
        isMoving = false;
    }
}

function resumeGifAnimation() {
    if (!isMoving) {
        gif.style.animationPlayState = 'running';
        isMoving = true;
    }
}

gif.addEventListener('mouseenter', () => {
    if (!isFullScreen) { 
        const gifRect = gif.getBoundingClientRect();
        const bubbleX = gifRect.right - container.getBoundingClientRect().left + 10; 
        const bubbleY = gifRect.top - container.getBoundingClientRect().top;

        bubbleGif.style.left = bubbleX + 'px';
        bubbleGif.style.top = bubbleY + 'px';
        bubbleGif.style.display = 'block';
    }
});

gif.addEventListener('mouseleave', () => {
    bubbleGif.style.display = 'none';
});

animate();

const textarea = document.getElementById('ascii-art');
let frames = [];
let currentFrameIndex = 13;
let animationInterval;

async function loadFrames() {
    const frames = [];
    try {
        for (let i = 1; i <= 33; i++) {
            console.log(`Fetching: ./ascii/${i}.txt`);
            const response = await fetch(`./ascii/${i}.txt`);
            
            if (!response.ok) {
                console.error(`Failed to fetch frame ${i}`); 
                continue;
            }
            
            const frame = await response.text();
            frames.push(frame);
        }
        console.log(`Loaded ${frames.length} frames`); 
        return frames;
    } catch (error) {
        console.error('Error loading frames:', error);
        return [];
    }
}

function startAnimation() {
    if (animationInterval) clearInterval(animationInterval);
    
    animationInterval = setInterval(() => {
        currentFrameIndex = (currentFrameIndex + 1) % frames.length;
        textarea.value = frames[currentFrameIndex];
    }, 100); 
}

function stopAnimation() {
    if (animationInterval) {
        clearInterval(animationInterval);
        textarea.value = frames[13]; 
    }
}

loadFrames().then(loadedFrames => {
    frames = loadedFrames;
    if (frames.length > 0) {
        textarea.value = frames[currentFrameIndex];
        
        textarea.addEventListener('mouseenter', startAnimation);
        textarea.addEventListener('mouseleave', stopAnimation);
    }
}).catch(error => {
    console.error('Initialization error:', error);
});

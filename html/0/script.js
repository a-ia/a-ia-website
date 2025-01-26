// SECTION 1: ASCII Animation Functionality
const textarea = document.getElementById('ascii-art');
let frames = [];
let currentFrameIndex = 13;
let animationInterval;

// Function to load ASCII frames from text files
async function loadFrames() {
    try {
        const frames = [];
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

// Function to start the ASCII animation
function startAnimation() {
    if (animationInterval) clearInterval(animationInterval);
    animationInterval = setInterval(() => {
        currentFrameIndex = (currentFrameIndex + 1) % frames.length;
        textarea.value = frames[currentFrameIndex];
    }, 100); 
}

// Function to stop the ASCII animation
function stopAnimation() {
    if (animationInterval) {
        clearInterval(animationInterval);
        textarea.value = frames[13]; // Reset to the default frame
    }
}

// SECTION 2: Navigation Menu Functionality
function toggleMenu(event) {
    event.preventDefault();
    const parent = event.target.closest('.menu-item');
    if (parent) {
        parent.classList.toggle('expanded');
    }
}

// A very OCD typed function, to adjust the content height by +1px to match the extra textarea height
function adjustContentHeight() {
    const contentDiv = document.getElementById('content');
    const currentHeight = parseInt(window.getComputedStyle(contentDiv).height, 10);
    contentDiv.style.height = `${currentHeight + 1.1}px`;
}

// SECTION 3: Dynamic Content Loading
function loadContent(contentKey) {
    const contentDiv = document.getElementById('content');
    const normalizedKey = contentKey.toLowerCase().replace(/\s+/g, '-');
    const filePath = `html/${normalizedKey}.html`; // Note: enable direct linking for htmls
    
    // Note: history.pushState() updates browser URL without page reload
    history.pushState(null, '', `#${normalizedKey}`);
    
    fetch(filePath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load content from ${filePath}`);
            }
            return response.text();
        })
        .then(html => {
            contentDiv.innerHTML = html;
            adjustContentHeight();
        })
        .catch(error => {
            console.error(error);
            contentDiv.innerHTML = "<div class=\"margin\"><h2>&nbsp;&nbsp;Error</h2><p>Could not load the content. Please try again later.</p></div>";
        });
}

// Note: handles browser navigation events (back/forward) using popstate event listener by loading content based on the URL hash
window.addEventListener('popstate', () => {
    const hash = window.location.hash.substring(1);
    if (hash) {
        loadContent(hash.replace(/-/g, ' '));
    }
});

// SECTION 4: Page Load Initialization
window.addEventListener('load', () => {
    const contentDiv = document.getElementById('content');
    
    // Check for initial hash and load content if present
    const initialHash = window.location.hash.substring(1);
    if (initialHash) {
        loadContent(initialHash.replace(/-/g, ' '));
    }

    // Initialize ASCII frames
    loadFrames().then(loadedFrames => {
        frames = loadedFrames;
        if (frames.length > 0) {
            textarea.value = frames[currentFrameIndex];
            
            // Add event listeners for animation on hover
            textarea.addEventListener('mouseenter', startAnimation);
            textarea.addEventListener('mouseleave', stopAnimation);
        }
    }).catch(error => {
        console.error('Initialization error:', error);
    });

    // Reset and display ASCII textarea inside the content div
    contentDiv.innerHTML = '';
    contentDiv.appendChild(textarea);
});

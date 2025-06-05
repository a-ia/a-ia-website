// ASCII Animation System
const textarea = document.getElementById('ascii-art');
let frames = [];
let originalFrames = [];
let currentFrameIndex = 13;
let animationInterval;
let isMobileView = false;

function checkMobileView() {
    return window.innerWidth <= 768 && window.innerWidth > 0;
}

function trimFramesForMobile(originalFrames) {
    return originalFrames.map(frame => {
        return frame.split('\n')
            .map(line => line.length > 12 ? line.slice(12) : line)
            .join('\n');
    });
}

async function loadFrames() {
    try {
        const loadedFrames = [];
        
        // Load all frames with Promise.all for better performance
        const promises = Array.from({length: 33}, (_, i) => {
            return fetch(`./ascii/${i + 1}.txt`)
                .then(response => response.ok ? response.text() : null)
                .catch(() => null);
        });
        
        const results = await Promise.all(promises);
        results.forEach((frame, i) => {
            if (frame) {
                loadedFrames.push(frame);
            } else {
                console.error(`Failed to fetch frame ${i + 1}`);
            }
        });
        
        console.log(`Loaded ${loadedFrames.length} frames`);
        
        originalFrames = [...loadedFrames];
        isMobileView = checkMobileView();
        frames = isMobileView ? trimFramesForMobile(loadedFrames) : loadedFrames;

        setTimeout(() => {
            textarea.classList.add('visible');
        }, 100);

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
        textarea.value = frames[13] || '';
    }
}

// Handle mobile view changes
window.addEventListener('resize', () => {
    const newMobileView = checkMobileView();
    
    if (newMobileView !== isMobileView && frames.length > 0) {
        isMobileView = newMobileView;
        frames = isMobileView ? trimFramesForMobile(originalFrames) : [...originalFrames];
        textarea.value = frames[currentFrameIndex];
    }
});

// Navigation Menu Functionality
function toggleMenu(event) {
    event.preventDefault();

    const parentMenu = event.target.closest('.menu-item');
    
    if (parentMenu) {
        const submenu = parentMenu.querySelector('.submenu');

        if (submenu) {
            const isExpanded = parentMenu.classList.contains('expanded');
            parentMenu.classList.toggle('expanded');

            const closeMenu = (e) => {
                if (!parentMenu.contains(e.target)) {
                    parentMenu.classList.remove('expanded');
                    document.removeEventListener('click', closeMenu);
                }
            };

            if (!isExpanded) {
                setTimeout(() => {
                    document.addEventListener('click', closeMenu);
                }, 0);
            }
        }

        // Close other expanded menus
        document.querySelectorAll('.menu-item.expanded').forEach((item) => {
            if (item !== parentMenu) {
                item.classList.remove('expanded');
            }
        });
    }
}

// Dynamic Content Loading
function loadContent(contentKey) {
    const contentDiv = document.getElementById('content');
    const normalizedKey = contentKey.toLowerCase().replace(/\s+/g, '-');
    const filePath = `page/${normalizedKey}.html`;
    
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
            addNavigationBorder();
        })
        .catch(error => {
            console.error(error);
            contentDiv.innerHTML = `
                <div class="margin">
                    <h2>Error</h2>
                    <p>Could not load the content. Please try again later.</p>
                </div>`;
            addNavigationBorder();
        });
}

function addNavigationBorder() {
    const navigationDiv = document.querySelector('.navigation');
    if (navigationDiv) {
        navigationDiv.classList.add('border');
    }
}

// Browser navigation
window.addEventListener('popstate', () => {
    const hash = window.location.hash.substring(1);
    if (hash) {
        loadContent(hash.replace(/-/g, ' '));
    }
});

// Utility function
function refreshPath() {
    const currentPath = window.location.pathname;
    const hasIndexHtml = currentPath.endsWith('index.html');
    const basePath = currentPath.split('#')[0];
    
    if (hasIndexHtml) {
        window.location.href = basePath;
    } else {
        window.location.href = basePath + 'index.html';
    }
}

// Page initialization
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

// Social dropdown functionality
document.addEventListener('DOMContentLoaded', () => {
    const socialsBtn = document.querySelector('.socials-button');
    const chevron = document.querySelector('.chevron');
    const dropdown = document.querySelector('.social-dropdown');

    if (socialsBtn && chevron && dropdown) {
        socialsBtn.addEventListener('click', () => {
            chevron.classList.toggle('open');
            dropdown.classList.toggle('show');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (event) => {
            if (!socialsBtn.contains(event.target) && !dropdown.contains(event.target)) {
                chevron.classList.remove('open');
                dropdown.classList.remove('show');
            }
        });
    }
});

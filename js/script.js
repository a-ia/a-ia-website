document.addEventListener("DOMContentLoaded", function () {
    const gradientBg = document.getElementById('gradient-bg');
    const sidebarTitle = document.querySelector('.left-sidebar-title');
    const mainHeader = document.querySelector('.main-body .main-header');
    const mainHeaderH1 = document.querySelector('.main-body .main-header h1');
    /*TODO: const bodyText = document.querySelector('body html');*/

    if (!gradientBg) {
        console.error('gradient-bg element not found');
        return;
    }
    
    const starLayer = document.createElement('div');
    starLayer.className = 'star-layer';
    gradientBg.appendChild(starLayer);
    
    let isDark = localStorage.getItem('darkMode') === 'true';
    
    const updateGradient = () => {
        const newGradient = isDark ? 'var(--gradient-main-dark)' : 'var(--gradient-main)';
        gradientBg.style.background = newGradient;
        [sidebarTitle, mainHeader, mainHeaderH1].forEach(element => {
            if (element) {
                element.style.background = newGradient;
            }
        });
    };
    
    updateGradient();
    
    const darkModeButton = document.getElementById('darkModeToggle');
    if (darkModeButton) {
        darkModeButton.addEventListener('click', function() {
            isDark = !isDark;
            localStorage.setItem('darkMode', isDark);
            
            const toggleName = document.getElementById('toggleName');
            if (toggleName) {
                toggleName.textContent = isDark ? 'Light Mode' : 'Dark Mode';
            }
            
            gradientBg.style.transition = 'opacity 0.6s';
            gradientBg.style.opacity = '0';
      
            setTimeout(() => {
                updateGradient();
                gradientBg.style.opacity = '1';
            }, 500);
        });
    }

    const container = document.querySelector(".stamps");
    const content = document.querySelector(".stamps-container");
    let direction = 1; /* 1 = down, -1 = up */
    let position = 0;
    let speed = 0.9; /* Default scroll speed */

    const step = () => {
        const containerHeight = container.clientHeight;
        const contentHeight = content.scrollHeight;

        if (direction === 1 && position + containerHeight >= contentHeight) {
            direction = -1; /* Reverse when reaching the bottom */
        } else if (direction === -1 && position <= 0) {
            direction = 1; /* Reverse when reaching the top */
        }

        position += direction * speed; /* Adjust speed dynamically */
        content.style.transform = `translateY(-${position}px)`;

        requestAnimationFrame(step);
    };

    /* Adjust scroll speed on hover */
    container.addEventListener("mouseover", () => {
        speed = 0.3; /* Slow down */
    });

    container.addEventListener("mouseout", () => {
        speed = 0.9; /* Restore speed */
    });

    step(); /* Start animation loop */

    const audio = new Audio("../music/music.wav");
    
    /* Check localStorage for saved music preference, default to true if not set */
    const musicEnabled = localStorage.getItem("musicEnabled") === null ? true : localStorage.getItem("musicEnabled") === "true";
    
    /* Start playing music if enabled */
    if (musicEnabled) {
        audio.loop = true;
        audio.play();
    }

    /* Settings button */
    const settingsButton = document.getElementById("settingsButton");
    const settingsContainer = document.querySelector(".fun");

    if (!settingsButton || !settingsContainer) {
        console.error("Required elements not found");
        return;
    }

    const originalContent = settingsContainer.innerHTML;
    const settingsContent = `
        <div class="settings-panel">
            <h2>Settings</h2>
            <label>
                <input type="checkbox" id="toggleStars"> Enable Star Background
            </label><br>
            <label>
                <input type="checkbox" id="toggleMusic"> Enable Music
            </label>
        </div>
    `;

    settingsButton.addEventListener("click", function () {
        if (settingsContainer.classList.contains("settings-open")) {
            settingsContainer.innerHTML = originalContent;
            settingsContainer.classList.remove("settings-open");
        } else {
            settingsContainer.innerHTML = settingsContent;
            settingsContainer.classList.add("settings-open");
            
            const starToggle = document.getElementById("toggleStars");
            const musicToggle = document.getElementById("toggleMusic");
            
            const starsEnabled = localStorage.getItem("starsEnabled") === null ? true : localStorage.getItem("starsEnabled") === "true";
            
            if (starToggle && musicToggle) {
                starToggle.checked = starsEnabled;
                musicToggle.checked = musicEnabled; // Use the same musicEnabled from outside
                
                const starLayer = document.querySelector('.star-layer');
                if (starLayer) {
                    starLayer.style.display = starsEnabled ? "block" : "none";
                }
                
                starToggle.addEventListener("change", function () {
                    const starLayer = document.querySelector('.star-layer');
                    if (starLayer) {
                        starLayer.style.display = this.checked ? "block" : "none";
                    }
                    localStorage.setItem("starsEnabled", this.checked);
                });
                
                musicToggle.addEventListener("change", function () {
                    if (this.checked) {
                        audio.loop = true;
                        audio.play();
                    } else {
                        audio.pause();
                    }
                    localStorage.setItem("musicEnabled", this.checked);
                });
            }
        }
    });
});


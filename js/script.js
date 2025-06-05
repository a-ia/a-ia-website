document.addEventListener("DOMContentLoaded", function () {
    // Main initialization elements
    const gradientBg = document.getElementById('gradient-bg');
    const sidebarTitle = document.querySelector('.left-sidebar-title');
    const mainHeader = document.querySelector('.main-body .main-header');
    const mainHeaderH1 = document.querySelector('.main-body .main-header h1');
    const translucentDivs = document.querySelectorAll('.translucent');

    if (!gradientBg) {
        console.error('gradient-bg element not found');
        return;
    }
    
    // Create star layer
    const starLayer = document.createElement('div');
    starLayer.className = 'star-layer';
    gradientBg.appendChild(starLayer);
    
    // Dark mode initialization
    let isDark = localStorage.getItem('darkMode') === 'true';
    
    const updateGradient = () => {
        document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");

        const newGradient = isDark ? 'var(--gradient-main-dark)' : 'var(--gradient-main)';
        gradientBg.style.background = newGradient;
        [sidebarTitle, mainHeader, mainHeaderH1].forEach(element => {
            if (element) {
                element.style.background = newGradient;
            }
        });
        translucentDivs.forEach(div => {
            div.style.backgroundColor = isDark 
                ? 'rgba(0, 0, 0, 0.2)' 
                : 'rgba(255, 255, 255, 0.1)';
        });
    };
    
    updateGradient();
    
    // Dark mode toggle
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

    // Stamps scrolling animation
    const container = document.querySelector(".stamps");
    const content = document.querySelector(".stamps-container");
    
    if (container && content) {
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
    }

    // Music functionality
    const audio = new Audio("../music/music.wav");
    
    /* Check localStorage for saved music preference, default to true if not set */
    const musicEnabled = localStorage.getItem("musicEnabled") === null ? true : localStorage.getItem("musicEnabled") === "true";
    
    /* Start playing music if enabled */
    if (musicEnabled) {
        audio.loop = true;
        audio.play();
    }

    // Settings panel
    const settingsButton = document.getElementById("settingsButton");
    const settingsContainer = document.querySelector(".fun");

    if (settingsButton && settingsContainer) {
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
                    musicToggle.checked = musicEnabled;
                    
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
    }

    // Projects scroll functionality
    const scrollToProjects = () => {
        const mainBody = document.querySelector('.main-body');
        const projectsSection = document.querySelector('.projects');
        const projectsHeader = projectsSection ? projectsSection.querySelector('h2') : null;
        
        if (projectsSection && mainBody) {
            const mainBodyRect = mainBody.getBoundingClientRect();
            const projectsRect = projectsSection.getBoundingClientRect();
            
            const scrollPosition = mainBody.scrollTop + (projectsRect.top - mainBodyRect.top) - 20; 
            
            mainBody.scrollTo({
                top: scrollPosition,
                behavior: 'smooth'
            });
            
            if (projectsHeader) {
                setTimeout(() => {
                    projectsHeader.classList.add('section-glow');
                    
                    setTimeout(() => {
                        projectsHeader.classList.remove('section-glow');
                    }, 2000);
                }, 300);
            }
        }
    };

    // Setup project button listeners
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        const buttonText = button.textContent.trim();
        if (buttonText === 'Projects') {
            button.removeAttribute('onclick');
            
            button.addEventListener('click', function(e) {
                e.preventDefault();
                scrollToProjects();
            });
        }
    });

    // Main body height sync
    const syncMainBodyHeight = () => {
        if (!window.matchMedia('(min-width: 800px)').matches) return;
        const sidebar = document.querySelector('.left-sidebar');
        const mainBody = document.querySelector('.main-body');
        if (sidebar && mainBody) {
            const sidebarHeight = sidebar.offsetHeight;
            mainBody.style.maxHeight = `${sidebarHeight}px`;
        }
    };

    // Initial sync and setup resize listener
    syncMainBodyHeight();
    window.addEventListener('resize', syncMainBodyHeight);

    // Random blink animation
    const randomBlink = () => {
        const elements = document.querySelectorAll('.left-sidebar-title .title-text, .left-sidebar-title .star');
        if (!elements.length) return;
        
        elements.forEach((el) => {
            const isGlitchy = Math.random() < 0.3; // 30% chance for a glitchy blink
            const blinkClass = isGlitchy ? 'glitch-blink' : 'blink';
            el.classList.add(blinkClass);
            const duration = isGlitchy ? 600 : 500; 
            setTimeout(() => {
                el.classList.remove(blinkClass);
            }, duration);
        });
        
        const nextBlink = Math.random() * 3000 + 1000; // Random point in time between 1s and 4s
        setTimeout(randomBlink, nextBlink);
    };

    // Start the random blink animation
    randomBlink();
});


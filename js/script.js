document.addEventListener("DOMContentLoaded", function () {
    const gradientBg = document.getElementById('gradient-bg');
    const sidebarTitle = document.querySelector('.left-sidebar-title');
    const mainHeader = document.querySelector('.main-body .main-header');
    const mainHeaderH1 = document.querySelector('.main-body .main-header h1');
    const translucentDivs = document.querySelectorAll('.translucent');

    if (!gradientBg) {
        console.error('gradient-bg element not found');
        return;
    }
    
    /* Create star layer */
    const starLayer = document.createElement('div');
    starLayer.className = 'star-layer';
    gradientBg.appendChild(starLayer);
    
    /* Theme state management */
    const themeState = {
        isDark: localStorage.getItem('darkMode') === 'true',
        currentTheme: localStorage.getItem('currentTheme') || 'default',
        
        themes: {
            'default': {
                stylesheet: 'css/styles.css',
                supportsGradient: true,
                supportsDarkMode: true
            },
            'win98': {
                stylesheet: 'css/98.css',
                supportsGradient: false,
                supportsDarkMode: false
            }
        /* More themes can go here */
        }
    };

    function updateGradient() {
        if (!themeState.themes[themeState.currentTheme].supportsGradient) return;
        
        const newGradient = themeState.isDark ? 'var(--gradient-main-dark)' : 'var(--gradient-main)';
        gradientBg.style.background = newGradient;
        
        [sidebarTitle, mainHeader, mainHeaderH1].forEach(element => {
            if (element) {
                element.style.background = newGradient;
            }
        });
        
        translucentDivs.forEach(div => {
            div.style.backgroundColor = themeState.isDark 
                ? 'rgba(0, 0, 0, 0.2)' 
                : 'rgba(255, 255, 255, 0.1)';
        });
    }

    /* Update UI controls based on current theme */
    function updateThemeControls() {
        const darkModeButton = document.getElementById('darkModeToggle');
        const toggleName = document.getElementById('toggleName');
        const currentTheme = themeState.themes[themeState.currentTheme];
        
        if (darkModeButton) {
            darkModeButton.disabled = !currentTheme.supportsDarkMode;
            
            // Update toggle name text based on current state and theme support
            if (toggleName) {
                if (!currentTheme.supportsDarkMode) {
                    toggleName.textContent = 'Dark Mode';
                } else {
                    toggleName.textContent = themeState.isDark ? 'Light Mode' : 'Dark Mode';
                }
            }
        }
    }

    /* Theme application function */
    function applyTheme(themeName) {
        if (!themeState.themes[themeName]) {
            console.error(`Theme "${themeName}" not found`);
            return;
        }

        const theme = themeState.themes[themeName];
        themeState.currentTheme = themeName;
        localStorage.setItem('currentTheme', themeName);
        
        /* Handle dark mode compatibility */
        if (!theme.supportsDarkMode && themeState.isDark) {
            // Don't actually change isDark in localStorage yet, just adjust for UI
            // This way when switching back to a theme that supports dark mode, 
            // the preference is preserved
            document.body.classList.remove('dark-mode');
        } else if (themeState.isDark) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
        
        /* Update stylesheet */
        const currentStylesheet = document.querySelector('link[href*="css/"]');
        if (currentStylesheet) {
            currentStylesheet.href = theme.stylesheet;
        }
        
        /* Add/remove theme-specific body class */
        document.body.className = ''; // Reset classes
        document.body.classList.add(`${themeName}-theme`);
        
        // Re-add dark-mode class if applicable
        if (themeState.isDark && theme.supportsDarkMode) {
            document.body.classList.add('dark-mode');
        }
        
        /* Apply gradient if supported */
        if (theme.supportsGradient) {
            updateGradient();
        }
        
        /* Update UI state */
        updateThemeControls();
    }

    /* Toggle dark mode */
    function toggleDarkMode() {
    const currentTheme = themeState.themes[themeState.currentTheme];

    // If theme doesn't support dark mode, force light mode and return
    if (!currentTheme.supportsDarkMode) {
        themeState.isDark = false;
        localStorage.setItem('darkMode', false);
        document.body.classList.remove('dark-mode');

        const toggleName = document.getElementById('toggleName');
        if (toggleName) {
            toggleName.textContent = 'Dark Mode';
        }

        updateGradient(); // Update gradient to reflect light mode
        return;
    }

    // Toggle dark mode
    themeState.isDark = !themeState.isDark;
    localStorage.setItem('darkMode', themeState.isDark);

    const toggleName = document.getElementById('toggleName');
    if (toggleName) {
        toggleName.textContent = themeState.isDark ? 'Light Mode' : 'Dark Mode';
    }

    document.body.classList.toggle('dark-mode', themeState.isDark);

    gradientBg.style.transition = 'opacity 0.6s';
    gradientBg.style.opacity = '0';

    setTimeout(() => {
        updateGradient();
        gradientBg.style.opacity = '1';
    }, 500);
    }

    /* Apply current theme on load */
    applyTheme(themeState.currentTheme);

    /* Dark mode toggle */
    const darkModeButton = document.getElementById('darkModeToggle');
    if (darkModeButton) {
        darkModeButton.addEventListener('click', toggleDarkMode);
    }

    /* Theme toggle button */
    const themeButton = document.getElementById('toggleTheme');
    if (themeButton) {
        themeButton.addEventListener('click', function() {
            document.body.style.transition = 'all 0.2s';
            document.body.style.opacity = '0';
            
            setTimeout(() => {
                /* Toggle between default and win98 themes */
                /* For future multiple themes I might replace this with a theme selector tooltip */
                const nextTheme = themeState.currentTheme === 'default' ? 'win98' : 'default';
                applyTheme(nextTheme);
                document.body.style.opacity = '1';
            }, 500);
        });
    } else {
        console.error('Theme button (toggleTheme) not found');
    }

    /* Scrolling stamps animation */
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

    // Audio management
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
});

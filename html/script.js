// ASCII Animation System
class ASCIIAnimator {
    constructor() {
        this.textarea = document.getElementById('ascii-art');
        this.frames = [];
        this.currentFrame = 13;
        this.animationId = null;
        this.isMobile = window.innerWidth <= 768;
        
        this.init();
    }

    async init() {
        await this.loadFrames();
        this.setupEventListeners();
        this.showInitialFrame();
    }

    async loadFrames() {
        const promises = Array.from({length: 33}, (_, i) => 
            fetch(`./ascii/${i + 1}.txt`).then(r => r.ok ? r.text() : '')
        );
        
        const results = await Promise.allSettled(promises);
        this.frames = results
            .filter(r => r.status === 'fulfilled' && r.value)
            .map(r => this.isMobile ? this.trimForMobile(r.value) : r.value);
        
        console.log(`Loaded ${this.frames.length} frames`);
    }

    trimForMobile(frame) {
        return frame.split('\n')
            .map(line => line.length > 12 ? line.slice(12) : line)
            .join('\n');
    }

    setupEventListeners() {
        this.textarea.addEventListener('mouseenter', () => this.startAnimation());
        this.textarea.addEventListener('mouseleave', () => this.stopAnimation());
        
        window.addEventListener('resize', () => {
            const wasMobile = this.isMobile;
            this.isMobile = window.innerWidth <= 768;
            if (wasMobile !== this.isMobile) this.loadFrames();
        });
    }

    showInitialFrame() {
        if (this.frames.length > 0) {
            this.textarea.value = this.frames[this.currentFrame];
            setTimeout(() => this.textarea.classList.add('visible'), 100);
        }
    }

    startAnimation() {
        this.stopAnimation();
        this.animationId = setInterval(() => {
            this.currentFrame = (this.currentFrame + 1) % this.frames.length;
            this.textarea.value = this.frames[this.currentFrame];
        }, 100);
    }

    stopAnimation() {
        if (this.animationId) {
            clearInterval(this.animationId);
            this.animationId = null;
            this.textarea.value = this.frames[13] || '';
        }
    }
}

// Navigation System
class Navigation {
    constructor() {
        this.setupEventListeners();
        this.handleInitialLoad();
    }

    setupEventListeners() {
        // Browser navigation
        window.addEventListener('popstate', () => {
            const hash = location.hash.slice(1);
            if (hash) this.loadContent(hash.replace(/-/g, ' '));
        });

        // Social dropdown
        const socialsBtn = document.querySelector('.socials-button');
        const dropdown = document.querySelector('.social-dropdown');
        
        if (socialsBtn && dropdown) {
            socialsBtn.addEventListener('click', () => this.toggleSocials());
            document.addEventListener('click', (e) => {
                if (!socialsBtn.contains(e.target) && !dropdown.contains(e.target)) {
                    this.closeSocials();
                }
            });
        }
    }

    toggleMenu(menuItem, event) {
        // Menu toggle
        document.addEventListener('click', (e) => {
            const menuItem = e.target.closest('.menu-item');
            if (menuItem) this.toggleMenu(menuItem, e);
        });

        event.preventDefault();
        const submenu = menuItem.querySelector('.submenu');
        if (!submenu) return;

        // Close other menus
        document.querySelectorAll('.menu-item.expanded')
            .forEach(item => item !== menuItem && item.classList.remove('expanded'));

        // Toggle current menu
        const isExpanding = !menuItem.classList.contains('expanded');
        menuItem.classList.toggle('expanded');

        if (isExpanding) {
            setTimeout(() => {
                const closeOnOutsideClick = (e) => {
                    if (!menuItem.contains(e.target)) {
                        menuItem.classList.remove('expanded');
                        document.removeEventListener('click', closeOnOutsideClick);
                    }
                };
                document.addEventListener('click', closeOnOutsideClick);
            }, 0);
        }
    }

    toggleSocials() {
        const chevron = document.querySelector('.chevron');
        const dropdown = document.querySelector('.social-dropdown');
        chevron?.classList.toggle('open');
        dropdown?.classList.toggle('show');
    }

    closeSocials() {
        const chevron = document.querySelector('.chevron');
        const dropdown = document.querySelector('.social-dropdown');
        chevron?.classList.remove('open');
        dropdown?.classList.remove('show');
    }

    loadContent(contentKey) {
        const contentDiv = document.getElementById('content');
        const normalizedKey = contentKey.toLowerCase().replace(/\s+/g, '-');
        const filePath = `page/${normalizedKey}.html`;
        
        history.pushState(null, '', `#${normalizedKey}`);
        
        fetch(filePath)
            .then(response => {
                if (!response.ok) throw new Error(`Failed to load ${filePath}`);
                return response.text();
            })
            .then(html => {
                contentDiv.innerHTML = html;
                this.addNavigationBorder();
            })
            .catch(error => {
                console.error(error);
                contentDiv.innerHTML = `
                    <div class="margin">
                        <h2>Error</h2>
                        <p>Could not load the content. Please try again later.</p>
                    </div>`;
                this.addNavigationBorder();
            });
    }

    addNavigationBorder() {
        document.querySelector('.navigation')?.classList.add('border');
    }

    handleInitialLoad() {
        const hash = location.hash.slice(1);
        if (hash) this.loadContent(hash.replace(/-/g, ' '));
    }
}

// Utility function
function refreshPath() {
    const path = location.pathname;
    const hasIndex = path.endsWith('index.html');
    const basePath = path.split('#')[0];
    location.href = hasIndex ? basePath : basePath + 'index.html';
}

// Initialize everything when DOM is loaded
window.addEventListener('load', () => {
    const contentDiv = document.getElementById('content');
    const textarea = document.getElementById('ascii-art');
    
    // Reset content and add textarea
    contentDiv.innerHTML = '';
    if (textarea) contentDiv.appendChild(textarea);
    
    // Initialize systems
    new ASCIIAnimator();
    new Navigation();
});

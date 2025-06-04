
function scrollToProjects() {
    const mainBody = document.querySelector('.main-body');
    const projectsSection = document.querySelector('.projects');
    const projectsHeader = projectsSection.querySelector('h2');
    
    if (projectsSection && mainBody) {
        const mainBodyRect = mainBody.getBoundingClientRect();
        const projectsRect = projectsSection.getBoundingClientRect();
        
        const scrollPosition = mainBody.scrollTop + (projectsRect.top - mainBodyRect.top) - 20; 
        
        mainBody.scrollTo({
            top: scrollPosition,
            behavior: 'smooth'
        });
        
        setTimeout(() => {
            projectsHeader.classList.add('section-glow');
            
            setTimeout(() => {
                projectsHeader.classList.remove('section-glow');
            }, 2000);
        }, 300);
    }
}

document.addEventListener('DOMContentLoaded', function() {
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
});

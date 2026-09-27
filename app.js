document.addEventListener("DOMContentLoaded", () => {
    
    if (typeof init3DScene === "function") {
        init3DScene();
    }

    // 1. Slow, Cinematic Tab Navigation
    document.querySelectorAll('.nav-pill').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            // Uses GSAP to scroll much slower than native CSS smooth scroll
            gsap.to(window, {
                scrollTo: targetId,
                duration: 1.0, 
                ease: "power3.inOut"
            });
        });
    });

    // 2. Fade In Panels smoothly as you reach them
    const panels = document.querySelectorAll(".panel .hero-container, .panel .content-box:not(.main-hero-card)");
    panels.forEach((panel) => {
        gsap.fromTo(panel, 
            { opacity: 0, y: 50 },
            {
                opacity: 1, y: 0, duration: 1,
                scrollTrigger: {
                    trigger: panel,
                    start: "top 75%", 
                    end: "bottom 25%",
                    toggleActions: "play reverse play reverse"
                }
            }
        );
    });

    // 3. Gravity Key Listener ('G')
    document.addEventListener('keydown', (e) => {
        // Stop it from triggering if you are typing a message in the contact form
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return; 
        }
        
        if (e.key.toLowerCase() === 'g') {
            if (typeof window.toggleGravity === "function") {
                window.toggleGravity();
            }
        }
    });

    // 4. Dark/Light Mode
    const themeBtn = document.getElementById('theme-toggle');
    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        const isLight = document.body.classList.contains('light-mode');
        if (typeof window.update3DTheme === "function") {
            window.update3DTheme(isLight);
        }
    });

    // 5. Close Lightbox on outside click
    document.getElementById('photo-lightbox').addEventListener('click', function(e) {
        if (e.target === this) closeLightbox();
    });
});

window.openLightbox = function() {
    const lightbox = document.getElementById('photo-lightbox');
    lightbox.classList.add('active');
};

window.closeLightbox = function() {
    const lightbox = document.getElementById('photo-lightbox');
    lightbox.classList.remove('active');
};

window.sendEmail = function(e) {
    e.preventDefault();
    const name = document.getElementById('senderName').value;
    const message = document.getElementById('senderMessage').value;
    
    const subject = `Portfolio Contact from ${name}`;
    const body = `${message}\n\n--- \nSent from Portfolio website by: ${name}`;
    
    window.location.href = `mailto:sharifvcn@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};

// Rogue Node Mini-Game Logic
let score = 0;
let gameInterval;
let isGameRunning = false;

window.toggleMiniGame = function() {
    const trigger = document.getElementById('game-trigger');
    const node = document.getElementById('game-node');
    
    if (isGameRunning) {
        isGameRunning = false;
        node.style.display = 'none';
        clearTimeout(gameInterval);
        trigger.innerHTML = "<i class='fa-solid fa-gamepad'></i> Bored? Initialize Mini-Game.";
        return;
    }
    
    isGameRunning = true;
    score = 0;
    trigger.innerHTML = "Catch the rogue node! Score: 0/5 (Click here to Power Off)";
    node.style.display = 'block';
    
    moveNode();
    
    node.onclick = function() {
        if (!isGameRunning) return;
        score++;
        trigger.innerHTML = `Catch the rogue node! Score: ${score}/5 (Click here to Power Off)`;
        
        if (score >= 5) {
            isGameRunning = false;
            node.style.display = 'none';
            trigger.innerHTML = "System Secured! Mission Accomplished <i class='fa-solid fa-trophy' style='color: #00f2fe;'></i>";
            clearTimeout(gameInterval);
        } else {
            moveNode();
        }
    };
};

function moveNode() {
    if (!isGameRunning) return;
    const node = document.getElementById('game-node');
    
    const x = Math.random() * (window.innerWidth - 80) + 20;
    const y = Math.random() * (window.innerHeight - 80) + 20;
    
    node.style.left = x + 'px';
    node.style.top = y + 'px';
    
    clearTimeout(gameInterval);
    gameInterval = setTimeout(moveNode, 1200 - (score * 150)); 
}
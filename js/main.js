// ===== Loading Screen =====
window.addEventListener('load', () => {
    const loadingScreen = document.querySelector('.loading-screen');
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        document.body.style.overflow = 'auto';
        initRevealAnimations();
        highlightActiveSection();
    }, 1500);
});

// ===== Custom Cursor =====
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    
    setTimeout(() => {
        cursorFollower.style.left = e.clientX + 'px';
        cursorFollower.style.top = e.clientY + 'px';
    }, 100);
});

// Enlarge cursor on interactive elements
const interactiveElements = document.querySelectorAll('a, button, .project-image-wrapper');
interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.style.width = '20px';
        cursor.style.height = '20px';
        cursorFollower.style.width = '60px';
        cursorFollower.style.height = '60px';
    });
    
    el.addEventListener('mouseleave', () => {
        cursor.style.width = '10px';
        cursor.style.height = '10px';
        cursorFollower.style.width = '40px';
        cursorFollower.style.height = '40px';
    });
});

// ===== Scroll Progress =====
const scrollProgress = document.querySelector('.scroll-progress-bar');

window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (window.scrollY / windowHeight) * 100;
    scrollProgress.style.width = scrolled + '%';
    highlightActiveSection();
});

// ===== Header Hide on Scroll =====
let lastScroll = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > lastScroll && currentScroll > 100) {
        header.classList.add('hidden');
    } else {
        header.classList.remove('hidden');
    }
    
    lastScroll = currentScroll;
});

// ===== Mobile Navigation =====
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger?.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// ===== Scroll to Top Button =====
const scrollToTopBtn = document.querySelector('.scroll-to-top');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 500) {
        scrollToTopBtn.classList.add('show');
    } else {
        scrollToTopBtn.classList.remove('show');
    }
});

scrollToTopBtn?.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ===== Reveal Animations on Scroll =====
function initRevealAnimations() {
    const revealElements = document.querySelectorAll('[data-reveal]');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('revealed');
                }, index * 100);
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(el => revealObserver.observe(el));
}

// ===== Enhanced 3D Eyes with Smoother Tracking =====
const eyesContainer = document.getElementById('eyesContainer');
const eyes = document.querySelectorAll('.iris');

if (eyesContainer && eyes.length > 0) {
    let targetEyePositions = [];
    let currentEyePositions = [];
    
    eyes.forEach(() => {
        targetEyePositions.push({ x: 0, y: 0 });
        currentEyePositions.push({ x: 0, y: 0 });
    });
    
    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        
        eyes.forEach((iris, index) => {
            const eye = iris.closest('.eye');
            const eyeRect = eye.getBoundingClientRect();
            const eyeCenterX = eyeRect.left + eyeRect.width / 2;
            const eyeCenterY = eyeRect.top + eyeRect.height / 2;
            
            const deltaX = mouseX - eyeCenterX;
            const deltaY = mouseY - eyeCenterY;
            const angle = Math.atan2(deltaY, deltaX);
            
            const rawDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            const distance = Math.min(35, rawDistance / 8);
            
            targetEyePositions[index].x = Math.cos(angle) * distance;
            targetEyePositions[index].y = Math.sin(angle) * distance;
        });
    });
    
    function animateEyes() {
        eyes.forEach((iris, index) => {
            // Lerp towards target position
            currentEyePositions[index].x += (targetEyePositions[index].x - currentEyePositions[index].x) * 0.15;
            currentEyePositions[index].y += (targetEyePositions[index].y - currentEyePositions[index].y) * 0.15;
            
            iris.style.transform = `translate(calc(-50% + ${currentEyePositions[index].x}px), calc(-50% + ${currentEyePositions[index].y}px))`;
        });
        
        requestAnimationFrame(animateEyes);
    }
    
    animateEyes();
    
    // Reset position when mouse leaves viewport
    document.addEventListener('mouseleave', () => {
        targetEyePositions.forEach(pos => {
            pos.x = 0;
            pos.y = 0;
        });
    });
    
    setInterval(() => {
        eyes.forEach(iris => {
            const eye = iris.closest('.eye');
            eye.style.transform = 'scaleY(0.1)';
            
            setTimeout(() => {
                eye.style.transform = 'scaleY(1)';
            }, 150);
        });
    }, 5000 + Math.random() * 3000);
}

// ===== Enhanced Animated Particle Background with Matrix Effect =====
const particlesCanvas = document.getElementById('particles-canvas');
if (particlesCanvas) {
    const ctx = particlesCanvas.getContext('2d');
    
    // Set canvas size
    function resizeParticlesCanvas() {
        particlesCanvas.width = window.innerWidth;
        particlesCanvas.height = Math.max(
            document.documentElement.scrollHeight,
            window.innerHeight
        );
    }
    
    resizeParticlesCanvas();
    window.addEventListener('resize', resizeParticlesCanvas);
    
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            particlesCanvas.height = Math.max(
                document.documentElement.scrollHeight,
                window.innerHeight
            );
        }, 100);
    });
    
    class Particle {
        constructor(type = 'dot') {
            this.type = type;
            this.reset();
        }
        
        reset() {
            this.x = Math.random() * particlesCanvas.width;
            this.y = Math.random() * particlesCanvas.height;
            
            if (this.type === 'dot') {
                this.vx = (Math.random() - 0.5) * 0.8;
                this.vy = (Math.random() - 0.5) * 0.8;
                this.radius = Math.random() * 2.5 + 1;
                this.opacity = Math.random() * 0.8 + 0.2;
                this.hue = Math.random() * 30 + 150; // Green-cyan range
            } else if (this.type === 'line') {
                this.vx = 0;
                this.vy = Math.random() * 2 + 1;
                this.length = Math.random() * 20 + 10;
                this.opacity = Math.random() * 0.5 + 0.1;
            }
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            // Wrap around screen
            if (this.x < 0) this.x = particlesCanvas.width;
            if (this.x > particlesCanvas.width) this.x = 0;
            if (this.y < 0) this.y = particlesCanvas.height;
            if (this.y > particlesCanvas.height) this.y = 0;
            
            if (this.type === 'dot') {
                this.opacity += Math.sin(Date.now() * 0.001 + this.x) * 0.001;
                this.opacity = Math.max(0.2, Math.min(1, this.opacity));
            }
        }
        
        draw() {
            if (this.type === 'dot') {
                const gradient = ctx.createRadialGradient(
                    this.x, this.y, 0,
                    this.x, this.y, this.radius * 2
                );
                gradient.addColorStop(0, `hsla(${this.hue}, 100%, 50%, ${this.opacity})`);
                gradient.addColorStop(1, `hsla(${this.hue}, 100%, 50%, 0)`);
                
                ctx.fillStyle = gradient;
                ctx.shadowBlur = 15;
                ctx.shadowColor = `hsl(${this.hue}, 100%, 50%)`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fill();
            } else if (this.type === 'line') {
                const gradient = ctx.createLinearGradient(
                    this.x, this.y,
                    this.x, this.y + this.length
                );
                gradient.addColorStop(0, `rgba(0, 255, 136, 0)`);
                gradient.addColorStop(0.5, `rgba(0, 255, 136, ${this.opacity})`);
                gradient.addColorStop(1, `rgba(0, 255, 136, 0)`);
                
                ctx.strokeStyle = gradient;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(this.x, this.y + this.length);
                ctx.stroke();
            }
        }
    }
    
    const particles = [];
    const particleCount = 120;
    const lineCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle('dot'));
    }
    
    for (let i = 0; i < lineCount; i++) {
        particles.push(new Particle('line'));
    }
    
    let mouseX = 0;
    let mouseY = 0;
    let mouseParticles = [];
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY + window.scrollY;
        
        // Create particles near mouse
        if (Math.random() > 0.9) {
            mouseParticles.push({
                x: mouseX + (Math.random() - 0.5) * 50,
                y: mouseY + (Math.random() - 0.5) * 50,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                life: 1,
                radius: Math.random() * 3 + 1
            });
        }
    });
    
    let lastTime = 0;
    const targetFPS = 60;
    const frameDelay = 1000 / targetFPS;
    
    function animateParticles(currentTime) {
        const deltaTime = currentTime - lastTime;
        
        if (deltaTime >= frameDelay) {
            ctx.clearRect(0, 0, particlesCanvas.width, particlesCanvas.height);
            
            // Draw connections between nearby particles
            for (let i = 0; i < particles.length; i++) {
                if (particles[i].type !== 'dot') continue;
                
                for (let j = i + 1; j < particles.length; j++) {
                    if (particles[j].type !== 'dot') continue;
                    
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 150) {
                        const opacity = 0.3 * (1 - distance / 150);
                        ctx.strokeStyle = `rgba(0, 255, 136, ${opacity})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
                
                // Connect to mouse
                const dx = particles[i].x - mouseX;
                const dy = particles[i].y - mouseY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 200) {
                    const opacity = 0.4 * (1 - distance / 200);
                    ctx.strokeStyle = `rgba(0, 204, 255, ${opacity})`;
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(mouseX, mouseY);
                    ctx.stroke();
                }
            }
            
            // Update and draw particles
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });
            
            // Update and draw mouse particles
            mouseParticles = mouseParticles.filter(p => p.life > 0);
            mouseParticles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                p.life -= 0.02;
                
                ctx.fillStyle = `rgba(0, 204, 255, ${p.life})`;
                ctx.shadowBlur = 10;
                ctx.shadowColor = '#00ccff';
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius * p.life, 0, Math.PI * 2);
                ctx.fill();
            });
            
            lastTime = currentTime;
        }
        
        requestAnimationFrame(animateParticles);
    }
    
    animateParticles(0);
}

// ===== Smooth Scroll for Anchor Links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            navLinks.classList.remove('active');
            hamburger?.classList.remove('active');
        }
    });
});

// ===== Active Nav Link Highlighting =====
function highlightActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 100) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// ===== Enhanced parallax effect with smoother motion =====
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const gradientBlurs = document.querySelectorAll('.gradient-blur');
    
    gradientBlurs.forEach((blur, index) => {
        const speed = 0.3 + (index * 0.15);
        const rotation = scrolled * 0.05;
        blur.style.transform = `translateY(${scrolled * speed}px) rotate(${rotation}deg)`;
    });
});

// ===== Pause on Hover for Skills Marquee =====
document.querySelectorAll('.skills-marquee-wrapper').forEach(wrapper => {
    const track = wrapper.querySelector('.skills-track');
    
    wrapper.addEventListener('mouseenter', () => {
        track.style.animationPlayState = 'paused';
    });
    
    wrapper.addEventListener('mouseleave', () => {
        track.style.animationPlayState = 'running';
    });
});

// ===== SCREEN CRACK & GLITCH EFFECT =====
const screenCrackOverlay = document.getElementById('screenCrackOverlay');
let crackActive = false;
let crackTimeout = null;

function triggerScreenCrack() {
    if (crackActive) return;
    
    crackActive = true;
    console.log('[v0] Screen crack effect triggered!');
    
    // Add shake effect to body
    document.body.classList.add('screen-shaking');
    
    // Show crack overlay
    screenCrackOverlay.classList.add('active');
    screenCrackOverlay.innerHTML = '';
    
    // Create crack container
    const crackContainer = document.createElement('div');
    crackContainer.className = 'crack-container';
    
    // Add white flash effect
    const flash = document.createElement('div');
    flash.className = 'crack-flash';
    crackContainer.appendChild(flash);
    
    // Random crack point (usually center-ish)
    const crackX = window.innerWidth * (0.4 + Math.random() * 0.2);
    const crackY = window.innerHeight * (0.3 + Math.random() * 0.4);
    
    // Create void hole at crack point
    const voidSize = 150 + Math.random() * 100;
    const voidHole = document.createElement('div');
    voidHole.className = 'void-hole';
    voidHole.style.left = (crackX - voidSize / 2) + 'px';
    voidHole.style.top = (crackY - voidSize / 2) + 'px';
    voidHole.style.width = voidSize + 'px';
    voidHole.style.height = voidSize + 'px';
    voidHole.style.borderRadius = '50%';
    
    // Add glitch effects inside void
    const voidGlitch = document.createElement('div');
    voidGlitch.className = 'void-glitch';
    voidHole.appendChild(voidGlitch);
    
    const voidRgbSplit = document.createElement('div');
    voidRgbSplit.className = 'void-rgb-split';
    voidHole.appendChild(voidRgbSplit);
    
    const voidStatic = document.createElement('div');
    voidStatic.className = 'void-static';
    voidHole.appendChild(voidStatic);
    
    crackContainer.appendChild(voidHole);
    
    // Create SVG for crack lines
    const crackSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    crackSvg.classList.add('crack-svg');
    crackSvg.setAttribute('viewBox', `0 0 ${window.innerWidth} ${window.innerHeight}`);
    
    // Generate radiating crack lines
    const numCracks = 8 + Math.floor(Math.random() * 5);
    for (let i = 0; i < numCracks; i++) {
        const angle = (Math.PI * 2 * i) / numCracks + (Math.random() - 0.5) * 0.5;
        const length = 150 + Math.random() * 200;
        const endX = crackX + Math.cos(angle) * length;
        const endY = crackY + Math.sin(angle) * length;
        
        // Create wavy crack line
        const midX1 = crackX + Math.cos(angle) * length * 0.3 + (Math.random() - 0.5) * 40;
        const midY1 = crackY + Math.sin(angle) * length * 0.3 + (Math.random() - 0.5) * 40;
        const midX2 = crackX + Math.cos(angle) * length * 0.7 + (Math.random() - 0.5) * 30;
        const midY2 = crackY + Math.sin(angle) * length * 0.7 + (Math.random() - 0.5) * 30;
        
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.classList.add('crack-line');
        path.setAttribute('d', `M ${crackX} ${crackY} Q ${midX1} ${midY1} ${midX2} ${midY2} T ${endX} ${endY}`);
        path.style.animationDelay = (i * 0.05) + 's';
        crackSvg.appendChild(path);
    }
    
    crackContainer.appendChild(crackSvg);
    
    // Create falling glass shards
    const numShards = 12 + Math.floor(Math.random() * 8);
    for (let i = 0; i < numShards; i++) {
        setTimeout(() => {
            const shard = document.createElement('div');
            shard.className = 'glass-shard';
            
            // Random shard size and position near crack
            const shardWidth = 30 + Math.random() * 50;
            const shardHeight = 40 + Math.random() * 60;
            const offsetX = (Math.random() - 0.5) * voidSize * 1.5;
            const offsetY = (Math.random() - 0.5) * voidSize * 1.5;
            
            shard.style.left = (crackX + offsetX - shardWidth / 2) + 'px';
            shard.style.top = (crackY + offsetY - shardHeight / 2) + 'px';
            shard.style.width = shardWidth + 'px';
            shard.style.height = shardHeight + 'px';
            
            // Irregular polygon shape
            const points = Math.floor(Math.random() * 3) + 4; // 4-6 sides
            shard.style.clipPath = `polygon(${Array.from({ length: points }, () => 
                `${Math.random() * 100}% ${Math.random() * 100}%`
            ).join(', ')})`;
            
            // Fall animation parameters
            const fallX = (Math.random() - 0.5) * 200;
            const fallY = window.innerHeight - (crackY + offsetY) + 100;
            const fallRotate = (Math.random() - 0.5) * 720;
            
            shard.style.setProperty('--fall-x', fallX + 'px');
            shard.style.setProperty('--fall-y', fallY + 'px');
            shard.style.setProperty('--fall-rotate', fallRotate + 'deg');
            
            crackContainer.appendChild(shard);
            
            // Start falling animation
            setTimeout(() => {
                shard.classList.add('falling');
            }, 50);
            
        }, i * 80 + Math.random() * 100);
    }
    
    screenCrackOverlay.appendChild(crackContainer);
    
    // Remove shake after animation
    setTimeout(() => {
        document.body.classList.remove('screen-shaking');
    }, 500);
    
    // Hide crack after 5 seconds
    setTimeout(() => {
        screenCrackOverlay.classList.remove('active');
        setTimeout(() => {
            screenCrackOverlay.innerHTML = '';
            crackActive = false;
        }, 300);
    }, 5000);
}

// Trigger crack effect randomly during browsing
function scheduleRandomCrack() {
    // Random interval between 30-90 seconds
    const minInterval = 30000; // 30 seconds
    const maxInterval = 90000; // 90 seconds
    const randomInterval = Math.random() * (maxInterval - minInterval) + minInterval;
    
    crackTimeout = setTimeout(() => {
        triggerScreenCrack();
        scheduleRandomCrack(); // Schedule next one
    }, randomInterval);
}

// Start scheduling after page load
window.addEventListener('load', () => {
    // First crack after 20 seconds of browsing
    setTimeout(() => {
        triggerScreenCrack();
        scheduleRandomCrack();
    }, 20000);
});

// Also trigger on specific user actions (optional)
let scrollCount = 0;
window.addEventListener('scroll', () => {
    scrollCount++;
    // Trigger after 50 scroll events
    if (scrollCount === 50 && !crackActive) {
        triggerScreenCrack();
        scrollCount = 0;
    }
});

// Trigger on rapid clicks (easter egg)
let clickCount = 0;
let clickTimer = null;
document.addEventListener('click', () => {
    clickCount++;
    
    clearTimeout(clickTimer);
    clickTimer = setTimeout(() => {
        clickCount = 0;
    }, 2000);
    
    // Trigger after 10 rapid clicks
    if (clickCount >= 10 && !crackActive) {
        triggerScreenCrack();
        clickCount = 0;
    }
});

// ===== EXCLUSIVE FEATURES =====

// ===== Interactive Terminal =====
const terminalToggle = document.getElementById('terminalToggle');
const terminalContainer = document.getElementById('terminalContainer');
const terminalClose = document.getElementById('terminalClose');
const terminalBody = document.getElementById('terminalBody');
const terminalInput = document.getElementById('terminalInput');

let terminalHistory = [];
let historyIndex = -1;

const terminalCommands = {
    help: () => {
        return `
Available commands:
  about       - Learn more about me
  skills      - View my technical skills
  projects    - See my projects
  contact     - Get contact information
  matrix      - Toggle Matrix mode
  theme       - Switch theme
  achievements - View achievements
  clear       - Clear terminal
  social      - Show social links
  secret      - Try to find the secret code
  konami      - Hint about special code
        `;
    },
    about: () => {
        window.location.hash = 'about';
        return 'Navigating to About section...';
    },
    skills: () => {
        window.location.hash = 'skills';
        return 'Navigating to Skills section...';
    },
    projects: () => {
        window.location.hash = 'projects';
        return 'Navigating to Projects section...';
    },
    contact: () => {
        window.location.hash = 'contact';
        return 'Navigating to Contact section...';
    },
    matrix: () => {
        toggleMatrix();
        return 'Matrix mode toggled!';
    },
    theme: () => {
        toggleTheme();
        return 'Theme switched!';
    },
    achievements: () => {
        showAchievements();
        return 'Opening achievements panel...';
    },
    clear: () => {
        terminalBody.innerHTML = '';
        return null;
    },
    social: () => {
        return `
Social Links:
  GitHub: https://github.com/lxxaviss
  LinkedIn: [Add your link]
  Twitter: [Add your link]
        `;
    },
    secret: () => {
        return 'Try the Konami code: ↑ ↑ ↓ ↓ ← → ← → B A';
    },
    konami: () => {
        return 'The legendary code: Up Up Down Down Left Right Left Right B A';
    },
    whoami: () => {
        return 'visitor@portfolio - A curious explorer';
    },
    date: () => {
        return new Date().toString();
    },
    echo: (args) => {
        return args.join(' ');
    }
};

function executeCommand(command) {
    const parts = command.trim().split(' ');
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);
    
    if (terminalCommands[cmd]) {
        const result = terminalCommands[cmd](args);
        if (result !== null) {
            addTerminalLine('', result, 'output');
        }
    } else if (cmd === '') {
        // Do nothing for empty command
    } else {
        addTerminalLine('', `Command not found: ${cmd}. Type 'help' for available commands.`, 'error');
    }
    
    checkAchievement('terminal-master');
}

function addTerminalLine(prompt, text, type = 'input') {
    const line = document.createElement('div');
    line.className = `terminal-line ${type}`;
    
    if (prompt) {
        const promptSpan = document.createElement('span');
        promptSpan.className = 'terminal-prompt';
        promptSpan.textContent = prompt;
        line.appendChild(promptSpan);
    }
    
    const textSpan = document.createElement('span');
    textSpan.className = 'terminal-text';
    textSpan.textContent = text;
    line.appendChild(textSpan);
    
    terminalBody.appendChild(line);
    terminalBody.scrollTop = terminalBody.scrollHeight;
}

terminalToggle?.addEventListener('click', () => {
    terminalContainer.classList.toggle('active');
    if (terminalContainer.classList.contains('active')) {
        terminalInput.focus();
        checkAchievement('first-command');
    }
});

terminalClose?.addEventListener('click', () => {
    terminalContainer.classList.remove('active');
});

terminalInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const command = terminalInput.value;
        if (command.trim()) {
            addTerminalLine('visitor@portfolio:~$', command);
            terminalHistory.unshift(command);
            historyIndex = -1;
            executeCommand(command);
        }
        terminalInput.value = '';
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (historyIndex < terminalHistory.length - 1) {
            historyIndex++;
            terminalInput.value = terminalHistory[historyIndex];
        }
    } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyIndex > 0) {
            historyIndex--;
            terminalInput.value = terminalHistory[historyIndex];
        } else {
            historyIndex = -1;
            terminalInput.value = '';
        }
    }
});

// ===== Achievements System =====
const achievements = [
    { id: 'first-visit', name: 'First Visit', description: 'Welcome to my portfolio!', icon: 'fa-door-open', unlocked: false },
    { id: 'explorer', name: 'Explorer', description: 'Visited all sections', icon: 'fa-compass', unlocked: false },
    { id: 'first-command', name: 'Terminal Novice', description: 'Opened the terminal', icon: 'fa-terminal', unlocked: false },
    { id: 'terminal-master', name: 'Terminal Master', description: 'Used 5 terminal commands', icon: 'fa-code', unlocked: false },
    { id: 'matrix-fan', name: 'Matrix Fan', description: 'Activated Matrix mode', icon: 'fa-film', unlocked: false },
    { id: 'theme-switcher', name: 'Theme Switcher', description: 'Changed the theme', icon: 'fa-palette', unlocked: false },
    { id: 'skill-explorer', name: 'Skill Explorer', description: 'Viewed the skill tree', icon: 'fa-project-diagram', unlocked: false },
    { id: 'social-butterfly', name: 'Social Butterfly', description: 'Clicked on all social links', icon: 'fa-users', unlocked: false },
    { id: 'konami-master', name: 'Konami Master', description: 'Entered the Konami code', icon: 'fa-gamepad', unlocked: false },
    { id: 'completionist', name: 'Completionist', description: 'Unlocked all achievements', icon: 'fa-crown', unlocked: false }
];

let commandCount = 0;
let visitedSections = new Set();
let socialLinksClicked = 0;

function checkAchievement(achievementId) {
    const achievement = achievements.find(a => a.id === achievementId);
    if (achievement && !achievement.unlocked) {
        if (achievementId === 'terminal-master') {
            commandCount++;
            if (commandCount >= 5) {
                unlockAchievement(achievement);
            }
        } else if (achievementId === 'explorer') {
            if (visitedSections.size >= 5) {
                unlockAchievement(achievement);
            }
        } else if (achievementId === 'social-butterfly') {
            if (socialLinksClicked >= 4) {
                unlockAchievement(achievement);
            }
        } else {
            unlockAchievement(achievement);
        }
        
        updateAchievementsUI();
    }
}

function unlockAchievement(achievement) {
    achievement.unlocked = true;
    showAchievementNotification(achievement);
    
    const unlockedCount = achievements.filter(a => a.unlocked).length;
    document.getElementById('achievementBadge').textContent = unlockedCount;
    
    if (unlockedCount === achievements.length - 1) {
        checkAchievement('completionist');
    }
}

function showAchievementNotification(achievement) {
    const notification = document.getElementById('achievementNotification');
    const description = notification.querySelector('.achievement-description');
    description.textContent = achievement.name;
    
    notification.classList.add('show');
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

function showAchievements() {
    const panel = document.getElementById('achievementsPanel');
    panel.classList.add('active');
    updateAchievementsUI();
}

function updateAchievementsUI() {
    const list = document.getElementById('achievementsList');
    const count = document.getElementById('achievementsCount');
    
    list.innerHTML = '';
    let unlockedCount = 0;
    
    achievements.forEach(achievement => {
        if (achievement.unlocked) unlockedCount++;
        
        const item = document.createElement('div');
        item.className = `achievement-item ${achievement.unlocked ? 'unlocked' : 'locked'}`;
        item.innerHTML = `
            <i class="fas ${achievement.icon}"></i>
            <div class="achievement-info">
                <div class="achievement-name">${achievement.name}</div>
                <div class="achievement-desc">${achievement.description}</div>
            </div>
            ${achievement.unlocked ? '<i class="fas fa-check-circle achievement-check"></i>' : ''}
        `;
        list.appendChild(item);
    });
    
    count.textContent = `${unlockedCount}/${achievements.length}`;
}

document.getElementById('achievementsToggle')?.addEventListener('click', showAchievements);
document.getElementById('closeAchievements')?.addEventListener('click', () => {
    document.getElementById('achievementsPanel').classList.remove('active');
});

// Track visited sections
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            visitedSections.add(entry.target.id);
            if (visitedSections.size >= 5) {
                checkAchievement('explorer');
            }
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('section[id]').forEach(section => {
    sectionObserver.observe(section);
});

// Track social links
document.querySelectorAll('.social-link').forEach(link => {
    link.addEventListener('click', () => {
        socialLinksClicked++;
        checkAchievement('social-butterfly');
    });
});

// First visit achievement
setTimeout(() => {
    checkAchievement('first-visit');
}, 2000);

// ===== Matrix Mode =====
const matrixCanvas = document.getElementById('matrix-canvas');
const matrixCtx = matrixCanvas?.getContext('2d');
let matrixActive = false;
let matrixAnimationId = null;

function toggleMatrix() {
    matrixActive = !matrixActive;
    
    if (matrixActive) {
        matrixCanvas.classList.add('active');
        startMatrixRain();
        checkAchievement('matrix-fan');
    } else {
        matrixCanvas.classList.remove('active');
        if (matrixAnimationId) {
            cancelAnimationFrame(matrixAnimationId);
        }
    }
}

function startMatrixRain() {
    if (!matrixCanvas || !matrixCtx) return;
    
    matrixCanvas.width = window.innerWidth;
    matrixCanvas.height = window.innerHeight;
    
    const fontSize = 14;
    const columns = Math.floor(matrixCanvas.width / fontSize);
    const drops = Array(columns).fill(1);
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,.<>?';
    
    function draw() {
        matrixCtx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        matrixCtx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
        
        matrixCtx.fillStyle = '#0f0';
        matrixCtx.font = `${fontSize}px monospace`;
        
        for (let i = 0; i < drops.length; i++) {
            const char = chars[Math.floor(Math.random() * chars.length)];
            matrixCtx.fillText(char, i * fontSize, drops[i] * fontSize);
            
            if (drops[i] * fontSize > matrixCanvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
        
        if (matrixActive) {
            matrixAnimationId = requestAnimationFrame(draw);
        }
    }
    
    draw();
}

document.getElementById('matrixToggle')?.addEventListener('click', toggleMatrix);

// ===== Theme Switcher =====
let currentTheme = 'dark';

function toggleTheme() {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.body.classList.toggle('light-theme');
    
    const icon = document.querySelector('#themeToggle i');
    if (icon) {
        icon.className = currentTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
    }
    
    checkAchievement('theme-switcher');
}

document.getElementById('themeToggle')?.addEventListener('click', toggleTheme);

// ===== Interactive Skill Tree =====
const skillTreeModal = document.getElementById('skillTreeModal');
const skillTreeCanvas = document.getElementById('skillTreeCanvas');
const skillTreeCtx = skillTreeCanvas?.getContext('2d');

const skills = [
    { name: 'HTML5', x: 200, y: 100, level: 'expert', connections: ['CSS3', 'JavaScript'] },
    { name: 'CSS3', x: 350, y: 100, level: 'expert', connections: ['SCSS', 'JavaScript'] },
    { name: 'SCSS', x: 500, y: 100, level: 'expert', connections: [] },
    { name: 'JavaScript', x: 275, y: 200, level: 'expert', connections: ['React', 'Vue.js', 'Node.js'] },
    { name: 'React', x: 150, y: 300, level: 'intermediate', connections: [] },
    { name: 'Vue.js', x: 275, y: 300, level: 'expert', connections: ['Nuxt.js'] },
    { name: 'Nuxt.js', x: 275, y: 400, level: 'intermediate', connections: [] },
    { name: 'Node.js', x: 400, y: 300, level: 'intermediate', connections: ['PostgreSQL'] },
    { name: 'PostgreSQL', x: 400, y: 400, level: 'intermediate', connections: [] },
    { name: 'Flutter', x: 550, y: 300, level: 'intermediate', connections: ['Dart'] },
    { name: 'Dart', x: 550, y: 400, level: 'intermediate', connections: [] },
    { name: 'Docker', x: 100, y: 500, level: 'learning', connections: [] },
    { name: 'Git', x: 250, y: 500, level: 'expert', connections: [] },
    { name: 'Python', x: 400, y: 500, level: 'intermediate', connections: [] },
    { name: 'Java', x: 550, y: 500, level: 'learning', connections: [] }
];

function drawSkillTree() {
    if (!skillTreeCanvas || !skillTreeCtx) return;
    
    skillTreeCanvas.width = 700;
    skillTreeCanvas.height = 600;
    
    const ctx = skillTreeCtx;
    ctx.clearRect(0, 0, skillTreeCanvas.width, skillTreeCanvas.height);
    
    // Draw connections
    skills.forEach(skill => {
        skill.connections.forEach(connName => {
            const connSkill = skills.find(s => s.name === connName);
            if (connSkill) {
                ctx.strokeStyle = 'rgba(0, 255, 136, 0.3)';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(skill.x, skill.y);
                ctx.lineTo(connSkill.x, connSkill.y);
                ctx.stroke();
            }
        });
    });
    
    // Draw nodes
    skills.forEach(skill => {
        const colors = {
            expert: '#00ff88',
            intermediate: '#00ccff',
            learning: '#ff8800'
        };
        
        // Draw circle
        ctx.fillStyle = colors[skill.level];
        ctx.shadowBlur = 15;
        ctx.shadowColor = colors[skill.level];
        ctx.beginPath();
        ctx.arc(skill.x, skill.y, 30, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw inner circle
        ctx.fillStyle = '#0a0a0a';
        ctx.shadowBlur = 0;
        ctx.beginPath();
        ctx.arc(skill.x, skill.y, 25, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw text
        ctx.fillStyle = colors[skill.level];
        ctx.font = 'bold 11px "Orbitron", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(skill.name, skill.x, skill.y);
    });
}

document.getElementById('openSkillTree')?.addEventListener('click', () => {
    skillTreeModal.classList.add('active');
    drawSkillTree();
    checkAchievement('skill-explorer');
});

document.getElementById('closeSkillTree')?.addEventListener('click', () => {
    skillTreeModal.classList.remove('active');
});

// ===== Konami Code Easter Egg =====
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    
    if (key === konamiCode[konamiIndex] || e.code === konamiCode[konamiIndex]) {
        konamiIndex++;
        
        if (konamiIndex === konamiCode.length) {
            activateKonamiCode();
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

function activateKonamiCode() {
    const indicator = document.getElementById('easterEggIndicator');
    indicator.classList.add('show');
    
    // Special effects
    document.body.style.animation = 'rainbow 3s linear infinite';
    
    setTimeout(() => {
        document.body.style.animation = '';
        indicator.classList.remove('show');
    }, 5000);
    
    checkAchievement('konami-master');
}

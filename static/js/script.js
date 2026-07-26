gsap.registerPlugin(ScrollTrigger);

// Hamburger Menu Toggle
const hamburger = document.getElementById('navHamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close menu when a link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        }
    });
}

// Send contact-form enquiries to WhatsApp with the visitor's details pre-filled.
const contactForm = document.querySelector('.contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', (event) => {
        event.preventDefault();

        if (!contactForm.reportValidity()) {
            return;
        }

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const projectMessage = document.getElementById('message').value.trim();
        const whatsappMessage = [
            'Hello Bhawer Consulting,',
            '',
            `My name is ${name}.`,
            `Email: ${email}`,
            '',
            'Project details:',
            projectMessage
        ].join('\n');
        const whatsappUrl = `https://wa.me/919871543550?text=${encodeURIComponent(whatsappMessage)}`;

        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    });
}

// Hero Canvas Animation
const canvas = document.getElementById('hero-canvas');
const ctx = canvas.getContext('2d');
let width, height;
let particles = [];
let nodes = [];
let mouse = { x: 0, y: 0 };
let targetMouse = { x: 0, y: 0 };

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

window.addEventListener('resize', resize);
resize();

// Particle Class
class Particle {
    constructor() {
        this.reset();
    }
    
    reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.z = Math.random() * 100;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.vz = (Math.random() - 0.5) * 0.3;
        this.size = Math.random() * 3 + 1;
    }
    
    update() {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 200) {
            const force = (200 - dist) / 200;
            this.vx -= dx * force * 0.002;
            this.vy -= dy * force * 0.002;
        }
        
        this.x += this.vx;
        this.y += this.vy;
        this.z += this.vz;
        
        if (this.x < 0 || this.x > width || this.y < 0 || this.y > height || this.z < 0 || this.z > 100) {
            this.reset();
        }
    }
    
    draw() {
        const alpha = 0.3 + (1 - this.z / 100) * 0.7;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(122, 139, 90, ${alpha})`;
        ctx.fill();
    }
}

// Node Class
class Node {
    constructor() {
        this.reset();
    }
    
    reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
    }
    
    update() {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 300) {
            const force = (300 - dist) / 300;
            this.vx += dx * force * 0.001;
            this.vy += dy * force * 0.001;
        }
        
        this.x += this.vx;
        this.y += this.vy;
        
        this.vx *= 0.98;
        this.vy *= 0.98;
        
        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;
    }
    
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(122, 139, 90, 0.6)';
        ctx.fill();
    }
}

// Initialize Particles and Nodes
for (let i = 0; i < 150; i++) {
    particles.push(new Particle());
}

for (let i = 0; i < 40; i++) {
    nodes.push(new Node());
}

// Mouse Movement
window.addEventListener('mousemove', (e) => {
    targetMouse.x = e.clientX;
    targetMouse.y = e.clientY;
});

// Animation Loop
function animate() {
    mouse.x += (targetMouse.x - mouse.x) * 0.1;
    mouse.y += (targetMouse.y - mouse.y) * 0.1;
    
    ctx.clearRect(0, 0, width, height);
    
    // Draw mesh connections
    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            const dx = nodes[i].x - nodes[j].x;
            const dy = nodes[i].y - nodes[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < 200) {
                const alpha = (1 - dist / 200) * 0.3;
                ctx.beginPath();
                ctx.moveTo(nodes[i].x, nodes[i].y);
                ctx.lineTo(nodes[j].x, nodes[j].y);
                ctx.strokeStyle = `rgba(122, 139, 90, ${alpha})`;
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        }
    }
    
    // Draw curved data ribbons
    const time = Date.now() * 0.001;
    for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(0, height * 0.3 + i * 100);
        for (let x = 0; x <= width; x += 5) {
            const y = height * 0.3 + i * 100 + Math.sin(x * 0.01 + time + i) * 30;
            ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(122, 139, 90, ${0.1 + i * 0.05})`;
        ctx.lineWidth = 2 + i;
        ctx.stroke();
    }
    
    // Update and draw particles
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    
    // Update and draw nodes
    nodes.forEach(n => {
        n.update();
        n.draw();
    });
    
    requestAnimationFrame(animate);
}

animate();

// Magnetic Buttons
const magneticBtns = document.querySelectorAll('.magnetic-btn');

magneticBtns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const strength = btn.closest('.contact-form') ? 0.03 : 0.3;
        
        gsap.to(btn, {
            x: x * strength,
            y: y * strength,
            duration: 0.4,
            ease: 'power3.out'
        });
    });
    
    btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
            x: 0,
            y: 0,
            duration: 0.6,
            ease: 'elastic.out(1, 0.3)'
        });
    });
});

// GSAP Animations
gsap.from('.hero-badge', {
    opacity: 0,
    y: 30,
    duration: 0.8,
    delay: 0.2,
    ease: 'power3.out'
});

gsap.from('.hero-headline', {
    opacity: 0,
    y: 40,
    duration: 0.8,
    delay: 0.4,
    ease: 'power3.out'
});

gsap.from('.hero-description', {
    opacity: 0,
    y: 30,
    duration: 0.8,
    delay: 0.6,
    ease: 'power3.out'
});

gsap.from('.hero-ctas', {
    opacity: 0,
    y: 30,
    duration: 0.8,
    delay: 0.8,
    ease: 'power3.out'
});

gsap.from('.hero-logos', {
    opacity: 0,
    y: 30,
    duration: 0.8,
    delay: 1,
    ease: 'power3.out'
});

// Section Reveals
gsap.utils.toArray('.section').forEach((section, i) => {
    gsap.from(section.children, {
        scrollTrigger: {
            trigger: section,
            start: 'top 80%',
        },
        opacity: 0,
        y: 60,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out'
    });
});

// Service Cards
gsap.utils.toArray('.service-card').forEach((card, i) => {
    gsap.from(card, {
        scrollTrigger: {
            trigger: card,
            start: 'top 85%',
        },
        opacity: 0,
        y: 50,
        duration: 0.8,
        delay: i * 0.1,
        ease: 'power3.out'
    });
});

// Work Items
gsap.utils.toArray('.work-item').forEach((item, i) => {
    gsap.from(item, {
        scrollTrigger: {
            trigger: item,
            start: 'top 80%',
        },
        opacity: 0,
        x: i % 2 === 0 ? -50 : 50,
        duration: 1,
        ease: 'power3.out'
    });
});

// Counter Animation
const statNumbers = document.querySelectorAll('.stat-number');

statNumbers.forEach(stat => {
    const target = parseInt(stat.getAttribute('data-target'));
    
    ScrollTrigger.create({
        trigger: stat,
        start: 'top 85%',
        onEnter: () => {
            gsap.to(stat, {
                innerHTML: target,
                duration: 2,
                snap: { innerHTML: 1 },
                ease: 'power2.out'
            });
        }
    });
});

// Smooth scroll for nav links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

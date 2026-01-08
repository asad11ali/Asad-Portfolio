AOS.init({ duration: 1200, once: true });

// Cursor Movement
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');
document.addEventListener('mousemove', e => {
    cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
    follower.style.transform = `translate3d(${e.clientX - 10}px, ${e.clientY - 10}px, 0)`;
});

// Live Clock
function updateClock() {
    const now = new Date();
    const clockElement = document.getElementById('clock');
    if(clockElement) {
        clockElement.textContent = now.toLocaleTimeString('en-US', {
            hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
        });
    }
    const yearElement = document.getElementById('year');
    if(yearElement) yearElement.textContent = now.getFullYear();
}
setInterval(updateClock, 1000);
updateClock();

// Header Scroll
window.addEventListener('scroll', () => {
    const header = document.getElementById('mainHeader');
    if(header) header.classList.toggle('scrolled', window.scrollY > 80);
});

// Scroll Progress
const progressPath = document.querySelector('#scrollProgress path');
if (progressPath) {
    const pathLength = progressPath.getTotalLength();
    progressPath.style.strokeDasharray = `${pathLength} ${pathLength}`;
    progressPath.style.strokeDashoffset = pathLength;

    window.addEventListener('scroll', () => {
        const scroll = window.pageYOffset;
        const height = document.documentElement.scrollHeight - window.innerHeight;
        progressPath.style.strokeDashoffset = pathLength - (scroll * pathLength / height);
        document.querySelector('.percent-val').textContent = `${Math.round((scroll / height) * 100)}%`;
        document.getElementById('scrollProgress').classList.toggle('active-progress', scroll > 200);
    });
}

document.getElementById('scrollProgress').onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });

// Counter Logic
const counters = document.querySelectorAll('.counter');
let counterStarted = false;
function runCounters() {
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        let count = 0;
        const speed = target / 80;
        const updateCount = () => {
            count += speed;
            if (count < target) { counter.innerText = Math.ceil(count); requestAnimationFrame(updateCount); }
            else { counter.innerText = target; }
        };
        updateCount();
    });
}
window.addEventListener('scroll', () => {
    const section = document.querySelector('.ratings-grid');
    if (section && section.getBoundingClientRect().top < window.innerHeight - 100 && !counterStarted) {
        runCounters(); counterStarted = true;
    }
});

// ===== DARK MODE TOGGLE =====
const themeBtn = document.getElementById('theme-toggle');
const body = document.body;
if (themeBtn) {
    const themeIcon = themeBtn.querySelector('i');
    if (localStorage.getItem('theme') === 'dark') {
        body.classList.add('dark-mode');
        themeIcon.classList.replace('fa-moon', 'fa-sun');
    }

    themeBtn.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        const isDark = body.classList.contains('dark-mode');
        themeIcon.classList.replace(isDark ? 'fa-moon' : 'fa-sun', isDark ? 'fa-sun' : 'fa-moon');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
}

// ===== CONTACT FORM EMAIL SUBMISSION =====
const form = document.getElementById('contactForm');
if (form) {
    const submitBtn = document.getElementById('submitBtn');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const originalText = submitBtn.innerText;
        submitBtn.innerText = "Sending...";
        submitBtn.disabled = true;

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                submitBtn.innerText = "Message Sent!";
                submitBtn.style.background = "var(--accent)";
                form.reset();
            } else { throw new Error(); }
        } catch {
            submitBtn.innerText = "Error! Try again.";
            submitBtn.style.background = "#ef4444";
        } finally {
            setTimeout(() => {
                submitBtn.innerText = originalText;
                submitBtn.style.background = "var(--primary)";
                submitBtn.disabled = false;
            }, 3000);
        }
    });
}
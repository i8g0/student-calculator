

// ============================================
// تأثيرات السكرول الاحترافية - مدمجة في الملف الرئيسي
// ============================================

// مؤشر تقدم السكرول
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

// تأثيرات الظهور عند السكرول
function initScrollEffects() {
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible', 'revealed');
            }
        });
    }, observerOptions);

    const addScrollClasses = () => {
        document.querySelectorAll('.calculator-card').forEach((card, index) => {
            card.classList.add('scroll-reveal');
            card.style.transitionDelay = `${index * 0.1}s`;
            observer.observe(card);
        });

        document.querySelectorAll('.feature-card').forEach((card, index) => {
            const direction = index % 2 === 0 ? 'scroll-slide-left' : 'scroll-slide-right';
            card.classList.add(direction);
            card.style.transitionDelay = `${index * 0.1}s`;
            observer.observe(card);
        });

        document.querySelectorAll('.stat-card, .analytics-card').forEach((card, index) => {
            card.classList.add('scroll-scale-up');
            card.style.transitionDelay = `${index * 0.1}s`;
            observer.observe(card);
        });
    };

    setTimeout(addScrollClasses, 100);

    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            setTimeout(addScrollClasses, 300);
        });
    });
}

// تأثير Parallax
function initParallax() {
    const heroSection = document.querySelector('.hero-section');
    if (!heroSection) return;

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxSpeed = 0.5;

        if (heroSection && scrolled < window.innerHeight) {
            heroSection.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
        }
    });

    const particlesContainer = document.getElementById('particles-js');
    if (particlesContainer) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            particlesContainer.style.transform = `translateY(${scrolled * 0.3}px)`;
            particlesContainer.style.opacity = 1 - (scrolled / 1000);
        });
    }
}

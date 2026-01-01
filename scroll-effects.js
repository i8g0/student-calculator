// ============================================
// تأثيرات Parallax Layers القوية جداً
// ============================================

// مؤشر تقدم السكرول المحسن
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

// ============================================
// تأثير Parallax متعدد الطبقات
// ============================================
function initAdvancedParallax() {
    const scrollElements = [];

    // تجهيز العناصر للـ Parallax - فقط Hero والتبويبات
    const setupParallaxElements = () => {
        // فقط التبويبات - سرعة خفيفة
        document.querySelectorAll('.tab-btn').forEach((tab, index) => {
            scrollElements.push({
                element: tab,
                speed: 0.15,
                type: 'tab',
                rotation: false,
                zoom: false
            });
        });

        // إلغاء تأثيرات البطاقات والمحتوى - لا parallax
        // تم إزالة: calculator-card, feature-card, result-container, analytics-card
    };

    // تطبيق التأثيرات عند السكرول - نسخة عملية ومخففة
    const applyParallaxEffects = () => {
        const scrolled = window.pageYOffset;
        const windowHeight = window.innerHeight;

        scrollElements.forEach((item, index) => {
            const rect = item.element.getBoundingClientRect();
            const elementCenter = rect.top + rect.height / 2;
            const distanceFromCenter = elementCenter - windowHeight / 2;
            const normalizedDistance = distanceFromCenter / windowHeight;

            // حساب الموقع النسبي
            const elementTop = rect.top;
            const isInView = elementTop < windowHeight && elementTop > -rect.height;

            if (isInView) {
                let transforms = [];

                // تأثير الحركة العمودية Parallax - مخفف للنصف
                const yOffset = normalizedDistance * item.speed * 50; // كان 100 صار 50
                transforms.push(`translateY(${yOffset}px)`);

                // تأثير الحركة الأفقية - مخفف جداً
                if (item.direction) {
                    const xOffset = normalizedDistance * item.speed * 20 * item.direction; // كان 50 صار 20
                    transforms.push(`translateX(${xOffset}px)`);
                }

                // تأثير الزوم التدريجي - مخفف جداً
                if (item.zoom) {
                    const zoomFactor = 1 - Math.abs(normalizedDistance) * 0.05; // كان 0.15 صار 0.05
                    const clampedZoom = Math.max(0.95, Math.min(1.05, zoomFactor)); // نطاق أضيق
                    transforms.push(`scale(${clampedZoom})`);
                }

                // إلغاء تأثير الدوران ثلاثي الأبعاد - مشيل تماماً
                // if (item.rotation) {
                //     const rotateX = normalizedDistance * 5;
                //     const rotateY = normalizedDistance * item.speed * 20;
                //     transforms.push(`rotateX(${rotateX}deg) rotateY(${rotateY}deg)`);
                // }

                // إلغاء تأثير العمق ثلاثي الأبعاد - مشيل تماماً
                // if (item.depth3D) {
                //     const perspective = 1000 - Math.abs(normalizedDistance) * 500;
                //     item.element.style.perspective = `${Math.max(500, perspective)}px`;
                //     transforms.push(`translateZ(${normalizedDistance * -50}px)`);
                // }

                // تطبيق التحولات
                item.element.style.transform = transforms.join(' ');
                // item.element.style.transformStyle = 'preserve-3d'; // تم إزالة هذا السطر

                // تأثير الشفافية مخفف جداً - بدون blur
                const opacity = 1 - Math.abs(normalizedDistance) * 0.1; // كان 0.3 صار 0.1
                item.element.style.opacity = Math.max(0.85, Math.min(1, opacity)); // نطاق أضيق

                // إزالة تأثير Blur تماماً
                item.element.style.filter = 'none';

                // تأثير الظل الديناميكي - مخفف
                const shadowIntensity = (1 - Math.abs(normalizedDistance)) * 15; // كان 30 صار 15
                const shadowBlur = shadowIntensity * 1.5; // كان *2 صار *1.5
                item.element.style.boxShadow = `
                    0 ${shadowIntensity}px ${shadowBlur}px rgba(99, 102, 241, 0.1),
                    0 ${shadowIntensity / 2}px ${shadowBlur / 2}px rgba(0, 0, 0, 0.08)
                `;
            }
        });
    };

    // تهيئة العناصر
    setupParallaxElements();

    // تطبيق التأثيرات عند السكرول
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                applyParallaxEffects();
                ticking = false;
            });
            ticking = true;
        }
    });

    // تطبيق مبدئي
    applyParallaxEffects();

    // إعادة التهيئة عند تغيير التبويبات
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            setTimeout(() => {
                scrollElements.length = 0;
                setupParallaxElements();
                applyParallaxEffects();
            }, 300);
        });
    });
}

// ============================================
// تأثيرات الظهور المحسنة
// ============================================
function initScrollEffects() {
    const observerOptions = {
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const ratio = entry.intersectionRatio;

            if (entry.isIntersecting) {
                entry.target.classList.add('visible', 'revealed');

                // تأثير تدريجي بناءً على نسبة الظهور
                entry.target.style.setProperty('--reveal-progress', ratio);
            }
        });
    }, observerOptions);

    const addScrollClasses = () => {
        // التبويبات فقط - تأثير خفيف
        document.querySelectorAll('.tab-btn').forEach((tab, index) => {
            tab.classList.add('scroll-scale-fade');
            tab.style.transitionDelay = `${index * 0.05}s`;
            observer.observe(tab);
        });

        // إلغاء تأثيرات البطاقات والمحتوى
        // تم إزالة: calculator-card, feature-card, result-container, analytics-card
    };

    setTimeout(addScrollClasses, 100);

    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            setTimeout(addScrollClasses, 300);
        });
    });
}

// ============================================
// تأثير Hero Section - معطل
// ============================================
function initHeroParallax() {
    // تم تعطيل تأثيرات Hero Parallax بالكامل
    return;
}

// ============================================
// Smooth Scroll للروابط
// ============================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ============================================
// Navbar محسن مع Parallax
// ============================================
function initStickyNavbar() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        const scrollDiff = currentScroll - lastScroll;

        if (currentScroll > 100) {
            navbar.style.padding = '0.5rem 0';
            navbar.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.12)';


            // إخفاء عند السكرول للأسفل
            if (scrollDiff > 0 && currentScroll > 200) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }
        } else {
            navbar.style.padding = '1rem 0';
            navbar.style.boxShadow = 'none';
            navbar.style.transform = 'translateY(0)';
        }

        lastScroll = currentScroll;
    });
}

// ============================================
// تهيئة جميع التأثيرات
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initializing Advanced Parallax Effects...');

    initScrollProgress();
    initSmoothScroll();
    initScrollEffects();

    // تأخير بسيط للتأكد من تحميل جميع العناصر
    setTimeout(() => {
        initAdvancedParallax();
        initHeroParallax();
        initStickyNavbar();
        console.log('✨ Parallax Effects Loaded Successfully!');
    }, 500);
});

// تحديث عند تغيير حجم النافذة
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // إعادة حساب التأثيرات
        initAdvancedParallax();
    }, 200);
});

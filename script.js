// ===== GLOBAL VARIABLES =====
let currentTheme = localStorage.getItem('theme') || 'light';
let calculations = JSON.parse(localStorage.getItem('calculations')) || [];
let currentTab = 'rate';
let summaryBarChart = null;
let rateGradePie = null;
let rateBarChart = null;

// ===== DOM ELEMENTS =====
const loadingScreen = document.getElementById('loading-screen');
const themeToggle = document.getElementById('theme-toggle');
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
const closeMenu = document.getElementById('close-menu');
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const toastContainer = document.getElementById('toast-container');
const themeSwitcher = document.getElementById('theme-switcher');
const themes = ['theme-dark', 'theme-light', 'theme-colorful'];
let currentThemeIdx = 0;

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    // زر ابدأ الآن ينزل المستخدم إلى قسم الريت مع تعويض الترويسة
    const ctaBtn = document.querySelector('.cta-btn');
    if (ctaBtn) {
        ctaBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.getElementById('rate');
            if (target) {
                const navbar = document.querySelector('.navbar');
                const navHeight = navbar ? navbar.offsetHeight : 0;
                const extraOffset = 150; // مسافة إضافية ليظهر النموذج في منتصف الشاشة
                const targetPos = target.getBoundingClientRect().top + window.pageYOffset - navHeight - extraOffset;
                window.scrollTo({ top: targetPos, behavior: 'smooth' });
            }
        });
    }
});

function initializeApp() {
    // Show loading screen
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }, 2000);

    // Initialize theme
    setTheme(currentTheme);
    
    // Initialize particles
    initParticles();
    
    // Initialize charts
    initCharts();
    
    // Initialize event listeners
    initEventListeners();
    
    // Initialize forms
    initForms();
    
    // Update analytics
    updateAnalytics();
    
    // Show welcome toast
    showToast('مرحباً بك في حاسبة الريت الذكية! 🚀', 'info');
}

// ===== THEME MANAGEMENT =====
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    currentTheme = theme;
    localStorage.setItem('theme', theme);
    
    // Update theme toggle icon
        const icon = themeToggle.querySelector('i');
    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

function toggleTheme() {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    showToast(`تم تبديل المظهر إلى ${newTheme === 'dark' ? 'الوضع المظلم' : 'الوضع الفاتح'}`, 'success');
}

function applyTheme(idx) {
    document.body.classList.remove(...themes);
    document.body.classList.add(themes[idx]);
    localStorage.setItem('theme', themes[idx]);
}

if (themeSwitcher) {
    themeSwitcher.addEventListener('click', function() {
        currentThemeIdx = (currentThemeIdx + 1) % themes.length;
        applyTheme(currentThemeIdx);
    });
}

// عند تحميل الصفحة، طبّق آخر ثيم محفوظ
const savedTheme = localStorage.getItem('theme');
if (savedTheme && themes.includes(savedTheme)) {
    document.body.classList.add(savedTheme);
    currentThemeIdx = themes.indexOf(savedTheme);
} else {
    document.body.classList.add('theme-dark');
    currentThemeIdx = 0;
}

// ===== PARTICLES BACKGROUND =====
function initParticles() {
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: {
                    value: 80,
                    density: {
                        enable: true,
                        value_area: 800
                    }
                },
                color: {
                    value: '#ffffff'
                },
                shape: {
                    type: 'circle',
                    stroke: {
                        width: 0,
                        color: '#000000'
                    }
                },
                opacity: {
                    value: 0.5,
                    random: false,
                    anim: {
                        enable: false,
                        speed: 1,
                        opacity_min: 0.1,
                        sync: false
                    }
                },
                size: {
                    value: 3,
                    random: true,
                    anim: {
                        enable: false,
                        speed: 40,
                        size_min: 0.1,
                        sync: false
                    }
                },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: '#ffffff',
                    opacity: 0.4,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 6,
                    direction: 'none',
                    random: false,
                    straight: false,
                    out_mode: 'out',
                    bounce: false,
                    attract: {
                        enable: false,
                        rotateX: 600,
                        rotateY: 1200
                    }
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: {
                        enable: true,
                        mode: 'repulse'
                    },
                    onclick: {
                        enable: true,
                        mode: 'push'
                    },
                    resize: true
                },
                modes: {
                    grab: {
                        distance: 400,
                        line_linked: {
                            opacity: 1
                        }
                    },
                    bubble: {
                        distance: 400,
                        size: 40,
                        duration: 2,
                        opacity: 8,
                        speed: 3
                    },
                    repulse: {
                        distance: 200,
                        duration: 0.4
                    },
                    push: {
                        particles_nb: 4
                    },
                    remove: {
                        particles_nb: 2
                    }
                }
            },
            retina_detect: true
        });
    }
}

// ===== TAB SYSTEM =====
function initTabs() {
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.dataset.tab;
            switchTab(tabId);
        });
    });
}

function switchTab(tabId) {
    // Remove active class from all tabs and contents
    tabBtns.forEach(btn => btn.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));
    
    // Add active class to selected tab and content
    document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
    document.getElementById(tabId).classList.add('active');
    
    currentTab = tabId;
    
    // Update mobile menu if open
    if (mobileMenu.classList.contains('active')) {
        mobileMenu.classList.remove('active');
    }
}

// ===== MOBILE MENU =====
function initMobileMenu() {
    menuToggle.addEventListener('click', () => {
        mobileMenu.classList.add('active');
    });
    
    closeMenu.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mobileMenu.contains(e.target) && !menuToggle.contains(e.target)) {
            mobileMenu.classList.remove('active');
        }
    });
    
    // Menu item clicks
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const href = item.getAttribute('href');
            const tabId = href.substring(1);
            switchTab(tabId);
        });
    });
}

// ===== FORM INITIALIZATION =====
function initForms() {
    // Rate calculator form
    const rateForm = document.getElementById('rate-form');
    const rateNumInput = document.getElementById('rate-num');
    const rateCoursesContainer = document.getElementById('rate-courses');
    
    if (rateNumInput) {
        rateNumInput.addEventListener('change', () => {
            createCourseInputs(rateCoursesContainer, parseInt(rateNumInput.value), 'rate');
        });
    }
    
    if (rateForm) {
        rateForm.addEventListener('submit', handleRateCalculation);
    }
    
    // Science College calculator form
    const scienceCollegeForm = document.getElementById('science-college-form');
    if (scienceCollegeForm) {
        scienceCollegeForm.addEventListener('submit', handleScienceCollegeCalculation);
    }
    
    // Applied College calculator form
    const appliedCollegeForm = document.getElementById('applied-college-form');
    if (appliedCollegeForm) {
        appliedCollegeForm.addEventListener('submit', handleAppliedCollegeCalculation);
    }
    
    // Cumulative GPA form
    const cumulativeForm = document.getElementById('cumulative-form');
    const cumulativeNumInput = document.getElementById('cumulative-num');
    const cumulativeCoursesContainer = document.getElementById('cumulative-courses');
    
    if (cumulativeNumInput) {
        cumulativeNumInput.addEventListener('change', () => {
            createCourseInputs(cumulativeCoursesContainer, parseInt(cumulativeNumInput.value), 'cumulative');
        });
    }
    
    if (cumulativeForm) {
        cumulativeForm.addEventListener('submit', handleCumulativeCalculation);
    }
    
    // Semester GPA form
    const semesterForm = document.getElementById('semester-form');
    const semesterNumInput = document.getElementById('semester-num');
    const semesterCoursesContainer = document.getElementById('semester-courses');
    
    if (semesterNumInput) {
        semesterNumInput.addEventListener('change', () => {
            createCourseInputs(semesterCoursesContainer, parseInt(semesterNumInput.value), 'semester');
        });
    }
    
    if (semesterForm) {
        semesterForm.addEventListener('submit', handleSemesterCalculation);
    }
    
    // Initialize course inputs
    if (rateNumInput) createCourseInputs(rateCoursesContainer, parseInt(rateNumInput.value) || 2, 'rate');
    if (cumulativeNumInput) createCourseInputs(cumulativeCoursesContainer, parseInt(cumulativeNumInput.value) || 2, 'cumulative');
    if (semesterNumInput) createCourseInputs(semesterCoursesContainer, parseInt(semesterNumInput.value) || 2, 'semester');
}

// ===== COURSE INPUTS CREATION =====
function createCourseInputs(container, numCourses, type) {
    container.innerHTML = '';
    for (let i = 1; i <= numCourses; i++) {
        const courseItem = document.createElement('div');
        courseItem.className = 'course-item';
        courseItem.innerHTML = `
            <div class="course-header">
                <span class="course-name">المادة ${i}</span>
            </div>
            <div class="course-inputs">
                <div class="form-group">
                    <label>عدد الساعات</label>
                    <input type="number" id="${type}-course-${i}-hours" min="1" max="10" step="1" required>
                </div>
                <div class="form-group">
                    <label>اختر التقدير</label>
                    <select id="${type}-course-${i}-grade" required>
                        <option value="">-- اختر التقدير --</option>
                        <option value="A+">A+</option>
                        <option value="A">A</option>
                        <option value="B+">B+</option>
                        <option value="B">B</option>
                        <option value="C+">C+</option>
                        <option value="C">C</option>
                        <option value="D+">D+</option>
                        <option value="D">D</option>
                        <option value="F">F</option>
                    </select>
                </div>
            </div>
        `;
        container.appendChild(courseItem);
    }
}

// تعريف المواد والأوزان حسب التخصص
const majorCourses = {
    CE: [
        { name: "التصميم المنطقي (1111)", weight: 0.75 },
        { name: "الرياضيات المتقطعة (1112)", weight: 0.25 }
    ],
    CS: [
        { name: "الرياضيات المتقطعة (1112)", weight: 0.25 },
        { name: "برمجة الحاسب 1 (1301)", weight: 0.75 }
    ],
    IS: [
        { name: "برمجة الحاسب 1 (1301)", weight: 0.75 },
        { name: "التصميم المنطقي (1111)", weight: 0.25 }
    ],
    SE: [
        { name: "التصميم المنطقي (1111)", weight: 0.5 },
        { name: "برمجة الحاسب 1 (1301)", weight: 0.5 }
    ]
};

const gradeValues = {
    "A+": 5,
    "A": 4.75,
    "B+": 4.5,
    "B": 4,
    "C+": 3.5,
    "C": 3,
    "D+": 2.5,
    "D": 2,
    "F": 1
};

// عند تغيير التخصص، أظهر المواد المطلوبة
const majorSelect = document.getElementById('major');
const rateCoursesDiv = document.getElementById('rate-courses');
if (majorSelect && rateCoursesDiv) {
    majorSelect.addEventListener('change', function() {
        const major = majorSelect.value;
        rateCoursesDiv.innerHTML = '';
        if (major && majorCourses[major]) {
            majorCourses[major].forEach((course, idx) => {
                const courseDiv = document.createElement('div');
                courseDiv.className = 'form-group';
                courseDiv.innerHTML = `
                    <label for="rate-course-${idx}">${course.name}</label>
                    <select id="rate-course-${idx}" required>
                            <option value="">-- اختر التقدير --</option>
                        <option value="A+">A+</option>
                        <option value="A">A</option>
                        <option value="B+">B+</option>
                        <option value="B">B</option>
                        <option value="C+">C+</option>
                        <option value="C">C</option>
                        <option value="D+">D+</option>
                        <option value="D">D</option>
                        <option value="F">F</option>
                        </select>
                `;
                rateCoursesDiv.appendChild(courseDiv);
            });
        }
    });
}

// عدل دالة حساب الريت لتستخدم القيم المختارة
function handleRateCalculation(e) {
    e.preventDefault();
    const major = document.getElementById('major').value;
    const gpa = parseFloat(document.getElementById('rate-gpa').value);
    const sa = parseFloat(document.getElementById('rate-sa').value);
    if (!major || isNaN(gpa) || isNaN(sa)) {
        showToast('يرجى ملء جميع الحقول المطلوبة', 'error');
        return;
    }
    // جلب تقديرات المواد
    const courses = majorCourses[major];
    const g1 = gradeValues[document.getElementById('rate-course-0').value];
    const w1 = courses[0].weight;
    const g2 = gradeValues[document.getElementById('rate-course-1').value];
    const w2 = courses[1].weight;
    if (g1 === undefined || g2 === undefined) {
        showToast('يرجى اختيار تقدير لكل مادة', 'error');
        return;
    }
    // حساب الريت
    const result = calculateRate(major, gpa, sa, g1, w1, g2, w2);
    displayRateResult(result);
    saveCalculation({
        type: 'rate',
        major,
        gpa,
        sa,
        g1,
        w1,
        g2,
        w2,
        result,
        timestamp: new Date().toISOString()
    });
    showToast('تم حساب الريت بنجاح! 🎉', 'success');
    updateAnalytics();
}

function handleCumulativeCalculation(e) {
    e.preventDefault();
    const prevHours = parseFloat(document.getElementById('prev-hours').value);
    const prevGpa = parseFloat(document.getElementById('prev-gpa').value);
    if (isNaN(prevHours) || isNaN(prevGpa)) {
        showToast('يرجى ملء جميع الحقول المطلوبة', 'error');
        return;
    }
    const courseInputs = document.querySelectorAll('#cumulative-courses .course-item');
    const courses = [];
    courseInputs.forEach((course, index) => {
        const hours = parseFloat(course.querySelector(`#cumulative-course-${index + 1}-hours`).value);
        const grade = gradeValues[course.querySelector(`#cumulative-course-${index + 1}-grade`).value];
        if (!isNaN(hours) && grade !== undefined) {
            courses.push({ hours, grade });
        }
    });
    if (courses.length === 0) {
        showToast('يرجى إدخال بيانات المواد', 'error');
        return;
    }
    const result = calculateCumulativeGPA(prevHours, prevGpa, courses);
    displayCumulativeResult(result);
    saveCalculation({
        type: 'cumulative',
        prevHours,
        prevGpa,
        courses,
        result,
        timestamp: new Date().toISOString()
    });
    showToast('تم حساب المعدل التراكمي بنجاح! 📊', 'success');
    updateAnalytics();
}

function handleSemesterCalculation(e) {
    e.preventDefault();
    const courseInputs = document.querySelectorAll('#semester-courses .course-item');
    const courses = [];
    courseInputs.forEach((course, index) => {
        const hours = parseFloat(course.querySelector(`#semester-course-${index + 1}-hours`).value);
        const grade = gradeValues[course.querySelector(`#semester-course-${index + 1}-grade`).value];
        if (!isNaN(hours) && grade !== undefined) {
            courses.push({ hours, grade });
        }
    });
    if (courses.length === 0) {
        showToast('يرجى إدخال بيانات المواد', 'error');
        return;
    }
    const result = calculateSemesterGPA(courses);
    displaySemesterResult(result);
    saveCalculation({
        type: 'semester',
        courses,
        result,
        timestamp: new Date().toISOString()
    });
    showToast('تم حساب المعدل الفصلي بنجاح! 🎓', 'success');
    updateAnalytics();
}

function handleScienceCollegeCalculation(e) {
    e.preventDefault();
    const gpa = parseFloat(document.getElementById('sc-gpa').value);
    const weighted = parseFloat(document.getElementById('sc-weighted').value);
    const physics = gradeValues[document.getElementById('sc-physics').value];
    const differential = gradeValues[document.getElementById('sc-differential').value];
    const integral = gradeValues[document.getElementById('sc-integral').value];
    if (isNaN(gpa) || isNaN(weighted) || physics === undefined || differential === undefined || integral === undefined) {
        showToast('يرجى ملء جميع الحقول المطلوبة', 'error');
        return;
    }
    // حساب معدل كلية العلوم
    const result = calculateScienceCollegeRate(gpa, weighted, physics, differential, integral);
    displayScienceCollegeResult(result);
    saveCalculation({
        type: 'science-college',
        gpa,
        weighted,
        physics,
        differential,
        integral,
        result,
        timestamp: new Date().toISOString()
    });
    showToast('تم حساب معدل تخصيص كلية العلوم بنجاح! 🧪', 'success');
    updateAnalytics();
}

function handleAppliedCollegeCalculation(e) {
    e.preventDefault();
    const gpa = parseFloat(document.getElementById('ac-gpa').value);
    const composite = parseFloat(document.getElementById('ac-composite').value);
    const organicChemistry = gradeValues[document.getElementById('ac-organic-chemistry').value];
    const biology = gradeValues[document.getElementById('ac-biology').value];
    if (isNaN(gpa) || isNaN(composite) || organicChemistry === undefined || biology === undefined) {
        showToast('يرجى ملء جميع الحقول المطلوبة', 'error');
        return;
    }
    // حساب معدل الكلية التطبيقية
    const result = calculateAppliedCollegeRate(gpa, composite, organicChemistry, biology);
    displayAppliedCollegeResult(result);
    saveCalculation({
        type: 'applied-college',
        gpa,
        composite,
        organicChemistry,
        biology,
        result,
        timestamp: new Date().toISOString()
    });
    showToast('تم حساب معدل تخصيص الكلية التطبيقية بنجاح! 🔬', 'success');
    updateAnalytics();
}

// ===== CALCULATION FUNCTIONS =====
function calculateRate(major, gpa, sa, g1, w1, g2, w2) {
    // حساب الريت حسب المعادلة الجديدة
    // RATE = (GPA + SA + (W1*G1) + (W2*G2)) / 3
    const rate = (gpa + sa + (w1 * g1) + (w2 * g2)) / 3;
    return {
        rate: rate.toFixed(3),
        gpa,
        sa,
        g1,
        w1,
        g2,
        w2,
        breakdown: {
            gpa: gpa.toFixed(3),
            sa: sa.toFixed(3),
            g1: g1.toFixed(3),
            w1: w1.toFixed(2),
            g2: g2.toFixed(3),
            w2: w2.toFixed(2),
            g1w1: (g1*w1).toFixed(3),
            g2w2: (g2*w2).toFixed(3)
        }
    };
}

function calculateCumulativeGPA(prevHours, prevGpa, courses) {
    const prevPoints = prevHours * prevGpa;
    const newHours = courses.reduce((sum, course) => sum + course.hours, 0);
    const newPoints = courses.reduce((sum, course) => sum + (course.grade * course.hours), 0);
    
    const totalHours = prevHours + newHours;
    const totalPoints = prevPoints + newPoints;
    const cumulativeGpa = totalPoints / totalHours;
    
    return {
        cumulativeGpa: cumulativeGpa.toFixed(3),
        prevGpa,
        newGpa: (newPoints / newHours).toFixed(3),
        totalHours,
        newHours,
        courses
    };
}

function calculateSemesterGPA(courses) {
    const totalHours = courses.reduce((sum, course) => sum + course.hours, 0);
    const totalPoints = courses.reduce((sum, course) => sum + (course.grade * course.hours), 0);
    const semesterGpa = totalPoints / totalHours;
    
    return {
        semesterGpa: semesterGpa.toFixed(3),
        totalHours,
        courses,
        gradeDistribution: getGradeDistribution(courses)
    };
}

function calculateScienceCollegeRate(gpa, weighted, physics, differential, integral) {
    const weighted5 = weighted / 20;
    const finalRate = (gpa * 0.5) + (weighted5 * 0.3) + (physics * 0.1) + (differential * 0.05) + (integral * 0.05);
    return {
        finalRate: finalRate.toFixed(2),
        gpa: gpa,
        weighted: weighted,
        physics: physics,
        differential: differential,
        integral: integral,
        breakdown: {
            gpaContribution: (gpa * 0.5).toFixed(3),
            weightedContribution: (weighted5 * 0.3).toFixed(3),
            physicsContribution: (physics * 0.1).toFixed(3),
            differentialContribution: (differential * 0.05).toFixed(3),
            integralContribution: (integral * 0.05).toFixed(3)
        }
    };
}

function calculateAppliedCollegeRate(gpa, composite, organicChemistry, biology) {
    const composite5 = composite / 20;
    const finalRate = (gpa * 0.5) + (composite5 * 0.3) + (organicChemistry * 0.1) + (biology * 0.1);
    return {
        finalRate: finalRate.toFixed(2),
        gpa: gpa,
        composite: composite,
        organicChemistry: organicChemistry,
        biology: biology,
        breakdown: {
            gpaContribution: (gpa * 0.5).toFixed(3),
            compositeContribution: (composite5 * 0.3).toFixed(3),
            organicChemistryContribution: (organicChemistry * 0.1).toFixed(3),
            biologyContribution: (biology * 0.1).toFixed(3)
        }
    };
}

function getGradeDistribution(courses) {
    const distribution = {
        'A+': 0, 'A': 0, 'B+': 0, 'B': 0, 'C+': 0, 'C': 0, 'D+': 0, 'D': 0, 'F': 0
    };
    
    courses.forEach(course => {
        const grade = getLetterGrade(course.grade);
        distribution[grade]++;
    });
    
    return distribution;
}

function getLetterGrade(numericGrade) {
    if (numericGrade >= 4.5) return 'A+';
    if (numericGrade >= 4.0) return 'A';
    if (numericGrade >= 3.5) return 'B+';
    if (numericGrade >= 3.0) return 'B';
    if (numericGrade >= 2.5) return 'C+';
    if (numericGrade >= 2.0) return 'C';
    if (numericGrade >= 1.5) return 'D+';
    if (numericGrade >= 1.0) return 'D';
    return 'F';
}

// ===== RESULT DISPLAY =====
function displayRateResult(result) {
    const resultContainer = document.getElementById('rate-result');
    resultContainer.innerHTML = `
        <div class="result-header">
            <div class="result-icon success">
                <i class="fas fa-star"></i>
            </div>
            <div class="result-content">
                <h4>نتيجة حساب الريت</h4>
            </div>
        </div>
        <div class="result-value">${result.rate}</div>
    `;
    resultContainer.classList.add('show');
}

function displayCumulativeResult(result) {
    const resultContainer = document.getElementById('cumulative-result');
    resultContainer.innerHTML = `
        <div class="result-header">
            <div class="result-icon success">
                <i class="fas fa-chart-line"></i>
            </div>
            <div class="result-content">
                <h4>نتيجة المعدل التراكمي</h4>
                <p>المعدل الجديد بعد إضافة المواد</p>
            </div>
        </div>
        <div class="result-value">${result.cumulativeGpa}</div>
        <div class="result-details">
            <div class="detail-item">
                <div class="detail-label">المعدل السابق</div>
                <div class="detail-value">${result.prevGpa}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">معدل المواد الجديدة</div>
                <div class="detail-value">${result.newGpa}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">إجمالي الساعات</div>
                <div class="detail-value">${result.totalHours}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">ساعات المواد الجديدة</div>
                <div class="detail-value">${result.newHours}</div>
            </div>
        </div>
    `;
    resultContainer.classList.add('show');
}

function displaySemesterResult(result) {
    const resultContainer = document.getElementById('semester-result');
    resultContainer.innerHTML = `
        <div class="result-header">
            <div class="result-icon success">
                <i class="fas fa-graduation-cap"></i>
            </div>
            <div class="result-content">
                <h4>نتيجة المعدل الفصلي</h4>
                <p>معدل الفصل الحالي</p>
            </div>
        </div>
        <div class="result-value">${result.semesterGpa}</div>
        <div class="result-details">
            <div class="detail-item">
                <div class="detail-label">إجمالي الساعات</div>
                <div class="detail-value">${result.totalHours}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">عدد المواد</div>
                <div class="detail-value">${result.courses.length}</div>
            </div>
            </div>
        `;
    resultContainer.classList.add('show');
}
    
function displayScienceCollegeResult(result) {
    const resultContainer = document.getElementById('science-college-result');
    resultContainer.innerHTML = `
        <div class="result-header">
            <div class="result-icon success">
                <i class="fas fa-flask"></i>
            </div>
            <div class="result-content">
                <h4>نتيجة معدل تخصيص كلية العلوم</h4>
                <p>المعدل النهائي للتخصيص</p>
            </div>
        </div>
        <div class="result-value">${result.finalRate}</div>
        <div class="result-details">
            <div class="detail-item">
                <div class="detail-label">المعدل التراكمي (50%)</div>
                <div class="detail-value">${result.breakdown.gpaContribution}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">الموزونة (30%)</div>
                <div class="detail-value">${result.breakdown.weightedContribution}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">الفيزياء (10%)</div>
                <div class="detail-value">${result.breakdown.physicsContribution}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">التفاضل (5%)</div>
                <div class="detail-value">${result.breakdown.differentialContribution}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">التكامل (5%)</div>
                <div class="detail-value">${result.breakdown.integralContribution}</div>
            </div>
        </div>
    `;
    resultContainer.classList.add('show');
}

function displayAppliedCollegeResult(result) {
    const resultContainer = document.getElementById('applied-college-result');
    resultContainer.innerHTML = `
        <div class="result-header">
            <div class="result-icon success">
                <i class="fas fa-microscope"></i>
            </div>
            <div class="result-content">
                <h4>نتيجة معدل تخصيص الكلية التطبيقية</h4>
                <p>المعدل النهائي للتخصيص</p>
            </div>
        </div>
        <div class="result-value">${result.finalRate}</div>
        <div class="result-details">
            <div class="detail-item">
                <div class="detail-label">المعدل التراكمي (50%)</div>
                <div class="detail-value">${result.breakdown.gpaContribution}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">نسبة الطالب المركبة (30%)</div>
                <div class="detail-value">${result.breakdown.compositeContribution}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">الكيمياء العضوية 106كيم (10%)</div>
                <div class="detail-value">${result.breakdown.organicChemistryContribution}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">علم الاحياء العام 106 حيا (10%)</div>
                <div class="detail-value">${result.breakdown.biologyContribution}</div>
            </div>
        </div>
    `;
    resultContainer.classList.add('show');
}

// ===== UTILITY FUNCTIONS =====
function getMajorName(majorCode) {
    const majors = {
        'SE': 'هندسة البرمجيات',
        'CS': 'علوم الحاسوب',
        'IS': 'نظم المعلومات',
        'CE': 'هندسة الحاسوب'
    };
    return majors[majorCode] || majorCode;
}

function saveCalculation(calculation) {
    calculations.unshift(calculation);
    if (calculations.length > 50) {
        calculations = calculations.slice(0, 50);
    }
    localStorage.setItem('calculations', JSON.stringify(calculations));
    updateAnalytics();
}

// ===== ANALYTICS =====
function initCharts() {
    // Initialize charts when analytics tab is shown
    const analyticsTab = document.querySelector('[data-tab="analytics"]');
    if (analyticsTab) {
        analyticsTab.addEventListener('click', () => {
            setTimeout(() => {
                createCharts();
            }, 300);
        });
    }
}

function createCharts() {
    // Grades distribution chart
    const gradesCtx = document.getElementById('grades-chart');
    if (gradesCtx) {
        new Chart(gradesCtx, {
            type: 'doughnut',
            data: {
                labels: ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D+', 'D', 'F'],
                datasets: [{
                    data: [12, 19, 8, 15, 6, 4, 2, 1, 0],
                    backgroundColor: [
                        '#10b981', '#059669', '#3b82f6', '#1d4ed8',
                        '#f59e0b', '#d97706', '#ef4444', '#dc2626', '#7f1d1d'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--text-primary')
                        }
                    }
                }
        }
    });
}

    // Majors comparison chart
    const majorsCtx = document.getElementById('majors-chart');
    if (majorsCtx) {
        new Chart(majorsCtx, {
            type: 'bar',
            data: {
                labels: ['هندسة البرمجيات', 'علوم الحاسوب', 'نظم المعلومات', 'هندسة الحاسوب'],
                datasets: [{
                    label: 'متوسط الريت',
                    data: [4.2, 4.1, 3.9, 4.0],
                    backgroundColor: '#6366f1',
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 5,
                        ticks: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--text-primary')
                        }
                    },
                    x: {
                        ticks: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--text-primary')
                        }
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--text-primary')
                        }
                    }
                }
            }
        });
    }
}

function updateAnalytics() {
    // جلب الحسابات من localStorage أو المتغير
    const calculations = JSON.parse(localStorage.getItem('calculations')) || [];
    let rateSum = 0, gpaSum = 0, rateCount = 0, gpaCount = 0;
    calculations.forEach(calc => {
        if (calc.type === 'rate' && calc.result && calc.result.rate) {
            rateSum += parseFloat(calc.result.rate);
            rateCount++;
        }
        if ((calc.type === 'cumulative' || calc.type === 'semester') && calc.result && (calc.result.cumulativeGpa || calc.result.semesterGpa)) {
            gpaSum += parseFloat(calc.result.cumulativeGpa || calc.result.semesterGpa);
            gpaCount++;
        }
    });
    const avgRate = rateCount ? (rateSum / rateCount).toFixed(2) : '-';
    const avgGpa = gpaCount ? (gpaSum / gpaCount).toFixed(2) : '-';
    const avgSemester = gpaCount ? (gpaSum / gpaCount).toFixed(2) : '-';
    document.getElementById('avg-rate').innerText = avgRate;
    document.getElementById('avg-semester').innerText = avgSemester;
    document.getElementById('avg-gpa').innerText = avgGpa;
    document.getElementById('total-calculations').innerText = calculations.length;
}

// ===== TOAST NOTIFICATIONS =====
function showToast(message, type = 'info', duration = 5000) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = getToastIcon(type);
    
    toast.innerHTML = `
        <div class="toast-icon">
            <i class="${icon}"></i>
        </div>
        <div class="toast-content">
            <h5>${getToastTitle(type)}</h5>
            <p>${message}</p>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    // Auto remove
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, duration);
}

function getToastIcon(type) {
    const icons = {
        success: 'fas fa-check',
        error: 'fas fa-times',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info'
    };
    return icons[type] || icons.info;
}

function getToastTitle(type) {
    const titles = {
        success: 'نجح!',
        error: 'خطأ!',
        warning: 'تحذير!',
        info: 'معلومات'
    };
    return titles[type] || titles.info;
}

// ===== EVENT LISTENERS =====
function initEventListeners() {
    // Theme toggle
    themeToggle.addEventListener('click', toggleTheme);
    
    // Mobile menu
    initMobileMenu();
    
    // Tabs
    initTabs();
    
    // Smooth scrolling for anchor links
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

// ===== ABSENCE LIMIT CALCULATOR =====
function initAbsenceLimitCalculator() {
    // Get all input fields that affect absence calculation
    const inputs = [
        'course-academic-hours',
        'course-weeks', 
        'lectures-count',
        'exercises-count',
        'labs-count',
        'lecture-hours',
        'exercise-hours',
        'lab-hours'
    ];
    
    // Add event listeners to all relevant inputs
    inputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) {
            input.addEventListener('input', updateAbsenceLimit);
            input.addEventListener('change', updateAbsenceLimit);
            input.addEventListener('keyup', updateAbsenceLimit);
            input.addEventListener('paste', () => setTimeout(updateAbsenceLimit, 100));
        }
    });
    
    // Listen to ALL input fields in the form
    document.addEventListener('input', function(e) {
        // Check if it's any input field that could affect absence calculation
        if (e.target.type === 'number' || 
            e.target.type === 'text' ||
            e.target.id.includes('course') || 
            e.target.id.includes('lectures') || 
            e.target.id.includes('exercises') || 
            e.target.id.includes('labs') ||
            e.target.id.includes('lecture') ||
            e.target.id.includes('exercise') ||
            e.target.id.includes('lab') ||
            e.target.id.includes('absence') ||
            e.target.id.includes('hours') ||
            e.target.id.includes('weeks') ||
            e.target.id.includes('count')) {
            console.log('Input detected:', e.target.id, e.target.value); // Debug log
            updateAbsenceLimit();
        }
    });
    
    // Also listen to any select or dropdown changes
    document.addEventListener('change', function(e) {
        if (e.target.type === 'number' || 
            e.target.type === 'text' ||
            e.target.id.includes('course') || 
            e.target.id.includes('lectures') || 
            e.target.id.includes('exercises') || 
            e.target.id.includes('labs') ||
            e.target.id.includes('lecture') ||
            e.target.id.includes('exercise') ||
            e.target.id.includes('lab')) {
            updateAbsenceLimit();
        }
    });
    
    // Listen to dynamic fields that might be added later
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) { // Element node
                        const inputs = node.querySelectorAll ? node.querySelectorAll('input, select') : [];
                        inputs.forEach(input => {
                            if (input.type === 'number' || 
                                input.type === 'text' ||
                                input.id.includes('course') || 
                                input.id.includes('lectures') || 
                                input.id.includes('exercises') || 
                                input.id.includes('labs') ||
                                input.id.includes('lecture') ||
                                input.id.includes('exercise') ||
                                input.id.includes('lab')) {
                                input.addEventListener('input', updateAbsenceLimit);
                                input.addEventListener('change', updateAbsenceLimit);
                                input.addEventListener('keyup', updateAbsenceLimit);
                            }
                        });
                    }
                });
            }
        });
    });
    
    // Start observing
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    // Initial calculation
    updateAbsenceLimit();
    
    // Force update every second to ensure it stays updated
    setInterval(updateAbsenceLimit, 1000);
    
    // Debug: Log all input fields found
    setTimeout(() => {
        const allInputs = document.querySelectorAll('input');
        console.log('All input fields found:', allInputs.length);
        allInputs.forEach(input => {
            console.log('Input:', input.id, input.type, input.value);
        });
        
        // Test specific fields
        const testFields = ['lecture-hours', 'exercise-hours', 'lab-hours', 'lectures-count', 'exercises-count', 'labs-count'];
        testFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                console.log(`Field ${fieldId} found:`, field.value);
            } else {
                console.log(`Field ${fieldId} NOT found`);
            }
        });
    }, 2000);
}

function updateAbsenceLimit() {
    try {
        console.log('updateAbsenceLimit called'); // Debug log
        
        // Get form values - check both main form and customization fields
        const academicHours = parseInt(document.getElementById('course-academic-hours').value) || 0;
        const weeks = parseInt(document.getElementById('course-weeks').value) || 0;
        
        // Get lectures count from main form
        const lecturesCount = parseInt(document.getElementById('lectures-count').value) || 0;
        const exercisesCount = parseInt(document.getElementById('exercises-count').value) || 0;
        const labsCount = parseInt(document.getElementById('labs-count').value) || 0;
        
        // Get hours from customization fields
        const lectureHours = parseInt(document.getElementById('lecture-hours').value) || 0;
        const exerciseHours = parseInt(document.getElementById('exercise-hours').value) || 0;
        const labHours = parseInt(document.getElementById('lab-hours').value) || 0;
        
        console.log('Main form values:', { academicHours, weeks, lecturesCount, exercisesCount, labsCount }); // Debug log
        console.log('Customization values:', { lectureHours, exerciseHours, labHours }); // Debug log
        
        // Calculate total weekly hours
        // Use customization values if available, otherwise use default calculations
        let lecturesHours = 0;
        let exercisesHours = 0;
        let labsHours = 0;
        
        // For lectures: use customization hours if available, otherwise calculate from count
        if (lectureHours > 0) {
            lecturesHours = lectureHours * lecturesCount; // hours per lecture * number of lectures
        } else if (lecturesCount > 0) {
            lecturesHours = lecturesCount * 1.5; // default 1.5 hours per lecture
        }
        
        // For exercises: use customization hours if available, otherwise calculate from count
        if (exerciseHours > 0) {
            exercisesHours = exerciseHours * exercisesCount; // hours per exercise * number of exercises
        } else if (exercisesCount > 0) {
            exercisesHours = exercisesCount * 1; // default 1 hour per exercise
        }
        
        // For labs: use customization hours if available, otherwise calculate from count
        if (labHours > 0) {
            labsHours = labHours * labsCount; // hours per lab * number of labs
        } else if (labsCount > 0) {
            labsHours = labsCount * 2; // default 2 hours per lab
        }
        
        const totalWeeklyHours = lecturesHours + exercisesHours + labsHours;
        
        console.log('Calculated hours:', { lecturesHours, exercisesHours, labsHours, totalWeeklyHours }); // Debug log
        
        
    } catch (error) {
        console.error('Error updating absence limit:', error);
    }
}

// Function to get detailed absence breakdown
function getAbsenceBreakdown() {
    const academicHours = parseInt(document.getElementById('course-academic-hours').value) || 0;
    const weeks = parseInt(document.getElementById('course-weeks').value) || 0;
    const lecturesCount = parseInt(document.getElementById('lectures-count').value) || 0;
    const exercisesCount = parseInt(document.getElementById('exercises-count').value) || 0;
    const labsCount = parseInt(document.getElementById('labs-count').value) || 0;
    
    const lecturesHours = lecturesCount * 1.5;
    const exercisesHours = exercisesCount * 1;
    const labsHours = labsCount * 2;
    const totalWeeklyHours = lecturesHours + exercisesHours + labsHours;
    const totalSemesterHours = totalWeeklyHours * weeks;
    const maxAbsenceHours = Math.floor(totalSemesterHours * 0.25);
    
    return {
        lecturesHours,
        exercisesHours,
        labsHours,
        totalWeeklyHours,
        totalSemesterHours,
        maxAbsenceHours,
        breakdown: {
            lectures: {
                weekly: lecturesHours,
                semester: lecturesHours * weeks,
                maxAbsence: Math.floor(lecturesHours * weeks * 0.25)
            },
            exercises: {
                weekly: exercisesHours,
                semester: exercisesHours * weeks,
                maxAbsence: Math.floor(exercisesHours * weeks * 0.25)
            },
            labs: {
                weekly: labsHours,
                semester: labsHours * weeks,
                maxAbsence: Math.floor(labsHours * weeks * 0.25)
            }
        }
    };
}
    
    // Add floating animation to cards
    const floatingCards = document.querySelectorAll('.floating-card-3d');
    floatingCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 2}s`;
    });
    
    // Add hover effects to feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// ===== PERFORMANCE OPTIMIZATIONS =====
// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// ===== ACCESSIBILITY =====
// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        mobileMenu.classList.remove('active');
    }
});

// Focus management
document.addEventListener('focusin', (e) => {
    if (e.target.matches('input, select, button, a')) {
        e.target.style.outline = '2px solid var(--primary)';
        e.target.style.outlineOffset = '2px';
    }
});

document.addEventListener('focusout', (e) => {
    if (e.target.matches('input, select, button, a')) {
        e.target.style.outline = '';
        e.target.style.outlineOffset = '';
    }
});

// ===== SERVICE WORKER (PWA SUPPORT) =====
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
        for(let registration of registrations) {
            registration.unregister();
        }
    });
}
if ('caches' in window) {
    caches.keys().then(function(names) {
        for (let name of names) caches.delete(name);
    });
}

// ===== EXPORT FUNCTIONS FOR GLOBAL ACCESS =====
window.RateCalculator = {
    calculateRate,
    calculateCumulativeGPA,
    calculateSemesterGPA,
    showToast,
    setTheme,
    switchTab
};

function initAnalyticsCharts() {
    // جلب الحسابات
    const calculations = JSON.parse(localStorage.getItem('calculations')) || [];
    let rateSum = 0, rateCount = 0, gpaSum = 0, gpaCount = 0, semesterSum = 0, semesterCount = 0;
    calculations.forEach(calc => {
        if (calc.type === 'rate' && calc.result && calc.result.rate) {
            rateSum += parseFloat(calc.result.rate);
            rateCount++;
        }
        if (calc.type === 'cumulative' && calc.result && calc.result.cumulativeGpa) {
            gpaSum += parseFloat(calc.result.cumulativeGpa);
            gpaCount++;
        }
        if (calc.type === 'semester' && calc.result && calc.result.semesterGpa) {
            semesterSum += parseFloat(calc.result.semesterGpa);
            semesterCount++;
        }
    });
    const avgRate = rateCount ? (rateSum / rateCount).toFixed(2) : 0;
    const avgGpa = gpaCount ? (gpaSum / gpaCount).toFixed(2) : 0;
    const avgSemester = semesterCount ? (semesterSum / semesterCount).toFixed(2) : 0;
    // رسم عمودي (Bar) فقط
    if (rateBarChart) rateBarChart.destroy();
    const barCtx = document.getElementById('rate-bar-chart').getContext('2d');
    rateBarChart = new Chart(barCtx, {
        type: 'bar',
        data: {
            labels: ['الريت', 'المعدل الفصلي', 'المعدل التراكمي'],
            datasets: [{
                label: '',
                data: [avgRate, avgSemester, avgGpa],
                backgroundColor: [
                    '#1976d2', // أزرق
                    '#7c4dff', // بنفسجي
                    '#ffb300'  // برتقالي
                ],
                borderRadius: 10,
                barPercentage: 0.45,
                categoryPercentage: 0.6,
                borderSkipped: false,
                // ظل خفيف للأعمدة (عن طريق borderColor و borderWidth)
                borderColor: 'rgba(30,30,60,0.18)',
                borderWidth: 3
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false },
                datalabels: {
                    anchor: 'end',
                    align: 'end',
                    color: '#fff',
                    font: { weight: 'bold', size: 18 },
                    textStrokeColor: '#222a3a',
                    textStrokeWidth: 3,
                    shadowBlur: 6,
                    shadowColor: '#222a3a',
                    formatter: function(value) {
                        return value;
                    }
                }
            },
            animation: { duration: 900 },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 5,
                    stepSize: 1,
                    grid: { color: 'rgba(34,42,58,0.18)' },
                    ticks: { color: '#bfc9da', font: { size: 15 } }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#bfc9da', font: { size: 16, weight: 'bold' } }
                }
            },
            layout: {
                padding: { top: 20 }
            }
        },
        plugins: window.ChartDataLabels ? [ChartDataLabels] : []
    });
    // تحديث المتوسطات
    document.getElementById('avg-rate').innerText = avgRate;
    document.getElementById('avg-semester').innerText = avgSemester;
    document.getElementById('avg-gpa').innerText = avgGpa;
}

// استدعاء الرسم عند فتح تبويب التحليلات فقط
const analyticsTabBtn = document.querySelector('[data-tab="analytics"]');
if (analyticsTabBtn) {
    analyticsTabBtn.addEventListener('click', () => {
        setTimeout(initAnalyticsCharts, 200);
    });
}

// دالة تصدير/طباعة النتيجة
function exportResult(btn) {
    // ابحث عن أقرب result-container
    const resultContainer = btn.closest('.result-container');
    if (!resultContainer) return;

    // أنشئ قائمة خيارات منبثقة
    let menu = document.createElement('div');
    menu.className = 'export-menu';
    menu.innerHTML = `
        <button onclick="downloadResultImage(this)"><i class='fas fa-image'></i> تحميل كصورة</button>
        <button onclick="printResult(this)"><i class='fas fa-print'></i> طباعة</button>
    `;
    // احذف أي قائمة سابقة
    document.querySelectorAll('.export-menu').forEach(e => e.remove());
    // أضف القائمة بعد الزر
    btn.parentNode.appendChild(menu);
    // أغلق القائمة عند الضغط خارجها
    setTimeout(() => {
        document.addEventListener('click', function handler(e) {
            if (!menu.contains(e.target) && e.target !== btn) {
                menu.remove();
                document.removeEventListener('click', handler);
            }
        });
    }, 100);
}

// تحميل النتيجة كصورة PNG
function downloadResultImage(btn) {
    const resultContainer = btn.closest('.result-container');
    if (!window.html2canvas) {
        alert('مطلوب مكتبة html2canvas لتحميل الصورة.');
        return;
    }
    html2canvas(resultContainer, {backgroundColor: null}).then(canvas => {
        const link = document.createElement('a');
        link.download = 'university-gpa-result.png';
        link.href = canvas.toDataURL();
        link.click();
    });
    btn.parentNode.remove();
}

// طباعة النتيجة
function printResult(btn) {
    const resultContainer = btn.closest('.result-container');
    const printWindow = window.open('', '', 'width=600,height=600');
    printWindow.document.write('<html><head><title>طباعة النتيجة</title>');
    printWindow.document.write('<link rel="stylesheet" href="styles.css">');
    printWindow.document.write('</head><body >');
    printWindow.document.write(resultContainer.outerHTML);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    setTimeout(() => { printWindow.print(); printWindow.close(); }, 500);
    btn.parentNode.remove();
}

// ===== ABSENCE CALCULATOR =====
let absenceCourses = [];

// Initialize absence calculator
function initAbsenceCalculator() {
    console.log('Initializing absence calculator...');
    
    // Load saved courses from localStorage
    loadSavedCourses();
    
    // Load and display courses
    loadCourses();
    
    // Load absence control
    loadAbsenceControl();
    
    // Update completion section - REMOVED
    // updateCompletionSection();
    
    console.log('Absence calculator initialized successfully');
    console.log('Final absenceCourses:', absenceCourses);
}

// Load saved courses from localStorage
function loadSavedCourses() {
    try {
        const savedCourses = localStorage.getItem('absenceCourses');
        console.log('Saved courses from localStorage:', savedCourses);
        
        if (savedCourses) {
            absenceCourses = JSON.parse(savedCourses);
            console.log('Parsed courses:', absenceCourses);
            console.log('Number of courses loaded:', absenceCourses.length);
        } else {
            absenceCourses = [];
            console.log('No saved courses found, initializing empty array');
        }
    } catch (error) {
        console.error('خطأ في تحميل المواد المحفوظة:', error);
        absenceCourses = [];
    }
}

// Clear all saved courses (for debugging)
function clearAllCourses() {
    absenceCourses = [];
    localStorage.removeItem('absenceCourses');
    loadCourses();
}


// Add course directly - SIMPLE VERSION
function addCourseDirectly() {
    try {
        // Get ONLY basic form values
        const courseNameRaw = document.getElementById('course-name').value;
        const courseName = courseNameRaw ? courseNameRaw.trim() : '';
        const academicHours = parseInt(document.getElementById('course-academic-hours').value);
        const weeks = parseInt(document.getElementById('course-weeks').value);
        const lecturesCount = parseInt(document.getElementById('lectures-count').value);
        
        // NO VALIDATION - Skip all checks
        
        // Create SIMPLE course object with defaults
        const newCourse = {
            id: Date.now().toString(),
            name: courseName,
            academicHours: academicHours,
            weeks: weeks,
            lectures: {
                count: lecturesCount,
                hoursPerSession: 1.5,
                totalHours: lecturesCount * 1.5 * weeks,
                absenceHours: 0,
                sessions: []
            },
            exercises: {
                count: 0,
                hoursPerSession: 1,
                totalHours: 0,
                absenceHours: 0,
                sessions: []
            },
            labs: {
                count: 0,
                hoursPerSession: 2,
                totalHours: 0,
                absenceHours: 0,
                sessions: []
            },
            totalHours: academicHours * weeks,
            createdAt: new Date().toISOString()
        };
        
        // Add to array
        absenceCourses.push(newCourse);
        
        // Save to localStorage
        localStorage.setItem('absenceCourses', JSON.stringify(absenceCourses));
        
        // Reload display
        loadCourses();
        loadAbsenceControl();
        
        // Clear ONLY basic form fields
        document.getElementById('course-name').value = '';
        document.getElementById('course-academic-hours').value = '';
        document.getElementById('course-weeks').value = '';
        document.getElementById('lectures-count').value = '';
        
        // Success message
        showSuccessPopup(`تم إضافة مادة "${courseName}" بنجاح! 🎉`);
        
        // Switch tab
        setTimeout(() => {
            switchTab('absence');
        }, 1000);
        
    } catch (error) {
        alert('حدث خطأ: ' + error.message);
    }
}

// Emergency add course - ALWAYS WORKS
function addCourseEmergency() {
    try {
        // Get form values with fallbacks - ONLY basic fields
        const courseName = document.getElementById('course-name').value.trim() || 'مادة جديدة';
        const academicHours = parseInt(document.getElementById('course-academic-hours').value) || 3;
        const weeks = parseInt(document.getElementById('course-weeks').value) || 16;
        const lecturesCount = parseInt(document.getElementById('lectures-count').value) || 2;
        
        // Create SIMPLE course object with defaults
        const newCourse = {
            id: Date.now().toString(),
            name: courseName,
            academicHours: academicHours,
            weeks: weeks,
            lectures: {
                count: lecturesCount,
                hoursPerSession: 1.5,
                totalHours: lecturesCount * 1.5 * weeks,
                absenceHours: 0,
                sessions: []
            },
            exercises: {
                count: 0,
                hoursPerSession: 1,
                totalHours: 0,
                absenceHours: 0,
                sessions: []
            },
            labs: {
                count: 0,
                hoursPerSession: 2,
                totalHours: 0,
                absenceHours: 0,
                sessions: []
            },
            totalHours: academicHours * weeks,
            createdAt: new Date().toISOString()
        };
        
        // Add to array
        absenceCourses.push(newCourse);
        
        // Save to localStorage
        localStorage.setItem('absenceCourses', JSON.stringify(absenceCourses));
        
        // Reload display
        loadCourses();
        loadAbsenceControl();
        
        // Clear ONLY basic form fields
        document.getElementById('course-name').value = '';
        document.getElementById('course-academic-hours').value = '';
        document.getElementById('course-weeks').value = '';
        document.getElementById('lectures-count').value = '';
        
        // Success message
        showSuccessPopup(`تم إضافة مادة "${courseName}" بنجاح! 🎉`);
        
        // Switch tab
        setTimeout(() => {
            switchTab('absence');
        }, 1000);
        
    } catch (error) {
        alert('حدث خطأ: ' + error.message);
    }
}

// Keep old function for compatibility
function addCourse(e) {
    if (e) e.preventDefault();
    addCourseSimple();
}

// Customize course after adding - NEW FUNCTION
function customizeCourse(courseId) {
    const course = absenceCourses.find(c => c.id === courseId);
    if (!course) return;
    
    // Show customization modal
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>تخصيص مادة: ${course.name}</h3>
                <button class="close-btn" onclick="closeModal()">&times;</button>
            </div>
            <div class="modal-body">
                <div class="customization-section">
                    <h4>تخصيص المحاضرات</h4>
                    <div class="input-group">
                        <label>عدد المحاضرات في الأسبوع:</label>
                        <input type="number" id="custom-lectures-count" value="${course.lectures.count}" min="1" max="10">
                    </div>
                    <div class="input-group">
                        <label>ساعات المحاضرة الواحدة:</label>
                        <input type="number" id="custom-lecture-hours" value="${course.lectures.hoursPerSession}" min="0.5" max="4" step="0.5">
                    </div>
                </div>
                
                <div class="customization-section">
                    <h4>تخصيص التمارين (اختياري)</h4>
                    <div class="input-group">
                        <label>عدد التمارين في الأسبوع:</label>
                        <input type="number" id="custom-exercises-count" value="${course.exercises.count}" min="0" max="10">
                    </div>
                    <div class="input-group">
                        <label>ساعات التمرين الواحد:</label>
                        <input type="number" id="custom-exercise-hours" value="${course.exercises.hoursPerSession}" min="0.5" max="4" step="0.5">
                    </div>
                </div>
                
                <div class="customization-section">
                    <h4>تخصيص المعامل (اختياري)</h4>
                    <div class="input-group">
                        <label>عدد المعامل في الأسبوع:</label>
                        <input type="number" id="custom-labs-count" value="${course.labs.count}" min="0" max="10">
                    </div>
                    <div class="input-group">
                        <label>ساعات المعمل الواحد:</label>
                        <input type="number" id="custom-lab-hours" value="${course.labs.hoursPerSession}" min="0.5" max="4" step="0.5">
                    </div>
                </div>
            </div>
            <div class="modal-actions">
                <button class="btn btn-secondary" onclick="closeModal()">إلغاء</button>
                <button class="btn btn-primary" onclick="saveCustomization('${courseId}')">حفظ التخصيص</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Save customization
function saveCustomization(courseId) {
    const course = absenceCourses.find(c => c.id === courseId);
    if (!course) return;
    
    // Get customization values
    const lecturesCount = parseInt(document.getElementById('custom-lectures-count').value) || 1;
    const lectureHours = parseFloat(document.getElementById('custom-lecture-hours').value) || 1.5;
    const exercisesCount = parseInt(document.getElementById('custom-exercises-count').value) || 0;
    const exerciseHours = parseFloat(document.getElementById('custom-exercise-hours').value) || 1;
    const labsCount = parseInt(document.getElementById('custom-labs-count').value) || 0;
    const labHours = parseFloat(document.getElementById('custom-lab-hours').value) || 2;
    
    // Update course data
    course.lectures.count = lecturesCount;
    course.lectures.hoursPerSession = lectureHours;
    course.lectures.totalHours = lecturesCount * lectureHours * course.weeks;
    
    course.exercises.count = exercisesCount;
    course.exercises.hoursPerSession = exerciseHours;
    course.exercises.totalHours = exercisesCount * exerciseHours * course.weeks;
    
    course.labs.count = labsCount;
    course.labs.hoursPerSession = labHours;
    course.labs.totalHours = labsCount * labHours * course.weeks;
    
    // Recalculate total hours
    course.totalHours = course.lectures.totalHours + course.exercises.totalHours + course.labs.totalHours;
    
    // Save to localStorage
    localStorage.setItem('absenceCourses', JSON.stringify(absenceCourses));
    
    // Reload display
    loadCourses();
    loadAbsenceControl();
    
    // Close modal
    closeModal();
    
    // Show success message
    alert(`تم تخصيص مادة "${course.name}" بنجاح! 🎉`);
}

// Close modal
function closeModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
        modal.remove();
    }
}


// Add course with required field validation
function addCourseSimple() {
    // Get form values
    const courseName = document.getElementById('course-name').value.trim();
    const academicHours = document.getElementById('course-academic-hours').value;
    const weeks = document.getElementById('course-weeks').value;
    const lecturesCount = document.getElementById('lectures-count').value;
    
    // Use default values if fields are empty
    const finalAcademicHours = academicHours || 3;
    const finalWeeks = weeks || 16;
    const finalLecturesCount = lecturesCount || 2;
    
    // Check if course already exists (only if name is provided)
    if (courseName) {
        const existingCourse = absenceCourses.find(c => c.name.toLowerCase() === courseName.toLowerCase());
        if (existingCourse) {
            alert('هذه المادة موجودة بالفعل');
            return;
        }
    }
    
    // Collect dynamic fields data for sessions
    const exercisesCount = parseInt(document.getElementById('exercises-count').value) || 0;
    const labsCount = parseInt(document.getElementById('labs-count').value) || 0;
    
    const lecturesData = collectDynamicFieldsData('lecture', finalLecturesCount);
    const exercisesData = collectDynamicFieldsData('exercise', exercisesCount);
    const labsData = collectDynamicFieldsData('lab', labsCount);
    
    // Create course object
    const course = {
        id: Date.now().toString(),
        name: courseName || 'مادة جديدة',
        academicHours: parseInt(finalAcademicHours),
        weeks: parseInt(finalWeeks),
        lectures: {
            count: parseInt(finalLecturesCount),
            hoursPerSession: 1.5,
            totalHours: parseInt(finalLecturesCount) * 1.5 * parseInt(finalWeeks),
            absenceHours: 0,
            sessions: lecturesData
        },
        exercises: {
            count: parseInt(document.getElementById('exercises-count').value) || 0,
            hoursPerSession: 1,
            totalHours: (parseInt(document.getElementById('exercises-count').value) || 0) * 1 * parseInt(finalWeeks),
            absenceHours: 0,
            sessions: exercisesData
        },
        labs: {
            count: parseInt(document.getElementById('labs-count').value) || 0,
            hoursPerSession: 2,
            totalHours: (parseInt(document.getElementById('labs-count').value) || 0) * 2 * parseInt(finalWeeks),
            absenceHours: 0,
            sessions: labsData
        },
        totalHours: parseInt(finalAcademicHours) * parseInt(finalWeeks),
        totalAbsencePercentage: 0, // Will be calculated by the function
        createdAt: new Date().toISOString()
    };
    
    // Calculate weekly absence percentage using the new function
    course.totalAbsencePercentage = calculateWeeklyAbsencePercentage(course);
    
    // Debug: Log the calculated percentage
    console.log('Calculated total absence percentage:', course.totalAbsencePercentage);
    console.log('Course object:', course);
    
    // Add course
    absenceCourses.push(course);
    localStorage.setItem('absenceCourses', JSON.stringify(absenceCourses));
    loadCourses();
    loadAbsenceControl();
    
    // Calculate and show course statistics
    const stats = calculateCourseStats(course);
    const totalSessionsPerWeek = (course.lectures?.count || 0) + (course.exercises?.count || 0) + (course.labs?.count || 0);
    const totalSessionsInSemester = totalSessionsPerWeek * course.weeks;
    const maxAbsenceSessions = Math.floor(totalSessionsInSemester * 0.25);
    
    // Show detailed statistics
    const statsMessage = `
        تم إضافة مادة "${course.name}" بنجاح! 🎉
        
        📊 إحصائيات المادة:
        • إجمالي الساعات: ${course.totalHours} ساعة
        • إجمالي الجلسات: ${totalSessionsInSemester} جلسة
        • نسبة الغياب الأسبوعي: ${course.totalAbsencePercentage ? course.totalAbsencePercentage.toFixed(2) : '0.00'}%
        • الحد الأقصى للغياب: ${maxAbsenceSessions} جلسة
        • يمكنك الغياب ${maxAbsenceSessions} جلسة قبل الحرمان
        
        ⚠️ تذكر: تجاوز ${maxAbsenceSessions} جلسة يؤدي إلى الحرمان من المادة!
    `;
    
    showSuccessPopup(statsMessage);
    
    // Clear form
    document.getElementById('course-name').value = '';
    document.getElementById('course-academic-hours').value = '';
    document.getElementById('course-weeks').value = '';
    document.getElementById('lectures-count').value = '';
    document.getElementById('exercises-count').value = '';
    document.getElementById('labs-count').value = '';
    
    // Clear dynamic fields
    document.getElementById('lectures-fields').innerHTML = '';
    document.getElementById('exercises-fields').innerHTML = '';
    document.getElementById('labs-fields').innerHTML = '';
}

// Deleted function

// Show success popup
function showSuccessPopup(message) {
    // Create popup overlay
    const popup = document.createElement('div');
    popup.className = 'success-popup-overlay';
    
    // Format message for multi-line support
    const formattedMessage = message.replace(/\n/g, '<br>');
    
    popup.innerHTML = `
        <div class="success-popup">
            <div class="success-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <div class="success-content">
                <h3>تم بنجاح!</h3>
                <div class="success-message">${formattedMessage}</div>
            </div>
            <div class="success-actions">
                <button class="success-btn" onclick="closeSuccessPopup()">
                    <i class="fas fa-check"></i>
                    تم
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(popup);
    
    // Auto close after 8 seconds for detailed messages
    setTimeout(() => {
        closeSuccessPopup();
    }, 8000);
}

// Close success popup
function closeSuccessPopup() {
    const popup = document.querySelector('.success-popup-overlay');
    if (popup) {
        popup.remove();
    }
}


// Clear add course form - SIMPLIFIED
function clearAddCourseForm() {
    // Clear main form fields
    document.getElementById('course-name').value = '';
    document.getElementById('course-academic-hours').value = '';
    document.getElementById('course-weeks').value = '';
    document.getElementById('lectures-count').value = '';
    document.getElementById('exercises-count').value = '';
    document.getElementById('labs-count').value = '';
    
    // Hide dynamic containers
    document.getElementById('lectures-container').style.display = 'none';
    document.getElementById('exercises-container').style.display = 'none';
    document.getElementById('labs-container').style.display = 'none';
    
    // Clear dynamic fields
    document.getElementById('lectures-fields').innerHTML = '';
    document.getElementById('exercises-fields').innerHTML = '';
    document.getElementById('labs-fields').innerHTML = '';
}

// Generate dynamic lecture fields
function generateLectureFields() {
    const count = parseInt(document.getElementById('lectures-count').value);
    const container = document.getElementById('lectures-container');
    const fieldsContainer = document.getElementById('lectures-fields');
    
    if (count > 0) {
        container.style.display = 'block';
        fieldsContainer.innerHTML = '';
        
        for (let i = 1; i <= count; i++) {
            const fieldDiv = document.createElement('div');
            fieldDiv.className = 'dynamic-field-group';
            fieldDiv.innerHTML = `
                <div class="form-row">
                    <div class="form-group">
                        <label for="lecture-${i}-day">
                            <i class="fas fa-calendar-day"></i>
                            يوم المحاضرة ${i}
                        </label>
                        <div class="day-dropdown-container">
                            <div class="day-dropdown-trigger" data-lecture="${i}">
                                <span class="day-dropdown-text">-- اختر اليوم --</span>
                                <i class="fas fa-chevron-down day-dropdown-icon"></i>
                            </div>
                            <div class="day-dropdown-menu" id="lecture-${i}-menu" style="display: none;">
                                <div class="day-option" data-day="الأحد" data-lecture="${i}">الأحد</div>
                                <div class="day-option" data-day="الاثنين" data-lecture="${i}">الاثنين</div>
                                <div class="day-option" data-day="الثلاثاء" data-lecture="${i}">الثلاثاء</div>
                                <div class="day-option" data-day="الأربعاء" data-lecture="${i}">الأربعاء</div>
                                <div class="day-option" data-day="الخميس" data-lecture="${i}">الخميس</div>
                                <div class="day-option" data-day="السبت" data-lecture="${i}">السبت</div>
                            </div>
                            <input type="hidden" id="lecture-${i}-day" value="">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="lecture-${i}-hours">
                            <i class="fas fa-clock"></i>
                            ساعات المحاضرة ${i}
                        </label>
                        <div class="hours-dropdown-container">
                            <div class="hours-dropdown-trigger" data-lecture="${i}">
                                <span class="hours-dropdown-text">-- اختر الساعات --</span>
                                <i class="fas fa-chevron-down hours-dropdown-icon"></i>
                            </div>
                            <div class="hours-dropdown-menu" id="lecture-${i}-hours-menu" style="display: none;">
                                <div class="hours-option" data-hours="1" data-lecture="${i}">1 ساعة</div>
                                <div class="hours-option" data-hours="2" data-lecture="${i}">2 ساعات</div>
                                <div class="hours-option" data-hours="3" data-lecture="${i}">3 ساعات</div>
                                <div class="hours-option" data-hours="4" data-lecture="${i}">4 ساعات</div>
                                <div class="hours-option" data-hours="5" data-lecture="${i}">5 ساعات</div>
                                <div class="hours-option" data-hours="6" data-lecture="${i}">6 ساعات</div>
                                <div class="hours-option" data-hours="7" data-lecture="${i}">7 ساعات</div>
                                <div class="hours-option" data-hours="8" data-lecture="${i}">8 ساعات</div>
                                <div class="hours-option" data-hours="9" data-lecture="${i}">9 ساعات</div>
                                <div class="hours-option" data-hours="10" data-lecture="${i}">10 ساعات</div>
                            </div>
                            <input type="hidden" id="lecture-${i}-hours" value="">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="lecture-${i}-absence-percentage">
                            <i class="fas fa-percentage"></i>
                            نسبة الغياب للمحاضرة ${i} (من 100)
                        </label>
                        <input type="number" id="lecture-${i}-absence-percentage" min="0" max="100" step="any" placeholder="مثال: 10" value="">
                    </div>
                </div>
            `;
            fieldsContainer.appendChild(fieldDiv);
        }
        
        // Add event listeners for day dropdowns
        addDayDropdownListeners();
    } else {
        container.style.display = 'none';
        fieldsContainer.innerHTML = '';
    }
    
    // Update completion section
    // console.log('استدعاء updateCompletionSection من generateLectureFields');
    // updateCompletionSection();
}

// Generate dynamic exercise fields
function generateExerciseFields() {
    const count = parseInt(document.getElementById('exercises-count').value);
    const container = document.getElementById('exercises-container');
    const fieldsContainer = document.getElementById('exercises-fields');
    
    if (count > 0) {
        container.style.display = 'block';
        fieldsContainer.innerHTML = '';
        
        for (let i = 1; i <= count; i++) {
            const fieldDiv = document.createElement('div');
            fieldDiv.className = 'dynamic-field-group';
            fieldDiv.innerHTML = `
                <div class="form-row">
                    <div class="form-group">
                        <label for="exercise-${i}-day">
                            <i class="fas fa-calendar-day"></i>
                            يوم التمرين ${i}
                        </label>
                        <div class="day-dropdown-container">
                            <div class="day-dropdown-trigger" data-exercise="${i}">
                                <span class="day-dropdown-text">-- اختر اليوم --</span>
                                <i class="fas fa-chevron-down day-dropdown-icon"></i>
                            </div>
                            <div class="day-dropdown-menu" id="exercise-${i}-menu" style="display: none;">
                                <div class="day-option" data-day="الأحد" data-exercise="${i}">الأحد</div>
                                <div class="day-option" data-day="الاثنين" data-exercise="${i}">الاثنين</div>
                                <div class="day-option" data-day="الثلاثاء" data-exercise="${i}">الثلاثاء</div>
                                <div class="day-option" data-day="الأربعاء" data-exercise="${i}">الأربعاء</div>
                                <div class="day-option" data-day="الخميس" data-exercise="${i}">الخميس</div>
                                <div class="day-option" data-day="السبت" data-exercise="${i}">السبت</div>
                            </div>
                            <input type="hidden" id="exercise-${i}-day" value="">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="exercise-${i}-hours">
                            <i class="fas fa-clock"></i>
                            ساعات التمرين ${i}
                        </label>
                        <div class="hours-dropdown-container">
                            <div class="hours-dropdown-trigger" data-exercise="${i}">
                                <span class="hours-dropdown-text">-- اختر الساعات --</span>
                                <i class="fas fa-chevron-down hours-dropdown-icon"></i>
                            </div>
                            <div class="hours-dropdown-menu" id="exercise-${i}-hours-menu" style="display: none;">
                                <div class="hours-option" data-hours="1" data-exercise="${i}">1 ساعة</div>
                                <div class="hours-option" data-hours="2" data-exercise="${i}">2 ساعات</div>
                                <div class="hours-option" data-hours="3" data-exercise="${i}">3 ساعات</div>
                                <div class="hours-option" data-hours="4" data-exercise="${i}">4 ساعات</div>
                                <div class="hours-option" data-hours="5" data-exercise="${i}">5 ساعات</div>
                                <div class="hours-option" data-hours="6" data-exercise="${i}">6 ساعات</div>
                                <div class="hours-option" data-hours="7" data-exercise="${i}">7 ساعات</div>
                                <div class="hours-option" data-hours="8" data-exercise="${i}">8 ساعات</div>
                                <div class="hours-option" data-hours="9" data-exercise="${i}">9 ساعات</div>
                                <div class="hours-option" data-hours="10" data-exercise="${i}">10 ساعات</div>
                            </div>
                            <input type="hidden" id="exercise-${i}-hours" value="">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="exercise-${i}-absence-percentage">
                            <i class="fas fa-percentage"></i>
                            نسبة الغياب للتمرين ${i} (من 100)
                        </label>
                        <input type="number" id="exercise-${i}-absence-percentage" min="0" max="100" step="any" placeholder="مثال: 5" value="">
                    </div>
                </div>
            `;
            fieldsContainer.appendChild(fieldDiv);
        }
        
        // Add event listeners for day dropdowns
        addDayDropdownListeners();
    } else {
        container.style.display = 'none';
        fieldsContainer.innerHTML = '';
    }
    
    // Update completion section
    // console.log('استدعاء updateCompletionSection من generateExerciseFields');
    // updateCompletionSection();
}

// Generate dynamic lab fields
function generateLabFields() {
    const count = parseInt(document.getElementById('labs-count').value);
    const container = document.getElementById('labs-container');
    const fieldsContainer = document.getElementById('labs-fields');
    
    if (count > 0) {
        container.style.display = 'block';
        fieldsContainer.innerHTML = '';
        
        for (let i = 1; i <= count; i++) {
            const fieldDiv = document.createElement('div');
            fieldDiv.className = 'dynamic-field-group';
            fieldDiv.innerHTML = `
                <div class="form-row">
                    <div class="form-group">
                        <label for="lab-${i}-day">
                            <i class="fas fa-calendar-day"></i>
                            يوم المعمل ${i}
                        </label>
                        <div class="day-dropdown-container">
                            <div class="day-dropdown-trigger" data-lab="${i}">
                                <span class="day-dropdown-text">-- اختر اليوم --</span>
                                <i class="fas fa-chevron-down day-dropdown-icon"></i>
                            </div>
                            <div class="day-dropdown-menu" id="lab-${i}-menu" style="display: none;">
                                <div class="day-option" data-day="الأحد" data-lab="${i}">الأحد</div>
                                <div class="day-option" data-day="الاثنين" data-lab="${i}">الاثنين</div>
                                <div class="day-option" data-day="الثلاثاء" data-lab="${i}">الثلاثاء</div>
                                <div class="day-option" data-day="الأربعاء" data-lab="${i}">الأربعاء</div>
                                <div class="day-option" data-day="الخميس" data-lab="${i}">الخميس</div>
                                <div class="day-option" data-day="السبت" data-lab="${i}">السبت</div>
                            </div>
                            <input type="hidden" id="lab-${i}-day" value="">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="lab-${i}-hours">
                            <i class="fas fa-clock"></i>
                            ساعات المعمل ${i}
                        </label>
                        <div class="hours-dropdown-container">
                            <div class="hours-dropdown-trigger" data-lab="${i}">
                                <span class="hours-dropdown-text">-- اختر الساعات --</span>
                                <i class="fas fa-chevron-down hours-dropdown-icon"></i>
                            </div>
                            <div class="hours-dropdown-menu" id="lab-${i}-hours-menu" style="display: none;">
                                <div class="hours-option" data-hours="1" data-lab="${i}">1 ساعة</div>
                                <div class="hours-option" data-hours="2" data-lab="${i}">2 ساعات</div>
                                <div class="hours-option" data-hours="3" data-lab="${i}">3 ساعات</div>
                                <div class="hours-option" data-hours="4" data-lab="${i}">4 ساعات</div>
                                <div class="hours-option" data-hours="5" data-lab="${i}">5 ساعات</div>
                                <div class="hours-option" data-hours="6" data-lab="${i}">6 ساعات</div>
                                <div class="hours-option" data-hours="7" data-lab="${i}">7 ساعات</div>
                                <div class="hours-option" data-hours="8" data-lab="${i}">8 ساعات</div>
                                <div class="hours-option" data-hours="9" data-lab="${i}">9 ساعات</div>
                                <div class="hours-option" data-hours="10" data-lab="${i}">10 ساعات</div>
                            </div>
                            <input type="hidden" id="lab-${i}-hours" value="">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="lab-${i}-absence-percentage">
                            <i class="fas fa-percentage"></i>
                            نسبة الغياب للمعمل ${i} (من 100)
                        </label>
                        <input type="number" id="lab-${i}-absence-percentage" min="0" max="100" step="any" placeholder="مثال: 15" value="">
                    </div>
                </div>
            `;
            fieldsContainer.appendChild(fieldDiv);
        }
        
        // Add event listeners for day dropdowns
        addDayDropdownListeners();
    } else {
        container.style.display = 'none';
        fieldsContainer.innerHTML = '';
    }
    
    // Update completion section
    // console.log('استدعاء updateCompletionSection من generateLabFields');
    // updateCompletionSection();
}

// Add event listeners for day and hours dropdowns
function addDayDropdownListeners() {
    // Close all dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.day-dropdown-container') && !e.target.closest('.hours-dropdown-container')) {
            document.querySelectorAll('.day-dropdown-menu, .hours-dropdown-menu').forEach(menu => {
                menu.style.display = 'none';
            });
            document.querySelectorAll('.day-dropdown-icon, .hours-dropdown-icon').forEach(icon => {
                icon.style.transform = 'rotate(0deg)';
            });
        }
    });

    // Handle day dropdown triggers
    document.querySelectorAll('.day-dropdown-trigger').forEach(trigger => {
        trigger.addEventListener('click', function(e) {
            e.stopPropagation();
            const lecture = this.dataset.lecture;
            const exercise = this.dataset.exercise;
            const lab = this.dataset.lab;
            
            // Close all other dropdowns
            document.querySelectorAll('.day-dropdown-menu, .hours-dropdown-menu').forEach(menu => {
                if (menu.id !== `${lecture ? 'lecture' : exercise ? 'exercise' : 'lab'}-${lecture || exercise || lab}-menu`) {
                    menu.style.display = 'none';
                }
            });
            
            document.querySelectorAll('.day-dropdown-icon, .hours-dropdown-icon').forEach(icon => {
                if (icon !== this.querySelector('.day-dropdown-icon')) {
                    icon.style.transform = 'rotate(0deg)';
                }
            });
            
            // Toggle current dropdown
            const menu = this.nextElementSibling;
            const icon = this.querySelector('.day-dropdown-icon');
            
            if (menu.style.display === 'none' || menu.style.display === '') {
                menu.style.display = 'block';
                icon.style.transform = 'rotate(180deg)';
            } else {
                menu.style.display = 'none';
                icon.style.transform = 'rotate(0deg)';
            }
        });
    });

    // Handle hours dropdown triggers
    document.querySelectorAll('.hours-dropdown-trigger').forEach(trigger => {
        trigger.addEventListener('click', function(e) {
            e.stopPropagation();
            const lecture = this.dataset.lecture;
            const exercise = this.dataset.exercise;
            const lab = this.dataset.lab;
            
            // Close all other dropdowns
            document.querySelectorAll('.day-dropdown-menu, .hours-dropdown-menu').forEach(menu => {
                if (menu.id !== `${lecture ? 'lecture' : exercise ? 'exercise' : 'lab'}-${lecture || exercise || lab}-hours-menu`) {
                    menu.style.display = 'none';
                }
            });
            
            document.querySelectorAll('.day-dropdown-icon, .hours-dropdown-icon').forEach(icon => {
                if (icon !== this.querySelector('.hours-dropdown-icon')) {
                    icon.style.transform = 'rotate(0deg)';
                }
            });
            
            // Toggle current dropdown
            const menu = this.nextElementSibling;
            const icon = this.querySelector('.hours-dropdown-icon');
            
            if (menu.style.display === 'none' || menu.style.display === '') {
                menu.style.display = 'block';
                icon.style.transform = 'rotate(180deg)';
            } else {
                menu.style.display = 'none';
                icon.style.transform = 'rotate(0deg)';
            }
        });
    });

    // Handle day options
    document.querySelectorAll('.day-option').forEach(option => {
        option.addEventListener('click', function(e) {
            e.stopPropagation();
            const day = this.dataset.day;
            const lecture = this.dataset.lecture;
            const exercise = this.dataset.exercise;
            const lab = this.dataset.lab;
            
            // Update dropdown text
            const container = this.closest('.day-dropdown-container');
            const textElement = container.querySelector('.day-dropdown-text');
            textElement.textContent = day;
            
            // Update hidden input
            if (lecture) {
                document.getElementById(`lecture-${lecture}-day`).value = day;
            } else if (exercise) {
                document.getElementById(`exercise-${exercise}-day`).value = day;
            } else if (lab) {
                document.getElementById(`lab-${lab}-day`).value = day;
            }
            
            // Close dropdown
            const menu = container.querySelector('.day-dropdown-menu');
            const icon = container.querySelector('.day-dropdown-icon');
            menu.style.display = 'none';
            icon.style.transform = 'rotate(0deg)';
        });
    });

    // Handle hours options
    document.querySelectorAll('.hours-option').forEach(option => {
        option.addEventListener('click', function(e) {
            e.stopPropagation();
            const hours = this.dataset.hours;
            const lecture = this.dataset.lecture;
            const exercise = this.dataset.exercise;
            const lab = this.dataset.lab;
            
            // Update dropdown text
            const container = this.closest('.hours-dropdown-container');
            const textElement = container.querySelector('.hours-dropdown-text');
            textElement.textContent = this.textContent;
            
            // Update hidden input
            if (lecture) {
                document.getElementById(`lecture-${lecture}-hours`).value = hours;
            } else if (exercise) {
                document.getElementById(`exercise-${exercise}-hours`).value = hours;
            } else if (lab) {
                document.getElementById(`lab-${lab}-hours`).value = hours;
            }
            
            // Close dropdown
            const menu = container.querySelector('.hours-dropdown-menu');
            const icon = container.querySelector('.hours-dropdown-icon');
            menu.style.display = 'none';
            icon.style.transform = 'rotate(0deg)';
        });
    });
}

// Add event listeners for day buttons
function addDayButtonListeners() {
    const dayButtons = document.querySelectorAll('.day-btn');
    dayButtons.forEach(button => {
        button.addEventListener('click', function() {
            const day = this.dataset.day;
            const lecture = this.dataset.lecture;
            const exercise = this.dataset.exercise;
            const lab = this.dataset.lab;
            
            // Remove active class from all buttons in the same group
            const container = this.closest('.day-buttons-container');
            const groupButtons = container.querySelectorAll('.day-btn');
            groupButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Update hidden input value
            if (lecture) {
                document.getElementById(`lecture-${lecture}-day`).value = day;
            } else if (exercise) {
                document.getElementById(`exercise-${exercise}-day`).value = day;
            } else if (lab) {
                document.getElementById(`lab-${lab}-day`).value = day;
            }
        });
    });
}

// Collect dynamic fields data
function collectDynamicFieldsData(type, count) {
    const data = [];
    console.log(`جمع بيانات ${type} للعدد ${count}`);
    
    for (let i = 1; i <= count; i++) {
        const dayElement = document.getElementById(`${type}-${i}-day`);
        const hoursElement = document.getElementById(`${type}-${i}-hours`);
        const absencePercentageElement = document.getElementById(`${type}-${i}-absence-percentage`);
        
        console.log(`العنصر ${i}:`, dayElement, hoursElement, absencePercentageElement);
        
        if (dayElement && hoursElement) {
            const day = dayElement.value.trim();
            const hours = parseFloat(convertArabicCommaToDot(hoursElement.value));
            const absencePercentage = parseFloat(convertArabicCommaToDot(absencePercentageElement?.value)) || 0;
            
            console.log(`القيم ${i}:`, day, hours, absencePercentage);
            
            if (day && hours > 0) {
                data.push({
                    id: i,
                    name: day,
                    day: day,
                    hours: hours,
                    absencePercentage: absencePercentage,
                    absenceCount: 0
                });
            } else {
                // If no custom data, use default values
                data.push({
                    id: i,
                    name: `${type === 'lecture' ? 'المحاضرة' : type === 'exercise' ? 'التمرين' : 'المعمل'} ${i}`,
                    day: 'غير محدد',
                    hours: type === 'lecture' ? 1.5 : type === 'exercise' ? 1 : 2,
                    absencePercentage: 0,
                    absenceCount: 0
                });
            }
        }
    }
    
    console.log(`البيانات المجمعة لـ ${type}:`, data);
    return data;
}

// Convert Arabic comma to dot for calculations
function convertArabicCommaToDot(value) {
    if (typeof value === 'string') {
        return value.replace(/،/g, '.');
    }
    return value;
}

// Calculate weekly absence percentage for a course
function calculateWeeklyAbsencePercentage(course) {
    let totalAbsencePercentage = 0;
    
    // Calculate from lectures sessions
    if (course.lectures && course.lectures.sessions) {
        course.lectures.sessions.forEach(session => {
            if (session.absencePercentage && session.absencePercentage > 0) {
                totalAbsencePercentage += parseFloat(session.absencePercentage);
            }
        });
    }
    
    // Calculate from exercises sessions
    if (course.exercises && course.exercises.sessions) {
        course.exercises.sessions.forEach(session => {
            if (session.absencePercentage && session.absencePercentage > 0) {
                totalAbsencePercentage += parseFloat(session.absencePercentage);
            }
        });
    }
    
    // Calculate from labs sessions
    if (course.labs && course.labs.sessions) {
        course.labs.sessions.forEach(session => {
            if (session.absencePercentage && session.absencePercentage > 0) {
                totalAbsencePercentage += parseFloat(session.absencePercentage);
            }
        });
    }
    
    return totalAbsencePercentage;
}

// Update weekly absence percentage for all courses
function updateAllCoursesWeeklyAbsencePercentage() {
    absenceCourses.forEach(course => {
        const weeklyPercentage = calculateWeeklyAbsencePercentage(course);
        course.totalAbsencePercentage = weeklyPercentage;
    });
    
    // Save updated data
    localStorage.setItem('absenceCourses', JSON.stringify(absenceCourses));
    
    // Reload display
    loadCourses();
    loadAbsenceControl();
}

// Calculate total absence count based on percentage and total sessions
function calculateTotalAbsenceCount(sessionsData, weeks) {
    let totalAbsenceCount = 0;
    
    sessionsData.forEach(session => {
        // Calculate total sessions for this session type
        const totalSessionsForThisType = weeks; // Each session happens once per week
        // Convert percentage to actual count
        const absenceCount = Math.floor((session.absencePercentage / 100) * totalSessionsForThisType);
        totalAbsenceCount += absenceCount;
    });
    
    return totalAbsenceCount;
}

// Calculate remaining absence hours and sessions
function calculateRemainingAbsence(sessionsData, weeks) {
    // Calculate total sessions per week
    const totalSessionsPerWeek = sessionsData.length;
    const totalSessionsInSemester = totalSessionsPerWeek * weeks;
    
    // Calculate total absence count
    const totalAbsenceCount = calculateTotalAbsenceCount(sessionsData, weeks);
    
    // Calculate maximum allowed absence (25% of total sessions)
    const maxAllowedAbsence = Math.floor(totalSessionsInSemester * 0.25);
    
    // Calculate remaining absence sessions
    const remainingAbsenceSessions = Math.max(0, maxAllowedAbsence - totalAbsenceCount);
    
    // Calculate current absence percentage
    const currentAbsencePercentage = totalSessionsInSemester > 0 ? (totalAbsenceCount / totalSessionsInSemester) * 100 : 0;
    
    // Check if banned (exceeded 25%)
    const isBanned = currentAbsencePercentage > 25.01;
    
    return {
        totalSessionsPerWeek,
        totalSessionsInSemester,
        totalAbsenceCount,
        maxAllowedAbsence,
        remainingAbsenceSessions,
        currentAbsencePercentage,
        isBanned,
        banStatus: isBanned ? 'محروم' : currentAbsencePercentage > 20 ? 'تحذير' : 'آمن'
    };
}

// Calculate individual type limits
function calculateIndividualLimits(sessionsData, weeks, typeName) {
    // Calculate total sessions per week for this type
    const totalSessionsPerWeek = sessionsData.length;
    const totalSessionsInSemester = totalSessionsPerWeek * weeks;
    
    // Calculate total absence count for this type
    const totalAbsenceCount = calculateTotalAbsenceCount(sessionsData, weeks);
    
    // Calculate maximum allowed absence (25% of total sessions)
    const maxAllowedAbsence = Math.floor(totalSessionsInSemester * 0.25);
    
    // Calculate remaining absence sessions
    const remainingAbsenceSessions = Math.max(0, maxAllowedAbsence - totalAbsenceCount);
    
    // Calculate current absence percentage
    const currentAbsencePercentage = totalSessionsInSemester > 0 ? (totalAbsenceCount / totalSessionsInSemester) * 100 : 0;
    
    // Check if banned (exceeded 25%)
    const isBanned = currentAbsencePercentage > 25.01;
    
    return {
        type: typeName,
        totalSessionsPerWeek,
        totalSessionsInSemester,
        totalAbsenceCount,
        maxAllowedAbsence,
        remainingAbsenceSessions,
        currentAbsencePercentage,
        isBanned,
        banStatus: isBanned ? 'محروم' : currentAbsencePercentage > 20 ? 'تحذير' : 'آمن'
    };
}

// Load and display courses
function loadCourses() {
    const coursesList = document.getElementById('courses-list');
    if (!coursesList) {
        console.error('عنصر courses-list غير موجود');
        return;
    }
    
    console.log('تحميل المواد، العدد:', absenceCourses.length);
    
    if (absenceCourses.length === 0) {
        coursesList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-calendar-plus"></i>
                <h4>لا توجد مواد بعد</h4>
                <p>أضف مادة جديدة لبدء متابعة غيابك</p>
            </div>
        `;
        return;
    }
    
    coursesList.innerHTML = '';
    absenceCourses.forEach(course => {
        // استخدام النظام المتكامل الجديد لحساب الإحصائيات
        const stats = calculateIntegratedStats(course);
               const statusIcon = stats.status === 'danger' ? '🔴' : stats.status === 'warning' ? '🔴' : stats.status === 'safe-yellow' ? '🟡' : '🟢';
               const statusClass = stats.status === 'danger' ? 'danger' : stats.status === 'warning' ? 'danger' : stats.status === 'safe-yellow' ? 'warning' : 'safe';
        
        // حساب عدد جلسات الغياب الفعلية
        let totalAbsenceSessions = 0;
        if (course.lectures && course.lectures.sessions) {
            course.lectures.sessions.forEach(session => {
                totalAbsenceSessions += session.absenceCount || 0;
            });
        }
        if (course.exercises && course.exercises.sessions) {
            course.exercises.sessions.forEach(session => {
                totalAbsenceSessions += session.absenceCount || 0;
            });
        }
        if (course.labs && course.labs.sessions) {
            course.labs.sessions.forEach(session => {
                totalAbsenceSessions += session.absenceCount || 0;
            });
        }
        
        const courseElement = document.createElement('div');
        courseElement.className = `course-item ${statusClass}`;
        courseElement.innerHTML = `
            <div class="course-header">
                <div class="course-info">
                    <h4>${course.name}</h4>
                    <span class="status-badge ${statusClass}">${statusIcon} ${stats.status === 'danger' ? 'حرمان!' : stats.status === 'warning' ? 'تحذير!' : 'آمن'}</span>
                </div>
                <div class="course-actions">
                    <button class="edit-btn" onclick="editCourseAbsence('${course.id}')" title="تعديل الغياب">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="customize-btn" onclick="customizeCourse('${course.id}')" title="تخصيص المادة">
                        <i class="fas fa-cog"></i>
                    </button>
                    <button class="delete-btn" onclick="deleteCourse('${course.id}')" title="حذف المادة">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="course-details">
                <div class="course-type-stats">
                    ${course.lectures.count > 0 ? `
                        <div class="type-stat">
                            <span class="type-label">المحاضرات:</span>
                            <span class="type-value">${course.lectures?.absenceHours || 0}/${course.lectures?.totalHours || 0} ساعة</span>
                            <div class="session-details">
                                ${course.lectures.sessions && course.lectures.sessions.length > 0 ? 
                                    course.lectures.sessions.map(session => 
                                        `<small>${session.day || session.name}: ${session.hours}س (غياب: ${session.absenceCount || 0})</small>`
                                    ).join(' • ') : 
                                    `<small>محاضرات عادية: ${course.lectures.hoursPerSession}س</small>`
                                }
                            </div>
                        </div>
                    ` : ''}
                    ${course.exercises.count > 0 ? `
                        <div class="type-stat">
                            <span class="type-label">التمارين:</span>
                            <span class="type-value">${course.exercises?.absenceHours || 0}/${course.exercises?.totalHours || 0} ساعة</span>
                            <div class="session-details">
                                ${course.exercises.sessions && course.exercises.sessions.length > 0 ? 
                                    course.exercises.sessions.map(session => 
                                        `<small>${session.day || session.name}: ${session.hours}س (غياب: ${session.absenceCount || 0})</small>`
                                    ).join(' • ') : 
                                    `<small>تمارين عادية: ${course.exercises.hoursPerSession}س</small>`
                                }
                            </div>
                        </div>
                    ` : ''}
                    ${course.labs.count > 0 ? `
                        <div class="type-stat">
                            <span class="type-label">المعامل:</span>
                            <span class="type-value">${course.labs?.absenceHours || 0}/${course.labs?.totalHours || 0} ساعة</span>
                            <div class="session-details">
                                ${course.labs.sessions && course.labs.sessions.length > 0 ? 
                                    course.labs.sessions.map(session => 
                                        `<small>${session.day || session.name}: ${session.hours}س (غياب: ${session.absenceCount || 0})</small>`
                                    ).join(' • ') : 
                                    `<small>معامل عادية: ${course.labs.hoursPerSession}س</small>`
                                }
                            </div>
                        </div>
                    ` : ''}
                </div>
                <div class="course-summary-stats">
                    <div class="stat-item">
                        <span class="stat-label">إجمالي الساعات:</span>
                        <span class="stat-value">${course.totalHours}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">إجمالي الجلسات:</span>
                        <span class="stat-value">${stats.totalSessionsInSemester}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">نسبة الغياب الأسبوعي:</span>
                        <span class="stat-value">${stats.absencePercentage.toFixed(2)}%</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">الحد الأقصى للغياب:</span>
                        <span class="stat-value">${stats.maxAbsenceSessions} جلسة</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">المستخدم:</span>
                        <span class="stat-value">${totalAbsenceSessions} جلسة</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">المتبقي:</span>
                        <span class="stat-value">${stats.remainingAbsenceSessions} جلسة</span>
                    </div>
                </div>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${Math.min(stats.absencePercentage, 100)}%"></div>
            </div>
        `;
        coursesList.appendChild(courseElement);
    });
    
    console.log('تم عرض المواد بنجاح');
}

// Calculate course statistics
function calculateCourseStats(course) {
    // Calculate total sessions per week
    const totalSessionsPerWeek = (course.lectures?.count || 0) + (course.exercises?.count || 0) + (course.labs?.count || 0);
    
    // Calculate total sessions in semester
    const totalSessionsInSemester = totalSessionsPerWeek * course.weeks;
    
    // Calculate maximum allowed absences in semester (25% of total sessions)
    const maxAbsenceSessions = Math.floor(totalSessionsInSemester * 0.25);
    
    // Current absence hours (from user input)
    const totalAbsenceHours = (course.lectures?.absenceHours || 0) + (course.exercises?.absenceHours || 0) + (course.labs?.absenceHours || 0);
    
    // Convert absence hours to sessions (assuming each session has average hours)
    const averageHoursPerSession = course.totalHours / totalSessionsInSemester;
    const actualAbsenceSessions = Math.floor(totalAbsenceHours / averageHoursPerSession);
    
    // Calculate remaining absences (in sessions)
    const remainingAbsences = Math.max(0, maxAbsenceSessions - actualAbsenceSessions);
    
    // Calculate current absence percentage
    const currentAbsencePercentage = totalSessionsInSemester > 0 ? (actualAbsenceSessions / totalSessionsInSemester) * 100 : 0;
    
    let status = 'safe';
    if (currentAbsencePercentage > 25.01) {
        status = 'danger';
    } else if (currentAbsencePercentage >= 18.75) { // 75% of 25%
        status = 'warning';
    }
    
    const percentage = maxAbsenceSessions > 0 ? (actualAbsenceSessions / maxAbsenceSessions) * 100 : 0;
    
    return {
        maxAbsenceHours: maxAbsenceSessions,
        remainingHours: remainingAbsences,
        status,
        percentage,
        totalAbsenceHours,
        absencePercentage: currentAbsencePercentage,
        totalSessionsInSemester,
        actualAbsenceSessions
    };
}

// Edit course absence
function editCourseAbsence(courseId) {
    const course = absenceCourses.find(c => c.id === courseId);
    if (!course) return;
    
    const stats = calculateCourseStats(course);
    const totalAbsenceHours = (course.lectures?.absenceHours || 0) + (course.exercises?.absenceHours || 0) + (course.labs?.absenceHours || 0);
    const absencePercentage = ((totalAbsenceHours / course.totalHours) * 100).toFixed(1);
    
    // Create detailed absence editing modal
    openDetailedAbsenceModal(course, stats);
}

// Open detailed absence editing modal
function openDetailedAbsenceModal(course, stats) {
    // Create modal HTML
    const modalHTML = `
        <div id="detailed-absence-modal" class="modal" style="display: flex;">
            <div class="modal-card" style="max-width: 800px;">
                <h3>تخصيص الغياب - ${course.name}</h3>
                <div class="modal-body">
                    <div class="absence-summary">
                        <div class="summary-card">
                            <h4>ملخص الغياب الحالي</h4>
                            <div class="summary-stats">
                                <div class="stat-item">
                                    <span class="stat-label">إجمالي الساعات:</span>
                                    <span class="stat-value">${course.totalHours} ساعة</span>
                                </div>
                                <div class="stat-item">
                                    <span class="stat-label">الحد الأقصى للغياب:</span>
                                    <span class="stat-value">${stats.maxAbsenceHours} ساعة (25%)</span>
                                </div>
                                <div class="stat-item">
                                    <span class="stat-label">الغياب الحالي:</span>
                                    <span class="stat-value ${stats.status === 'danger' ? 'danger' : stats.status === 'warning' ? 'warning' : 'success'}">${(course.lectures?.absenceHours || 0) + (course.exercises?.absenceHours || 0) + (course.labs?.absenceHours || 0)} ساعة</span>
                                </div>
                                <div class="stat-item">
                                    <span class="stat-label">نسبة الغياب:</span>
                                    <span class="stat-value ${stats.status === 'danger' ? 'danger' : stats.status === 'warning' ? 'warning' : 'success'}">${((totalAbsenceHours / course.totalHours) * 100).toFixed(1)}%</span>
                                </div>
                                <div class="stat-item">
                                    <span class="stat-label">المتبقي:</span>
                                    <span class="stat-value">${stats.remainingHours} ساعة</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="warning-card ${stats.status === 'danger' ? 'danger' : stats.status === 'warning' ? 'warning' : 'success'}">
                            <div class="warning-icon">
                                ${stats.status === 'danger' ? '🚫' : stats.status === 'warning' ? '⚠️' : '✅'}
                            </div>
                            <div class="warning-text">
                                <h4>${stats.status === 'danger' ? 'حرمان من المادة!' : stats.status === 'warning' ? 'تحذير: قريب من الحد المسموح' : 'حالة آمنة'}</h4>
                                <p>${stats.status === 'danger' ? 'لقد تجاوزت الحد الأقصى المسموح للغياب (25%)' : stats.status === 'warning' ? 'أنت قريب من الحد الأقصى المسموح للغياب' : 'غيابك ضمن الحدود المسموحة'}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="absence-inputs">
                        <h4>تخصيص الغياب لكل نوع</h4>
                        ${course.lectures.count > 0 ? `
                            <div class="absence-type-input">
                                <label for="lectures-absence-input">
                                    <i class="fas fa-chalkboard-teacher"></i>
                                    غياب المحاضرات (${course.lectures.totalHours} ساعة إجمالي)
                                </label>
                                <input type="number" id="lectures-absence-input" min="0" max="${course.lectures?.totalHours || 0}" step="0.5" value="${course.lectures?.absenceHours || 0}">
                                <span class="absence-percentage" id="lectures-percentage">${((course.lectures?.absenceHours || 0) / (course.lectures?.totalHours || 1) * 100).toFixed(1)}%</span>
                            </div>
                        ` : ''}
                        
                        ${course.exercises.count > 0 ? `
                            <div class="absence-type-input">
                                <label for="exercises-absence-input">
                                    <i class="fas fa-calculator"></i>
                                    غياب التمارين (${course.exercises.totalHours} ساعة إجمالي)
                                </label>
                                <input type="number" id="exercises-absence-input" min="0" max="${course.exercises?.totalHours || 0}" step="0.5" value="${course.exercises?.absenceHours || 0}">
                                <span class="absence-percentage" id="exercises-percentage">${((course.exercises?.absenceHours || 0) / (course.exercises?.totalHours || 1) * 100).toFixed(1)}%</span>
                            </div>
                        ` : ''}
                        
                        ${course.labs.count > 0 ? `
                            <div class="absence-type-input">
                                <label for="labs-absence-input">
                                    <i class="fas fa-flask"></i>
                                    غياب المعامل (${course.labs.totalHours} ساعة إجمالي)
                                </label>
                                <input type="number" id="labs-absence-input" min="0" max="${course.labs?.totalHours || 0}" step="0.5" value="${course.labs?.absenceHours || 0}">
                                <span class="absence-percentage" id="labs-percentage">${((course.labs?.absenceHours || 0) / (course.labs?.totalHours || 1) * 100).toFixed(1)}%</span>
                            </div>
                        ` : ''}
                    </div>
                </div>
                <div class="modal-actions">
                    <button id="cancel-detailed-absence" class="submit-btn secondary">
                        <i class="fas fa-times"></i>
                        <span>إلغاء</span>
                    </button>
                    <button id="save-detailed-absence" class="submit-btn">
                        <i class="fas fa-save"></i>
                        <span>حفظ التغييرات</span>
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing modal if any
    const existingModal = document.getElementById('detailed-absence-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Add modal to page
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Add event listeners
    const modal = document.getElementById('detailed-absence-modal');
    const cancelBtn = document.getElementById('cancel-detailed-absence');
    const saveBtn = document.getElementById('save-detailed-absence');
    
    // Cancel button
    cancelBtn.addEventListener('click', () => {
        modal.remove();
    });
    
    // Save button
    saveBtn.addEventListener('click', () => {
        saveDetailedAbsence(course);
        modal.remove();
    });
    
    // Close on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    // Add real-time percentage updates
    addRealTimePercentageUpdates(course);
}

// Add real-time percentage updates
function addRealTimePercentageUpdates(course) {
    const inputs = [
        { input: 'lectures-absence-input', percentage: 'lectures-percentage', total: course.lectures.totalHours },
        { input: 'exercises-absence-input', percentage: 'exercises-percentage', total: course.exercises.totalHours },
        { input: 'labs-absence-input', percentage: 'labs-percentage', total: course.labs.totalHours }
    ];
    
    inputs.forEach(({ input, percentage, total }) => {
        const inputElement = document.getElementById(input);
        const percentageElement = document.getElementById(percentage);
        
        if (inputElement && percentageElement) {
            inputElement.addEventListener('input', function() {
                const value = parseFloat(this.value) || 0;
                const percent = ((value / total) * 100).toFixed(1);
                percentageElement.textContent = percent + '%';
                
                // Update color based on percentage
                if (percent > 25) {
                    percentageElement.className = 'absence-percentage danger';
                } else if (percent > 18.75) {
                    percentageElement.className = 'absence-percentage warning';
                } else {
                    percentageElement.className = 'absence-percentage success';
                }
            });
        }
    });
}

// Save detailed absence
function saveDetailedAbsence(course) {
    const lecturesInput = document.getElementById('lectures-absence-input');
    const exercisesInput = document.getElementById('exercises-absence-input');
    const labsInput = document.getElementById('labs-absence-input');
    
    if (lecturesInput && course.lectures) {
        course.lectures.absenceHours = parseFloat(lecturesInput.value) || 0;
    }
    
    if (exercisesInput && course.exercises) {
        course.exercises.absenceHours = parseFloat(exercisesInput.value) || 0;
    }
    
    if (labsInput && course.labs) {
        course.labs.absenceHours = parseFloat(labsInput.value) || 0;
    }
    
    saveCourses();
    loadCourses();
    
    const stats = calculateCourseStats(course);
    const totalAbsenceHours = (course.lectures?.absenceHours || 0) + (course.exercises?.absenceHours || 0) + (course.labs?.absenceHours || 0);
    const absencePercentage = ((totalAbsenceHours / course.totalHours) * 100).toFixed(1);
    
    let message = `تم تحديث الغياب بنجاح! 📊\nالغياب الحالي: ${totalAbsenceHours} ساعة (${absencePercentage}%)`;
    
    if (stats.status === 'danger') {
        message += '\n⚠️ تحذير: تجاوزت الحد المسموح!';
    } else if (stats.status === 'warning') {
        message += '\n⚠️ تحذير: قريب من الحد المسموح!';
    }
    
    showToast(message, stats.status === 'danger' ? 'error' : stats.status === 'warning' ? 'warning' : 'success');
}


// Delete course
function deleteCourse(courseId) {
    const course = absenceCourses.find(c => c.id === courseId);
    if (!course) return;
    
    if (confirm(`هل أنت متأكد من حذف مادة "${course.name}"؟\n\nسيتم حذفها من:\n- المواد المسجلة\n- تحكم الغياب\n- جميع الإحصائيات`)) {
        // Remove from absenceCourses
        absenceCourses = absenceCourses.filter(c => c.id !== courseId);
        
        // Save updated data
        localStorage.setItem('absenceCourses', JSON.stringify(absenceCourses));
        
        // Refresh all sections
        loadCourses();
        loadAbsenceControl();
        
        // Show success message
        showToast(`تم حذف مادة "${course.name}" بنجاح! 🗑️`, 'success');
        
        console.log(`Course "${course.name}" deleted successfully`);
    }
}

// Save courses to localStorage
function saveCourses() {
    console.log('حفظ المواد:', absenceCourses);
    localStorage.setItem('absenceCourses', JSON.stringify(absenceCourses));
    console.log('تم حفظ المواد في localStorage');
}


// Update completion section - REMOVED
function updateCompletionSection() {
    // This function has been removed as per user request
    // The completion section and related functionality are no longer needed
    return;
}

// Complete customization and proceed to add course




// منع zoom عند double tap على أزرار العداد - حل جذري
(function() {
    let lastTouchEnd = 0;
    let touchStartTime = 0;
    
    document.addEventListener('touchend', function(event) {
        const now = Date.now();
        const target = event.target.closest('.new-absence-counter-btn');
        
        if (target) {
            if (now - lastTouchEnd <= 300) {
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();
                return false;
            }
            lastTouchEnd = now;
        }
    }, { passive: false, capture: true });

    // منع gesture zoom على الأزرار
    ['gesturestart', 'gesturechange', 'gestureend'].forEach(function(eventName) {
        document.addEventListener(eventName, function(e) {
            if (e.target.closest('.new-absence-counter-btn')) {
                e.preventDefault();
                e.stopPropagation();
            }
        }, { passive: false });
    });
    
    // منع double tap zoom على الأزرار
    document.addEventListener('touchstart', function(e) {
        if (e.target.closest('.new-absence-counter-btn')) {
            const now = Date.now();
            if (now - touchStartTime < 300) {
                e.preventDefault();
                e.stopPropagation();
            }
            touchStartTime = now;
        }
    }, { passive: false, capture: true });
})();

// Initialize absence calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all calculators
    setTimeout(() => {
        initAbsenceCalculator();
        initAbsenceLimitCalculator();
        
        // Update weekly absence percentage for all existing courses
        updateAllCoursesWeeklyAbsencePercentage();
        
        // Add event listener for add course form
        const addCourseForm = document.getElementById('add-course-form');
        if (addCourseForm) {
            // Removed event listener
            console.log('Form event listener added');
        }
        
        // Add click event listener to the button as well
        const addCourseBtn = document.getElementById('add-course-btn');
        if (addCourseBtn) {
            addCourseBtn.addEventListener('click', function(e) {
                e.preventDefault();
                addCourse(e);
            });
            console.log('Button event listener added');
        }
        
    // Add event listeners for input changes to update completion section
    const inputs = ['lectures-count', 'exercises-count', 'labs-count', 'course-weeks', 'lecture-hours', 'exercise-hours', 'lab-hours'];
    inputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) {
            input.addEventListener('input', function(e) {
                // Convert Arabic comma to dot on input for numeric fields
                if (e.target.value.includes('،')) {
                    e.target.value = e.target.value.replace(/،/g, '.');
                }
                console.log('تغيير في الحقل:', inputId, 'القيمة:', e.target.value);
                // updateCompletionSection();
            });
            input.addEventListener('change', function() {
                // updateCompletionSection();
            });
        }
    });
        
        // Add event listeners for absence input fields
        const absenceInputs = ['lecture-absence-hours', 'exercise-absence-hours', 'lab-absence-hours'];
        absenceInputs.forEach(inputId => {
            const input = document.getElementById(inputId);
            if (input) {
                input.addEventListener('input', updateAbsenceCalculations);
                input.addEventListener('change', updateAbsenceCalculations);
                
                // Convert Arabic comma to dot on input
                input.addEventListener('input', function(e) {
                    if (e.target.value.includes('،')) {
                        e.target.value = e.target.value.replace(/،/g, '.');
                    }
                });
            }
        });
        
        // Add event listeners for absence percentage fields
        const lecturesCount = parseInt(document.getElementById('lectures-count').value) || 0;
        const exercisesCount = parseInt(document.getElementById('exercises-count').value) || 0;
        const labsCount = parseInt(document.getElementById('labs-count').value) || 0;
        
        for (let i = 1; i <= lecturesCount; i++) {
            const absencePercentageElement = document.getElementById(`lecture-${i}-absence-percentage`);
            if (absencePercentageElement) {
                absencePercentageElement.addEventListener('input', updateCompletionSection);
                absencePercentageElement.addEventListener('change', updateCompletionSection);
                
                // Convert Arabic comma to dot on input
                absencePercentageElement.addEventListener('input', function(e) {
                    if (e.target.value.includes('،')) {
                        e.target.value = e.target.value.replace(/،/g, '.');
                    }
                });
            }
        }
        
        for (let i = 1; i <= exercisesCount; i++) {
            const absencePercentageElement = document.getElementById(`exercise-${i}-absence-percentage`);
            if (absencePercentageElement) {
                absencePercentageElement.addEventListener('input', updateCompletionSection);
                absencePercentageElement.addEventListener('change', updateCompletionSection);
                
                // Convert Arabic comma to dot on input
                absencePercentageElement.addEventListener('input', function(e) {
                    if (e.target.value.includes('،')) {
                        e.target.value = e.target.value.replace(/،/g, '.');
                    }
                });
            }
        }
        
        for (let i = 1; i <= labsCount; i++) {
            const absencePercentageElement = document.getElementById(`lab-${i}-absence-percentage`);
            if (absencePercentageElement) {
                absencePercentageElement.addEventListener('input', updateCompletionSection);
                absencePercentageElement.addEventListener('change', updateCompletionSection);
                
                // Convert Arabic comma to dot on input
                absencePercentageElement.addEventListener('input', function(e) {
                    if (e.target.value.includes('،')) {
                        e.target.value = e.target.value.replace(/،/g, '.');
                    }
                });
            }
        }
    }, 100);
});

// ===== ABSENCE CONTROL FUNCTIONS =====

// Load absence control for all courses
function loadAbsenceControl() {
    console.log('Loading absence control...');
    console.log('Current courses:', absenceCourses);
    console.log('Courses length:', absenceCourses.length);
    
    const absenceControlList = document.getElementById('absence-control-list');
    if (!absenceControlList) {
        console.error('عنصر absence-control-list غير موجود');
        return;
    }
    
    if (absenceCourses.length === 0) {
        console.log('No courses found, showing empty state');
        absenceControlList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-calendar-times"></i>
                <h4>لا توجد مواد للتحكم في الغياب</h4>
                <p>أضف مادة أولاً من قسم "إضافة مادة جديدة" لتتمكن من إدارة غيابك</p>
                <button onclick="document.getElementById('course-name').focus()" class="cta-btn">
                    <i class="fas fa-plus"></i> أضف مادة الآن
                </button>
            </div>
        `;
        return;
    }
    
    console.log('Creating control items for', absenceCourses.length, 'courses');
    absenceControlList.innerHTML = '';
    absenceCourses.forEach(course => {
        console.log('Creating control item for course:', course.name);
        const controlItem = createAbsenceControlItem(course);
        absenceControlList.appendChild(controlItem);
    });
    
    // Add event listeners for session absence inputs
    addSessionAbsenceListeners();
    console.log('Absence control loaded successfully');
}

// Create sessions table for detailed absence control
function createSessionsTable(course) {
    let tableHTML = `
        <div class="sessions-table-header">
            <div class="session-header-cell">يوم الجلسة</div>
            <div class="session-header-cell">الساعات</div>
            <div class="session-header-cell">نسبة الغياب</div>
            <div class="session-header-cell">الغياب الحالي</div>
        </div>
    `;
    
    // Add lectures sessions
    if (course.lectures && course.lectures.sessions && course.lectures.sessions.length > 0) {
        course.lectures.sessions.forEach((session, index) => {
            const maxAbsences = Math.floor(course.weeks * 0.25); // 25% of total weeks
            const currentAbsences = session.absenceCount || 0;
            
            tableHTML += `
                <div class="session-row">
                    <div class="session-cell session-name">${session.day || session.name}</div>
                    <div class="session-cell session-hours">${session.hours} ساعة</div>
                    <div class="session-cell session-percentage">${session.absencePercentage}%</div>
                           <div class="session-cell session-input">
                               <div class="absence-select-container">
                                   <select class="absence-select" onchange="updateAbsenceValue('${course.id}', 'lectures', ${index}, this.value)">
                                       ${Array.from({length: 36}, (_, i) => `
                                           <option value="${i}" ${i === currentAbsences ? 'selected' : ''}>${i}</option>
                                       `).join('')}
                                   </select>
                               </div>
                           </div>
                </div>
            `;
        });
    }
    
    // Add exercises sessions
    if (course.exercises && course.exercises.sessions && course.exercises.sessions.length > 0) {
        course.exercises.sessions.forEach((session, index) => {
            const maxAbsences = Math.floor(course.weeks * 0.25);
            const currentAbsences = session.absenceCount || 0;
            
            tableHTML += `
                <div class="session-row">
                    <div class="session-cell session-name">${session.day || session.name}</div>
                    <div class="session-cell session-hours">${session.hours} ساعة</div>
                    <div class="session-cell session-percentage">${session.absencePercentage}%</div>
                           <div class="session-cell session-input">
                               <div class="absence-select-container">
                                   <select class="absence-select" onchange="updateAbsenceValue('${course.id}', 'exercises', ${index}, this.value)">
                                       ${Array.from({length: 36}, (_, i) => `
                                           <option value="${i}" ${i === currentAbsences ? 'selected' : ''}>${i}</option>
                                       `).join('')}
                                   </select>
                               </div>
                           </div>
                </div>
            `;
        });
    }
    
    // Add labs sessions
    if (course.labs && course.labs.sessions && course.labs.sessions.length > 0) {
        course.labs.sessions.forEach((session, index) => {
            const maxAbsences = Math.floor(course.weeks * 0.25);
            const currentAbsences = session.absenceCount || 0;
            
            tableHTML += `
                <div class="session-row">
                    <div class="session-cell session-name">${session.day || session.name}</div>
                    <div class="session-cell session-hours">${session.hours} ساعة</div>
                    <div class="session-cell session-percentage">${session.absencePercentage}%</div>
                           <div class="session-cell session-input">
                               <div class="absence-select-container">
                                   <select class="absence-select" onchange="updateAbsenceValue('${course.id}', 'labs', ${index}, this.value)">
                                       ${Array.from({length: 36}, (_, i) => `
                                           <option value="${i}" ${i === currentAbsences ? 'selected' : ''}>${i}</option>
                                       `).join('')}
                                   </select>
                               </div>
                           </div>
                </div>
            `;
        });
    }
    
    return tableHTML;
}

// Add event listeners for session absence inputs
function addSessionAbsenceListeners() {
    const sessionInputs = document.querySelectorAll('.session-absence-input');
    sessionInputs.forEach(input => {
        input.addEventListener('input', function() {
            updateSessionAbsence(this);
        });
        input.addEventListener('change', function() {
            updateSessionAbsence(this);
        });
    });
}

// النظام المتكامل الجديد - تحديث الغياب الفوري
function updateSessionAbsence(input) {
    const courseId = input.dataset.courseId;
    const sessionType = input.dataset.sessionType;
    const sessionIndex = parseInt(input.dataset.sessionIndex);
    const absenceCount = parseInt(input.value) || 0;
    
    // البحث عن المادة
    const course = absenceCourses.find(c => c.id === courseId);
    if (!course) return;
    
    // تحديث عدد الغياب
    if (course[sessionType] && course[sessionType].sessions && course[sessionType].sessions[sessionIndex]) {
        course[sessionType].sessions[sessionIndex].absenceCount = absenceCount;
        
        // حفظ البيانات
        localStorage.setItem('absenceCourses', JSON.stringify(absenceCourses));
        
        // تحديث جميع الخانات فوراً
        updateAllStatsIntegrated(courseId);
        
        // تحديث قسم المقررات المسجلة أيضاً
        updateRegisteredCoursesDisplay();
        
        console.log(`تم تحديث الغياب: ${sessionType} جلسة ${sessionIndex} = ${absenceCount}`);
    }
}

// تحديث جميع الإحصائيات المتكاملة
function updateAllStatsIntegrated(courseId) {
    const course = absenceCourses.find(c => c.id === courseId);
    if (!course) return;
    
    // حساب الإحصائيات الجديدة
    const stats = calculateIntegratedStats(course);
    
    // تحديث الخانات في الواجهة
    updateStatsDisplayIntegrated(courseId, stats);
    
    // تحديث شريط التقدم
    updateProgressBarIntegrated(courseId, stats);
    
    // تحديث الحالة
    updateStatusDisplayIntegrated(courseId, stats);
}

// حساب الإحصائيات المتكاملة
function calculateIntegratedStats(course) {
    let totalAbsenceHours = 0;
    let totalSessionsPerWeek = 0;
    let totalWeeks = course.weeks;
    
    // حساب من المحاضرات
    if (course.lectures && course.lectures.sessions) {
        course.lectures.sessions.forEach(session => {
            totalAbsenceHours += (session.absenceCount || 0) * session.hours;
            totalSessionsPerWeek += 1;
        });
    }
    
    // حساب من التمارين
    if (course.exercises && course.exercises.sessions) {
        course.exercises.sessions.forEach(session => {
            totalAbsenceHours += (session.absenceCount || 0) * session.hours;
            totalSessionsPerWeek += 1;
        });
    }
    
    // حساب من المعامل
    if (course.labs && course.labs.sessions) {
        course.labs.sessions.forEach(session => {
            totalAbsenceHours += (session.absenceCount || 0) * session.hours;
            totalSessionsPerWeek += 1;
        });
    }
    
    // الحسابات النهائية
    const totalSessionsInSemester = totalSessionsPerWeek * totalWeeks;
    const totalHoursInSemester = totalSessionsPerWeek * totalWeeks * 1.5;
    const maxAbsenceSessions = Math.floor(totalSessionsInSemester * 0.25);
    
    // حساب عدد جلسات الغياب الفعلية (ليس الساعات)
    let usedAbsenceSessions = 0;
    if (course.lectures && course.lectures.sessions) {
        course.lectures.sessions.forEach(session => {
            usedAbsenceSessions += session.absenceCount || 0;
        });
    }
    if (course.exercises && course.exercises.sessions) {
        course.exercises.sessions.forEach(session => {
            usedAbsenceSessions += session.absenceCount || 0;
        });
    }
    if (course.labs && course.labs.sessions) {
        course.labs.sessions.forEach(session => {
            usedAbsenceSessions += session.absenceCount || 0;
        });
    }
    
    const remainingAbsenceSessions = Math.max(0, maxAbsenceSessions - usedAbsenceSessions);
    const absencePercentage = totalSessionsInSemester > 0 ? (usedAbsenceSessions / totalSessionsInSemester) * 100 : 0;
    
    // تحديد الحالة
    let status = 'safe';
    if (absencePercentage >= 25.00) {
        status = 'danger'; // حرمان من 25.00% فما فوق
    } else if (absencePercentage >= 20) {
        status = 'warning'; // تحذير أحمر من 20% إلى أقل من 25%
    } else if (absencePercentage >= 11) {
        status = 'safe-yellow'; // آمن أصفر من 11% إلى 19%
    } else {
        status = 'safe'; // آمن أخضر من 0% إلى 10%
    }
    
    return {
        totalHoursInSemester,
        totalSessionsInSemester,
        maxAbsenceSessions,
        usedAbsenceSessions,
        remainingAbsenceSessions,
        absencePercentage,
        status
    };
}

// تحديث عرض الإحصائيات المتكاملة
function updateStatsDisplayIntegrated(courseId, stats) {
    const controlItem = document.querySelector(`input[data-course-id="${courseId}"]`)?.closest('.absence-control-item');
    if (!controlItem) return;
    
    const statElements = controlItem.querySelectorAll('.absence-stat-value');
    if (statElements.length >= 5) {
        // إجمالي الساعات
        statElements[0].textContent = stats.totalHoursInSemester;
        
        // الحد الأقصى
        statElements[1].textContent = stats.maxAbsenceSessions;
        
        // المستخدم
        statElements[2].textContent = stats.usedAbsenceSessions;
        statElements[2].className = `absence-stat-value ${stats.status}`;
        
        // المتبقي
        statElements[3].textContent = stats.remainingAbsenceSessions;
        statElements[3].className = `absence-stat-value ${stats.status}`;
        
        // النسبة
        statElements[4].textContent = `${stats.absencePercentage.toFixed(2)}%`;
        statElements[4].className = `absence-stat-value ${stats.status}`;
    }
}

// تحديث شريط التقدم المتكامل
function updateProgressBarIntegrated(courseId, stats) {
    const controlItem = document.querySelector(`input[data-course-id="${courseId}"]`)?.closest('.absence-control-item');
    if (!controlItem) return;
    
    const progressBar = controlItem.querySelector('.absence-progress-fill');
    if (progressBar) {
        // حساب نسبة التعبئة بناءً على النسبة الفعلية
        const fillPercentage = Math.min(stats.absencePercentage, 100);
        progressBar.style.width = `${fillPercentage}%`;
        
        // تحديث اللون حسب المستوى
        progressBar.className = 'absence-progress-fill';
        if (stats.absencePercentage >= 25.00) {
            progressBar.classList.add('danger'); // حرمان من 25.00% فما فوق
        } else if (stats.absencePercentage >= 20) {
            progressBar.classList.add('warning'); // أحمر من 20% إلى أقل من 25%
        } else if (stats.absencePercentage >= 11) {
            progressBar.classList.add('safe-yellow'); // أصفر من 11% إلى 19%
        } else {
            progressBar.classList.add('safe'); // أخضر من 0% إلى 10%
        }
        
        console.log(`تم تحديث شريط التقدم: ${fillPercentage.toFixed(2)}% - اللون: ${progressBar.className}`);
    }
}

// تحديث عرض الحالة المتكاملة
function updateStatusDisplayIntegrated(courseId, stats) {
    const controlItem = document.querySelector(`input[data-course-id="${courseId}"]`)?.closest('.absence-control-item');
    if (!controlItem) return;
    
    const statusElement = controlItem.querySelector('.absence-control-status');
    if (statusElement) {
        let statusText = 'آمن';
        if (stats.status === 'danger') {
            // التحقق إذا كانت 25.00 بالضبط
            if (Math.abs(stats.absencePercentage - 25.00) < 0.01) {
                statusText = 'خلصت غياباتك';
            } else {
                statusText = 'حرمان!';
            }
        } else if (stats.status === 'warning') {
            statusText = 'تحذير!';
        }
        
        statusElement.className = `absence-control-status ${stats.status}`;
        statusElement.textContent = statusText;
    }
}

// دالة تحديث قيمة الغياب
function updateAbsenceValue(courseId, sessionType, sessionIndex, value) {
    console.log('Updating absence value:', courseId, sessionType, sessionIndex, value);
    
    // تحديث البيانات في النظام
    const course = absenceCourses.find(c => c.id === courseId);
    if (!course) {
        console.error('Course not found:', courseId);
        return;
    }
    
    // تحديث عدد الغياب
    if (course[sessionType] && course[sessionType].sessions && course[sessionType].sessions[sessionIndex]) {
        course[sessionType].sessions[sessionIndex].absenceCount = parseInt(value);
        
        // حفظ البيانات
        localStorage.setItem('absenceCourses', JSON.stringify(absenceCourses));
        
        // تحديث جميع الخانات فوراً
        updateAllStatsIntegrated(courseId);
        
        // تحديث قسم المقررات المسجلة أيضاً
        updateRegisteredCoursesDisplay();
        
        console.log(`تم تحديث الغياب: ${sessionType} جلسة ${sessionIndex} = ${value}`);
    }
}

// تحديث عرض المقررات المسجلة بناءً على بيانات الغياب
function updateRegisteredCoursesDisplay() {
    const coursesContainer = document.getElementById('courses-container');
    if (!coursesContainer) return;
    
    // إعادة تحميل المقررات مع البيانات المحدثة
    loadCourses();
    
    console.log('تم تحديث عرض المقررات المسجلة بناءً على بيانات الغياب');
}

// تم استبدال هذه الدالة بالنظام المتكامل الجديد

// Create absence control item for a course
function createAbsenceControlItem(course) {
    console.log('Creating absence control item for course:', course.name);
    console.log('Course data:', course);
    
    // Calculate totals
    let totalSessionsPerWeek = 0;
    let totalWeeks = course.weeks;
    
    // Count sessions per week
    if (course.lectures && course.lectures.sessions) {
        totalSessionsPerWeek += course.lectures.sessions.length;
        console.log('Lectures sessions:', course.lectures.sessions.length);
    }
    if (course.exercises && course.exercises.sessions) {
        totalSessionsPerWeek += course.exercises.sessions.length;
        console.log('Exercises sessions:', course.exercises.sessions.length);
    }
    if (course.labs && course.labs.sessions) {
        totalSessionsPerWeek += course.labs.sessions.length;
        console.log('Labs sessions:', course.labs.sessions.length);
    }
    
    console.log('Total sessions per week:', totalSessionsPerWeek);
    
    const totalSessionsInSemester = totalSessionsPerWeek * totalWeeks;
    const totalHoursInSemester = totalSessionsPerWeek * totalWeeks * (course.lectures?.hoursPerSession || 1.5);
    const maxAbsenceSessions = Math.floor(totalSessionsInSemester * 0.25);
    
    // Calculate current absence
    let totalAbsenceHours = 0;
    if (course.lectures && course.lectures.sessions) {
        course.lectures.sessions.forEach(session => {
            totalAbsenceHours += (session.absenceCount || 0) * session.hours;
        });
    }
    if (course.exercises && course.exercises.sessions) {
        course.exercises.sessions.forEach(session => {
            totalAbsenceHours += (session.absenceCount || 0) * session.hours;
        });
    }
    if (course.labs && course.labs.sessions) {
        course.labs.sessions.forEach(session => {
            totalAbsenceHours += (session.absenceCount || 0) * session.hours;
        });
    }
    
    // حساب عدد جلسات الغياب الفعلية (ليس الساعات)
    let usedAbsenceSessions = 0;
    if (course.lectures && course.lectures.sessions) {
        course.lectures.sessions.forEach(session => {
            usedAbsenceSessions += session.absenceCount || 0;
        });
    }
    if (course.exercises && course.exercises.sessions) {
        course.exercises.sessions.forEach(session => {
            usedAbsenceSessions += session.absenceCount || 0;
        });
    }
    if (course.labs && course.labs.sessions) {
        course.labs.sessions.forEach(session => {
            usedAbsenceSessions += session.absenceCount || 0;
        });
    }
    
    const remainingAbsenceSessions = Math.max(0, maxAbsenceSessions - usedAbsenceSessions);
    const absencePercentage = totalSessionsInSemester > 0 ? (usedAbsenceSessions / totalSessionsInSemester) * 100 : 0;
    
    // Determine status
    let status = 'safe';
    if (absencePercentage >= 25.00) {
        status = 'danger'; // حرمان من 25.00% فما فوق
    } else if (absencePercentage >= 20) {
        status = 'warning'; // تحذير أحمر من 20% إلى أقل من 25%
    } else if (absencePercentage >= 11) {
        status = 'safe-yellow'; // آمن أصفر من 11% إلى 19%
    } else {
        status = 'safe'; // آمن أخضر من 0% إلى 10%
    }
    
    // تحديد نص الحالة
    let statusText = 'آمن';
    if (status === 'danger') {
        // التحقق إذا كانت 25.00 بالضبط
        if (Math.abs(absencePercentage - 25.00) < 0.01) {
            statusText = 'خلصت غياباتك';
        } else {
            statusText = 'حرمان!';
        }
    } else if (status === 'warning') {
        statusText = 'تحذير!';
    }
    
    const controlItem = document.createElement('div');
    controlItem.className = 'absence-control-item';
    controlItem.innerHTML = `
        <div class="absence-control-header">
            <h5 class="absence-control-title">${course.name}</h5>
            <span class="absence-control-status ${status}">${statusText}</span>
        </div>
        
        <div class="absence-control-inputs">
            <div class="absence-sessions-table">
                <h6 class="sessions-table-title">جدول الجلسات والغياب</h6>
                <div class="sessions-table">
                    ${createSessionsTable(course)}
                </div>
            </div>
        </div>
        
        <div class="absence-summary-card">
            <h6 class="absence-summary-title">ملخص الغياب</h6>
            <div class="absence-summary-stats">
                <div class="absence-stat">
                    <div class="absence-stat-label">إجمالي الساعات</div>
                    <div class="absence-stat-value">${totalHoursInSemester}</div>
                </div>
                <div class="absence-stat">
                    <div class="absence-stat-label">الحد الأقصى</div>
                    <div class="absence-stat-value">${maxAbsenceSessions}</div>
                </div>
                <div class="absence-stat">
                    <div class="absence-stat-label">المستخدم</div>
                    <div class="absence-stat-value ${status}">${usedAbsenceSessions}</div>
                </div>
                <div class="absence-stat">
                    <div class="absence-stat-label">المتبقي</div>
                    <div class="absence-stat-value ${status}">${remainingAbsenceSessions}</div>
                </div>
                <div class="absence-stat">
                    <div class="absence-stat-label">النسبة</div>
                    <div class="absence-stat-value ${status}">${absencePercentage.toFixed(2)}%</div>
                </div>
            </div>
            <div class="absence-progress-bar">
                <div class="absence-progress-fill ${status}" style="width: ${Math.min(absencePercentage, 100)}%"></div>
            </div>
        </div>
        
        <div class="absence-control-actions">
            <button class="absence-control-btn primary" onclick="updateCourseAbsence('${course.id}')">
                <i class="fas fa-save"></i> حفظ التغييرات
            </button>
            <button class="absence-control-btn secondary" onclick="resetCourseAbsence('${course.id}')">
                <i class="fas fa-undo"></i> إعادة تعيين
            </button>
            <button class="absence-control-btn danger" onclick="deleteCourse('${course.id}')">
                <i class="fas fa-trash"></i> حذف المادة
            </button>
        </div>
    `;
    
    // إضافة مستمعات الأحداث للنظام المتكامل
    const inputs = controlItem.querySelectorAll('input[type="number"]');
    inputs.forEach(input => {
        input.addEventListener('input', () => updateSessionAbsence(input));
    });
    
    // تحديث الإحصائيات مرة واحدة عند الإنشاء
    setTimeout(() => {
        updateAllStatsIntegrated(course.id);
    }, 100);
    
    console.log('Absence control item created successfully for:', course.name);
    console.log('Control item HTML length:', controlItem.innerHTML.length);
    
    return controlItem;
}

// Update course absence data
function updateCourseAbsence(courseId) {
    const course = absenceCourses.find(c => c.id === courseId);
    if (!course) return;
    
    // Save to localStorage
    saveCourses();
    
    // Reload courses list
    loadCourses();
    
    // Show success message
    showToast(`تم تحديث غياب مادة "${course.name}" بنجاح! 📊`, 'success');
}


// Reset course absence data
function resetCourseAbsence(courseId) {
    const course = absenceCourses.find(c => c.id === courseId);
    if (!course) return;
    
    // Reset absence count for all sessions
    if (course.lectures && course.lectures.sessions) {
        course.lectures.sessions.forEach(session => {
            session.absenceCount = 0;
        });
    }
    if (course.exercises && course.exercises.sessions) {
        course.exercises.sessions.forEach(session => {
            session.absenceCount = 0;
        });
    }
    if (course.labs && course.labs.sessions) {
        course.labs.sessions.forEach(session => {
            session.absenceCount = 0;
        });
    }
    
    // Save to localStorage
    localStorage.setItem('absenceCourses', JSON.stringify(absenceCourses));
    
    // Reload absence control
    loadAbsenceControl();
    
    // Show success message
    showToast(`تم إعادة تعيين غياب مادة "${course.name}" بنجاح! 🔄`, 'success');
}

// إضافة رسالة تأكيد النظام المتكامل
setTimeout(() => {
    console.log('🔥 النظام المتكامل جاهز للاستخدام!');
    console.log('✅ الخانات ستتحدث تلقائياً عند إضافة الغياب');
    console.log('✅ جميع الحسابات مترابطة ومتزامنة');
    console.log('✅ النظام يعمل بكفاءة عالية');
    console.log('🔧 تم تصحيح حساب النسب - الآن يعتمد على عدد الجلسات وليس الساعات');
    console.log('🔗 تم ربط قسم التحكم بالغياب مع قسم المقررات المسجلة');
    console.log('🎯 حقل الغياب أصبح select يختار من 0 إلى 35');
    console.log('📊 مستويات الحالة الجديدة:');
    console.log('   🟢 0-10%: آمن (أخضر)');
    console.log('   🟡 11-19%: آمن (أصفر)');
    console.log('   🔴 20-25%: تحذير (أحمر)');
    console.log('   🔴 25.01%+: حرمان (أحمر)');
}, 2000);

// ===== NEW ABSENCE CALCULATOR =====
let newAbsenceCourses = JSON.parse(localStorage.getItem('newAbsenceCourses')) || [];

// Track shown alerts to prevent duplicate popups
let shownAlerts = JSON.parse(localStorage.getItem('absenceShownAlerts')) || {};

// Function to clear all alerts (for testing)
window.clearAbsenceAlerts = function() {
    shownAlerts = {};
    localStorage.removeItem('absenceShownAlerts');
    console.log('تم حذف جميع التنبيهات');
};

// Initialize new absence calculator
function initNewAbsenceCalculator() {
    const form = document.getElementById('new-absence-form');
    if (form) {
        form.addEventListener('submit', handleNewAbsenceFormSubmit);
    }
    
    // Initialize hours dropdown (1 to 20)
    initializeHoursDropdown();
    
    renderNewAbsenceCourses();
}

// Initialize hours dropdown with options from 1 to 20
function initializeHoursDropdown() {
    const hoursSelect = document.getElementById('new-course-hours-per-week');
    if (!hoursSelect) return;
    
    // Clear existing options except the first one
    while (hoursSelect.options.length > 1) {
        hoursSelect.remove(1);
    }
    
    // Add options from 1 to 20
    for (let i = 1; i <= 20; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `${i} ${i === 1 ? '' : ''}`;
        hoursSelect.appendChild(option);
    }
}

// Handle form submission
function handleNewAbsenceFormSubmit(e) {
    e.preventDefault();
    
    const courseName = document.getElementById('new-course-name').value.trim();
    const hoursPerWeek = parseFloat(document.getElementById('new-course-hours-per-week').value);
    
    if (!courseName || !hoursPerWeek || hoursPerWeek <= 0) {
        showToast('يرجى إدخال جميع البيانات بشكل صحيح', 'error');
        return;
    }
    
    // Calculate absence percentage per hour
    // نسبة غياب الساعة الواحدة = 6.25 ÷ عدد الساعات الأسبوعية
    // هذه المعادلة تعطي نسبة الغياب لكل ساعة غياب من إجمالي المقرر
    // مثال: مادة 4 ساعات → 6.25 ÷ 4 = 1.5625%
    // مثال: مادة 6 ساعات → 6.25 ÷ 6 = 1.04167%
    const absencePercentagePerHour = 6.25 / hoursPerWeek;
    
    // Create course object
    const course = {
        id: Date.now().toString(),
        name: courseName,
        hoursPerWeek: hoursPerWeek,
        absencePercentagePerHour: absencePercentagePerHour,
        currentAbsenceHours: 0,
        createdAt: new Date().toISOString()
    };
    
    // Add to array
    newAbsenceCourses.push(course);
    
    // Save to localStorage
    localStorage.setItem('newAbsenceCourses', JSON.stringify(newAbsenceCourses));
    
    // Clear form
    document.getElementById('new-absence-form').reset();
    
    // Render courses
    renderNewAbsenceCourses();
    
    // Show success message
    showToast(`تم إضافة المادة "${courseName}" بنجاح! ✅`, 'success');
}

// Render all courses
function renderNewAbsenceCourses() {
    const container = document.getElementById('new-absence-courses-list');
    if (!container) return;
    
    if (newAbsenceCourses.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-calendar-plus"></i>
                <h4>لا توجد مواد بعد</h4>
                <p>أضف مادة جديدة لبدء متابعة غيابك</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = newAbsenceCourses.map(course => createCourseCard(course)).join('');
    
    // Add event listeners and check alerts on first render
    newAbsenceCourses.forEach(course => {
        // Delete button
        const deleteBtn = document.getElementById(`delete-course-${course.id}`);
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => deleteCourse(course.id));
        }
        
        // Counter buttons
        const minusBtn = document.getElementById(`minus-btn-${course.id}`);
        const plusBtn = document.getElementById(`plus-btn-${course.id}`);
        
        if (minusBtn) {
            let touchStartTime = 0;
            const handleMinus = (e) => {
                e.preventDefault();
                e.stopPropagation();
                e.cancelBubble = true;
                const now = Date.now();
                if (now - touchStartTime < 100) return;
                touchStartTime = now;
                updateAbsenceHours(course.id, -1);
                return false;
            };
            minusBtn.addEventListener('touchstart', handleMinus, { passive: false, capture: true });
            minusBtn.addEventListener('touchend', (e) => {
                e.preventDefault();
                e.stopPropagation();
            }, { passive: false, capture: true });
            minusBtn.addEventListener('click', handleMinus);
        }
        if (plusBtn) {
            let touchStartTime = 0;
            const handlePlus = (e) => {
                e.preventDefault();
                e.stopPropagation();
                e.cancelBubble = true;
                const now = Date.now();
                if (now - touchStartTime < 100) return;
                touchStartTime = now;
                updateAbsenceHours(course.id, 1);
                return false;
            };
            plusBtn.addEventListener('touchstart', handlePlus, { passive: false, capture: true });
            plusBtn.addEventListener('touchend', (e) => {
                e.preventDefault();
                e.stopPropagation();
            }, { passive: false, capture: true });
            plusBtn.addEventListener('click', handlePlus);
        }
    });
}

// Create course card HTML
function createCourseCard(course) {
    // Calculate values
    const totalHours = course.hoursPerWeek * 16; // Assuming 16 weeks semester
    const absenceLimit = totalHours * 0.25; // 25% of total hours
    const remainingHours = Math.max(0, absenceLimit - course.currentAbsenceHours);
    
    // Calculate current absence percentage
    const absencePercentage = totalHours > 0 ? (course.currentAbsenceHours / totalHours) * 100 : 0;
    
    // Determine status based on new rules
    let statusClass = 'safe';
    let statusText = 'في أمان';
    
    if (absencePercentage >= 25.00) {
        statusClass = 'danger';
        // التحقق إذا كانت 25.00 بالضبط
        if (Math.abs(absencePercentage - 25.00) < 0.01) {
            statusText = 'خلصت غياباتك';
        } else {
            statusText = 'حرمان';
        }
    } else if (absencePercentage >= 21) {
        statusClass = 'danger';
        statusText = 'تحذير';
    } else if (absencePercentage >= 10) {
        statusClass = 'warning-yellow';
        statusText = 'في أمان';
    } else {
        statusClass = 'safe';
        statusText = 'في أمان';
    }
    
    // Progress bar percentage (should be actual percentage, not scaled)
    const progressPercentage = Math.min(100, absencePercentage);
    const markerPosition = 75; // 25% marker from right in RTL (75% from left)
    
    return `
        <div class="new-absence-course-card">
            <div class="new-absence-course-header">
                <div class="new-absence-course-title-section">
                    <div class="new-absence-course-title">${course.name}</div>
                </div>
                <button class="new-absence-delete-btn" id="delete-course-${course.id}" title="حذف المادة">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            
            <div class="new-absence-percentage-section">
                <div class="new-absence-percentage-label">نسبة الغياب من إجمالي المقرر</div>
                <div class="new-absence-percentage-row">
                    <span class="new-absence-status-text ${statusClass}">${statusText}</span>
                    <div class="new-absence-percentage-value ${statusClass}">${absencePercentage.toFixed(2)}%</div>
                </div>
                <div class="new-absence-hour-percentage">
                    <span class="hour-percentage-label">نسبة غياب الساعة:</span>
                    <span class="hour-percentage-value">${course.absencePercentagePerHour.toFixed(3)}%</span>
                </div>
                <div class="new-absence-progress-container">
                    <div class="new-absence-progress-bar ${statusClass}" style="width: ${progressPercentage}%"></div>
                    <div class="new-absence-progress-marker" style="right: 25%"></div>
                </div>
            </div>
            
            <div class="new-absence-counter-section">
                <div class="new-absence-counter-title">ساعات غيابك الحالية</div>
                <div class="new-absence-counter-subtitle">عدل ساعات غيابك</div>
                <div class="new-absence-counter">
                    <button class="new-absence-counter-btn" id="minus-btn-${course.id}">
                        <i class="fas fa-minus"></i>
                    </button>
                    <div class="new-absence-counter-value" id="counter-value-${course.id}">${course.currentAbsenceHours}</div>
                    <button class="new-absence-counter-btn plus-btn" id="plus-btn-${course.id}">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </div>
            
            <div class="new-absence-summary-section">
                <div class="new-absence-summary-card">
                    <div class="new-absence-summary-label">إجمالي الساعات</div>
                    <div class="new-absence-summary-value">
                        ${totalHours}
                        <i class="fas fa-book"></i>
                    </div>
                </div>
                <div class="new-absence-summary-card">
                    <div class="new-absence-summary-label">حد الغياب</div>
                    <div class="new-absence-summary-value">
                        ${absenceLimit.toFixed(1)}
                        <i class="fas fa-check-circle"></i>
                    </div>
                </div>
                <div class="new-absence-summary-card">
                    <div class="new-absence-summary-label">الساعات المتبقية</div>
                    <div class="new-absence-summary-value">
                        ${remainingHours.toFixed(1)}
                        <i class="fas fa-clock"></i>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Track if alert is currently showing to prevent duplicates
let currentAlertShowing = false;
let absenceAlertTimer = null;

// Show absence alert popup
// دالة تشغيل الإشعارات الصوتية عند الخطورة
function playAbsenceAlertSound(alertType) {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        let frequency = 400; // تردد الصوت الأساسي
        let duration = 0.2; // مدة الصوت بالثواني
        let beeps = 1; // عدد النغمات
        
        // تحديد نوع الصوت حسب مستوى الخطورة
        if (alertType === '25' || alertType === 'danger') {
            // صوت خطير (حرمان) - نغمات عالية متتالية
            frequency = 600;
            duration = 0.15;
            beeps = 3;
        } else if (alertType === '20' || alertType === 'warning-high') {
            // صوت تحذير قوي (20-25%)
            frequency = 500;
            duration = 0.2;
            beeps = 2;
        } else if (alertType === '10' || alertType === 'warning') {
            // صوت تحذير خفيف (10-20%)
            frequency = 400;
            duration = 0.25;
            beeps = 1;
        }
        
        // تشغيل النغمات
        for (let i = 0; i < beeps; i++) {
            setTimeout(() => {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.value = frequency;
                oscillator.type = 'sine';
                
                // تطبيق envelope للتأثير الطبيعي
                const now = audioContext.currentTime;
                gainNode.gain.setValueAtTime(0, now);
                gainNode.gain.linearRampToValueAtTime(0.3, now + 0.01);
                gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);
                
                oscillator.start(now);
                oscillator.stop(now + duration);
            }, i * (duration * 1000 + 50)); // تأخير بين النغمات
        }
    } catch (error) {
        // إذا فشل Web Audio API، استخدم صوت بديل بسيط
        console.log('Web Audio API not available, using fallback sound');
        // يمكن إضافة ملف صوتي بديل هنا لاحقاً
    }
}

function showAbsenceAlert(courseName, percentage, alertType) {
    // Prevent showing multiple alerts at the same time
    if (currentAlertShowing) {
        return;
    }
    
    currentAlertShowing = true;
    
    // تشغيل صوت التنبيه
    playAbsenceAlertSound(alertType);
    
    // Clear any existing timer
    if (absenceAlertTimer) {
        clearTimeout(absenceAlertTimer);
    }
    
    // Determine message and icon based on alert type
    let message = '';
    let icon = '';
    let popupClass = '';
    
    if (alertType === '10') {
        message = 'انتبه لغيابك';
        icon = 'fa-exclamation-triangle';
        popupClass = 'warning';
    } else if (alertType === '20') {
        message = 'انتبه لغيابك';
        icon = 'fa-exclamation-circle';
        popupClass = 'warning';
    } else if (alertType === '25') {
        message = 'خلصت غياباتك انتبه لا تنحرم';
        icon = 'fa-exclamation-triangle';
        popupClass = 'danger';
    }
    
    // Create popup HTML
    const popupHTML = `
        <div class="absence-alert-overlay" id="absence-alert-overlay">
            <div class="absence-alert-popup ${popupClass}">
                <div class="absence-alert-icon">
                    <i class="fas ${icon}"></i>
                </div>
                <div class="absence-alert-content">
                    <h3>${courseName}</h3>
                    <p>${message} <i class="fas fa-heart" style="color: white; margin-right: 5px; font-size: 1.2em;"></i></p>
                    <p style="font-size: 1rem; opacity: 0.9;">نسبة الغياب: ${percentage.toFixed(3)}%</p>
                </div>
                <div class="absence-alert-actions">
                    <button class="absence-alert-btn" onclick="closeAbsenceAlert()">
                        <i class="fas fa-check"></i>
                        <span>فهمت</span>
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Remove any existing alert first
    const existingAlert = document.getElementById('absence-alert-overlay');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    // Add to body
    document.body.insertAdjacentHTML('beforeend', popupHTML);
    
    // Prevent closing on overlay click - user must click "فهمت" button
    // Only auto-close after timer
    const overlay = document.getElementById('absence-alert-overlay');
    if (overlay) {
        // Prevent clicks on popup from closing it
        const popup = overlay.querySelector('.absence-alert-popup');
        if (popup) {
            popup.addEventListener('click', function(e) {
                e.stopPropagation();
            });
        }
        
        // Auto close after 11 seconds
        absenceAlertTimer = setTimeout(() => {
            closeAbsenceAlert();
        }, 5000);
    }
}

// Close absence alert (make it global for onclick handler)
window.closeAbsenceAlert = function() {
    const overlay = document.getElementById('absence-alert-overlay');
    if (overlay) {
        overlay.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            overlay.remove();
            currentAlertShowing = false;
        }, 300);
    }
    
    // Clear timer
    if (absenceAlertTimer) {
        clearTimeout(absenceAlertTimer);
        absenceAlertTimer = null;
    }
};

// Check and show alerts based on absence percentage (for initial load)
function checkAbsenceAlerts(courseId, oldPercentage = null) {
    const course = newAbsenceCourses.find(c => c.id === courseId);
    if (!course) return;
    
    // Calculate current absence percentage
    const totalHours = course.hoursPerWeek * 16; // Assuming 16 weeks semester
    const absencePercentage = totalHours > 0 ? (course.currentAbsenceHours / totalHours) * 100 : 0;
    
    // Round to 3 decimal places for accurate comparison
    const roundedPercentage = Math.round(absencePercentage * 1000) / 1000;
    
    // Only check on initial load (when oldPercentage is null)
    if (oldPercentage !== null) return;
    
    // Check for 25% threshold (highest priority) - check if >= 25%
    if (roundedPercentage >= 25) {
        const alertKey = `${course.name}_25`;
        if (!shownAlerts[alertKey]) {
            showAbsenceAlert(course.name, absencePercentage, '25');
            return; // Don't show other alerts if at 25%
        }
    }
    
    // Check for 20% threshold (only if not already at 25%) - check if >= 20%
    if (roundedPercentage >= 20 && roundedPercentage < 25) {
        const alertKey = `${course.name}_20`;
        if (!shownAlerts[alertKey]) {
            showAbsenceAlert(course.name, absencePercentage, '20');
            return; // Don't show 10% alert if at 20%
        }
    }
    
    // Check for 10% threshold (only if not already shown) - check if >= 10%
    if (roundedPercentage >= 10 && roundedPercentage < 20) {
        const alertKey = `${course.name}_10`;
        if (!shownAlerts[alertKey]) {
            showAbsenceAlert(course.name, absencePercentage, '10');
            return;
        }
    }
}

// Update absence hours
function updateAbsenceHours(courseId, change) {
    const course = newAbsenceCourses.find(c => c.id === courseId);
    if (!course) return;
    
    // Store old value for comparison
    const oldValue = course.currentAbsenceHours;
    const newValue = Math.max(0, course.currentAbsenceHours + change);
    course.currentAbsenceHours = newValue;
    
    // Calculate percentages
    const totalHours = course.hoursPerWeek * 16;
    const oldPercentage = totalHours > 0 ? (oldValue / totalHours) * 100 : 0;
    const newPercentage = totalHours > 0 ? (newValue / totalHours) * 100 : 0;
    
    // Round percentages for accurate comparison (3 decimal places)
    const oldPercentageRounded = Math.round(oldPercentage * 1000) / 1000;
    const newPercentageRounded = Math.round(newPercentage * 1000) / 1000;
    
    // Save to localStorage
    localStorage.setItem('newAbsenceCourses', JSON.stringify(newAbsenceCourses));
    
    // Check for danger states and play sound when crossing thresholds (only when increasing)
    if (change > 0) {
        // فقط عند زيادة الغياب
        if (newPercentage >= 25.00 && oldPercentage >= 25.00) {
            // بالفعل فوق 25% وتحديث آخر يزيد الغياب - صوت خطير مستمر
            playAbsenceAlertSound('danger');
        }
        // الصوت عند عبور العتبات (10%, 20%, 25%) سيتم تشغيله في showAbsenceAlert
    }
    
    // Re-render courses first
    renderNewAbsenceCourses();
    
    // Check for alerts when changing (increase or decrease)
    // Show alert whenever we cross a threshold (10%, 20%, 25%)
    setTimeout(() => {
        // Get fresh course data after render
        const currentCourse = newAbsenceCourses.find(c => c.id === courseId);
        if (!currentCourse) return;
        
        // Calculate current percentage
        const currentTotalHours = currentCourse.hoursPerWeek * 16;
        const currentAbsencePercent = currentTotalHours > 0 ? (currentCourse.currentAbsenceHours / currentTotalHours) * 100 : 0;
        const currentPercentRounded = Math.round(currentAbsencePercent * 1000) / 1000;
        
        // Check if we crossed thresholds by comparing old and new percentages
        const crossed25 = oldPercentageRounded < 25 && currentPercentRounded >= 25;
        const crossed20 = oldPercentageRounded < 20 && currentPercentRounded >= 20 && currentPercentRounded < 25;
        const crossed10 = oldPercentageRounded < 10 && currentPercentRounded >= 10 && currentPercentRounded < 20;
        
        // Show alerts whenever we cross a threshold (every time, not just once)
        if (crossed25) {
            showAbsenceAlert(currentCourse.name, currentAbsencePercent, '25');
        } else if (crossed20) {
            showAbsenceAlert(currentCourse.name, currentAbsencePercent, '20');
        } else if (crossed10) {
            showAbsenceAlert(currentCourse.name, currentAbsencePercent, '10');
        }
    }, 400);
    
    // Add shake animation when increasing
    if (change > 0) {
        setTimeout(() => {
            const counterValue = document.getElementById(`counter-value-${courseId}`);
            if (counterValue) {
                counterValue.classList.add('shake');
                setTimeout(() => {
                    counterValue.classList.remove('shake');
                }, 500);
            }
        }, 50);
    }
}

// Delete course
function deleteCourse(courseId) {
    if (!confirm('هل أنت متأكد من حذف هذه المادة؟')) return;
    
    newAbsenceCourses = newAbsenceCourses.filter(c => c.id !== courseId);
    
    // Save to localStorage
    localStorage.setItem('newAbsenceCourses', JSON.stringify(newAbsenceCourses));
    
    // Re-render courses
    renderNewAbsenceCourses();
    
    // Show success message
    showToast('تم حذف المادة بنجاح! 🗑️', 'success');
}


// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNewAbsenceCalculator);
} else {
    initNewAbsenceCalculator();
}
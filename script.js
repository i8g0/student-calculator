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
                <span class="course-weight">${type === 'rate' ? '3' : '3'} ساعات</span>
                </div>
                <div class="course-inputs">
                    <div class="form-group">
                    <label for="${type}-course-${i}-name">
                        <i class="fas fa-book"></i>
                        اسم المادة
                        </label>
                    <input type="text" id="${type}-course-${i}-name" required>
                    </div>
                    <div class="form-group">
                    <label for="${type}-course-${i}-grade">
                            <i class="fas fa-star"></i>
                        الدرجة (من 5)
                        </label>
                    <input type="number" id="${type}-course-${i}-grade" min="0" max="5" step="0.01" required>
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
}

function handleCumulativeCalculation(e) {
    e.preventDefault();
    
    const prevHours = parseFloat(document.getElementById('prev-hours').value);
    const prevGpa = parseFloat(document.getElementById('prev-gpa').value);
    
    if (isNaN(prevHours) || isNaN(prevGpa)) {
        showToast('يرجى ملء جميع الحقول المطلوبة', 'error');
            return;
        }
        
    // Get course grades
    const courseInputs = document.querySelectorAll('#cumulative-courses .course-item');
    const courses = [];
    
    courseInputs.forEach((course, index) => {
        const name = course.querySelector(`#cumulative-course-${index + 1}-name`).value;
        const grade = parseFloat(course.querySelector(`#cumulative-course-${index + 1}-grade`).value);
        
        if (name && !isNaN(grade)) {
            courses.push({ name, grade, hours: 3 });
        }
    });
    
    if (courses.length === 0) {
        showToast('يرجى إدخال بيانات المواد', 'error');
        return;
    }
    
    // Calculate cumulative GPA
    const result = calculateCumulativeGPA(prevHours, prevGpa, courses);
    displayCumulativeResult(result);
    
    // Save calculation
    saveCalculation({
        type: 'cumulative',
        prevHours,
        prevGpa,
        courses,
        result,
        timestamp: new Date().toISOString()
    });
    
    showToast('تم حساب المعدل التراكمي بنجاح! 📊', 'success');
}

function handleSemesterCalculation(e) {
    e.preventDefault();
    
    // Get course grades
    const courseInputs = document.querySelectorAll('#semester-courses .course-item');
    const courses = [];
    
    courseInputs.forEach((course, index) => {
        const name = course.querySelector(`#semester-course-${index + 1}-name`).value;
        const grade = parseFloat(course.querySelector(`#semester-course-${index + 1}-grade`).value);
        
        if (name && !isNaN(grade)) {
            courses.push({ name, grade, hours: 3 });
        }
    });
    
    if (courses.length === 0) {
        showToast('يرجى إدخال بيانات المواد', 'error');
        return;
    }
    
    // Calculate semester GPA
    const result = calculateSemesterGPA(courses);
    displaySemesterResult(result);
    
    // Save calculation
    saveCalculation({
        type: 'semester',
        courses,
        result,
        timestamp: new Date().toISOString()
    });
    
    showToast('تم حساب المعدل الفصلي بنجاح! 🎓', 'success');
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
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
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
            labels: ['متوسط الريت', 'متوسط الفصلي', 'متوسط التراكمي'],
            datasets: [{
                label: 'المتوسط',
                data: [avgRate, avgSemester, avgGpa],
                backgroundColor: ['#1a73e8', '#34c0eb', '#ffb300'],
                borderColor: ['#1557b0', '#2ba8d1', '#e6a700'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
            animation: { duration: 700 },
            scales: { y: { beginAtZero: true, max: 5, stepSize: 1 } }
        }
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
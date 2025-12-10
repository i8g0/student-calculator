
let currentTheme = localStorage.getItem('theme') || 'light';
let calculations = JSON.parse(localStorage.getItem('calculations')) || [];
let currentTab = 'rate';
let summaryBarChart = null;
let rateGradePie = null;
let rateBarChart = null;


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


document.addEventListener('DOMContentLoaded', function() {
    initializeApp();

    const ctaBtn = document.querySelector('.cta-btn');
    if (ctaBtn) {
        ctaBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.getElementById('rate');
            if (target) {
                const navbar = document.querySelector('.navbar');
                const navHeight = navbar ? navbar.offsetHeight : 0;
                const extraOffset = 150;
                const targetPos = target.getBoundingClientRect().top + window.pageYOffset - navHeight - extraOffset;
                window.scrollTo({ top: targetPos, behavior: 'smooth' });
            }
        });
    }
});

function initializeApp() {

    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }, 2000);


    setTheme(currentTheme);


    initParticles();


    initCharts();


    initEventListeners();


    initForms();


    setTimeout(() => {
        createCourseSearchField();
        setupCourseSearchEvents();
    }, 1000);


    updateAnalytics();


    showToast('مرحباً بك في حاسبة الريت الذكية! 🚀', 'info');
}


function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    currentTheme = theme;
    localStorage.setItem('theme', theme);


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


const savedTheme = localStorage.getItem('theme');
if (savedTheme && themes.includes(savedTheme)) {
    document.body.classList.add(savedTheme);
    currentThemeIdx = themes.indexOf(savedTheme);
} else {
    document.body.classList.add('theme-dark');
    currentThemeIdx = 0;
}


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


function initTabs() {
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.dataset.tab;
            switchTab(tabId);
        });
    });
}

function switchTab(tabId) {

    tabBtns.forEach(btn => btn.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));


    document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
    document.getElementById(tabId).classList.add('active');

    currentTab = tabId;


    if (mobileMenu.classList.contains('active')) {
        mobileMenu.classList.remove('active');
    }
}


function initMobileMenu() {
    menuToggle.addEventListener('click', () => {
        mobileMenu.classList.add('active');
    });

    closeMenu.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
    });


    document.addEventListener('click', (e) => {
        if (!mobileMenu.contains(e.target) && !menuToggle.contains(e.target)) {
            mobileMenu.classList.remove('active');
        }
    });


    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const href = item.getAttribute('href');
            const tabId = href.substring(1);
            switchTab(tabId);
        });
    });
}


function initForms() {

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


    const scienceCollegeForm = document.getElementById('science-college-form');
    if (scienceCollegeForm) {
        scienceCollegeForm.addEventListener('submit', handleScienceCollegeCalculation);
    }


    const appliedCollegeForm = document.getElementById('applied-college-form');
    if (appliedCollegeForm) {
        appliedCollegeForm.addEventListener('submit', handleAppliedCollegeCalculation);
    }


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


    if (rateNumInput) createCourseInputs(rateCoursesContainer, parseInt(rateNumInput.value) || 2, 'rate');
    if (cumulativeNumInput) createCourseInputs(cumulativeCoursesContainer, parseInt(cumulativeNumInput.value) || 2, 'cumulative');
    if (semesterNumInput) createCourseInputs(semesterCoursesContainer, parseInt(semesterNumInput.value) || 2, 'semester');
}


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
                    <select id="${type}-course-${i}-hours" required>
                        <option value="">-- اختر عدد الساعات --</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                    </select>
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


const majorCourses = {
    CE: [
        { name: "الرياضيات المتقطعة (1112عال)", weight: 0.5 },
        { name: "برمجة الحاسب 1 (1301عال)", weight: 0.5 }
    ],
    CS: [
        { name: "الرياضيات المتقطعة (1112عال)", weight: 0.25 },
        { name: "برمجة الحاسب 1 (1301عال)", weight: 0.75 }
    ],
    IS: [
        { name: "برمجة الحاسب 1 (1301عال)", weight: 0.5 },
        { name: "أساسيات نظم قواعد البيانات (2511نال)", weight: 0.5 }
    ],
    SE: [
        { name: "الرياضيات المتقطعة (1112عال)", weight: 0.5 },
        { name: "برمجة الحاسب 1 (1301عال)", weight: 0.5 }
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


function handleRateCalculation(e) {
    e.preventDefault();
    const major = document.getElementById('major').value;
    const gpa = parseFloat(document.getElementById('rate-gpa').value);
    const sa = parseFloat(document.getElementById('rate-sa').value);
    if (!major || isNaN(gpa) || isNaN(sa)) {
        showToast('يرجى ملء جميع الحقول المطلوبة', 'error');
        return;
    }

    const courses = majorCourses[major];
    const g1 = gradeValues[document.getElementById('rate-course-0').value];
    const w1 = courses[0].weight;
    const g2 = gradeValues[document.getElementById('rate-course-1').value];
    const w2 = courses[1].weight;
    if (g1 === undefined || g2 === undefined) {
        showToast('يرجى اختيار تقدير لكل مادة', 'error');
        return;
    }

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


function calculateRate(major, gpa, sa, g1, w1, g2, w2) {


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


function initCharts() {

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


    setTimeout(() => {
        toast.classList.add('show');
    }, 100);


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


function initEventListeners() {

    themeToggle.addEventListener('click', toggleTheme);


    initMobileMenu();


    initTabs();


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


function initAbsenceLimitCalculator() {

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


    inputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) {
            input.addEventListener('input', updateAbsenceLimit);
            input.addEventListener('change', updateAbsenceLimit);
            input.addEventListener('keyup', updateAbsenceLimit);
            input.addEventListener('paste', () => setTimeout(updateAbsenceLimit, 100));
        }
    });


    document.addEventListener('input', function(e) {

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

            updateAbsenceLimit();
        }
    });


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


    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) {
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


    observer.observe(document.body, {
        childList: true,
        subtree: true
    });


    updateAbsenceLimit();


    setInterval(updateAbsenceLimit, 1000);


}

function updateAbsenceLimit() {
    try {


        const academicHours = parseInt(document.getElementById('course-academic-hours').value) || 0;
        const weeks = parseInt(document.getElementById('course-weeks').value) || 0;


        const lecturesCount = parseInt(document.getElementById('lectures-count').value) || 0;
        const exercisesCount = parseInt(document.getElementById('exercises-count').value) || 0;
        const labsCount = parseInt(document.getElementById('labs-count').value) || 0;


        const lectureHours = parseInt(document.getElementById('lecture-hours').value) || 0;
        const exerciseHours = parseInt(document.getElementById('exercise-hours').value) || 0;
        const labHours = parseInt(document.getElementById('lab-hours').value) || 0;




        let lecturesHours = 0;
        let exercisesHours = 0;
        let labsHours = 0;


        if (lectureHours > 0) {
            lecturesHours = lectureHours * lecturesCount;
        } else if (lecturesCount > 0) {
            lecturesHours = lecturesCount * 1.5;
        }


        if (exerciseHours > 0) {
            exercisesHours = exerciseHours * exercisesCount;
        } else if (exercisesCount > 0) {
            exercisesHours = exercisesCount * 1;
        }


        if (labHours > 0) {
            labsHours = labHours * labsCount;
        } else if (labsCount > 0) {
            labsHours = labsCount * 2;
        }

        const totalWeeklyHours = lecturesHours + exercisesHours + labsHours;




    } catch (error) {
        console.error('Error updating absence limit:', error);
    }
}


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


    const floatingCards = document.querySelectorAll('.floating-card-3d');
    floatingCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 2}s`;
    });


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



document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        mobileMenu.classList.remove('active');
    }
});


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


window.RateCalculator = {
    calculateRate,
    calculateCumulativeGPA,
    calculateSemesterGPA,
    showToast,
    setTheme,
    switchTab
};

function initAnalyticsCharts() {

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
                    '#1976d2',
                    '#7c4dff',
                    '#ffb300'
                ],
                borderRadius: 10,
                barPercentage: 0.45,
                categoryPercentage: 0.6,
                borderSkipped: false,

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

    document.getElementById('avg-rate').innerText = avgRate;
    document.getElementById('avg-semester').innerText = avgSemester;
    document.getElementById('avg-gpa').innerText = avgGpa;
}


const analyticsTabBtn = document.querySelector('[data-tab="analytics"]');
if (analyticsTabBtn) {
    analyticsTabBtn.addEventListener('click', () => {
        setTimeout(initAnalyticsCharts, 200);
    });
}


function exportResult(btn) {

    const resultContainer = btn.closest('.result-container');
    if (!resultContainer) return;


    let menu = document.createElement('div');
    menu.className = 'export-menu';
    menu.innerHTML = `
        <button onclick="downloadResultImage(this)"><i class='fas fa-image'></i> تحميل كصورة</button>
        <button onclick="printResult(this)"><i class='fas fa-print'></i> طباعة</button>
    `;

    document.querySelectorAll('.export-menu').forEach(e => e.remove());

    btn.parentNode.appendChild(menu);

    setTimeout(() => {
        document.addEventListener('click', function handler(e) {
            if (!menu.contains(e.target) && e.target !== btn) {
                menu.remove();
                document.removeEventListener('click', handler);
            }
        });
    }, 100);
}


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


let absenceCourses = [];


function initAbsenceCalculator() {



    loadSavedCourses();


    loadCourses();


    loadAbsenceControl();





}


function loadSavedCourses() {
    try {
        const savedCourses = localStorage.getItem('absenceCourses');


        if (savedCourses) {
            absenceCourses = JSON.parse(savedCourses);

        } else {
            absenceCourses = [];

        }
    } catch (error) {
        console.error('خطأ في تحميل المواد المحفوظة:', error);
        absenceCourses = [];
    }
}


function clearAllCourses() {
    absenceCourses = [];
    localStorage.removeItem('absenceCourses');
    loadCourses();
}



function addCourseDirectly() {
    try {

        const courseNameRaw = document.getElementById('course-name').value;
        const courseName = courseNameRaw ? courseNameRaw.trim() : '';
        const academicHours = parseInt(document.getElementById('course-academic-hours').value);
        const weeks = parseInt(document.getElementById('course-weeks').value);
        const lecturesCount = parseInt(document.getElementById('lectures-count').value);




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


        absenceCourses.push(newCourse);


        localStorage.setItem('absenceCourses', JSON.stringify(absenceCourses));


        loadCourses();
        loadAbsenceControl();


        document.getElementById('course-name').value = '';
        document.getElementById('course-academic-hours').value = '';
        document.getElementById('course-weeks').value = '';
        document.getElementById('lectures-count').value = '';


        showSuccessPopup(`تم إضافة مادة "${courseName}" بنجاح! 🎉`);


        setTimeout(() => {
            switchTab('absence');
        }, 1000);

    } catch (error) {
        alert('حدث خطأ: ' + error.message);
    }
}


function addCourseEmergency() {
    try {

        const courseName = document.getElementById('course-name').value.trim() || 'مادة جديدة';
        const academicHours = parseInt(document.getElementById('course-academic-hours').value) || 3;
        const weeks = parseInt(document.getElementById('course-weeks').value) || 16;
        const lecturesCount = parseInt(document.getElementById('lectures-count').value) || 2;


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


        absenceCourses.push(newCourse);


        localStorage.setItem('absenceCourses', JSON.stringify(absenceCourses));


        loadCourses();
        loadAbsenceControl();


        document.getElementById('course-name').value = '';
        document.getElementById('course-academic-hours').value = '';
        document.getElementById('course-weeks').value = '';
        document.getElementById('lectures-count').value = '';


        showSuccessPopup(`تم إضافة مادة "${courseName}" بنجاح! 🎉`);


        setTimeout(() => {
            switchTab('absence');
        }, 1000);

    } catch (error) {
        alert('حدث خطأ: ' + error.message);
    }
}


function addCourse(e) {
    if (e) e.preventDefault();
    addCourseSimple();
}


function customizeCourse(courseId) {
    const course = absenceCourses.find(c => c.id === courseId);
    if (!course) return;


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


function saveCustomization(courseId) {
    const course = absenceCourses.find(c => c.id === courseId);
    if (!course) return;


    const lecturesCount = parseInt(document.getElementById('custom-lectures-count').value) || 1;
    const lectureHours = parseFloat(document.getElementById('custom-lecture-hours').value) || 1.5;
    const exercisesCount = parseInt(document.getElementById('custom-exercises-count').value) || 0;
    const exerciseHours = parseFloat(document.getElementById('custom-exercise-hours').value) || 1;
    const labsCount = parseInt(document.getElementById('custom-labs-count').value) || 0;
    const labHours = parseFloat(document.getElementById('custom-lab-hours').value) || 2;


    course.lectures.count = lecturesCount;
    course.lectures.hoursPerSession = lectureHours;
    course.lectures.totalHours = lecturesCount * lectureHours * course.weeks;

    course.exercises.count = exercisesCount;
    course.exercises.hoursPerSession = exerciseHours;
    course.exercises.totalHours = exercisesCount * exerciseHours * course.weeks;

    course.labs.count = labsCount;
    course.labs.hoursPerSession = labHours;
    course.labs.totalHours = labsCount * labHours * course.weeks;


    course.totalHours = course.lectures.totalHours + course.exercises.totalHours + course.labs.totalHours;


    localStorage.setItem('absenceCourses', JSON.stringify(absenceCourses));


    loadCourses();
    loadAbsenceControl();


    closeModal();


    alert(`تم تخصيص مادة "${course.name}" بنجاح! 🎉`);
}


function closeModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
        modal.remove();
    }
}



function addCourseSimple() {

    const courseName = document.getElementById('course-name').value.trim();
    const academicHours = document.getElementById('course-academic-hours').value;
    const weeks = document.getElementById('course-weeks').value;
    const lecturesCount = document.getElementById('lectures-count').value;


    const finalAcademicHours = academicHours || 3;
    const finalWeeks = weeks || 16;
    const finalLecturesCount = lecturesCount || 2;


    if (courseName) {
        const existingCourse = absenceCourses.find(c => c.name.toLowerCase() === courseName.toLowerCase());
        if (existingCourse) {
            alert('هذه المادة موجودة بالفعل');
            return;
        }
    }


    const exercisesCount = parseInt(document.getElementById('exercises-count').value) || 0;
    const labsCount = parseInt(document.getElementById('labs-count').value) || 0;

    const lecturesData = collectDynamicFieldsData('lecture', finalLecturesCount);
    const exercisesData = collectDynamicFieldsData('exercise', exercisesCount);
    const labsData = collectDynamicFieldsData('lab', labsCount);


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
        totalAbsencePercentage: 0,
        createdAt: new Date().toISOString()
    };


    course.totalAbsencePercentage = calculateWeeklyAbsencePercentage(course);




    absenceCourses.push(course);
    localStorage.setItem('absenceCourses', JSON.stringify(absenceCourses));
    loadCourses();
    loadAbsenceControl();


    const stats = calculateCourseStats(course);
    const totalSessionsPerWeek = (course.lectures?.count || 0) + (course.exercises?.count || 0) + (course.labs?.count || 0);
    const totalSessionsInSemester = totalSessionsPerWeek * course.weeks;
    const maxAbsenceSessions = Math.floor(totalSessionsInSemester * 0.25);


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


    document.getElementById('course-name').value = '';
    document.getElementById('course-academic-hours').value = '';
    document.getElementById('course-weeks').value = '';
    document.getElementById('lectures-count').value = '';
    document.getElementById('exercises-count').value = '';
    document.getElementById('labs-count').value = '';


    document.getElementById('lectures-fields').innerHTML = '';
    document.getElementById('exercises-fields').innerHTML = '';
    document.getElementById('labs-fields').innerHTML = '';
}




function showSuccessPopup(message) {

    const popup = document.createElement('div');
    popup.className = 'success-popup-overlay';


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


    setTimeout(() => {
        closeSuccessPopup();
    }, 8000);
}


function closeSuccessPopup() {
    const popup = document.querySelector('.success-popup-overlay');
    if (popup) {
        popup.remove();
    }
}



function clearAddCourseForm() {

    document.getElementById('course-name').value = '';
    document.getElementById('course-academic-hours').value = '';
    document.getElementById('course-weeks').value = '';
    document.getElementById('lectures-count').value = '';
    document.getElementById('exercises-count').value = '';
    document.getElementById('labs-count').value = '';


    document.getElementById('lectures-container').style.display = 'none';
    document.getElementById('exercises-container').style.display = 'none';
    document.getElementById('labs-container').style.display = 'none';


    document.getElementById('lectures-fields').innerHTML = '';
    document.getElementById('exercises-fields').innerHTML = '';
    document.getElementById('labs-fields').innerHTML = '';
}


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


        addDayDropdownListeners();
    } else {
        container.style.display = 'none';
        fieldsContainer.innerHTML = '';
    }




}


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


        addDayDropdownListeners();
    } else {
        container.style.display = 'none';
        fieldsContainer.innerHTML = '';
    }




}


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


        addDayDropdownListeners();
    } else {
        container.style.display = 'none';
        fieldsContainer.innerHTML = '';
    }




}


function addDayDropdownListeners() {

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


    document.querySelectorAll('.day-dropdown-trigger').forEach(trigger => {
        trigger.addEventListener('click', function(e) {
            e.stopPropagation();
            const lecture = this.dataset.lecture;
            const exercise = this.dataset.exercise;
            const lab = this.dataset.lab;


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


    document.querySelectorAll('.hours-dropdown-trigger').forEach(trigger => {
        trigger.addEventListener('click', function(e) {
            e.stopPropagation();
            const lecture = this.dataset.lecture;
            const exercise = this.dataset.exercise;
            const lab = this.dataset.lab;


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


    document.querySelectorAll('.day-option').forEach(option => {
        option.addEventListener('click', function(e) {
            e.stopPropagation();
            const day = this.dataset.day;
            const lecture = this.dataset.lecture;
            const exercise = this.dataset.exercise;
            const lab = this.dataset.lab;


            const container = this.closest('.day-dropdown-container');
            const textElement = container.querySelector('.day-dropdown-text');
            textElement.textContent = day;


            if (lecture) {
                document.getElementById(`lecture-${lecture}-day`).value = day;
            } else if (exercise) {
                document.getElementById(`exercise-${exercise}-day`).value = day;
            } else if (lab) {
                document.getElementById(`lab-${lab}-day`).value = day;
            }


            const menu = container.querySelector('.day-dropdown-menu');
            const icon = container.querySelector('.day-dropdown-icon');
            menu.style.display = 'none';
            icon.style.transform = 'rotate(0deg)';
        });
    });


    document.querySelectorAll('.hours-option').forEach(option => {
        option.addEventListener('click', function(e) {
            e.stopPropagation();
            const hours = this.dataset.hours;
            const lecture = this.dataset.lecture;
            const exercise = this.dataset.exercise;
            const lab = this.dataset.lab;


            const container = this.closest('.hours-dropdown-container');
            const textElement = container.querySelector('.hours-dropdown-text');
            textElement.textContent = this.textContent;


            if (lecture) {
                document.getElementById(`lecture-${lecture}-hours`).value = hours;
            } else if (exercise) {
                document.getElementById(`exercise-${exercise}-hours`).value = hours;
            } else if (lab) {
                document.getElementById(`lab-${lab}-hours`).value = hours;
            }


            const menu = container.querySelector('.hours-dropdown-menu');
            const icon = container.querySelector('.hours-dropdown-icon');
            menu.style.display = 'none';
            icon.style.transform = 'rotate(0deg)';
        });
    });
}


function addDayButtonListeners() {
    const dayButtons = document.querySelectorAll('.day-btn');
    dayButtons.forEach(button => {
        button.addEventListener('click', function() {
            const day = this.dataset.day;
            const lecture = this.dataset.lecture;
            const exercise = this.dataset.exercise;
            const lab = this.dataset.lab;


            const container = this.closest('.day-buttons-container');
            const groupButtons = container.querySelectorAll('.day-btn');
            groupButtons.forEach(btn => btn.classList.remove('active'));


            this.classList.add('active');


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


function collectDynamicFieldsData(type, count) {
    const data = [];


    for (let i = 1; i <= count; i++) {
        const dayElement = document.getElementById(`${type}-${i}-day`);
        const hoursElement = document.getElementById(`${type}-${i}-hours`);
        const absencePercentageElement = document.getElementById(`${type}-${i}-absence-percentage`);



        if (dayElement && hoursElement) {
            const day = dayElement.value.trim();
            const hours = parseFloat(convertArabicCommaToDot(hoursElement.value));
            const absencePercentage = parseFloat(convertArabicCommaToDot(absencePercentageElement?.value)) || 0;



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


    return data;
}


function convertArabicCommaToDot(value) {
    if (typeof value === 'string') {
        return value.replace(/،/g, '.');
    }
    return value;
}


function calculateWeeklyAbsencePercentage(course) {
    let totalAbsencePercentage = 0;


    if (course.lectures && course.lectures.sessions) {
        course.lectures.sessions.forEach(session => {
            if (session.absencePercentage && session.absencePercentage > 0) {
                totalAbsencePercentage += parseFloat(session.absencePercentage);
            }
        });
    }


    if (course.exercises && course.exercises.sessions) {
        course.exercises.sessions.forEach(session => {
            if (session.absencePercentage && session.absencePercentage > 0) {
                totalAbsencePercentage += parseFloat(session.absencePercentage);
            }
        });
    }


    if (course.labs && course.labs.sessions) {
        course.labs.sessions.forEach(session => {
            if (session.absencePercentage && session.absencePercentage > 0) {
                totalAbsencePercentage += parseFloat(session.absencePercentage);
            }
        });
    }

    return totalAbsencePercentage;
}


function updateAllCoursesWeeklyAbsencePercentage() {
    absenceCourses.forEach(course => {
        const weeklyPercentage = calculateWeeklyAbsencePercentage(course);
        course.totalAbsencePercentage = weeklyPercentage;
    });


    localStorage.setItem('absenceCourses', JSON.stringify(absenceCourses));


    loadCourses();
    loadAbsenceControl();
}


function calculateTotalAbsenceCount(sessionsData, weeks) {
    let totalAbsenceCount = 0;

    sessionsData.forEach(session => {

        const totalSessionsForThisType = weeks;

        const absenceCount = Math.floor((session.absencePercentage / 100) * totalSessionsForThisType);
        totalAbsenceCount += absenceCount;
    });

    return totalAbsenceCount;
}


function calculateRemainingAbsence(sessionsData, weeks) {

    const totalSessionsPerWeek = sessionsData.length;
    const totalSessionsInSemester = totalSessionsPerWeek * weeks;


    const totalAbsenceCount = calculateTotalAbsenceCount(sessionsData, weeks);


    const maxAllowedAbsence = Math.floor(totalSessionsInSemester * 0.25);


    const remainingAbsenceSessions = Math.max(0, maxAllowedAbsence - totalAbsenceCount);


    const currentAbsencePercentage = totalSessionsInSemester > 0 ? (totalAbsenceCount / totalSessionsInSemester) * 100 : 0;


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


function calculateIndividualLimits(sessionsData, weeks, typeName) {

    const totalSessionsPerWeek = sessionsData.length;
    const totalSessionsInSemester = totalSessionsPerWeek * weeks;


    const totalAbsenceCount = calculateTotalAbsenceCount(sessionsData, weeks);


    const maxAllowedAbsence = Math.floor(totalSessionsInSemester * 0.25);


    const remainingAbsenceSessions = Math.max(0, maxAllowedAbsence - totalAbsenceCount);


    const currentAbsencePercentage = totalSessionsInSemester > 0 ? (totalAbsenceCount / totalSessionsInSemester) * 100 : 0;


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


function loadCourses() {
    const coursesList = document.getElementById('courses-list');
    if (!coursesList) {
        console.error('عنصر courses-list غير موجود');
        return;
    }



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

        const stats = calculateIntegratedStats(course);
               const statusIcon = stats.status === 'danger' ? '🔴' : stats.status === 'warning' ? '🔴' : stats.status === 'safe-yellow' ? '🟡' : '🟢';
               const statusClass = stats.status === 'danger' ? 'danger' : stats.status === 'warning' ? 'danger' : stats.status === 'safe-yellow' ? 'warning' : 'safe';


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


function calculateCourseStats(course) {

    const totalSessionsPerWeek = (course.lectures?.count || 0) + (course.exercises?.count || 0) + (course.labs?.count || 0);


    const totalSessionsInSemester = totalSessionsPerWeek * course.weeks;


    const maxAbsenceSessions = Math.floor(totalSessionsInSemester * 0.25);


    const totalAbsenceHours = (course.lectures?.absenceHours || 0) + (course.exercises?.absenceHours || 0) + (course.labs?.absenceHours || 0);


    const averageHoursPerSession = course.totalHours / totalSessionsInSemester;
    const actualAbsenceSessions = Math.floor(totalAbsenceHours / averageHoursPerSession);


    const remainingAbsences = Math.max(0, maxAbsenceSessions - actualAbsenceSessions);


    const currentAbsencePercentage = totalSessionsInSemester > 0 ? (actualAbsenceSessions / totalSessionsInSemester) * 100 : 0;

    let status = 'safe';
    if (currentAbsencePercentage > 25.01) {
        status = 'danger';
    } else if (currentAbsencePercentage >= 18.75) {
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


function editCourseAbsence(courseId) {
    const course = absenceCourses.find(c => c.id === courseId);
    if (!course) return;

    const stats = calculateCourseStats(course);
    const totalAbsenceHours = (course.lectures?.absenceHours || 0) + (course.exercises?.absenceHours || 0) + (course.labs?.absenceHours || 0);
    const absencePercentage = ((totalAbsenceHours / course.totalHours) * 100).toFixed(1);


    openDetailedAbsenceModal(course, stats);
}


function openDetailedAbsenceModal(course, stats) {

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


    const existingModal = document.getElementById('detailed-absence-modal');
    if (existingModal) {
        existingModal.remove();
    }


    document.body.insertAdjacentHTML('beforeend', modalHTML);


    const modal = document.getElementById('detailed-absence-modal');
    const cancelBtn = document.getElementById('cancel-detailed-absence');
    const saveBtn = document.getElementById('save-detailed-absence');


    cancelBtn.addEventListener('click', () => {
        modal.remove();
    });


    saveBtn.addEventListener('click', () => {
        saveDetailedAbsence(course);
        modal.remove();
    });


    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });


    addRealTimePercentageUpdates(course);
}


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



function deleteCourse(courseId) {
    const course = absenceCourses.find(c => c.id === courseId);
    if (!course) return;

    if (confirm(`هل أنت متأكد من حذف مادة "${course.name}"؟\n\nسيتم حذفها من:\n- المواد المسجلة\n- تحكم الغياب\n- جميع الإحصائيات`)) {

        absenceCourses = absenceCourses.filter(c => c.id !== courseId);


        localStorage.setItem('absenceCourses', JSON.stringify(absenceCourses));


        loadCourses();
        loadAbsenceControl();


        showToast(`تم حذف مادة "${course.name}" بنجاح! 🗑️`, 'success');

        console.log(`Course "${course.name}" deleted successfully`);
    }
}


function saveCourses() {
    localStorage.setItem('absenceCourses', JSON.stringify(absenceCourses));

}



function updateCompletionSection() {


    return;
}







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


    ['gesturestart', 'gesturechange', 'gestureend'].forEach(function(eventName) {
        document.addEventListener(eventName, function(e) {
            if (e.target.closest('.new-absence-counter-btn')) {
                e.preventDefault();
                e.stopPropagation();
            }
        }, { passive: false });
    });


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


document.addEventListener('DOMContentLoaded', function() {

    setTimeout(() => {
        initAbsenceCalculator();
        initAbsenceLimitCalculator();


        updateAllCoursesWeeklyAbsencePercentage();


        const addCourseForm = document.getElementById('add-course-form');
        if (addCourseForm) {

            console.log('Form event listener added');
        }


        const addCourseBtn = document.getElementById('add-course-btn');
        if (addCourseBtn) {
            addCourseBtn.addEventListener('click', function(e) {
                e.preventDefault();
                addCourse(e);
            });
            console.log('Button event listener added');
        }


    const inputs = ['lectures-count', 'exercises-count', 'labs-count', 'course-weeks', 'lecture-hours', 'exercise-hours', 'lab-hours'];
    inputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) {
            input.addEventListener('input', function(e) {

                if (e.target.value.includes('،')) {
                    e.target.value = e.target.value.replace(/،/g, '.');
                }
                console.log('تغيير في الحقل:', inputId, 'القيمة:', e.target.value);

            });
            input.addEventListener('change', function() {

            });
        }
    });


        const absenceInputs = ['lecture-absence-hours', 'exercise-absence-hours', 'lab-absence-hours'];
        absenceInputs.forEach(inputId => {
            const input = document.getElementById(inputId);
            if (input) {
                input.addEventListener('input', updateAbsenceCalculations);
                input.addEventListener('change', updateAbsenceCalculations);


                input.addEventListener('input', function(e) {
                    if (e.target.value.includes('،')) {
                        e.target.value = e.target.value.replace(/،/g, '.');
                    }
                });
            }
        });


        const lecturesCount = parseInt(document.getElementById('lectures-count').value) || 0;
        const exercisesCount = parseInt(document.getElementById('exercises-count').value) || 0;
        const labsCount = parseInt(document.getElementById('labs-count').value) || 0;

        for (let i = 1; i <= lecturesCount; i++) {
            const absencePercentageElement = document.getElementById(`lecture-${i}-absence-percentage`);
            if (absencePercentageElement) {
                absencePercentageElement.addEventListener('input', updateCompletionSection);
                absencePercentageElement.addEventListener('change', updateCompletionSection);


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


                absencePercentageElement.addEventListener('input', function(e) {
                    if (e.target.value.includes('،')) {
                        e.target.value = e.target.value.replace(/،/g, '.');
                    }
                });
            }
        }
    }, 100);
});




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


    addSessionAbsenceListeners();
    console.log('Absence control loaded successfully');
}


function createSessionsTable(course) {
    let tableHTML = `
        <div class="sessions-table-header">
            <div class="session-header-cell">يوم الجلسة</div>
            <div class="session-header-cell">الساعات</div>
            <div class="session-header-cell">نسبة الغياب</div>
            <div class="session-header-cell">الغياب الحالي</div>
        </div>
    `;


    if (course.lectures && course.lectures.sessions && course.lectures.sessions.length > 0) {
        course.lectures.sessions.forEach((session, index) => {
            const maxAbsences = Math.floor(course.weeks * 0.25);
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


function updateSessionAbsence(input) {
    const courseId = input.dataset.courseId;
    const sessionType = input.dataset.sessionType;
    const sessionIndex = parseInt(input.dataset.sessionIndex);
    const absenceCount = parseInt(input.value) || 0;


    const course = absenceCourses.find(c => c.id === courseId);
    if (!course) return;


    if (course[sessionType] && course[sessionType].sessions && course[sessionType].sessions[sessionIndex]) {
        course[sessionType].sessions[sessionIndex].absenceCount = absenceCount;


        localStorage.setItem('absenceCourses', JSON.stringify(absenceCourses));


        updateAllStatsIntegrated(courseId);


        updateRegisteredCoursesDisplay();

        console.log(`تم تحديث الغياب: ${sessionType} جلسة ${sessionIndex} = ${absenceCount}`);
    }
}


function updateAllStatsIntegrated(courseId) {
    const course = absenceCourses.find(c => c.id === courseId);
    if (!course) return;


    const stats = calculateIntegratedStats(course);


    updateStatsDisplayIntegrated(courseId, stats);


    updateProgressBarIntegrated(courseId, stats);


    updateStatusDisplayIntegrated(courseId, stats);
}


function calculateIntegratedStats(course) {
    let totalAbsenceHours = 0;
    let totalSessionsPerWeek = 0;
    let totalWeeks = course.weeks;


    if (course.lectures && course.lectures.sessions) {
        course.lectures.sessions.forEach(session => {
            totalAbsenceHours += (session.absenceCount || 0) * session.hours;
            totalSessionsPerWeek += 1;
        });
    }


    if (course.exercises && course.exercises.sessions) {
        course.exercises.sessions.forEach(session => {
            totalAbsenceHours += (session.absenceCount || 0) * session.hours;
            totalSessionsPerWeek += 1;
        });
    }


    if (course.labs && course.labs.sessions) {
        course.labs.sessions.forEach(session => {
            totalAbsenceHours += (session.absenceCount || 0) * session.hours;
            totalSessionsPerWeek += 1;
        });
    }


    const totalSessionsInSemester = totalSessionsPerWeek * totalWeeks;
    const totalHoursInSemester = totalSessionsPerWeek * totalWeeks * 1.5;
    const maxAbsenceSessions = Math.floor(totalSessionsInSemester * 0.25);


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


    let status = 'safe';
    if (absencePercentage >= 25.00) {
        status = 'danger';
    } else if (absencePercentage >= 20) {
        status = 'warning';
    } else if (absencePercentage >= 11) {
        status = 'safe-yellow';
    } else {
        status = 'safe';
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


function updateStatsDisplayIntegrated(courseId, stats) {
    const controlItem = document.querySelector(`input[data-course-id="${courseId}"]`)?.closest('.absence-control-item');
    if (!controlItem) return;

    const statElements = controlItem.querySelectorAll('.absence-stat-value');
    if (statElements.length >= 5) {

        statElements[0].textContent = stats.totalHoursInSemester;


        statElements[1].textContent = stats.maxAbsenceSessions;


        statElements[2].textContent = stats.usedAbsenceSessions;
        statElements[2].className = `absence-stat-value ${stats.status}`;


        statElements[3].textContent = stats.remainingAbsenceSessions;
        statElements[3].className = `absence-stat-value ${stats.status}`;


        statElements[4].textContent = `${stats.absencePercentage.toFixed(2)}%`;
        statElements[4].className = `absence-stat-value ${stats.status}`;
    }
}


function updateProgressBarIntegrated(courseId, stats) {
    const controlItem = document.querySelector(`input[data-course-id="${courseId}"]`)?.closest('.absence-control-item');
    if (!controlItem) return;

    const progressBar = controlItem.querySelector('.absence-progress-fill');
    if (progressBar) {

        const fillPercentage = Math.min(stats.absencePercentage, 100);
        progressBar.style.width = `${fillPercentage}%`;


        progressBar.className = 'absence-progress-fill';
        if (stats.absencePercentage >= 25.00) {
            progressBar.classList.add('danger');
        } else if (stats.absencePercentage >= 20) {
            progressBar.classList.add('warning');
        } else if (stats.absencePercentage >= 11) {
            progressBar.classList.add('safe-yellow');
        } else {
            progressBar.classList.add('safe');
        }

        console.log(`تم تحديث شريط التقدم: ${fillPercentage.toFixed(2)}% - اللون: ${progressBar.className}`);
    }
}


function updateStatusDisplayIntegrated(courseId, stats) {
    const controlItem = document.querySelector(`input[data-course-id="${courseId}"]`)?.closest('.absence-control-item');
    if (!controlItem) return;

    const statusElement = controlItem.querySelector('.absence-control-status');
    if (statusElement) {
        let statusText = 'آمن';
        if (stats.status === 'danger') {

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


function updateAbsenceValue(courseId, sessionType, sessionIndex, value) {
    console.log('Updating absence value:', courseId, sessionType, sessionIndex, value);


    const course = absenceCourses.find(c => c.id === courseId);
    if (!course) {
        console.error('Course not found:', courseId);
        return;
    }


    if (course[sessionType] && course[sessionType].sessions && course[sessionType].sessions[sessionIndex]) {
        course[sessionType].sessions[sessionIndex].absenceCount = parseInt(value);


        localStorage.setItem('absenceCourses', JSON.stringify(absenceCourses));


        updateAllStatsIntegrated(courseId);


        updateRegisteredCoursesDisplay();

        console.log(`تم تحديث الغياب: ${sessionType} جلسة ${sessionIndex} = ${value}`);
    }
}


function updateRegisteredCoursesDisplay() {
    const coursesContainer = document.getElementById('courses-container');
    if (!coursesContainer) return;


    loadCourses();

    console.log('تم تحديث عرض المقررات المسجلة بناءً على بيانات الغياب');
}




function createAbsenceControlItem(course) {
    console.log('Creating absence control item for course:', course.name);
    console.log('Course data:', course);


    let totalSessionsPerWeek = 0;
    let totalWeeks = course.weeks;


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


    let status = 'safe';
    if (absencePercentage >= 25.00) {
        status = 'danger';
    } else if (absencePercentage >= 20) {
        status = 'warning';
    } else if (absencePercentage >= 11) {
        status = 'safe-yellow';
    } else {
        status = 'safe';
    }


    let statusText = 'آمن';
    if (status === 'danger') {

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


    const inputs = controlItem.querySelectorAll('input[type="number"]');
    inputs.forEach(input => {
        input.addEventListener('input', () => updateSessionAbsence(input));
    });


    setTimeout(() => {
        updateAllStatsIntegrated(course.id);
    }, 100);

    console.log('Absence control item created successfully for:', course.name);
    console.log('Control item HTML length:', controlItem.innerHTML.length);

    return controlItem;
}


function updateCourseAbsence(courseId) {
    const course = absenceCourses.find(c => c.id === courseId);
    if (!course) return;


    saveCourses();


    loadCourses();


    showToast(`تم تحديث غياب مادة "${course.name}" بنجاح! 📊`, 'success');
}



function resetCourseAbsence(courseId) {
    const course = absenceCourses.find(c => c.id === courseId);
    if (!course) return;


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


    localStorage.setItem('absenceCourses', JSON.stringify(absenceCourses));


    loadAbsenceControl();


    showToast(`تم إعادة تعيين غياب مادة "${course.name}" بنجاح! 🔄`, 'success');
}


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


let newAbsenceCourses = JSON.parse(localStorage.getItem('newAbsenceCourses')) || [];


let shownAlerts = JSON.parse(localStorage.getItem('absenceShownAlerts')) || {};


window.clearAbsenceAlerts = function() {
    shownAlerts = {};
    localStorage.removeItem('absenceShownAlerts');
    console.log('تم حذف جميع التنبيهات');
};


function initNewAbsenceCalculator() {
    const form = document.getElementById('new-absence-form');
    if (form) {
        form.addEventListener('submit', handleNewAbsenceFormSubmit);
    }


    initializeHoursDropdown();

    renderNewAbsenceCourses();
}


function initializeHoursDropdown() {
    const hoursSelect = document.getElementById('new-course-hours-per-week');
    if (!hoursSelect) return;


    while (hoursSelect.options.length > 1) {
        hoursSelect.remove(1);
    }


    for (let i = 1; i <= 20; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `${i} ${i === 1 ? '' : ''}`;
        hoursSelect.appendChild(option);
    }
}


function handleNewAbsenceFormSubmit(e) {
    e.preventDefault();

    const courseName = document.getElementById('new-course-name').value.trim();
    const hoursPerWeek = parseFloat(document.getElementById('new-course-hours-per-week').value);

    if (!courseName || !hoursPerWeek || hoursPerWeek <= 0) {
        showToast('يرجى إدخال جميع البيانات بشكل صحيح', 'error');
        return;
    }






    const absencePercentagePerHour = 6.25 / hoursPerWeek;


    const course = {
        id: Date.now().toString(),
        name: courseName,
        hoursPerWeek: hoursPerWeek,
        absencePercentagePerHour: absencePercentagePerHour,
        currentAbsenceHours: 0,
        createdAt: new Date().toISOString()
    };


    newAbsenceCourses.push(course);


    localStorage.setItem('newAbsenceCourses', JSON.stringify(newAbsenceCourses));


    document.getElementById('new-absence-form').reset();


    renderNewAbsenceCourses();


    showToast(`تم إضافة المادة "${courseName}" بنجاح! ✅`, 'success');
}


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


    newAbsenceCourses.forEach(course => {

        const deleteBtn = document.getElementById(`delete-course-${course.id}`);
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => deleteCourse(course.id));
        }


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


function createCourseCard(course) {

    const totalHours = course.hoursPerWeek * 16;
    const absenceLimit = totalHours * 0.25;
    const remainingHours = Math.max(0, absenceLimit - course.currentAbsenceHours);


    const absencePercentage = totalHours > 0 ? (course.currentAbsenceHours / totalHours) * 100 : 0;


    let statusClass = 'safe';
    let statusText = 'في أمان';

    if (absencePercentage >= 25.00) {
        statusClass = 'danger';

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


    const progressPercentage = Math.min(100, absencePercentage);
    const markerPosition = 75;

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
                <div class="new-absence-hour-percentage">
                    <span class="hour-percentage-label">نسبة غياب الساعتين:</span>
                    <span class="hour-percentage-value">${(course.absencePercentagePerHour * 2).toFixed(3)}%</span>
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


let currentAlertShowing = false;
let absenceAlertTimer = null;



function playAbsenceAlertSound(alertType) {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();

        let frequency = 400;
        let duration = 0.2;
        let beeps = 1;


        if (alertType === '25' || alertType === 'danger') {

            frequency = 600;
            duration = 0.15;
            beeps = 3;
        } else if (alertType === '20' || alertType === 'warning-high') {

            frequency = 500;
            duration = 0.2;
            beeps = 2;
        } else if (alertType === '10' || alertType === 'warning') {

            frequency = 400;
            duration = 0.25;
            beeps = 1;
        }


        for (let i = 0; i < beeps; i++) {
            setTimeout(() => {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);

                oscillator.frequency.value = frequency;
                oscillator.type = 'sine';


                const now = audioContext.currentTime;
                gainNode.gain.setValueAtTime(0, now);
                gainNode.gain.linearRampToValueAtTime(0.3, now + 0.01);
                gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);

                oscillator.start(now);
                oscillator.stop(now + duration);
            }, i * (duration * 1000 + 50));
        }
    } catch (error) {

        console.log('Web Audio API not available, using fallback sound');

    }
}

function showAbsenceAlert(courseName, percentage, alertType) {

    if (currentAlertShowing) {
        return;
    }

    currentAlertShowing = true;


    playAbsenceAlertSound(alertType);


    if (absenceAlertTimer) {
        clearTimeout(absenceAlertTimer);
    }


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


    const existingAlert = document.getElementById('absence-alert-overlay');
    if (existingAlert) {
        existingAlert.remove();
    }


    document.body.insertAdjacentHTML('beforeend', popupHTML);



    const overlay = document.getElementById('absence-alert-overlay');
    if (overlay) {

        const popup = overlay.querySelector('.absence-alert-popup');
        if (popup) {
            popup.addEventListener('click', function(e) {
                e.stopPropagation();
            });
        }


        absenceAlertTimer = setTimeout(() => {
            closeAbsenceAlert();
        }, 5000);
    }
}


window.closeAbsenceAlert = function() {
    const overlay = document.getElementById('absence-alert-overlay');
    if (overlay) {
        overlay.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            overlay.remove();
            currentAlertShowing = false;
        }, 300);
    }


    if (absenceAlertTimer) {
        clearTimeout(absenceAlertTimer);
        absenceAlertTimer = null;
    }
};


function checkAbsenceAlerts(courseId, oldPercentage = null) {
    const course = newAbsenceCourses.find(c => c.id === courseId);
    if (!course) return;


    const totalHours = course.hoursPerWeek * 16;
    const absencePercentage = totalHours > 0 ? (course.currentAbsenceHours / totalHours) * 100 : 0;


    const roundedPercentage = Math.round(absencePercentage * 1000) / 1000;


    if (oldPercentage !== null) return;


    if (roundedPercentage >= 25) {
        const alertKey = `${course.name}_25`;
        if (!shownAlerts[alertKey]) {
            showAbsenceAlert(course.name, absencePercentage, '25');
            return;
        }
    }


    if (roundedPercentage >= 20 && roundedPercentage < 25) {
        const alertKey = `${course.name}_20`;
        if (!shownAlerts[alertKey]) {
            showAbsenceAlert(course.name, absencePercentage, '20');
            return;
        }
    }


    if (roundedPercentage >= 10 && roundedPercentage < 20) {
        const alertKey = `${course.name}_10`;
        if (!shownAlerts[alertKey]) {
            showAbsenceAlert(course.name, absencePercentage, '10');
            return;
        }
    }
}


function updateAbsenceHours(courseId, change) {
    const course = newAbsenceCourses.find(c => c.id === courseId);
    if (!course) return;


    const oldValue = course.currentAbsenceHours;
    const newValue = Math.max(0, course.currentAbsenceHours + change);
    course.currentAbsenceHours = newValue;


    const totalHours = course.hoursPerWeek * 16;
    const oldPercentage = totalHours > 0 ? (oldValue / totalHours) * 100 : 0;
    const newPercentage = totalHours > 0 ? (newValue / totalHours) * 100 : 0;


    const oldPercentageRounded = Math.round(oldPercentage * 1000) / 1000;
    const newPercentageRounded = Math.round(newPercentage * 1000) / 1000;


    localStorage.setItem('newAbsenceCourses', JSON.stringify(newAbsenceCourses));


    if (change > 0) {

        if (newPercentage >= 25.00 && oldPercentage >= 25.00) {

            playAbsenceAlertSound('danger');
        }

    }


    renderNewAbsenceCourses();



    setTimeout(() => {

        const currentCourse = newAbsenceCourses.find(c => c.id === courseId);
        if (!currentCourse) return;


        const currentTotalHours = currentCourse.hoursPerWeek * 16;
        const currentAbsencePercent = currentTotalHours > 0 ? (currentCourse.currentAbsenceHours / currentTotalHours) * 100 : 0;
        const currentPercentRounded = Math.round(currentAbsencePercent * 1000) / 1000;


        const crossed25 = oldPercentageRounded < 25 && currentPercentRounded >= 25;
        const crossed20 = oldPercentageRounded < 20 && currentPercentRounded >= 20 && currentPercentRounded < 25;
        const crossed10 = oldPercentageRounded < 10 && currentPercentRounded >= 10 && currentPercentRounded < 20;


        if (crossed25) {
            showAbsenceAlert(currentCourse.name, currentAbsencePercent, '25');
        } else if (crossed20) {
            showAbsenceAlert(currentCourse.name, currentAbsencePercent, '20');
        } else if (crossed10) {
            showAbsenceAlert(currentCourse.name, currentAbsencePercent, '10');
        }
    }, 400);


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


function deleteCourse(courseId) {
    if (!confirm('هل أنت متأكد من حذف هذه المادة؟')) return;

    newAbsenceCourses = newAbsenceCourses.filter(c => c.id !== courseId);


    localStorage.setItem('newAbsenceCourses', JSON.stringify(newAbsenceCourses));


    renderNewAbsenceCourses();


    showToast('تم حذف المادة بنجاح! 🗑️', 'success');
}



if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNewAbsenceCalculator);
} else {
    initNewAbsenceCalculator();
}






function createCourseSearchField() {

    if (typeof universityCourses === 'undefined' || !Array.isArray(universityCourses)) {
        console.log('⏳ جاري تحميل البيانات...');
        setTimeout(createCourseSearchField, 500);
        return;
    }


    if (!document.querySelector('.new-absence-form-section')) {
        console.log('⏳ جاري تحميل النموذج...');
        setTimeout(createCourseSearchField, 500);
        return;
    }

    const formSection = document.querySelector('.new-absence-form-section');
    const coursesDatabase = universityCourses;

    console.log(`✅ تحميل ${coursesDatabase.length} مادة من قاعدة البيانات`);

    if (!formSection) return;


    if (document.getElementById('course-search')) return;

    const searchHTML = `
        <div class="form-group" style="position: relative; margin-bottom: 1.5rem;">
            <label for="course-search" style="
                display: flex;
                align-items: center;
                gap: 0.5rem;
                margin-bottom: 0.5rem;
                font-weight: 600;
                color: var(--text-primary);
                font-size: 1rem;
            ">
                <i class="fas fa-search" style="color: #667eea;"></i>
                <span> البحث</span>
                <span style="
                    color: var(--text-muted);
                    font-size: 0.85rem;
                    font-weight: 400;
                    background: var(--bg-secondary);
                    padding: 2px 8px;
                    border-radius: 12px;
                ">(${coursesDatabase.length} مادة)</span>
            </label>
            <input
                type="text"
                id="course-search"
                placeholder="ابحث عن المادة... (مثال: برمجة، رياضيات، قواعد البيانات)"
                style="
                    width: 100%;
                    padding: 14px 16px;
                    border: 2px solid var(--border-light);
                    border-radius: 12px;
                    font-size: 1rem;
                    font-family: var(--font-primary);
                    transition: all 0.3s ease;
                    background: var(--bg-secondary);
                "
                autocomplete="off"
            >
            <div id="course-suggestions" style="
                position: absolute;
                top: 100%;
                right: 0;
                left: 0;
                background: var(--bg-primary);
                border: 2px solid var(--border-light);
                border-top: none;
                border-radius: 0 0 12px 12px;
                max-height: 400px;
                overflow-y: auto;
                z-index: 1000;
                display: none;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                margin-top: -2px;
            "></div>
        </div>
    `;


    const courseNameLabel = formSection.querySelector('label[for="new-course-name"]');
    if (courseNameLabel) {
        courseNameLabel.parentElement.insertAdjacentHTML('beforebegin', searchHTML);
    } else {
        formSection.insertAdjacentHTML('afterbegin', searchHTML);
    }


    setupCourseSearchEvents(coursesDatabase);
}


function setupCourseSearchEvents(coursesDatabase) {
    const searchInput = document.getElementById('course-search');
    const suggestionsDiv = document.getElementById('course-suggestions');

    if (!searchInput || !suggestionsDiv) return;

    searchInput.addEventListener('input', function() {
        const query = this.value.trim().toLowerCase();

        if (query.length === 0) {
            suggestionsDiv.style.display = 'none';
            return;
        }

        const filtered = coursesDatabase.filter(course =>
            course.courseName.toLowerCase().includes(query) ||
            course.courseCode.toLowerCase().includes(query) ||
            course.major.toLowerCase().includes(query)
        );

        if (filtered.length === 0) {
            suggestionsDiv.innerHTML = `
                <div style="
                    padding: 30px 20px;
                    text-align: center;
                    color: var(--text-muted);
                ">
                    <i class="fas fa-search" style="
                        font-size: 2.5rem;
                        margin-bottom: 15px;
                        display: block;
                        opacity: 0.4;
                    "></i>
                    <p style="font-size: 1rem; margin: 0;">لم يتم العثور على مادة</p>
                </div>
            `;
            suggestionsDiv.style.display = 'block';
            return;
        }


        suggestionsDiv.innerHTML = filtered.slice(0, 12).map((course, index) => `
            <div class="suggestion-item" style="
                padding: 14px 16px;
                border-bottom: 1px solid var(--border-light);
                cursor: pointer;
                transition: all 0.2s ease;
                display: flex;
                justify-content: space-between;
                align-items: center;
            " data-index="${index}" data-course='${JSON.stringify(course).replace(/'/g, "&apos;")}'>
                <div style="flex: 1;">
                    <div style="
                        font-weight: 600;
                        color: var(--text-primary);
                        margin-bottom: 6px;
                        font-size: 1rem;
                    ">
                        ${course.courseName}
                    </div>
                    <div style="
                        display: flex;
                        gap: 16px;
                        font-size: 0.85rem;
                        color: var(--text-muted);
                    ">
                        <span>
                            <strong>📌 الرمز:</strong> ${course.courseCode}
                        </span>
                        <span>
                            <strong>🎓 التخصص:</strong> ${course.major}
                        </span>
                    </div>
                </div>
                <span style="
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 8px 16px;
                    border-radius: 20px;
                    font-size: 0.9rem;
                    font-weight: 700;
                    white-space: nowrap;
                    margin-right: 15px;
                    min-width: 85px;
                    text-align: center;
                    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
                ">
                    ⏱️ ${course.hours}h
                </span>
            </div>
        `).join('');

        suggestionsDiv.style.display = 'block';


        document.querySelectorAll('.suggestion-item').forEach(item => {
            item.addEventListener('click', function() {
                const course = JSON.parse(this.getAttribute('data-course'));
                selectCourse(course);
            });

            item.addEventListener('mouseenter', function() {
                this.style.background = 'var(--bg-secondary)';
                this.style.transform = 'translateX(-8px)';
            });

            item.addEventListener('mouseleave', function() {
                this.style.background = 'transparent';
                this.style.transform = 'translateX(0)';
            });
        });
    });


    document.addEventListener('click', function(e) {
        if (e.target !== searchInput && !e.target.closest('.suggestion-item')) {
            suggestionsDiv.style.display = 'none';
        }
    });


    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            suggestionsDiv.style.display = 'none';
        }
    });
}


function selectCourse(course) {
    const searchInput = document.getElementById('course-search');
    document.getElementById('course-suggestions').style.display = 'none';


    const courseNameField = document.getElementById('new-course-name');
    const hoursField = document.getElementById('new-course-hours-per-week');

    if (courseNameField) courseNameField.value = course.courseName;
    if (hoursField) hoursField.value = course.hours;


    setTimeout(() => {

        const absencePercentagePerHour = 6.25 / course.hours;


        const newCourse = {
            id: Date.now().toString(),
            name: course.courseName,
            hoursPerWeek: course.hours,
            absencePercentagePerHour: absencePercentagePerHour,
            currentAbsenceHours: 0,
            createdAt: new Date().toISOString()
        };


        newAbsenceCourses.push(newCourse);


        localStorage.setItem('newAbsenceCourses', JSON.stringify(newAbsenceCourses));


        renderNewAbsenceCourses();


        document.getElementById('new-absence-form').reset();
        searchInput.value = '';


        showSuccessNotification(`✅ تمت إضافة: ${course.courseName}`);
    }, 100);
}


function showSuccessNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
        z-index: 9999;
        animation: slideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 1rem;
    `;
    notification.innerHTML = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}


function getWeeklyHours() {
    const lecturesCount = Number(document.getElementById('lectures-count')?.value) || 0;
    const lectureHour = Number(document.getElementById('lecture-hours')?.value) || 0;
    const lecturesHours = lecturesCount * lectureHour;

    const exercisesCount = Number(document.getElementById('exercises-count')?.value) || 0;
    const exerciseHour = Number(document.getElementById('exercise-hours')?.value) || 0;
    const exercisesHours = exercisesCount * exerciseHour;

    const labsCount = Number(document.getElementById('labs-count')?.value) || 0;
    const labHour = Number(document.getElementById('lab-hours')?.value) || 0;
    const labsHours = labsCount * labHour;

    return lecturesHours + exercisesHours + labsHours;
}


function updateAbsenceBox() {
    const weeklyHours = getWeeklyHours();
    const weeks = Number(document.getElementById('course-weeks')?.value) || 0;
    const totalHours = weeklyHours * weeks;
    const maxAbsence = Math.floor(totalHours * 0.25);
    const absencePercentage = weeklyHours ? ((maxAbsence / weeklyHours) * 100).toFixed(2) : 0;

    const totalWeeklyEl = document.getElementById('total-weekly-hours');
    const maxAbsenceEl = document.getElementById('max-absence-hours');
    const absencePercentageEl = document.getElementById('absence-per-hour');

    if (totalWeeklyEl) totalWeeklyEl.textContent = weeklyHours;
    if (maxAbsenceEl) maxAbsenceEl.textContent = maxAbsence;
    if (absencePercentageEl) absencePercentageEl.textContent = absencePercentage;
}


function populateHoursSelect() {
    const select = document.getElementById('new-course-hours-per-week');
    if (!select) return;

    const hours = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 8];

    select.innerHTML = '<option value="">-- اختر عدد الساعات --</option>' +
        hours.map(h => `<option value="${h}">${h} ساعة</option>`).join('');
}



['new-course-name', 'new-course-hours-per-week', 'course-weeks', 'lectures-count', 'lecture-hours', 'exercises-count', 'exercise-hours', 'labs-count', 'lab-hours'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
        el.addEventListener('change', updateAbsenceBox);
        el.addEventListener('input', updateAbsenceBox);
    }
});


setInterval(updateAbsenceBox, 1000);


const slideStyle = document.createElement('style');
slideStyle.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(slideStyle);

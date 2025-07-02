const gradeValues = {
  "A+": 5,
  "A": 4.75,
  "B+": 4.5,
  "B": 4,
  "C+": 3.5,
  "C": 3,
  "D+": 2.5,
  "D": 2,
  "F": 0
};

const majorCourses = {
  SE: [
    { name: "التصميم المنطقي", weight: 0.5 },
    { name: "برمجة الحاسب 1", weight: 0.5 }
  ],
  CS: [
    { name: "الرياضيات المتقطعة", weight: 0.25 },
    { name: "برمجة الحاسب 1", weight: 0.75 }
  ],
  IS: [
    { name: "برمجة الحاسب 1", weight: 0.75 },
    { name: "التصميم المنطقي", weight: 0.25 }
  ],
  CE: [
    { name: "التصميم المنطقي", weight: 0.75 },
    { name: "الرياضيات المتقطعة", weight: 0.25 }
  ]
};

const translations = {
  ar: {
    "Rating Calculator": "حاسبة الريت",
    "Cumulative GPA": "حساب المعدل التراكمي",
    "Semester GPA": "حساب المعدل الفصلي",
    "Select Major": "اختر التخصص",
    "-- Select Major --": "-- اختر التخصص --",
    "Software Engineering": "هندسة البرمجيات",
    "Computer Science": "علوم الحاسوب",
    "Information Systems": "نظم المعلومات",
    "Computer Engineering": "هندسة الحاسوب",
    "Previous Hours": "عدد الساعات السابقة",
    "Previous GPA (out of 5)": "المعدل السابق (من 5)",
    "Calculate Cumulative GPA": "حساب المعدل التراكمي",
    "Calculate Semester GPA": "حساب المعدل الفصلي",
    "Cumulative GPA = ": "المعدل التراكمي = ",
    "Semester GPA = ": "المعدل الفصلي = ",
    "Rating = ": "الريت = ",
    "Reset": "إعادة التعيين",
    "Calculate Rating": "حساب الريت",
    "Enter Hours": "أدخل الساعات",
    "Enter GPA": "أدخل المعدل",
    "Dark": "داكن",
    "Light": "فاتح",
    "AR": "عربي",
    "EN": "إنجليزي",
    "-- Select Grade --": "-- اختر التقدير --",
    "Course": "المادة",
    "Please select a major!": "يرجى اختيار التخصص!",
    "Please enter valid GPA and SA!": "يرجى إدخال معدل تراكمي وإجمالي صحيح!",
    "Please enter valid grades!": "يرجى إدخال درجات صحيحة!",
    "Please enter valid hours and GPA!": "يرجى إدخال ساعات ومعدل سابق صحيح!",
    "Please enter valid hours and grades!": "يرجى إدخال ساعات ودرجات صحيحة!",
    "Number of New Courses (1-10)": "عدد المواد الجديدة (1-10)",
    "Summary": "الملخص"
  },
  en: {
    "حاسبة الريت": "Rating Calculator",
    "حساب المعدل التراكمي": "Cumulative GPA",
    "حساب المعدل الفصلي": "Semester GPA",
    "اختر التخصص": "Select Major",
    "-- اختر التخصص --": "-- Select Major --",
    "هندسة البرمجيات": "Software Engineering",
    "علوم الحاسوب": "Computer Science",
    "نظم المعلومات": "Information Systems",
    "هندسة الحاسوب": "Computer Engineering",
    "عدد الساعات السابقة": "Previous Hours",
    "المعدل السابق (من 5)": "Previous GPA (out of 5)",
    "حساب المعدل التراكمي": "Calculate Cumulative GPA",
    "حساب المعدل الفصلي": "Calculate Semester GPA",
    "المعدل التراكمي = ": "Cumulative GPA = ",
    "المعدل الفصلي = ": "Semester GPA = ",
    "الريت = ": "Rating = ",
    "إعادة التعيين": "Reset",
    "حساب الريت": "Calculate Rating",
    "أدخل الساعات": "Enter Hours",
    "أدخل المعدل": "Enter GPA",
    "داكن": "Dark",
    "فاتح": "Light",
    "عربي": "AR",
    "إنجليزي": "EN",
    "-- اختر التقدير --": "-- Select Grade --",
    "المادة": "Course",
    "يرجى اختيار التخصص!": "Please select a major!",
    "يرجى إدخال معدل تراكمي وإجمالي صحيح!": "Please enter valid GPA and SA!",
    "يرجى إدخال درجات صحيحة!": "Please enter valid grades!",
    "يرجى إدخال ساعات ومعدل سابق صحيح!": "Please enter valid hours and GPA!",
    "يرجى إدخال ساعات ودرجات صحيحة!": "Please enter valid hours and grades!",
    "عدد المواد الجديدة (1-10)": "Number of New Courses (1-10)",
    "الملخص": "Summary"
  }
};

let isDarkMode = false;
let isArabic = true;
let rateChart, cumulativeChart, semesterChart;
let rateValue = null, cumulativeValue = null, semesterValue = null;

// دالة فتح التبويب
function openTab(tabName) {
  const tabs = document.getElementsByClassName("tab-content");
  const buttons = document.getElementsByClassName("tab-button");
  for (let i = 0; i < tabs.length; i++) {
    tabs[i].style.display = "none";
  }
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].classList.remove("active");
  }
  document.getElementById(tabName).style.display = "block";
  event.currentTarget.classList.add("active");
  updateDynamicContent(tabName);
}

// دالة تبديل الوضع (Dark/Light Mode)
function toggleMode() {
  isDarkMode = !isDarkMode;
  document.body.classList.toggle("dark-mode", isDarkMode);
  const modeButton = document.querySelector('.mode-toggle');
  modeButton.textContent = isArabic ? (isDarkMode ? "فاتح" : "داكن") : (isDarkMode ? "Light" : "Dark");
}

// دالة تبديل اللغة
function toggleLanguage() {
  isArabic = !isArabic;
  const langButton = document.querySelector('.language-toggle');
  langButton.textContent = isArabic ? "عربي" : "EN";
  const modeButton = document.querySelector('.mode-toggle');
  modeButton.textContent = isArabic ? (isDarkMode ? "فاتح" : "داكن") : (isDarkMode ? "Light" : "Dark");
  updateAllText();
}

// دالة تحديث النصوص
function updateAllText() {
  const elements = document.querySelectorAll('h2, label, button, .result, select option, input[type="number"], .summary-content p');
  elements.forEach(el => {
    let text = el.textContent || el.value || el.placeholder;
    if (text.includes('=')) text = text.split(' = ')[0];
    if (text.includes(': ')) text = text.split(': ')[0];
    if (text) {
      const translated = isArabic ? translations.ar[text] || text : translations.en[text] || text;
      if (el.tagName === 'OPTION') {
        el.textContent = translated;
      } else if (el.classList.contains('result')) {
        el.innerHTML = translated + ' = <span>' + el.querySelector('span').innerText + '</span>';
      } else if (el.tagName === 'INPUT') {
        el.placeholder = translated;
      } else if (el.tagName === 'P' && el.parentElement.classList.contains('summary-content')) {
        const value = el.querySelector('span').innerText;
        el.innerHTML = translated + ': <span>' + value + '</span>';
      } else {
        el.textContent = translated;
      }
    }
  });
  updateDynamicContent();
}

// دالة تحديث المحتوى الديناميكي
function updateDynamicContent(tabName = null) {
  if (!tabName || tabName === 'original') updateCourses();
  if (!tabName || tabName === 'cumulative') updateCumulativeCourses();
  if (!tabName || tabName === 'semester') updateSemesterCourses();
}

// دالة تحديث مواد حاسبة الريت
function updateCourses() {
  const major = document.getElementById('major').value;
  const coursesDiv = document.getElementById('courses');
  coursesDiv.innerHTML = '';
  if (major) {
    majorCourses[major].forEach((course, index) => {
      const div = document.createElement('div');
      div.className = 'input-group animate__animated animate__fadeIn';
      div.innerHTML = `
        <label>${course.name}</label>
        <select id="grade${index}">
          <option value="">${isArabic ? "-- اختر التقدير --" : "-- Select Grade --"}</option>
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
      coursesDiv.appendChild(div);
    });
  }
}

// دالة تحديث مواد المعدل التراكمي
function updateCumulativeCourses() {
  const numCourses = parseInt(document.getElementById('num-cumulative-courses').value) || 2;
  const cumulativeCoursesDiv = document.getElementById('cumulative-courses');
  cumulativeCoursesDiv.innerHTML = '';
  if (numCourses >= 1 && numCourses <= 10) {
    for (let i = 0; i < numCourses; i++) {
      const div = document.createElement('div');
      div.className = 'input-group animate__animated animate__fadeIn';
      div.innerHTML = `
        <label>${isArabic ? "المادة" : "Course"} ${i + 1}</label>
        <input type="number" id="cumulative-hours${i}" step="1" min="1" placeholder="${isArabic ? "أدخل الساعات" : "Enter Hours"}" style="width: 48%; margin-right: 2%;">
        <select id="cumulative-grade${i}">
          <option value="">${isArabic ? "-- اختر التقدير --" : "-- Select Grade --"}</option>
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
      cumulativeCoursesDiv.appendChild(div);
    }
  }
}

// دالة تحديث مواد المعدل الفصلي
function updateSemesterCourses() {
  const numCourses = parseInt(document.getElementById('num-semester-courses').value) || 2;
  const semesterCoursesDiv = document.getElementById('semester-courses');
  semesterCoursesDiv.innerHTML = '';
  if (numCourses >= 1 && numCourses <= 10) {
    for (let i = 0; i < numCourses; i++) {
      const div = document.createElement('div');
      div.className = 'input-group animate__animated animate__fadeIn';
      div.innerHTML = `
        <label>${isArabic ? "المادة" : "Course"} ${i + 1}</label>
        <input type="number" id="semester-hours${i}" step="1" min="1" placeholder="${isArabic ? "أدخل الساعات" : "Enter Hours"}" style="width: 48%; margin-right: 2%;">
        <select id="semester-grade${i}">
          <option value="">${isArabic ? "-- اختر التقدير --" : "-- Select Grade --"}</option>
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
      semesterCoursesDiv.appendChild(div);
    }
  }
}

// دالة تحديث الملخص
function updateSummary() {
  document.getElementById('summary-rate').innerText = rateValue !== null ? rateValue : '-';
  document.getElementById('summary-cumulative').innerText = cumulativeValue !== null ? cumulativeValue : '-';
  document.getElementById('summary-semester').innerText = semesterValue !== null ? semesterValue : '-';
  document.getElementById('summary').classList.remove('hidden');
  document.getElementById('summary-content').classList.add('animate__animated', 'animate__zoomIn');
}

// دالة تشغيل الصوت
function playResultSound() {
  const sound = document.getElementById('resultSound');
  sound.currentTime = 0;
  sound.play();
}

// دالة حساب الريت المعدلة
function calculateRate() {
  const major = document.getElementById("major").value;
  const gpa = parseFloat(document.getElementById("gpa").value);
  const sa = parseFloat(document.getElementById("sa").value);

  if (!major) {
    alert("يرجى اختيار التخصص!");
    return;
  }
  if (isNaN(gpa) || isNaN(sa) || gpa < 0 || gpa > 5 || sa < 0 || sa > 5) {
    alert("يرجى إدخال معدل تراكمي وإجمالي صحيح!");
    return;
  }

  const [c1, c2] = majorCourses[major];
  const g1 = gradeValues[document.getElementById("grade0").value];
  const g2 = gradeValues[document.getElementById("grade1").value];

  if (g1 === undefined || g2 === undefined) {
    alert("يرجى إدخال درجات صحيحة!");
    return;
  }

  // الصيغة المطلوبة: (gpa + sa + (g1 * c1.weight) + (g2 * c2.weight)) / 3
  const rate = (gpa + sa + (g1 * c1.weight) + (g2 * c2.weight)) / 3;
  rateValue = rate.toFixed(3);
  document.getElementById("rate").innerText = rateValue;
  const resultDiv = document.getElementById("result");
  resultDiv.classList.remove("hidden");
  resultDiv.classList.add("animate__animated", "animate__zoomIn", "glow");
  document.getElementById("rateChart").classList.remove("hidden");
  document.getElementById("rateChart").classList.add("animate__animated", "animate__fadeInUp");

  playResultSound();
  updateSummary();

  if (rateChart) rateChart.destroy();
  const ctx = document.getElementById('rateChart').getContext('2d');
  rateChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['الريت', 'GPA', 'SA'],
      datasets: [{
        label: 'الدرجات',
        data: [rate, gpa, sa],
        backgroundColor: ['#1a73e8', '#34c0eb', '#ff6f61'],
        borderColor: ['#1557b0', '#2ba8d1', '#e05548'],
        borderWidth: 1
      }]
    },
    options: {
      animation: {
        duration: 1500,
        easing: 'easeOutBounce'
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 5
        }
      }
    }
  });
}

// دالة حساب المعدل التراكمي
function calculateCumulativeGPA() {
  const prevHours = parseFloat(document.getElementById("prev-hours").value) || 0;
  const prevGPA = parseFloat(document.getElementById("prev-gpa").value) || 0;
  const numCourses = parseInt(document.getElementById('num-cumulative-courses').value) || 2;

  if (isNaN(prevHours) || prevHours < 0 || isNaN(prevGPA) || prevGPA < 0 || prevGPA > 5) {
    alert(isArabic ? "يرجى إدخال ساعات ومعدل سابق صحيح!" : "Please enter valid hours and GPA!");
    return;
  }

  let newPoints = 0;
  let newHours = 0;
  for (let i = 0; i < numCourses; i++) {
    const hours = parseFloat(document.getElementById(`cumulative-hours${i}`).value) || 0;
    const grade = gradeValues[document.getElementById(`cumulative-grade${i}`).value] || 0;
    if (hours > 0 && grade === 0) {
      alert(isArabic ? "يرجى إدخال درجات صحيحة لجميع المواد!" : "Please enter valid grades for all courses!");
      return;
    }
    newPoints += hours * grade;
    newHours += hours;
  }

  if (newHours === 0) {
    alert(isArabic ? "يرجى إدخال ساعات ودرجات صحيحة!" : "Please enter valid hours and grades!");
    return;
  }

  const totalHours = prevHours + newHours;
  const totalPoints = (prevHours * prevGPA) + newPoints;
  const gpa = totalHours > 0 ? (totalPoints / totalHours).toFixed(3) : 0;
  cumulativeValue = gpa;
  document.getElementById("cumulative-gpa").innerText = gpa;
  const resultDiv = document.getElementById("cumulative-result");
  resultDiv.classList.remove("hidden");
  resultDiv.classList.add("animate__animated", "animate__zoomIn", "glow");
  document.getElementById("cumulativeChart").classList.remove("hidden");
  document.getElementById("cumulativeChart").classList.add("animate__animated", "animate__fadeInUp");

  playResultSound();
  updateSummary();

  if (cumulativeChart) cumulativeChart.destroy();
  const ctx = document.getElementById('cumulativeChart').getContext('2d');
  cumulativeChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: [isArabic ? 'المعدل الجديد' : 'New GPA', isArabic ? 'المعدل السابق' : 'Previous GPA'],
      datasets: [{
        label: isArabic ? 'المعدل' : 'GPA',
        data: [gpa, prevGPA],
        backgroundColor: ['#1a73e8', '#34c0eb'],
        borderColor: ['#1557b0', '#2ba8d1'],
        borderWidth: 1
      }]
    },
    options: {
      animation: {
        duration: 1500,
        easing: 'easeOutBounce'
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 5
        }
      }
    }
  });
}

// دالة حساب المعدل الفصلي
function calculateSemesterGPA() {
  const numCourses = parseInt(document.getElementById('num-semester-courses').value) || 2;
  let totalPoints = 0;
  let totalHours = 0;
  for (let i = 0; i < numCourses; i++) {
    const hours = parseFloat(document.getElementById(`semester-hours${i}`).value) || 0;
    const grade = gradeValues[document.getElementById(`semester-grade${i}`).value] || 0;
    if (hours > 0 && grade === 0) {
      alert(isArabic ? "يرجى إدخال درجات صحيحة لجميع المواد!" : "Please enter valid grades for all courses!");
      return;
    }
    totalPoints += hours * grade;
    totalHours += hours;
  }

  if (totalHours === 0) {
    alert(isArabic ? "يرجى إدخال ساعات ودرجات صحيحة!" : "Please enter valid hours and grades!");
    return;
  }

  const gpa = totalHours > 0 ? (totalPoints / totalHours).toFixed(3) : 0;
  semesterValue = gpa;
  document.getElementById("semester-gpa").innerText = gpa;
  const resultDiv = document.getElementById("semester-result");
  resultDiv.classList.remove("hidden");
  resultDiv.classList.add("animate__animated", "animate__zoomIn", "glow");
  document.getElementById("semesterChart").classList.remove("hidden");
  document.getElementById("semesterChart").classList.add("animate__animated", "animate__fadeInUp");

  playResultSound();
  updateSummary();

  if (semesterChart) semesterChart.destroy();
  const ctx = document.getElementById('semesterChart').getContext('2d');
  semesterChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: [isArabic ? 'المعدل الفصلي' : 'Semester GPA'],
      datasets: [{
        label: isArabic ? 'المعدل' : 'GPA',
        data: [gpa],
        backgroundColor: ['#1a73e8'],
        borderColor: ['#1557b0'],
        borderWidth: 1
      }]
    },
    options: {
      animation: {
        duration: 1500,
        easing: 'easeOutBounce'
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 5
        }
      }
    }
  });
}

// دالة إعادة تعيين التبويب
function resetTab(tabName) {
  if (tabName === 'original') {
    document.getElementById('major').value = '';
    document.getElementById('courses').innerHTML = '';
    document.getElementById('gpa').value = '';
    document.getElementById('sa').value = '';
    document.getElementById('result').classList.add('hidden');
    document.getElementById('rateChart').classList.add('hidden');
    if (rateChart) rateChart.destroy();
    rateValue = null;
  } else if (tabName === 'cumulative') {
    document.getElementById('prev-hours').value = '';
    document.getElementById('prev-gpa').value = '';
    document.getElementById('num-cumulative-courses').value = '2';
    document.getElementById('cumulative-courses').innerHTML = '';
    document.getElementById('cumulative-result').classList.add('hidden');
    document.getElementById('cumulativeChart').classList.add('hidden');
    if (cumulativeChart) cumulativeChart.destroy();
    cumulativeValue = null;
  } else if (tabName === 'semester') {
    document.getElementById('num-semester-courses').value = '2';
    document.getElementById('semester-courses').innerHTML = '';
    document.getElementById('semester-result').classList.add('hidden');
    document.getElementById('semesterChart').classList.add('hidden');
    if (semesterChart) semesterChart.destroy();
    semesterValue = null;
  }
  updateSummary();
}

// دالة تحديث مواد العلوم
function updateScienceCourses() {
  const numCourses = parseInt(document.getElementById('num-science-courses').value) || 2;
  const scienceCoursesDiv = document.getElementById('science-courses');
  scienceCoursesDiv.innerHTML = '';
  if (numCourses >= 1 && numCourses <= 10) {
    for (let i = 0; i < numCourses; i++) {
      const div = document.createElement('div');
      div.className = 'input-group animate__animated animate__fadeIn';
      div.innerHTML = `
        <label>المادة ${i + 1}</label>
        <input type="number" id="science-hours${i}" step="1" min="1" placeholder="أدخل الساعات" style="width: 48%; margin-right: 2%;">
        <select id="science-grade${i}">
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
      scienceCoursesDiv.appendChild(div);
    }
  }
}

// دالة حساب المعدل الكلي للعلوم
function calculateScienceGPA() {
  const numCourses = parseInt(document.getElementById('num-science-courses').value) || 2;
  let totalPoints = 0;
  let totalHours = 0;
  for (let i = 0; i < numCourses; i++) {
    const hours = parseFloat(document.getElementById(`science-hours${i}`).value) || 0;
    const grade = gradeValues[document.getElementById(`science-grade${i}`).value] || 0;
    if (hours > 0 && grade === 0) {
      alert('يرجى إدخال درجات صحيحة لجميع المواد!');
      return;
    }
    totalPoints += hours * grade;
    totalHours += hours;
  }
  if (totalHours === 0) {
    alert('يرجى إدخال ساعات ودرجات صحيحة!');
    return;
  }
  const gpa = totalHours > 0 ? (totalPoints / totalHours).toFixed(3) : 0;
  document.getElementById('science-gpa').innerText = gpa;
  const resultDiv = document.getElementById('science-result');
  resultDiv.classList.remove('hidden');
  resultDiv.classList.add('animate__animated', 'animate__zoomIn', 'glow');
  document.getElementById('scienceChart').classList.remove('hidden');
  document.getElementById('scienceChart').classList.add('animate__animated', 'animate__fadeInUp');
  playResultSound();
  if (window.scienceChart) window.scienceChart.destroy();
  const ctx = document.getElementById('scienceChart').getContext('2d');
  window.scienceChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['معدل كلية العلوم'],
      datasets: [{
        label: 'المعدل',
        data: [gpa],
        backgroundColor: ['#1a73e8'],
        borderColor: ['#1557b0'],
        borderWidth: 1
      }]
    },
    options: {
      animation: {
        duration: 1500,
        easing: 'easeOutBounce'
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 5
        }
      }
    }
  });
}

// دعم إعادة تعيين تبويب العلوم
const oldResetTab = resetTab;
resetTab = function(tabName) {
  if (tabName === 'science') {
    document.getElementById('num-science-courses').value = '2';
    document.getElementById('science-courses').innerHTML = '';
    document.getElementById('science-result').classList.add('hidden');
    document.getElementById('scienceChart').classList.add('hidden');
    if (window.scienceChart) window.scienceChart.destroy();
  } else {
    oldResetTab(tabName);
  }
  updateSummary && updateSummary();
}

// تهيئة تلقائية عند تحميل الصفحة
if (typeof updateScienceCourses === 'function') {
  updateScienceCourses();
} else {
  window.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('science-courses')) updateScienceCourses();
  });
}

// تهيئة الصفحة
document.addEventListener("DOMContentLoaded", function() {
  openTab('original');
  updateDynamicContent();
});

// دالة حساب معدل تخصيص كلية العلوم (كما هي)
function calculateScienceAllocation() {
  const gpa = parseFloat(document.getElementById('sci-gpa').value) || 0;
  const weighted = parseFloat(document.getElementById('sci-weighted').value) || 0;
  const physics = parseFloat(document.getElementById('sci-physics').value) || 0;
  const calc1 = parseFloat(document.getElementById('sci-calc1').value) || 0;
  const calc2 = parseFloat(document.getElementById('sci-calc2').value) || 0;

  if (gpa < 0 || gpa > 5 || weighted < 0 || weighted > 100 || physics < 0 || physics > 100 || calc1 < 0 || calc1 > 100 || calc2 < 0 || calc2 > 100) {
    alert('يرجى إدخال جميع القيم بشكل صحيح!');
    return;
  }

  // المعدل التراكمي يحول إلى 100
  const gpa100 = gpa * 20;
  const result = (gpa100 * 0.5) + (weighted * 0.3) + (physics * 0.1) + (calc1 * 0.05) + (calc2 * 0.05);
  const resultDiv = document.getElementById('science-allocation-result');
  resultDiv.innerHTML = `<div class='result-header'><div class='result-icon success'><i class='fas fa-flask'></i></div><div class='result-content'><h4>معدل تخصيص كلية العلوم</h4></div></div><div class='result-value'>${result.toFixed(3)}</div>`;
  resultDiv.style.display = 'block';
  resultDiv.classList.add('show');
  playResultSound && playResultSound();
}

// دعم إعادة تعيين تبويب معدل تخصيص كلية العلوم
const oldResetTab2 = resetTab;
resetTab = function(tabName) {
  if (tabName === 'science-allocation') {
    document.getElementById('sci-gpa').value = '';
    document.getElementById('sci-weighted').value = '';
    document.getElementById('sci-physics').value = '';
    document.getElementById('sci-calc1').value = '';
    document.getElementById('sci-calc2').value = '';
    document.getElementById('science-allocation-result').classList.add('hidden');
    document.getElementById('science-allocation-value').innerText = '0.000';
  } else {
    oldResetTab2(tabName);
  }
  updateSummary && updateSummary();
}
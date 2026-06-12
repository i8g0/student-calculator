/**
 * حاسبة المعدل الفصلي والتراكمي الموحدة
 * GPA Calculator - Unified Semester and Cumulative GPA
 */

(function () {
    'use strict';

    // التقديرات ونقاطها لنظام من 5 (نظام الجامعات السعودية)
    const GRADES_5 = [
        { label: 'A+', points: 5.00 },
        { label: 'A', points: 4.75 },
        { label: 'B+', points: 4.50 },
        { label: 'B', points: 4.00 },
        { label: 'C+', points: 3.50 },
        { label: 'C', points: 3.00 },
        { label: 'D+', points: 2.50 },
        { label: 'D', points: 2.00 },
        { label: 'F', points: 0.00 }
    ];

    // التقديرات ونقاطها لنظام من 4
    const GRADES_4 = [
        { label: 'A+', points: 4.00 },
        { label: 'A', points: 4.00 },
        { label: 'B+', points: 3.50 },
        { label: 'B', points: 3.00 },
        { label: 'C+', points: 2.50 },
        { label: 'C', points: 2.00 },
        { label: 'D+', points: 1.50 },
        { label: 'D', points: 1.00 },
        { label: 'F', points: 0.00 }
    ];

    // خيارات ساعات المادة (من 1 إلى 10)
    const COURSE_HOURS_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    // عدد الصفوف الافتراضي
    const DEFAULT_ROWS = 7;
    const MAX_ROWS = 12;

    // المتغيرات
    let currentGpaScale = 5;
    let courseRows = [];
    let currentCourseCount = DEFAULT_ROWS;

    // ========== نظام حفظ السجل (History/Autocomplete) ==========
    const HISTORY_KEY = 'gpaCoursesHistory';

    /** تحميل السجل من localStorage */
    function loadHistory() {
        try {
            return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
        } catch {
            return [];
        }
    }

    /** حفظ مادة واحدة في السجل (بدون تكرار الاسم) */
    function saveToHistory(name, grade, hours) {
        if (!name || name.trim() === '') return;
        let history = loadHistory();
        // حذف نسخة قديمة بنفس الاسم
        history = history.filter(h => h.name.toLowerCase() !== name.toLowerCase());
        // إضافة في البداية
        history.unshift({ name: name.trim(), grade, hours, savedAt: Date.now() });
        // الحد الأقصى 100 مادة
        if (history.length > 100) history = history.slice(0, 100);
        localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    }

    /** حفظ جميع المواد الحالية في السجل */
    function saveAllCurrentCourses() {
        courseRows.forEach((row, index) => {
            const i = index + 1;
            const checkbox = document.getElementById(`gpa-check-${i}`);
            if (!checkbox?.checked) return;
            const name = document.getElementById(`gpa-name-${i}`)?.value?.trim();
            const grade = document.getElementById(`gpa-grade-${i}`)?.value || '';
            const hours = document.getElementById(`gpa-hours-${i}`)?.value || '';
            if (name) saveToHistory(name, grade, hours);
        });
    }

    /**
     * تهيئة الحاسبة
     */
    function initGpaCalculator() {
        const container = document.getElementById('gpa-courses-container');
        if (!container) {
            if (document.readyState !== 'complete') {
                window.addEventListener('load', initGpaCalculator);
                return;
            }
            console.warn('GPA Calculator: Container not found');
            return;
        }

        // إنشاء أزرار اختيار عدد المواد
        createCourseCountButtons();

        // إنشاء خيارات الساعات السابقة
        createPrevHoursOptions();

        // إنشاء الصفوف
        createCourseRows(DEFAULT_ROWS);

        // ربط الأحداث
        bindEvents();

        console.log('GPA Calculator initialized successfully');
    }

    /**
     * إنشاء أزرار اختيار عدد المواد (1-12)
     */
    function createCourseCountButtons() {
        const container = document.getElementById('gpa-courses-options');
        if (!container) return;

        container.innerHTML = '';

        for (let i = 1; i <= MAX_ROWS; i++) {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'gpa-course-count-btn' + (i === DEFAULT_ROWS ? ' active' : '');
            btn.textContent = i;
            btn.dataset.count = i;
            btn.addEventListener('click', () => {
                container.querySelectorAll('.gpa-course-count-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentCourseCount = i;
                createCourseRows(i);
            });
            container.appendChild(btn);
        }
    }

    /**
     * إنشاء خيارات الساعات السابقة (0-160)
     */
    function createPrevHoursOptions() {
        const select = document.getElementById('gpa-prev-hours');
        if (!select) return;

        select.innerHTML = '';

        // إضافة خيار 0
        const zeroOption = document.createElement('option');
        zeroOption.value = '0';
        zeroOption.textContent = '0';
        select.appendChild(zeroOption);

        // إضافة الساعات من 3 إلى 160 (بزيادة 3)
        for (let i = 3; i <= 160; i += 3) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i;
            select.appendChild(option);
        }
    }

    /**
     * إنشاء صفوف المواد
     */
    function createCourseRows(count) {
        const container = document.getElementById('gpa-courses-container');
        if (!container) return;

        container.innerHTML = '';
        courseRows = [];

        for (let i = 1; i <= count; i++) {
            const row = createCourseRow(i);
            container.appendChild(row);
            courseRows.push(row);
        }
    }

    /**
     * إنشاء صف مادة واحد
     */
    function createCourseRow(index) {
        const row = document.createElement('div');
        row.className = 'gpa-course-row';
        row.dataset.index = index;

        const grades = currentGpaScale === 5 ? GRADES_5 : GRADES_4;
        const gradeOptions = grades.map(g => `<option value="${g.label}">${g.label}</option>`).join('');
        const hoursOptions = COURSE_HOURS_OPTIONS.map(h => `<option value="${h}">${h}</option>`).join('');

        row.innerHTML = `
            <!-- خانة الاختيار -->
            <div class="gpa-checkbox-cell">
                <input type="checkbox" class="gpa-course-checkbox" id="gpa-check-${index}" checked>
            </div>
            
            <!-- اسم المادة -->
            <div class="gpa-course-name-cell" style="position: relative;">
                <input type="text" class="gpa-course-name-input" 
                       id="gpa-name-${index}" 
                       placeholder="مادة رقم ${index}"
                       autocomplete="off">
                <div class="gpa-autocomplete-list" id="gpa-autocomplete-${index}" style="
                    display: none;
                    position: absolute;
                    top: 100%;
                    right: 0;
                    left: 0;
                    background: var(--bg-primary, #fff);
                    border: 2px solid var(--primary, #6366f1);
                    border-top: none;
                    border-radius: 0 0 12px 12px;
                    max-height: 220px;
                    overflow-y: auto;
                    z-index: 999;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.15);
                "></div>
            </div>
            
            <!-- التقدير -->
            <div class="gpa-input-cell" data-label="التقدير">
                <select class="gpa-select-field gpa-grade-select" id="gpa-grade-${index}">
                    <option value="">---</option>
                    ${gradeOptions}
                </select>
            </div>
            
            <!-- عدد الساعات -->
            <div class="gpa-input-cell" data-label="عدد الساعات">
                <select class="gpa-select-field gpa-hours-select" id="gpa-hours-${index}">
                    <option value="">---</option>
                    ${hoursOptions}
                </select>
            </div>
        `;

        // ربط أحداث الصف
        const checkbox = row.querySelector('.gpa-course-checkbox');
        checkbox.addEventListener('change', () => updateRowState(row, checkbox.checked));

        // ربط أحداث الاقتراحات (Autocomplete)
        const nameInput = row.querySelector('.gpa-course-name-input');
        const autocompleteList = row.querySelector('.gpa-autocomplete-list');
        setupAutocomplete(nameInput, autocompleteList, index);

        return row;
    }

    /**
     * ربط أحداث الاقتراحات التلقائية
     */
    function setupAutocomplete(input, listEl, rowIndex) {
        if (!input || !listEl) return;

        // عند الكتابة
        input.addEventListener('input', function () {
            const query = this.value.trim().toLowerCase();
            const history = loadHistory();

            if (query.length === 0 || history.length === 0) {
                listEl.style.display = 'none';
                return;
            }

            const filtered = history.filter(h =>
                h.name.toLowerCase().includes(query)
            ).slice(0, 8);

            if (filtered.length === 0) {
                listEl.style.display = 'none';
                return;
            }

            listEl.innerHTML = filtered.map(h => `
                <div class="gpa-autocomplete-item" data-name="${h.name}" data-grade="${h.grade || ''}" data-hours="${h.hours || ''}" style="
                    padding: 10px 14px;
                    cursor: pointer;
                    transition: background 0.15s;
                    border-bottom: 1px solid rgba(0,0,0,0.06);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 8px;
                ">
                    <div style="flex: 1;">
                        <div style="font-weight: 600; font-size: 0.95rem; color: var(--text-primary, #1e293b);">${h.name}</div>
                        ${(h.grade || h.hours) ? `<div style="font-size: 0.78rem; color: var(--text-muted, #94a3b8); margin-top: 2px;">التقدير: ${h.grade || '—'}  •  الساعات: ${h.hours || '—'}</div>` : ''}
                    </div>
                    <i class="fas fa-history" style="color: var(--primary, #6366f1); font-size: 0.8rem; opacity: 0.5;"></i>
                </div>
            `).join('');

            listEl.style.display = 'block';

            // عند الضغط على اقتراح
            listEl.querySelectorAll('.gpa-autocomplete-item').forEach(item => {
                item.addEventListener('click', function () {
                    const name = this.dataset.name;
                    const grade = this.dataset.grade;
                    const hours = this.dataset.hours;

                    input.value = name;

                    // تعبئة التقدير والساعات تلقائياً
                    const gradeSelect = document.getElementById(`gpa-grade-${rowIndex}`);
                    const hoursSelect = document.getElementById(`gpa-hours-${rowIndex}`);

                    if (gradeSelect && grade) {
                        gradeSelect.value = grade;
                    }
                    if (hoursSelect && hours) {
                        hoursSelect.value = hours;
                    }

                    listEl.style.display = 'none';
                });

                item.addEventListener('mouseenter', function () {
                    this.style.background = 'var(--bg-secondary, #f1f5f9)';
                });
                item.addEventListener('mouseleave', function () {
                    this.style.background = 'transparent';
                });
            });
        });

        // عند التركيز - عرض كل السجل
        input.addEventListener('focus', function () {
            const history = loadHistory();
            const query = this.value.trim().toLowerCase();

            if (history.length === 0) return;

            const filtered = query.length > 0
                ? history.filter(h => h.name.toLowerCase().includes(query)).slice(0, 8)
                : history.slice(0, 8);

            if (filtered.length === 0) return;

            listEl.innerHTML = filtered.map(h => `
                <div class="gpa-autocomplete-item" data-name="${h.name}" data-grade="${h.grade || ''}" data-hours="${h.hours || ''}" style="
                    padding: 10px 14px;
                    cursor: pointer;
                    transition: background 0.15s;
                    border-bottom: 1px solid rgba(0,0,0,0.06);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 8px;
                ">
                    <div style="flex: 1;">
                        <div style="font-weight: 600; font-size: 0.95rem; color: var(--text-primary, #1e293b);">${h.name}</div>
                        ${(h.grade || h.hours) ? `<div style="font-size: 0.78rem; color: var(--text-muted, #94a3b8); margin-top: 2px;">التقدير: ${h.grade || '—'}  •  الساعات: ${h.hours || '—'}</div>` : ''}
                    </div>
                    <i class="fas fa-history" style="color: var(--primary, #6366f1); font-size: 0.8rem; opacity: 0.5;"></i>
                </div>
            `).join('');

            listEl.style.display = 'block';

            listEl.querySelectorAll('.gpa-autocomplete-item').forEach(item => {
                item.addEventListener('click', function () {
                    const name = this.dataset.name;
                    const grade = this.dataset.grade;
                    const hours = this.dataset.hours;

                    input.value = name;
                    const gradeSelect = document.getElementById(`gpa-grade-${rowIndex}`);
                    const hoursSelect = document.getElementById(`gpa-hours-${rowIndex}`);
                    if (gradeSelect && grade) gradeSelect.value = grade;
                    if (hoursSelect && hours) hoursSelect.value = hours;
                    listEl.style.display = 'none';
                });

                item.addEventListener('mouseenter', function () {
                    this.style.background = 'var(--bg-secondary, #f1f5f9)';
                });
                item.addEventListener('mouseleave', function () {
                    this.style.background = 'transparent';
                });
            });
        });

        // إخفاء القائمة عند الضغط خارجها
        document.addEventListener('click', function (e) {
            if (e.target !== input && !listEl.contains(e.target)) {
                listEl.style.display = 'none';
            }
        });

        input.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') listEl.style.display = 'none';
        });
    }

    /**
     * الحصول على لون التقدير
     */
    function getGradeColor(grade) {
        const colors = {
            'A+': '#10b981',
            'A': '#10b981',
            'B+': '#3b82f6',
            'B': '#3b82f6',
            'C+': '#f59e0b',
            'C': '#f59e0b',
            'D+': '#ef4444',
            'D': '#ef4444',
            'F': '#dc2626'
        };
        return colors[grade] || 'var(--primary)';
    }

    /**
     * تحديث حالة الصف (تفعيل/تعطيل)
     */
    function updateRowState(row, enabled) {
        const inputs = row.querySelectorAll('input:not([type="checkbox"]), select');
        inputs.forEach(input => {
            input.disabled = !enabled;
            input.style.opacity = enabled ? '1' : '0.5';
        });
        row.style.opacity = enabled ? '1' : '0.6';
    }

    /**
     * ربط الأحداث
     */
    function bindEvents() {
        // زر الحساب
        const calculateBtn = document.getElementById('gpa-calculate-btn');
        if (calculateBtn) {
            calculateBtn.addEventListener('click', calculateGpa);
        }

        // زر إعادة التعيين
        const resetBtn = document.getElementById('gpa-reset-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', resetCalculator);
        }

        // زر إضافة مادة
        const addRowBtn = document.getElementById('gpa-add-row-btn');
        if (addRowBtn) {
            addRowBtn.addEventListener('click', addNewRow);
        }

        // زر التصدير
        const exportBtn = document.getElementById('gpa-export-btn');
        if (exportBtn) {
            exportBtn.addEventListener('click', exportResults);
        }

        // تغيير نوع المعدل
        const gpaTypeInputs = document.querySelectorAll('input[name="gpa-type"]');
        gpaTypeInputs.forEach(input => {
            input.addEventListener('change', (e) => {
                currentGpaScale = parseInt(e.target.value);
                // تحديث حد المعدل السابق
                const prevGpaInput = document.getElementById('gpa-prev-gpa');
                if (prevGpaInput) {
                    prevGpaInput.max = currentGpaScale;
                    prevGpaInput.placeholder = `0.00`;
                }
                // إعادة إنشاء الصفوف مع التقديرات الجديدة
                createCourseRows(currentCourseCount);
            });
        });
    }

    /**
     * حساب المعدل
     */
    function calculateGpa() {
        const prevHours = parseFloat(document.getElementById('gpa-prev-hours')?.value) || 0;
        const prevGpa = parseFloat(document.getElementById('gpa-prev-gpa')?.value) || 0;

        // حساب النقاط السابقة من المعدل السابق والساعات السابقة
        const prevPoints = prevHours * prevGpa;

        let semesterHours = 0;
        let semesterPoints = 0;
        let validCourses = 0;

        const grades = currentGpaScale === 5 ? GRADES_5 : GRADES_4;

        // حساب نقاط الفصل الحالي
        courseRows.forEach((row, index) => {
            const i = index + 1;
            const checkbox = document.getElementById(`gpa-check-${i}`);
            const gradeSelect = document.getElementById(`gpa-grade-${i}`);
            const hoursSelect = document.getElementById(`gpa-hours-${i}`);

            if (!checkbox?.checked) return;

            const gradeLabel = gradeSelect?.value;
            const hours = parseInt(hoursSelect?.value);

            if (!gradeLabel || isNaN(hours) || hours < 1) return;

            // إيجاد نقاط التقدير
            const gradeInfo = grades.find(g => g.label === gradeLabel);
            if (!gradeInfo) return;

            semesterHours += hours;
            semesterPoints += (gradeInfo.points * hours);
            validCourses++;
        });

        // حفظ جميع المواد في السجل للاستخدام لاحقاً
        saveAllCurrentCourses();

        // حساب المعدل الفصلي
        const semesterGpa = semesterHours > 0 ? (semesterPoints / semesterHours) : 0;

        // حساب المعدل التراكمي
        const totalHours = prevHours + semesterHours;
        const totalPoints = prevPoints + semesterPoints;
        const cumulativeGpa = totalHours > 0 ? (totalPoints / totalHours) : 0;

        // عرض النتائج
        displayResults({
            semesterHours,
            semesterPoints,
            semesterGpa,
            totalHours,
            totalPoints,
            cumulativeGpa,
            validCourses
        });
    }

    /**
     * عرض النتائج
     */
    function displayResults(results) {
        const resultsSection = document.getElementById('gpa-results-section');
        if (!resultsSection) return;

        resultsSection.style.display = 'block';

        const semesterHoursEl = document.getElementById('gpa-semester-hours');
        const semesterPointsEl = document.getElementById('gpa-semester-points');
        const semesterGpaEl = document.getElementById('gpa-semester-gpa');

        if (semesterHoursEl) semesterHoursEl.textContent = results.semesterHours;
        if (semesterPointsEl) semesterPointsEl.textContent = results.semesterPoints.toFixed(2);
        if (semesterGpaEl) semesterGpaEl.textContent = results.semesterGpa.toFixed(2);

        const cumulativeGpaEl = document.getElementById('gpa-cumulative-gpa');
        const cumulativeGradeEl = document.getElementById('gpa-cumulative-grade');

        if (cumulativeGpaEl) {
            cumulativeGpaEl.textContent = results.cumulativeGpa.toFixed(2) + ' من ' + currentGpaScale;
        }

        if (cumulativeGradeEl) {
            cumulativeGradeEl.textContent = getGradeLabel(results.cumulativeGpa);
            cumulativeGradeEl.style.background = getGradeGradient(results.cumulativeGpa);
        }

        // تحديث التحليل البصري
        updateVisualAnalysis(results.cumulativeGpa, results.semesterGpa);

        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'center' });

        if (typeof showToast === 'function') {
            showToast('تم حساب المعدل بنجاح!', 'success');
        }
    }

    /**
     * تحديث التحليل البصري
     */
    function updateVisualAnalysis(cumulativeGpa, semesterGpa) {
        const maxGpa = currentGpaScale;
        const percentage = (cumulativeGpa / maxGpa) * 100;

        // تحديث مقياس التقدم الدائري
        const ringProgress = document.getElementById('gpa-ring-progress');
        const ringValue = document.getElementById('gpa-ring-value');
        const ringLabel = document.querySelector('.ring-label');

        if (ringProgress) {
            // حساب stroke-dashoffset (327 هو محيط الدائرة)
            const circumference = 327;
            const offset = circumference - (percentage / 100) * circumference;
            ringProgress.style.strokeDashoffset = offset;

            // تغيير لون الحلقة حسب المعدل
            const ratio = cumulativeGpa / maxGpa;
            if (ratio >= 0.85) {
                ringProgress.style.stroke = '#10b981';
            } else if (ratio >= 0.70) {
                ringProgress.style.stroke = '#3b82f6';
            } else if (ratio >= 0.60) {
                ringProgress.style.stroke = '#f59e0b';
            } else {
                ringProgress.style.stroke = '#ef4444';
            }
        }

        if (ringValue) {
            ringValue.textContent = cumulativeGpa.toFixed(2);
        }

        if (ringLabel) {
            ringLabel.textContent = 'من ' + maxGpa;
        }

        // تحديث ملخص الأداء
        const performanceIcon = document.getElementById('gpa-performance-icon');
        const performanceText = document.getElementById('gpa-performance-text');
        const ratio = cumulativeGpa / maxGpa;

        let icon = '📊';
        let text = '';

        if (ratio >= 0.95) {
            icon = '🌟';
            text = 'أداء متميز!\nاستمر على هذا المستوى';
        } else if (ratio >= 0.85) {
            icon = '⭐';
            text = 'أداء ممتاز!\nأنت قريب من القمة';
        } else if (ratio >= 0.75) {
            icon = '👍';
            text = 'أداء جيد جداً\nيمكنك التحسن أكثر';
        } else if (ratio >= 0.65) {
            icon = '📚';
            text = 'أداء جيد\nضع خطة للتحسين';
        } else if (ratio >= 0.50) {
            icon = '💪';
            text = 'يحتاج جهد\nلا تستسلم!';
        } else {
            icon = '⚠️';
            text = 'تحتاج مساعدة\nتواصل مع مرشدك';
        }

        if (performanceIcon) performanceIcon.textContent = icon;
        if (performanceText) performanceText.textContent = text;

        // تحديث النصيحة السريعة
        const tipText = document.getElementById('gpa-tip-text');
        const tips = [
            'المراجعة المبكرة تزيد فرص النجاح بنسبة 40%',
            'قسّم دراستك على فترات قصيرة مع استراحات',
            'النوم الجيد يحسن الذاكرة والتركيز',
            'اشرح ما تعلمته لشخص آخر لتثبيت المعلومة',
            'استخدم تقنية بومودورو: 25 دقيقة دراسة، 5 دقائق راحة',
            'اكتب ملاحظاتك بخط اليد لتذكر أفضل',
            'ابدأ بالمواد الصعبة وأنت في قمة تركيزك'
        ];

        if (tipText) {
            const randomTip = tips[Math.floor(Math.random() * tips.length)];
            tipText.textContent = randomTip;
        }
    }

    /**
     * الحصول على تسمية التقدير من المعدل
     */
    function getGradeLabel(gpa) {
        const maxGpa = currentGpaScale;
        const ratio = gpa / maxGpa;

        if (ratio >= 0.95) return 'ممتاز مرتفع';
        if (ratio >= 0.90) return 'ممتاز';
        if (ratio >= 0.85) return 'جيد جداً مرتفع';
        if (ratio >= 0.80) return 'جيد جداً';
        if (ratio >= 0.75) return 'جيد مرتفع';
        if (ratio >= 0.70) return 'جيد';
        if (ratio >= 0.65) return 'مقبول مرتفع';
        if (ratio >= 0.60) return 'مقبول';
        return 'راسب';
    }

    /**
     * الحصول على تدرج لون التقدير
     */
    function getGradeGradient(gpa) {
        const maxGpa = currentGpaScale;
        const ratio = gpa / maxGpa;

        if (ratio >= 0.85) return 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
        if (ratio >= 0.70) return 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)';
        if (ratio >= 0.60) return 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
        return 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
    }

    /**
     * إعادة تعيين الحاسبة
     */
    function resetCalculator() {
        const prevHoursInput = document.getElementById('gpa-prev-hours');
        const prevGpaInput = document.getElementById('gpa-prev-gpa');

        if (prevHoursInput) prevHoursInput.value = '0';
        if (prevGpaInput) prevGpaInput.value = '';

        currentCourseCount = DEFAULT_ROWS;

        const countButtons = document.querySelectorAll('.gpa-course-count-btn');
        countButtons.forEach(btn => {
            btn.classList.remove('active');
            if (parseInt(btn.dataset.count) === DEFAULT_ROWS) {
                btn.classList.add('active');
            }
        });

        createCourseRows(DEFAULT_ROWS);

        const resultsSection = document.getElementById('gpa-results-section');
        if (resultsSection) resultsSection.style.display = 'none';

        if (typeof showToast === 'function') {
            showToast('تم مسح جميع البيانات', 'info');
        }
    }

    /**
     * إضافة صف جديد
     */
    function addNewRow() {
        if (courseRows.length >= MAX_ROWS) {
            if (typeof showToast === 'function') {
                showToast('لا يمكن إضافة أكثر من 12 مادة', 'warning');
            }
            return;
        }

        const container = document.getElementById('gpa-courses-container');
        if (!container) return;

        const newIndex = courseRows.length + 1;
        const row = createCourseRow(newIndex);
        container.appendChild(row);
        courseRows.push(row);

        currentCourseCount = newIndex;
        const countButtons = document.querySelectorAll('.gpa-course-count-btn');
        countButtons.forEach(btn => {
            btn.classList.remove('active');
            if (parseInt(btn.dataset.count) === newIndex) {
                btn.classList.add('active');
            }
        });

        row.scrollIntoView({ behavior: 'smooth', block: 'center' });

        const nameInput = row.querySelector('.gpa-course-name-input');
        if (nameInput) nameInput.focus();
    }

    /**
     * تصدير النتائج
     */
    function exportResults() {
        const resultsSection = document.getElementById('gpa-results-section');
        if (!resultsSection || resultsSection.style.display === 'none') {
            if (typeof showToast === 'function') {
                showToast('الرجاء حساب المعدل أولاً', 'warning');
            }
            return;
        }

        const printContent = generatePrintContent();
        const printWindow = window.open('', '_blank');
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.print();
    }

    /**
     * إنشاء محتوى الطباعة
     */
    function generatePrintContent() {
        const gpaTypeLabel = currentGpaScale === 5 ? 'من 5' : 'من 4';
        const semesterHours = document.getElementById('gpa-semester-hours')?.textContent || '-';
        const semesterPoints = document.getElementById('gpa-semester-points')?.textContent || '-';
        const semesterGpa = document.getElementById('gpa-semester-gpa')?.textContent || '-';
        const cumulativeGpa = document.getElementById('gpa-cumulative-gpa')?.textContent || '-';
        const cumulativeGrade = document.getElementById('gpa-cumulative-grade')?.textContent || '-';

        // تجميع بيانات المواد وإحصائيات التقديرات
        let coursesHtml = '';
        let gradeStats = { 'A+': 0, 'A': 0, 'B+': 0, 'B': 0, 'C+': 0, 'C': 0, 'D+': 0, 'D': 0, 'F': 0 };
        let totalCourses = 0;
        let bestGrade = '';
        let worstGrade = '';
        const gradeOrder = ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D+', 'D', 'F'];

        courseRows.forEach((row, index) => {
            const i = index + 1;
            const checkbox = document.getElementById(`gpa-check-${i}`);
            if (!checkbox?.checked) return;

            const name = document.getElementById(`gpa-name-${i}`)?.value || `مادة رقم ${i}`;
            const grade = document.getElementById(`gpa-grade-${i}`)?.value || '-';
            const hours = document.getElementById(`gpa-hours-${i}`)?.value || '-';

            if (grade !== '-' && hours !== '-' && grade !== '' && hours !== '') {
                const gradeColor = getGradeColorForPrint(grade);
                coursesHtml += `
                    <tr>
                        <td class="course-name">${name}</td>
                        <td class="grade-cell" style="background: ${gradeColor};">${grade}</td>
                        <td class="hours-cell">${hours}</td>
                    </tr>
                `;

                if (gradeStats[grade] !== undefined) {
                    gradeStats[grade]++;
                    totalCourses++;

                    // تحديد أفضل وأسوأ تقدير
                    if (!bestGrade || gradeOrder.indexOf(grade) < gradeOrder.indexOf(bestGrade)) {
                        bestGrade = grade;
                    }
                    if (!worstGrade || gradeOrder.indexOf(grade) > gradeOrder.indexOf(worstGrade)) {
                        worstGrade = grade;
                    }
                }
            }
        });

        // إنشاء رسم بياني للتقديرات
        let chartBars = '';
        const maxCount = Math.max(...Object.values(gradeStats), 1);
        Object.entries(gradeStats).forEach(([grade, count]) => {
            if (count > 0) {
                const percentage = (count / maxCount) * 100;
                const color = getGradeColorForPrint(grade);
                chartBars += `
                    <div class="chart-bar-container">
                        <div class="chart-label">${grade}</div>
                        <div class="chart-bar-wrapper">
                            <div class="chart-bar" style="width: ${percentage}%; background: ${color};"></div>
                        </div>
                        <div class="chart-count">${count}</div>
                    </div>
                `;
            }
        });

        // تحليل الأداء والنصائح
        const gpaValue = parseFloat(semesterGpa) || 0;
        const maxGpa = currentGpaScale;
        const performancePercentage = ((gpaValue / maxGpa) * 100).toFixed(1);

        let performanceLevel = '';
        let performanceColor = '';
        let tips = [];

        if (gpaValue >= maxGpa * 0.95) {
            performanceLevel = 'أداء متميز! 🌟';
            performanceColor = '#10b981';
            tips = [
                'حافظ على هذا المستوى الرائع!',
                'شارك تجربتك مع زملائك لمساعدتهم',
                'فكر في المشاركة بأنشطة بحثية أو مشاريع إضافية'
            ];
        } else if (gpaValue >= maxGpa * 0.85) {
            performanceLevel = 'أداء ممتاز! ⭐';
            performanceColor = '#22c55e';
            tips = [
                'أنت قريب من القمة، استمر!',
                'ركز على المواد التي حصلت فيها على B+ لرفعها',
                'نظم وقتك بشكل أفضل للمراجعة المبكرة'
            ];
        } else if (gpaValue >= maxGpa * 0.75) {
            performanceLevel = 'أداء جيد جداً 👍';
            performanceColor = '#3b82f6';
            tips = [
                'لديك إمكانيات كبيرة للتحسن',
                'حدد المواد الأضعف واعمل على تقويتها',
                'استخدم أسلوب الدراسة النشطة والمراجعة الدورية'
            ];
        } else if (gpaValue >= maxGpa * 0.65) {
            performanceLevel = 'أداء جيد 📚';
            performanceColor = '#f59e0b';
            tips = [
                'هناك مجال كبير للتحسن',
                'ضع خطة دراسية واضحة للفصل القادم',
                'استعن بالمصادر الإضافية والدروس الخصوصية إن لزم'
            ];
        } else {
            performanceLevel = 'يحتاج تحسين 💪';
            performanceColor = '#ef4444';
            tips = [
                'لا تيأس! كل فصل هو فرصة جديدة',
                'تواصل مع المرشد الأكاديمي للحصول على نصائح',
                'ركز على فهم الأساسيات قبل التفاصيل'
            ];
        }

        let tipsHtml = tips.map(tip => `<li>${tip}</li>`).join('');

        // حساب النقاط المطلوبة للوصول لمعدل معين
        const prevHours = parseFloat(document.getElementById('gpa-prev-hours')?.value) || 0;
        const prevGpa = parseFloat(document.getElementById('gpa-prev-gpa')?.value) || 0;
        const currentHours = parseFloat(semesterHours) || 0;
        const totalHours = prevHours + currentHours;

        let goalSection = '';
        if (gpaValue < maxGpa * 0.95) {
            const targetGpa = Math.min(gpaValue + 0.2, maxGpa);
            const pointsNeeded = (targetGpa * totalHours) - (parseFloat(semesterPoints) || 0) - (prevGpa * prevHours);
            goalSection = `
                <div class="goal-box">
                    <h4>🎯 هدفك القادم</h4>
                    <p>للوصول لمعدل <strong>${targetGpa.toFixed(2)}</strong>، تحتاج تحسين بمقدار <strong>${(targetGpa - gpaValue).toFixed(2)}</strong> نقطة</p>
                </div>
            `;
        }

        return `
            <!DOCTYPE html>
            <html lang="ar" dir="rtl">
            <head>
                <meta charset="UTF-8">
                <title>تقرير المعدل - حاسبة الطالب</title>
                <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap" rel="stylesheet">
                <style>
                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }
                    
                    body {
                        font-family: 'Cairo', 'Segoe UI', sans-serif;
                        background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
                        min-height: 100vh;
                        padding: 20px;
                        color: #1e293b;
                    }
                    
                    .container {
                        max-width: 800px;
                        margin: 0 auto;
                        background: white;
                        border-radius: 24px;
                        overflow: hidden;
                        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
                    }
                    
                    .header {
                        background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%);
                        color: white;
                        padding: 30px;
                        text-align: center;
                        position: relative;
                        overflow: hidden;
                    }
                    
                    .header::before {
                        content: '';
                        position: absolute;
                        top: -50%;
                        left: -50%;
                        width: 200%;
                        height: 200%;
                        background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 60%);
                    }
                    
                    .header h1 {
                        font-size: 2rem;
                        font-weight: 800;
                        margin-bottom: 8px;
                        position: relative;
                    }
                    
                    .header .subtitle {
                        opacity: 0.9;
                        font-size: 1rem;
                    }
                    
                    .header .date {
                        position: absolute;
                        top: 15px;
                        left: 20px;
                        font-size: 0.85rem;
                        opacity: 0.8;
                    }
                    
                    .content {
                        padding: 30px;
                    }
                    
                    .main-result {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 20px;
                        margin-bottom: 30px;
                    }
                    
                    .result-card {
                        background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
                        border-radius: 16px;
                        padding: 20px;
                        text-align: center;
                        border: 2px solid #e2e8f0;
                    }
                    
                    .result-card.primary {
                        grid-column: span 2;
                        background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
                        color: white;
                        border: none;
                    }
                    
                    .result-card .label {
                        font-size: 0.9rem;
                        opacity: 0.8;
                        margin-bottom: 5px;
                    }
                    
                    .result-card .value {
                        font-size: 2rem;
                        font-weight: 800;
                    }
                    
                    .result-card .badge {
                        display: inline-block;
                        background: rgba(255,255,255,0.2);
                        padding: 6px 16px;
                        border-radius: 20px;
                        margin-top: 10px;
                        font-weight: 600;
                    }
                    
                    .section-title {
                        font-size: 1.2rem;
                        font-weight: 700;
                        color: #6366f1;
                        margin: 25px 0 15px;
                        display: flex;
                        align-items: center;
                        gap: 10px;
                    }
                    
                    .courses-table {
                        width: 100%;
                        border-collapse: collapse;
                        border-radius: 12px;
                        overflow: hidden;
                        box-shadow: 0 4px 15px rgba(0,0,0,0.05);
                    }
                    
                    .courses-table thead {
                        background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
                        color: white;
                    }
                    
                    .courses-table th {
                        padding: 15px;
                        font-weight: 600;
                        text-align: center;
                    }
                    
                    .courses-table td {
                        padding: 12px 15px;
                        border-bottom: 1px solid #f1f5f9;
                    }
                    
                    .courses-table tbody tr:nth-child(even) {
                        background: #f8fafc;
                    }
                    
                    .courses-table .course-name {
                        font-weight: 600;
                        color: #1e293b;
                    }
                    
                    .courses-table .grade-cell {
                        text-align: center;
                        font-weight: 700;
                        color: white;
                        border-radius: 8px;
                        padding: 8px 15px;
                    }
                    
                    .courses-table .hours-cell {
                        text-align: center;
                        font-weight: 600;
                        color: #6366f1;
                    }
                    
                    .two-columns {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 25px;
                        margin-top: 25px;
                    }
                    
                    .analysis-box {
                        background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
                        border-radius: 16px;
                        padding: 20px;
                        border: 2px solid #e2e8f0;
                    }
                    
                    .performance-indicator {
                        text-align: center;
                        padding: 15px;
                        background: white;
                        border-radius: 12px;
                        margin-bottom: 15px;
                    }
                    
                    .performance-indicator .emoji {
                        font-size: 2.5rem;
                    }
                    
                    .performance-indicator .level {
                        font-size: 1.1rem;
                        font-weight: 700;
                        margin-top: 5px;
                    }
                    
                    .performance-indicator .percentage {
                        font-size: 0.9rem;
                        color: #64748b;
                    }
                    
                    .chart-container {
                        margin-top: 15px;
                    }
                    
                    .chart-bar-container {
                        display: flex;
                        align-items: center;
                        margin-bottom: 8px;
                        gap: 10px;
                    }
                    
                    .chart-label {
                        width: 30px;
                        font-weight: 700;
                        font-size: 0.85rem;
                    }
                    
                    .chart-bar-wrapper {
                        flex: 1;
                        height: 20px;
                        background: #e2e8f0;
                        border-radius: 10px;
                        overflow: hidden;
                    }
                    
                    .chart-bar {
                        height: 100%;
                        border-radius: 10px;
                        transition: width 0.5s ease;
                    }
                    
                    .chart-count {
                        width: 25px;
                        text-align: center;
                        font-weight: 600;
                        color: #64748b;
                    }
                    
                    .tips-box {
                        background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
                        border: 2px solid #a7f3d0;
                        border-radius: 16px;
                        padding: 20px;
                    }
                    
                    .tips-box h4 {
                        color: #059669;
                        margin-bottom: 12px;
                        display: flex;
                        align-items: center;
                        gap: 8px;
                    }
                    
                    .tips-box ul {
                        list-style: none;
                        padding: 0;
                    }
                    
                    .tips-box li {
                        padding: 8px 0;
                        padding-right: 25px;
                        position: relative;
                        color: #065f46;
                        border-bottom: 1px solid #a7f3d0;
                    }
                    
                    .tips-box li:last-child {
                        border-bottom: none;
                    }
                    
                    .tips-box li::before {
                        content: '✓';
                        position: absolute;
                        right: 0;
                        color: #10b981;
                        font-weight: bold;
                    }
                    
                    .goal-box {
                        background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
                        border: 2px solid #fcd34d;
                        border-radius: 12px;
                        padding: 15px;
                        margin-top: 15px;
                        text-align: center;
                    }
                    
                    .goal-box h4 {
                        color: #b45309;
                        margin-bottom: 8px;
                    }
                    
                    .goal-box p {
                        color: #92400e;
                        font-size: 0.95rem;
                    }
                    
                    .footer {
                        text-align: center;
                        padding: 25px;
                        background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
                        border-top: 2px solid #e2e8f0;
                    }
                    
                    .footer .logo {
                        font-size: 1.3rem;
                        font-weight: 800;
                        color: #6366f1;
                        margin-bottom: 5px;
                    }
                    
                    .footer .copyright {
                        color: #94a3b8;
                        font-size: 0.75rem;
                    }
                    
                    /* تصميم متجاوب للجوال */
                    @media (max-width: 600px) {
                        body {
                            padding: 10px;
                        }
                        
                        .container {
                            border-radius: 16px;
                        }
                        
                        .header {
                            padding: 15px;
                        }
                        
                        .header h1 {
                            font-size: 1.3rem;
                        }
                        
                        .header .date {
                            position: static;
                            font-size: 0.7rem;
                            margin-bottom: 8px;
                            display: block;
                        }
                        
                        .content {
                            padding: 15px;
                        }
                        
                        .main-result {
                            grid-template-columns: 1fr 1fr;
                            gap: 10px;
                        }
                        
                        .result-card {
                            padding: 12px;
                            border-radius: 10px;
                        }
                        
                        .result-card .value {
                            font-size: 1.3rem;
                        }
                        
                        .result-card.primary {
                            grid-column: span 2;
                        }
                        
                        .section-title {
                            font-size: 1rem;
                            margin: 15px 0 10px;
                        }
                        
                        .courses-table th,
                        .courses-table td {
                            padding: 8px 5px;
                            font-size: 0.8rem;
                        }
                        
                        .two-columns {
                            grid-template-columns: 1fr;
                            gap: 15px;
                        }
                        
                        .analysis-box,
                        .tips-box {
                            padding: 12px;
                        }
                        
                        .performance-indicator {
                            padding: 10px;
                        }
                        
                        .chart-bar-wrapper {
                            height: 15px;
                        }
                        
                        .tips-box li {
                            padding: 5px 0;
                            padding-right: 20px;
                            font-size: 0.85rem;
                        }
                        
                        .goal-box {
                            padding: 10px;
                            margin-top: 10px;
                        }
                        
                        .footer {
                            padding: 15px;
                        }
                    }
                    
                    /* تحسينات الطباعة - صفحة واحدة */
                    @media print {
                        * {
                            -webkit-print-color-adjust: exact !important;
                            print-color-adjust: exact !important;
                        }
                        
                        body {
                            background: white !important;
                            padding: 0;
                            font-size: 10pt;
                        }
                        
                        .container {
                            box-shadow: none;
                            border-radius: 0;
                            max-width: 100%;
                        }
                        
                        .header {
                            padding: 15px;
                        }
                        
                        .header h1 {
                            font-size: 1.4rem;
                        }
                        
                        .content {
                            padding: 15px;
                        }
                        
                        .main-result {
                            gap: 10px;
                            margin-bottom: 15px;
                        }
                        
                        .result-card {
                            padding: 10px;
                        }
                        
                        .result-card .value {
                            font-size: 1.3rem;
                        }
                        
                        .section-title {
                            margin: 10px 0;
                            font-size: 1rem;
                        }
                        
                        .courses-table th,
                        .courses-table td {
                            padding: 6px 8px;
                            font-size: 9pt;
                        }
                        
                        .two-columns {
                            gap: 15px;
                            margin-top: 15px;
                        }
                        
                        .analysis-box,
                        .tips-box {
                            padding: 12px;
                            border-radius: 10px;
                        }
                        
                        .performance-indicator {
                            padding: 8px;
                            margin-bottom: 10px;
                        }
                        
                        .chart-bar-wrapper {
                            height: 14px;
                        }
                        
                        .chart-bar-container {
                            margin-bottom: 5px;
                        }
                        
                        .tips-box li {
                            padding: 4px 0;
                            font-size: 9pt;
                        }
                        
                        .goal-box {
                            padding: 8px;
                            margin-top: 8px;
                        }
                        
                        .footer {
                            padding: 10px;
                        }
                        
                        .footer .logo {
                            font-size: 1rem;
                        }
                        
                        /* تجنب قطع الصفحة */
                        .container, .content, .two-columns, .analysis-box, .tips-box {
                            page-break-inside: avoid;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <span class="date">${new Date().toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        <h1>📊 تقرير المعدل الدراسي</h1>
                        <p class="subtitle">نظام المعدل: ${gpaTypeLabel}</p>
                    </div>
                    
                    <div class="content">
                        <div class="main-result">
                            <div class="result-card">
                                <div class="label">عدد الساعات</div>
                                <div class="value">${semesterHours}</div>
                            </div>
                            <div class="result-card">
                                <div class="label">مجموع النقاط</div>
                                <div class="value">${semesterPoints}</div>
                            </div>
                            <div class="result-card primary">
                                <div class="label">المعدل</div>
                                <div class="value">${cumulativeGpa}</div>
                                <div class="badge">${cumulativeGrade}</div>
                            </div>
                        </div>
                        
                        <h3 class="section-title">📚 المواد الدراسية</h3>
                        <table class="courses-table">
                            <thead>
                                <tr>
                                    <th>اسم المادة</th>
                                    <th>التقدير</th>
                                    <th>الساعات</th>
                                </tr>
                            </thead>
                            <tbody>${coursesHtml}</tbody>
                        </table>
                        
                        <div class="two-columns">
                            <div class="analysis-box">
                                <h3 class="section-title" style="margin-top: 0;">📈 تحليل الأداء</h3>
                                <div class="performance-indicator">
                                    <div class="level" style="color: ${performanceColor};">${performanceLevel}</div>
                                    <div class="percentage">نسبة الأداء: ${performancePercentage}%</div>
                                </div>
                                
                                <h4 style="font-size: 0.95rem; color: #475569; margin-bottom: 10px;">توزيع التقديرات:</h4>
                                <div class="chart-container">
                                    ${chartBars}
                                </div>
                                
                                ${goalSection}
                            </div>
                            
                            <div class="tips-box">
                                <h4>💡 نصائح لتحسين معدلك</h4>
                                <ul>
                                    ${tipsHtml}
                                </ul>
                                
                                <div style="margin-top: 20px; padding-top: 15px; border-top: 2px solid #a7f3d0;">
                                    <h4 style="color: #059669; margin-bottom: 10px;">📊 إحصائيات سريعة</h4>
                                    <p style="color: #065f46; font-size: 0.9rem;">
                                        • عدد المواد: <strong>${totalCourses}</strong><br>
                                        • أفضل تقدير: <strong>${bestGrade || '-'}</strong><br>
                                        • أقل تقدير: <strong>${worstGrade || '-'}</strong>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="footer">
                        <div class="logo">⚡ حاسبة الطالب</div>
                        <div class="copyright">تم إنشاء هذا التقرير بواسطة حاسبة الطالب © ${new Date().getFullYear()}</div>
                    </div>
                </div>
            </body>
            </html>
        `;
    }

    /**
     * الحصول على لون التقدير للطباعة
     */
    function getGradeColorForPrint(grade) {
        const colors = {
            'A+': 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            'A': 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
            'B+': 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            'B': 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
            'C+': 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            'C': 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
            'D+': 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
            'D': 'linear-gradient(135deg, #fb923c 0%, #f97316 100%)',
            'F': 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
        };
        return colors[grade] || 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)';
    }

    // تهيئة الحاسبة عند تحميل DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initGpaCalculator);
    } else {
        setTimeout(initGpaCalculator, 100);
    }

    window.GpaCalculator = {
        init: initGpaCalculator,
        calculate: calculateGpa,
        reset: resetCalculator,
        addRow: addNewRow
    };

})();

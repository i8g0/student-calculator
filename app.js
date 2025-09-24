// Core constants
const DEFAULT_WEEKS = 16; // قابل للتعديل من الإعدادات
const MAX_ABSENCE_PERCENT = 0.25; // 25%

// Storage keys
const STORAGE_KEY = "attendance_ai_state_v1";

// In-memory state
const state = {
  settings: { weeks: DEFAULT_WEEKS },
  courses: [],
  session: { onboardingStep: null, tempCourse: null }
};

// Utilities with IndexedDB persistence (fallback to localStorage)
let dbPromise = null;
function getDB(){
  if(dbPromise) return dbPromise;
  dbPromise = new Promise((resolve)=>{
    const openReq = indexedDB.open('attendance_ai_db', 1);
    openReq.onupgradeneeded = ()=>{
      const db = openReq.result;
      if(!db.objectStoreNames.contains('kv')) db.createObjectStore('kv');
    };
    openReq.onsuccess = ()=> resolve(openReq.result);
    openReq.onerror = ()=> resolve(null);
  });
  return dbPromise;
}

async function idbSet(key, value){
  try{
    const db = await getDB();
    if(!db) { localStorage.setItem(key, value); return; }
    await new Promise((res,rej)=>{
      const tx = db.transaction('kv','readwrite');
      tx.objectStore('kv').put(value, key);
      tx.oncomplete = ()=> res();
      tx.onerror = ()=> rej();
    });
  }catch{ localStorage.setItem(key, value); }
}
async function idbGet(key){
  try{
    const db = await getDB();
    if(!db) return localStorage.getItem(key);
    return await new Promise((res)=>{
      const tx = db.transaction('kv','readonly');
      const req = tx.objectStore('kv').get(key);
      req.onsuccess = ()=> res(req.result||null);
      req.onerror = ()=> res(localStorage.getItem(key));
    });
  }catch{ return localStorage.getItem(key); }
}

function save(){ idbSet(STORAGE_KEY, JSON.stringify(state)); }
async function load(){
  try{
    const raw = await idbGet(STORAGE_KEY);
    if(!raw) return;
    const parsed = JSON.parse(raw);
    if(parsed && typeof parsed === 'object'){
      Object.assign(state, parsed);
    }
  }catch(e){ console.error('Failed to load state', e); }
}
function uid(){ return Math.random().toString(36).slice(2,10); }

// Calculation engine
function computeCourseStats(course){
  const weeks = state.settings.weeks;
  const lecturesArr = Array.isArray(course.lectures)?course.lectures:[];
  const lectures = lecturesArr.length || Number(course.lecturesPerWeek||0);
  const lectureHours = lecturesArr.reduce((sum,l)=>sum+Number(l.hoursPerSession||0),0) / (lectures||1);
  const exercises = Array.isArray(course.exercises)?course.exercises:[];
  const labs = Array.isArray(course.labs)?course.labs:[];

  const exerciseWeeklyHours = exercises.reduce((sum,e)=> sum + Number(e.countPerWeek||0)*Number(e.hoursPerSession||0), 0);
  const labWeeklyHours = labs.reduce((sum,l)=> sum + Number(l.countPerWeek||0)*Number(l.hoursPerSession||0), 0);

  const weeklyHoursLect = lecturesArr.length>0 ? lecturesArr.reduce((sum,l)=> sum + Number(l.hoursPerSession||0), 0) : (lectures * lectureHours);
  const weeklyHoursEx = exerciseWeeklyHours;
  const weeklyHoursLab = labWeeklyHours;
  const weeklyTotalHours = weeklyHoursLect + weeklyHoursEx + weeklyHoursLab;
  const termTotalHours = weeklyTotalHours * weeks;
  const maxAbsences = Math.floor(termTotalHours * MAX_ABSENCE_PERCENT);
  const perAbsencePercent = termTotalHours > 0 ? 100 / termTotalHours : 0;
  const totalUsed = Number(course.lectureHoursAbsences||0) + Number(course.exerciseHoursAbsences||0) + Number(course.labHoursAbsences||0);
  const currentPercent = totalUsed * perAbsencePercent;
  const remainingAbsences = Math.max(0, maxAbsences - totalUsed);
  const usedRatio = maxAbsences>0 ? (totalUsed / maxAbsences) : 0;
  let status = 'safe';
  if(totalUsed > maxAbsences){ status = 'danger'; }
  else if(usedRatio >= 0.75){ status = 'warn'; }
  return {
    weeks, weeklyTotal: weeklyTotalHours, termTotal: termTotalHours, maxAbsences, perAbsencePercent,
    currentPercent, remainingAbsences, status, totalUsed,
    breakdown: {
      lectures, lectureHours,
      exercisesCount: exercises.length, labsCount: labs.length,
      weeklyHoursLect, weeklyHoursEx, weeklyHoursLab
    },
    perSessionPercents: {
      lecture: termTotalHours>0 ? (lectureHours / termTotalHours) * 100 : 0
    }
  };
}

function formatStatusBadge(status){
  if(status==='danger') return '<span class="badge danger">🔴 خطر</span>';
  if(status==='warn') return '<span class="badge warn">🟡 تحذير</span>';
  return '<span class="badge safe">🟢 آمن</span>';
}

// Chat UI helpers
const messagesEl = document.getElementById('messages');
function addMessage(role, html){
  const wrap = document.createElement('div');
  wrap.className = 'message ' + (role==='ai'?'from-ai':'from-user');
  wrap.innerHTML = `<div class="bubble">${html}</div>`;
  messagesEl.appendChild(wrap);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function aiSay(text){ addMessage('ai', text); }
function userSay(text){ addMessage('user', text); }

// Sidebar rendering
const coursesList = document.getElementById('courses-list');
function renderCourses(){
  coursesList.innerHTML = '';
  state.courses.forEach(c=>{
    const stats = computeCourseStats(c);
    const li = document.createElement('li');
    li.innerHTML = `
      <div class="chip" style="width:100%;justify-content:space-between">
        <div><strong>${c.name}</strong> ${formatStatusBadge(stats.status)}</div>
        <div class="meta">${stats.totalUsed}/${stats.maxAbsences} • متبقي ${stats.remainingAbsences}</div>
      </div>
    `;
    li.addEventListener('click', ()=> openAdjustModal(c.id));
    coursesList.appendChild(li);
  });
  const dash = document.getElementById('dashboard-report');
  if(dash){
    const items = state.courses.map(c=>{
      const s = computeCourseStats(c);
      const emoji = s.status==='danger'?'🔴': s.status==='warn'?'🟡':'🟢';
      return `<div>${emoji} <strong>${c.name}</strong> — ${s.totalUsed}/${s.maxAbsences} (متبقي ${s.remainingAbsences})</div>`;
    });
    dash.innerHTML = items.join('') || '<div class="meta">أضف مادة لبدء المتابعة</div>';ء
  }
}

// Settings
const weeksInput = document.getElementById('weeks-input');
const saveSettingsBtn = document.getElementById('save-settings');
const addCourseBtn = document.getElementById('add-course');
const openAddCourseBtn = document.getElementById('open-add-course');
const openSettingsBtn = document.getElementById('open-settings');
const sidebar = document.getElementById('sidebar');
// tabs
const tabs = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('.panel');
tabs.forEach(btn=>btn?.addEventListener('click',()=>{
  tabs.forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  const id = btn.getAttribute('data-tab');
  panels.forEach(p=>p.classList.toggle('active', p.id===`panel-${id}`));
}));
// Modal elements
const modal = document.getElementById('adjust-modal');
const sliderLect = document.getElementById('slider-lectures');
const sliderEx = document.getElementById('slider-exercises');
const sliderLab = document.getElementById('slider-lab');
const valLect = document.getElementById('val-lectures');
const valEx = document.getElementById('val-exercises');
const valLab = document.getElementById('val-lab');
const adjustTitle = document.getElementById('adjust-title');
const adjustSummary = document.getElementById('adjust-summary');
const adjustCancel = document.getElementById('adjust-cancel');
const adjustSave = document.getElementById('adjust-save');
let adjustingCourseId = null;
const lectureAbsRows = document.getElementById('lecture-abs-rows');
// Add-course modal elements
const addcourseModal = document.getElementById('addcourse-modal');
const fName = document.getElementById('f-name');
const fLectures = document.getElementById('f-lectures');
const lectRows = document.getElementById('lect-rows');
const fExCount = document.getElementById('f-ex-count');
const fLabCount = document.getElementById('f-lab-count');
// build rows dynamically on input instead of buttons
const exRows = document.getElementById('exercise-rows');
const labRows = document.getElementById('lab-rows');
const previewPercents = document.getElementById('preview-percents');
const addcourseCancel = document.getElementById('addcourse-cancel');
const addcourseSave = document.getElementById('addcourse-save');
const wizardNext = document.getElementById('wizard-next');
const step1 = document.getElementById('wizard-step1');
const step2 = document.getElementById('wizard-step2');
const fAcademicHours = document.getElementById('f-academic-hours');

openSettingsBtn?.addEventListener('click', ()=>{
  // open addcourse modal uses weeks input also
  document.getElementById('addcourse-modal').hidden = false;
});

openAddCourseBtn?.addEventListener('click', ()=>{
  document.getElementById('addcourse-modal').hidden = false;
  lectRows.innerHTML = '';
  exRows.innerHTML = '';
  labRows.innerHTML = '';
  step1.hidden = false; step2.hidden = true; addcourseSave.hidden = true; wizardNext.hidden = false;
});

saveSettingsBtn?.addEventListener('click', ()=>{
  const weeks = Number(weeksInput.value||DEFAULT_WEEKS);
  state.settings.weeks = Math.max(1, Math.min(30, weeks));
  save();
  renderCourses();
  aiSay(`تم حفظ عدد أسابيع الفصل: ${state.settings.weeks}`);
});

addCourseBtn?.addEventListener('click', ()=> openAddCourse());
function openAddCourse(){
  document.getElementById('addcourse-modal').hidden = false;
  lectRows.innerHTML = '';
  exRows.innerHTML = '';
  labRows.innerHTML = '';
  step1.hidden = false; step2.hidden = true; addcourseSave.hidden = true; wizardNext.hidden = false;
}

function rebuildRows(container, count, typeLabel){
  const n = Math.max(0, Number(count||0));
  while(container.querySelectorAll('.row').length < n){
    const idx = container.querySelectorAll('.row').length + 1;
    const div = document.createElement('div');
    div.className = 'row';
    div.innerHTML = `<input class="hours" type="number" min="0" placeholder="ساعات ${typeLabel} #${idx}"/><input class="percent" type="number" min="0" max="25" placeholder="نسبة الغياب%"/><span class="meta">من 25%</span><button type="button" class="remove">حذف</button>`;
    div.querySelector('.remove').addEventListener('click', ()=>{ div.remove(); renumber(container, typeLabel); });
    container.appendChild(div);
  }
  while(container.querySelectorAll('.row').length > n){
    container.lastElementChild.remove();
  }
  renumber(container, typeLabel);
}

function renumber(container, typeLabel){
  [...container.querySelectorAll('.row')].forEach((row,i)=>{
    const hours = row.querySelector('.hours');
    hours.placeholder = `ساعات ${typeLabel} #${i+1}`;
  });
}

fLectures?.addEventListener('input', ()=> rebuildRows(lectRows, fLectures.value, 'المحاضرة'));
fExCount?.addEventListener('input', ()=> rebuildRows(exRows, fExCount.value, 'التمرين'));
fLabCount?.addEventListener('input', ()=> rebuildRows(labRows, fLabCount.value, 'المعمل'));

// Onboarding flow
function startOnboarding(){
  state.session.onboardingStep = 'ask_name';
  state.session.tempCourse = {
    id: uid(), name:'',
    lecturesPerWeek:0, lectureHoursPerSession:0,
    exercisesPerWeek:0, exerciseHoursPerSession:0,
    labsPerWeek:0, labHoursPerSession:0,
    lectureHoursAbsences:0, exerciseHoursAbsences:0, labHoursAbsences:0
  };
  save();
  aiSay('أهلاً بك! لنقم بإضافة مادة جديدة. ما اسم المادة؟');
}

function handleOnboardingInput(text){
  const step = state.session.onboardingStep;
  const c = state.session.tempCourse;
  if(step==='ask_name'){
    c.name = text.trim();
    state.session.onboardingStep = 'ask_lectures';
    aiSay(`كم عدد المحاضرات الأسبوعية في «${c.name}»؟ (رقم)`);
    return;
  }
  if(step==='ask_lectures'){
    const n = Number(text.replace(/[^0-9]/g,''));
    c.lecturesPerWeek = isNaN(n)?0:n;
    state.session.onboardingStep = 'ask_lecture_hours';
    aiSay('كم ساعة للمحاضرة الواحدة؟');
    return;
  }
  if(step==='ask_lecture_hours'){
    const n = Number(text.replace(/[^0-9]/g,''));
    c.lectureHoursPerSession = isNaN(n)?0:n;
    state.session.onboardingStep = 'ask_exercises';
    aiSay('كم عدد التمارين الأسبوعية؟ إن لم يوجد أدخل 0');
    return;
  }
  if(step==='ask_exercises'){
    const n = Number(text.replace(/[^0-9]/g,''));
    c.exercisesPerWeek = isNaN(n)?0:n;
    state.session.onboardingStep = 'ask_exercise_hours';
    aiSay('كم ساعة للتمرين الواحد؟ (إن لم يوجد أدخل 0)');
    return;
  }
  if(step==='ask_exercise_hours'){
    const n = Number(text.replace(/[^0-9]/g,''));
    c.exerciseHoursPerSession = isNaN(n)?0:n;
    state.session.onboardingStep = 'ask_labs_count';
    aiSay('كم عدد معامل المختبر أسبوعياً؟ إن لم يوجد أدخل 0');
    return;
  }
  if(step==='ask_labs_count'){
    const n = Number(text.replace(/[^0-9]/g,''));
    c.labsPerWeek = isNaN(n)?0:n;
    if(c.labsPerWeek>0){
      state.session.onboardingStep = 'ask_lab_hours';
      aiSay('كم ساعة لكل معمل؟ (مثلاً 2)');
      return;
    }
    // finalize without labs
    state.courses.push(c);
    state.session.onboardingStep = null;
    state.session.tempCourse = null;
    save();
    const stats = computeCourseStats(c);
    aiSay(`تمت إضافة «${c.name}». الحد الأقصى للغياب: ${stats.maxAbsences}. هل ترغب بإضافة مادة أخرى؟ اكتب: إضافة مادة`);
    renderCourses();
    return;
  }
  if(step==='ask_lab_hours'){
    const n = Number(text.replace(/[^0-9]/g,''));
    c.labHoursPerSession = isNaN(n)?0:n;
    state.courses.push(c);
    state.session.onboardingStep = null;
    state.session.tempCourse = null;
    save();
    const stats = computeCourseStats(c);
    aiSay(`تمت إضافة «${c.name}». الحد الأقصى للغياب: ${stats.maxAbsences}. يمكن تسجيل غياب: محاضرة/تمرين/معمل [ساعات].`);
    renderCourses();
    return;
  }
}

// Command parsing
function findCourseByFuzzyName(text){
  const normalized = text.trim().toLowerCase();
  return state.courses.find(c=> normalized.includes(c.name.toLowerCase()));
}

function handleCommand(text){
  const t = text.trim();
  // What-if simulation: "ماذا لو غبت ... في {course}"
  if(/^ماذا لو/.test(t)){
    const course = findCourseByFuzzyName(t) || state.courses[0];
    if(!course){ aiSay('لا توجد مواد بعد. أضف مادة أولاً.'); return; }
    const simulated = { ...course };
    if(/محاضرة/.test(t)) simulated.lectureAbsences = (simulated.lectureAbsences||0)+1;
    else if(/تمرين/.test(t)) simulated.exerciseAbsences = (simulated.exerciseAbsences||0)+1;
    else if(/معمل/.test(t)){
      const h = extractNumber(t) || (course.labHoursPerSession||1);
      simulated.labHoursAbsences = (simulated.labHoursAbsences||0) + h;
    } else {
      simulated.lectureAbsences = (simulated.lectureAbsences||0)+1;
    }
    const stats = computeCourseStats(simulated);
    aiSay(`إذا تم هذا الغياب في «${course.name}»، سيصبح الاستخدام ${stats.totalUsed} من ${stats.maxAbsences} والمتبقي ${stats.remainingAbsences}.`);
    return;
  }

  // Record general absence (defaults to one lecture)
  if(/سجل\s*(لي)?\s*غياب(?!\s*(محاضرة|تمرين|معمل))/.test(t)){
    const course = findCourseByFuzzyName(t) || state.courses[0];
    if(!course){ aiSay('لا توجد مواد بعد. أضف مادة أولاً.'); return; }
    const h = course.lectureHoursPerSession||1;
    course.lectureHoursAbsences = (course.lectureHoursAbsences||0)+h;
    save();
    const s = computeCourseStats(course);
    aiSay(`تم تسجيل غياب محاضرة. «${course.name}»: ${s.totalUsed} من ${s.maxAbsences}. المتبقي ${s.remainingAbsences}. النسبة ${s.currentPercent.toFixed(2)}%.`);
    renderCourses();
    proactiveWarn(course);
    return;
  }

  // Record specific types
  if(/سجل\s*(لي)?\s*غياب\s*محاضرة/.test(t)){
    const course = findCourseByFuzzyName(t) || state.courses[0];
    if(!course){ aiSay('لا توجد مواد بعد. أضف مادة أولاً.'); return; }
    const h = extractNumber(t) || (course.lectureHoursPerSession||1);
    course.lectureHoursAbsences = (course.lectureHoursAbsences||0)+h;
    save();
    const s = computeCourseStats(course);
    aiSay(`تم تسجيل غياب محاضرة (${h} س). الإجمالي ${s.totalUsed}/${s.maxAbsences}. المتبقي ${s.remainingAbsences}.`);
    renderCourses(); proactiveWarn(course); return;
  }
  if(/سجل\s*(لي)?\s*غياب\s*تمرين/.test(t)){
    const course = findCourseByFuzzyName(t) || state.courses[0];
    if(!course){ aiSay('لا توجد مواد بعد. أضف مادة أولاً.'); return; }
    const h = extractNumber(t) || (course.exerciseHoursPerSession||1);
    course.exerciseHoursAbsences = (course.exerciseHoursAbsences||0)+h;
    save();
    const s = computeCourseStats(course);
    aiSay(`تم تسجيل غياب تمرين (${h} س). الإجمالي ${s.totalUsed}/${s.maxAbsences}. المتبقي ${s.remainingAbsences}.`);
    renderCourses(); proactiveWarn(course); return;
  }
  if(/سجل\s*(لي)?\s*غياب\s*معمل/.test(t)){
    const course = findCourseByFuzzyName(t) || state.courses[0];
    if(!course){ aiSay('لا توجد مواد بعد. أضف مادة أولاً.'); return; }
    const hours = extractNumber(t) || (course.labHoursPerSession||1);
    course.labHoursAbsences = (course.labHoursAbsences||0) + hours;
    save();
    const s = computeCourseStats(course);
    aiSay(`تم تسجيل غياب معمل (${hours} س). الإجمالي ${s.totalUsed}/${s.maxAbsences}. المتبقي ${s.remainingAbsences}.`);
    renderCourses(); proactiveWarn(course); return;
  }

  // Report: "تقرير" أو "أعطني تقرير الغياب"
  if(/تقرير/.test(t) || /ملخص/.test(t)){
    if(state.courses.length===0){ aiSay('لا توجد مواد بعد. أضف مادة أولاً.'); return; }
    const lines = state.courses.map(c=>{
      const s = computeCourseStats(c);
      const emoji = s.status==='danger'?'🔴': s.status==='warn'?'🟡':'🟢';
      const parts = [];
      if(s.breakdown.lectures){ parts.push(`محاضرة: ${s.breakdown.lectureHours}س → ${s.perSessionPercents.lecture.toFixed(2)}% لكل محاضرة`); }
      if(s.breakdown.exercises){ parts.push(`تمرين: ${s.breakdown.exerciseHours}س → ${s.perSessionPercents.exercise.toFixed(2)}% لكل تمرين`); }
      if(s.breakdown.labs){ parts.push(`معمل: ${s.breakdown.labHoursPerSession}س → ${s.perSessionPercents.labSession.toFixed(2)}% لكل معمل`); }
      return `${emoji} <strong>${c.name}</strong>: ${s.totalUsed} من ${s.maxAbsences} (متبقي ${s.remainingAbsences}) — ${formatStatusBadge(s.status)}<br><span class="meta">${parts.join(' • ')}</span>`;
    });
    aiSay(`📊 <strong>تقرير الغياب</strong><br>${lines.join('<br>')}`);
    return;
  }

  // Add course via command
  if(/إضافة مادة/.test(t) || /أضف مادة/.test(t)){
    startOnboarding();
    return;
  }

  // Help
  if(/مساعدة/.test(t) || /مساعدة/.test(t)){
    aiSay('أوامر: تقرير الغياب • إضافة مادة • سجل غياب محاضرة/تمرين/معمل [ساعات] في [اسم المادة] • ماذا لو غبت محاضرة/تمرين/معمل في [اسم المادة]');
    return;
  }

  // Fallback
  aiSay('لم أفهم أمرك. جرّب: "تقرير الغياب" أو "إضافة مادة" أو "سجل غياب في [اسم المادة]"');
}

function proactiveWarn(course){
  const s = computeCourseStats(course);
  if(s.status==='warn'){
    aiSay(`تنبيه: لقد استهلكت معظم غياباتك في «${course.name}». متبقٍ ${s.remainingAbsences} فقط قبل الحرمان.`);
  } else if(s.status==='danger'){
    aiSay(`حالة حرمان محتملة في «${course.name}». لقد تجاوزت الحد المسموح (${s.maxAbsences}).`);
  }
}

function extractNumber(text){
  const m = text.match(/([0-9]+)/);
  return m? Number(m[1]) : null;
}

function openAdjustModal(courseId){
  const c = state.courses.find(x=>x.id===courseId);
  if(!c) return;
  adjustingCourseId = courseId;
  const s = computeCourseStats(c);
  adjustTitle.textContent = `تعديل الغياب: ${c.name}`;
  const maxLect = s.breakdown.lectures * s.breakdown.lectureHours * s.weeks;
  const maxEx = s.breakdown.exercises * s.breakdown.exerciseHours * s.weeks;
  const maxLab = s.breakdown.labs * s.breakdown.labHoursPerSession * s.weeks;
  sliderLect.max = String(maxLect);
  sliderEx.max = String(maxEx);
  sliderLab.max = String(maxLab);
  sliderLect.value = String(c.lectureHoursAbsences||0);
  sliderEx.value = String(c.exerciseHoursAbsences||0);
  sliderLab.value = String(c.labHoursAbsences||0);
  syncAdjustLabels();
  // build per-lecture rows based on lectures array
  lectureAbsRows.innerHTML = '';
  const lecturesArr = Array.isArray(c.lectures)?c.lectures:[];
  for(let i=0;i<lecturesArr.length;i++){
    const div = document.createElement('div');
    div.className = 'row';
    const current = (c.lecturePerSessionAbs&&c.lecturePerSessionAbs[i])||0;
    div.innerHTML = `<input class="hours" type="number" min="0" value="${current}" placeholder="غياب محاضرة #${i+1} (ساعات)"/><span class="meta">من ${lecturesArr[i].hoursPerSession||0} س</span><button type="button" class="remove">تصفير</button>`;
    div.querySelector('.remove').addEventListener('click', ()=>{ div.querySelector('.hours').value = 0; });
    lectureAbsRows.appendChild(div);
  }
  modal.hidden = false;
}

function syncAdjustLabels(){
  valLect.textContent = sliderLect.value;
  valEx.textContent = sliderEx.value;
  valLab.textContent = sliderLab.value;
  const perLectureTotal = [...lectureAbsRows.querySelectorAll('.row .hours')].reduce((s,i)=> s + Number(i.value||0), 0);
  const total = Number(sliderLect.value) + Number(sliderEx.value) + Number(sliderLab.value) + perLectureTotal;
  const c = state.courses.find(x=>x.id===adjustingCourseId);
  const s = computeCourseStats(c);
  adjustSummary.textContent = `${total} / ${s.maxAbsences}`;
}
sliderLect?.addEventListener('input', syncAdjustLabels);
sliderEx?.addEventListener('input', syncAdjustLabels);
sliderLab?.addEventListener('input', syncAdjustLabels);
adjustCancel?.addEventListener('click', ()=>{ modal.hidden = true; adjustingCourseId=null; });
adjustSave?.addEventListener('click', ()=>{
  const c = state.courses.find(x=>x.id===adjustingCourseId);
  if(!c) return;
  c.lectureHoursAbsences = Number(sliderLect.value);
  c.exerciseHoursAbsences = Number(sliderEx.value);
  c.labHoursAbsences = Number(sliderLab.value);
  // collect per-lecture absences (hours each)
  const per = [...lectureAbsRows.querySelectorAll('.row .hours')].map(i=> Number(i.value||0));
  c.lecturePerSessionAbs = per;
  save();
  modal.hidden = true;
  renderCourses();
  proactiveWarn(c);
});

// Add course modal events
addcourseCancel?.addEventListener('click', ()=>{ addcourseModal.hidden = true; });
wizardNext?.addEventListener('click', ()=>{
  // build rows based on counts
  rebuildRows(lectRows, fLectures.value, 'المحاضرة');
  rebuildRows(exRows, fExCount.value, 'التمرين');
  rebuildRows(labRows, fLabCount.value, 'المعمل');
  step1.hidden = true; step2.hidden = false; addcourseSave.hidden = false; wizardNext.hidden = true;
});
addcourseSave?.addEventListener('click', ()=>{
  const lectList = [...lectRows.querySelectorAll('.row')].map(r=>({
    hoursPerSession: Number(r.querySelector('.hours').value||0),
    percentOf25: Number(r.querySelector('.percent').value||0)
  })).filter(x=>x.hoursPerSession>0);
  const exList = [...exRows.querySelectorAll('.row')].map(r=>({
    hoursPerSession: Number(r.querySelector('.hours').value||0),
    percentOf25: Number(r.querySelector('.percent').value||0)
  })).filter(x=>x.hoursPerSession>0);
  const labList = [...labRows.querySelectorAll('.row')].map(r=>({
    hoursPerSession: Number(r.querySelector('.hours').value||0),
    percentOf25: Number(r.querySelector('.percent').value||0)
  })).filter(x=>x.hoursPerSession>0);
  const newCourse = {
    id: uid(),
    name: (fName.value||'').trim(),
    lecturesPerWeek: lectList.length,
    lectureHoursPerSession: 0, // kept for compatibility
    lectures: lectList,
    exercises: exList,
    labs: labList,
    lectureHoursAbsences: 0,
    exerciseHoursAbsences: 0,
    labHoursAbsences: 0
  };
  if(!newCourse.name){ aiSay('يرجى إدخال اسم المادة'); return; }
  state.courses.push(newCourse);
  save();
  addcourseModal.hidden = true;
  renderCourses();
  aiSay(`تمت إضافة «${newCourse.name}». الحد الأقصى للغياب: ${computeCourseStats(newCourse).maxAbsences}`);
});

// Composer
const form = document.getElementById('composer');
const input = document.getElementById('input');
form.addEventListener('submit', (e)=>{
  e.preventDefault();
  const text = input.value.trim();
  if(!text) return;
  userSay(text);
  input.value = '';
  if(state.session.onboardingStep){
    handleOnboardingInput(text);
  } else {
    handleCommand(text);
  }
});

// Boot
load();
// migrate older shapes to v3
state.courses = state.courses.map(c=>{
  if(!c) return c;
  // v1 -> v2
  if(c.lectureAbsences===undefined && c.absences!==undefined){
    c.lectureHoursAbsences = Number(c.absences||0);
    delete c.absences;
  }
  // ensure per-type hours properties exist
  c.lecturesPerWeek = Number(c.lecturesPerWeek||0);
  c.lectureHoursPerSession = Number(c.lectureHoursPerSession||1);
  c.exercisesPerWeek = Number(c.exercisesPerWeek||0);
  c.exerciseHoursPerSession = Number(c.exerciseHoursPerSession||1);
  c.labsPerWeek = Number(c.labsPerWeek||0);
  c.labHoursPerSession = Number(c.labHoursPerSession||0);
  c.lectureHoursAbsences = Number(c.lectureHoursAbsences||0);
  c.exerciseHoursAbsences = Number(c.exerciseHoursAbsences||0);
  c.labHoursAbsences = Number(c.labHoursAbsences||0);
  return c;
});
save();
weeksInput.value = state.settings.weeks;
renderCourses();
if(state.courses.length===0){
  aiSay('أهلاً بك! أنا مساعدك الذكي لمتابعة غيابك. لنبدأ بإعداد موادك. اكتب: إضافة مادة');
} else {
  aiSay('مرحباً بعودتك! اضغط على أي مادة لتعديل الغياب بالسحب. أو اطلب: تقرير الغياب • سجل غياب محاضرة/تمرين/معمل • إضافة مادة • ماذا لو ...');
}
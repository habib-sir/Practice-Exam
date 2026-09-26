// Study Master - Main Application Engine
// State & Storage Controller

const STATE = {
  profile: { name: 'পরীক্ষার্থী', post: 'অফিস সহকারী কাম কম্পিউটার মুদ্রাক্ষরিক', targetDate: '', avatar: '👨‍🎓' },
  subjects: [],
  routine: [],
  timeSlots: [],
  exams: [],
  coaching: [],
  revisions: [],
  notes: [],
  mistakes: [],
  circulars: [],
  sites: [],
  settings: { darkMode: false, fontSize: 'medium', notifications: true, quoteDaily: true },
  streak: { count: 1, lastActive: '' },
  points: 120,
  apiKey: '',
  model: 'gemini-3.5-flash',
  useSearchGrounding: true,
  examSession: null,
  pomodoro: { timeLeft: 25 * 60, isRunning: false, mode: 'study', sessions: 0, timerId: null }
};

function getEffectiveApiKey() {
  let key = (STATE.apiKey || '').trim();
  if (!key) {
    key = (localStorage.getItem('sma_api_key') || '').trim();
  }
  if (!key && window.AndroidBridge && window.AndroidBridge.getBuildConfigApiKey) {
    try {
      key = (window.AndroidBridge.getBuildConfigApiKey() || '').trim();
    } catch (e) {
      console.error('[StudyMaster] AndroidBridge getBuildConfigApiKey failed:', e);
    }
  }
  if (key === 'MY_GEMINI_API_KEY') key = '';
  return key;
}

// Initialize State
function initApp() {
  loadFromStorage();
  setupEventListeners();
  renderApp();
  initPomodoro();
  checkStreak();
  checkOverdueRevisions();
  updateExamKeyStatus();
}

function loadFromStorage() {
  const get = (k, def) => {
    try {
      const val = localStorage.getItem(k);
      return val ? JSON.parse(val) : def;
    } catch { return def; }
  };

  STATE.profile = get('sma_profile', STATE.profile);
  STATE.subjects = get('sma_subjects', DEFAULT_SUBJECTS);
  STATE.routine = get('sma_routine', []);
  STATE.timeSlots = get('sma_time_slots', DEFAULT_TIME_SLOTS);
  STATE.exams = get('sma_exams', []);
  STATE.coaching = get('sma_coaching', []);
  STATE.revisions = get('sma_revisions', []);
  STATE.notes = get('sma_notes', []);
  STATE.mistakes = get('sma_mistakes', []);
  STATE.circulars = get('sma_circulars', []);
  STATE.sites = get('sma_sites', PRELOADED_JOB_SITES);
  STATE.settings = get('sma_settings', STATE.settings);
  STATE.streak = get('sma_streak', STATE.streak);
  STATE.points = get('sma_points', 120);

  // Gemini API key - check localStorage or native bridge
  let savedKey = localStorage.getItem('sma_api_key') || '';
  if (!savedKey && window.AndroidBridge && window.AndroidBridge.getBuildConfigApiKey) {
    savedKey = window.AndroidBridge.getBuildConfigApiKey() || '';
  }
  STATE.apiKey = savedKey;

  // Apply Theme & Font
  if (STATE.settings.darkMode) document.body.classList.add('dark-mode');
  document.body.className = `font-${STATE.settings.fontSize} ${STATE.settings.darkMode ? 'dark-mode' : ''}`;
}

function saveToStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Storage error:', e);
  }
}

// Navigation Handler
function navigateTo(sectionId) {
  document.querySelectorAll('.page-section').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.nav-link, .mobile-nav-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.section === sectionId);
  });

  const target = document.getElementById(`section-${sectionId}`);
  if (target) {
    target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Refresh page-specific content
  if (sectionId === 'dashboard') renderDashboard();
  if (sectionId === 'routine') renderRoutineSection();
  if (sectionId === 'exam') updateExamKeyStatus();
  if (sectionId === 'analytics') renderAnalytics();
  if (sectionId === 'coaching') renderCoaching();
  if (sectionId === 'circulars') renderCirculars();
  if (sectionId === 'settings') renderSettings();
}

// Bengali Date Formatter
function getBengaliDate() {
  const now = new Date();
  const days = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'];
  const months = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];
  const toBn = n => n.toString().replace(/\d/g, d => '০১২৩৪৫৬৭৮৯'[d]);

  return `${days[now.getDay()]}, ${toBn(now.getDate())} ${months[now.getMonth()]} ${toBn(now.getFullYear())}`;
}

function toBnNum(num) {
  if (num === null || num === undefined) return '০';
  return num.toString().replace(/\d/g, d => '০১২৩৪৫৬৭৮৯'[d]);
}

// Dashboard Module
function renderDashboard() {
  document.getElementById('dash-date-text').textContent = getBengaliDate();

  // Streak
  document.getElementById('dash-streak-badge').textContent = `টানা ${toBnNum(STATE.streak.count)} দিন পড়েছেন 🔥`;
  document.getElementById('dash-points-badge').textContent = `পয়েন্ট: ${toBnNum(STATE.points)} 🌟`;

  // Countdown to Exam
  const examDaysEl = document.getElementById('dash-countdown-days');
  if (STATE.profile.targetDate) {
    const diffTime = new Date(STATE.profile.targetDate) - new Date();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    examDaysEl.textContent = diffDays > 0 ? toBnNum(diffDays) : '০০';
  } else {
    examDaysEl.textContent = '৩০';
  }

  // Today's Study Progress Calculation
  let totalTopics = 0;
  let completedTopics = 0;
  STATE.subjects.forEach(s => {
    s.topics.forEach(t => {
      totalTopics++;
      if (t.completed) completedTopics++;
    });
  });

  const progressPercent = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
  const ringCircle = document.getElementById('dash-progress-circle');
  const ringText = document.getElementById('dash-progress-text');
  if (ringCircle && ringText) {
    const radius = 32;
    const circumference = 2 * Math.PI * radius;
    ringCircle.style.strokeDasharray = `${circumference} ${circumference}`;
    const offset = circumference - (progressPercent / 100) * circumference;
    ringCircle.style.strokeDashoffset = offset;
    ringText.textContent = `${toBnNum(progressPercent)}%`;
  }

  // Quick Stats
  const totalExams = STATE.exams.length;
  document.getElementById('stat-total-exams').textContent = `${toBnNum(totalExams)} টি`;

  let totalScore = 0;
  let totalPossible = 0;
  const subStats = {};

  STATE.exams.forEach(ex => {
    totalScore += ex.obtainedMarks;
    totalPossible += ex.totalMarks;
    if (!subStats[ex.subject]) subStats[ex.subject] = { obtained: 0, total: 0 };
    subStats[ex.subject].obtained += ex.obtainedMarks;
    subStats[ex.subject].total += ex.totalMarks;
  });

  const avgScore = totalPossible > 0 ? Math.round((totalScore / totalPossible) * 100) : 0;
  document.getElementById('stat-avg-score').textContent = `${toBnNum(avgScore)}%`;

  let strongest = 'বাংলা 📖';
  let weakest = 'গণিত 🔢';
  let maxRate = -1;
  let minRate = 999;

  for (const [sub, data] of Object.entries(subStats)) {
    const rate = data.obtained / data.total;
    if (rate > maxRate) { maxRate = rate; strongest = sub; }
    if (rate < minRate) { minRate = rate; weakest = sub; }
  }

  document.getElementById('stat-strong-sub').textContent = strongest;
  document.getElementById('stat-weak-sub').textContent = weakest;

  // Daily Schedule Slots
  const scheduleList = document.getElementById('dash-schedule-list');
  if (scheduleList) {
    scheduleList.innerHTML = STATE.timeSlots.map(ts => {
      const sub = STATE.subjects.find(s => s.id === ts.subjectId) || { name: 'পড়া', icon: '📚', color: '#1a237e' };
      return `
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; background: var(--card); border: 1px solid var(--border); border-radius: 8px; margin-bottom: 8px;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="font-size: 20px;">${sub.icon}</span>
            <div>
              <div style="font-weight: 600; font-size: 14px; color: ${sub.color};">${sub.name} — ${ts.label}</div>
              <div style="font-size: 12px; color: var(--muted);">${ts.time}</div>
            </div>
          </div>
          <span class="badge" style="background: var(--primary-subtle); color: var(--primary);">নিয়মিত</span>
        </div>
      `;
    }).join('');
  }

  // Due Revisions Card
  const dueList = STATE.revisions.filter(r => r.status === 'Pending');
  const revisionBox = document.getElementById('dash-revision-box');
  if (revisionBox) {
    if (dueList.length > 0) {
      revisionBox.style.display = 'block';
      revisionBox.innerHTML = `
        <div class="card" style="border-left: 4px solid var(--warning); background: var(--warning-subtle);">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <div>
              <h4 style="color: var(--warning); font-size: 15px; font-weight: 700;">⚠️ আজকের রিভিশন অপেক্ষমাণ (${toBnNum(dueList.length)}টি টপিক)</h4>
              <p style="font-size: 13px; color: var(--text); margin-top: 4px;">টপিক: <strong>${dueList[0].topic}</strong> (${dueList[0].subject})</p>
            </div>
            <button class="btn btn-primary btn-sm" onclick="navigateTo('coaching')">রিভিশন দিন</button>
          </div>
        </div>
      `;
    } else {
      revisionBox.style.display = 'none';
    }
  }

  // Motivational Quote
  const quote = MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
  document.getElementById('dash-quote-text').textContent = quote;

  // Mistake Diary Highlight
  const mistakeBox = document.getElementById('dash-mistake-box');
  if (mistakeBox) {
    if (STATE.mistakes.length > 0) {
      const recent = STATE.mistakes[STATE.mistakes.length - 1];
      mistakeBox.innerHTML = `
        <div class="card" style="border-left: 4px solid var(--danger);">
          <div style="font-size: 12px; font-weight: 700; color: var(--danger); margin-bottom: 4px;">📌 আজকের ভুল থেকে শিক্ষা (${recent.subject})</div>
          <div style="font-size: 13px; font-weight: 600;">প্রশ্ন: ${recent.question.slice(0, 100)}...</div>
          <div style="font-size: 12px; color: var(--muted); margin-top: 4px;">সঠিক উত্তর লক্ষ্য করুন: ${recent.correction}</div>
        </div>
      `;
    } else {
      mistakeBox.innerHTML = `<div style="font-size: 13px; color: var(--muted); padding: 8px;">এখনো কোনো ভুল রেকর্ড নেই। চালিয়ে যান! ✨</div>`;
    }
  }
}

// Routine & Subject Manager
function renderRoutineSection() {
  renderSubjectList();
  renderDailyChecklist();
}

function renderSubjectList() {
  const container = document.getElementById('routine-subjects-container');
  if (!container) return;

  container.innerHTML = STATE.subjects.map(sub => {
    return `
      <div class="card" style="border-top: 4px solid ${sub.color};">
        <div class="card-header">
          <div class="card-title">
            <span>${sub.icon}</span>
            <span>${sub.name}</span>
            <span style="font-size: 12px; color: var(--muted); font-weight: normal;">(${toBnNum(sub.topics.length)}টি টপিক)</span>
          </div>
          <button class="btn btn-outline btn-sm" onclick="openAddTopicModal('${sub.id}')">+ টপিক যোগ</button>
        </div>
        <div>
          ${sub.topics.map(t => `
            <div class="checklist-item ${t.completed ? 'completed' : ''}" onclick="toggleTopic('${sub.id}', '${t.id}')">
              <input type="checkbox" ${t.completed ? 'checked' : ''} style="cursor: pointer;">
              <span class="item-text" style="flex: 1; font-size: 13px;">${t.name}</span>
              <span class="badge badge-${t.priority.toLowerCase()}">${t.priority === 'High' ? 'জরুরি' : t.priority === 'Medium' ? 'মাঝারি' : 'সাধারণ'}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }).join('');
}

function toggleTopic(subId, topicId) {
  const sub = STATE.subjects.find(s => s.id === subId);
  if (!sub) return;
  const topic = sub.topics.find(t => t.id === topicId);
  if (!topic) return;

  topic.completed = !topic.completed;
  if (topic.completed) {
    addPoints(10);
    showToast('✅ টপিক সম্পন্ন হয়েছে! (+১০ পয়েন্ট)', 'success');
    triggerVibration();
  }
  saveToStorage('sma_subjects', STATE.subjects);
  renderRoutineSection();
  renderDashboard();
}

function renderDailyChecklist() {
  const container = document.getElementById('daily-checklist-container');
  if (!container) return;

  const allTopics = [];
  STATE.subjects.forEach(s => {
    s.topics.forEach(t => allTopics.push({ ...t, subName: s.name, subIcon: s.icon, subId: s.id }));
  });

  const highPriority = allTopics.filter(t => t.priority === 'High');
  const items = highPriority.slice(0, 6);

  container.innerHTML = items.map(t => `
    <div class="checklist-item ${t.completed ? 'completed' : ''}" onclick="toggleTopic('${t.subId}', '${t.id}')">
      <input type="checkbox" ${t.completed ? 'checked' : ''}>
      <span style="font-size: 16px;">${t.subIcon}</span>
      <div style="flex: 1;">
        <div class="item-text" style="font-size: 14px; font-weight: 600;">${t.name}</div>
        <div style="font-size: 11px; color: var(--muted);">${t.subName}</div>
      </div>
      <span class="badge badge-high">আজকের অগ্রাধিকার</span>
    </div>
  `).join('');
}

function generateWeeklyRoutine() {
  const days = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'];
  const routineTableBody = document.getElementById('routine-table-body');
  if (!routineTableBody) return;

  const topicsPool = [];
  STATE.subjects.forEach(s => {
    s.topics.forEach(t => topicsPool.push({ ...t, sub: s.name, icon: s.icon }));
  });

  topicsPool.sort((a, b) => (a.priority === 'High' ? -1 : 1));

  routineTableBody.innerHTML = days.map((day, idx) => {
    const morning = topicsPool[(idx * 2) % topicsPool.length] || { sub: 'বাংলা', name: 'ব্যাকরণ রিভিশন', icon: '📖' };
    const evening = topicsPool[(idx * 2 + 1) % topicsPool.length] || { sub: 'গণিত', name: 'পাটিগণিত অনুশীলন', icon: '🔢' };

    return `
      <tr>
        <td style="font-weight: 700; color: var(--primary);">${day}</td>
        <td>${morning.icon} <strong>${morning.sub}</strong>: ${morning.name}</td>
        <td>${evening.icon} <strong>${evening.sub}</strong>: ${evening.name}</td>
        <td><span class="badge badge-high">অনুশীলন ও মডেল টেস্ট</span></td>
      </tr>
    `;
  }).join('');

  showToast('📅 ৭ দিনের সাপ্তাহিক রুটিন তৈরি হয়েছে!', 'success');
}

// // Exam Module
function startExamFromBank(qbId) {
  console.log('[Gemini Exam] Starting exam from offline question bank with ID:', qbId);
  const exam = OFFLINE_QUESTION_BANK.find(q => q.id === qbId) || OFFLINE_QUESTION_BANK[0];
  console.log('[Gemini Exam] Selected offline bank model test:', exam.exam_title);
  loadExamToHall(exam);
}

function sanitizeJsonString(str) {
  if (!str) return '';
  return str
    .replace(/,\s*([}\]])/g, '$1') // remove trailing commas before } or ]
    .replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '$1'); // remove inline/block comments
}

function extractExamJson(rawText) {
  console.log('[extractExamJson] Initiating extraction. Raw text length:', rawText?.length);
  if (!rawText || typeof rawText !== 'string') {
    throw new Error('No text returned from Gemini API response parts.');
  }

  const cleaned = rawText.trim();

  // Attempt 1: Direct JSON parse
  try {
    const directObj = JSON.parse(cleaned);
    console.log('[extractExamJson] Attempt 1 (Direct JSON.parse) SUCCEEDED.');
    return directObj;
  } catch (err) {
    console.log('[extractExamJson] Attempt 1 failed:', err.message);
  }

  // Attempt 2: Extract inside markdown code block ```json ... ``` or ``` ... ```
  const codeBlockRegex = /```(?:json)?\s*([\s\S]*?)\s*```/gi;
  let match;
  let blockIndex = 0;
  while ((match = codeBlockRegex.exec(cleaned)) !== null) {
    blockIndex++;
    if (match[1]) {
      const blockContent = match[1].trim();
      try {
        const fenceObj = JSON.parse(blockContent);
        console.log(`[extractExamJson] Attempt 2 (Code block #${blockIndex}) SUCCEEDED.`);
        return fenceObj;
      } catch (e) {
        console.log(`[extractExamJson] Code block #${blockIndex} direct parse failed, trying sanitized parse...`);
        try {
          const sanitizedFence = JSON.parse(sanitizeJsonString(blockContent));
          console.log(`[extractExamJson] Attempt 2 (Sanitized code block #${blockIndex}) SUCCEEDED.`);
          return sanitizedFence;
        } catch (e2) {
          console.warn(`[extractExamJson] Code block #${blockIndex} sanitized parse failed:`, e2.message);
        }
      }
    }
  }

  // Attempt 3: Substring between first '{' and last '}'
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    const candidateSub = cleaned.substring(firstBrace, lastBrace + 1);
    try {
      const subObj = JSON.parse(candidateSub);
      console.log('[extractExamJson] Attempt 3 (Substring { ... }) SUCCEEDED.');
      return subObj;
    } catch (e) {
      console.log('[extractExamJson] Attempt 3 direct parse failed, trying sanitized parse...');
      try {
        const sanitizedSub = JSON.parse(sanitizeJsonString(candidateSub));
        console.log('[extractExamJson] Attempt 3 (Sanitized substring { ... }) SUCCEEDED.');
        return sanitizedSub;
      } catch (e2) {
        console.warn('[extractExamJson] Attempt 3 sanitized parse failed:', e2.message);
      }
    }
  }

  // Attempt 4: Search for top-level array [ { ... } ]
  const firstBracket = cleaned.indexOf('[');
  const lastBracket = cleaned.lastIndexOf(']');
  if (firstBracket !== -1 && lastBracket > firstBracket) {
    const candidateArr = cleaned.substring(firstBracket, lastBracket + 1);
    try {
      const arrObj = JSON.parse(candidateArr);
      if (Array.isArray(arrObj)) {
        console.log('[extractExamJson] Attempt 4 (Direct Array [ ... ]) SUCCEEDED.');
        return { questions: arrObj };
      }
    } catch (e) {
      try {
        const sanitizedArr = JSON.parse(sanitizeJsonString(candidateArr));
        if (Array.isArray(sanitizedArr)) {
          console.log('[extractExamJson] Attempt 4 (Sanitized Array [ ... ]) SUCCEEDED.');
          return { questions: sanitizedArr };
        }
      } catch (_) {}
    }
  }

  console.error('[extractExamJson] ALL PARSE ATTEMPTS FAILED. Sample of raw text:', cleaned.slice(0, 300));
  throw new Error('Failed to parse a valid JSON structure from Gemini response.');
}

function normalizeExamData(raw, fallbackSubject, fallbackDuration) {
  console.log('[normalizeExamData] Normalizing exam data. Top-level keys:', Object.keys(raw || {}));

  // Handle case where root is wrapped or nested
  let root = raw || {};
  if (root.exam && typeof root.exam === 'object' && !Array.isArray(root.exam)) {
    root = root.exam;
  } else if (root.data && typeof root.data === 'object' && !Array.isArray(root.data)) {
    root = root.data;
  } else if (root.written_exam && typeof root.written_exam === 'object') {
    root = root.written_exam;
  }

  const exam = {
    exam_title: root.exam_title || root.title || `${fallbackSubject} — লিখিত পরীক্ষা (১৩-২০ গ্রেড)`,
    subject: root.subject || fallbackSubject,
    total_marks: parseInt(root.total_marks, 10) || 100,
    duration_minutes: parseInt(root.duration_minutes, 10) || fallbackDuration || 60,
    questions: [],
    answer_key: []
  };

  // Find questions list
  let rawQuestions = [];
  if (Array.isArray(root.questions)) {
    rawQuestions = root.questions;
  } else if (Array.isArray(root.Questions)) {
    rawQuestions = root.Questions;
  } else if (Array.isArray(root.questions_list)) {
    rawQuestions = root.questions_list;
  } else if (Array.isArray(root)) {
    rawQuestions = root;
  } else {
    // Search any property that is an array of objects
    for (const key of Object.keys(root)) {
      if (Array.isArray(root[key]) && root[key].length > 0 && typeof root[key][0] === 'object') {
        rawQuestions = root[key];
        console.log(`[normalizeExamData] Found candidate questions array under key: "${key}"`);
        break;
      }
    }
  }

  console.log('[normalizeExamData] Raw questions array extracted. Length:', rawQuestions.length);

  rawQuestions.forEach((q, idx) => {
    exam.questions.push({
      number: parseInt(q.number, 10) || (idx + 1),
      type: q.type || q.category || 'লিখিত প্রশ্ন',
      question: q.question || q.text || q.description || q.prompt || `প্রশ্ন বিবরণী ${idx + 1}`,
      marks: parseInt(q.marks, 10) || parseInt(q.mark, 10) || parseInt(q.points, 10) || 20,
      instruction: q.instruction || q.instructions || ''
    });
  });

  // Find answer keys list
  const rawKeyList = Array.isArray(root.answer_key) ? root.answer_key :
                     (Array.isArray(root.AnswerKey) ? root.AnswerKey :
                     (Array.isArray(root.answers) ? root.answers :
                     (Array.isArray(root.model_answers) ? root.model_answers : [])));

  rawKeyList.forEach((k, idx) => {
    exam.answer_key.push({
      number: parseInt(k.number, 10) || (idx + 1),
      model_answer: k.model_answer || k.answer || k.solution || 'আদর্শ উত্তর পর্যালোচনা সাপেক্ষে মূল্যায়ন করুন।',
      marking_scheme: k.marking_scheme || k.rubric || 'নম্বর বিভাজন যথাযথ'
    });
  });

  if (exam.questions.length === 0) {
    console.error('[normalizeExamData] Zero questions were normalized! Raw object:', raw);
    throw new Error('No valid questions found in AI generated structure.');
  }

  console.log(`[normalizeExamData] Normalization complete. ${exam.questions.length} questions, total_marks: ${exam.total_marks}`);
  return exam;
}

async function generateExamWithGemini() {
  console.log('====================================================');
  console.log('[generateExamWithGemini] Exam generation triggered at:', new Date().toISOString());

  const subjectEl = document.getElementById('exam-setup-subject');
  const durationEl = document.getElementById('exam-setup-duration');
  const materialEl = document.getElementById('exam-setup-material');

  const subject = subjectEl ? subjectEl.value : 'বাংলা';
  const duration = parseInt(durationEl ? durationEl.value : '60', 10) || 60;
  const material = (materialEl ? materialEl.value : '').trim();

  console.log('[generateExamWithGemini] Subject:', subject, '| Duration:', duration, 'mins | Material length:', material.length);

  let apiKey = getEffectiveApiKey();
  console.log('[generateExamWithGemini] API Key lookup result:', apiKey ? (apiKey.substring(0, 6) + '...' + apiKey.substring(apiKey.length - 4)) : 'NONE FOUND');

  if (!apiKey) {
    console.warn('[generateExamWithGemini] Missing Gemini API Key! Prompting user for quick input or offline bank option...');
    const userInput = prompt('Gemini API Key প্রয়োজন। আপনার Gemini API Key লিখুন:\n(অথবা বাতিল চাপলে অফলাইন প্রশ্ন ব্যাংক থেকে স্বয়ংক্রিয়ভাবে প্রশ্ন লোড হবে)', '');
    if (userInput && userInput.trim()) {
      apiKey = userInput.trim();
      STATE.apiKey = apiKey;
      localStorage.setItem('sma_api_key', apiKey);
      updateExamKeyStatus();
      showToast('🔑 API Key সংরক্ষিত হয়েছে! প্রশ্ন তৈরি হচ্ছে...', 'success');
      console.log('[generateExamWithGemini] User entered API key on prompt. Proceeding...');
    } else {
      console.log('[generateExamWithGemini] User chose offline fallback. Loading offline bank for subject:', subject);
      showToast('📂 অফলাইন প্রশ্ন ব্যাংক থেকে লিখিত পরীক্ষা লোড করা হচ্ছে...', 'warning');
      const fallback = OFFLINE_QUESTION_BANK.find(q => q.subject === subject) || OFFLINE_QUESTION_BANK[0];
      loadExamToHall(fallback);
      return;
    }
  }

  const setupCard = document.getElementById('exam-setup-card');
  const skeletonLoader = document.getElementById('exam-skeleton-loader');
  const loaderStatusMsg = document.getElementById('exam-loader-status-msg');
  const hallQuestionsList = document.getElementById('hall-questions-list');

  console.log('[generateExamWithGemini] Checking target DOM elements:');
  console.log(' - setupCard:', !!setupCard);
  console.log(' - skeletonLoader:', !!skeletonLoader);
  console.log(' - hallQuestionsList:', !!hallQuestionsList);

  if (setupCard) setupCard.style.display = 'none';
  if (skeletonLoader) {
    skeletonLoader.style.display = 'block';
    if (loaderStatusMsg) {
      loaderStatusMsg.textContent = '🌐 Google Search দিয়ে সরকারি সিলেবাস ও সাম্প্রতিক তথ্য যাচাই করা হচ্ছে...';
    }
  }

  // Construct official grade 13-20 written exam prompts
  let subjectPrompt = '';
  if (subject === 'বাংলা') {
    subjectPrompt = `তুমি বাংলাদেশ সরকারি চাকরির নিয়োগ পরীক্ষার বিশেষজ্ঞ পরীক্ষক। ১৩-২০ গ্রেডের (অফিস সহকারী কাম কম্পিউটার মুদ্রাক্ষরিক) লিখিত পরীক্ষার সম্পূর্ণ ১০০ নম্বরের প্রশ্ন তৈরি করো। প্রশ্নের ক্যাটাগরি: (১) ভাবসম্প্রসারণ বা সারাংশ [২০ নম্বর], (২) দাপ্তরিক বা ব্যক্তিগত পত্র/স্মারকলিপি [১৫ নম্বর], (৩) ব্যাকরণ — সন্ধি বিচ্ছেদ, বিপরীত শব্দ, সমার্থক শব্দ, এককথায় প্রকাশ, বাক্য শুদ্ধি [২৫ নম্বর], (৪) পারিভাষিক শব্দ বা অনুবাদ [১৫ নম্বর], (৫) সমকালীন সরকারি বা সামাজিক বিষয়ে অনুচ্ছেদ বা রচনা [২৫ নম্বর]। মোট ১০০ নম্বর।`;
  } else if (subject === 'ইংরেজি') {
    subjectPrompt = `You are an expert examiner for Bangladesh Government written recruitment exams (Grade 13-20 Office Assistant cum Computer Typist). Create a full 100 marks written question paper: (1) Fill in the blanks with appropriate prepositions/articles/right forms of verbs [20 marks], (2) Correction of incorrect sentences [15 marks], (3) Translation from Bengali to English [20 marks], (4) Official application / formal office memo / joining letter [20 marks], (5) Paragraph writing on a contemporary topic [15 marks], (6) Synonyms and Antonyms [10 marks]. Total 100 marks.`;
  } else if (subject === 'গণিত') {
    subjectPrompt = `বাংলাদেশ সরকারি চাকরির ১৩-২০ গ্রেডের লিখিত পরীক্ষার গণিত প্রশ্ন তৈরি করো: (১) পাটিগণিত — শতকরা, লাভ-ক্ষতি, সুদকষা, ঐকিক নিয়ম, অনুপাত [৩৫ নম্বর], (২) বীজগণিত — উৎপাদকে বিশ্লেষণ, ভগ্নাংশের সরল, একচলক/দ্বিচলক সমীকরণ গঠন ও সমাধান [৩৫ নম্বর], (৩) জ্যামিতি — উপপাদ্য/অনুসিদ্ধান্ত ও পরিমিতি [৩০ নম্বর]। প্রতিটি প্রশ্নের পূর্ণ সমাধান step-by-step model_answer এ প্রদান করবে।`;
  } else if (subject === 'সাধারণ জ্ঞান') {
    subjectPrompt = `বাংলাদেশ সরকারি চাকরির ১৩-২০ গ্রেডের লিখিত পরীক্ষার সাধারণ জ্ঞান প্রশ্ন তৈরি করো: (১) বাংলাদেশ বিষয়াবলি — ভাষা আন্দোলন, মুক্তিযুদ্ধ, ঐতিহাসিক স্থান, অর্থনৈতিক সমীক্ষা ও বাজেট [৩৫ নম্বর], (২) সংবিধান ও বাংলাদেশ সরকার ব্যবস্থা [২০ নম্বর], (৩) সাম্প্রতিক জাতীয় ও আন্তর্জাতিক ঘটনাবলি [২৫ নম্বর], (৪) তথ্যপ্রযুক্তি ও সাধারণ বিজ্ঞান [২০ নম্বর]। প্রতিটি প্রশ্নের সংক্ষিপ্ত/ব্যাখ্যামূলক উত্তর তৈরি করবে।`;
  } else {
    subjectPrompt = `বাংলাদেশ সরকারি চাকরির ১৩-২০ গ্রেডের অফিস সহকারী কাম কম্পিউটার মুদ্রাক্ষরিক পদের কম্পিউটার ও আইসিটি লিখিত প্রশ্ন: (১) কম্পিউটার আর্কিটেকচার, হার্ডওয়্যার ও ইনপুট-আউটপুট ডিভাইস [২০ নম্বর], (২) MS Word, MS Excel ও কিবোর্ড শর্টকাট প্র্যাক্টিক্যাল সমস্যা সমাধান [৩৫ নম্বর], (৩) ইন্টারনেট, ইমেইল ও দাপ্তরিক নথি ব্যবস্থাপনা [২০ নম্বর], (৪) সাইবার সিকিউরিটি ও আইসিটি টার্মিনোলজি [১৫ নম্বর], (৫) বাংলা টাইপিং ও ইউনিকোড ফন্ট সংক্রান্ত ধারণা [১০ নম্বর]।`;
  }

  const fullPrompt = `${subjectPrompt}
${material ? `পরীক্ষার্থীর অতিরিক্ত সিলেবাস বা টেক্সট:\n${material}\n` : 'বাংলাদেশ সরকারি নিয়োগ পরীক্ষা ও সরকারি অফিস সহকারী পদের বিগত বছরের লিখিত প্রশ্নপত্রের মান ও কাঠামোর পূর্ণ সামঞ্জস্য বজায় রাখো।'}

বিশেষ সতর্কতা ও আউটপুট নির্দেশিকা:
১. শুধুমাত্র এবং শুধুমাত্র একটি সম্পূর্ণ বৈধ ও ত্রুটিহীন JSON অবজেক্ট রিটার্ন করো।
২. কোনো অতিরিক্ত টেক্সট, নোট, শুভেচ্ছা বা ভূমিকা লিখবে না।
৩. প্রশ্নের মার্কস যেন সঠিকভাবে যোগ হয়ে ১০০ হয়।

JSON কাঠামোর নমুনা:
{
  "exam_title": "${subject} — লিখিত পরীক্ষা (১৩-২০ গ্রেড)",
  "subject": "${subject}",
  "total_marks": 100,
  "duration_minutes": ${duration},
  "questions": [
    {
      "number": 1,
      "type": "প্রশ্নের ধরন",
      "question": "সম্পূর্ণ প্রশ্ন বিবরণী",
      "marks": 20,
      "instruction": "নির্দেশনা"
    }
  ],
  "answer_key": [
    {
      "number": 1,
      "model_answer": "আদর্শ উত্তর",
      "marking_scheme": "নম্বর বিভাজন"
    }
  ]
}`;

  const model = STATE.model || 'gemini-3.5-flash';
  const endpointUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  console.log('[generateExamWithGemini] Model:', model);
  console.log('[generateExamWithGemini] Endpoint:', `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`);
  console.log('[generateExamWithGemini] Full prompt characters count:', fullPrompt.length);

  async function callGemini(withSearchGrounding) {
    const payload = {
      contents: [{ parts: [{ text: fullPrompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 8192
      }
    };
    if (withSearchGrounding) {
      payload.tools = [{ googleSearch: {} }];
      console.log('[generateExamWithGemini] Google Search Grounding tool enabled.');
    }
    console.log('[generateExamWithGemini] Dispatching fetch request (withSearchGrounding =', withSearchGrounding, ')...');
    return await fetch(endpointUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  }

  try {
    let response;
    try {
      response = await callGemini(true);
      console.log('[generateExamWithGemini] Call with search grounding returned HTTP status:', response.status);
      if (!response.ok) {
        const errBody = await response.text();
        console.warn('[generateExamWithGemini] Search grounding call returned error HTTP', response.status, 'Response:', errBody);
        console.log('[generateExamWithGemini] Falling back to standard call without tools parameter...');
        if (loaderStatusMsg) loaderStatusMsg.textContent = '🤖 Gemini AI দিয়ে লিখিত পরীক্ষার প্রশ্ন তৈরি হচ্ছে...';
        response = await callGemini(false);
        console.log('[generateExamWithGemini] Fallback call returned HTTP status:', response.status);
      }
    } catch (netErr) {
      console.warn('[generateExamWithGemini] Network error on search grounding call:', netErr);
      if (loaderStatusMsg) loaderStatusMsg.textContent = '🤖 Gemini AI দিয়ে লিখিত পরীক্ষার প্রশ্ন তৈরি হচ্ছে...';
      response = await callGemini(false);
    }

    if (!response.ok) {
      const errDetails = await response.text();
      console.error('[generateExamWithGemini] Gemini API call completely failed with status:', response.status, errDetails);
      throw new Error(`Gemini API HTTP ${response.status}: ${errDetails.slice(0, 150)}`);
    }

    const data = await response.json();
    console.log('[generateExamWithGemini] Response JSON received from Gemini:', data);

    const candidate = data.candidates && data.candidates[0];
    if (!candidate || !candidate.content || !candidate.content.parts) {
      console.error('[generateExamWithGemini] Invalid or missing candidate in response:', data);
      throw new Error('Candidate content is missing in Gemini API response.');
    }

    console.log('[generateExamWithGemini] Candidate finishReason:', candidate.finishReason);
    if (candidate.groundingMetadata) {
      console.log('[generateExamWithGemini] Google Search Grounding Metadata:', candidate.groundingMetadata);
    }

    const fullRawText = candidate.content.parts
      .map(p => p.text || '')
      .filter(t => t.trim().length > 0)
      .join('\n');

    console.log('[generateExamWithGemini] Extracted text length:', fullRawText.length);
    console.log('[generateExamWithGemini] Raw text preview (first 250 chars):\n', fullRawText.slice(0, 250));

    if (loaderStatusMsg) loaderStatusMsg.textContent = '📋 প্রশ্নপত্র যাচাই ও এক্সাম হলে লোড করা হচ্ছে...';

    const parsedJson = extractExamJson(fullRawText);
    console.log('[generateExamWithGemini] JSON parse successful. Keys:', Object.keys(parsedJson || {}));

    const examData = normalizeExamData(parsedJson, subject, duration);
    console.log(`[generateExamWithGemini] Exam normalized with ${examData.questions.length} questions. Handing over to loadExamToHall...`);

    if (skeletonLoader) skeletonLoader.style.display = 'none';
    loadExamToHall(examData);
    showToast('✨ Gemini AI দিয়ে সফলভাবে প্রশ্ন তৈরি হয়েছে!', 'success');
    console.log('[generateExamWithGemini] Exam generation and hall display completed successfully.');

  } catch (err) {
    console.error('[generateExamWithGemini] Caught error during exam generation:', err);
    if (skeletonLoader) skeletonLoader.style.display = 'none';
    if (setupCard) setupCard.style.display = 'block';

    showToast(`❌ AI প্রশ্ন তৈরিতে সমস্যা: ${err.message || 'পরে চেষ্টা করুন'}। অফলাইন মডেল টেস্ট লোড হচ্ছে।`, 'error');

    console.log('[generateExamWithGemini] Fallback: Loading offline question bank for subject:', subject);
    const fallback = OFFLINE_QUESTION_BANK.find(q => q.subject === subject) || OFFLINE_QUESTION_BANK[0];
    loadExamToHall(fallback);
  }
}

function loadExamToHall(examData) {
  console.log('[loadExamToHall] =====================================');
  console.log('[loadExamToHall] Executing loadExamToHall for:', examData?.exam_title);

  if (!examData || !Array.isArray(examData.questions) || examData.questions.length === 0) {
    console.error('[loadExamToHall] Invalid examData passed:', examData);
    showToast('❌ পরীক্ষা লোড করা সম্ভব হয়নি: কোনো প্রশ্ন পাওয়া যায়নি!', 'error');
    return;
  }

  STATE.examSession = {
    ...examData,
    timeLeftSeconds: (examData.duration_minutes || 60) * 60,
    userAnswers: {},
    timerInterval: null
  };

  const setupContainer = document.getElementById('exam-setup-container');
  const hallContainer = document.getElementById('exam-hall-container');
  const evalContainer = document.getElementById('exam-eval-container');
  const skeletonLoader = document.getElementById('exam-skeleton-loader');
  const setupCard = document.getElementById('exam-setup-card');
  const questionsContainer = document.getElementById('hall-questions-list');
  const examTitleEl = document.getElementById('hall-exam-title');
  const examMarksEl = document.getElementById('hall-exam-marks');

  console.log('[loadExamToHall] Checking DOM targets:');
  console.log(' - setupContainer:', !!setupContainer);
  console.log(' - hallContainer:', !!hallContainer);
  console.log(' - evalContainer:', !!evalContainer);
  console.log(' - questionsContainer (#hall-questions-list):', !!questionsContainer);

  if (skeletonLoader) skeletonLoader.style.display = 'none';
  if (setupCard) setupCard.style.display = 'block';
  if (setupContainer) setupContainer.style.display = 'none';
  if (evalContainer) evalContainer.style.display = 'none';
  if (hallContainer) {
    hallContainer.style.display = 'block';
    console.log('[loadExamToHall] hallContainer set to display: block');
  }

  // Ensure exam section is visibly active
  navigateTo('exam');

  if (examTitleEl) examTitleEl.textContent = examData.exam_title;
  if (examMarksEl) examMarksEl.textContent = `পূর্ণমান: ${toBnNum(examData.total_marks || 100)}`;

  if (!questionsContainer) {
    console.error('[loadExamToHall] CRITICAL ERROR: #hall-questions-list container not found in DOM!');
    showToast('❌ অভ্যন্তরীণ ত্রুটি: hall-questions-list খুঁজে পাওয়া যায়নি!', 'error');
    return;
  }

  console.log(`[loadExamToHall] Rendering ${examData.questions.length} question cards into #hall-questions-list...`);

  questionsContainer.innerHTML = examData.questions.map(q => `
    <div class="card" style="margin-bottom: 16px; border-left: 4px solid var(--primary); box-shadow: 0 4px 12px rgba(0,0,0,0.06);">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; flex-wrap: wrap; gap: 8px;">
        <span class="badge" style="background: var(--primary-subtle); color: var(--primary); font-size: 13px; font-weight: 700;">
          প্রশ্ন নং ${toBnNum(q.number)} (${q.type})
        </span>
        <span style="font-weight: 700; color: var(--primary); font-size: 14px;">
          বরাদ্দকৃত নম্বর: ${toBnNum(q.marks)}
        </span>
      </div>
      ${q.instruction ? `<div style="font-size: 13px; color: var(--muted); margin-bottom: 8px; font-style: italic;">📋 ${q.instruction}</div>` : ''}
      <div style="font-size: 15px; font-weight: 600; white-space: pre-wrap; line-height: 1.6; margin-bottom: 14px; color: var(--text);">
        ${q.question}
      </div>
      <label style="display: block; font-size: 12px; font-weight: 600; color: var(--muted); margin-bottom: 4px;">
        ✍️ আপনার লিখিত খসড়া / উত্তর টাইপ করুন:
      </label>
      <textarea class="form-control" 
        data-testid="question_draft_${q.number}" 
        placeholder="এখানে আপনার খসড়া উত্তর লিখুন (পরীক্ষার শেষে মডেল উত্তরের সাথে মিলিয়ে মূল্যায়ন করবেন)..." 
        rows="4" 
        oninput="saveDraftAnswer(${q.number}, this.value); updateWordCount(${q.number}, this.value)"></textarea>
      <div id="word-count-${q.number}" style="font-size: 11px; color: var(--muted); margin-top: 4px; text-align: right;">
        শব্দ: ০ | অক্ষর: ০
      </div>
    </div>
  `).join('');

  console.log('[loadExamToHall] DOM update complete. Rendered question cards count:', questionsContainer.querySelectorAll('.card').length);

  startExamTimer();
  window.scrollTo({ top: 0, behavior: 'smooth' });
  console.log('[loadExamToHall] Exam hall setup and timer started successfully.');
}

function saveDraftAnswer(qNum, text) {
  if (STATE.examSession) {
    STATE.examSession.userAnswers[qNum] = text;
  }
}

function startExamTimer() {
  if (STATE.examSession.timerInterval) clearInterval(STATE.examSession.timerInterval);

  const timerEl = document.getElementById('hall-timer');

  STATE.examSession.timerInterval = setInterval(() => {
    STATE.examSession.timeLeftSeconds--;

    const m = Math.floor(STATE.examSession.timeLeftSeconds / 60);
    const s = STATE.examSession.timeLeftSeconds % 60;
    timerEl.textContent = `${toBnNum(m < 10 ? '0' + m : m)}:${toBnNum(s < 10 ? '0' + s : s)}`;

    // Red alert on last 10 minutes
    if (STATE.examSession.timeLeftSeconds <= 600) {
      timerEl.style.color = '#c62828';
      timerEl.style.animation = 'pulse 1s infinite';
    } else {
      timerEl.style.color = '#1a237e';
    }

    if (STATE.examSession.timeLeftSeconds <= 0) {
      clearInterval(STATE.examSession.timerInterval);
      showToast('⏰ সময় শেষ! উত্তরপত্র মূল্যায়নে পাঠানো হচ্ছে...', 'warning');
      finishExam();
    }
  }, 1000);
}

function confirmFinishExam() {
  openConfirmModal('আপনি কি নিশ্চিত যে পরীক্ষা শেষ করে উত্তর মূল্যায়ন করতে চান?', () => {
    finishExam();
  });
}

function finishExam() {
  if (STATE.examSession.timerInterval) clearInterval(STATE.examSession.timerInterval);

  document.getElementById('exam-hall-container').style.display = 'none';
  document.getElementById('exam-eval-container').style.display = 'block';

  const evalList = document.getElementById('eval-questions-list');
  evalList.innerHTML = STATE.examSession.questions.map(q => {
    const key = STATE.examSession.answer_key?.find(k => k.number === q.number) || { model_answer: 'উত্তর পর্যালোচনা সাপেক্ষে নম্বর দিন।', marking_scheme: 'যথাযথ মান অনুযায়ী' };
    const userDraft = STATE.examSession.userAnswers[q.number] || '(কোনো উত্তর লেখা হয়নি)';

    return `
      <div class="card" style="margin-bottom: 20px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <span style="font-weight: 700;">প্রশ্ন নং ${toBnNum(q.number)}: ${q.type}</span>
          <span class="badge" style="background: var(--primary-subtle); color: var(--primary);">বরাদ্দকৃত নম্বর: ${toBnNum(q.marks)}</span>
        </div>
        <div style="font-size: 14px; margin-bottom: 8px;"><strong>প্রশ্ন:</strong> ${q.question}</div>
        
        <div style="background: var(--bg); padding: 10px; border-radius: 6px; font-size: 13px; margin-bottom: 10px;">
          <strong>আপনার লিখিত উত্তর:</strong><br>
          <span style="color: var(--text);">${userDraft}</span>
        </div>

        <div style="background: var(--success-subtle); border-left: 3px solid var(--success); padding: 10px; border-radius: 6px; font-size: 13px; margin-bottom: 12px;">
          <strong>মডেল উত্তর (Model Answer):</strong><br>
          <span>${key.model_answer}</span>
          <div style="font-size: 11px; color: var(--muted); margin-top: 4px;">নম্বর বিভাজন: ${key.marking_scheme}</div>
        </div>

        <div style="display: flex; align-items: center; gap: 12px;">
          <label style="font-weight: 600; font-size: 13px;">প্রাপ্ত নম্বর প্রদান করুন (০ - ${toBnNum(q.marks)}):</label>
          <input type="number" min="0" max="${q.marks}" value="${Math.round(q.marks * 0.7)}" 
            class="form-control eval-score-input" 
            style="width: 90px; text-align: center; font-weight: 700;" 
            data-max="${q.marks}" 
            data-qnum="${q.number}" 
            data-question="${encodeURIComponent(q.question)}"
            data-model="${encodeURIComponent(key.model_answer)}"
            oninput="recalcTotalScore()">
          <span class="weak-badge-holder" id="weak-tag-${q.number}"></span>
        </div>
      </div>
    `;
  }).join('');

  recalcTotalScore();
}

function recalcTotalScore() {
  let total = 0;
  let maxTotal = 0;

  document.querySelectorAll('.eval-score-input').forEach(input => {
    const val = parseFloat(input.value) || 0;
    const max = parseFloat(input.dataset.max) || 20;
    const qNum = input.dataset.qnum;
    total += val;
    maxTotal += max;

    // Weak tag detection (<50%)
    const holder = document.getElementById(`weak-tag-${qNum}`);
    if (holder) {
      if (val < (max * 0.5)) {
        holder.innerHTML = `<span class="badge" style="background: var(--danger-subtle); color: var(--danger);">দুর্বল উত্তর ⚠️</span>`;
      } else {
        holder.innerHTML = `<span class="badge" style="background: var(--success-subtle); color: var(--success);">সন্তোষজনক ✅</span>`;
      }
    }
  });

  const percent = maxTotal > 0 ? Math.round((total / maxTotal) * 100) : 0;
  document.getElementById('eval-total-display').textContent = `${toBnNum(total)} / ${toBnNum(maxTotal)} (${toBnNum(percent)}%)`;
}

function saveExamResult() {
  let total = 0;
  let maxTotal = 0;
  const weakItems = [];

  document.querySelectorAll('.eval-score-input').forEach(input => {
    const val = parseFloat(input.value) || 0;
    const max = parseFloat(input.dataset.max) || 20;
    total += val;
    maxTotal += max;

    if (val < (max * 0.5)) {
      weakItems.push({
        subject: STATE.examSession.subject,
        question: decodeURIComponent(input.dataset.question),
        correction: decodeURIComponent(input.dataset.model),
        score: `${val}/${max}`,
        date: new Date().toLocaleDateString('bn-BD')
      });
    }
  });

  const percent = maxTotal > 0 ? Math.round((total / maxTotal) * 100) : 0;
  const result = {
    id: 'ex_' + Date.now(),
    date: new Date().toLocaleDateString('bn-BD'),
    subject: STATE.examSession.subject,
    title: STATE.examSession.exam_title,
    obtainedMarks: total,
    totalMarks: maxTotal,
    percentage: percent,
    remarks: percent >= 80 ? 'অসাধারণ' : percent >= 60 ? 'সন্তোষজনক' : 'আরও অনুশীলন প্রয়োজন'
  };

  STATE.exams.unshift(result);
  saveToStorage('sma_exams', STATE.exams);

  // Auto log to Mistake Log
  if (weakItems.length > 0) {
    STATE.mistakes.push(...weakItems);
    saveToStorage('sma_mistakes', STATE.mistakes);
  }

  addPoints(20);
  triggerConfetti();
  showToast('🎉 পরীক্ষার ফলাফল সফলভাবে সংরক্ষিত হয়েছে! (+২০ পয়েন্ট)', 'success');

  // Reset exam views & go to analytics
  document.getElementById('exam-setup-container').style.display = 'block';
  document.getElementById('exam-eval-container').style.display = 'none';
  navigateTo('analytics');
}

// Analytics Module
function renderAnalytics() {
  const container = document.getElementById('analytics-bar-chart');
  if (!container) return;

  const subAverages = {};
  DEFAULT_SUBJECTS.forEach(s => { subAverages[s.name] = { totalObt: 0, totalMax: 0, count: 0 }; });

  STATE.exams.forEach(ex => {
    if (!subAverages[ex.subject]) subAverages[ex.subject] = { totalObt: 0, totalMax: 0, count: 0 };
    subAverages[ex.subject].totalObt += ex.obtainedMarks;
    subAverages[ex.subject].totalMax += ex.totalMarks;
    subAverages[ex.subject].count++;
  });

  container.innerHTML = Object.entries(subAverages).map(([sub, data]) => {
    const percent = data.totalMax > 0 ? Math.round((data.totalObt / data.totalMax) * 100) : (data.count === 0 ? 65 : 0);
    return `
      <div class="css-bar-col">
        <div class="css-bar" style="height: ${percent}%;">
          <span class="css-bar-val">${toBnNum(percent)}%</span>
        </div>
        <span class="css-bar-label">${sub}</span>
      </div>
    `;
  }).join('');

  // Render Heatmap
  const heatmapGrid = document.getElementById('analytics-heatmap');
  if (heatmapGrid) {
    heatmapGrid.innerHTML = Array.from({ length: 28 }).map((_, i) => {
      const level = (i % 5 === 0) ? 3 : (i % 3 === 0) ? 2 : (i % 2 === 0) ? 1 : 0;
      return `<div class="heatmap-cell" data-level="${level}" title="সেশন: ${i + 1}"></div>`;
    }).join('');
  }

  // Render Exam History Table
  const historyBody = document.getElementById('exam-history-tbody');
  if (historyBody) {
    if (STATE.exams.length === 0) {
      historyBody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--muted); padding: 18px;">এখনো কোনো পরীক্ষা দেওয়া হয়নি।</td></tr>`;
    } else {
      historyBody.innerHTML = STATE.exams.map(e => `
        <tr>
          <td>${e.date}</td>
          <td><strong>${e.subject}</strong></td>
          <td>${toBnNum(e.obtainedMarks)}</td>
          <td>${toBnNum(e.totalMarks)}</td>
          <td><span class="badge ${e.percentage >= 60 ? 'badge-low' : 'badge-high'}">${toBnNum(e.percentage)}%</span></td>
          <td>${e.remarks}</td>
        </tr>
      `).join('');
    }
  }
}

function exportExamsToCSV() {
  if (STATE.exams.length === 0) {
    showToast('⚠️ কোনো পরীক্ষার রেকর্ড নেই!', 'warning');
    return;
  }

  let csvContent = '\uFEFFতারিখ,বিষয়,পরীক্ষা,প্রাপ্ত নম্বর,মোট নম্বর,শতাংশ,মন্তব্য\n';
  STATE.exams.forEach(e => {
    csvContent += `"${e.date}","${e.subject}","${e.title}",${e.obtainedMarks},${e.totalMarks},"${e.percentage}%","${e.remarks}"\n`;
  });

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `study_master_exams_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast('📥 CSV ফাইল সফলভাবে ডাউনলোড হয়েছে!', 'success');
}

// Coaching & Spaced Repetition Tracker
function renderCoaching() {
  const container = document.getElementById('coaching-logs-list');
  if (container) {
    if (STATE.coaching.length === 0) {
      container.innerHTML = `<div style="text-align: center; padding: 20px; color: var(--muted);">কোনো কোচিং ক্লাস রেকর্ড নেই। উপরে নতুন ক্লাস যোগ করুন।</div>`;
    } else {
      container.innerHTML = STATE.coaching.map(c => `
        <div class="card" style="margin-bottom: 12px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <span style="font-weight: 700; color: var(--primary);">${c.subject} — ${c.topic}</span>
            <span style="font-size: 12px; color: var(--muted);">${c.date}</span>
          </div>
          <div style="font-size: 13px; margin-bottom: 4px;"><strong>শিক্ষকের নোট:</strong> ${c.teacherNote || 'নেই'}</div>
          <div style="font-size: 13px; color: var(--text);"><strong>নিজের নোট:</strong> ${c.myNote || 'নেই'}</div>
        </div>
      `).join('');
    }
  }

  // Revision Cards
  const revisionList = document.getElementById('coaching-revisions-list');
  if (revisionList) {
    if (STATE.revisions.length === 0) {
      revisionList.innerHTML = `<div style="text-align: center; padding: 20px; color: var(--muted);">কোনো রিভিশন শিডিউল নেই। নতুন কোচিং টপিক সেভ করলে স্বয়ংক্রিয়ভাবে শিডিউল তৈরি হবে।</div>`;
    } else {
      revisionList.innerHTML = STATE.revisions.map((r, idx) => `
        <div class="card" style="display: flex; justify-content: space-between; align-items: center; border-left: 4px solid ${r.status === 'Pending' ? 'var(--warning)' : 'var(--success)'};">
          <div>
            <div style="font-weight: 700; font-size: 14px;">${r.topic} (${r.subject})</div>
            <div style="font-size: 12px; color: var(--muted);">ধাপ: ${toBnNum(r.stage)}ম রিভিশন | তারিখ: ${r.dueDate}</div>
          </div>
          <div>
            ${r.status === 'Pending' ? `
              <button class="btn btn-primary btn-sm" onclick="completeRevision(${idx})">সম্পন্ন ✅</button>
            ` : `
              <span class="badge badge-low">সম্পন্ন</span>
            `}
          </div>
        </div>
      `).join('');
    }
  }
}

function addCoachingEntry() {
  const subject = document.getElementById('coach-input-subject').value;
  const topic = document.getElementById('coach-input-topic').value.trim();
  const teacherNote = document.getElementById('coach-input-teacher-note').value.trim();
  const myNote = document.getElementById('coach-input-my-note').value.trim();

  if (!topic) {
    showToast('⚠️ টপিকের নাম লিখুন!', 'warning');
    return;
  }

  const newEntry = {
    id: 'c_' + Date.now(),
    date: new Date().toLocaleDateString('bn-BD'),
    subject,
    topic,
    teacherNote,
    myNote
  };

  STATE.coaching.unshift(newEntry);
  saveToStorage('sma_coaching', STATE.coaching);

  // Auto generate 1st Spaced Repetition (Tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  STATE.revisions.push({
    id: 'rev_' + Date.now(),
    subject,
    topic,
    stage: 1,
    dueDate: tomorrow.toLocaleDateString('bn-BD'),
    status: 'Pending'
  });
  saveToStorage('sma_revisions', STATE.revisions);

  showToast('🎓 কোচিং ক্লাস সংরক্ষিত ও ১ম রিভিশন শিডিউল তৈরি হয়েছে!', 'success');
  renderCoaching();
  document.getElementById('coach-input-topic').value = '';
  document.getElementById('coach-input-teacher-note').value = '';
  document.getElementById('coach-input-my-note').value = '';
}

function completeRevision(index) {
  const rev = STATE.revisions[index];
  if (!rev) return;

  rev.status = 'Done';
  addPoints(15);
  showToast('✅ রিভিশন সম্পন্ন হয়েছে! (+১৫ পয়েন্ট)', 'success');

  // Ebbinghaus interval progression: 1d -> 3d -> 7d -> 14d -> 30d
  const intervals = [1, 3, 7, 14, 30];
  if (rev.stage < intervals.length) {
    const nextInterval = intervals[rev.stage];
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + nextInterval);

    STATE.revisions.push({
      id: 'rev_' + Date.now(),
      subject: rev.subject,
      topic: rev.topic,
      stage: rev.stage + 1,
      dueDate: nextDate.toLocaleDateString('bn-BD'),
      status: 'Pending'
    });
  }

  saveToStorage('sma_revisions', STATE.revisions);
  renderCoaching();
  renderDashboard();
}

function checkOverdueRevisions() {
  const pending = STATE.revisions.filter(r => r.status === 'Pending');
  if (pending.length > 0) {
    console.log(`Overdue revisions: ${pending.length}`);
  }
}

// Circulars Module
function renderCirculars() {
  const sitesContainer = document.getElementById('circular-sites-list');
  if (sitesContainer) {
    sitesContainer.innerHTML = STATE.sites.map(s => `
      <div class="card" style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <div style="font-weight: 700; font-size: 14px;">${s.name}</div>
          <div style="font-size: 12px; color: var(--muted);">${s.desc}</div>
        </div>
        <a href="${s.url}" target="_blank" class="btn btn-outline btn-sm">ওপেন ↗</a>
      </div>
    `).join('');
  }

  const customCircList = document.getElementById('custom-circulars-list');
  if (customCircList) {
    if (STATE.circulars.length === 0) {
      customCircList.innerHTML = `<div style="text-align: center; color: var(--muted); padding: 16px;">কোনো সার্কুলার যোগ করা হয়নি।</div>`;
    } else {
      customCircList.innerHTML = STATE.circulars.map((c, i) => `
        <div class="card">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <h4 style="font-size: 15px; font-weight: 700;">${c.title} — ${c.organization}</h4>
            <span class="badge ${c.applied ? 'badge-low' : 'badge-high'}">${c.applied ? 'আবেদন সম্পন্ন' : 'আবেদন বাকি'}</span>
          </div>
          <div style="font-size: 13px; color: var(--muted); margin: 6px 0;">আবেদনের শেষ তারিখ: <strong>${c.deadline}</strong></div>
          <div style="display: flex; gap: 8px; margin-top: 10px;">
            <button class="btn btn-outline btn-sm" onclick="toggleCircularApplied(${i})">${c.applied ? 'চিহ্নিত বাতিল' : 'আবেদন করেছি'}</button>
            ${c.link ? `<a href="${c.link}" target="_blank" class="btn btn-primary btn-sm">বিজ্ঞপ্তি দেখুন ↗</a>` : ''}
          </div>
        </div>
      `).join('');
    }
  }
}

function addCustomCircular() {
  const title = document.getElementById('circ-input-title').value.trim();
  const org = document.getElementById('circ-input-org').value.trim();
  const deadline = document.getElementById('circ-input-deadline').value;
  const link = document.getElementById('circ-input-link').value.trim();

  if (!title || !org) {
    showToast('⚠️ পদের নাম ও প্রতিষ্ঠান লিখুন!', 'warning');
    return;
  }

  STATE.circulars.unshift({ title, organization: org, deadline, link, applied: false });
  saveToStorage('sma_circulars', STATE.circulars);
  showToast('📰 নতুন চাকরির সার্কুলার সংরক্ষিত হয়েছে!', 'success');
  renderCirculars();
  document.getElementById('circ-input-title').value = '';
  document.getElementById('circ-input-org').value = '';
}

function toggleCircularApplied(idx) {
  if (STATE.circulars[idx]) {
    STATE.circulars[idx].applied = !STATE.circulars[idx].applied;
    saveToStorage('sma_circulars', STATE.circulars);
    renderCirculars();
  }
}

// Formula Sheet & Cheat Sheet Render
function renderFormulaSheets() {
  const container = document.getElementById('formula-accordion-container');
  if (!container) return;

  container.innerHTML = FORMULA_SHEET.map((cat, idx) => `
    <div class="accordion-item ${idx === 0 ? 'open' : ''}">
      <div class="accordion-header" onclick="this.parentElement.classList.toggle('open')">
        <span>📖 ${cat.category}</span>
        <span>▼</span>
      </div>
      <div class="accordion-body">
        ${cat.items.map(it => `
          <div style="margin-bottom: 10px; padding-bottom: 8px; border-bottom: 1px dashed var(--border);">
            <div style="font-weight: 700; color: var(--primary); font-size: 13px;">${it.name}</div>
            <div style="font-size: 13px; color: var(--text); margin-top: 2px;">${it.desc}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');
}

// Syllabus Tracker Render
function renderSyllabusTracker() {
  const container = document.getElementById('syllabus-accordion-container');
  if (!container) return;

  container.innerHTML = OFFICIAL_SYLLABUS.map((sec, idx) => `
    <div class="accordion-item ${idx === 0 ? 'open' : ''}">
      <div class="accordion-header" onclick="this.parentElement.classList.toggle('open')">
        <span>✅ ${sec.title}</span>
        <span>▼</span>
      </div>
      <div class="accordion-body">
        ${sec.items.map(item => `
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
            <input type="checkbox" checked style="accent-color: var(--primary);">
            <span style="font-size: 13px;">${item}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');
}

// Settings Module
function renderSettings() {
  const nameInput = document.getElementById('setting-name-input');
  const postInput = document.getElementById('setting-post-input');
  const dateInput = document.getElementById('setting-date-input');
  const apiKeyInput = document.getElementById('setting-api-key-input');
  const modelSelect = document.getElementById('setting-model-select');
  const darkToggle = document.getElementById('setting-darkmode-toggle');

  if (nameInput) nameInput.value = STATE.profile.name;
  if (postInput) postInput.value = STATE.profile.post;
  if (dateInput) dateInput.value = STATE.profile.targetDate;
  if (apiKeyInput) apiKeyInput.value = getEffectiveApiKey();
  if (modelSelect) modelSelect.value = STATE.model || 'gemini-3.5-flash';
  if (darkToggle) darkToggle.checked = STATE.settings.darkMode;
}

function saveSettings() {
  STATE.profile.name = document.getElementById('setting-name-input').value.trim() || 'পরীক্ষার্থী';
  STATE.profile.post = document.getElementById('setting-post-input').value.trim() || 'অফিস সহকারী কাম কম্পিউটার মুদ্রাক্ষরিক';
  STATE.profile.targetDate = document.getElementById('setting-date-input').value;
  STATE.apiKey = document.getElementById('setting-api-key-input').value.trim();
  
  const modelSelect = document.getElementById('setting-model-select');
  if (modelSelect) {
    STATE.model = modelSelect.value || 'gemini-3.5-flash';
  }
  
  STATE.settings.darkMode = document.getElementById('setting-darkmode-toggle').checked;

  localStorage.setItem('sma_api_key', STATE.apiKey);
  localStorage.setItem('sma_model', STATE.model);
  saveToStorage('sma_profile', STATE.profile);
  saveToStorage('sma_settings', STATE.settings);

  document.body.classList.toggle('dark-mode', STATE.settings.darkMode);
  showToast('⚙️ সেটিংস সফলভাবে সংরক্ষিত হয়েছে!', 'success');
  updateExamKeyStatus();
  renderDashboard();
}

async function testApiKey() {
  const keyInput = document.getElementById('setting-api-key-input');
  const key = (keyInput ? keyInput.value : '').trim() || getEffectiveApiKey();

  console.log('[Gemini Settings] Testing API Key (masked):', key ? (key.substring(0, 6) + '...') : 'EMPTY');

  if (!key) {
    showToast('⚠️ অনুগ্রহ করে API Key প্রদান করুন!', 'warning');
    return;
  }

  showToast('🔍 Gemini API Key যাচাই করা হচ্ছে (gemini-3.5-flash)...', 'warning');
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: 'Hello, reply with OK' }] }] })
    });

    console.log('[Gemini Settings] Test response status:', res.status);
    if (res.ok) {
      showToast('✅ Gemini API Key সম্পূর্ণ সক্রিয় ও সঠিক!', 'success');
      STATE.apiKey = key;
      localStorage.setItem('sma_api_key', key);
      updateExamKeyStatus();
    } else {
      const errTxt = await res.text();
      console.error('[Gemini Settings] Test failed status:', res.status, errTxt);
      showToast(`❌ ভুল API Key অথবা কোটা শেষ! (${res.status})`, 'error');
    }
  } catch (err) {
    console.error('[Gemini Settings] Test network error:', err);
    showToast('❌ নেটওয়ার্ক ত্রুটি! ইন্টারনেট কানেকশন চেক করুন।', 'error');
  }
}

function updateExamKeyStatus() {
  const keyBadge = document.getElementById('exam-api-status-badge');
  const effectiveKey = getEffectiveApiKey();
  if (keyBadge) {
    if (effectiveKey) {
      const masked = effectiveKey.substring(0, 6) + '...' + effectiveKey.substring(effectiveKey.length - 4);
      keyBadge.innerHTML = `
        <span class="badge" style="background: var(--success-subtle); color: var(--success); font-weight: 700; display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 9999px;">
          <span>✅ Gemini AI সক্রিয় (${STATE.model || 'gemini-3.5-flash'})</span>
          <span style="font-size: 11px; opacity: 0.85;">[${masked}]</span>
        </span>
        <button class="btn btn-outline btn-sm" style="padding: 2px 8px; font-size: 11px;" onclick="quickSetApiKey()">পরিবর্তন</button>
      `;
    } else {
      keyBadge.innerHTML = `
        <span class="badge" style="background: var(--warning-subtle); color: var(--warning); font-weight: 700; display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 9999px;">
          <span>⚠️ Gemini Key নেই</span>
        </span>
        <button class="btn btn-primary btn-sm" style="padding: 2px 8px; font-size: 11px;" onclick="quickSetApiKey()">+ কী দিন</button>
      `;
    }
  }
}

function quickSetApiKey() {
  const current = getEffectiveApiKey();
  const input = prompt('Gemini API Key দিন (Google AI Studio থেকে প্রাপ্ত):', current || '');
  if (input !== null) {
    const trimmed = input.trim();
    if (trimmed) {
      STATE.apiKey = trimmed;
      localStorage.setItem('sma_api_key', trimmed);
      const inputEl = document.getElementById('setting-api-key-input');
      if (inputEl) inputEl.value = trimmed;
      updateExamKeyStatus();
      showToast('✅ Gemini API Key সফলভাবে সংরক্ষিত হয়েছে!', 'success');
      console.log('[quickSetApiKey] API Key saved via quick dialog.');
    } else {
      STATE.apiKey = '';
      localStorage.removeItem('sma_api_key');
      const inputEl = document.getElementById('setting-api-key-input');
      if (inputEl) inputEl.value = '';
      updateExamKeyStatus();
      showToast('API Key মুছে ফেলা হয়েছে', 'info');
      console.log('[quickSetApiKey] API Key removed.');
    }
  }
}

function updateWordCount(qNum, text) {
  const el = document.getElementById(`word-count-${qNum}`);
  if (!el) return;
  const chars = (text || '').length;
  const words = (text || '').trim().split(/\s+/).filter(w => w.length > 0).length;
  el.textContent = `শব্দ: ${toBnNum(words)} | অক্ষর: ${toBnNum(chars)}`;
}

// Pomodoro Timer Controller (with Web Audio API / Android Bridge)
function initPomodoro() {
  window.playBeep = function() {
    if (window.AndroidBridge && window.AndroidBridge.playBeep) {
      try {
        window.AndroidBridge.playBeep();
        return;
      } catch (e) {
        console.log('AndroidBridge beep error:', e);
      }
    }

    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      const audioCtx = new AudioContextClass();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
      setTimeout(() => {
        try { audioCtx.close(); } catch (_) {}
      }, 500);
    } catch (e) {
      console.log('Audio beep fallback error:', e);
    }
  };
}

function togglePomodoro() {
  const p = STATE.pomodoro;
  p.isRunning = !p.isRunning;

  const btn = document.getElementById('pomo-toggle-btn');
  if (p.isRunning) {
    btn.textContent = 'থামান ⏸';
    p.timerId = setInterval(() => {
      p.timeLeft--;
      updatePomodoroDisplay();

      if (p.timeLeft <= 0) {
        clearInterval(p.timerId);
        p.isRunning = false;
        btn.textContent = 'শুরু করুন ▶';
        window.playBeep();
        triggerVibration();

        if (p.mode === 'study') {
          p.sessions++;
          addPoints(10);
          showToast('🎉 পড়া সম্পন্ন! ৫ মিনিটের বিরতি নিন। (+১০ পয়েন্ট)', 'success');
          p.mode = 'break';
          p.timeLeft = 5 * 60;
        } else {
          showToast('🔔 বিরতি শেষ! পুনরায় পড়ায় মনোযোগ দিন।', 'warning');
          p.mode = 'study';
          p.timeLeft = 25 * 60;
        }
        updatePomodoroDisplay();
      }
    }, 1000);
  } else {
    clearInterval(p.timerId);
    btn.textContent = 'চালিয়ে যান ▶';
  }
}

function updatePomodoroDisplay() {
  const p = STATE.pomodoro;
  const m = Math.floor(p.timeLeft / 60);
  const s = p.timeLeft % 60;
  const text = `${toBnNum(m < 10 ? '0' + m : m)}:${toBnNum(s < 10 ? '0' + s : s)}`;
  const displayEl = document.getElementById('pomo-display');
  if (displayEl) displayEl.textContent = text;
}

// Quick Notes
function saveQuickNote() {
  const title = document.getElementById('note-title-input').value.trim();
  const subject = document.getElementById('note-subject-input').value;
  const content = document.getElementById('note-content-input').value.trim();

  if (!content) {
    showToast('⚠️ নোটের বিষয়বস্তু লিখুন!', 'warning');
    return;
  }

  STATE.notes.unshift({
    id: 'n_' + Date.now(),
    date: new Date().toLocaleDateString('bn-BD'),
    title: title || 'দ্রুত নোট',
    subject,
    content
  });

  saveToStorage('sma_notes', STATE.notes);
  showToast('📝 নোট সফলভাবে সেভ হয়েছে!', 'success');
  closeModal('modal-quick-note');
  document.getElementById('note-title-input').value = '';
  document.getElementById('note-content-input').value = '';
}

// Points & Gamification
function addPoints(pts) {
  STATE.points += pts;
  saveToStorage('sma_points', STATE.points);
  const badge = document.getElementById('dash-points-badge');
  if (badge) badge.textContent = `পয়েন্ট: ${toBnNum(STATE.points)} 🌟`;
}

function checkStreak() {
  const today = new Date().toDateString();
  if (STATE.streak.lastActive !== today) {
    STATE.streak.count = (STATE.streak.count || 0) + 1;
    STATE.streak.lastActive = today;
    saveToStorage('sma_streak', STATE.streak);
  }
}

// Native Vibration Bridge
function triggerVibration() {
  if (window.AndroidBridge && window.AndroidBridge.vibrate) {
    window.AndroidBridge.vibrate();
  } else if (navigator.vibrate) {
    navigator.vibrate(100);
  }
}

// Confetti System
function triggerConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = Array.from({ length: 60 }).map(() => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height * 0.5,
    size: Math.random() * 8 + 4,
    color: ['#1a237e', '#00acc1', '#4caf50', '#ffeb3b', '#e91e63'][Math.floor(Math.random() * 5)],
    vx: (Math.random() - 0.5) * 4,
    vy: Math.random() * 4 + 2
  }));

  let frame = 0;
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, p.size, p.size);
    });
    frame++;
    if (frame < 90) requestAnimationFrame(animate);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  animate();
}

// Toast Notifications
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Modals
function openModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add('active');
}

function closeModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove('active');
}

let confirmCallback = null;
function openConfirmModal(message, onConfirm) {
  document.getElementById('confirm-modal-msg').textContent = message;
  confirmCallback = onConfirm;
  openModal('modal-confirm');
}

function executeConfirm() {
  if (confirmCallback) confirmCallback();
  closeModal('modal-confirm');
}

// Master Render & Setup
function renderApp() {
  renderDashboard();
  renderFormulaSheets();
  renderSyllabusTracker();
  navigateTo('dashboard');
}

function setupEventListeners() {
  // Navigation
  document.querySelectorAll('[data-section]').forEach(btn => {
    btn.addEventListener('click', () => navigateTo(btn.dataset.section));
  });

  // Offline Bank Dropdown
  const bankSelect = document.getElementById('offline-bank-select');
  if (bankSelect) {
    bankSelect.innerHTML = OFFLINE_QUESTION_BANK.map(q => `
      <option value="${q.id}">${q.subject} — ${q.exam_title}</option>
    `).join('');
  }
}

window.addEventListener('DOMContentLoaded', initApp);

// IXL UK English - 100% Self-Contained Interactive Learning Portal & Practice Terminal
// Zero External Redirects - Complete Offline Knowledge Base

class IXLApp {
  constructor() {
    this.curriculum = IXL_DATA.curriculum || {};
    this.standards = IXL_DATA.standards || {};
    
    // Skill Registry map for fast, reliable lookup with zero escaping bugs
    this.skillRegistry = {};
    this.buildSkillRegistry();

    this.state = {
      currentTab: 'curriculum', // 'curriculum', 'lesson_detail', 'practice', 'standards', 'awards', 'analytics', 'worksheets'
      currentYear: 'Year 1',
      currentKeyStage: 'all',
      searchQuery: '',
      theme: localStorage.getItem('ixl_theme') || 'dark',
      
      // Selected Skill for Internal Lesson & Practice
      activeSkillId: null,
      activeSkill: null,

      // Practice Cockpit State
      practice: {
        skillId: null,
        year: null,
        categoryName: null,
        skillCode: null,
        skillTitle: null,
        score: 0,
        questionsAnswered: 0,
        correctCount: 0,
        currentQuestion: null,
        selectedOption: null,
        hasSubmitted: false,
        timerInterval: null,
        secondsElapsed: 0
      },
      
      // Persistent Progress in LocalStorage
      userProgress: JSON.parse(localStorage.getItem('ixl_user_progress') || '{}')
    };

    this.init();
  }

  buildSkillRegistry() {
    let globalIndex = 0;
    for (const [yearName, yearData] of Object.entries(this.curriculum)) {
      yearData.categories.forEach(cat => {
        cat.skills.forEach(s => {
          const id = `sk_${globalIndex++}`;
          s._id = id;
          this.skillRegistry[id] = {
            id,
            year: yearName,
            categoryCode: cat.category_code,
            categoryName: cat.category_name,
            code: s.code,
            number: s.number,
            title: s.title,
            url: s.url
          };
        });
      });
    }
  }

  init() {
    this.applyTheme();
    this.setupGlobalEvents();
    this.renderHorizontalYearSelector();
    this.renderCurrentView();
    this.updateUserStatsDisplay();
  }

  // ====================================================
  // THEME MANAGEMENT
  // ====================================================
  applyTheme() {
    document.documentElement.setAttribute('data-theme', this.state.theme);
    const themeIcon = document.getElementById('themeIcon');
    if (themeIcon) {
      themeIcon.textContent = this.state.theme === 'dark' ? '☀️' : '🌙';
    }
  }

  toggleTheme() {
    this.state.theme = this.state.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('ixl_theme', this.state.theme);
    this.applyTheme();
  }

  // ====================================================
  // ROUTING & NAVIGATION
  // ====================================================
  switchTab(tabId) {
    this.state.currentTab = tabId;
    document.querySelectorAll('.top-nav-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabId);
    });

    // If user clicks "Practice Console" and no skill was selected yet, auto-load first skill of the selected year
    if (tabId === 'practice' && !this.state.practice.skillTitle) {
      const yearSkills = Object.values(this.skillRegistry).filter(s => s.year === this.state.currentYear);
      if (yearSkills.length > 0) {
        this.startPracticeById(yearSkills[0].id);
        return;
      }
    }

    this.renderCurrentView();
  }

  selectYear(yearName) {
    this.state.currentYear = yearName;
    this.renderHorizontalYearSelector();
    if (this.state.currentTab === 'curriculum' || this.state.currentTab === 'standards') {
      this.renderCurrentView();
    } else if (this.state.currentTab === 'practice') {
      const yearSkills = Object.values(this.skillRegistry).filter(s => s.year === yearName);
      if (yearSkills.length > 0) {
        this.startPracticeById(yearSkills[0].id);
      }
    }
  }

  setupGlobalEvents() {
    // Top Nav Buttons
    document.querySelectorAll('.top-nav-btn').forEach(btn => {
      btn.addEventListener('click', () => this.switchTab(btn.dataset.tab));
    });

    // Theme Switch
    const themeBtn = document.getElementById('themeToggleBtn');
    if (themeBtn) themeBtn.addEventListener('click', () => this.toggleTheme());

    // Search Input
    const searchInput = document.getElementById('globalSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.state.searchQuery = e.target.value.toLowerCase().trim();
        if (this.state.currentTab === 'curriculum') {
          this.renderCurriculumGrid();
        }
      });
    }

    // Keyboard Shortcuts
    window.addEventListener('keydown', (e) => {
      if (this.state.currentTab === 'practice') {
        if (['1', '2', '3', '4'].includes(e.key)) {
          const idx = parseInt(e.key) - 1;
          const opts = document.querySelectorAll('.cockpit-option-btn');
          if (opts[idx]) opts[idx].click();
        } else if (e.key === 'Enter') {
          if (!this.state.practice.hasSubmitted) {
            this.submitPracticeAnswer();
          } else {
            this.nextPracticeQuestion();
          }
        } else if (e.code === 'Space' && e.target.tagName !== 'INPUT') {
          e.preventDefault();
          if (this.state.practice.currentQuestion) {
            this.speakAudio(this.state.practice.currentQuestion.audioText);
          }
        }
      } else if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const searchBar = document.getElementById('globalSearchInput');
        if (searchBar) {
          searchBar.focus();
          searchBar.select();
        }
      }
    });
  }

  // ====================================================
  // HORIZONTAL YEAR SELECTOR
  // ====================================================
  renderHorizontalYearSelector() {
    const selectEl = document.getElementById('horizontalYearSelect');
    const years = Object.keys(this.curriculum);

    if (selectEl) {
      selectEl.innerHTML = years.map(y => `<option value="${y}" ${y === this.state.currentYear ? 'selected' : ''}>⚡ ${y} (${this.curriculum[y].total_skills} Skills)</option>`).join('');
    }
  }

  // ====================================================
  // VIEW CONTROLLER
  // ====================================================
  renderCurrentView() {
    const mainArea = document.getElementById('mainContentArea');
    if (!mainArea) return;

    switch (this.state.currentTab) {
      case 'curriculum':
        this.renderCurriculumView(mainArea);
        break;
      case 'lesson_detail':
        this.renderLessonDetailView(mainArea);
        break;
      case 'practice':
        this.renderPracticeView(mainArea);
        break;
      case 'standards':
        this.renderStandardsView(mainArea);
        break;
      case 'awards':
        this.renderAwardsView(mainArea);
        break;
      case 'analytics':
        this.renderAnalyticsView(mainArea);
        break;
      case 'worksheets':
        this.renderWorksheetsView(mainArea);
        break;
      default:
        this.renderCurriculumView(mainArea);
    }
  }

  // ====================================================
  // TAB 1: CURRICULUM MATRIX
  // ====================================================
  renderCurriculumView(container) {
    const yearData = this.curriculum[this.state.currentYear] || { categories: [], total_skills: 0, key_stage: '' };

    container.innerHTML = `
      <div class="view-hero-card">
        <div class="hero-tag-badge">🇬🇧 UK National Curriculum Framework</div>
        <h2 class="hero-heading">${this.state.currentYear} English Matrix</h2>
        <p class="hero-subtitle">
          Complete self-contained syllabus for ${this.state.currentYear} (${yearData.key_stage}). Study structured lesson guides, worked examples, and practice interactive questions right inside your platform.
        </p>
        <div class="hero-telemetry-row">
          <div class="telemetry-node">
            <span class="telemetry-node-val">${yearData.total_skills}</span>
            <span class="telemetry-node-label">Curriculum Skills</span>
          </div>
          <div class="telemetry-node">
            <span class="telemetry-node-val">${yearData.categories.length}</span>
            <span class="telemetry-node-label">Skill Domains</span>
          </div>
          <div class="telemetry-node">
            <span class="telemetry-node-val">${yearData.key_stage}</span>
            <span class="telemetry-node-label">Academic Tier</span>
          </div>
        </div>
      </div>

      <div class="filter-strip">
        <span style="font-family: var(--font-mono); font-size: 0.75rem; font-weight: 700; color: var(--text-tertiary); text-transform: uppercase; margin-right: 0.5rem;">Filter Tier:</span>
        <button class="filter-pill ${this.state.currentKeyStage === 'all' ? 'active' : ''}" onclick="window.app.setKeyStage('all', this)">All Tiers</button>
        <button class="filter-pill ${this.state.currentKeyStage === 'Early Years' ? 'active' : ''}" onclick="window.app.setKeyStage('Early Years', this)">Early Years</button>
        <button class="filter-pill ${this.state.currentKeyStage === 'Key Stage 1' ? 'active' : ''}" onclick="window.app.setKeyStage('Key Stage 1', this)">Key Stage 1</button>
        <button class="filter-pill ${this.state.currentKeyStage === 'Key Stage 2' ? 'active' : ''}" onclick="window.app.setKeyStage('Key Stage 2', this)">Key Stage 2</button>
        <button class="filter-pill ${this.state.currentKeyStage === 'Key Stage 3' ? 'active' : ''}" onclick="window.app.setKeyStage('Key Stage 3', this)">Key Stage 3</button>
        <button class="filter-pill ${this.state.currentKeyStage === 'Key Stage 4 (GCSE)' ? 'active' : ''}" onclick="window.app.setKeyStage('Key Stage 4 (GCSE)', this)">GCSE (KS4)</button>
        <button class="filter-pill ${this.state.currentKeyStage === 'Sixth Form / A-Levels' ? 'active' : ''}" onclick="window.app.setKeyStage('Sixth Form / A-Levels', this)">A-Levels</button>
      </div>

      <div class="curriculum-grid" id="curriculumGridContainer"></div>
    `;

    this.renderCurriculumGrid();
  }

  setKeyStage(ks, btn) {
    this.state.currentKeyStage = ks;
    document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    this.renderCurriculumGrid();
  }

  renderCurriculumGrid() {
    const grid = document.getElementById('curriculumGridContainer');
    if (!grid) return;

    const yearData = this.curriculum[this.state.currentYear];
    if (!yearData) {
      grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 2rem; color: var(--text-tertiary);">No curriculum data found.</div>';
      return;
    }

    const query = this.state.searchQuery;
    let matchedCount = 0;
    let html = '';

    yearData.categories.forEach(cat => {
      const matchedSkills = cat.skills.filter(s => {
        if (!query) return true;
        return s.title.toLowerCase().includes(query) ||
               s.code.toLowerCase().includes(query) ||
               cat.category_name.toLowerCase().includes(query);
      });

      if (matchedSkills.length === 0) return;
      matchedCount += matchedSkills.length;

      let skillsHtml = '';
      matchedSkills.forEach(s => {
        const skillKey = `${this.state.currentYear}_${s.code}`;
        const userSkillData = this.state.userProgress[skillKey] || { score: 0 };
        const scoreBadge = userSkillData.score > 0 
          ? `<span style="font-family:var(--font-mono); font-size:0.72rem; background:rgba(245,158,11,0.15); border:1px solid rgba(245,158,11,0.3); color:#fbbf24; padding:2px 7px; border-radius:12px; font-weight:700;">★ ${userSkillData.score}</span>`
          : '';

        skillsHtml += `
          <div class="skill-row">
            <div class="skill-row-left" onclick="window.app.openLessonById('${s._id}')">
              <span class="skill-id-tag">${s.code}</span>
              <span class="skill-title-label">${s.title}</span>
              ${scoreBadge}
            </div>
            <div class="skill-action-pack">
              <button class="action-launch-btn" style="background: var(--bg-surface-elevated); color: var(--text-primary); border: 1px solid var(--border-medium);" onclick="window.app.openLessonById('${s._id}')">
                <span>📖</span>
                <span>LESSON</span>
              </button>
              <button class="action-launch-btn" onclick="window.app.startPracticeById('${s._id}')">
                <span>⚡</span>
                <span>PRACTICE</span>
              </button>
            </div>
          </div>
        `;
      });

      html += `
        <div class="module-card">
          <div class="module-card-header">
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <span class="module-code-badge">${cat.category_code}</span>
              <span class="module-title">${cat.category_name}</span>
            </div>
            <span class="grade-badge-count">${matchedSkills.length}</span>
          </div>
          <div class="skills-scroll-deck">
            ${skillsHtml}
          </div>
        </div>
      `;
    });

    if (matchedCount === 0) {
      grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 4rem 1rem; color: var(--text-tertiary); font-size: 1rem;">
        No skills found matching "${this.state.searchQuery}".
      </div>`;
    } else {
      grid.innerHTML = html;
    }
  }

  // ====================================================
  // INTERNAL SKILL LESSON GUIDE & WORKED EXAMPLE VIEW
  // ====================================================
  openLessonById(skillId) {
    const s = this.skillRegistry[skillId];
    if (!s) return;

    const domainKey = getDomainFromTitle(s.title, s.categoryName);
    this.state.activeSkillId = skillId;
    this.state.activeSkill = {
      ...s,
      domainKey,
      lesson: LESSON_KNOWLEDGE_BASE[domainKey] || LESSON_KNOWLEDGE_BASE.nouns
    };
    this.switchTab('lesson_detail');
  }

  renderLessonDetailView(container) {
    if (!this.state.activeSkill) {
      this.switchTab('curriculum');
      return;
    }

    const s = this.state.activeSkill;
    const l = s.lesson;
    const skillKey = `${s.year}_${s.code}`;
    const userScore = this.state.userProgress[skillKey]?.score || 0;

    let rulesHtml = '';
    l.rules.forEach(r => {
      rulesHtml += `
        <div style="background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 1.25rem;">
          <h4 style="font-family: var(--font-display); font-size: 1rem; font-weight: 800; color: var(--accent-primary); margin-bottom: 0.4rem;">${r.rule}</h4>
          <p style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.6;">${r.detail}</p>
        </div>
      `;
    });

    let stepsHtml = '';
    l.example.steps.forEach(st => {
      stepsHtml += `<li style="margin-bottom: 0.5rem; color: var(--text-secondary);">${st}</li>`;
    });

    container.innerHTML = `
      <div style="max-width: 1000px; margin: 0 auto; display: flex; flex-direction: column; gap: 2rem;">
        <!-- Header Breadcrumb & Actions -->
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
          <div>
            <button onclick="window.app.switchTab('curriculum')" class="filter-pill" style="margin-bottom: 0.5rem;">
              ← Back to ${s.year} Matrix
            </button>
            <div style="display: flex; align-items: center; gap: 0.6rem; margin-top: 0.25rem;">
              <span class="skill-id-tag">${s.code}</span>
              <h2 style="font-family: var(--font-display); font-size: 1.6rem; font-weight: 800;">${s.title}</h2>
            </div>
            <p style="font-family: var(--font-mono); font-size: 0.82rem; color: var(--text-tertiary);">${s.year} • Domain: ${s.categoryName}</p>
          </div>

          <div style="display: flex; gap: 0.75rem; align-items: center;">
            <div class="score-orb-display" style="padding: 0.4rem 1rem;">
              <div class="score-orb-val" style="font-size: 1.4rem;">${userScore}</div>
              <div class="score-orb-label">Score</div>
            </div>
            <button class="btn-execute-answer" onclick="window.app.startPracticeById('${s.id}')">
              ⚡ LAUNCH INTERACTIVE PRACTICE ➔
            </button>
          </div>
        </div>

        <!-- Lesson Overview Card -->
        <div class="module-card" style="padding: 2rem;">
          <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.75rem;">
            <span style="font-size: 1.4rem;">📖</span>
            <h3 style="font-family: var(--font-display); font-size: 1.3rem; font-weight: 800;">${l.title}</h3>
          </div>
          <p style="font-size: 1rem; color: var(--text-primary); line-height: 1.7; margin-bottom: 1.5rem;">
            ${l.summary}
          </p>

          <h4 style="font-family: var(--font-mono); font-size: 0.8rem; font-weight: 700; text-transform: uppercase; color: var(--text-tertiary); margin-bottom: 1rem;">Fundamental Linguistic Rules:</h4>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
            ${rulesHtml}
          </div>

          <!-- Worked Example -->
          <div style="background: rgba(16, 185, 129, 0.06); border: 1.5px solid rgba(16, 185, 129, 0.3); border-radius: var(--radius-lg); padding: 1.75rem;">
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;">
              <span style="font-size: 1.2rem;">💡</span>
              <h4 style="font-family: var(--font-display); font-size: 1.1rem; font-weight: 800; color: var(--accent-primary);">Learn With an Example (Worked Solution)</h4>
            </div>
            <div style="font-size: 1.05rem; font-weight: 700; margin-bottom: 1rem; color: var(--text-primary);">
              Problem: ${l.example.problem}
            </div>
            <ol style="padding-left: 1.25rem; font-size: 0.92rem; line-height: 1.7; margin-bottom: 1rem;">
              ${stepsHtml}
            </ol>
            <div style="background: var(--bg-surface); border: 1px solid var(--border-medium); padding: 0.75rem 1.25rem; border-radius: var(--radius-sm); font-family: var(--font-mono); font-size: 0.9rem; font-weight: 700; color: var(--accent-primary);">
              ✓ Verified Solution: ${l.example.solution}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // ====================================================
  // TAB 2: INTERACTIVE PRACTICE COCKPIT
  // ====================================================
  startPracticeById(skillId) {
    const s = this.skillRegistry[skillId];
    if (!s) return;

    // Generate initial question FIRST before switching views
    const initialQuestion = generateQuestionForSkill(s.year, s.categoryName, s.code, s.title);

    this.state.practice = {
      skillId: s.id,
      year: s.year,
      categoryName: s.categoryName,
      skillCode: s.code,
      skillTitle: s.title,
      score: this.state.userProgress[`${s.year}_${s.code}`]?.score || 0,
      questionsAnswered: 0,
      correctCount: 0,
      currentQuestion: initialQuestion,
      selectedOption: null,
      hasSubmitted: false,
      startTime: Date.now(),
      secondsElapsed: 0
    };

    if (this.state.practice.timerInterval) {
      clearInterval(this.state.practice.timerInterval);
    }
    this.state.practice.timerInterval = setInterval(() => {
      this.state.practice.secondsElapsed++;
      const timerEl = document.getElementById('cockpitTimerDisplay');
      if (timerEl) {
        const mins = Math.floor(this.state.practice.secondsElapsed / 60).toString().padStart(2, '0');
        const secs = (this.state.practice.secondsElapsed % 60).toString().padStart(2, '0');
        timerEl.textContent = `${mins}:${secs}`;
      }
    }, 1000);

    this.switchTab('practice');
  }

  nextPracticeQuestion() {
    this.state.practice.selectedOption = null;
    this.state.practice.hasSubmitted = false;
    this.state.practice.currentQuestion = generateQuestionForSkill(
      this.state.practice.year,
      this.state.practice.categoryName,
      this.state.practice.skillCode,
      this.state.practice.skillTitle
    );
    this.renderCurrentView();
  }

  selectOption(opt) {
    if (this.state.practice.hasSubmitted) return;
    this.state.practice.selectedOption = opt;
    document.querySelectorAll('.cockpit-option-btn').forEach(btn => {
      btn.classList.toggle('selected', btn.dataset.opt === opt);
    });
  }

  submitPracticeAnswer() {
    if (!this.state.practice.selectedOption || this.state.practice.hasSubmitted) return;

    this.state.practice.hasSubmitted = true;
    this.state.practice.questionsAnswered++;

    const isCorrect = this.state.practice.selectedOption === this.state.practice.currentQuestion.correct;
    if (isCorrect) {
      this.state.practice.correctCount++;
      if (this.state.practice.score < 50) this.state.practice.score += 10;
      else if (this.state.practice.score < 80) this.state.practice.score += 7;
      else if (this.state.practice.score < 95) this.state.practice.score += 4;
      else this.state.practice.score = Math.min(100, this.state.practice.score + 2);

      if (this.state.practice.score === 100) {
        this.triggerConfetti();
      }
    } else {
      this.state.practice.score = Math.max(0, this.state.practice.score - 5);
    }

    const skillKey = `${this.state.practice.year}_${this.state.practice.skillCode}`;
    this.state.userProgress[skillKey] = {
      score: this.state.practice.score,
      lastPracticed: Date.now(),
      mastered: this.state.practice.score >= 100
    };
    localStorage.setItem('ixl_user_progress', JSON.stringify(this.state.userProgress));

    this.updateUserStatsDisplay();
    this.renderDiagnosticFeedback(isCorrect);
  }

  renderDiagnosticFeedback(isCorrect) {
    const card = document.querySelector('.cockpit-terminal-card');
    if (!card) return;

    const existingFeedback = document.querySelector('.diagnostic-terminal-feedback');
    if (existingFeedback) existingFeedback.remove();

    // Style option buttons visually
    document.querySelectorAll('.cockpit-option-btn').forEach(btn => {
      const optVal = btn.dataset.opt;
      if (optVal === this.state.practice.currentQuestion.correct) {
        btn.style.borderColor = 'var(--accent-primary)';
        btn.style.background = 'rgba(16, 185, 129, 0.2)';
      } else if (optVal === this.state.practice.selectedOption && !isCorrect) {
        btn.style.borderColor = 'var(--accent-rose)';
        btn.style.background = 'rgba(244, 63, 94, 0.2)';
      }
    });

    const feedback = document.createElement('div');
    feedback.className = `diagnostic-terminal-feedback ${isCorrect ? 'diag-correct' : 'diag-incorrect'}`;
    
    feedback.innerHTML = `
      <div class="diag-title">
        <span>${isCorrect ? '✓ VALIDATED' : '✗ COGNITIVE / SYNTACTIC MISMATCH'}</span>
        <span>— ${isCorrect ? 'Correct Solution' : 'Diagnostic Analysis'}</span>
      </div>
      <div class="diag-body-card">
        <p><strong>Target Key:</strong> ${this.state.practice.currentQuestion.correct}</p>
        <p style="margin-top: 0.6rem; color: var(--text-secondary);"><strong>Pedagogical Analysis:</strong> ${this.state.practice.currentQuestion.explanation}</p>
      </div>
      <div style="display: flex; justify-content: flex-end; margin-top: 0.5rem;">
        <button class="btn-execute-answer" onclick="window.app.nextPracticeQuestion()">
          NEXT QUESTION [↵]
        </button>
      </div>
    `;

    card.appendChild(feedback);

    const scoreVal = document.querySelector('.score-orb-val');
    if (scoreVal) scoreVal.textContent = this.state.practice.score;

    const qCount = document.getElementById('cockpitQCount');
    if (qCount) qCount.textContent = this.state.practice.questionsAnswered;
  }

  speakAudio(text) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-GB';
    utterance.rate = 0.92;
    window.speechSynthesis.speak(utterance);
  }

  renderPracticeView(container) {
    const p = this.state.practice;

    // Safety fallback: ensure question exists
    if (!p.currentQuestion) {
      p.currentQuestion = generateQuestionForSkill(
        p.year || this.state.currentYear,
        p.categoryName || 'Grammar',
        p.skillCode || 'A.1',
        p.skillTitle || 'English Practice'
      );
    }

    const q = p.currentQuestion;

    let optionsHtml = '';
    if (q && q.options) {
      q.options.forEach((opt, idx) => {
        const isSelected = p.selectedOption === opt;
        optionsHtml += `
          <button class="cockpit-option-btn ${isSelected ? 'selected' : ''}" data-opt="${opt}" onclick="window.app.selectOption('${opt.replace(/'/g, "\\'")}')">
            <span class="key-hint-pill">${idx + 1}</span>
            <span>${opt}</span>
          </button>
        `;
      });
    }

    container.innerHTML = `
      <div class="cockpit-container">
        <div class="cockpit-hud-bar">
          <div class="cockpit-meta-group">
            <span class="skill-id-tag">${p.skillCode || 'ACTIVE'}</span>
            <h2 style="margin-top: 0.35rem;">${p.skillTitle || 'Interactive Practice'}</h2>
            <p>${p.year || this.state.currentYear} • ${p.categoryName || 'English Curriculum'}</p>
          </div>
          <div class="hud-smartscore-box">
            <div style="display: flex; gap: 1.25rem; font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-tertiary);">
              <div>QUESTIONS: <strong id="cockpitQCount" style="color: var(--text-primary);">${p.questionsAnswered}</strong></div>
              <div>ELAPSED: <strong id="cockpitTimerDisplay" style="color: var(--text-primary);">00:00</strong></div>
            </div>
            <div class="score-orb-display">
              <div class="score-orb-val">${p.score}</div>
              <div class="score-orb-label">SmartScore</div>
            </div>
          </div>
        </div>

        <div class="cockpit-terminal-card">
          <div class="terminal-prompt-text">${q ? q.prompt : 'Loading question...'}</div>
          
          <button class="audio-synthesizer-btn" onclick="window.app.speakAudio('${q ? q.audioText.replace(/'/g, "\\'") : ''}')">
            <span>🔊</span>
            <span>AUDIO SYNTHESIZER [SPACE]</span>
          </button>

          ${q && q.passage ? `<div class="terminal-passage-box">${q.passage}</div>` : ''}

          <div class="cockpit-options-grid">
            ${optionsHtml}
          </div>

          <div class="cockpit-footer-controls">
            <button onclick="window.app.openLessonById('${p.skillId || 'sk_0'}')" class="filter-pill">
              📖 View Lesson Theory & Guide
            </button>
            <button class="btn-execute-answer" onclick="window.app.submitPracticeAnswer()">
              SUBMIT ANSWER [↵]
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // ====================================================
  // TAB 3: NATIONAL CURRICULUM (DfE FRAMEWORK)
  // ====================================================
  renderStandardsView(container) {
    const stdYear = this.standards[this.state.currentYear] || { standards: [] };

    const grouped = {};
    stdYear.standards.forEach(s => {
      const strand = s['Curriculum Strand'] || 'English Language & Literature';
      if (!grouped[strand]) grouped[strand] = {};
      const obj = s['Objective / Requirement'] || s['Section / Topic'] || 'General Statutory Requirement';
      if (!grouped[strand][obj]) grouped[strand][obj] = [];
      grouped[strand][obj].push(s);
    });

    let strandsHtml = '';
    for (const [strandName, objMap] of Object.entries(grouped)) {
      let objHtml = '';
      for (const [objTitle, skillList] of Object.entries(objMap)) {
        let tagsHtml = '';
        skillList.forEach(sk => {
          const reg = Object.values(this.skillRegistry).find(r => r.code === sk['Skill Code'] && r.year === this.state.currentYear);
          const clickHandler = reg ? `window.app.openLessonById('${reg.id}')` : `window.app.switchTab('curriculum')`;

          tagsHtml += `
            <button class="statutory-tag" onclick="${clickHandler}">
              <strong style="color:var(--accent-primary);">${sk['Skill Code']}</strong>
              <span>${sk['Skill Title']}</span>
            </button>
          `;
        });

        objHtml += `
          <div style="border-left: 2px solid var(--accent-primary); padding-left: 1.2rem; display: flex; flex-direction: column; gap: 0.6rem;">
            <div style="font-size: 0.95rem; font-weight: 600; color: var(--text-primary); line-height: 1.5;">📌 ${objTitle}</div>
            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
              ${tagsHtml}
            </div>
          </div>
        `;
      }

      strandsHtml += `
        <div class="module-card" style="margin-bottom: 1.5rem;">
          <div class="module-card-header" style="background: linear-gradient(90deg, rgba(16,185,129,0.15) 0%, transparent 100%);">
            <span style="font-family: var(--font-display); font-size: 1.15rem; font-weight: 800;">🏛️ ${strandName}</span>
            <span class="grade-badge-count">${Object.keys(objMap).length} Objectives</span>
          </div>
          <div style="padding: 1.5rem; display: flex; flex-direction: column; gap: 1.5rem;">
            ${objHtml}
          </div>
        </div>
      `;
    }

    container.innerHTML = `
      <div>
        <div class="view-hero-card" style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.18) 0%, rgba(14, 22, 38, 0.9) 100%);">
          <div class="hero-tag-badge">Department for Education (DfE) Official Matrix</div>
          <h2 class="hero-heading">${this.state.currentYear} National Curriculum Alignment</h2>
          <p class="hero-subtitle">
            Official statutory requirements established by the UK Department for Education, mapped to self-contained interactive practice modules.
          </p>
        </div>

        ${strandsHtml || '<div style="text-align:center; padding:4rem; color:var(--text-tertiary);">No statutory benchmarks mapped for this tier.</div>'}
      </div>
    `;
  }

  // ====================================================
  // TAB 4: AWARDS & ACHIEVEMENTS
  // ====================================================
  renderAwardsView(container) {
    const masteredCount = Object.values(this.state.userProgress).filter(p => p.score >= 100).length;
    const practicedCount = Object.keys(this.state.userProgress).length;

    const awardsList = [
      { id: 'alpha', name: 'Alpha Genesis', desc: 'Complete your inaugural skill practice session', icon: '🚀', unlocked: practicedCount >= 1 },
      { id: 'century', name: 'Century Club (100)', desc: 'Achieve a pristine SmartScore of 100 in any module', icon: '💯', unlocked: masteredCount >= 1 },
      { id: 'quintet', name: 'Pentad Mastery', desc: 'Attain 100% mastery across 5 distinct skills', icon: '⭐', unlocked: masteredCount >= 5 },
      { id: 'grammarian', name: 'Grand Grammarian', desc: 'Successfully engage with 10 syntactic skills', icon: '⚡', unlocked: practicedCount >= 10 },
      { id: 'lexicon', name: 'Lexicon Titan', desc: 'Master 15 comprehensive vocabulary modules', icon: '🏆', unlocked: masteredCount >= 15 },
      { id: 'scholar', name: 'British Scholar Laureate', desc: 'Attain top-tier mastery across 30 curriculum domains', icon: '👑', unlocked: masteredCount >= 30 }
    ];

    let cardsHtml = '';
    awardsList.forEach(a => {
      cardsHtml += `
        <div class="module-card" style="padding: 2rem 1.5rem; text-align: center; align-items: center; gap: 0.75rem; border-color: ${a.unlocked ? 'var(--accent-amber)' : 'var(--border-subtle)'}; background: ${a.unlocked ? 'linear-gradient(180deg, var(--bg-surface) 0%, rgba(245,158,11,0.05) 100%)' : 'var(--bg-surface)'};">
          <div style="font-size: 3rem; margin-bottom: 0.5rem; filter: ${a.unlocked ? 'none' : 'grayscale(1)'}; opacity: ${a.unlocked ? '1' : '0.4'};">${a.icon}</div>
          <div style="font-family: var(--font-display); font-size: 1.15rem; font-weight: 800;">${a.name}</div>
          <div style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5;">${a.desc}</div>
          <span style="font-family: var(--font-mono); font-size: 0.72rem; font-weight: 700; padding: 0.25rem 0.8rem; border-radius: var(--radius-full); background: ${a.unlocked ? 'rgba(16,185,129,0.15)' : 'var(--bg-subtle)'}; color: ${a.unlocked ? 'var(--accent-primary)' : 'var(--text-tertiary)'}; border: 1px solid ${a.unlocked ? 'rgba(16,185,129,0.3)' : 'var(--border-subtle)'};">
            ${a.unlocked ? '✓ UNLOCKED' : '🔒 LOCKED'}
          </span>
        </div>
      `;
    });

    container.innerHTML = `
      <div style="max-width: 1200px; margin: 0 auto;">
        <div class="view-hero-card" style="background: linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(14, 22, 38, 0.9) 100%);">
          <div class="hero-tag-badge">Honours & Distinctions</div>
          <h2 class="hero-heading">Achievements Wall</h2>
          <p class="hero-subtitle">
            Scale the SmartScore spectrum and unlock commemorative medals, ribbons, and academic distinctions.
          </p>
          <div class="hero-telemetry-row">
            <div class="telemetry-node">
              <span class="telemetry-node-val">${masteredCount}</span>
              <span class="telemetry-node-label">Mastered Skills</span>
            </div>
            <div class="telemetry-node">
              <span class="telemetry-node-val">${practicedCount}</span>
              <span class="telemetry-node-label">Active Modules</span>
            </div>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem;">
          ${cardsHtml}
        </div>
      </div>
    `;
  }

  // ====================================================
  // TAB 5: DIAGNOSTIC ANALYTICS
  // ====================================================
  renderAnalyticsView(container) {
    const progressList = Object.entries(this.state.userProgress);
    const totalMastered = progressList.filter(([_, p]) => p.score >= 100).length;

    let rowsHtml = '';
    progressList.forEach(([key, val]) => {
      const [year, code] = key.split('_');
      rowsHtml += `
        <tr style="border-bottom: 1px solid var(--border-subtle);">
          <td style="padding: 1rem 1.25rem; font-weight: 700;">${year}</td>
          <td style="padding: 1rem 1.25rem;"><span class="skill-id-tag">${code}</span></td>
          <td style="padding: 1rem 1.25rem; font-family: var(--font-mono); font-weight: 800; color: var(--accent-primary);">${val.score} / 100</td>
          <td style="padding: 1rem 1.25rem; font-family: var(--font-mono); font-size: 0.85rem;">${val.score >= 100 ? '★ Mastered' : '🔄 In Progress'}</td>
        </tr>
      `;
    });

    container.innerHTML = `
      <div style="max-width: 1100px; margin: 0 auto;">
        <h2 style="font-family: var(--font-display); font-size: 1.8rem; font-weight: 800; margin-bottom: 1.5rem;">Diagnostic Telemetry & Skill Records</h2>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.25rem; margin-bottom: 2rem;">
          <div class="module-card" style="padding: 1.5rem; text-align: center;">
            <div style="font-family: var(--font-display); font-size: 2.5rem; font-weight: 900; color: var(--accent-primary);">${progressList.length}</div>
            <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-tertiary); text-transform: uppercase;">Total Attempted Skills</div>
          </div>
          <div class="module-card" style="padding: 1.5rem; text-align: center;">
            <div style="font-family: var(--font-display); font-size: 2.5rem; font-weight: 900; color: var(--accent-cyan);">${totalMastered}</div>
            <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-tertiary); text-transform: uppercase;">Mastered (100 SmartScore)</div>
          </div>
        </div>

        <div class="module-card" style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; text-align: left;">
            <thead>
              <tr style="background: var(--bg-surface-elevated); border-bottom: 1px solid var(--border-medium); font-family: var(--font-mono); font-size: 0.78rem; text-transform: uppercase; color: var(--text-tertiary);">
                <th style="padding: 1rem 1.25rem;">Tier / Year</th>
                <th style="padding: 1rem 1.25rem;">Skill Code</th>
                <th style="padding: 1rem 1.25rem;">SmartScore</th>
                <th style="padding: 1rem 1.25rem;">Status</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml || `<tr><td colspan="4" style="text-align: center; padding: 3rem; color: var(--text-tertiary);">No practice telemetry logged yet.</td></tr>`}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // ====================================================
  // TAB 6: ASSESSMENT STUDIO
  // ====================================================
  renderWorksheetsView(container) {
    const yearData = this.curriculum[this.state.currentYear] || { categories: [] };

    let catOptions = '';
    yearData.categories.forEach(c => {
      catOptions += `<option value="${c.category_name}">${c.category_code}. ${c.category_name}</option>`;
    });

    container.innerHTML = `
      <div style="max-width: 850px; margin: 0 auto;">
        <h2 style="font-family: var(--font-display); font-size: 1.8rem; font-weight: 800; margin-bottom: 0.5rem;">Assessment Studio & Worksheet Composer</h2>
        <p style="color: var(--text-secondary); margin-bottom: 2rem;">
          Generate structured, print-ready PDF assessment sheets tailored to British National Curriculum standards.
        </p>

        <div class="module-card" style="padding: 2.2rem; display: flex; flex-direction: column; gap: 1.5rem;">
          <div>
            <label style="font-family: var(--font-mono); font-size: 0.78rem; font-weight: 700; text-transform: uppercase; color: var(--text-tertiary); display: block; margin-bottom: 0.5rem;">Academic Year / Level:</label>
            <select id="wsYearSelect" class="year-dropdown-select" style="width: 100%;" onchange="window.app.updateWorksheetCategories()">
              ${Object.keys(this.curriculum).map(y => `<option value="${y}" ${y === this.state.currentYear ? 'selected' : ''}>${y}</option>`).join('')}
            </select>
          </div>

          <div>
            <label style="font-family: var(--font-mono); font-size: 0.78rem; font-weight: 700; text-transform: uppercase; color: var(--text-tertiary); display: block; margin-bottom: 0.5rem;">Curriculum Domain:</label>
            <select id="wsCatSelect" class="year-dropdown-select" style="width: 100%;">
              ${catOptions}
            </select>
          </div>

          <button class="btn-execute-answer" onclick="window.app.generateAndPrintWorksheet()">
            🖨️ COMPOSE & PRINT ASSESSMENT WORKSHEET
          </button>
        </div>
      </div>
    `;
  }

  updateWorksheetCategories() {
    const sel = document.getElementById('wsYearSelect');
    const catSel = document.getElementById('wsCatSelect');
    if (!sel || !catSel) return;
    const yr = sel.value;
    const yearData = this.curriculum[yr] || { categories: [] };
    catSel.innerHTML = yearData.categories.map(c => `<option value="${c.category_name}">${c.category_code}. ${c.category_name}</option>`).join('');
  }

  generateAndPrintWorksheet() {
    const yr = document.getElementById('wsYearSelect')?.value || 'Year 1';
    const cat = document.getElementById('wsCatSelect')?.value || 'Grammar';
    
    const printWin = window.open('', '_blank');
    printWin.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${yr} English Assessment - ${cat}</title>
        <style>
          body { font-family: 'Times New Roman', serif; padding: 40px; color: #111; line-height: 1.7; font-size: 15px; }
          .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 12px; margin-bottom: 25px; }
          .meta-row { display: flex; justify-content: space-between; margin-bottom: 25px; font-weight: bold; border-bottom: 1px dashed #666; padding-bottom: 8px; }
          .question-item { margin-bottom: 22px; }
          .blank { display: inline-block; width: 160px; border-bottom: 1px solid #000; }
        </style>
      </head>
      <body>
        <div class="header">
          <h2>BRITISH NATIONAL CURRICULUM ASSESSMENT</h2>
          <h4>${yr} English Language & Literature • ${cat}</h4>
        </div>
        <div class="meta-row">
          <span>Candidate Name: ___________________________</span>
          <span>Date: _______________</span>
          <span>Marks: ______ / 20</span>
        </div>
        <div class="question-item">
          <strong>1.</strong> Underline the correct noun form in the sentence: <em>"The foreign delegation inspected the (Cambridge / cambridge) library yesterday."</em>
        </div>
        <div class="question-item">
          <strong>2.</strong> Circle the closest synonym for the word <strong>meticulous</strong>: &nbsp;&nbsp; [a] reckless &nbsp;&nbsp;&nbsp; [b] painstaking &nbsp;&nbsp;&nbsp; [c] indifferent
        </div>
        <div class="question-item">
          <strong>3.</strong> Complete with correct subject-verb concord: <em>"A comprehensive collection of rare manuscripts <span class="blank"></span> (is / are) preserved in the vault."</em>
        </div>
        <div class="question-item">
          <strong>4.</strong> Identify the rhetorical device: <em>"The silence was deafening in the abandoned auditorium."</em> Answer: __________________
        </div>
        <div class="question-item">
          <strong>5.</strong> Punctuate and capitalize correctly: <em>"where are you travelling this summer holiday inquired dr watson"</em>
        </div>
        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
      </html>
    `);
    printWin.document.close();
  }

  // ====================================================
  // CONFETTI CELEBRATION
  // ====================================================
  triggerConfetti() {
    const canvas = document.getElementById('confettiCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const pieces = [];
    const colors = ['#10b981', '#06b6d4', '#34d399', '#f59e0b', '#38bdf8'];
    for (let i = 0; i < 160; i++) {
      pieces.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        r: Math.random() * 8 + 4,
        d: Math.random() * 160,
        color: colors[Math.floor(Math.random() * colors.length)],
        tilt: Math.floor(Math.random() * 10) - 10,
        tiltAngle: 0,
        tiltAngleIncremental: (Math.random() * 0.07) + 0.05
      });
    }

    let animationFrame;
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pieces.forEach(p => {
        p.tiltAngle += p.tiltAngleIncremental;
        p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2;
        p.x += Math.sin(p.d);
        p.tilt = Math.sin(p.tiltAngle) * 15;

        ctx.beginPath();
        ctx.lineWidth = p.r / 2;
        ctx.strokeStyle = p.color;
        ctx.moveTo(p.x + p.tilt + p.r / 4, p.y);
        ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 4);
        ctx.stroke();
      });

      animationFrame = requestAnimationFrame(draw);
    }

    draw();
    setTimeout(() => {
      cancelAnimationFrame(animationFrame);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }, 4500);
  }

  updateUserStatsDisplay() {
    const totalStars = Object.values(this.state.userProgress).filter(p => p.score >= 100).length;
    const starEl = document.getElementById('userStarCount');
    if (starEl) starEl.textContent = totalStars;
  }
}

// Initialise
window.addEventListener('DOMContentLoaded', () => {
  window.app = new IXLApp();
});

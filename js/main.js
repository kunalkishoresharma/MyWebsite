/**
 * THE KUNAL CHRONICLES — EDITORIAL SCRIPTS & INTERACTION ENGINE
 * Craftsmanship by Kunal Kishore Sharma
 * - Live IST Editorial Clock
 * - Web Audio API Synthesized Tactile Sound
 * - Theme Switcher (Morning Edition / Midnight Issue)
 * - Accessibility Lab (WCAG Live Controls)
 * - Interactive Skill Directory & Filter
 * - Architectural Dossier Inspector
 * - Interactive Contact & Copy Dispatcher
 */

(function () {
  'use strict';

  // --- AUDIO SYNTHESIS ENGINE (TACTILE EDITORIAL SOUNDS) ---
  let audioCtx = null;
  let soundEnabled = false;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
  }

  function playEditorialClick(pitch = 800, duration = 0.035) {
    if (!soundEnabled) return;
    try {
      initAudio();
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(pitch, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(pitch * 0.4, audioCtx.currentTime + duration);

      gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // Audio fallback silent
    }
  }

  // --- LIVE IST EDITORIAL CLOCK ---
  function updateLiveClock() {
    const clockElement = document.getElementById('editorial-live-time');
    if (!clockElement) return;

    const now = new Date();
    // Format to Indian Standard Time (IST)
    const options = {
      timeZone: 'Asia/Kolkata',
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    };
    const timeStr = new Intl.DateTimeFormat('en-GB', options).format(now);
    clockElement.textContent = `${timeStr} IST • NAGPUR, IN`;
  }
  setInterval(updateLiveClock, 1000);
  updateLiveClock();

  // --- THEME SWITCHER (MORNING / MIDNIGHT) ---
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const themeLabel = document.getElementById('theme-label');
  
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('kunal_editorial_theme', theme);
    if (themeLabel) {
      themeLabel.textContent = theme === 'midnight' ? 'MIDNIGHT ISSUE' : 'MORNING EDITION';
    }
  }

  const savedTheme = localStorage.getItem('kunal_editorial_theme') || 
    (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'midnight' : 'morning');
  applyTheme(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      playEditorialClick(720);
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'midnight' ? 'morning' : 'midnight';
      applyTheme(next);
    });
  }

  // --- SOUND TOGGLE ---
  const soundToggleBtn = document.getElementById('sound-toggle-btn');
  const soundStatus = document.getElementById('sound-status');
  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      if (soundEnabled) {
        initAudio();
        playEditorialClick(920);
        soundToggleBtn.setAttribute('aria-pressed', 'true');
        if (soundStatus) soundStatus.textContent = 'SOUND: ON';
      } else {
        soundToggleBtn.setAttribute('aria-pressed', 'false');
        if (soundStatus) soundStatus.textContent = 'SOUND: OFF';
      }
    });
  }

  // --- PHOTO TOGGLE (PORTRAIT / OUTDOOR) ---
  const photoButtons = document.querySelectorAll('.photo-toggle-pill');
  const coverImg = document.getElementById('cover-portrait-image');
  const coverCaption = document.getElementById('cover-portrait-caption');

  const photos = {
    portrait: {
      src: 'assets/kunal-portrait.jpg',
      alt: 'Kunal Kishore Sharma — Lead Software Engineer in dark attire and sunglasses',
      caption: 'Fig. 01 — Kunal Kishore Sharma, photographed in reflective contemplation. 11+ years leading enterprise frontend architectures.'
    },
    outdoor: {
      src: 'assets/kunal-outdoor.jpg',
      alt: 'Kunal Kishore Sharma — Outdoor perspective in sunlight',
      caption: 'Fig. 02 — Field perspective: grounded leadership, architectural vision, and cross-cultural enterprise collaboration.'
    }
  };

  photoButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      playEditorialClick(650);
      photoButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const target = btn.getAttribute('data-photo');
      if (coverImg && photos[target]) {
        coverImg.style.opacity = '0';
        setTimeout(() => {
          coverImg.src = photos[target].src;
          coverImg.alt = photos[target].alt;
          if (coverCaption) coverCaption.textContent = photos[target].caption;
          coverImg.style.opacity = '1';
        }, 150);
      }
    });
  });

  // --- STICKY NAV ELEVATION & ACTIVE SCROLL-SPY ---
  const navBar = document.querySelector('.editorial-nav-bar');
  const navItems = document.querySelectorAll('.nav-item');
  const sections = document.querySelectorAll('section[id], header[id]');

  window.addEventListener('scroll', () => {
    if (navBar) {
      if (window.scrollY > 120) {
        navBar.classList.add('scrolled');
      } else {
        navBar.classList.remove('scrolled');
      }
    }

    // Scroll spy
    let currentId = '';
    const scrollPos = window.scrollY + 200;
    sections.forEach(sec => {
      if (sec.offsetTop <= scrollPos) {
        currentId = sec.getAttribute('id');
      }
    });

    navItems.forEach(item => {
      const link = item.querySelector('a');
      if (link && link.getAttribute('href') === `#${currentId}`) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }, { passive: true });

  // Add click sound to all navigation links
  document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('click', () => {
      playEditorialClick(550, 0.02);
    });
  });

  // --- SKILL LEXICON FILTER & SEARCH ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  const searchInput = document.getElementById('lexicon-search');
  const skillCards = document.querySelectorAll('.skill-entry-card');
  const countDisplay = document.getElementById('lexicon-count');

  let activeCategory = 'all';
  let searchTerm = '';

  function filterSkills() {
    let visibleCount = 0;
    skillCards.forEach(card => {
      const categoryAttr = (card.getAttribute('data-category') || '').toLowerCase();
      const cardCategories = categoryAttr.split(/\s+/).filter(Boolean);
      const skillName = (card.querySelector('.skill-name')?.textContent || '').toLowerCase();
      const skillDesc = (card.querySelector('.skill-desc')?.textContent || '').toLowerCase();

      const matchesCat = activeCategory === 'all' || cardCategories.includes(activeCategory.toLowerCase());
      const matchesSearch = !searchTerm || skillName.includes(searchTerm) || skillDesc.includes(searchTerm);

      if (matchesCat && matchesSearch) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (countDisplay) {
      countDisplay.textContent = `${visibleCount} ENTRIES CATALOGED`;
    }
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      playEditorialClick(750);
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.getAttribute('data-filter');
      filterSkills();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchTerm = e.target.value.toLowerCase().trim();
      filterSkills();
    });
  }

  // --- ACCESSIBILITY LAB (LIVE WCAG INTERACTION) ---
  const contrastToggle = document.getElementById('a11y-contrast-toggle');
  const fontSizeSelect = document.getElementById('a11y-font-size');
  const dyslexiaToggle = document.getElementById('a11y-dyslexia-toggle');
  const focusVisualizerToggle = document.getElementById('a11y-focus-toggle');
  const screenReaderSimulator = document.getElementById('sr-simulation-output');

  if (contrastToggle) {
    contrastToggle.addEventListener('click', () => {
      playEditorialClick(800);
      const isHigh = document.documentElement.getAttribute('data-contrast') === 'high';
      if (isHigh) {
        document.documentElement.removeAttribute('data-contrast');
        contrastToggle.textContent = 'SWITCH TO HIGH CONTRAST';
      } else {
        document.documentElement.setAttribute('data-contrast', 'high');
        contrastToggle.textContent = 'RESET TO NATURAL CONTRAST';
      }
    });
  }

  if (fontSizeSelect) {
    fontSizeSelect.addEventListener('change', (e) => {
      playEditorialClick(600);
      document.documentElement.style.setProperty('--scale-font', e.target.value);
    });
  }

  if (dyslexiaToggle) {
    dyslexiaToggle.addEventListener('click', () => {
      playEditorialClick(750);
      const isDyslexia = document.documentElement.getAttribute('data-dyslexia') === 'true';
      if (isDyslexia) {
        document.documentElement.removeAttribute('data-dyslexia');
        dyslexiaToggle.textContent = 'ENABLE DYSLEXIA FONT';
      } else {
        document.documentElement.setAttribute('data-dyslexia', 'true');
        dyslexiaToggle.textContent = 'DISABLE DYSLEXIA FONT';
      }
    });
  }

  if (focusVisualizerToggle) {
    focusVisualizerToggle.addEventListener('click', () => {
      playEditorialClick(820);
      document.body.classList.toggle('highlight-all-focus');
      const active = document.body.classList.contains('highlight-all-focus');
      focusVisualizerToggle.textContent = active ? 'DISABLE FOCUS HIGHLIGHTS' : 'REVEAL FOCUS RINGS';
    });
  }

  // Screen Reader Landmark preview
  const srTriggerBtn = document.getElementById('sr-read-landmarks-btn');
  if (srTriggerBtn && screenReaderSimulator) {
    srTriggerBtn.addEventListener('click', () => {
      playEditorialClick(500);
      const landmarks = [
        '[NVDA / JAWS Virtual Cursor Loaded]',
        'Banner landmark: "THE KUNAL CHRONICLES — Kunal Kishore Sharma"',
        'Navigation landmark with 7 items: Cover Story, The Chronicle, Dossier, Lexicon, Accessibility, Credentials, Dispatches',
        'Main landmark: Primary Article "The Evolution of Modern Frontend"',
        'Heading level 1: "Kunal Kishore Sharma — Lead Software Engineer"',
        'Complementary landmark: "Executive Briefing & Key Indicators: 11+ Years Enterprise Experience"',
        'Region: "The Chronicle — Selected Works: Vivicta (Tietoevry), Hexaware, Wipro, Olive e-business"',
        'ARIA Live Region Status: 100% WCAG 2.1 AA Compliance Verified.'
      ];

      screenReaderSimulator.innerHTML = '';
      landmarks.forEach((line, index) => {
        setTimeout(() => {
          const div = document.createElement('div');
          div.textContent = `> ${line}`;
          screenReaderSimulator.appendChild(div);
          screenReaderSimulator.scrollTop = screenReaderSimulator.scrollHeight;
          playEditorialClick(900 + index * 40, 0.015);
        }, index * 240);
      });
    });
  }

  // --- ARCHITECTURAL DOSSIER MODAL ---
  const dossierModal = document.getElementById('dossier-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalBody = document.getElementById('modal-case-body');

  const dossierCaseStudies = {
    case1: {
      serial: 'VIVICTA PVT. LTD. (TIETOEVRY) // CURRENT PROJECT',
      title: 'Current Project: Fullstack React.js & AI/RAG Architecture with Python, GitHub Copilot & Enterprise UX',
      client: 'Vivicta Pvt. Ltd. (Formerly Tietoevry) • Pune, Maharashtra',
      period: '04/2023 – Present',
      summary: 'Architecting scalable fullstack enterprise solutions combining modern React.js frontend engineering with Python backend services, Retrieval-Augmented Generation (RAG) AI workflows, GitHub Copilot developer acceleration, and human-centric UX alongside Optimizely Commerce B2B platforms.',
      architecture: [
        'Fullstack React.js & Python: Engineered scalable decoupled fullstack architectures integrating responsive React.js frontends with Python microservices and streaming REST APIs.',
        'AI & RAG (Retrieval-Augmented Generation): Implemented RAG pipelines indexing enterprise documentation and catalog data, enabling contextual knowledge retrieval and intelligent generative assistance.',
        'GitHub Copilot Acceleration: Leveraged GitHub Copilot for prompt-assisted code scaffolding, automated Jest test generation, and accelerated pull request cycle times.',
        'Human-Centric UX & Figma: Designed accessible, intuitive UX workflows and reusable component systems in Figma, bridging user journeys with transparent AI reasoning.',
        'Optimizely Commerce B2B: Architected and developed the front-end for Optimizely Commerce B2B e-commerce platform using React.js (TypeScript), delivering high performance and accessibility.',
        'CI/CD & Scalability: Maintained automated Jest-based testing and multi-environment delivery pipelines (Bitbucket, TeamCity, Octopus Deploy).'
      ],
      impact: 'Accelerated development velocity by 45% using GitHub Copilot, empowered enterprise users with contextual RAG AI search, and sustained 100% adherence to WCAG accessibility and performance standards.'
    },
    case2: {
      serial: 'HEXAWARE TECHNOLOGIES // PROJECT DOSSIER',
      title: 'Salesforce Incentive CRM & Mission-Critical Healthcare Web Applications',
      client: 'Hexaware Technologies • Chennai, Tamil Nadu',
      period: '12/2021 – 04/2023',
      summary: 'Engineering two mission-critical systems: a high-throughput Salesforce incentive CRM for sales performance tracking, and sensitive healthcare provider patient-care portals.',
      architecture: [
        'Algorithmic Processing: Front-end calculation engine for dynamic commission models and real-time incentive quotas without server round-trip latency.',
        'Ant Design System: Customization of AntD components for enterprise data density, customizable sorting, and multi-tier filtering.',
        'Agile Delivery: Bi-weekly release cadence with multi-stakeholder architectural alignment and healthcare data privacy standards.',
        'Scalability: Virtualized data tables rendering tens of thousands of real-time rows smoothly at 60 FPS.'
      ],
      impact: 'Automated 100% of manual incentive reconciliation workflows, saving thousands of administrative hours and delivering zero-defect healthcare dashboards.'
    },
    case3: {
      serial: 'WIPRO TECHNOLOGIES // PROJECT DOSSIER',
      title: 'Universal Banking Portal & Strict WCAG A11Y Governance',
      client: 'Wipro Technologies / Rexon • Chennai, Tamil Nadu',
      period: '12/2020 – 11/2021',
      summary: 'Modernizing core banking and financial service interfaces requiring bank-grade security, instantaneous data synchronization, and rigorous Section 508 / WCAG 2.1 compliance.',
      architecture: [
        'Accessibility First: Crafted accessible semantic HTML5 components tested against JAWS, NVDA, and Apple VoiceOver screen readers.',
        'Adobe Experience Manager (AEM): Front-end authorable component library integrated with Java backends, RESTful endpoints, and JSON/AJAX pipelines.',
        'Security & Performance: Bank-grade client-side data sanitation, zero inline scripts, and optimized bundle delivery.',
        'Prototyping: Interactive high-fidelity prototypes tested directly with accessibility auditor groups before production sign-off.'
      ],
      impact: 'Achieved 100% client satisfaction ratings and passed federal and banking accessibility audits with zero compliance findings.'
    },
    case4: {
      serial: 'OLIVE E-BUSINESS PVT. LTD. // PROJECT DOSSIER',
      title: 'Pixel-Perfect Multi-Platform Frontends & CMS Architecture',
      client: 'Olive e-business Pvt. Ltd. • New Delhi, Delhi',
      period: '06/2014 – 11/2020 (6+ Years)',
      summary: 'Six years leading frontend implementations across high-profile client engagements, translating intricate PSD designs into responsive, production-ready web assets across modern CMS engines.',
      architecture: [
        'PSD to Production: Pixel-perfect hand-crafted HTML5 and SCSS architectures with modular CSS architecture patterns.',
        'CMS Dominance: Custom theme development, template engineering, and plugin UI customization across WordPress, Shopify, and Drupal.',
        'Framework Evolution: Spearheaded internal modernization transitions from vanilla jQuery/AngularJS to modern Angular and React.js ecosystems.',
        'Cross-Browser Resilience: Ensuring flawless rendering and responsive performance across iOS, Android, macOS, and Windows browsers.'
      ],
      impact: 'Delivered over 50+ successful client website launches and served as the foundational bedrock of frontend engineering rigor.'
    }
  };

  document.querySelectorAll('.open-dossier-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      playEditorialClick(850);
      const caseId = btn.getAttribute('data-case');
      const data = dossierCaseStudies[caseId];
      if (data && modalBody && dossierModal) {
        modalBody.innerHTML = `
          <div class="case-serial-number">${data.serial}</div>
          <h2 class="serif-heading" style="font-size: 1.8rem; margin-bottom: 0.5rem;">${data.title}</h2>
          <div class="mono-tag" style="margin-bottom: 1.25rem; color: var(--accent-burgundy); font-weight: 700;">
            ${data.client} • ${data.period}
          </div>
          <hr class="rule-single" />
          <div class="lead-story-subtitle" style="margin-top: 1rem;">EXECUTIVE SUMMARY</div>
          <p class="editorial-body-text">${data.summary}</p>
          
          <div class="lead-story-subtitle" style="margin-top: 1.5rem;">ARCHITECTURAL PILLARS & ENGINEERING DECISIONS</div>
          <ul class="chronicle-bullet-list" style="margin-bottom: 1.5rem;">
            ${data.architecture.map(item => `<li class="chronicle-bullet-item">${item}</li>`).join('')}
          </ul>

          <div class="lead-story-subtitle" style="margin-top: 1.5rem;">BUSINESS & TECHNICAL IMPACT</div>
          <div class="case-highlights-box" style="margin-top: 0.5rem;">
            <strong>Verified Outcome:</strong> ${data.impact}
          </div>
          
          <div style="margin-top: 2rem; display: flex; gap: 1rem; flex-wrap: wrap;">
            <a href="assets/Kunal_Kishore_Sharma_Resume.pdf" target="_blank" class="btn-editorial-primary" style="font-size: 0.75rem;">
              Download Complete Resume (PDF) ↗
            </a>
            <a href="https://www.linkedin.com/in/kunalksharma/" target="_blank" rel="noopener noreferrer" class="btn-editorial-secondary" style="font-size: 0.75rem;">
              View LinkedIn Profile ↗
            </a>
          </div>
        `;
        dossierModal.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  function closeModal() {
    playEditorialClick(500);
    if (dossierModal) {
      dossierModal.classList.remove('open');
    }
    const verbatimModal = document.getElementById('verbatim-resume-modal');
    if (verbatimModal) {
      verbatimModal.classList.remove('open');
    }
    document.body.style.overflow = '';
  }

  // --- VERBATIM RESUME MODAL HANDLERS ---
  const verbatimModal = document.getElementById('verbatim-resume-modal');
  const resumeModalCloseBtn = document.getElementById('resume-modal-close-btn');
  const openResumeModalBtn = document.getElementById('open-resume-modal-btn');
  const verbatimTriggers = document.querySelectorAll('.open-verbatim-modal-trigger');

  function openVerbatimModal() {
    playEditorialClick(850);
    if (verbatimModal) {
      verbatimModal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  if (openResumeModalBtn) openResumeModalBtn.addEventListener('click', openVerbatimModal);
  verbatimTriggers.forEach(btn => btn.addEventListener('click', openVerbatimModal));
  if (resumeModalCloseBtn) resumeModalCloseBtn.addEventListener('click', closeModal);
  if (verbatimModal) {
    verbatimModal.addEventListener('click', (e) => {
      if (e.target === verbatimModal) closeModal();
    });
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (dossierModal) {
    dossierModal.addEventListener('click', (e) => {
      if (e.target === dossierModal) closeModal();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  });

  // --- TELEGRAPH / DISPATCH CONTACT FORM ---
  const telegraphForm = document.getElementById('telegraph-form');
  const copyDispatchBtn = document.getElementById('copy-dispatch-btn');
  const formFeedback = document.getElementById('form-feedback');

  function getDispatchText() {
    const name = document.getElementById('form-name')?.value || 'Prospective Collaborator';
    const org = document.getElementById('form-org')?.value || 'Enterprise / Organization';
    const email = document.getElementById('form-email')?.value || 'Not specified';
    const subject = document.getElementById('form-subject')?.value || 'Engineering Leadership Inquiry';
    const message = document.getElementById('form-message')?.value || 'I would like to discuss an opportunity regarding your frontend leadership experience.';

    return `--- DISPATCH TO KUNAL KISHORE SHARMA ---
FROM: ${name} (${org})
REPLY-TO: ${email}
SUBJECT: ${subject}

MESSAGE:
${message}

TIMESTAMP: ${new Date().toUTCString()}
--- END OF TRANSMISSION ---`;
  }

  if (telegraphForm) {
    telegraphForm.addEventListener('submit', (e) => {
      e.preventDefault();
      playEditorialClick(900);
      const name = encodeURIComponent(document.getElementById('form-name')?.value || '');
      const subject = encodeURIComponent(`[Editorial Inquiry] ${document.getElementById('form-subject')?.value || 'Frontend Architecture'}`);
      const body = encodeURIComponent(getDispatchText());

      // Open mailto link
      window.location.href = `mailto:kunalkishoresharma.kk@gmail.com?subject=${subject}&body=${body}`;

      if (formFeedback) {
        formFeedback.className = 'form-feedback-alert success';
        formFeedback.textContent = '✓ Dispatch primed! Your default email client has been launched with the pre-formatted telegram.';
      }
    });
  }

  if (copyDispatchBtn) {
    copyDispatchBtn.addEventListener('click', () => {
      playEditorialClick(850);
      const text = getDispatchText();
      navigator.clipboard.writeText(text).then(() => {
        if (formFeedback) {
          formFeedback.className = 'form-feedback-alert success';
          formFeedback.textContent = '✓ Transmission copied to clipboard! You may paste it directly into an email or messaging channel.';
        }
      }).catch(() => {
        alert('Transmission text ready to copy.');
      });
    });
  }

  // --- BACK TO TOP SMOOTH SCROLL ---
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      playEditorialClick(700);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

})();

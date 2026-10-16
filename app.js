/**
 * LumiX Application Controller
 * Handles UI interactions, view switching, live loader simulation sequence, and asset export.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Core Engines
  const motionEngine = new window.LumixMotionEngine();
  const lottieGen = new window.LumixLottieGenerator();

  let activeExportFormat = 'lottie';
  let demoInterval = null;

  // ==========================================================================
  // Navigation & View Switching
  // ==========================================================================
  const navTabs = document.querySelectorAll('.nav-tab');
  const viewPanels = document.querySelectorAll('.view-panel');

  function switchView(viewName) {
    navTabs.forEach(tab => {
      tab.classList.toggle('active', tab.dataset.view === viewName);
    });
    viewPanels.forEach(panel => {
      const isTarget = panel.id === `view-${viewName}`;
      panel.classList.toggle('active', isTarget);
    });

    if (viewName === 'loader-demo') {
      startDemoSequence();
    } else {
      stopDemoSequence();
    }

    if (viewName === 'lottie-hub') {
      updateCodeOutput();
    }
  }

  navTabs.forEach(tab => {
    tab.addEventListener('click', () => switchView(tab.dataset.view));
  });

  const fullscreenDemoBtn = document.getElementById('fullscreenDemoBtn');
  if (fullscreenDemoBtn) {
    fullscreenDemoBtn.addEventListener('click', () => switchView('loader-demo'));
  }

  // ==========================================================================
  // Motion Studio State Switching
  // ==========================================================================
  const stateBtns = document.querySelectorAll('.state-card-btn');
  stateBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      stateBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const stateName = btn.dataset.state;
      motionEngine.applyState(stateName);
      if (activeExportFormat === 'lottie') {
        updateCodeOutput();
      }
    });
  });

  // Play / Pause & Restart
  const btnPlayPause = document.getElementById('btnPlayPause');
  const playPauseText = document.getElementById('playPauseText');
  const playIcon = document.getElementById('playIcon');

  if (btnPlayPause) {
    btnPlayPause.addEventListener('click', () => {
      const isPlaying = motionEngine.togglePlayPause();
      if (playPauseText) playPauseText.textContent = isPlaying ? 'Pause' : 'Play';
      if (playIcon) {
        playIcon.innerHTML = isPlaying 
          ? '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>'
          : '<path d="M8 5v14l11-7z"/>';
      }
    });
  }

  const btnRestart = document.getElementById('btnRestart');
  if (btnRestart) {
    btnRestart.addEventListener('click', () => motionEngine.restart());
  }

  // Speed Multiplier Chips
  const speedChips = document.querySelectorAll('.speed-chip');
  const speedValueLabel = document.getElementById('speedValueLabel');
  speedChips.forEach(chip => {
    chip.addEventListener('click', () => {
      speedChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const speed = chip.dataset.speed;
      if (speedValueLabel) speedValueLabel.textContent = `${speed}x`;
      motionEngine.setSpeed(speed);
    });
  });

  // Particles Toggle
  const toggleParticles = document.getElementById('toggleParticles');
  if (toggleParticles) {
    toggleParticles.addEventListener('change', (e) => {
      motionEngine.particlesEnabled = e.target.checked;
    });
  }

  // Parameter Tuner Sliders
  const paramAmplitude = document.getElementById('paramAmplitude');
  const ampVal = document.getElementById('ampVal');
  if (paramAmplitude) {
    paramAmplitude.addEventListener('input', (e) => {
      if (ampVal) ampVal.textContent = `${e.target.value}%`;
      motionEngine.setAmplitude(e.target.value);
    });
  }

  const paramGlow = document.getElementById('paramGlow');
  const glowVal = document.getElementById('glowVal');
  if (paramGlow) {
    paramGlow.addEventListener('input', (e) => {
      if (glowVal) glowVal.textContent = `${e.target.value}%`;
      motionEngine.setGlow(e.target.value);
    });
  }

  const paramTilt = document.getElementById('paramTilt');
  const tiltVal = document.getElementById('tiltVal');
  if (paramTilt) {
    paramTilt.addEventListener('input', (e) => {
      if (tiltVal) tiltVal.textContent = `${e.target.value}°`;
      motionEngine.setTilt(e.target.value);
    });
  }

  // Sound Toggle
  const soundToggleBtn = document.getElementById('soundToggleBtn');
  const soundIconOn = document.getElementById('soundIconOn');
  const soundIconOff = document.getElementById('soundIconOff');
  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      motionEngine.soundEnabled = !motionEngine.soundEnabled;
      soundIconOn.style.display = motionEngine.soundEnabled ? 'block' : 'none';
      soundIconOff.style.display = motionEngine.soundEnabled ? 'none' : 'block';
      showToast(motionEngine.soundEnabled ? 'Audio cues enabled' : 'Audio muted');
    });
  }

  // Theme Toggle (Dark / Light)
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      showToast(`Switched to ${newTheme.toUpperCase()} mode`);
    });
  }

  // ==========================================================================
  // VIEW 2: LIVE SIMULATED LOADER FLOW
  // ==========================================================================
  const demoProgressBar = document.getElementById('demoProgressBar');
  const demoPercent = document.getElementById('demoPercent');
  const demoStatusMsg = document.getElementById('demoStatusMsg');
  const demoLoaderSvg = document.getElementById('demoLoaderSvg');
  const demoWingBlue = document.getElementById('demoWingBlue');
  const demoWingCoral = document.getElementById('demoWingCoral');
  const demoCheckmark = document.getElementById('demoCheckmark');
  const loaderBody = document.querySelector('.loader-body');
  const simulatedAppView = document.getElementById('simulatedAppView');
  const restartDemoBtn = document.getElementById('restartDemoBtn');
  const simReplayBtn = document.getElementById('simReplayBtn');

  const steps = [
    { pillId: 'pill1', msg: '1. Initializing LumiX butterfly aerodynamics...', state: 'loading', pct: 20 },
    { pillId: 'pill2', msg: '2. Thinking: Reconciling neural pathways...', state: 'thinking', pct: 45 },
    { pillId: 'pill3', msg: '3. Processing: Synthesizing adaptive model...', state: 'processing', pct: 70 },
    { pillId: 'pill4', msg: '4. Coaching: Aligning interactive modules...', state: 'coaching', pct: 90 },
    { pillId: 'pill5', msg: '5. Complete: Workspace calibrated!', state: 'complete', pct: 100 }
  ];

  function applyDemoSvgState(stateName) {
    if (!demoLoaderSvg) return;
    demoLoaderSvg.className = `demo-loader-svg state-${stateName}`;

    if (stateName === 'loading') {
      demoWingBlue.style.animation = 'butterflyFlapBlue 1.1s infinite cubic-bezier(0.45, 0.05, 0.55, 0.95) alternate';
      demoWingCoral.style.animation = 'butterflyFlapCoral 1.1s infinite cubic-bezier(0.45, 0.05, 0.55, 0.95) alternate';
      demoLoaderSvg.style.animation = 'butterflyFloat 3.2s infinite ease-in-out';
      demoCheckmark.setAttribute('opacity', '0');
    } else if (stateName === 'thinking') {
      demoWingBlue.style.animation = 'none';
      demoWingCoral.style.animation = 'none';
      demoLoaderSvg.style.animation = 'thinkingOrbit 2.4s infinite linear';
      demoCheckmark.setAttribute('opacity', '0');
    } else if (stateName === 'processing') {
      demoWingBlue.style.animation = 'processingVibrateBlue 0.07s infinite linear alternate';
      demoWingCoral.style.animation = 'processingVibrateCoral 0.07s infinite linear alternate';
      demoLoaderSvg.style.animation = 'processingPulseBreath 1.3s infinite ease-in-out';
      demoCheckmark.setAttribute('opacity', '0');
    } else if (stateName === 'coaching') {
      demoWingBlue.style.animation = 'coachingGlideBlue 2.0s infinite cubic-bezier(0.65, 0, 0.35, 1)';
      demoWingCoral.style.animation = 'coachingGlideCoral 2.0s infinite cubic-bezier(0.65, 0, 0.35, 1)';
      demoLoaderSvg.style.animation = 'none';
      demoCheckmark.setAttribute('opacity', '0');
    } else if (stateName === 'complete') {
      demoWingBlue.style.animation = 'completeConvergeBlue 1.6s forwards cubic-bezier(0.25, 1, 0.5, 1)';
      demoWingCoral.style.animation = 'completeConvergeCoral 1.6s forwards cubic-bezier(0.25, 1, 0.5, 1)';
      demoLoaderSvg.style.animation = 'none';
      demoCheckmark.setAttribute('opacity', '1');
      demoCheckmark.style.animation = 'completeCheckmarkReveal 1.6s forwards cubic-bezier(0.34, 1.56, 0.64, 1)';
    }
  }

  function startDemoSequence() {
    stopDemoSequence();
    if (loaderBody) loaderBody.style.display = 'flex';
    if (simulatedAppView) simulatedAppView.style.display = 'none';

    let currentStepIndex = 0;

    const runStep = () => {
      if (currentStepIndex >= steps.length) {
        // Finished -> Show Dashboard
        setTimeout(() => {
          if (loaderBody) loaderBody.style.display = 'none';
          if (simulatedAppView) simulatedAppView.style.display = 'block';
        }, 1200);
        return;
      }

      const s = steps[currentStepIndex];

      // Update pills
      steps.forEach((item, idx) => {
        const el = document.getElementById(item.pillId);
        if (el) {
          el.classList.toggle('active', idx === currentStepIndex);
          el.classList.toggle('completed', idx < currentStepIndex);
        }
      });

      if (demoProgressBar) demoProgressBar.style.width = `${s.pct}%`;
      if (demoPercent) demoPercent.textContent = `${s.pct}%`;
      if (demoStatusMsg) demoStatusMsg.textContent = s.msg;

      applyDemoSvgState(s.state);
      motionEngine.playSound(s.state);

      currentStepIndex++;
      demoInterval = setTimeout(runStep, currentStepIndex === steps.length ? 2200 : 2000);
    };

    runStep();
  }

  function stopDemoSequence() {
    if (demoInterval) {
      clearTimeout(demoInterval);
      demoInterval = null;
    }
  }

  if (restartDemoBtn) restartDemoBtn.addEventListener('click', startDemoSequence);
  if (simReplayBtn) simReplayBtn.addEventListener('click', startDemoSequence);

  // ==========================================================================
  // VIEW 3: LOTTIE HUB & CODE GENERATOR
  // ==========================================================================
  const exportTabs = document.querySelectorAll('.export-tab');
  const codeOutput = document.getElementById('codeOutput');
  const currentFileName = document.getElementById('currentFileName');
  const fileSizeBadge = document.getElementById('fileSizeBadge');
  const downloadLottieBtn = document.getElementById('downloadLottieBtn');
  const downloadBtnLabel = document.getElementById('downloadBtnLabel');
  const copyCodeBtn = document.getElementById('copyCodeBtn');

  function updateCodeOutput() {
    if (!codeOutput) return;
    let content = '';
    let fileName = '';

    if (activeExportFormat === 'lottie') {
      const lottieData = lottieGen.generateLottieJson(motionEngine.currentState);
      content = JSON.stringify(lottieData, null, 2);
      fileName = `lumix-${motionEngine.currentState}-animation.json`;
      if (downloadBtnLabel) downloadBtnLabel.textContent = 'Download Lottie JSON';
    } else if (activeExportFormat === 'css') {
      content = lottieGen.generateCssCode();
      fileName = 'lumix-motion-keyframes.css';
      if (downloadBtnLabel) downloadBtnLabel.textContent = 'Download CSS File';
    } else if (activeExportFormat === 'svg') {
      content = lottieGen.generateSvgCode();
      fileName = 'lumix-master-symbol.svg';
      if (downloadBtnLabel) downloadBtnLabel.textContent = 'Download SVG File';
    } else if (activeExportFormat === 'react') {
      content = lottieGen.generateReactCode();
      fileName = 'LumiXLoader.tsx';
      if (downloadBtnLabel) downloadBtnLabel.textContent = 'Download React Component';
    }

    codeOutput.textContent = content;
    if (currentFileName) currentFileName.textContent = fileName;
    if (fileSizeBadge) {
      const bytes = new Blob([content]).size;
      fileSizeBadge.textContent = bytes > 1024 ? `${(bytes / 1024).toFixed(1)} KB` : `${bytes} B`;
    }
  }

  exportTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      exportTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeExportFormat = tab.dataset.export;
      updateCodeOutput();
    });
  });

  // Download Trigger
  function triggerDownload(filename, text) {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`Downloaded ${filename}`);
  }

  if (downloadLottieBtn) {
    downloadLottieBtn.addEventListener('click', () => {
      const code = codeOutput ? codeOutput.textContent : '';
      const fname = currentFileName ? currentFileName.textContent : 'lumix-export.json';
      triggerDownload(fname, code);
    });
  }

  // Copy Code to Clipboard
  if (copyCodeBtn) {
    copyCodeBtn.addEventListener('click', async () => {
      if (!codeOutput) return;
      try {
        await navigator.clipboard.writeText(codeOutput.textContent);
        showToast('Code copied to clipboard!');
      } catch (e) {
        showToast('Failed to copy. Please copy manually.');
      }
    });
  }

  // Batch Download Buttons
  const batchBtns = document.querySelectorAll('.batch-dl-btn');
  batchBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const preset = btn.dataset.preset;
      const data = lottieGen.generateLottieJson(preset);
      triggerDownload(`lumix-${preset}-lottie.json`, JSON.stringify(data, null, 2));
    });
  });

  // Toast Helper
  function showToast(message) {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <svg viewBox="0 0 24 24" width="16" height="16" fill="var(--lumix-blue)">
        <circle cx="12" cy="12" r="10"/>
      </svg>
      <span>${message}</span>
    `;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px) scale(0.9)';
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  }

  // Initialize initial code output
  updateCodeOutput();
});

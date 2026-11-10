/**
 * LumiX Motion Engine
 * Manages motion states, 3D perspective physics, and Web Audio cues.
 */

class LumixMotionEngine {
  constructor() {
    this.currentState = 'loading';
    this.speed = 1.0;
    this.amplitude = 1.0;
    this.glow = 1.0;
    this.tilt = 45;
    this.isPlaying = true;
    this.soundEnabled = false;

    // DOM Elements
    this.stageCard = document.getElementById('stageCard');
    this.masterSvg = document.getElementById('masterLogoSvg');
    this.wingBlueGroup = document.getElementById('wingBlueGroup');
    this.wingCoralGroup = document.getElementById('wingCoralGroup');
    this.wingBlueTrace = document.getElementById('wingBlueTrace');
    this.wingCoralTrace = document.getElementById('wingCoralTrace');
    this.completeShineGroup = document.getElementById('completeShineGroup');
    this.statusText = document.getElementById('currentStatusText');
    this.stateTitle = document.getElementById('stateTitle');
    this.stateDesc = document.getElementById('stateDesc');
    this.fpsCounter = document.getElementById('fpsCounter');

    this.lastFrameTime = performance.now();
    this.frameCount = 0;
    this.lastFpsUpdate = performance.now();

    // Audio Context (Lazy init)
    this.audioCtx = null;

    this.initAudio();
    this.applyState('loading');
    this.startAnimationLoop();
  }

  initAudio() {
    const initCtx = () => {
      if (!this.audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          this.audioCtx = new AudioContext();
        }
      }
    };
    window.addEventListener('click', initCtx, { once: true });
    window.addEventListener('touchstart', initCtx, { once: true });
  }

  playSound(type) {
    if (!this.soundEnabled || !this.audioCtx) return;
    try {
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      if (type === 'loading') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(440, now + 0.3);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (type === 'thinking') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.4);
        gain.gain.setValueAtTime(0.07, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
        osc.start(now);
        osc.stop(now + 0.45);
      } else if (type === 'processing') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.linearRampToValueAtTime(880, now + 0.2);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      } else if (type === 'coaching') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.linearRampToValueAtTime(350, now + 0.15);
        osc.frequency.linearRampToValueAtTime(520, now + 0.3);
        gain.gain.setValueAtTime(0.07, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (type === 'complete') {
        // Line light trace shimmer sweep followed by chord bloom
        const sweepOsc = this.audioCtx.createOscillator();
        const sweepGain = this.audioCtx.createGain();
        sweepOsc.type = 'triangle';
        sweepOsc.frequency.setValueAtTime(350, now);
        sweepOsc.frequency.exponentialRampToValueAtTime(1200, now + 0.6);
        sweepGain.gain.setValueAtTime(0.04, now);
        sweepGain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
        sweepOsc.connect(sweepGain);
        sweepGain.connect(this.audioCtx.destination);
        sweepOsc.start(now);
        sweepOsc.stop(now + 0.65);

        // Radiant shine chime burst
        const freqs = [523.25, 659.25, 783.99, 1046.50, 1318.51];
        freqs.forEach((f, idx) => {
          const chordOsc = this.audioCtx.createOscillator();
          const chordGain = this.audioCtx.createGain();
          chordOsc.type = 'sine';
          const startTime = now + 0.55 + idx * 0.05;
          chordOsc.frequency.setValueAtTime(f, startTime);
          chordGain.gain.setValueAtTime(0.06, startTime);
          chordGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.9);
          chordOsc.connect(chordGain);
          chordGain.connect(this.audioCtx.destination);
          chordOsc.start(startTime);
          chordOsc.stop(startTime + 0.9);
        });
      }
    } catch (e) {
      console.warn('Audio playback error', e);
    }
  }

  applyState(stateName) {
    this.currentState = stateName;

    // Reset root state classes
    if (this.stageCard) {
      this.stageCard.className = 'stage-card';
      this.stageCard.classList.add(`state-${stateName}`);
    }

    // Reset complete trace & shine animations if switching states
    if (stateName !== 'complete') {
      if (this.wingBlueTrace) this.wingBlueTrace.style.animation = 'none';
      if (this.wingCoralTrace) this.wingCoralTrace.style.animation = 'none';
      if (this.completeShineGroup) this.completeShineGroup.style.animation = 'none';
    } else {
      if (this.wingBlueTrace) this.wingBlueTrace.style.animation = '';
      if (this.wingCoralTrace) this.wingCoralTrace.style.animation = '';
      if (this.completeShineGroup) this.completeShineGroup.style.animation = '';
    }

    // Update Headings and Metadata
    const stateMeta = {
      loading: {
        title: 'Butterfly Loading',
        desc: '3D fluttering wings moving with fluid aerodynamic physics and luminescence along the diagonal spine.',
        status: 'STATE: BUTTERFLY LOADING'
      },
      thinking: {
        title: 'Thinking (Orbital)',
        desc: 'Both quadrilaterals revolving around each other in smooth circular orbit.',
        status: 'STATE: THINKING (ORBIT)'
      },
      processing: {
        title: 'Processing (Harmonic)',
        desc: 'Rapid micro-vibration oscillating scale from smaller to bigger with high-frequency resonance.',
        status: 'STATE: PROCESSING (VIBRATE)'
      },
      coaching: {
        title: 'Coaching (Reciprocal)',
        desc: 'Quadrilaterals moving opposing left and right along each other in rhythmic synchronization.',
        status: 'STATE: COACHING (SLIDE)'
      },
      complete: {
        title: 'Complete (Shine)',
        desc: 'A radiant line of light sweeps around the logo geometry, culminating in a brilliant whole-emblem shine.',
        status: 'STATE: COMPLETE (SHINE)'
      },
      separating: {
        title: 'Explode & Snap',
        desc: 'Magnetic tension pulls pieces outward into exploded view and snaps them back with elastic dampening.',
        status: 'STATE: EXPLODE & SNAP'
      }
    };

    const meta = stateMeta[stateName] || stateMeta.loading;
    if (this.stateTitle) this.stateTitle.textContent = meta.title;
    if (this.stateDesc) this.stateDesc.textContent = meta.desc;
    if (this.statusText) this.statusText.textContent = meta.status;

    // Trigger state sound
    this.playSound(stateName);
  }

  setSpeed(val) {
    this.speed = parseFloat(val);
    document.documentElement.style.setProperty('--speed-multiplier', this.speed);

    // Adjust CSS animation durations accordingly
    const logoSystem = document.getElementById('lumixLogoSystem');
    const blueGroup = document.getElementById('wingBlueGroup');
    const coralGroup = document.getElementById('wingCoralGroup');

    if (logoSystem) {
      logoSystem.style.animationDuration = `${3.2 / this.speed}s`;
    }
    if (blueGroup && coralGroup) {
      if (this.currentState === 'loading') {
        blueGroup.style.animationDuration = `${1.1 / this.speed}s`;
        coralGroup.style.animationDuration = `${1.1 / this.speed}s`;
      } else if (this.currentState === 'thinking') {
        blueGroup.style.animationDuration = `${2.2 / this.speed}s`;
        coralGroup.style.animationDuration = `${2.2 / this.speed}s`;
        if (logoSystem) logoSystem.style.animationDuration = `${2.2 / this.speed}s`;
      } else if (this.currentState === 'processing') {
        blueGroup.style.animationDuration = `${0.08 / this.speed}s, ${1.2 / this.speed}s`;
        coralGroup.style.animationDuration = `${0.08 / this.speed}s, ${1.2 / this.speed}s`;
        if (logoSystem) logoSystem.style.animationDuration = `${1.2 / this.speed}s`;
      } else if (this.currentState === 'coaching') {
        blueGroup.style.animationDuration = `${2.0 / this.speed}s`;
        coralGroup.style.animationDuration = `${2.0 / this.speed}s`;
      } else if (this.currentState === 'complete') {
        blueGroup.style.animationDuration = `${2.4 / this.speed}s`;
        coralGroup.style.animationDuration = `${2.4 / this.speed}s`;
        if (this.wingBlueTrace) this.wingBlueTrace.style.animationDuration = `${1.4 / this.speed}s`;
        if (this.wingCoralTrace) this.wingCoralTrace.style.animationDuration = `${1.4 / this.speed}s`;
        if (this.completeShineGroup) this.completeShineGroup.style.animationDuration = `${2.4 / this.speed}s`;
        if (logoSystem) logoSystem.style.animationDuration = `${2.4 / this.speed}s`;
      } else if (this.currentState === 'separating') {
        blueGroup.style.animationDuration = `${2.4 / this.speed}s`;
        coralGroup.style.animationDuration = `${2.4 / this.speed}s`;
      }
    }
  }

  setAmplitude(val) {
    this.amplitude = val / 100;
    document.documentElement.style.setProperty('--amplitude-scale', this.amplitude);
  }

  setGlow(val) {
    this.glow = val / 100;
    document.documentElement.style.setProperty('--glow-intensity', this.glow);
    const blueGlow = document.getElementById('blueGlow');
    const coralGlow = document.getElementById('coralGlow');
    if (blueGlow && coralGlow) {
      const dev = Math.max(1, 8 * this.glow);
      blueGlow.querySelector('feGaussianBlur').setAttribute('stdDeviation', dev);
      coralGlow.querySelector('feGaussianBlur').setAttribute('stdDeviation', dev);
    }
  }

  setTilt(val) {
    this.tilt = val;
    document.documentElement.style.setProperty('--tilt-angle', `${this.tilt}deg`);
  }

  togglePlayPause() {
    this.isPlaying = !this.isPlaying;
    const playState = this.isPlaying ? 'running' : 'paused';
    const logoSystem = document.getElementById('lumixLogoSystem');
    const blueGroup = document.getElementById('wingBlueGroup');
    const coralGroup = document.getElementById('wingCoralGroup');

    if (logoSystem) logoSystem.style.animationPlayState = playState;
    if (blueGroup) blueGroup.style.animationPlayState = playState;
    if (coralGroup) coralGroup.style.animationPlayState = playState;

    return this.isPlaying;
  }

  restart() {
    // Briefly clear animation and re-apply
    const blueGroup = document.getElementById('wingBlueGroup');
    const coralGroup = document.getElementById('wingCoralGroup');
    const logoSystem = document.getElementById('lumixLogoSystem');
    const blueTrace = document.getElementById('wingBlueTrace');
    const coralTrace = document.getElementById('wingCoralTrace');
    const shineGroup = document.getElementById('completeShineGroup');

    const els = [blueGroup, coralGroup, logoSystem, blueTrace, coralTrace, shineGroup].filter(Boolean);
    els.forEach(el => {
      el.style.animation = 'none';
      void el.offsetWidth; // trigger reflow
      el.style.animation = '';
    });
    this.applyState(this.currentState);
  }

  startAnimationLoop() {
    const loop = (now) => {
      this.frameCount++;
      if (now - this.lastFpsUpdate >= 500) {
        const fps = Math.round((this.frameCount * 1000) / (now - this.lastFpsUpdate));
        if (this.fpsCounter) this.fpsCounter.textContent = `${fps} FPS`;
        this.frameCount = 0;
        this.lastFpsUpdate = now;
      }

      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }
}

window.LumixMotionEngine = LumixMotionEngine;

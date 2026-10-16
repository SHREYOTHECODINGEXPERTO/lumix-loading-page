/**
 * LumiX Motion Engine & Particle System
 * Manages motion states, aerodynamic particle flow, 3D perspective physics, and Web Audio cues.
 */

class LumixMotionEngine {
  constructor() {
    this.currentState = 'loading';
    this.speed = 1.0;
    this.amplitude = 1.0;
    this.glow = 1.0;
    this.tilt = 45;
    this.isPlaying = true;
    this.particlesEnabled = true;
    this.soundEnabled = false;

    // DOM Elements
    this.stageCard = document.getElementById('stageCard');
    this.masterSvg = document.getElementById('masterLogoSvg');
    this.wingBlueGroup = document.getElementById('wingBlueGroup');
    this.wingCoralGroup = document.getElementById('wingCoralGroup');
    this.completeGroup = document.getElementById('completeCheckmarkGroup');
    this.statusText = document.getElementById('currentStatusText');
    this.stateTitle = document.getElementById('stateTitle');
    this.stateDesc = document.getElementById('stateDesc');
    this.fpsCounter = document.getElementById('fpsCounter');
    this.canvas = document.getElementById('particleCanvas');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;

    // Particle System Properties
    this.particles = [];
    this.maxParticles = 80;
    this.lastFrameTime = performance.now();
    this.frameCount = 0;
    this.lastFpsUpdate = performance.now();

    // Audio Context (Lazy init)
    this.audioCtx = null;

    this.initCanvas();
    this.initAudio();
    this.applyState('loading');
    this.startAnimationLoop();
  }

  initCanvas() {
    if (!this.canvas) return;
    const resize = () => {
      const rect = this.canvas.parentElement.getBoundingClientRect();
      this.canvas.width = rect.width;
      this.canvas.height = rect.height;
    };
    resize();
    window.addEventListener('resize', resize);
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
        // Chord progression
        const freqs = [523.25, 659.25, 783.99, 1046.50];
        freqs.forEach((f, idx) => {
          const chordOsc = this.audioCtx.createOscillator();
          const chordGain = this.audioCtx.createGain();
          chordOsc.type = 'sine';
          chordOsc.frequency.setValueAtTime(f, now + idx * 0.06);
          chordGain.gain.setValueAtTime(0.06, now + idx * 0.06);
          chordGain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.7);
          chordOsc.connect(chordGain);
          chordGain.connect(this.audioCtx.destination);
          chordOsc.start(now + idx * 0.06);
          chordOsc.stop(now + idx * 0.06 + 0.7);
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

    // Reset checkmark animations if returning from complete
    if (this.completeGroup && stateName !== 'complete') {
      this.completeGroup.setAttribute('opacity', '0');
      const checkPath = document.getElementById('checkmarkPath');
      if (checkPath) checkPath.style.strokeDashoffset = '120';
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
        desc: 'Both quadrilaterals revolving around each other in smooth circular orbit with pulsing energy waves.',
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
        title: 'Complete (Morph)',
        desc: 'Pieces slowly come close together, lock into center, and convert into a glowing emerald tick mark.',
        status: 'STATE: COMPLETE (RESOLVED)'
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

    // Spawn state particles burst
    this.burstParticles(stateName);
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
        blueGroup.style.animationDuration = `${1.6 / this.speed}s`;
        coralGroup.style.animationDuration = `${1.6 / this.speed}s`;
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
    const energyRing = document.getElementById('energyRing');

    if (logoSystem) logoSystem.style.animationPlayState = playState;
    if (blueGroup) blueGroup.style.animationPlayState = playState;
    if (coralGroup) coralGroup.style.animationPlayState = playState;
    if (energyRing) energyRing.style.animationPlayState = playState;

    return this.isPlaying;
  }

  restart() {
    // Briefly clear animation and re-apply
    const blueGroup = document.getElementById('wingBlueGroup');
    const coralGroup = document.getElementById('wingCoralGroup');
    if (blueGroup && coralGroup) {
      blueGroup.style.animation = 'none';
      coralGroup.style.animation = 'none';
      void blueGroup.offsetWidth; // trigger reflow
      void coralGroup.offsetWidth;
      blueGroup.style.animation = '';
      coralGroup.style.animation = '';
    }
    this.applyState(this.currentState);
  }

  burstParticles(stateName) {
    if (!this.canvas || !this.particlesEnabled) return;
    const cx = this.canvas.width / 2;
    const cy = this.canvas.height / 2;
    const count = stateName === 'complete' ? 50 : 25;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 3 + 1;
      const color = stateName === 'complete' 
        ? '#10B981' 
        : (Math.random() > 0.5 ? '#2870ED' : '#F07150');

      this.particles.push({
        x: cx + (Math.random() - 0.5) * 40,
        y: cy + (Math.random() - 0.5) * 40,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 3.5 + 1.5,
        alpha: 1,
        color: color,
        life: 1,
        decay: Math.random() * 0.02 + 0.015,
        type: stateName
      });
    }
  }

  updateParticles() {
    if (!this.canvas || !this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (!this.particlesEnabled) return;

    const cx = this.canvas.width / 2;
    const cy = this.canvas.height / 2;

    // Ambient stardust generation
    if (this.particles.length < this.maxParticles && Math.random() < 0.3) {
      const isBlue = Math.random() > 0.5;
      this.particles.push({
        x: cx + (Math.random() - 0.5) * 160,
        y: cy + (Math.random() - 0.5) * 160,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8 - 0.4,
        size: Math.random() * 2.5 + 1,
        alpha: Math.random() * 0.6 + 0.2,
        color: isBlue ? '#2870ED' : '#F07150',
        life: 1,
        decay: Math.random() * 0.01 + 0.005,
        type: 'ambient'
      });
    }

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];

      // Motion dynamics per state
      if (this.currentState === 'thinking') {
        const dx = p.x - cx;
        const dy = p.y - cy;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        p.vx += (-dy / dist) * 0.15;
        p.vy += (dx / dist) * 0.15;
      } else if (this.currentState === 'processing') {
        p.vx += (Math.random() - 0.5) * 0.5;
        p.vy += (Math.random() - 0.5) * 0.5;
      }

      p.x += p.vx * this.speed;
      p.y += p.vy * this.speed;
      p.life -= p.decay * this.speed;
      p.alpha = Math.max(0, p.life);

      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = p.alpha;
      this.ctx.fillStyle = p.color;
      this.ctx.shadowBlur = 8;
      this.ctx.shadowColor = p.color;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }
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

      if (this.isPlaying) {
        this.updateParticles();
      }

      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }
}

window.LumixMotionEngine = LumixMotionEngine;

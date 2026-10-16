# ✨ LumiX — Animated Logo & Loader Design System

> A state-of-the-art motion system, interactive loader sandbox, and Lottie generation engine for the LumiX brand identity.

---

## 🚀 Overview

**LumiX** is an interactive web experience showcasing dynamic motion design, brand loader states, and procedural animation generation. It includes multiple operational views for motion tuning, live loader simulation, Lottie JSON export, and brand design guidelines.

### 🌟 Key Highlights

- **Motion Studio**: Fine-tune animation parameters in real-time (speed, amplitude, damping, blur, glow effects).
- **Multi-State Motion Engine**:
  - 🦋 *Butterfly Flutter* — Fluid wing flap kinematics with dual-layer glow.
  - 🪐 *Thinking Orbit* — Orbital tracking particles with magnetic acceleration.
  - ⚡ *Processing Pulse* — High-frequency harmonic vibration and pulse rings.
  - 📐 *Coaching Slide* — Geometric deconstruction and alignment trajectories.
  - 🎯 *Completion Morph* — Elastic spring transition to checkmark/success state.
- **Live Loader Demo**: Fullscreen simulated application boot sequence with realistic progress simulation, step triggers, and audio cues.
- **Lottie & Code Export**: Procedural Lottie JSON generator and embed code export (SVG, CSS Keyframes, Canvas).
- **Interactive Audio & Theming**: Synthesized Web Audio API sound effects and seamless Dark/Light theme switching.

---

## 🛠️ Tech Stack

- **HTML5**: Semantic layout and accessible structure.
- **Vanilla CSS3**: Modern custom properties, backdrop blur (glassmorphism), CSS animations, and responsive grids.
- **Vanilla JavaScript (ES6+)**:
  - `motion-engine.js`: High-performance requestAnimationFrame loop with physics easing.
  - `lottie-generator.js`: Programmatic Bodymovin-compliant Lottie JSON synthesis.
  - `app.js`: UI orchestration, Web Audio sound effects, and state management.

---

## 📁 Project Structure

```
├── index.html            # Main application layout and view containers
├── styles.css            # Design system, glassmorphism styles, responsive UI
├── app.js                # View switching, controls, audio synthesis, and event binding
├── motion-engine.js      # Physics-based canvas/SVG motion animation driver
├── lottie-generator.js   # Procedural Lottie JSON exporter
├── .gitignore            # Git ignore file
└── README.md             # Project documentation
```

---

## 💻 Getting Started Locally

No build tools or external package dependencies required!

1. Clone this repository:
   ```bash
   git clone https://github.com/SHREYOTHECODINGEXPERTO/lumix-loading-page.git
   ```
2. Open `index.html` in your modern web browser, or serve it using a local static server:
   ```bash
   # Using VS Code Live Server, or Python:
   python -m http.server 8000
   ```
3. Open `http://localhost:8000` to explore the Motion Studio!

---

## 📄 License

MIT License © 2026 [SHREYOTHECODINGEXPERTO](https://github.com/SHREYOTHECODINGEXPERTO)

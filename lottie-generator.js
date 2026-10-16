/**
 * LumiX Lottie JSON & Multi-Platform Code Generator
 * Generates verified Bodymovin/Lottie JSON (v5.5+), Pure CSS, SVG symbols, and React components.
 */

class LumixLottieGenerator {
  constructor() {
    this.brandColors = {
      blue: '#2870ED',
      blueRgba: [0.157, 0.439, 0.929, 1],
      coral: '#F07150',
      coralRgba: [0.941, 0.443, 0.314, 1],
      green: '#10B981',
      greenRgba: [0.063, 0.725, 0.506, 1]
    };
  }

  /**
   * Generates a valid Lottie JSON animation object for any given state
   */
  generateLottieJson(state = 'loading') {
    const isThinking = state === 'thinking';
    const isProcessing = state === 'processing';
    const isCoaching = state === 'coaching';
    const isComplete = state === 'complete';
    const isButterfly = state === 'loading';

    // Base Lottie Container Schema (v5.5.2)
    const lottieDoc = {
      v: "5.5.2",
      fr: 60,
      ip: 0,
      op: 120,
      w: 400,
      h: 400,
      nm: `LumiX Logo Animation — ${state.toUpperCase()}`,
      ddd: 0,
      assets: [],
      layers: [
        // Layer 1: Blue Wing Quadrilateral (Top-Left)
        {
          ddd: 0,
          ind: 1,
          ty: 4, // Shape layer
          nm: "LumiX_Blue_Wing",
          sr: 1,
          ks: {
            o: { a: 0, k: 100 },
            r: isThinking 
              ? { a: 1, k: [{ t: 0, s: [0], e: [360] }, { t: 120, s: [360] }] }
              : isButterfly
              ? { a: 1, k: [{ t: 0, s: [-8], e: [8] }, { t: 60, s: [8], e: [-8] }, { t: 120, s: [-8] }] }
              : { a: 0, k: 0 },
            p: isCoaching
              ? { a: 1, k: [{ t: 0, s: [160, 200, 0], e: [240, 200, 0] }, { t: 60, s: [240, 200, 0], e: [160, 200, 0] }, { t: 120, s: [160, 200, 0] }] }
              : isProcessing
              ? { a: 1, k: [{ t: 0, s: [198, 198, 0], e: [202, 202, 0] }, { t: 15, s: [202, 202, 0], e: [198, 198, 0] }, { t: 30, s: [198, 198, 0] }] }
              : isComplete
              ? { a: 1, k: [{ t: 0, s: [150, 150, 0], e: [200, 200, 0] }, { t: 50, s: [200, 200, 0] }, { t: 60, s: [200, 200, 0] }] }
              : { a: 0, k: [200, 200, 0] },
            a: { a: 0, k: [100, 100, 0] },
            s: isProcessing
              ? { a: 1, k: [{ t: 0, s: [90, 90, 100], e: [115, 115, 100] }, { t: 60, s: [115, 115, 100], e: [90, 90, 100] }, { t: 120, s: [90, 90, 100] }] }
              : isComplete
              ? { a: 1, k: [{ t: 0, s: [100, 100, 100], e: [100, 100, 100] }, { t: 50, s: [80, 80, 100], e: [0, 0, 100] }, { t: 65, s: [0, 0, 100] }] }
              : { a: 0, k: [100, 100, 100] }
          },
          ao: 0,
          shapes: [
            {
              ty: "gr",
              nm: "Wing_Group",
              it: [
                {
                  ty: "sh",
                  nm: "Blue_Path",
                  ks: {
                    a: 0,
                    k: {
                      c: true,
                      v: [[44, 175], [112, 175], [124, 170], [163, 131], [168, 119], [168, 56], [155, 50], [37, 168]],
                      i: [[0, 0], [-2, 0], [-2, -2], [-2, -2], [0, 2], [0, -3], [-3, -2], [2, 2]],
                      o: [[2, 0], [2, 0], [2, 2], [2, 2], [0, -3], [0, 2], [3, 2], [-2, -2]]
                    }
                  }
                },
                {
                  ty: "fl",
                  nm: "Fill",
                  c: { a: 0, k: this.brandColors.blueRgba },
                  o: { a: 0, k: 100 }
                },
                {
                  ty: "tr",
                  p: { a: 0, k: [0, 0] },
                  a: { a: 0, k: [0, 0] },
                  s: { a: 0, k: [100, 100] },
                  r: { a: 0, k: 0 },
                  o: { a: 0, k: 100 }
                }
              ]
            }
          ],
          ip: 0,
          op: 120,
          st: 0,
          bm: 0
        },

        // Layer 2: Coral Wing Quadrilateral (Bottom-Right)
        {
          ddd: 0,
          ind: 2,
          ty: 4,
          nm: "LumiX_Coral_Wing",
          sr: 1,
          ks: {
            o: { a: 0, k: 100 },
            r: isThinking
              ? { a: 1, k: [{ t: 0, s: [0], e: [360] }, { t: 120, s: [360] }] }
              : isButterfly
              ? { a: 1, k: [{ t: 0, s: [8], e: [-8] }, { t: 60, s: [-8], e: [8] }, { t: 120, s: [8] }] }
              : { a: 0, k: 0 },
            p: isCoaching
              ? { a: 1, k: [{ t: 0, s: [230, 200, 0], e: [170, 200, 0] }, { t: 60, s: [170, 200, 0], e: [230, 200, 0] }, { t: 120, s: [230, 200, 0] }] }
              : isProcessing
              ? { a: 1, k: [{ t: 0, s: [201, 201, 0], e: [199, 199, 0] }, { t: 15, s: [199, 199, 0], e: [201, 201, 0] }, { t: 30, s: [201, 201, 0] }] }
              : isComplete
              ? { a: 1, k: [{ t: 0, s: [230, 230, 0], e: [200, 200, 0] }, { t: 50, s: [200, 200, 0] }, { t: 60, s: [200, 200, 0] }] }
              : { a: 0, k: [200, 200, 0] },
            a: { a: 0, k: [150, 150, 0] },
            s: isProcessing
              ? { a: 1, k: [{ t: 0, s: [92, 92, 100], e: [114, 114, 100] }, { t: 60, s: [114, 114, 100], e: [92, 92, 100] }, { t: 120, s: [92, 92, 100] }] }
              : isComplete
              ? { a: 1, k: [{ t: 0, s: [100, 100, 100], e: [100, 100, 100] }, { t: 50, s: [80, 80, 100], e: [0, 0, 100] }, { t: 65, s: [0, 0, 100] }] }
              : { a: 0, k: [100, 100, 100] }
          },
          ao: 0,
          shapes: [
            {
              ty: "gr",
              nm: "Wing_Group",
              it: [
                {
                  ty: "sh",
                  nm: "Coral_Path",
                  ks: {
                    a: 0,
                    k: {
                      c: true,
                      v: [[256, 125], [188, 125], [176, 130], [137, 169], [132, 181], [132, 244], [145, 250], [263, 132]],
                      i: [[0, 0], [2, 0], [2, 2], [2, 2], [0, -2], [0, 3], [3, 2], [-2, -2]],
                      o: [[-2, 0], [-2, 0], [-2, -2], [-2, -2], [0, 3], [0, -2], [-3, -2], [2, 2]]
                    }
                  }
                },
                {
                  ty: "fl",
                  nm: "Fill",
                  c: { a: 0, k: this.brandColors.coralRgba },
                  o: { a: 0, k: 100 }
                },
                {
                  ty: "tr",
                  p: { a: 0, k: [0, 0] },
                  a: { a: 0, k: [0, 0] },
                  s: { a: 0, k: [100, 100] },
                  r: { a: 0, k: 0 },
                  o: { a: 0, k: 100 }
                }
              ]
            }
          ],
          ip: 0,
          op: 120,
          st: 0,
          bm: 0
        }
      ]
    };

    // If complete state, add checkmark layer
    if (isComplete) {
      lottieDoc.layers.unshift({
        ddd: 0,
        ind: 0,
        ty: 4,
        nm: "Complete_Tick_Mark",
        sr: 1,
        ks: {
          o: { a: 1, k: [{ t: 0, s: [0], e: [0] }, { t: 55, s: [0], e: [100] }, { t: 70, s: [100] }] },
          r: { a: 0, k: 0 },
          p: { a: 0, k: [200, 200, 0] },
          a: { a: 0, k: [150, 150, 0] },
          s: { a: 1, k: [{ t: 0, s: [20, 20, 100], e: [20, 20, 100] }, { t: 55, s: [20, 20, 100], e: [112, 112, 100] }, { t: 75, s: [112, 112, 100], e: [100, 100, 100] }, { t: 90, s: [100, 100, 100] }] }
        },
        ao: 0,
        shapes: [
          {
            ty: "gr",
            nm: "Green_Circle",
            it: [
              {
                ty: "el",
                p: { a: 0, k: [150, 150] },
                s: { a: 0, k: [140, 140] }
              },
              {
                ty: "fl",
                c: { a: 0, k: this.brandColors.greenRgba },
                o: { a: 0, k: 100 }
              },
              {
                ty: "tr",
                p: { a: 0, k: [0, 0] },
                a: { a: 0, k: [0, 0] },
                s: { a: 0, k: [100, 100] },
                r: { a: 0, k: 0 },
                o: { a: 0, k: 100 }
              }
            ]
          }
        ],
        ip: 0,
        op: 120,
        st: 0,
        bm: 0
      });
    }

    return lottieDoc;
  }

  /**
   * Generates pure CSS keyframes & classes
   */
  generateCssCode() {
    return `/* LumiX Animated Logo & Loader CSS Keyframes */

:root {
  --lumix-blue: #2870ED;
  --lumix-coral: #F07150;
  --lumix-green: #10B981;
}

.lumix-loader {
  width: 140px;
  height: 140px;
  display: inline-block;
}

/* 1. Butterfly Loading (3D Flap) */
.lumix-butterfly .wing-blue {
  transform-origin: 140px 150px;
  animation: lumixButterflyFlapBlue 1.1s infinite cubic-bezier(0.45, 0.05, 0.55, 0.95) alternate;
}
.lumix-butterfly .wing-coral {
  transform-origin: 160px 150px;
  animation: lumixButterflyFlapCoral 1.1s infinite cubic-bezier(0.45, 0.05, 0.55, 0.95) alternate;
}
@keyframes lumixButterflyFlapBlue {
  0% { transform: perspective(700px) rotate3d(1, -1, 0, -42deg); }
  100% { transform: perspective(700px) rotate3d(1, -1, 0, 48deg); }
}
@keyframes lumixButterflyFlapCoral {
  0% { transform: perspective(700px) rotate3d(1, -1, 0, 42deg); }
  100% { transform: perspective(700px) rotate3d(1, -1, 0, -48deg); }
}

/* 2. Thinking (Rotating around each other) */
.lumix-thinking {
  animation: lumixOrbit 2.4s infinite linear;
}
@keyframes lumixOrbit {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 3. Processing (Vibration + Scale Bigger & Smaller) */
.lumix-processing {
  animation: lumixBreath 1.3s infinite ease-in-out;
}
.lumix-processing .wing-blue {
  animation: lumixVibrateBlue 0.07s infinite linear alternate;
}
.lumix-processing .wing-coral {
  animation: lumixVibrateCoral 0.07s infinite linear alternate;
}
@keyframes lumixBreath {
  0%, 100% { transform: scale(0.92); }
  50% { transform: scale(1.14); }
}
@keyframes lumixVibrateBlue {
  0% { transform: translate(-1.8px, 1.5px); }
  100% { transform: translate(1.8px, -1.5px); }
}
@keyframes lumixVibrateCoral {
  0% { transform: translate(1.5px, -1.8px); }
  100% { transform: translate(-1.5px, 1.8px); }
}

/* 4. Coaching (Reciprocal Left/Right Movement Along Each Other) */
.lumix-coaching .wing-blue {
  animation: lumixSlideBlue 2.0s infinite cubic-bezier(0.65, 0, 0.35, 1);
}
.lumix-coaching .wing-coral {
  animation: lumixSlideCoral 2.0s infinite cubic-bezier(0.65, 0, 0.35, 1);
}
@keyframes lumixSlideBlue {
  0%, 100% { transform: translateX(-32px); }
  50% { transform: translateX(32px); }
}
@keyframes lumixSlideCoral {
  0%, 100% { transform: translateX(32px); }
  50% { transform: translateX(-32px); }
}

/* 5. Complete (Slow Convergence & Morph to Green Check) */
.lumix-complete .wing-blue {
  animation: lumixConvergeBlue 1.6s forwards cubic-bezier(0.25, 1, 0.5, 1);
}
.lumix-complete .wing-coral {
  animation: lumixConvergeCoral 1.6s forwards cubic-bezier(0.25, 1, 0.5, 1);
}
@keyframes lumixConvergeBlue {
  0% { transform: translate(-30px, -30px); opacity: 1; }
  50% { transform: translate(6px, 6px); opacity: 0.9; }
  65% { transform: translate(0, 0) scale(0.4); opacity: 0.2; }
  75%, 100% { transform: scale(0); opacity: 0; }
}
@keyframes lumixConvergeCoral {
  0% { transform: translate(30px, 30px); opacity: 1; }
  50% { transform: translate(-6px, -6px); opacity: 0.9; }
  65% { transform: translate(0, 0) scale(0.4); opacity: 0.2; }
  75%, 100% { transform: scale(0); opacity: 0; }
}`;
  }

  /**
   * Generates clean SVG markup symbol
   */
  generateSvgCode() {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="300" height="300" class="lumix-logo-svg">
  <defs>
    <linearGradient id="lumixBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3A82FF" />
      <stop offset="100%" stop-color="#2870ED" />
    </linearGradient>
    <linearGradient id="lumixCoralGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FF8260" />
      <stop offset="100%" stop-color="#F07150" />
    </linearGradient>
  </defs>

  <!-- Blue Quadrilateral (Top-Left Wing) -->
  <path class="lumix-wing wing-blue"
        d="M 44 175 L 112 175 C 117 175 121 173 124 170 L 163 131 C 166 128 168 124 168 119 L 168 56 C 168 49 160 45 155 50 L 37 168 C 33 172 36 175 44 175 Z"
        fill="url(#lumixBlueGrad)" />

  <!-- Coral Quadrilateral (Bottom-Right Wing) -->
  <path class="lumix-wing wing-coral"
        d="M 256 125 L 188 125 C 183 125 179 127 176 130 L 137 169 C 134 172 132 176 132 181 L 132 244 C 132 251 140 255 145 250 L 263 132 C 267 128 264 125 256 125 Z"
        fill="url(#lumixCoralGrad)" />
</svg>`;
  }

  /**
   * Generates React / Next.js Component
   */
  generateReactCode() {
    return `import React from 'react';
import './LumiXLoader.css';

export type LumiXState = 'loading' | 'thinking' | 'processing' | 'coaching' | 'complete';

interface LumiXLoaderProps {
  state?: LumiXState;
  size?: number;
  className?: string;
}

export const LumiXLoader: React.FC<LumiXLoaderProps> = ({
  state = 'loading',
  size = 140,
  className = ''
}) => {
  return (
    <div 
      className={\`lumix-loader-container lumix-\${state} \${className}\`} 
      style={{ width: size, height: size }}
      role="status"
      aria-label={\`LumiX is \${state}\`}
    >
      <svg viewBox="0 0 300 300" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="reactBlue" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3A82FF" />
            <stop offset="100%" stopColor="#2870ED" />
          </linearGradient>
          <linearGradient id="reactCoral" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF8260" />
            <stop offset="100%" stopColor="#F07150" />
          </linearGradient>
          <linearGradient id="reactGreen" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34D399" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>
        </defs>

        <g className="lumix-wings-group">
          {/* Blue Wing (Top-Left) */}
          <path
            className="wing-blue"
            d="M 44 175 L 112 175 C 117 175 121 173 124 170 L 163 131 C 166 128 168 124 168 119 L 168 56 C 168 49 160 45 155 50 L 37 168 C 33 172 36 175 44 175 Z"
            fill="url(#reactBlue)"
          />

          {/* Coral Wing (Bottom-Right) */}
          <path
            className="wing-coral"
            d="M 256 125 L 188 125 C 183 125 179 127 176 130 L 137 169 C 134 172 132 176 132 181 L 132 244 C 132 251 140 255 145 250 L 263 132 C 267 128 264 125 256 125 Z"
            fill="url(#reactCoral)"
          />
        </g>

        {state === 'complete' && (
          <g className="complete-checkmark">
            <circle cx="150" cy="150" r="70" fill="url(#reactGreen)" />
            <path
              d="M 120 150 L 142 172 L 186 128"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="9"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        )}
      </svg>
    </div>
  );
};

export default LumiXLoader;`;
  }
}

window.LumixLottieGenerator = LumixLottieGenerator;

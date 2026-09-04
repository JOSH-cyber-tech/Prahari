import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import ModulesShowcase from './ModulesShowcase';
import tealbk from '../tealbk.jpg';
import prahariLeft from '../prahari.png';
import prahariRight from '../prahari copy.png';
// ==========================================
// 1. TECH-TEAL CITADEL DUST & ATMOSPHERE
// ==========================================
const CitadelAtmosphere = ({ particleCount = 60 }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.5 + 0.4,
      speedX: (Math.random() - 0.5) * 0.1,
      speedY: -(Math.random() * 0.2 + 0.05),
      alpha: Math.random() * 0.35 + 0.15,
      wobble: Math.random() * 100,
      wobbleSpeed: Math.random() * 0.01 + 0.005
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(p.wobble) * 0.05;
        p.wobble += p.wobbleSpeed;

        if (p.y < 0) {
          p.y = canvas.height;
          p.x = Math.random() * canvas.width;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(34, 211, 238, ${p.alpha})`;
        ctx.fill();
      });
      animationFrameId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [particleCount]);

  return (
    <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden select-none">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[80vw] h-[80vh] bg-[radial-gradient(circle,rgba(0,255,230,0.14),transparent_65%)] blur-2xl opacity-90" />
      <canvas ref={canvasRef} className="absolute inset-0 opacity-40" />
    </div>
  );
};

// ==========================================
// 2. CHISELED CORNER BRACKETS (TINTED TO THEME)
// ==========================================
const ThreeDCornerBracket = () => {
  return (
    <svg className="w-28 h-28 drop-shadow-[0_6px_12px_rgba(0,0,0,0.85)] filter brightness-90" viewBox="0 0 100 100" fill="none">
      <path d="M 5 95 L 5 5 L 95 5" stroke="#021114" strokeWidth="6" strokeLinecap="square" />
      <path d="M 6 94 L 6 6 L 94 6" stroke="#0d3842" strokeWidth="4" strokeLinecap="square" />
      <path d="M 7 93 L 7 7 L 93 7" stroke="#22d3ee" strokeWidth="1.2" strokeLinecap="square" strokeDasharray="85 6 85" className="opacity-30" />
      
      <circle cx="16" cy="16" r="4.5" fill="#021114" />
      <circle cx="16" cy="16" r="3.5" fill="#041E24" stroke="#0d3842" strokeWidth="0.5" />
      
      <circle cx="48" cy="14" r="3.5" fill="#021114" />
      <circle cx="48" cy="14" r="2.5" fill="#041E24" stroke="#0d3842" strokeWidth="0.5" />

      <circle cx="14" cy="48" r="3.5" fill="#021114" />
      <circle cx="14" cy="48" r="2.5" fill="#041E24" stroke="#0d3842" strokeWidth="0.5" />
    </svg>
  );
};

// ==========================================
// 3. HORIZONTAL STRAPS (WITH TEAL UNDERTONES)
// ==========================================
const ThreeDStrap = () => {
  return (
    <div 
      className="relative w-full h-12 rounded shadow-[0_14px_28px_rgba(4,30,36,0.9),_inset_0_1px_2px_rgba(255,255,255,0.04),_inset_0_-2px_4px_rgba(0,0,0,0.95)] border-y border-cyan-950/40 flex items-center justify-around px-8"
      style={{
        backgroundImage: `
          linear-gradient(to bottom, #072A32 0%, #041E24 50%, #021114 100%),
          radial-gradient(circle at 20% 30%, rgba(34, 211, 238, 0.15) 0%, transparent 40%)
        `
      }}
    >
      {[...Array(4)].map((_, i) => (
        <div key={i} className="w-2.5 h-2.5 rounded-full bg-[#021114] shadow-[0_2px_4px_rgba(0,0,0,0.7)] flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-t from-[#041E24] to-cyan-500 opacity-60" />
        </div>
      ))}
    </div>
  );
};

// ==========================================
// 4. TECH-TEAL INTEGRATED CITADEL PORTAL
// ==========================================
const FortressDoor = ({ side, stage, children }) => {
  const isLeft = side === 'left';

  return (
    <motion.div
      className={`relative w-1/2 h-full overflow-hidden flex items-center shadow-[0_0_80px_rgba(4,30,36,0.9)] ${
        isLeft ? 'justify-end border-r-[3px] border-[#072A32]' : 'justify-start border-l-[3px] border-[#072A32]'
      }`}
      style={{
        backgroundImage: `
          linear-gradient(${isLeft ? '90deg' : '-90deg'}, rgba(4,30,36,0.6) 0%, transparent 25%, transparent 75%, rgba(4,30,36,0.9) 100%),
          linear-gradient(to bottom, #072A32 0%, #041E24 50%, #021114 100%)
        `,
        transformOrigin: isLeft ? 'left center' : 'right center',
      }}
      animate={{
        x: stage === 'opening' || stage === 'revealed' ? (isLeft ? '-102%' : '102%') : '0%',
        rotateY: stage === 'opening' || stage === 'revealed' ? (isLeft ? -22 : 22) : 0,
        z: stage === 'opening' ? -80 : 0
      }}
      exit={{ opacity: 0, transition: { duration: 0.4 } }}
      transition={{
        duration: 2.8,
        ease: [0.76, 0, 0.24, 1],
        delay: 0.2
      }}
    >
      {/* Horizontal laser light effect matching the landing dashboard theme */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/5 to-transparent pointer-events-none mix-blend-screen" />

      {/* Cyber-Teal Ambient Core Behind Shield Asset */}
      <div className={`absolute ${isLeft ? 'right-0' : 'left-0'} top-1/2 -translate-y-1/2 w-96 h-96 bg-[radial-gradient(circle,rgba(34,211,238,0.18),transparent_70%)] pointer-events-none z-10`} />

      {/* High-Fidelity Cyber-Iron Textured Patina Engine */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.22] mix-blend-overlay">
        <filter id="cyberiron">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="4" result="noise" />
          <feColorMatrix type="matrix" values="
            0.1   0   0   0   0.02
            0     1   0   0   0.14
            0     0   1   0   0.16
            0     0   0  0.85  0
          " />
        </filter>
        <rect width="100%" height="100%" filter="url(#cyberiron)" />
      </svg>

      {/* Beveled frame structure */}
      <div className="absolute inset-6 border border-cyan-500/15 pointer-events-none rounded-sm shadow-[inset_0_0_60px_rgba(4,30,36,0.85)]" />

      {/* Structured Brackets */}
      <div className={`absolute top-8 ${isLeft ? 'left-8' : 'right-8 scale-x-[-1]'} opacity-80 mix-blend-luminosity`}>
        <ThreeDCornerBracket />
      </div>
      <div className={`absolute bottom-8 ${isLeft ? 'left-8 scale-y-[-1]' : 'right-8 scale-x-[-1] scale-y-[-1]'} opacity-80 mix-blend-luminosity`}>
        <ThreeDCornerBracket />
      </div>

      {/* Horizontal Heavy Plates */}
      <div className={`absolute left-0 right-0 top-[28%] px-12 pointer-events-none z-20 ${isLeft ? 'translate-x-4' : '-translate-x-4'}`}>
        <ThreeDStrap />
      </div>
      <div className={`absolute left-0 right-0 bottom-[28%] px-12 pointer-events-none z-20 ${isLeft ? 'translate-x-4' : '-translate-x-4'}`}>
        <ThreeDStrap />
      </div>

      {/* Inner Door Split Seam Shading */}
      <div className={`absolute top-0 bottom-0 w-24 bg-gradient-to-r from-transparent via-[#041E24]/50 to-[#021114]/90 pointer-events-none ${isLeft ? 'right-0' : 'left-0 rotate-180'}`} />

      {/* Centered Graphic Container Asset */}
      <div className="relative flex items-center h-full z-30 filter drop-shadow-[0_20px_50px_rgba(4,30,36,0.95)]">
        {children}
      </div>
    </motion.div>
  );
};

// ==========================================
// 5. THEME-MATCHED CENTRAL SYSTEM DEADBOLTS
// ==========================================
const DynamicCitadelLocks = ({ stage }) => {
  const isUnlocked = stage === 'unlocking' || stage === 'opening' || stage === 'revealed';

  return (
    <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 z-40 w-32 pointer-events-none flex flex-col justify-between py-24 items-center">
      <motion.div
        className="w-10 h-44 rounded shadow-[0_24px_40px_rgba(0,0,0,0.95)] border-x border-cyan-900/40 relative"
        style={{
          backgroundImage: 'linear-gradient(to right, #041E24 0%, #0d3842 50%, #021114 100%)'
        }}
        animate={{ y: isUnlocked ? -190 : 0, scaleY: isUnlocked ? 0.8 : 1, opacity: isUnlocked ? 0 : 1 }}
        transition={{ duration: 1.4, ease: [0.6, -0.28, 0.735, 0.045] }}
      >
        <div className="absolute top-4 inset-x-1 h-3 bg-black/40 border-y border-cyan-500/20" />
        <div className="absolute bottom-4 inset-x-1 h-8 bg-gradient-to-b from-[#072A32] to-[#041E24]" />
      </motion.div>

      <motion.div
        className="w-10 h-44 rounded shadow-[0_-24px_40px_rgba(0,0,0,0.95)] border-x border-cyan-900/40 relative"
        style={{
          backgroundImage: 'linear-gradient(to right, #041E24 0%, #0d3842 50%, #021114 100%)'
        }}
        animate={{ y: isUnlocked ? 190 : 0, scaleY: isUnlocked ? 0.8 : 1, opacity: isUnlocked ? 0 : 1 }}
        transition={{ duration: 1.4, ease: [0.6, -0.28, 0.735, 0.045] }}
      >
        <div className="absolute bottom-4 inset-x-1 h-3 bg-black/40 border-y border-cyan-500/20" />
        <div className="absolute top-4 inset-x-1 h-8 bg-gradient-to-t from-[#072A32] to-[#041E24]" />
      </motion.div>
    </div>
  );
};

// ==========================================
const GateIntro = ({ onComplete }) => {
  const [stage, setStage] = useState('locked'); // locked -> unlocking -> opening -> revealed
  const [gateTremor, setGateTremor] = useState(false);

  useEffect(() => {
    const unlockTimer = setTimeout(() => {
      setStage('unlocking');
      setGateTremor(true);
    }, 1200);

    const stopTremorTimer = setTimeout(() => setGateTremor(false), 2100);

    const openTimer = setTimeout(() => {
      setStage('opening');
    }, 2600);

    const finishedTimer = setTimeout(() => {
      setStage('revealed');
      if (onComplete) onComplete();
    }, 5400);

    return () => {
      clearTimeout(unlockTimer);
      clearTimeout(stopTremorTimer);
      clearTimeout(openTimer);
      clearTimeout(finishedTimer);
    };
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-[9999] overflow-hidden text-white select-none [perspective:1400px] ${stage === 'revealed' ? 'pointer-events-none' : 'bg-transparent'}`}>
      {/* Atmosphere particles colored explicitly cyan */}
      <CitadelAtmosphere particleCount={stage === 'opening' ? 95 : 45} />

      <AnimatePresence>
        {stage !== 'revealed' && (
          <motion.div
            key="citadel-gate-wrapper"
            className="absolute inset-0 z-30 flex"
            animate={gateTremor ? {
              x: [0, -2, 2.5, -2.5, 1.5, -0.5, 0],
              y: [0, 1.5, -1, 2, -1.5, 0.5, 0]
            } : {}}
            transition={{ duration: 0.7, repeat: 1 }}
          >
            {/* Left Hand Portal Layer */}
            <FortressDoor side="left" stage={stage}>
              <img
                src={prahariLeft}
                alt="Shield Left Wing"
                className="h-64 md:h-96 w-auto object-contain select-none"
              />
            </FortressDoor>

            {/* Centered Mechanized Systems */}
            <DynamicCitadelLocks stage={stage} />

            {/* Right Hand Portal Layer */}
            <FortressDoor side="right" stage={stage}>
              <img
                src={prahariRight}
                alt="Shield Right Wing"
                className="h-64 md:h-96 w-auto object-contain select-none"
              />
            </FortressDoor>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GateIntro;
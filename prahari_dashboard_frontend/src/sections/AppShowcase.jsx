import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ChevronLeft, ShieldAlert, Languages, Volume2, Mic, Shield } from 'lucide-react'

// Import local image assets located in the same directory
import offlineImg from '../offline.png'
import multilingualImg from '../multilingual.png'
import buzzerImg from '../buzzer.png'
import speechToTextImg from '../speech-to-text.png'

const features = [
  {
    id: 0,
    title: "Offline Guard",
    description: "Stay protected even when you're offline with intelligent local security features.",
    image: offlineImg,
    icon: ShieldAlert,
    accent: "from-cyan-500/20 via-teal-700/10 to-[#8a7346]/10",
  },
  {
    id: 1,
    title: "Multilingual Support",
    description: "Interact with the system in multiple languages for a more accessible experience.",
    image: multilingualImg,
    icon: Languages,
    accent: "from-cyan-500/20 via-teal-700/10 to-[#8a7346]/10",
  },
  {
    id: 2,
    title: "Buzzer Feature",
    description: "Instantly trigger an alert with a dedicated buzzer feature when suspicious activity is detected.",
    image: buzzerImg,
    icon: Volume2,
    accent: "from-cyan-500/20 via-teal-700/10 to-[#8a7346]/10",
  },
  {
    id: 3,
    title: "Speech to Text Conversion",
    description: "Convert spoken words into text quickly and effortlessly using speech recognition.",
    image: speechToTextImg,
    icon: Mic,
    accent: "from-cyan-500/20 via-teal-700/10 to-[#8a7346]/10",
  },
]

const AppShowcase = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [showHeading, setShowHeading] = useState(true)
  const timerRef = useRef(null)

  // Hide the initial heading after 4 seconds
  useEffect(() => {
    const headingTimeout = setTimeout(() => {
      setShowHeading(false)
    }, 4000)

    return () => clearTimeout(headingTimeout)
  }, [])

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % features.length)
  }, [])

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + features.length) % features.length)
  }, [])

  // Auto-advance timer (30 Seconds)
  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      handleNext()
    }, 30000)
  }, [handleNext])

  useEffect(() => {
    if (!isHovered) {
      startTimer()
    } else if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [startTimer, isHovered])

  // Reset timer on manual navigation
  const triggerNext = () => {
    setShowHeading(false)
    handleNext()
    startTimer()
  }

  const triggerPrev = () => {
    setShowHeading(false)
    handlePrev()
    startTimer()
  }

  // Calculate relative card positions
  const getCardPosition = (index) => {
    const total = features.length
    const diff = (index - activeIndex + total) % total

    if (diff === 0) return 'center'
    if (diff === 1) return 'right'
    if (diff === total - 1) return 'left'
    return 'hidden'
  }

  // Smooth Motion variants per position state
  const variants = {
    left: {
      x: '-76%',
      scale: 0.83,
      rotateY: 12,
      z: -100,
      opacity: 0.65,
      filter: 'blur(0px)',
      pointerEvents: 'auto',
      zIndex: 10,
    },
    center: {
      x: '0%',
      scale: 1,
      rotateY: 0,
      z: 0,
      opacity: 1,
      filter: 'blur(0px)',
      pointerEvents: 'auto',
      zIndex: 30,
    },
    right: {
      x: '76%',
      scale: 0.83,
      rotateY: -12,
      z: -100,
      opacity: 0.65,
      filter: 'blur(0px)',
      pointerEvents: 'auto',
      zIndex: 10,
    },
    hidden: {
      x: '0%',
      scale: 0.5,
      rotateY: 0,
      z: -300,
      opacity: 0,
      filter: 'blur(2px)',
      pointerEvents: 'none',
      zIndex: 0,
    },
  }

  return (
    <div 
      className="relative w-full overflow-hidden bg-transparent flex flex-col items-center justify-center px-4 py-24 select-none"
    >
      {/* Background Cyan Ambient Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(0,255,230,0.1),transparent_65%)] pointer-events-none" />

      {/* Section Title */}
      <div className="mb-4 text-center relative z-20">
        <h2 className="text-5xl md:text-7xl font-black font-bebas text-transparent bg-clip-text bg-gradient-to-b from-white to-cyan-300 tracking-wider">
          OUR APP
        </h2>
      </div>

      {/* Modern 3D Carousel Stage */}
      <div
        className="relative w-full max-w-6xl h-[540px] flex items-center justify-center"
        style={{ perspective: '1200px' }}
        onMouseEnter={() => {
          setIsHovered(true)
          setShowHeading(false)
        }}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Left Navigation Arrow */}
        <button
          onClick={triggerPrev}
          aria-label="Previous Feature"
          className="absolute -left-2 sm:left-2 md:left-4 z-40 p-3 rounded-full bg-[#06181d]/90 border border-cyan-500/30 text-cyan-300 hover:text-white hover:bg-cyan-500/20 hover:border-cyan-400 backdrop-blur-md transition-all duration-300 transform hover:scale-110 active:scale-95 shadow-[0_0_15px_rgba(0,255,230,0.2)] focus:outline-none"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Right Navigation Arrow */}
        <button
          onClick={triggerNext}
          aria-label="Next Feature"
          className="absolute -right-2 sm:right-2 md:right-4 z-40 p-3 rounded-full bg-[#06181d]/90 border border-cyan-500/30 text-cyan-300 hover:text-white hover:bg-cyan-500/20 hover:border-cyan-400 backdrop-blur-md transition-all duration-300 transform hover:scale-110 active:scale-95 shadow-[0_0_15px_rgba(0,255,230,0.2)] focus:outline-none"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* 3D Transform Container */}
        <div className="relative w-full h-full flex items-center justify-center [transform-style:preserve-3d]">
          {features.map((feature, index) => {
            const position = getCardPosition(index)
            const Icon = feature.icon

            return (
              <motion.div
                key={feature.id}
                custom={position}
                variants={variants}
                initial={false}
                animate={position}
                transition={{
                  type: 'spring',
                  stiffness: 170,
                  damping: 26,
                  mass: 1.1,
                }}
                onClick={() => {
                  setShowHeading(false)
                  if (position === 'left') triggerPrev()
                  if (position === 'right') triggerNext()
                }}
                className={`absolute w-[300px] sm:w-[340px] md:w-[360px] h-[490px] rounded-3xl p-4 flex flex-col justify-between overflow-hidden backdrop-blur-2xl transition-colors duration-500 cursor-pointer will-change-transform ${
                  position === 'center'
                    ? 'bg-gradient-to-b from-[#092228]/90 via-[#05181d]/95 to-[#030e11]/95 border-2 border-cyan-400/50 shadow-[0_0_35px_rgba(0,255,230,0.25),0_0_10px_rgba(138,115,70,0.2)]'
                    : 'bg-gradient-to-b from-[#06191e]/80 to-[#020b0e]/85 border border-[#8a7346]/30 shadow-[0_10px_30px_rgba(0,0,0,0.8)] hover:border-cyan-500/40'
                }`}
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Translucent Fine Grain Pattern */}
                <div 
                  className="absolute inset-0 opacity-[0.08] pointer-events-none mix-blend-overlay"
                  style={{
                    backgroundImage: `radial-gradient(#00ffe6 1px, transparent 0)`,
                    backgroundSize: '4px 4px'
                  }}
                />

                {/* Subdued Shield Border Outlines */}
                <div className="absolute inset-1 rounded-[22px] border border-[#8a7346]/25 pointer-events-none" />
                <div className="absolute inset-2.5 rounded-[18px] border border-cyan-500/15 pointer-events-none" />

                {/* Corner Stud Accents */}
                <div className="absolute top-3 left-3 w-1.5 h-1.5 rounded-full bg-[#a38a58] shadow-[0_0_4px_#a38a58]" />
                <div className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-[#a38a58] shadow-[0_0_4px_#a38a58]" />
                <div className="absolute bottom-3 left-3 w-1.5 h-1.5 rounded-full bg-[#a38a58] shadow-[0_0_4px_#a38a58]" />
                <div className="absolute bottom-3 right-3 w-1.5 h-1.5 rounded-full bg-[#a38a58] shadow-[0_0_4px_#a38a58]" />

                {/* Card Visual Container */}
                <div className={`relative z-20 w-full h-80 rounded-2xl overflow-hidden bg-gradient-to-br ${feature.accent} border border-cyan-500/20 flex items-center justify-center group p-2 shadow-inner`}>
                  {/* Subtle Background Radial */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,230,0.1),transparent_70%)] pointer-events-none" />
                  
                  {/* Full Image Displayed Without Cropping */}
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-contain relative z-0 transition-transform duration-700 ease-out group-hover:scale-105 filter contrast-[1.05]"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />

                  {/* Fallback Graphic UI element */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center -z-10 text-cyan-300/30">
                    <Icon className="w-14 h-14 mb-2 stroke-[1.25]" />
                    <span className="text-[10px] font-medium tracking-wider uppercase text-cyan-200/40">
                      {feature.title} Illustration
                    </span>
                  </div>
                </div>

                {/* Feature Text Content with Smooth Transition */}
                <motion.div 
                  className="relative z-20 mt-2 mb-1 flex-1 flex flex-col justify-center px-1"
                  animate={{ opacity: position === 'center' ? 1 : 0.75 }}
                  transition={{ duration: 0.4 }}
                >
                  <h3 className="text-2xl font-bebas tracking-widest text-white">
                    {feature.title}
                  </h3>
                  <p className="mt-1 text-sm font-montenegrin text-cyan-100/70 leading-relaxed line-clamp-2">
                    {feature.description}
                  </p>
                </motion.div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Pagination / Progress Dots */}
      <div className="flex items-center space-x-2 mt-6 z-30">
        {features.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              setShowHeading(false)
              setActiveIndex(idx)
              startTimer()
            }}
            aria-label={`Go to slide ${idx + 1}`}
            className={`h-1.5 rounded-full transition-all duration-500 ease-out focus:outline-none ${
              activeIndex === idx
                ? 'w-8 bg-cyan-400 shadow-[0_0_12px_rgba(0,255,230,0.8)]'
                : 'w-2 bg-cyan-950 hover:bg-cyan-800'
            }`}
          />
        ))}
      </div>

      {/* Download App Link */}
      <div className="mt-10 z-30 animate-pulse">
        <a 
          href="https://github.com/JOSH-cyber-tech/Prahari/releases/download/v1.0/PraHARI-AI.apk"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-cyan-400/50 bg-cyan-900/30 text-cyan-300 hover:bg-cyan-400 hover:text-slate-900 font-semibold text-sm transition-all duration-300 hover:scale-105 active:scale-95 backdrop-blur-sm shadow-[0_0_15px_rgba(0,255,230,0.2)]"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          Our App, click to download
        </a>
      </div>
    </div>
  )
}

export default AppShowcase
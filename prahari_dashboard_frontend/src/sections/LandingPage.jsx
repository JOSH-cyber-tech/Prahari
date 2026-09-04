// src/sections/LandingPage.jsx
import React, { useState, useEffect } from 'react';
import GlobalNavbar from '../components/GlobalNavbar';
import GateIntro from './GateIntro';
import HeroSection from './HeroSection';
import AppShowcase from './AppShowcase';
import ModulesShowcase from './ModulesShowcase';
import tealbk from '../tealbk.jpg';

const LandingPage = () => {
  const [gateOpen, setGateOpen] = useState(false);

  useEffect(() => {
    if (!gateOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = 'auto';
      document.body.style.touchAction = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
      document.body.style.touchAction = 'auto';
    };
  }, [gateOpen]);

  return (
    <div className="relative min-h-screen w-full bg-[#041E24]">
      {/* 1. CONTINUOUS GLOBAL BACKGROUND */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img
          src={tealbk}
          alt="Prahari Background"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-[#072A32]/45" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_55%_25%,rgba(0,255,230,0.18),transparent_65%)]" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-300/10 to-transparent" />
      </div>

      {/* 2. GLOBAL NAVBAR */}
      <GlobalNavbar />

      {/* 3. SCROLLING LANDING CONTENT */}
      <main className="relative z-10">
        <HeroSection />
        <AppShowcase />

        {/* Scroll anchor for Modules */}
        <div id="modules">
          <ModulesShowcase />
        </div>

        {/* Scroll anchor for MVP */}
        <div id="mvp" className="h-1"></div>
      </main>

      {/* 4. GATE OVERLAY (HIGHEST Z-INDEX) */}
      {!gateOpen && <GateIntro onComplete={() => setGateOpen(true)} />}
    </div>
  );
};

export default LandingPage;
import React from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <motion.section
      initial={{ scale: 0.98, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1], delay: 0.5 }}
      className="relative w-full h-screen flex items-center pt-20"
    >
      {/* Primary Landing Content Hero */}
      <div className="relative z-20 flex h-full items-center w-full max-w-7xl mx-auto px-10">
        <div className="max-w-3xl ml-14 -mt-12">

          {/* Heading Elements */}
          <h1 className="mt-8 text-7xl font-bebas tracking-wide font-black leading-[1.05] text-white">
            Protect Every Citizen.<br />
            <span className="text-cyan-300">Detect Every Scam.</span>
          </h1>

          {/* Platform Explainer */}
          <p className="mt-8 max-w-2xl font-montenegrin text-xl leading-9 text-slate-100">
            Prahari is India's AI-powered fraud intelligence platform helping
            citizens, villages, farmers and senior citizens stay protected from
            digital fraud. Whether online or offline, Prahari empowers everyone
            to report scams, detect fraud networks, identify crime hotspots and
            generate intelligence for law enforcement.
          </p>

          {/* Trigger CTAs */}
          <div className="mt-12 flex items-center gap-6">
            <button
              onClick={() => navigate('/citizen/report')}
              className="rounded-xl bg-cyan-400 px-10 py-4 text-lg font-semibold text-slate-900 transition hover:bg-cyan-300"
            >
              Report a Scam
            </button>
            <button className="rounded-xl border border-white/20 bg-white/10 backdrop-blur-xl px-10 py-4 text-lg font-medium text-white transition duration-300 hover:bg-white/20">
              <Play />
            </button>
          </div>

          {/* Metrics Footer */}
          <div className="mt-16 flex gap-16">
            <div>
              <h2 className="text-4xl font-bold text-cyan-300">24/7</h2>
              <p className="mt-2 text-sm uppercase tracking-widest text-slate-300">AI Monitoring</p>
            </div>
            <div>
              <h2 className="text-4xl font-bold text-cyan-300">Offline</h2>
              <p className="mt-2 text-sm uppercase tracking-widest text-slate-300">Village Support</p>
            </div>
            <div>
              <h2 className="text-4xl font-bold text-cyan-300">Modules</h2>
              <p className="mt-2 text-sm uppercase tracking-widest text-slate-300">Connected Intelligence</p>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default HeroSection;

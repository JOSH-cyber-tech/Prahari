import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const GlobalNavbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 w-full z-50">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-10">
        {/* Logo */}
        <div className="inline-flex items-center gap-3 rounded-full border border-cyan-300/30 bg-white/5 backdrop-blur-xl px-5 py-2">
          <div className="h-2 w-2 rounded-full bg-cyan-300 animate-pulse"></div>
          <span className="text-sm font-medium text-cyan-100">
            AI Powered • PRAHARI
          </span>
        </div>

        {/* Navigation */}
        <div className="hidden md:flex items-center gap-12 rounded-full border border-cyan-300/15 bg-white/5 px-8 py-3 backdrop-blur-xl">
          <a href="#modules" className="text-slate-300 transition hover:text-cyan-300">
            Modules
          </a>
          <a href="#mvp" className="text-slate-300 transition hover:text-cyan-300">
            MVP
          </a>
          <Link to="/login" className="text-slate-300 transition hover:text-cyan-300">
            Login
          </Link>
        </div>

        {/* CTA */}
        <button
          onClick={() => navigate('/walkthrough')}
          className="rounded-xl border border-cyan-400 bg-cyan-400 px-6 py-2.5 text-slate-900 font-semibold transition hover:bg-cyan-300"
        >
          Get Started
        </button>
      </div>
    </nav>
  );
};

export default GlobalNavbar;

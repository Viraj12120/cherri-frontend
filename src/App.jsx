import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './i18n';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';
import { CustomEase } from 'gsap/CustomEase';

// Landing Components
import Navbar from './components/Navbar';
import Hero from './landing/Hero';
import FeatureIntro from './landing/FeatureIntro';
import FeatureGrid from './landing/FeatureGrid';
import Outcomes from './landing/Outcomes';
import UseCase from './landing/UseCase';
import FAQ from './landing/FAQ';
import FinalCTA from './landing/FinalCTA';
import Footer from './components/Footer';
import Pricing from './pages/Pricing';
import Login from './pages/Login';
import SignUp from './pages/SignUp';

// Dashboard Components
import DashboardLayout from './dashboard/Layout';

gsap.registerPlugin(ScrollTrigger, TextPlugin, CustomEase);

// Register PharmaAgent custom easing curves
CustomEase.create('pharma.out', 'M0,0 C0.16,1 0.3,1 1,1');
CustomEase.create('pharma.inOut', 'M0,0 C0.5,0 0.5,1 1,1');
CustomEase.create('pharma.spring', 'M0,0 C0.14,0 0.22,1.13 1,1');

function App() {
  const { i18n } = useTranslation();
  // Navigation State for Demo
  const [view, setView] = useState('landing'); // landing, pharmacist, distributor, executive

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (view === 'landing') {
        // Universal reveal utility for landing page
        gsap.utils.toArray('.reveal-section').forEach(section => {
          const children = section.querySelectorAll('.reveal-child');
          if (children.length > 0) {
            gsap.fromTo(children,
              { opacity: 0, y: 28 },
              {
                opacity: 1,
                y: 0,
                duration: 0.55,
                stagger: 0.08,
                ease: 'pharma.out',
                scrollTrigger: {
                  trigger: section,
                  start: 'top 75%',
                  once: true,
                },
              });
          }
        });
      }
    });

    return () => ctx.revert();
  }, [view]);

  // Switch to top on view change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  if (view === 'pricing') {
    return <Pricing setView={setView} />;
  }

  if (view === 'login') {
    return <Login setView={setView} />;
  }

  if (view === 'signup') {
    return <SignUp setView={setView} />;
  }

  if (view !== 'landing') {
    return (
      <DashboardLayout role={view.charAt(0).toUpperCase() + view.slice(1)} onBack={() => setView('landing')} />
    );
  }

  return (
    <div className="relative w-full overflow-x-hidden">
      {/* View Switcher Overlay for Demo */}
      <div className="fixed bottom-6 right-6 z-[100] bg-void/80 backdrop-blur-md border border-white/10 p-2 rounded-2xl flex flex-col gap-2 shadow-2xl">
        <p className="text-[10px] font-bold text-white/30 px-3 py-1 uppercase tracking-widest">Demo Views</p>
        <button
          onClick={() => setView('pharmacist')}
          className="group px-4 py-2 rounded-xl text-xs font-bold bg-acid/10 text-acid hover:bg-acid hover:!text-black transition-all flex items-center justify-between gap-4"
        >
          Launch Dashboard <span className="text-acid group-hover:!text-black transition-all">→</span>
        </button>
      </div>

      <Navbar setView={setView} currentView="landing" />
      <main>
        <div id="home"><Hero key={i18n.language} /></div>
        <div id="features"><FeatureIntro /></div>
        <FeatureGrid />
        <Outcomes />
        <div id="about"><UseCase /></div>
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}

export default App;

import React, { useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sun, Moon, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Navbar = ({ setView, currentView = 'landing' }) => {
  const { t, i18n } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  useEffect(() => {
    // Check saved theme
    if (localStorage.getItem('theme') === 'light' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: light)').matches)) {
      setTheme('light');
      document.documentElement.classList.add('light-mode');
    }
  }, []);

  const toggleTheme = () => {
    if (theme === 'dark') {
      document.documentElement.classList.add('light-mode');
      localStorage.setItem('theme', 'light');
      setTheme('light');
    } else {
      document.documentElement.classList.remove('light-mode');
      localStorage.setItem('theme', 'dark');
      setTheme('dark');
    }
  };

  useEffect(() => {
    const trigger = ScrollTrigger.create({
      start: 'top -60px',
      onEnter: () => setIsScrolled(true),
      onLeaveBack: () => setIsScrolled(false),
    });
    return () => trigger.kill();
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full h-14 z-50 flex items-center justify-between px-6 md:px-12 lg:px-20 transition-all duration-300 ${isScrolled
        ? 'bg-void/90 backdrop-blur-xl border-b border-white/10'
        : 'bg-transparent'
        }`}
    >
      <div
        className="flex items-center gap-2 nav-logo cursor-pointer"
        onClick={() => setView && setView('landing')}
      >

        <span className="font-bold text-lg text-white tracking-tight">Cherriplus</span>
      </div>

      <ul className="hidden md:flex items-center gap-8 nav-links">
        {[
          { key: 'navbar.home', id: 'Home' },
          { key: 'navbar.features', id: 'Features' },
          { key: 'navbar.about', id: 'About' },
          { key: 'navbar.pricing', id: 'Pricing' },
          // { key: 'navbar.blog', id: 'Blog' }
        ].map(({ key, id: link }) => {
          const isPricingLink = link === 'Pricing';
          const isHomeLink = link === 'Home';

          return (
            <li key={link} className="relative group overflow-hidden">
              <a
                href={isPricingLink ? '#' : `#${link.toLowerCase()}`}
                onClick={(e) => {
                  if (isPricingLink) {
                    e.preventDefault();
                    if (setView) setView('pricing');
                  } else if (currentView === 'pricing' && setView) {
                    if (isHomeLink) {
                      e.preventDefault();
                    }
                    setView('landing');
                    // Give React time to render landing before scrolling
                    setTimeout(() => {
                      const el = document.getElementById(isHomeLink ? 'home' : link.toLowerCase());
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }, 0);
                  }
                }}
                className={`text-sm transition-colors duration-200 ${isPricingLink && currentView === 'pricing'
                  ? 'text-acid font-bold'
                  : 'text-white/65 hover:text-white'
                  }`}
              >
                {t(key)}
              </a>
              <span className={`absolute bottom-0 left-0 w-full h-[1px] bg-acid origin-left transition-transform duration-300 ${isPricingLink && currentView === 'pricing' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                }`}></span>
            </li>
          );
        })}
      </ul>

      <div className="flex items-center gap-3 nav-cta relative">
        <button
          onClick={toggleTheme}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
        </button>

        <div className="relative">
          <button
            onClick={() => setLangDropdownOpen(!langDropdownOpen)}
            className="h-8 flex items-center justify-center gap-1.5 px-3 rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-colors text-[11px] font-bold tracking-wider"
          >
            {i18n.language ? i18n.language.toUpperCase() : 'EN'} <Globe size={14} />
          </button>

          {langDropdownOpen && (
            <div className="absolute top-10 right-0 w-32 bg-void/90 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl flex flex-col z-50">
              <button onClick={() => { i18n.changeLanguage('en-US'); setLangDropdownOpen(false); }} className="text-xs text-left px-4 py-2 text-white/60 hover:text-white hover:bg-white/10 transition-colors">English (US)</button>
              <button onClick={() => { i18n.changeLanguage('en-IN'); setLangDropdownOpen(false); }} className="text-xs text-left px-4 py-2 text-white/60 hover:text-white hover:bg-white/10 transition-colors">English (IN)</button>
              <button onClick={() => { i18n.changeLanguage('es'); setLangDropdownOpen(false); }} className="text-xs text-left px-4 py-2 text-white/60 hover:text-white hover:bg-white/10 transition-colors">Español</button>
              <button onClick={() => { i18n.changeLanguage('fr'); setLangDropdownOpen(false); }} className="text-xs text-left px-4 py-2 text-white/60 hover:text-white hover:bg-white/10 transition-colors">Français</button>
              <button onClick={() => { i18n.changeLanguage('hi'); setLangDropdownOpen(false); }} className="text-xs text-left px-4 py-2 text-white/60 hover:text-white hover:bg-white/10 transition-colors">हिंदी</button>
            </div>
          )}
        </div>

        <button
          onClick={() => setView && setView('login')}
          className="text-xs md:text-sm border border-white/20 rounded-full px-4 py-1.5 text-white/80 hover:text-white hover:bg-white/5 transition-colors font-medium hidden sm:block">
          {t('navbar.login')}
        </button>
        <button
          onClick={() => setView && setView('signup')}
          className="text-xs md:text-sm border border-white/20 rounded-full px-4 py-1.5 text-void bg-white hover:brightness-90 transition-all font-bold">
          {t('navbar.signup')}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

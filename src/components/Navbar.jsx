import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sun, Moon, Globe, Menu, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PATHS } from '../routes/paths';
import { useAuthStore } from '../stores/authStore';

const Navbar = ({ currentView = 'landing', isMenuOpen, setIsMenuOpen }) => {
  const { t, i18n } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const devLogin = useAuthStore((s) => s.devLogin);

  const isPricingPage = location.pathname === PATHS.pricing;

  useEffect(() => {
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

  const navLinks = [
    { key: 'navbar.home', id: 'Home' },
    { key: 'navbar.features', id: 'Features' },
    { key: 'navbar.about', id: 'About' },
    { key: 'navbar.pricing', id: 'Pricing' },
  ];

  const handleNavClick = (e, link) => {
    const isPricingLink = link === 'Pricing';
    const isHomeLink = link === 'Home';

    if (isPricingLink) {
      e.preventDefault();
      navigate(PATHS.pricing);
    } else if (isPricingPage) {
      e.preventDefault();
      navigate(PATHS.home);
      setTimeout(() => {
        const el = document.getElementById(isHomeLink ? 'home' : link.toLowerCase());
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const handleLiveDashboard = () => {
    devLogin();
    navigate(PATHS.dashboard);
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full h-14 z-50 flex items-center justify-between px-6 md:px-12 lg:px-20 transition-all duration-300 ${isScrolled
        ? 'bg-void/90 backdrop-blur-xl border-b border-white/10'
        : 'bg-transparent'
        }`}
    >
      <Link to={PATHS.home} className="flex items-center gap-2 nav-logo cursor-pointer">
        <span className="font-bold text-lg text-white tracking-tight">Cherriplus</span>
      </Link>

      <ul className="hidden md:flex items-center gap-8 nav-links">
        {navLinks.map(({ key, id: link }) => {
          const isPricingLink = link === 'Pricing';

          return (
            <li key={link} className="relative group overflow-hidden">
              <a
                href={isPricingLink ? '#' : `#${link.toLowerCase()}`}
                onClick={(e) => handleNavClick(e, link)}
                className={`text-sm transition-colors duration-200 ${isPricingLink && isPricingPage
                  ? 'text-acid font-bold'
                  : 'text-white/65 hover:text-white'
                  }`}
              >
                {t(key)}
              </a>
              <span className={`absolute bottom-0 left-0 w-full h-[1px] bg-acid origin-left transition-transform duration-300 ${isPricingLink && isPricingPage ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
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
          onClick={handleLiveDashboard}
          className="text-xs md:text-sm border border-acid/50 rounded-full px-4 py-1.5 text-acid hover:text-void hover:bg-acid transition-colors font-medium hidden sm:flex items-center gap-2 group"
        >
          <div className="w-2 h-2 rounded-full bg-acid animate-pulse group-hover:bg-void"></div>
          Live Dashboard
        </button>

        <Link
          to={PATHS.login}
          className="text-xs md:text-sm border border-white/20 rounded-full px-4 py-1.5 text-white/80 hover:text-white hover:bg-white/5 transition-colors font-medium hidden sm:block"
        >
          {t('navbar.login')}
        </Link>
        <Link
          to={PATHS.signup}
          className="text-xs md:text-sm border border-white/20 rounded-full px-4 py-1.5 text-void bg-white hover:brightness-90 transition-all font-bold hidden md:block"
        >
          {t('navbar.signup')}
        </Link>

        {/* Hamburger Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`md:hidden flex items-center justify-center w-10 h-10 rounded-xl transition-all active:scale-95 ${isScrolled
            ? 'bg-white/10 text-acid border border-white/10'
            : 'bg-white/5 border border-white/10 text-acid'
            }`}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 bg-void z-40 h-screen md:hidden flex flex-col items-center justify-center gap-10 transition-all duration-500 ease-in-out ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <button
          onClick={() => setIsMenuOpen(false)}
          className="absolute top-4 right-6 w-10 h-10 flex items-center justify-center text-white/40 hover:text-white transition-colors"
        >
          <X size={32} />
        </button>
        <div className="flex flex-col items-center gap-6 mt-20 w-full mb-auto overflow-y-auto">
          {[
            ...navLinks,
            { key: 'navbar.login', id: 'Login' },
          ].map(({ key, id: link }) => {
            const isPricingLink = link === 'Pricing';
            const isLoginLink = link === 'Login';
            const isHomeLink = link === 'Home';

            return (
              <a
                key={link}
                href={isPricingLink || isLoginLink ? '#' : `#${link.toLowerCase()}`}
                onClick={(e) => {
                  setIsMenuOpen(false);
                  if (isPricingLink) {
                    e.preventDefault();
                    navigate(PATHS.pricing);
                  } else if (isLoginLink) {
                    e.preventDefault();
                    navigate(PATHS.login);
                  } else if (isPricingPage) {
                    e.preventDefault();
                    if (isHomeLink) {
                      navigate(PATHS.home);
                    } else {
                      navigate(PATHS.home);
                      setTimeout(() => {
                        const el = document.getElementById(link.toLowerCase());
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    }
                  }
                }}
                className="text-xl mt-4 font-bold text-white/90 hover:text-acid transition-all active:scale-95"
              >
                {t(key)}
              </a>
            );
          })}
        </div>
        <Link
          to={PATHS.signup}
          onClick={() => setIsMenuOpen(false)}
          className="mt-4 px-10 py-3.5 rounded-full bg-acid text-void font-black text-lg shadow-[0_0_30px_rgba(232,245,50,0.3)] hover:scale-105 active:scale-95 transition-all uppercase tracking-tight"
        >
          {t('navbar.signup')}
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;

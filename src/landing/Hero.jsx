import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useTranslation } from 'react-i18next';

const Hero = () => {
  const { t } = useTranslation();
  const headlineRef = useRef(null);
  const mockupRef = useRef(null);

  useEffect(() => {
    // Word-split setup
    const headline = headlineRef.current;
    if (headline) {
      const text = headline.textContent;
      headline.innerHTML = text
        .split(' ')
        .map(w => `<span class="word inline-block mr-[0.2em] transform-gpu">${w}</span>`)
        .join(' ');
    }

    const masterTL = gsap.timeline({ defaults: { ease: 'pharma.out' } });

    masterTL
      .fromTo('.hero-eyebrow', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.35, delay: 0.5 })
      .to('.hero-headline .word', {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.045,
      }, '-=0.1')
      .fromTo('.hero-subtext', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.45 }, '-=0.25')
      .fromTo('.hero-cta-row', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.4 }, '-=0.2')
      .fromTo('.hero-mockup', {
        opacity: 0,
        y: 60,
        rotationX: 8,
      }, {
        opacity: 1,
        y: 0,
        rotationX: 0,
        duration: 0.9,
        ease: 'pharma.inOut',
      }, '-=0.3')
      .fromTo('.hero-kpi-number', {
        textContent: 0,
      }, {
        opacity: 1,
        textContent: 1,
        duration: 1.4,
        snap: { textContent: 1 },
        stagger: 0.15,
        ease: 'power2.out',
      }, '-=0.4');

    // Parallax cleanup on mockup
    gsap.to(mockupRef.current, {
      rotationX: 0,
      y: -30,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero-section',
        start: 'top top',
        end: 'bottom top',
        scrub: 1.2,
      },
    });

    // Continuous Particle Animation
    gsap.utils.toArray('.particle').forEach(particle => {
      gsap.to(particle, {
        x: 'random(-40, 40)',
        y: 'random(-40, 40)',
        opacity: 'random(0.3, 0.9)',
        duration: 'random(3, 6)',
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      });
    });

  }, []);

  return (
    <section className="hero-section relative pt-32 pb-20 px-6 md:px-12 lg:px-20 flex flex-col items-center text-center overflow-hidden min-h-screen">
      {/* Background & Half Moon Glow */}
      <div className="absolute inset-0 -z-10 bg-void overflow-hidden flex justify-center">

        {/* Soft White Half Moon Glow */}
        {/* Core bright glow */}
        <div className="absolute top-[35%] w-[80vw] max-w-[800px] h-[400px] bg-white/[0.05] blur-[120px] rounded-[100%] pointer-events-none"></div>
        {/* Wider, softer dome */}
        <div className="absolute top-[25%] w-[120vw] max-w-[1200px] h-[600px] bg-white/[0.03] blur-[80px] rounded-t-[100%] pointer-events-none"></div>
        {/* Main visible half-moon shape */}
        <div className="absolute top-[30%] w-[100vw] max-w-[900px] h-[500px] bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.06)_0%,transparent_70%)] rounded-t-[100%] pointer-events-none"></div>
        <div className="absolute top-[40%] w-[140vw] max-w-[1400px] h-[800px] bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.02)_0%,transparent_60%)] pointer-events-none"></div>

        {/* Particles / Stars */}
        <div className="particle absolute top-[20%] left-[15%] w-1 h-1 bg-white/40 rounded-full"></div>
        <div className="particle absolute top-[35%] right-[20%] w-1.5 h-1.5 bg-white/30 rounded-full"></div>
        <div className="particle absolute top-[60%] right-[10%] w-1 h-1 bg-acid/20 rounded-full"></div>
        <div className="particle absolute top-[15%] right-[30%] w-1 h-1 bg-white/20 rounded-full"></div>

      </div>

      <div className="hero-eyebrow mb-6">
        <span className="bg-white/5 text-acid px-4 py-1.5 rounded-full text-[11px] uppercase font-mono tracking-wider border border-white/10 shadow-sm flex items-center gap-2 inline-flex">
          <span className="text-acid/80">●</span> {t('hero.eyebrow')}
        </span>
      </div>

      <h1
        ref={headlineRef}
        className="hero-headline text-white font-medium leading-[1.15] mb-6 max-w-[800px] text-[clamp(40px,5.5vw,72px)] tracking-tight"
      >
        {t('hero.headline_pt1')} <span className="text-acid">{t('hero.headline_pt2')}</span>
      </h1>

      <p className="hero-subtext text-white/55 text-[17px] max-w-[560px] mx-auto leading-[1.65] mb-10 font-light">
        {t('hero.subtext')}
      </p>

      <div className="hero-cta-row flex flex-col items-center justify-center gap-4 w-full mb-12">
        <div className="flex flex-col md:flex-row gap-2 w-full md:w-[480px]">
          <input
            type="email"
            placeholder={t('hero.placeholder')}
            className="flex-1 bg-white/5 border border-white/12 rounded-full px-6 text-sm text-white focus:outline-none focus:border-acid transition-colors placeholder-white/40 h-12"
          />
          <button className="h-12 bg-acid text-void font-bold text-sm px-8 rounded-full hover:brightness-110 hover:scale-[1.02] active:scale-95 transition-all shadow-[0_4px_14px_rgba(232,245,50,0.3)] shrink-0 whitespace-nowrap">
            {t('hero.cta')}
          </button>
        </div>
        <p className="hero-trust-text text-white/60 text-xs mt-2">
          {t('hero.trust')}
        </p>
        <a href="#features" className="hero-ghost-link text-white/50 hover:text-white text-sm mt-2 transition-colors flex items-center gap-1">
          {t('hero.see_how')}
        </a>
      </div>

      <div className="hero-social-proof flex flex-col items-center mb-16 w-full max-w-[800px] mx-auto">
        <p className="text-white/30 text-[12px] mb-6 text-center">
          {t('hero.social_proof')}
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-50 grayscale">
          <div className="h-8 flex items-center font-bold text-white/80 text-lg">CLIENT A</div>
          <div className="h-8 flex items-center font-bold text-white/80 text-lg">CLIENT B</div>
          <div className="h-8 flex items-center font-bold text-white/80 text-lg">CLIENT C</div>
          <div className="h-8 flex items-center text-white/60 text-sm font-medium">{t('hero.more_networks')}</div>
        </div>
      </div>

      {/* Dashboard Mockup */}
      <div
        ref={mockupRef}
        className="hero-mockup w-full max-w-[900px] h-[460px]  rounded-t-xl overflow-hidden relative"
        style={{ perspective: '1200px', transformStyle: 'preserve-3d' }}
      >
        <div className="h-8 bg-white/5 flex items-center px-4 gap-2 border-b border-white/10">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-danger/20"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-warn/20"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-success/20"></div>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="w-32 h-1.5 rounded-full bg-white/5"></div>
          </div>
        </div>

        <div className="p-8 pb-0">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-white/80 font-medium">{t('hero.mock.greeting')}</h3>
            <span className="text-white/40 text-xs">{t('hero.mock.date')}</span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {[
              { label: t('hero.mock.kpi1_lbl'), val: '₹2.1Cr', sub: t('hero.mock.kpi1_sub'), color: 'text-white' },
              { label: t('hero.mock.kpi2_lbl'), val: '2,847', sub: t('hero.mock.kpi2_sub'), color: 'text-acid' },
              { label: t('hero.mock.kpi3_lbl'), val: '40%', sub: t('hero.mock.kpi3_sub'), color: 'text-success' },
              { label: t('hero.mock.kpi4_lbl'), val: '98.3%', sub: t('hero.mock.kpi4_sub'), color: 'text-acid' }
            ].map((stat, i) => (
              <div key={i} className="bg-white/5 border border-white/10 p-4 rounded-xl flex flex-col justify-between">
                <p className="text-xs text-white/40 mb-2">{stat.label}</p>
                <h4 className={`text-2xl font-bold hero-kpi-number ${stat.color}`}>{stat.val}</h4>
                <p className="text-[10px] text-white/30 mt-2 hero-kpi-trend">{stat.sub}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2 bg-white/5 border border-white/10 p-4 rounded-xl h-28 flex flex-col justify-end gap-2">
              <div className="flex items-end gap-1.5 h-full pt-4">
                {[40, 65, 45, 90, 55, 30, 75, 50, 85, 60, 80].map((h, i) => (
                  <div key={i} className="flex-1 bg-acid/80 rounded-t-[2px] relative transition-all duration-500 hover:bg-acid" style={{ height: `${h}%` }}>
                  </div>
                ))}
              </div>
              <div className="flex justify-between border-t border-white/5 pt-2 mt-1">
                <span className="text-[10px] font-medium text-white/50">{t('hero.mock.inv_overview')}</span>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 p-4 rounded-xl h-28 flex flex-col items-center justify-center gap-2 relative">
              <div className="w-14 h-14 rounded-full border-[4px] border-danger border-t-acid border-r-acid border-b-acid flex items-center justify-center relative shadow-[0_0_15px_rgba(232,245,50,0.15)]">
                <div className="text-[12px] font-bold text-white">98%</div>
              </div>
              <span className="text-[10px] font-medium text-white/50 mt-1">{t('hero.mock.net_health')}</span>
            </div>
          </div>

          <div className="w-full bg-dark/80 border-t border-white/10 p-2 overflow-hidden whitespace-nowrap flex items-center">
            <div className="animate-[slide-left_12s_linear_infinite] inline-flex gap-8 text-[11px] font-mono whitespace-nowrap">
              <span className="text-white/70"><span className="text-success text-[14px] leading-none">●</span> {t('hero.mock.ticker1')}</span>
              <span className="text-white/70"><span className="text-warn text-[14px] leading-none">●</span> {t('hero.mock.ticker2')}</span>
              <span className="text-white/70"><span className="text-success text-[14px] leading-none">●</span> {t('hero.mock.ticker3')}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};


export default Hero;

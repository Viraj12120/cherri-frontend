import React from 'react';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="bg-void pt-20 pb-10 px-6 md:px-12 lg:px-20 border-t border-white/5">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-16 mb-16">
          {/* Brand & Positioning */}
          <div className="lg:w-1/3">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-acid text-xs">●</span>
              <span className="font-bold text-lg text-white tracking-tight">Cherri+</span>
            </div>
            <p className="text-white/50 text-[14px] leading-[1.6] max-w-[300px]">
              {t('footer.tagline')}
            </p>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-2 gap-12 lg:gap-24 w-full lg:w-2/3 lg:justify-end">
            <div>
              <h5 className="text-white/90 text-sm font-bold mb-6">{t('footer.f_platform')}</h5>
              <ul className="space-y-4">
                {[t('footer.l_agents'), t('footer.l_forecasting'), t('footer.l_redistribution'), t('footer.l_security')].map(link => (
                  <li key={link}>
                    <a href="#" className="text-sm text-white/50 hover:text-white transition-colors">{link}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h5 className="text-white/90 text-sm font-bold mb-6">{t('footer.f_company')}</h5>
              <ul className="space-y-4">
                {[t('footer.l_about'), t('footer.l_careers'), t('footer.l_blog'), t('footer.l_contact')].map(link => (
                  <li key={link}>
                    <a href="#" className="text-sm text-white/50 hover:text-white transition-colors">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center gap-6 mb-16 opacity-50 grayscale">
          <div className="border border-white/20 rounded-md px-3 py-1.5 text-[10px] text-white font-medium uppercase tracking-wider">{t('footer.b1')}</div>
          <div className="border border-white/20 rounded-md px-3 py-1.5 text-[10px] text-white font-medium uppercase tracking-wider">{t('footer.b2')}</div>
          <div className="border border-white/20 rounded-md px-3 py-1.5 text-[10px] text-white font-medium uppercase tracking-wider">{t('footer.b3')}</div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-white/40 text-[12px]">
          <div className="flex items-center gap-6">
            <span>{t('footer.rights')}</span>
            <span className="flex items-center gap-1">{t('footer.made_in')}</span>
          </div>

          <div className="flex gap-6 items-center">
            <a href="#" className="hover:text-white transition-colors">{t('footer.privacy')}</a>
            <a href="#" className="hover:text-white transition-colors">{t('footer.terms')}</a>
          </div>

          <div className="flex gap-6 items-center">
            {['LinkedIn', 'Twitter'].map((icon, i) => (
              <a key={i} href="#" className="hover:text-white transition-colors">
                {icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

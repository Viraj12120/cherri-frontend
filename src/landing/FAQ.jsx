import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { gsap } from 'gsap';
import { useTranslation } from 'react-i18next';

const FAQItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <div 
      className={`border-b border-white/8 py-6 cursor-pointer group transition-colors ${isOpen ? 'bg-white/[0.02]' : 'hover:bg-white/[0.02]'}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between gap-6 px-4">
        <h4 className={`text-sm md:text-base font-medium transition-colors duration-300 ${isOpen ? 'text-white' : 'text-white/70'}`}>
          {question}
        </h4>
        <div className={`flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-45 text-acid' : 'text-acid/60 group-hover:text-acid'}`}>
          <Plus size={18} />
        </div>
      </div>
      
      <div 
        className={`overflow-hidden transition-all duration-500 ease-in-out px-4`}
        style={{ 
          maxHeight: isOpen ? '200px' : '0',
          opacity: isOpen ? 1 : 0,
          marginTop: isOpen ? '16px' : '0'
        }}
      >
        <p className="text-white/55 text-sm md:text-base leading-relaxed max-w-[650px]">
          {answer}
        </p>
      </div>
    </div>
  );
};

const FAQSection = () => {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    { q: t('faq.q1'), a: t('faq.a1') },
    { q: t('faq.q2'), a: t('faq.a2') },
    { q: t('faq.q3'), a: t('faq.a3') },
    { q: t('faq.q4'), a: t('faq.a4') },
    { q: t('faq.q5'), a: t('faq.a5') },
    { q: t('faq.q6'), a: t('faq.a6') },
    { q: t('faq.q7'), a: t('faq.a7') },
    { q: t('faq.q8'), a: t('faq.a8') }
  ];

  return (
    <section className="bg-navy py-24 px-6 md:px-12 lg:px-20 reveal-section">
      <div className="max-w-[720px] mx-auto">
        <div className="reveal-child flex flex-col items-center mb-16 text-center">
          <span className="bg-white/5 text-white/50 px-4 py-1.5 rounded-full text-[12px] font-mono tracking-widest border border-white/10 uppercase mb-6 inline-flex">
            {t('faq.badge')}
          </span>
          <h2 className="text-white font-medium leading-[1.15] text-[clamp(28px,3vw,40px)] mb-4">
            {t('faq.title_pt1')}<br />{t('faq.title_pt2')}
          </h2>
          <p className="text-white/40 text-[16px]">
            {t('faq.desc')}
          </p>
        </div>

        <div className="reveal-child">
          {faqs.map((faq, i) => (
            <FAQItem 
              key={i}
              question={faq.q}
              answer={faq.a}
              isOpen={openIndex === i}
              onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;

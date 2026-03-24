import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Mail, Lock, AlertCircle, Loader2, Apple } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PATHS } from '../routes/paths';
import { useAuthStore } from '../stores/authStore';
import loginBg from '../assets/login.jpg';

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect') || PATHS.dashboard;

  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const login = useAuthStore((s) => s.login);
  const isLoading = useAuthStore((s) => s.isLoading);
  const error = useAuthStore((s) => s.error);
  const clearError = useAuthStore((s) => s.clearError);

  const handleLogin = async (e) => {
    e.preventDefault();

    const success = await login(email, password);
    if (success) {
      navigate(redirectTo, { replace: true });
    }
  };

  return (
    <div className="min-h-screen flex bg-[#0f0f11] font-sans text-white">
      
      {/* Left split: Full Height Image (65% width on desktop) */}
      <div className="hidden lg:block lg:w-[65%] relative">
        <img 
          src={loginBg} 
          alt="Login background" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0f0f11]/40 mix-blend-multiply"></div>
        <div className="absolute bottom-6 left-6 text-white/70 text-[11px] font-medium tracking-wide">
          Image generated with AI
        </div>
      </div>

      {/* Right split: Login Form (35% width on desktop) */}
      <div className="w-full lg:w-[35%] flex flex-col pt-12 pb-8 px-8 sm:px-16 lg:px-12 relative bg-[#0f0f11]">
        
        {/* Back Button */}
        <Link 
          to={PATHS.home}
          className="absolute top-6 left-6 text-white/50 hover:text-white transition-colors p-2 z-10"
        >
          <ArrowLeft size={20} />
        </Link>

        <div className="flex flex-col items-center justify-center flex-1 w-full max-w-[340px] mx-auto">
          
          {/* Logo */}
          <div className="mb-12">
            <h1 className="text-[26px] font-black tracking-tighter text-white">
              CHERRI<span className="text-acid">PLUS</span>
            </h1>
          </div>

          <h2 className="text-xl font-bold text-white mb-8 tracking-tight">{t('auth.login_title')}</h2>

          {!showEmailForm ? (
            <div className="w-full flex flex-col gap-3">
              {/* Google SSO Button */}
              <button 
                onClick={() => navigate(PATHS.dashboard)}
                className="w-full bg-[#202022] hover:bg-[#2a2a2c] border border-white/5 rounded-[8px] p-2 flex items-center justify-between transition-colors shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-acid to-emerald-500 flex items-center justify-center text-[10px] font-bold text-void shrink-0 border border-white/10">
                    V
                  </div>
                  <div className="flex flex-col items-start leading-tight">
                    <span className="text-[13px] font-medium text-white">{t('auth.continue_as')}</span>
                    <span className="text-[11px] text-white/50">disaleviraj17@gmail.com</span>
                  </div>
                </div>
                <div className="w-8 h-8 bg-white rounded flex items-center justify-center shrink-0">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                </div>
              </button>

              {/* Apple Button */}
              <button className="w-full bg-transparent border border-white/10 hover:border-white/30 rounded-[8px] py-3 px-4 flex items-center justify-center gap-3 transition-colors">
                <Apple size={18} className="fill-white" />
                <span className="text-[13px] font-bold text-white">{t('auth.continue_apple')}</span>
              </button>

              {/* Email Button */}
              <button 
                onClick={() => { setShowEmailForm(true); clearError(); }}
                className="w-full bg-transparent border border-white/10 hover:border-white/30 rounded-[8px] py-3 px-4 flex items-center justify-center gap-3 transition-colors"
              >
                <Mail size={16} strokeWidth={2.5} />
                <span className="text-[13px] font-bold text-white">{t('auth.continue_email')}</span>
              </button>

              <div className="mt-8 flex flex-col gap-5 items-center">
                <a href="#" className="text-[#a0a0a0] hover:text-white text-[12px] transition-colors">
                  {t('auth.sso_login')}
                </a>
                
                <p className="text-[12px] text-[#a0a0a0]">
                  {t('auth.no_account')}{' '}
                  <Link to={PATHS.signup} className="text-[#3b82f6] hover:underline font-bold transition-all">
                    {t('auth.signup_link')}
                  </Link>
                </p>
                
                <a href="#" className="text-[#3b82f6] hover:underline text-[12px] font-bold transition-colors mt-2">
                  {t('auth.cookies')}
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="flex flex-col gap-4 w-full animate-[fadeIn_0.3s_ease-out]">
              {error && (
                <div className="bg-danger/10 border border-danger/20 text-danger text-[13px] p-3 rounded flex items-start gap-2">
                  <AlertCircle size={14} className="mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-bold text-white/70 ml-1">{t('auth.email_label')}</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/30 group-focus-within:text-white transition-colors">
                    <Mail size={16} />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('auth.email_placeholder')}
                    className="w-full bg-transparent border border-white/20 rounded-[8px] py-3 pl-10 pr-4 text-[13px] text-white placeholder-white/20 focus:outline-none focus:border-white transition-all font-light"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5 mt-2">
                <label className="text-[12px] font-bold text-white/70 ml-1">{t('auth.password_label')}</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/30 group-focus-within:text-white transition-colors">
                    <Lock size={16} />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t('auth.password_placeholder')}
                    className="w-full bg-transparent border border-white/20 rounded-[8px] py-3 pl-10 pr-4 text-[13px] text-white placeholder-white/20 focus:outline-none focus:border-white transition-all font-light"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Link to={PATHS.forgotPassword} className="text-[11px] text-[#3b82f6] hover:underline font-medium">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-white text-void font-bold py-3 rounded-[8px] hover:bg-gray-100 flex items-center justify-center gap-2 mt-4 text-[13px] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? <Loader2 size={16} className="animate-spin" /> : t('auth.login_button')}
              </button>

              <button 
                type="button"
                onClick={() => { setShowEmailForm(false); clearError(); }}
                className="text-white/50 hover:text-white text-[12px] font-semibold mt-4 transition-colors"
              >
                {t('auth.back_options')}
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};

export default Login;

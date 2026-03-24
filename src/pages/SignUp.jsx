import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Lock, AlertCircle, Loader2, Apple, User, Hospital } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PATHS } from '../routes/paths';
import { useAuthStore } from '../stores/authStore';
import signupBg from '../assets/med.jpg';

const SignUp = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [showEmailForm, setShowEmailForm] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    networkName: '',
    password: '',
    confirmPassword: '',
  });

  const register = useAuthStore((s) => s.register);
  const isLoading = useAuthStore((s) => s.isLoading);
  const error = useAuthStore((s) => s.error);
  const clearError = useAuthStore((s) => s.clearError);

  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear field error on change
    if (fieldErrors[e.target.name]) {
      setFieldErrors((prev) => ({ ...prev, [e.target.name]: null }));
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    // Frontend validation
    const errors = {};
    if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters.';
    }
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }
    if (!formData.networkName.trim()) {
      errors.networkName = 'Organization name is required.';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    const success = await register({
      tenantName: formData.networkName,
      email: formData.email,
      password: formData.password,
      firstName: formData.firstName,
      lastName: formData.lastName,
    });

    if (success) {
      navigate(PATHS.dashboard, { replace: true });
    }
  };

  return (
    <div className="min-h-screen flex bg-[#0f0f11] font-sans text-white">
      
      {/* Left split: Full Height Image (65% width on desktop) */}
      <div className="hidden lg:block lg:w-[65%] relative">
        <img 
          src={signupBg} 
          alt="Sign up background" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0f0f11]/40 mix-blend-multiply"></div>
        <div className="absolute bottom-6 left-6 text-white/70 text-[11px] font-medium tracking-wide">
          Image generated with AI
        </div>
      </div>

      {/* Right split: Sign Up Form (35% width on desktop) */}
      <div className="w-full lg:w-[35%] flex flex-col pt-12 pb-8 px-8 sm:px-16 lg:px-12 relative bg-[#0f0f11] overflow-y-auto">
        
        {/* Back Button */}
        <Link 
          to={PATHS.home}
          className="absolute top-6 left-6 text-white/50 hover:text-white transition-colors p-2 z-10"
        >
          <ArrowLeft size={20} />
        </Link>

        <div className="flex flex-col items-center justify-center flex-1 w-full max-w-[340px] mx-auto py-8">
          
          {/* Logo */}
          <div className="mb-12">
            <h1 className="text-[26px] font-black tracking-tighter text-white">
              CHERRI<span className="text-acid">PLUS</span>
            </h1>
          </div>

          <h2 className="text-xl font-bold text-white mb-8 tracking-tight">{t('auth.signup_title')}</h2>

          {!showEmailForm ? (
            <div className="w-full flex flex-col gap-3">
              {/* Google Button */}
              <button 
                className="w-full bg-[#202022] hover:bg-[#2a2a2c] border border-white/5 rounded-[8px] py-3 px-4 flex items-center justify-between transition-colors shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="text-[13px] font-bold text-white whitespace-nowrap">{t('auth.signup_google')}</span>
                </div>
                <div className="w-6 h-6 bg-white rounded flex items-center justify-center shrink-0">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                </div>
              </button>

              {/* Apple Button */}
              <button className="w-full bg-transparent border border-white/10 hover:border-white/30 rounded-[8px] py-3 px-4 flex items-center gap-3 transition-colors justify-center">
                <Apple size={18} className="fill-white" />
                <span className="text-[13px] font-bold text-white flex-1 text-center pr-4">{t('auth.signup_apple')}</span>
              </button>

              {/* Email Button */}
              <button 
                onClick={() => { setShowEmailForm(true); clearError(); }}
                className="w-full bg-transparent border border-white/10 hover:border-white/30 rounded-[8px] py-3 px-4 flex items-center gap-3 transition-colors justify-center"
              >
                <Mail size={16} strokeWidth={2.5} />
                <span className="text-[13px] font-bold text-white flex-1 text-center pr-4">{t('auth.signup_email')}</span>
              </button>

              <div className="mt-8 flex flex-col gap-5 items-center pb-8">
                <p className="text-[12px] text-[#a0a0a0]">
                  {t('auth.already_account')}{' '}
                  <Link to={PATHS.login} className="text-[#3b82f6] hover:underline font-bold transition-all">
                    {t('auth.login_link')}
                  </Link>
                </p>
                <a href="#" className="text-[#3b82f6] hover:underline text-[12px] font-bold transition-colors">
                  {t('auth.cookies')}
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSignUp} className="flex flex-col gap-4 w-full animate-[fadeIn_0.3s_ease-out] pb-12">
              {error && (
                <div className="bg-danger/10 border border-danger/20 text-danger text-[13px] p-3 rounded flex items-start gap-2">
                  <AlertCircle size={14} className="mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex gap-3">
                <div className="flex flex-col gap-1.5 flex-1">
                  <label className="text-[12px] font-bold text-white/70 ml-1">First Name</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/30 group-focus-within:text-white transition-colors">
                      <User size={16} />
                    </div>
                    <input
                      type="text"
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="First Name"
                      className="w-full bg-transparent border border-white/20 rounded-[8px] py-3 pl-10 pr-4 text-[13px] text-white placeholder-white/20 focus:outline-none focus:border-white transition-all font-light"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 flex-1">
                  <label className="text-[12px] font-bold text-white/70 ml-1">Last Name</label>
                  <div className="relative group">
                    <input
                      type="text"
                      name="lastName"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Last Name"
                      className="w-full bg-transparent border border-white/20 rounded-[8px] py-3 px-4 text-[13px] text-white placeholder-white/20 focus:outline-none focus:border-white transition-all font-light"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1.5 mt-2">
                <label className="text-[12px] font-bold text-white/70 ml-1">{t('auth.work_email_label')}</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/30 group-focus-within:text-white transition-colors">
                    <Mail size={16} />
                  </div>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={t('auth.work_email_placeholder')}
                    className="w-full bg-transparent border border-white/20 rounded-[8px] py-3 pl-10 pr-4 text-[13px] text-white placeholder-white/20 focus:outline-none focus:border-white transition-all font-light"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5 mt-2">
                <label className="text-[12px] font-bold text-white/70 ml-1">{t('auth.hospital_label')}</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/30 group-focus-within:text-white transition-colors">
                    <Hospital size={16} />
                  </div>
                  <input
                    type="text"
                    name="networkName"
                    required
                    value={formData.networkName}
                    onChange={handleChange}
                    placeholder="E.g., City General Hospital"
                    className={`w-full bg-transparent border rounded-[8px] py-3 pl-10 pr-4 text-[13px] text-white placeholder-white/20 focus:outline-none focus:border-white transition-all font-light ${
                      fieldErrors.networkName ? 'border-danger/50' : 'border-white/20'
                    }`}
                  />
                </div>
                {fieldErrors.networkName && (
                  <span className="text-danger text-[11px] ml-1">{fieldErrors.networkName}</span>
                )}
              </div>

              <div className="flex flex-col gap-1.5 mt-2">
                <label className="text-[12px] font-bold text-white/70 ml-1">{t('auth.password_label')}</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/30 group-focus-within:text-white transition-colors">
                    <Lock size={16} />
                  </div>
                  <input
                    type="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder={t('auth.create_password_placeholder')}
                    className={`w-full bg-transparent border rounded-[8px] py-3 pl-10 pr-4 text-[13px] text-white placeholder-white/20 focus:outline-none focus:border-white transition-all font-light ${
                      fieldErrors.password ? 'border-danger/50' : 'border-white/20'
                    }`}
                  />
                </div>
                {fieldErrors.password && (
                  <span className="text-danger text-[11px] ml-1">{fieldErrors.password}</span>
                )}
              </div>

              <div className="flex flex-col gap-1.5 mt-2">
                <label className="text-[12px] font-bold text-white/70 ml-1">Confirm Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/30 group-focus-within:text-white transition-colors">
                    <Lock size={16} />
                  </div>
                  <input
                    type="password"
                    name="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    className={`w-full bg-transparent border rounded-[8px] py-3 pl-10 pr-4 text-[13px] text-white placeholder-white/20 focus:outline-none focus:border-white transition-all font-light ${
                      fieldErrors.confirmPassword ? 'border-danger/50' : 'border-white/20'
                    }`}
                  />
                </div>
                {fieldErrors.confirmPassword && (
                  <span className="text-danger text-[11px] ml-1">{fieldErrors.confirmPassword}</span>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-white text-void font-bold py-3 rounded-[8px] hover:bg-gray-100 flex items-center justify-center gap-2 mt-4 text-[13px] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? <Loader2 size={16} className="animate-spin" /> : t('auth.create_account_button')}
              </button>

              <p className="text-[#a0a0a0] text-[11px] text-center mt-2">
                {t('auth.terms_privacy')}
              </p>

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

export default SignUp;

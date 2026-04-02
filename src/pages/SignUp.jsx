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
      const user = useAuthStore.getState().user;
      navigate(PATHS.dashboard(user?.tenant_id || 'unassigned'), { replace: true });
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


              {/* Apple Button */}


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
                    className={`w-full bg-transparent border rounded-[8px] py-3 pl-10 pr-4 text-[13px] text-white placeholder-white/20 focus:outline-none focus:border-white transition-all font-light ${fieldErrors.networkName ? 'border-danger/50' : 'border-white/20'
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
                    className={`w-full bg-transparent border rounded-[8px] py-3 pl-10 pr-4 text-[13px] text-white placeholder-white/20 focus:outline-none focus:border-white transition-all font-light ${fieldErrors.password ? 'border-danger/50' : 'border-white/20'
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
                    className={`w-full bg-transparent border rounded-[8px] py-3 pl-10 pr-4 text-[13px] text-white placeholder-white/20 focus:outline-none focus:border-white transition-all font-light ${fieldErrors.confirmPassword ? 'border-danger/50' : 'border-white/20'
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

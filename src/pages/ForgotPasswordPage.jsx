import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { PATHS } from '../routes/paths';
import api from '../lib/axios';
import { getErrorMessage } from '../lib/utils';
import loginBg from '../assets/login.jpg';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    try {
      // Assuming backend has /auth/forgot-password route sending an email
      await api.post('/auth/forgot-password', { email });
      setStatus('success');
    } catch (err) {
      setErrorMessage(getErrorMessage(err, 'Failed to send reset link. Please try again.'));
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen flex bg-[#0f0f11] font-sans text-white">
      {/* Left split */}
      <div className="hidden lg:block lg:w-[65%] relative">
        <img src={loginBg} alt="Background" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0f0f11]/40 mix-blend-multiply"></div>
      </div>

      {/* Right split */}
      <div className="w-full lg:w-[35%] flex flex-col pt-12 pb-8 px-8 sm:px-16 lg:px-12 relative bg-[#0f0f11]">
        <Link to={PATHS.login} className="absolute top-6 left-6 text-white/50 hover:text-white transition-colors p-2 z-10">
          <ArrowLeft size={20} />
        </Link>

        <div className="flex flex-col flex-1 w-full max-w-[340px] mx-auto mt-20">
          <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Forgot Password</h2>
          <p className="text-white/50 text-sm mb-8">
            Enter your email address and we'll send you a link to reset your password.
          </p>

          {status === 'success' ? (
            <div className="flex flex-col items-center justify-center p-6 bg-acid/5 border border-acid/20 rounded-xl text-center">
              <CheckCircle2 size={40} className="text-acid mb-4" />
              <h3 className="font-bold text-white mb-2">Check your email</h3>
              <p className="text-sm text-white/60 mb-6">
                We've sent a password reset link to <br/>
                <span className="text-white font-medium">{email}</span>
              </p>
              <button onClick={() => setStatus('idle')} className="text-acid text-sm font-bold hover:underline">
                Try another email
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {status === 'error' && (
                <div className="bg-danger/10 border border-danger/20 text-danger text-[13px] p-3 rounded flex items-start gap-2">
                  <AlertCircle size={14} className="mt-0.5 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-bold text-white/70 ml-1">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/30 group-focus-within:text-white transition-colors">
                    <Mail size={16} />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your registered email"
                    className="w-full bg-transparent border border-white/20 rounded-[8px] py-3 pl-10 pr-4 text-[13px] text-white placeholder-white/20 focus:outline-none focus:border-white transition-all font-light"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-acid text-void font-bold py-3 rounded-[8px] hover:brightness-110 flex items-center justify-center gap-2 mt-2 text-[13px] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'loading' ? <Loader2 size={16} className="animate-spin" /> : 'Send Reset Link'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;

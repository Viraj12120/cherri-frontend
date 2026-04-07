import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, AlertCircle, Loader2 } from 'lucide-react';
import { PATHS } from '../routes/paths';
import api from '../lib/axios';
import { getErrorMessage } from '../lib/utils';
import loginBg from '../assets/login.jpg';

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      setStatus('error');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      setStatus('error');
      return;
    }

    setStatus('loading');
    try {
      await api.post('/auth/reset-password', { token, new_password: password });
      setStatus('success');
      setTimeout(() => navigate(PATHS.login), 3000); // Redirect after 3s
    } catch (err) {
      setErrorMessage(getErrorMessage(err, 'Failed to reset password. The link might be expired.'));
      setStatus('error');
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex bg-void text-white items-center justify-center">
        <div className="text-center">
          <AlertCircle size={48} className="text-danger mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Invalid or Missing Link</h2>
          <p className="text-white/50 mb-6">You must access this page via a valid reset link sent to your email.</p>
          <Link to={PATHS.forgotPassword} className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full font-medium transition-colors">
            Request new link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#0f0f11] font-sans text-white">
      <div className="hidden lg:block lg:w-[65%] relative">
        <img src={loginBg} alt="Background" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0f0f11]/40 mix-blend-multiply"></div>
      </div>

      <div className="w-full lg:w-[35%] flex flex-col pt-12 pb-8 px-8 sm:px-16 lg:px-12 relative bg-[#0f0f11]">
        <div className="flex flex-col flex-1 w-full max-w-[340px] mx-auto mt-16">
          <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Set New Password</h2>
          <p className="text-white/50 text-sm mb-8">
            Please enter your new password below. Make sure it's secure.
          </p>

          {status === 'success' ? (
            <div className="flex flex-col items-center justify-center p-6 bg-acid/5 border border-acid/20 rounded-xl text-center">
              <h3 className="font-bold text-white mb-2">Password Reset Successful</h3>
              <p className="text-sm text-white/60 mb-6">
                Your password has been changed. You will be redirected to the login page momentarily.
              </p>
              <Loader2 size={24} className="text-acid animate-spin" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {status === 'error' && (
                <div className="bg-danger/10 border border-danger/20 text-danger text-[13px] p-3 rounded flex items-start gap-2">
                  <AlertCircle size={14} className="mt-0.5 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-bold text-white/70 ml-1">New Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/30 group-focus-within:text-white transition-colors">
                    <Lock size={16} />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create new password"
                    className="w-full bg-transparent border border-white/20 rounded-[8px] py-3 pl-10 pr-4 text-[13px] text-white placeholder-white/20 focus:outline-none focus:border-white transition-all font-light"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5 mt-2">
                <label className="text-[12px] font-bold text-white/70 ml-1">Confirm Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/30 group-focus-within:text-white transition-colors">
                    <Lock size={16} />
                  </div>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full bg-transparent border border-white/20 rounded-[8px] py-3 pl-10 pr-4 text-[13px] text-white placeholder-white/20 focus:outline-none focus:border-white transition-all font-light"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-acid text-void font-bold py-3 rounded-[8px] hover:brightness-110 flex items-center justify-center gap-2 mt-4 text-[13px] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'loading' ? <Loader2 size={16} className="animate-spin" /> : 'Update Password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;

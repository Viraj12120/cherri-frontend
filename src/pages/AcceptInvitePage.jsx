import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { User, Lock, AlertCircle, Loader2 } from 'lucide-react';
import { PATHS } from '../routes/paths';
import api from '../lib/axios';

const AcceptInvitePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: '',
  });
  
  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      setStatus('error');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match.');
      setStatus('error');
      return;
    }

    setStatus('loading');
    try {
      await api.post('/auth/accept-invite', {
        token,
        first_name: formData.firstName,
        last_name: formData.lastName,
        password: formData.password,
      });
      
      setStatus('success');
      setTimeout(() => navigate(PATHS.login), 3000);
    } catch (err) {
      setErrorMessage(err.response?.data?.detail || 'Failed to accept invitation. The link might be expired or invalid.');
      setStatus('error');
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex bg-void text-white items-center justify-center">
        <div className="text-center">
          <AlertCircle size={48} className="text-danger mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Invalid Invitation Link</h2>
          <p className="text-white/50 mb-6">You must access this page via a valid invite link sent by your administrator.</p>
          <Link to={PATHS.home} className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full font-medium transition-colors">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#0f0f11] font-sans text-white items-center justify-center py-12 px-6">
      
      <div className="w-full max-w-[420px] bg-[#161618] border border-white/10 rounded-[24px] p-8 md:p-10 shadow-2xl relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-acid/10 rounded-full blur-[80px] pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="relative z-10">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">Join CherriPlus</h1>
            <p className="text-white/50 text-sm">
              You've been invited to join your organization's workspace. Set up your profile to continue.
            </p>
          </div>

          {status === 'success' ? (
            <div className="flex flex-col items-center justify-center p-6 bg-acid/5 border border-acid/20 rounded-xl text-center">
              <h3 className="font-bold text-white mb-2">Account Created</h3>
              <p className="text-sm text-white/50 mb-6">
                Your account is ready. You will be redirected to the login page momentarily.
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

              <div className="flex gap-4">
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
                      placeholder="Jane"
                      className="w-full bg-void border border-white/20 rounded-[8px] py-3 pl-10 pr-4 text-[13px] text-white placeholder-white/20 focus:outline-none focus:border-white transition-all"
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
                      placeholder="Doe"
                      className="w-full bg-void border border-white/20 rounded-[8px] py-3 px-4 text-[13px] text-white placeholder-white/20 focus:outline-none focus:border-white transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1.5 mt-2">
                <label className="text-[12px] font-bold text-white/70 ml-1">Create Password</label>
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
                    placeholder="Secure password"
                    className="w-full bg-void border border-white/20 rounded-[8px] py-3 pl-10 pr-4 text-[13px] text-white placeholder-white/20 focus:outline-none focus:border-white transition-all"
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
                    name="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter password"
                    className="w-full bg-void border border-white/20 rounded-[8px] py-3 pl-10 pr-4 text-[13px] text-white placeholder-white/20 focus:outline-none focus:border-white transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-acid text-void font-bold py-3.5 rounded-[8px] hover:brightness-110 flex items-center justify-center gap-2 mt-4 text-[14px] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'loading' ? <Loader2 size={18} className="animate-spin" /> : 'Accept Invitation'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AcceptInvitePage;

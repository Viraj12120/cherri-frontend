import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AlertCircle, CheckCircle2, Loader2, XCircle } from 'lucide-react';
import { PATHS } from '../routes/paths';
import api from '../lib/axios';

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setErrorMessage('Missing verification token.');
      return;
    }

    const verifyToken = async () => {
      try {
        await api.post('/auth/verify-email', { token });
        setStatus('success');
      } catch (err) {
        setStatus('error');
        setErrorMessage(err.response?.data?.detail || 'Verification failed. The link might be expired or invalid.');
      }
    };

    verifyToken();
  }, [token]);

  return (
    <div className="min-h-screen flex bg-void text-white items-center justify-center px-6">
      <div className="max-w-md w-full bg-[#161618] border border-white/10 rounded-2xl p-8 text-center shadow-2xl">
        <div className="mb-6 flex justify-center">
          {status === 'verifying' && (
            <div className="w-16 h-16 rounded-full bg-acid/10 border border-acid/20 flex items-center justify-center">
              <Loader2 size={32} className="text-acid animate-spin" />
            </div>
          )}
          {status === 'success' && (
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <CheckCircle2 size={32} className="text-emerald-500" />
            </div>
          )}
          {status === 'error' && (
             <div className="w-16 h-16 rounded-full bg-danger/10 border border-danger/20 flex items-center justify-center">
               <XCircle size={32} className="text-danger" />
             </div>
          )}
        </div>

        {status === 'verifying' && (
          <>
            <h2 className="text-2xl font-bold mb-2">Verifying Email...</h2>
            <p className="text-white/50 text-sm">Please wait while we verify your email address.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <h2 className="text-2xl font-bold mb-2">Email Verified</h2>
            <p className="text-white/50 text-sm mb-8">
              Your email address has been successfully verified. You now have full access to your account.
            </p>
            <Link to={PATHS.login} className="inline-block w-full py-3 bg-acid text-void font-bold rounded-lg hover:brightness-110 transition-all">
              Continue to Login
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <h2 className="text-2xl font-bold mb-2">Verification Failed</h2>
            <p className="text-white/50 text-sm mb-6">{errorMessage}</p>
            <div className="bg-white/5 rounded-lg p-4 mb-8 text-left border border-white/10">
               <p className="text-sm text-white/70 flex items-start gap-2">
                 <AlertCircle size={16} className="text-acid shrink-0 mt-0.5" />
                 If you believe this is an error, please try logging in to request a new verification link.
               </p>
            </div>
            <Link to={PATHS.login} className="text-[#3b82f6] hover:underline font-bold text-sm">
              Back to Login
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailPage;

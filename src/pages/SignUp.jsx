import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
    ArrowLeft, Mail, Lock, AlertCircle, Loader2, 
    User, Hospital, Eye, EyeOff, Shield, Zap, Building 
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PATHS } from '../routes/paths';
import { useAuthStore } from '../stores/authStore';
import api from '../lib/axios';
import signupBg from '../assets/med.jpg';

const SEGMENTS = [
  { id: 'clinic', label: 'Clinic', icon: Shield, desc: 'Small to medium pharmacy stores' },
  { id: 'distributor', label: 'Distributor', icon: Zap, desc: 'Wholesale & distribution hubs' },
  { id: 'hospital', label: 'Hospital', icon: Building, desc: 'Large healthcare networks' }
];



const SignUp = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [segment, setSegment] = useState('clinic');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    networkName: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const register = useAuthStore((s) => s.register);
  const isLoading = useAuthStore((s) => s.isLoading);
  const error = useAuthStore((s) => s.error);

  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (fieldErrors[e.target.name]) {
      setFieldErrors((prev) => ({ ...prev, [e.target.name]: null }));
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

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

    if (segment === 'hospital') {
      // Enterprise Lead Flow
      try {
        await api.post('/subscriptions/enterprise-leads', {
          org_name: formData.networkName,
          segment: 'hospital',
          contact_person: `${formData.firstName} ${formData.lastName}`,
          contact_email: formData.email,
          requirements: 'Initial signup interest'
        });
        setIsSubmitted(true);
      } catch (err) {
        // Fallback or show error
      }
      return;
    }

    // Standard Registration Flow
    const user = await register({
      tenantName: formData.networkName,
      tenant_segment: segment,
      email: formData.email,
      password: formData.password,
      firstName: formData.firstName,
      lastName: formData.lastName,
    });

    if (user) {
      console.log("Registration successful, user:", user);
      if (user.tenant_id) {
        navigate(`${PATHS.dashboard(user.tenant_id)}?userId=${user.id}&tenantId=${user.tenant_id}`, { replace: true });
      } else {
        console.warn("User registered but tenant_id is missing, routing to pricing.");
        navigate(PATHS.pricing, { replace: true });
      }
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f0f11] font-sans text-white p-6 leading-relaxed">
        <div className="max-w-md w-full text-center space-y-8 animate-fadeIn">
            <div className="w-20 h-20 bg-acid/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-acid/20">
                <Building className="text-acid" size={32} />
            </div>
            <h2 className="text-3xl font-black tracking-tight">Request Received</h2>
            <p className="text-white/40 text-sm">
                Thank you for your interest in <strong>Cherri+ Enterprise</strong>. Our clinical alignment team will review your network details and reach out within 24 hours to schedule a demonstration.
            </p>
            <button 
                onClick={() => navigate(PATHS.home)}
                className="w-full py-4 bg-acid text-void font-bold rounded-2xl shadow-xl hover:scale-[1.02] transition-all"
            >
                Return to Home
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-[#0f0f11] font-sans text-white overflow-hidden">

      <div className="hidden lg:block lg:w-[65%] relative">
        <div className="absolute inset-0 w-full h-full">
            <img
            src={signupBg}
            alt="Sign up background"
            className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0f0f11]/60 mix-blend-multiply"></div>
        </div>
        
        <div className="relative z-10 p-20 flex flex-col justify-end h-full animate-fadeIn pb-16">
            <h3 className="text-4xl font-black text-white italic mb-4 uppercase tracking-tighter">TRANSFORMING PHARMA LOGISTICS</h3>
            <p className="text-white/60 text-sm font-medium leading-relaxed max-w-sm">
                Join {segment === 'clinic' ? 'thousands of pharmacies' : segment === 'distributor' ? "India's largest distributors" : 'major healthcare networks'} using Cherri+ to reduce pharmaceutical waste by 45%.
            </p>
        </div>
      </div>

      <div className="w-full lg:w-[35%] flex flex-col pt-6 pb-2 px-6 sm:px-10 lg:px-8 relative bg-[#0f0f11] overflow-y-auto custom-scrollbar">
        <Link to={PATHS.home} className="absolute top-6 left-6 text-white/50 hover:text-acid transition-colors p-2 z-10 bg-white/5 rounded-full backdrop-blur-md border border-white/5 hover:border-white/20"><ArrowLeft size={20} /></Link>

        <div className="flex flex-col items-center justify-center flex-1 w-full max-w-[340px] mx-auto py-4 mt-8 sm:mt-0">
          <div className="mb-6 text-center">
            <h1 className="text-[26px] font-black tracking-tighter text-white">CHERRI<span className="text-acid">PLUS</span></h1>
          </div>

          <h2 className="text-lg font-bold text-white mb-6 tracking-tight">Create your account</h2>

          {/* Segment Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 w-full mb-4 bg-white/5 p-1 rounded-xl border border-white/5 backdrop-blur-md">
            {SEGMENTS.map(s => (
                <button
                    key={s.id}
                    onClick={() => setSegment(s.id)}
                    className={`flex flex-row sm:flex-col items-center justify-center gap-2 sm:gap-0 py-2 sm:py-2.5 rounded-lg transition-all border border-transparent ${segment === s.id ? 'bg-white/10 border-white/10 text-acid shadow-[0_2px_12px_rgba(232,245,50,0.1)]' : 'text-white/30 hover:text-white/60 hover:bg-white/5'}`}
                >
                    <s.icon size={16} className="sm:mb-1" />
                    <span className="text-[10px] sm:text-[8px] font-black uppercase tracking-widest">{s.label}</span>
                </button>
            ))}
          </div>

          <form onSubmit={handleSignUp} className="flex flex-col gap-2.5 w-full animate-fadeIn pb-6">
            {error && <div className="bg-danger/10 border border-danger/20 text-danger text-[12px] p-2 rounded flex items-start gap-2"><AlertCircle size={14} className="mt-0.5 shrink-0" /><span>{error}</span></div>}

            <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-2.5">
              <div className="flex flex-col gap-1 flex-1">
                <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">First Name</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/20 group-focus-within:text-acid transition-colors"><User size={14} /></div>
                  <input type="text" name="firstName" required value={formData.firstName} onChange={handleChange} className="w-full glass-panel border-white/10 rounded-lg py-2.5 pl-9 pr-3 text-[12px] text-white focus:outline-none focus:border-acid/50 transition-all font-medium" />
                </div>
              </div>
              <div className="flex flex-col gap-1 flex-1">
                <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Last Name</label>
                <input type="text" name="lastName" required value={formData.lastName} onChange={handleChange} className="w-full glass-panel border-white/10 rounded-lg py-2.5 px-3 text-[12px] text-white focus:outline-none focus:border-acid/50 transition-all font-medium" />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Work Email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/20 group-focus-within:text-acid transition-colors"><Mail size={14} /></div>
                <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full glass-panel border-white/10 rounded-lg py-2.5 pl-9 pr-3 text-[12px] text-white focus:outline-none focus:border-acid/50 transition-all font-medium" />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">
                {segment === 'clinic' ? 'Pharmacy Name' : segment === 'distributor' ? 'Distribution Hub' : 'Hospital Network'}
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/20 group-focus-within:text-acid transition-colors"><Hospital size={14} /></div>
                <input type="text" name="networkName" required value={formData.networkName} onChange={handleChange} className={`w-full glass-panel border rounded-lg py-2.5 pl-9 pr-3 text-[12px] text-white focus:outline-none transition-all font-medium ${fieldErrors.networkName ? 'border-danger/50' : 'border-white/10 focus:border-acid/50'}`} />
              </div>
              {fieldErrors.networkName && <span className="text-danger text-[9px] ml-1">{fieldErrors.networkName}</span>}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/20 group-focus-within:text-acid transition-colors"><Lock size={14} /></div>
                <input type={showPassword ? 'text' : 'password'} name="password" required value={formData.password} onChange={handleChange} className={`w-full glass-panel border rounded-lg py-2.5 pl-9 pr-10 text-[12px] text-white focus:outline-none transition-all font-medium ${fieldErrors.password ? 'border-danger/50' : 'border-white/10 focus:border-acid/50'}`} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/20 hover:text-acid transition-colors">{showPassword ? <EyeOff size={14} /> : <Eye size={14} />}</button>
              </div>
              {fieldErrors.password && <span className="text-danger text-[9px] ml-1">{fieldErrors.password}</span>}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Confirm Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/20 group-focus-within:text-acid transition-colors"><Lock size={14} /></div>
                <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" required value={formData.confirmPassword} onChange={handleChange} className={`w-full glass-panel border rounded-lg py-2.5 pl-9 pr-10 text-[12px] text-white focus:outline-none transition-all font-medium ${fieldErrors.confirmPassword ? 'border-danger/50' : 'border-white/10 focus:border-acid/50'}`} />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/20 hover:text-acid transition-colors">{showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}</button>
              </div>
              {fieldErrors.confirmPassword && <span className="text-danger text-[9px] ml-1">{fieldErrors.confirmPassword}</span>}
            </div>

            <button type="submit" disabled={isLoading} className="w-full bg-acid text-void font-black py-3 rounded-xl hover:scale-[1.02] shadow-[0_4px_20px_rgba(232,245,50,0.15)] flex items-center justify-center gap-2 mt-2 text-[12px] uppercase tracking-tight transition-all disabled:opacity-50">
              {isLoading ? <Loader2 size={16} className="animate-spin" /> : (segment === 'hospital' ? 'Request Network Demo' : t('auth.create_account_button'))}
            </button>
          </form>

          <p className="text-[11px] text-white/30 text-center pb-4">Already have an account? <Link to={PATHS.login} className="text-acid hover:underline font-bold transition-all ml-1">Login</Link></p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;

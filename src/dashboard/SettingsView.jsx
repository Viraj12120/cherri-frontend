import React, { useState } from 'react';
import { User, Bell, Shield, Building, CreditCard, Key, ChevronRight, Save, Check } from 'lucide-react';

const Section = ({ title, icon: Icon, children }) => (
  <div className="bg-navy border border-white/5 rounded-xl overflow-hidden">
    <div className="px-6 py-4 border-b border-white/5 flex items-center gap-3">
      <Icon size={16} className="text-acid" />
      <h3 className="font-bold text-sm uppercase tracking-wider text-white/60">{title}</h3>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

const Field = ({ label, type = 'text', value, hint }) => {
  const [val, setVal] = useState(value || '');
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-bold text-white/50 uppercase tracking-widest">{label}</label>
      <input
        type={type}
        value={val}
        onChange={e => setVal(e.target.value)}
        className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-4 text-sm text-white focus:outline-none focus:border-acid/40 transition-all"
      />
      {hint && <p className="text-[10px] text-white/25">{hint}</p>}
    </div>
  );
};

const Toggle = ({ label, desc, defaultOn = false }) => {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
      <div>
        <p className="text-sm font-bold text-white/80">{label}</p>
        <p className="text-[11px] text-white/30 mt-0.5">{desc}</p>
      </div>
      <button onClick={() => setOn(!on)} className={`w-11 h-6 rounded-full transition-all relative ${on ? 'bg-acid' : 'bg-white/10'}`}>
        <span className={`absolute top-1 w-4 h-4 rounded-full transition-all ${on ? 'left-6 bg-void' : 'left-1 bg-white/40'}`} />
      </button>
    </div>
  );
};

const SettingsView = () => {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-[900px] mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Settings</h1>
          <p className="text-white/40 text-sm">Manage your account, organization and notification preferences.</p>
        </div>
        <button onClick={handleSave} className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-bold transition-all ${saved ? 'bg-success text-white' : 'bg-acid text-void hover:brightness-110'}`}>
          {saved ? <><Check size={14} /> Saved!</> : <><Save size={14} /> Save Changes</>}
        </button>
      </div>

      {/* Profile */}
      <Section title="Profile" icon={User}>
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/5">
          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-acid/40 to-acid flex items-center justify-center text-void font-black text-xl">P</div>
          <div>
            <p className="font-bold text-white">Priya K.</p>
            <p className="text-xs text-white/30">Admin · Apollo Pharmacy, Delhi</p>
          </div>
          <button className="ml-auto text-[11px] font-bold text-acid hover:underline">Change Photo</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="First Name" value="Priya" />
          <Field label="Last Name" value="K." />
          <Field label="Email" type="email" value="priya.k@apollo.in" />
          <Field label="Role" value="Pharmacist Admin" />
        </div>
      </Section>

      {/* Organization */}
      <Section title="Organization" icon={Building}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Organization Name" value="Apollo Pharmacy Delhi" />
          <Field label="Plan" value="Enterprise" hint="Contact sales to change plan." />
          <Field label="Timezone" value="Asia/Kolkata (IST)" />
          <Field label="Primary Language" value="English" />
        </div>
      </Section>

      {/* Notifications */}
      <Section title="Notifications" icon={Bell}>
        <Toggle label="Critical Stock Alerts" desc="Receive alerts when stock drops below critical threshold." defaultOn={true} />
        <Toggle label="Expiry Alerts" desc="Be notified when medications are expiring within 30 days." defaultOn={true} />
        <Toggle label="AI Agent Actions" desc="Get notified when the AI agent creates or approves an order." defaultOn={false} />
        <Toggle label="Order Status Updates" desc="Track order state changes from pending to received." defaultOn={true} />
        <Toggle label="Email Digest" desc="Receive a daily email summary of all alerts." defaultOn={false} />
      </Section>

      {/* Security */}
      <Section title="Security" icon={Shield}>
        <div className="flex flex-col gap-4">
          <Field label="Current Password" type="password" value="" />
          <Field label="New Password" type="password" value="" hint="At least 8 characters with a mix of letters and numbers." />
          <Field label="Confirm Password" type="password" value="" />
          <div className="flex items-center justify-between py-3 border-t border-white/5 mt-2">
            <div>
              <p className="text-sm font-bold text-white/80">Two-Factor Authentication</p>
              <p className="text-[11px] text-white/30 mt-0.5">Add an extra layer of security to your account.</p>
            </div>
            <button className="text-xs font-bold text-acid hover:underline flex items-center gap-1">Enable <ChevronRight size={14} /></button>
          </div>
        </div>
      </Section>

      {/* API Key */}
      <Section title="API Access" icon={Key}>
        <div className="bg-black/30 border border-white/10 rounded-lg p-4 flex items-center justify-between gap-4 mb-4">
          <code className="text-xs text-acid font-mono">sk-pharma-••••••••••••••••••••••••••••••••••</code>
          <div className="flex gap-2 shrink-0">
            <button className="text-[11px] font-bold text-white/50 hover:text-white transition-colors">Reveal</button>
            <span className="text-white/15">|</span>
            <button className="text-[11px] font-bold text-danger/80 hover:text-danger transition-colors">Revoke</button>
          </div>
        </div>
        <button className="text-xs font-bold text-acid hover:underline flex items-center gap-1">Generate New Key <ChevronRight size={14} /></button>
      </Section>
    </div>
  );
};

export default SettingsView;

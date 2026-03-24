import React, { useState, useEffect, useMemo } from 'react';
import { LogOut, Settings as SettingsIcon, User, Building, Shield, Save, CheckCircle } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useUiStore } from '../../stores/uiStore';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '../../routes/paths';
import api from '../../lib/axios';
import Skeleton from '../../components/ui/Skeleton';

const SettingsPage = () => {
  // Use selectors for better stability and performance
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const fetchMe = useAuthStore((s) => s.fetchMe);
  
  const addToast = useUiStore((s) => s.addToast);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingTenant, setIsLoadingTenant] = useState(false);

  // Profile Form State
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: 'Member'
  });

  // Tenant Form State
  const [tenant, setTenant] = useState({
    name: '',
    id: ''
  });

  // Sync state with user object
  useEffect(() => {
    if (user) {
      setProfile({
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        email: user.email || '',
        role: user.role || 'Member'
      });
      
      if (user.tenant_id) {
        setTenant(prev => ({ ...prev, id: user.tenant_id }));
        fetchTenant(user.tenant_id);
      }
    }
  }, [user]);

  const fetchTenant = async (tenantId) => {
    try {
      setIsLoadingTenant(true);
      const { data } = await api.get(`/tenants/${tenantId}`);
      setTenant({
        name: data.name || '',
        id: data.id || tenantId
      });
    } catch (err) {
      console.error('Failed to fetch tenant:', err);
      // Fail silently to the user, just use a placeholder
      setTenant(prev => ({ ...prev, name: 'Your Pharmacy' }));
    } finally {
      setIsLoadingTenant(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (isSaving) return;
    
    try {
      setIsSaving(true);
      await api.put('/users/me', {
        first_name: profile.firstName,
        last_name: profile.lastName
      });
      await fetchMe();
      addToast({ type: 'success', message: 'Profile updated successfully!' });
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to update profile.';
      addToast({ type: 'error', message: typeof msg === 'string' ? msg : 'Update failed.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateTenant = async (e) => {
    e.preventDefault();
    if (isSaving || !tenant.id) return;
    
    try {
      setIsSaving(true);
      await api.put(`/tenants/${tenant.id}`, {
        name: tenant.name
      });
      addToast({ type: 'success', message: 'Organization settings updated!' });
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to update organization.';
      addToast({ type: 'error', message: typeof msg === 'string' ? msg : 'Update failed.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate(PATHS.login, { replace: true });
  };

  const userRole = useMemo(() => String(user?.role || '').toUpperCase(), [user?.role]);
  const isAdmin = userRole === 'ADMIN' || userRole === 'MANAGER';

  // Defensive render if user is not loaded yet
  if (!user) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-6 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6 border border-white/10">
          <Shield size={40} className="text-white/20" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Authentication Required</h2>
        <p className="text-white/40 max-w-sm mb-8">
          You are currently in guest mode. Please log in to your account to view and manage your profile and organization settings.
        </p>
        <button
          onClick={() => navigate(PATHS.login)}
          className="bg-acid text-void px-8 py-3 rounded-xl font-bold hover:brightness-110 transition-all active:scale-[0.98]"
        >
          Sign In to CherriPlus
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-6 pb-24" key={user.id}>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Account & Settings</h1>
          <p className="text-white/40 text-sm">Manage your profile, organization, and preferences.</p>
        </div>
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/5 self-start">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'profile' ? 'bg-acid text-void shadow-lg' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
          >
            <User size={14} /> Profile
          </button>
          <button
            onClick={() => setActiveTab('organization')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'organization' ? 'bg-acid text-void shadow-lg' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
          >
            <Building size={14} /> Organization
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8">
        <div className="space-y-6">
          {activeTab === 'profile' ? (
            <div className="bg-[#161618] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
              <div className="p-8 border-b border-white/5 bg-gradient-to-r from-white/5 to-transparent">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-white/5 text-white/60"><User size={20} /></div>
                  <h3 className="text-lg font-bold text-white">Profile Information</h3>
                </div>
                <p className="text-sm text-white/40">Update your personal details and how others see you.</p>
              </div>
              
              <form onSubmit={handleUpdateProfile} className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest pl-1">First Name</label>
                    <input
                      type="text"
                      value={profile.firstName}
                      onChange={e => setProfile({...profile, firstName: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-acid/40 transition-all font-medium"
                      placeholder="Enter first name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest pl-1">Last Name</label>
                    <input
                      type="text"
                      value={profile.lastName}
                      onChange={e => setProfile({...profile, lastName: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-acid/40 transition-all font-medium"
                      placeholder="Enter last name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest pl-1">Email Address</label>
                  <input
                    type="email"
                    value={profile.email}
                    disabled
                    className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3 text-sm text-white/40 cursor-not-allowed font-medium"
                  />
                  <p className="text-[10px] text-white/20 mt-1 pl-1 italic">Email cannot be changed manually.</p>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex items-center gap-2 bg-acid text-void hover:brightness-110 px-8 py-3 rounded-xl font-bold text-sm transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_20px_rgba(232,245,50,0.15)]"
                  >
                    {isSaving ? 'Saving...' : <><Save size={16} /> Save Changes</>}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="bg-[#161618] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
              <div className="p-8 border-b border-white/5 bg-gradient-to-r from-white/5 to-transparent">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-white/5 text-white/60"><Building size={20} /></div>
                  <h3 className="text-lg font-bold text-white">Organization Settings</h3>
                </div>
                <p className="text-sm text-white/40">Manage your pharmacy or workspace identity.</p>
              </div>
              
              <form onSubmit={handleUpdateTenant} className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest pl-1">Pharmacy Name</label>
                  {isLoadingTenant ? (
                    <Skeleton h="44px" className="w-full rounded-xl" />
                  ) : (
                    <input
                      type="text"
                      value={tenant.name}
                      onChange={e => setTenant({...tenant, name: e.target.value})}
                      disabled={!isAdmin}
                      className={`w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-acid/40 transition-all font-medium ${!isAdmin ? 'opacity-50 cursor-not-allowed' : ''}`}
                      placeholder="e.g., Apollo Pharmacy"
                    />
                  )}
                  {!isAdmin && <p className="text-[10px] text-danger/60 mt-1 pl-1">Only Administrators can edit organization details.</p>}
                </div>

                {isAdmin && (
                  <div className="pt-4 flex justify-end">
                    <button
                      type="submit"
                      disabled={isSaving || isLoadingTenant}
                      className="flex items-center gap-2 bg-acid text-void hover:brightness-110 px-8 py-3 rounded-xl font-bold text-sm transition-all active:scale-[0.98] disabled:opacity-50 shadow-[0_4px_20px_rgba(232,245,50,0.15)]"
                    >
                      {isSaving ? 'Saving...' : <><Save size={16} /> Update Workspace</>}
                    </button>
                  </div>
                )}
              </form>
            </div>
          )}
        </div>

        <div className="space-y-6">
          {/* Quick Info / Security */}
          <div className="bg-[#161618] border border-white/5 rounded-2xl p-6 space-y-6">
             <div className="space-y-4">
               <div className="flex items-center gap-2 text-white/60 mb-2">
                 <Shield size={16} className="text-acid" />
                 <span className="text-[10px] uppercase font-bold tracking-widest">Account Status</span>
               </div>
               <div className="bg-white/5 rounded-xl p-4 flex items-center justify-between">
                 <div>
                   <p className="text-[10px] text-white/30 uppercase font-bold tracking-widest">Role</p>
                   <p className="text-xs font-bold text-white mt-1 uppercase tracking-wide">{profile.role}</p>
                 </div>
                 <div className="bg-success/20 text-success p-1 rounded">
                   <CheckCircle size={16} />
                 </div>
               </div>
               <div className="bg-white/5 rounded-xl p-4">
                 <p className="text-[10px] text-white/30 uppercase font-bold tracking-widest">Verified</p>
                 <p className="text-xs font-bold text-white mt-1">Yes, identity confirmed</p>
               </div>
             </div>

             <div className="pt-4 border-t border-white/5">
               <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-danger/20 text-danger hover:bg-danger hover:text-white transition-all text-xs font-bold active:scale-[0.98]"
               >
                 <LogOut size={16} /> Sign Out
               </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

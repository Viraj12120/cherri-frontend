import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Shield, Mail, MoreVertical, Search, Edit3, Trash2, CheckCircle, XCircle } from 'lucide-react';
import api from '../../lib/axios';
import { useUiStore } from '../../stores/uiStore';
import Skeleton from '../../components/ui/Skeleton';
import StatusBadge from '../../components/ui/StatusBadge';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const addToast = useUiStore(s => s.addToast);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.get('/users');
      setUsers(Array.isArray(data) ? data : data.items || []);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      // Fallback to mock if API fails for demo
      setUsers([
        { id: 1, first_name: 'Viraj', last_name: 'Disale', email: 'viraj@cherriplus.local', role: 'admin', is_active: true },
        { id: 2, first_name: 'John', last_name: 'Doe', email: 'john@pharma.com', role: 'manager', is_active: true },
        { id: 3, first_name: 'Sarah', last_name: 'Smith', email: 'sarah@pharma.com', role: 'staff', is_active: false },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = users.filter(u => 
    `${u.first_name} ${u.last_name} ${u.email}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto py-8 px-6 pb-24">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <div className="flex items-center gap-3 mb-1">
             <Users className="text-acid" size={24} />
             <h1 className="text-2xl font-bold text-white tracking-tight">Team Management</h1>
          </div>
          <p className="text-white/40 text-sm">Manage user roles, permissions, and invite new team members.</p>
        </div>
        
        <button className="bg-acid text-void px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:brightness-110 transition-all active:scale-95 shadow-[0_4px_20px_rgba(232,245,50,0.15)]">
           <UserPlus size={18} /> Invite Member
        </button>
      </div>

      <div className="bg-[#161618] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-white/5 bg-white/[0.02]">
           <div className="relative max-w-sm">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={16} />
              <input 
                type="text" 
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-acid/40 transition-all"
              />
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-[10px] uppercase font-bold tracking-widest text-white/30 border-b border-white/5">
                <th className="text-left py-5 px-6 font-bold">User</th>
                <th className="text-left py-5 px-6 font-bold">Role</th>
                <th className="text-left py-5 px-6 font-bold">Status</th>
                <th className="text-left py-5 px-6 font-bold">Joined</th>
                <th className="text-right py-5 px-6 font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}><td colSpan="5" className="p-6"><Skeleton h="40px" className="w-full" /></td></tr>
                ))
              ) : filteredUsers.map((user) => (
                <tr key={user.id} className="group hover:bg-white/[0.01] transition-colors">
                  <td className="py-5 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-acid/10 to-acid/30 flex items-center justify-center border border-white/5 text-acid font-bold text-xs">
                        {user.first_name[0]}{user.last_name[0]}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white group-hover:text-acid transition-colors">
                          {user.first_name} {user.last_name}
                        </p>
                        <p className="text-[11px] text-white/30 flex items-center gap-1.5 mt-0.5">
                          <Mail size={10} /> {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-5 px-6">
                    <div className="flex items-center gap-2">
                       <Shield size={12} className={user.role === 'admin' ? 'text-acid' : 'text-white/30'} />
                       <span className={`text-[11px] font-bold uppercase tracking-wider ${user.role === 'admin' ? 'text-white' : 'text-white/60'}`}>
                         {user.role}
                       </span>
                    </div>
                  </td>
                  <td className="py-5 px-6">
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${user.is_active ? 'bg-success shadow-[0_0_8px_rgba(34,197,94,0.4)]' : 'bg-danger'}`} />
                      <span className="text-[11px] font-bold text-white/50">{user.is_active ? 'Active' : 'Deactivated'}</span>
                    </div>
                  </td>
                  <td className="py-5 px-6">
                    <p className="text-xs text-white/40 font-medium">Mar 12, 2024</p>
                  </td>
                  <td className="py-5 px-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button className="p-2 hover:bg-white/5 rounded-lg text-white/40 hover:text-white transition-all">
                          <Edit3 size={14} />
                       </button>
                       <button className="p-2 hover:bg-danger/10 rounded-lg text-white/40 hover:text-danger transition-all">
                          <Trash2 size={14} />
                       </button>
                       <button className="p-2 hover:bg-white/5 rounded-lg text-white/40 transition-all">
                          <MoreVertical size={14} />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {!isLoading && filteredUsers.length === 0 && (
            <div className="p-20 text-center">
               <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 border border-white/5">
                  <Users size={32} className="text-white/10" />
               </div>
               <h3 className="text-white font-bold mb-1">No members found</h3>
               <p className="text-white/30 text-xs">Try adjusting your search terms.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UsersPage;

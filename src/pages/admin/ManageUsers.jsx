import { useEffect, useState } from 'react';
import { useLaundryStore } from '../../store/useLaundryStore';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import EmptyState from '../../components/common/EmptyState';
import { Search, ShieldAlert, Award, Calendar, Phone, Mail } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function ManageUsers() {
  const { users, fetchAdminUsers, updateUserRole, loading } = useLaundryStore();
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchAdminUsers();
  }, [fetchAdminUsers]);

  const handleRoleToggle = async (userRecord) => {
    const nextRole = userRecord.role === 'admin' ? 'user' : 'admin';
    const res = await updateUserRole(userRecord.id, nextRole);
    if (res.success) {
      fetchAdminUsers();
    }
  };

  const filteredUsers = users.filter((usr) => {
    const searchLower = search.toLowerCase();
    const fullName = usr.full_name || '';
    const email = usr.email || '';
    const phone = usr.phone || '';
    return (
      fullName.toLowerCase().includes(searchLower) ||
      email.toLowerCase().includes(searchLower) ||
      phone.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="pt-28 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 min-h-screen">
      {/* Header */}
      <div className="flex flex-col gap-2 max-w-xl">
        <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
          Platform Accounts
        </span>
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
          Manage Customer Directory
        </h1>
        <p className="text-slate-500 text-sm">
          Review customer contact details, profile creation dates, and elevate permissions or toggle administrative access roles.
        </p>
      </div>

      {/* Toolbar filters */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-3xl border border-slate-100 shadow-premium">
        <div className="relative w-full md:max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search by full name, email address, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 text-sm transition-all"
          />
        </div>
      </div>

      {/* Users table */}
      {loading && users.length === 0 ? (
        <SkeletonLoader type="table" count={3} />
      ) : filteredUsers.length > 0 ? (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-premium overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-semibold text-slate-500">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-[10px] uppercase font-bold text-slate-400">
                  <th className="p-4 pl-6">Customer Profile</th>
                  <th className="p-4">Contact Info</th>
                  <th className="p-4">Delivery Address</th>
                  <th className="p-4">Join Date</th>
                  <th className="p-4">Permissions Role</th>
                  <th className="p-4 text-right pr-6">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((usr) => (
                  <tr key={usr.id} className="hover:bg-slate-50/20 transition-colors">
                    {/* User profile details */}
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-100 to-green-200 text-emerald-700 font-extrabold text-sm flex items-center justify-center border border-emerald-200 overflow-hidden shrink-0">
                          {usr.avatar_url ? (
                            <img src={usr.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                          ) : (
                            <span>{usr.full_name?.charAt(0).toUpperCase() || 'U'}</span>
                          )}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-bold text-slate-800">{usr.full_name || 'Customer'}</span>
                          <span className="text-[10px] text-slate-400 font-medium truncate mt-0.5">{usr.email}</span>
                        </div>
                      </div>
                    </td>

                    {/* Contact Info */}
                    <td className="p-4 space-y-1">
                      <p className="flex items-center gap-1.5 text-slate-600 font-medium">
                        <Phone size={13} className="text-slate-400" />
                        {usr.phone || 'No phone'}
                      </p>
                      <p className="flex items-center gap-1.5 text-slate-400 text-[10px] font-semibold">
                        <Mail size={13} />
                        {usr.email}
                      </p>
                    </td>

                    {/* Default Address */}
                    <td className="p-4 max-w-[200px] truncate text-slate-500 font-medium">
                      {usr.address || 'No address set'}
                    </td>

                    {/* Join Date */}
                    <td className="p-4 font-semibold text-slate-500">
                      {new Date(usr.created_at).toLocaleDateString()}
                    </td>

                    {/* Permissions Role */}
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        usr.role === 'admin'
                          ? 'bg-rose-50 text-rose-700 border-rose-100'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}>
                        {usr.role === 'admin' && <ShieldAlert size={10} />}
                        {usr.role.toUpperCase()}
                      </span>
                    </td>

                    {/* Toggle action button */}
                    <td className="p-4 text-right pr-6">
                      <button
                        onClick={() => handleRoleToggle(usr)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[11px] font-bold transition-colors ${
                          usr.role === 'admin'
                            ? 'border-slate-200 text-slate-600 hover:bg-slate-50'
                            : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'
                        }`}
                      >
                        <Award size={13} />
                        {usr.role === 'admin' ? 'Revoke Admin' : 'Make Admin'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState
          title="No users match search"
          description="Try modifying your keyword query to find specific accounts."
          actionText="Reset Search"
          onAction={() => setSearch('')}
        />
      )}
    </div>
  );
}

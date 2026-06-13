import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLaundryStore } from '../../store/useLaundryStore';
import DashboardCards from '../../components/dashboard/DashboardCards';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import EmptyState from '../../components/common/EmptyState';
import { ShoppingBag, Users, Loader, IndianRupee, Calendar, Clock, RefreshCw, ArrowRight } from 'lucide-react';

export default function AdminDashboard() {
  const {
    adminOrders,
    users,
    fetchAdminOrders,
    fetchAdminUsers,
    subscribeToOrders,
    unsubscribeAll,
    loading
  } = useLaundryStore();

  useEffect(() => {
    fetchAdminOrders();
    fetchAdminUsers();
    // Subscribe to realtime orders for administration feeds
    subscribeToOrders(null, true);
    
    return () => {
      unsubscribeAll();
    };
  }, [fetchAdminOrders, fetchAdminUsers, subscribeToOrders, unsubscribeAll]);

  // Compute administrator counters
  const totalOrders = adminOrders.length;
  const pendingOrders = adminOrders.filter((o) => o.status === 'pending').length;
  const activeProcessing = adminOrders.filter((o) => 
    ['confirmed', 'picked_up', 'washing', 'ironing', 'out_for_delivery'].includes(o.status)
  ).length;
  
  // Total earnings count (only paid orders or delivered orders)
  const totalRevenue = adminOrders
    .filter((o) => o.payment_status === 'paid' || o.status === 'delivered')
    .reduce((acc, curr) => acc + curr.total_price, 0);

  const recentOrders = adminOrders.slice(0, 5);
  const recentUsers = users.slice(0, 5);

  return (
    <div className="pt-28 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 min-h-screen">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
            Administration Hub
          </span>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
            Platform Overview
          </h1>
        </div>
        
        {/* Realtime synced indicator tag */}
        <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
          Realtime Feed Synced
        </span>
      </div>

      {/* 1. ADMINISTRATIVE STATS CARDS */}
      {loading && adminOrders.length === 0 ? (
        <SkeletonLoader type="dashboard" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <DashboardCards
            title="Total Bookings"
            value={totalOrders}
            icon={ShoppingBag}
            color="emerald"
            description="Lifetime bookings ordered"
          />
          <DashboardCards
            title="Total Customers"
            value={users.length}
            icon={Users}
            color="blue"
            description="Registered user profiles"
          />
          <DashboardCards
            title="Under Processing"
            value={activeProcessing}
            icon={Loader}
            color="amber"
            description="Active wash & iron queues"
          />
          <DashboardCards
            title="Settled Revenue"
            value={`₹${totalRevenue.toFixed(2)}`}
            icon={IndianRupee}
            color="purple"
            description="Completed / Paid transactions"
          />
        </div>
      )}

      {/* 2. RECENT ACTIVITY LISTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders log list */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-800">Recent Order Submissions</h3>
            <Link to="/admin/orders" className="text-xs font-bold text-emerald-500 hover:text-emerald-600">
              Manage Orders Board →
            </Link>
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 shadow-premium overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs font-medium text-slate-500">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50 text-[10px] uppercase font-bold text-slate-400">
                    <th className="p-4 pl-6">Order ID</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Service</th>
                    <th className="p-4">Est Return</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4 text-right pr-6">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {recentOrders.length > 0 ? (
                    recentOrders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-slate-50/30 transition-colors">
                        <td className="p-4 pl-6 font-bold text-slate-700">
                          #{ord.id.substring(0, 8).toUpperCase()}
                        </td>
                        <td className="p-4">
                          <div className="flex flex-col">
                            <span className="font-semibold text-slate-800">{ord.profiles?.full_name || 'User'}</span>
                            <span className="text-[10px] text-slate-400 mt-0.5">{ord.profiles?.email}</span>
                          </div>
                        </td>
                        <td className="p-4 font-semibold text-slate-800">
                          {ord.services?.title || 'laundry'}
                        </td>
                        <td className="p-4 font-semibold text-slate-600">
                          {new Date(ord.dropoff_date).toLocaleDateString()}
                        </td>
                        <td className="p-4 font-bold text-slate-800">
                          ₹{ord.total_price.toFixed(2)}
                        </td>
                        <td className="p-4 text-right pr-6">
                          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            ord.status === 'delivered'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                              : ord.status === 'cancelled'
                              ? 'bg-rose-50 text-rose-700 border-rose-100'
                              : 'bg-amber-50 text-amber-700 border-amber-100'
                          }`}>
                            {ord.status.toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center p-8 text-slate-400">
                        No orders recorded.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Recent users column */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-800 font-sans">New Customer Signups</h3>
            <Link to="/admin/users" className="text-xs font-bold text-emerald-500 hover:text-emerald-600">
              Manage Users →
            </Link>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-slate-100 divide-y divide-slate-100">
            {recentUsers.length > 0 ? (
              recentUsers.map((usr) => (
                <div key={usr.id} className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-100 to-green-200 text-emerald-700 font-extrabold text-sm flex items-center justify-center border border-emerald-200 overflow-hidden shrink-0">
                      {usr.avatar_url ? (
                        <img src={usr.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <span>{usr.full_name?.charAt(0).toUpperCase() || 'U'}</span>
                      )}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-bold text-slate-800 truncate">{usr.full_name || 'Customer'}</span>
                      <span className="text-[10px] text-slate-400 truncate mt-0.5">{usr.email}</span>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    usr.role === 'admin'
                      ? 'bg-rose-50 text-rose-700 border-rose-100'
                      : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}>
                    {usr.role.toUpperCase()}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-center py-6 text-xs text-slate-400 font-semibold">No registered users yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

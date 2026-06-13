import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { useLaundryStore } from '../../store/useLaundryStore';
import { useModalStore } from '../../store/useModalStore';
import DashboardCards from '../../components/dashboard/DashboardCards';
import OrderCard from '../../components/dashboard/OrderCard';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import EmptyState from '../../components/common/EmptyState';
import { ShoppingBag, Loader, CheckCircle, IndianRupee, Calendar, Bell } from 'lucide-react';

export default function UserDashboard() {
  const { user, profile } = useAuthStore();
  const {
    orders,
    notifications,
    fetchUserOrders,
    fetchNotifications,
    markNotificationRead,
    markAllNotificationsRead,
    subscribeToOrders,
    subscribeToNotifications,
    unsubscribeAll,
    loading
  } = useLaundryStore();
  const { openBooking } = useModalStore();

  useEffect(() => {
    if (user?.id) {
      fetchUserOrders(user.id);
      fetchNotifications(user.id);
      subscribeToOrders(user.id, false);
      subscribeToNotifications(user.id);
    }
    return () => {
      unsubscribeAll();
    };
  }, [user, fetchUserOrders, fetchNotifications, subscribeToOrders, subscribeToNotifications, unsubscribeAll]);

  // Compute stat figures
  const totalOrdersCount = orders.length;
  const pendingOrdersCount = orders.filter((o) => o.status === 'pending' || o.status === 'confirmed').length;
  const inProgressCount = orders.filter(
    (o) => ['picked_up', 'washing', 'ironing', 'out_for_delivery'].includes(o.status)
  ).length;
  const totalSpent = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((acc, curr) => acc + curr.total_price, 0);

  const recentOrders = orders.slice(0, 3);
  const recentNotifications = notifications.slice(0, 4);

  return (
    <div className="pt-28 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 min-h-screen">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-emerald-500 to-green-600 p-8 rounded-3xl text-white shadow-lg relative overflow-hidden">
        {/* Decorative blur ball */}
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-2xl" />
        <div className="relative z-10 flex flex-col gap-1.5">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Hello, {profile?.full_name || 'Valued Customer'}!
          </h1>
          <p className="text-emerald-50 text-sm max-w-md font-medium">
            Get your laundry done hassle-free today. Pick from our laundry treatments catalog and schedule a pickup.
          </p>
        </div>
        <Link
          to="/services"
          className="relative z-10 px-6 py-3 bg-white text-emerald-600 hover:bg-emerald-50 rounded-2xl text-sm font-bold shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          Book a New Service
        </Link>
      </div>

      {/* 2. STATS BOARD */}
      {loading && orders.length === 0 ? (
        <SkeletonLoader type="dashboard" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <DashboardCards
            title="Total Bookings"
            value={totalOrdersCount}
            icon={ShoppingBag}
            color="emerald"
            description="Lifetime orders placed"
          />
          <DashboardCards
            title="Pending Pickups"
            value={pendingOrdersCount}
            icon={Calendar}
            color="amber"
            description="Awaiting runner pick up"
          />
          <DashboardCards
            title="In Wash / Delivery"
            value={inProgressCount}
            icon={Loader}
            color="blue"
            description="Clothes currently processing"
          />
          <DashboardCards
            title="Total Invested"
            value={`₹${totalSpent.toFixed(2)}`}
            icon={IndianRupee}
            color="purple"
            description="Excludes cancelled bookings"
          />
        </div>
      )}

      {/* 3. DETAILED LISTS (RECENT ORDERS & EMAILS LOG) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left 2 Columns - Recent Orders */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-800">Recent Orders</h3>
            {orders.length > 0 && (
              <Link to="/orders" className="text-xs font-bold text-emerald-500 hover:text-emerald-600">
                View All Orders →
              </Link>
            )}
          </div>

          {loading && orders.length === 0 ? (
            <SkeletonLoader type="table" count={2} />
          ) : recentOrders.length > 0 ? (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No bookings placed yet"
              description="You have not scheduled any pickups. Take a look at our services and book your first laundry process."
              actionText="View Services"
              onAction={() => openBooking()} // will trigger services redirection or booking modal
            />
          )}
        </div>

        {/* Right 1 Column - Email Log */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Bell size={18} className="text-emerald-500" />
              Notifications
            </h3>
            {notifications.some((n) => !n.read) && (
              <button
                onClick={() => user?.id && markAllNotificationsRead(user.id)}
                className="text-xs font-bold text-emerald-500 hover:text-emerald-600"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="glass-card rounded-2xl p-5 border border-slate-100 space-y-4 max-h-[420px] overflow-y-auto">
            {recentNotifications.length > 0 ? (
              <div className="space-y-3.5">
                {recentNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => !notif.read && markNotificationRead(notif.id)}
                    className={`p-3.5 rounded-xl border transition-colors cursor-pointer ${
                      notif.read ? 'bg-slate-50/50 border-slate-100' : 'bg-emerald-50/20 border-emerald-100 hover:bg-emerald-50/40'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                        {notif.type.replace('_', ' ').toUpperCase()}
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold">
                        {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <h5 className="text-xs font-bold text-slate-800 mt-1.5 leading-snug">
                      {notif.subject}
                    </h5>
                    <p className="text-[11px] text-slate-500 mt-1 whitespace-pre-line leading-relaxed line-clamp-3">
                      {notif.body}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400">
                <p className="text-xs font-semibold">No emails sent yet.</p>
                <p className="text-[10px] text-slate-400 mt-1">Actions like bookings trigger notifications.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

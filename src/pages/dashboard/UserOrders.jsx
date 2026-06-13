import { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { useLaundryStore } from '../../store/useLaundryStore';
import OrderCard from '../../components/dashboard/OrderCard';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import EmptyState from '../../components/common/EmptyState';
import { Search, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';

export default function UserOrders() {
  const { user } = useAuthStore();
  const { orders, fetchUserOrders, subscribeToOrders, unsubscribeAll, loading } = useLaundryStore();
  
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'pending' | 'processing' | 'completed' | 'cancelled'
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    if (user?.id) {
      fetchUserOrders(user.id);
      subscribeToOrders(user.id, false);
    }
    return () => {
      unsubscribeAll();
    };
  }, [user, fetchUserOrders, subscribeToOrders, unsubscribeAll]);

  // Reset pagination on filter updates
  useEffect(() => {
    setCurrentPage(1);
  }, [search, activeTab]);

  const getFilteredOrders = () => {
    return orders.filter((o) => {
      // 1. Search filter
      const serviceTitle = o.services?.title || '';
      const matchesSearch = serviceTitle.toLowerCase().includes(search.toLowerCase()) || o.id.toLowerCase().includes(search.toLowerCase());

      // 2. Status tab filter
      if (!matchesSearch) return false;
      if (activeTab === 'all') return true;
      if (activeTab === 'pending') return ['pending', 'confirmed'].includes(o.status);
      if (activeTab === 'processing') return ['picked_up', 'washing', 'ironing', 'out_for_delivery'].includes(o.status);
      if (activeTab === 'completed') return o.status === 'delivered';
      if (activeTab === 'cancelled') return o.status === 'cancelled';
      return true;
    });
  };

  const filteredOrders = getFilteredOrders();

  // Pagination calculation
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

  const tabs = [
    { id: 'all', label: 'All Orders' },
    { id: 'pending', label: 'Pending' },
    { id: 'processing', label: 'In Wash / Transit' },
    { id: 'completed', label: 'Delivered' },
    { id: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <div className="pt-28 pb-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 min-h-screen">
      {/* Header */}
      <div className="flex flex-col gap-2 max-w-xl">
        <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
          Garment Logs
        </span>
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
          My Laundry History
        </h1>
        <p className="text-slate-500 text-sm">
          Track active collections, review processing stages, and view invoices of completed washes.
        </p>
      </div>

      {/* Toolbar filters */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl border border-slate-100 shadow-premium">
        {/* Search */}
        <div className="relative w-full md:max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search by order ID or service name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 text-sm transition-all"
          />
        </div>

        {/* Tab List */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border shrink-0 ${
                activeTab === tab.id
                  ? 'bg-emerald-550 border-emerald-500 bg-emerald-500 text-white shadow-sm'
                  : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders items list */}
      {loading && orders.length === 0 ? (
        <SkeletonLoader type="table" count={3} />
      ) : paginatedOrders.length > 0 ? (
        <div className="space-y-4">
          {paginatedOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}

          {/* Pagination Toolbar */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-6 border-t border-slate-100 mt-6">
              <span className="text-xs font-bold text-slate-400">
                Page {currentPage} of {totalPages} ({filteredOrders.length} bookings)
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <EmptyState
          title="No orders found"
          description="We couldn't find any orders matching your selected filters."
          actionText="Clear Filters"
          onAction={() => {
            setSearch('');
            setActiveTab('all');
          }}
        />
      )}
    </div>
  );
}

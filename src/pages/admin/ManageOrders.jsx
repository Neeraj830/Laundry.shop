import { useEffect, useState } from 'react';
import { useLaundryStore } from '../../store/useLaundryStore';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import EmptyState from '../../components/common/EmptyState';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import FormInput from '../../components/common/FormInput';
import { Search, ChevronDown, User, Calendar, Layers, MapPin, IndianRupee, ArrowUpDown } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function ManageOrders() {
  const { adminOrders, fetchAdminOrders, updateOrderStatus, updateOrderDates, subscribeToOrders, unsubscribeAll, loading } = useLaundryStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');

  // Rescheduling states
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [selectedRescheduleOrder, setSelectedRescheduleOrder] = useState(null);
  const [newPickupDate, setNewPickupDate] = useState('');
  const [newDropoffDate, setNewDropoffDate] = useState('');
  const [rescheduleReason, setRescheduleReason] = useState('');
  const [rescheduleLoading, setRescheduleLoading] = useState(false);

  const openRescheduleModal = (order) => {
    setSelectedRescheduleOrder(order);
    setNewPickupDate(new Date(order.pickup_date).toISOString().split('T')[0]);
    setNewDropoffDate(new Date(order.dropoff_date).toISOString().split('T')[0]);
    setRescheduleReason('');
    setRescheduleModalOpen(true);
  };

  const handleRescheduleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRescheduleOrder) return;
    if (!rescheduleReason.trim()) {
      toast.error('Please enter a reason for rescheduling');
      return;
    }

    setRescheduleLoading(true);
    try {
      const userEmail = selectedRescheduleOrder.profiles?.email;
      const userName = selectedRescheduleOrder.profiles?.full_name || 'Customer';
      const userId = selectedRescheduleOrder.user_id;

      const res = await updateOrderDates(
        selectedRescheduleOrder.id,
        new Date(newPickupDate).toISOString(),
        new Date(newDropoffDate).toISOString(),
        rescheduleReason,
        userEmail,
        userName,
        userId
      );

      if (res.success) {
        setRescheduleModalOpen(false);
        fetchAdminOrders();
      }
    } finally {
      setRescheduleLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminOrders();
    // Subscribe to realtime orders for admin updates
    subscribeToOrders(null, true);
    
    return () => {
      unsubscribeAll();
    };
  }, [fetchAdminOrders, subscribeToOrders, unsubscribeAll]);

  const handleStatusChange = async (order, newStatus) => {
    const userEmail = order.profiles?.email;
    const userName = order.profiles?.full_name || 'Customer';
    const userId = order.user_id;

    const res = await updateOrderStatus(order.id, newStatus, null, userEmail, userName, userId);
    if (res.success) {
      fetchAdminOrders();
    }
  };

  const handlePaymentStatusChange = async (order, newPaymentStatus) => {
    const userEmail = order.profiles?.email;
    const userName = order.profiles?.full_name || 'Customer';
    const userId = order.user_id;

    // Use current order status
    const res = await updateOrderStatus(order.id, order.status, newPaymentStatus, userEmail, userName, userId);
    if (res.success) {
      fetchAdminOrders();
    }
  };

  const filteredOrders = adminOrders.filter((ord) => {
    const searchLower = search.toLowerCase();
    const serviceTitle = ord.services?.title || '';
    const userName = ord.profiles?.full_name || '';
    const userEmail = ord.profiles?.email || '';
    const matchesSearch =
      serviceTitle.toLowerCase().includes(searchLower) ||
      userName.toLowerCase().includes(searchLower) ||
      userEmail.toLowerCase().includes(searchLower) ||
      ord.id.toLowerCase().includes(searchLower);

    const matchesStatus = statusFilter === 'all' || ord.status === statusFilter;
    const matchesPayment = paymentFilter === 'all' || ord.payment_status === paymentFilter;

    return matchesSearch && matchesStatus && matchesPayment;
  });

  const orderStatuses = [
    'pending',
    'confirmed',
    'picked_up',
    'washing',
    'ironing',
    'out_for_delivery',
    'delivered',
    'cancelled',
  ];

  const paymentStatuses = ['pending', 'paid', 'refunded'];

  return (
    <div className="pt-28 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 min-h-screen">
      {/* Header */}
      <div className="flex flex-col gap-2 max-w-xl">
        <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
          Platform Orders
        </span>
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
          Manage Customer Bookings
        </h1>
        <p className="text-slate-500 text-sm">
          Update laundry progress, adjust billing payment attributes, and track delivery timelines in real-time.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-4 rounded-3xl border border-slate-100 shadow-premium">
        {/* Search */}
        <div className="relative md:col-span-2">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search by order ID, customer name, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 text-sm transition-all"
          />
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-500 font-semibold text-slate-600 bg-white"
        >
          <option value="all">All Laundry Statuses</option>
          {orderStatuses.map((st) => (
            <option key={st} value={st}>
              {st.replace('_', ' ').toUpperCase()}
            </option>
          ))}
        </select>

        {/* Payment Filter */}
        <select
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value)}
          className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-500 font-semibold text-slate-600 bg-white"
        >
          <option value="all">All Payment Statuses</option>
          {paymentStatuses.map((ps) => (
            <option key={ps} value={ps}>
              {ps.toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      {/* Main Table Board */}
      {loading && adminOrders.length === 0 ? (
        <SkeletonLoader type="table" count={3} />
      ) : filteredOrders.length > 0 ? (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-premium overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-semibold text-slate-500">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-[10px] uppercase font-bold text-slate-400">
                  <th className="p-4 pl-6">ID & Date</th>
                  <th className="p-4">Customer Details</th>
                  <th className="p-4">Service Details</th>
                  <th className="p-4">Totals</th>
                  <th className="p-4">Process Status</th>
                  <th className="p-4 text-right pr-6">Payment Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50/20 transition-colors">
                    {/* ID & Date */}
                    <td className="p-4 pl-6 space-y-1">
                      <span className="font-extrabold text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[10px]">
                        #{ord.id.substring(0, 8).toUpperCase()}
                      </span>
                      <p className="text-[10px] text-slate-400 font-medium pt-1">
                        Placed: {new Date(ord.created_at).toLocaleDateString()}
                      </p>
                    </td>

                    {/* Customer */}
                    <td className="p-4 space-y-1">
                      <span className="font-bold text-slate-800">{ord.profiles?.full_name || 'Customer'}</span>
                      <p className="text-[10px] text-slate-400 font-semibold">{ord.profiles?.email}</p>
                      <p className="text-[10px] text-slate-400 font-semibold">{ord.profiles?.phone || 'No phone'}</p>
                    </td>

                    {/* Service & Delivery */}
                    <td className="p-4 space-y-1 max-w-[200px]">
                      <span className="font-bold text-slate-800">{ord.services?.title || 'Laundry'}</span>
                      <p className="text-[10px] text-slate-400 truncate">
                        Pickup Address: {ord.pickup_address}
                      </p>
                      <div className="flex flex-col text-[10px] text-slate-500 gap-0.5">
                        <span>Pickup: {new Date(ord.pickup_date).toLocaleDateString()}</span>
                        <span>Delivery: {new Date(ord.dropoff_date).toLocaleDateString()}</span>
                      </div>
                      <button
                        onClick={() => openRescheduleModal(ord)}
                        className="text-[10px] text-emerald-500 hover:text-emerald-600 font-bold block mt-1 hover:underline cursor-pointer"
                      >
                        Reschedule Dates
                      </button>
                    </td>

                    {/* Price & Quantity */}
                    <td className="p-4 space-y-0.5">
                      <span className="font-extrabold text-slate-800 block">₹{ord.total_price.toFixed(2)}</span>
                      <span className="text-[10px] text-slate-400 font-medium">Qty: {ord.quantity} item(s)</span>
                    </td>

                    {/* Status Dropdown selector */}
                    <td className="p-4">
                      <div className="flex flex-col gap-1">
                        <select
                          value={ord.status}
                          onChange={(e) => handleStatusChange(ord, e.target.value)}
                          className="border border-slate-200 rounded-lg px-2 py-1 text-[11px] font-bold text-slate-700 bg-white focus:outline-none focus:border-emerald-500 max-w-[140px]"
                        >
                          {orderStatuses.map((st) => (
                            <option key={st} value={st}>
                              {st.replace('_', ' ').toUpperCase()}
                            </option>
                          ))}
                        </select>
                        <StatusBadge status={ord.status} />
                      </div>
                    </td>

                    {/* Payment Dropdown selector */}
                    <td className="p-4 text-right pr-6">
                      <div className="flex flex-col items-end gap-1">
                        <select
                          value={ord.payment_status}
                          onChange={(e) => handlePaymentStatusChange(ord, e.target.value)}
                          className="border border-slate-200 rounded-lg px-2 py-1 text-[11px] font-bold text-slate-700 bg-white focus:outline-none focus:border-emerald-500 max-w-[110px]"
                        >
                          {paymentStatuses.map((ps) => (
                            <option key={ps} value={ps}>
                              {ps.toUpperCase()}
                            </option>
                          ))}
                        </select>
                        <StatusBadge status={ord.payment_status} type="payment" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState
          title="No bookings match criteria"
          description="Try resetting your filters or adjusting your keyword search."
          actionText="Clear Filters"
          onAction={() => {
            setSearch('');
            setStatusFilter('all');
            setPaymentFilter('all');
          }}
        />
      )}

      {/* Reschedule Modal */}
      <Modal
        isOpen={rescheduleModalOpen}
        onClose={() => setRescheduleModalOpen(false)}
        title="Reschedule Order Dates"
        size="md"
      >
        {selectedRescheduleOrder && (
          <form onSubmit={handleRescheduleSubmit} className="space-y-4 mt-2">
            <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-xl">
              <span className="text-[10px] font-bold text-emerald-600 uppercase block">Order ID</span>
              <span className="text-xs font-bold text-slate-700">#{selectedRescheduleOrder.id}</span>
            </div>
            
            <FormInput
              label="New Pickup Date"
              type="date"
              value={newPickupDate}
              onChange={(e) => setNewPickupDate(e.target.value)}
              required
            />

            <FormInput
              label="New Estimated Delivery Date"
              type="date"
              value={newDropoffDate}
              onChange={(e) => setNewDropoffDate(e.target.value)}
              required
            />

            <FormInput
              label="Reason for date change"
              placeholder="Why are we rescheduling this order?"
              textarea
              rows={3}
              value={rescheduleReason}
              onChange={(e) => setRescheduleReason(e.target.value)}
              required
            />

            <button
              type="submit"
              disabled={rescheduleLoading}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-100 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-75 transition-all mt-4"
            >
              {rescheduleLoading ? 'Saving changes...' : 'Save & Send Message'}
            </button>
          </form>
        )}
      </Modal>
    </div>
  );
}

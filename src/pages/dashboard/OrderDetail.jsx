import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { useLaundryStore } from '../../store/useLaundryStore';
import StatusBadge from '../../components/common/StatusBadge';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { ArrowLeft, Calendar, Layers, MapPin, Clipboard, CheckCircle, CreditCard, Trash2 } from 'lucide-react';
import { supabase } from '../../supabase/client';
import { toast } from 'react-hot-toast';

export default function OrderDetail() {
  const { id } = useParams();
  const { user } = useAuthStore();
  const { updateOrderStatus, subscribeToOrders, unsubscribeAll } = useLaundryStore();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const navigate = useNavigate();

  const fetchOrder = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          services (
            title,
            description,
            price,
            estimated_time
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      setOrder(data);
    } catch (err) {
      console.error('Error fetching order detail:', err);
      toast.error('Order not found');
      navigate('/orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();

    // Subscribe to realtime changes for this user's orders
    if (user?.id) {
      subscribeToOrders(user.id, false);
      
      // Let's set up a custom realtime channel specifically for this order to refetch its details
      const channel = supabase
        .channel(`order-detail-${id}`)
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'orders', filter: `id=eq.${id}` },
          (payload) => {
            console.log('Realtime Order Update payload received:', payload);
            fetchOrder();
          }
        )
        .subscribe();

      return () => {
        channel.unsubscribe();
        unsubscribeAll();
      };
    }
  }, [id, user, subscribeToOrders, unsubscribeAll]);

  const handleCancelOrder = async () => {
    if (!order) return;
    const res = await updateOrderStatus(order.id, 'cancelled');
    if (res.success) {
      toast.success('Order cancelled successfully');
      fetchOrder();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!order) return null;

  // Status mapping to highlight active timeline items
  const statusSteps = [
    { key: 'pending', label: 'Order Placed' },
    { key: 'confirmed', label: 'Confirmed' },
    { key: 'picked_up', label: 'Laundry Picked Up' },
    { key: 'washing', label: 'In Wash & Cleaning' },
    { key: 'ironing', label: 'Ironing / Pressing' },
    { key: 'out_for_delivery', label: 'Out for Delivery' },
    { key: 'delivered', label: 'Delivered' },
  ];

  const currentStatusIndex = statusSteps.findIndex((step) => step.key === order.status);

  // If status is cancelled, show a simple cancelled info board
  const isCancelled = order.status === 'cancelled';

  return (
    <div className="pt-28 pb-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 min-h-screen">
      {/* Back button header */}
      <div className="flex justify-between items-center">
        <Link
          to="/orders"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-emerald-600 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Orders
        </Link>

        {order.status === 'pending' && (
          <button
            onClick={() => setCancelDialogOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-bold transition-all"
          >
            <Trash2 size={14} />
            Cancel Booking
          </button>
        )}
      </div>

      {/* Main Order Details Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Info Column */}
        <div className="md:col-span-2 space-y-6">
          <div className="glass-card p-6 rounded-3xl border border-slate-100 shadow-premium space-y-6">
            {/* Title / Id / Badges */}
            <div className="flex justify-between items-start gap-4 flex-wrap">
              <div>
                <span className="text-[10px] font-extrabold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                  ORDER #{order.id.substring(0, 8).toUpperCase()}
                </span>
                <h2 className="text-xl font-extrabold text-slate-800 mt-2">
                  {order.services?.title || 'Laundry Treatment'}
                </h2>
              </div>
              <div className="flex gap-2">
                <StatusBadge status={order.status} />
                <StatusBadge status={order.payment_status} type="payment" />
              </div>
            </div>

            {/* Timetable grid details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-50 text-xs">
              <div className="space-y-3">
                <span className="font-bold text-slate-400 uppercase tracking-wider block">Pickup Details</span>
                <p className="flex items-center gap-2 font-semibold text-slate-600">
                  <Calendar size={14} className="text-emerald-500 shrink-0" />
                  Pickup: {new Date(order.pickup_date).toLocaleDateString()}
                </p>
                <p className="flex items-start gap-2 font-semibold text-slate-600 leading-relaxed">
                  <MapPin size={14} className="text-emerald-500 mt-0.5 shrink-0" />
                  {order.pickup_address}
                </p>
              </div>

              <div className="space-y-3">
                <span className="font-bold text-slate-400 uppercase tracking-wider block">Delivery Estimate</span>
                <p className="flex items-center gap-2 font-semibold text-slate-600">
                  <Calendar size={14} className="text-emerald-500 shrink-0" />
                  Delivery: {new Date(order.dropoff_date).toLocaleDateString()}
                </p>
                <p className="flex items-center gap-2 font-semibold text-slate-600">
                  <Layers size={14} className="text-emerald-500 shrink-0" />
                  Quantity: {order.quantity} item(s)
                </p>
              </div>
            </div>

            {/* Notes */}
            {order.notes && (
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs mt-4">
                <span className="font-bold text-slate-700 block mb-1.5 flex items-center gap-1.5">
                  <Clipboard size={14} className="text-emerald-500" />
                  Special Instructions
                </span>
                <p className="text-slate-600 leading-relaxed">{order.notes}</p>
              </div>
            )}
          </div>

          {/* Timeline Board */}
          {!isCancelled && (
            <div className="glass-card p-6 rounded-3xl border border-slate-100 shadow-premium space-y-6">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                Laundry Processing Stages
              </h3>
              
              <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                {statusSteps.map((step, idx) => {
                  const isCompleted = idx < currentStatusIndex;
                  const isActive = idx === currentStatusIndex;
                  
                  return (
                    <div key={step.key} className="relative flex items-start gap-4">
                      {/* Check Node */}
                      <span
                        className={`absolute -left-[22px] top-1 w-3 h-3 rounded-full border-2 transition-all ${
                          isCompleted
                            ? 'bg-emerald-500 border-emerald-500 scale-110 shadow-md shadow-emerald-100'
                            : isActive
                            ? 'bg-emerald-500 border-emerald-500 scale-125 animate-pulse'
                            : 'bg-white border-slate-200'
                        }`}
                      />
                      <div>
                        <span
                          className={`text-xs font-bold transition-colors ${
                            isCompleted || isActive ? 'text-emerald-600 font-extrabold' : 'text-slate-400'
                          }`}
                        >
                          {step.label}
                        </span>
                        {isActive && (
                          <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                            Our team is actively executing this stage.
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {isCancelled && (
            <div className="bg-red-50 border border-red-100 p-5 rounded-2xl flex items-start gap-3">
              <CheckCircle size={20} className="text-red-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-red-800">Booking Cancelled</h4>
                <p className="text-xs text-red-600 mt-1 leading-relaxed">
                  This order was cancelled. If you already made a payment, it will be refunded to your balance source within 3-5 business days.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Pricing Summary Sidebars */}
        <div className="md:col-span-1 space-y-6">
          <div className="glass-card p-6 rounded-3xl border border-slate-100 shadow-premium space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Payment Summary
            </h3>
            
            <div className="text-xs space-y-2.5 font-semibold text-slate-500 pt-2">
              <div className="flex justify-between">
                <span>Unit Price:</span>
                <span className="text-slate-800">₹{(order.services?.price || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Quantity:</span>
                <span className="text-slate-800">{order.quantity} item(s)</span>
              </div>
              <div className="h-px bg-slate-100 my-1" />
              <div className="flex justify-between text-sm font-extrabold text-slate-800">
                <span>Total Amount:</span>
                <span className="text-emerald-600">₹{order.total_price.toFixed(2)}</span>
              </div>
            </div>

            {/* Payment buttons if unpaid */}
            {order.payment_status === 'pending' && !isCancelled && (
              <button
                onClick={async () => {
                  const res = await updateOrderStatus(order.id, order.status, 'paid');
                  if (res.success) {
                    toast.success('Payment recorded successfully!');
                    fetchOrder();
                  }
                }}
                className="w-full mt-4 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-100 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <CreditCard size={14} />
                Pay Online Securely
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={cancelDialogOpen}
        onClose={() => setCancelDialogOpen(false)}
        onConfirm={handleCancelOrder}
        title="Cancel Laundry Booking?"
        message="Are you sure you want to cancel this pickup scheduling? This action will set the status to Cancelled and alert our runners."
        confirmText="Yes, Cancel Order"
        cancelText="No, Keep Order"
        isDanger
      />
    </div>
  );
}

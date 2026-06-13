import { motion } from 'framer-motion';

export default function StatusBadge({ status, type = 'order' }) {
  const getOrderStyles = (val) => {
    switch (val) {
      case 'pending':
        return { bg: 'bg-amber-50 text-amber-700 border-amber-200', text: 'Pending' };
      case 'confirmed':
        return { bg: 'bg-indigo-50 text-indigo-700 border-indigo-200', text: 'Confirmed' };
      case 'picked_up':
        return { bg: 'bg-sky-50 text-sky-700 border-sky-200', text: 'Picked Up' };
      case 'washing':
        return { bg: 'bg-purple-50 text-purple-700 border-purple-200', text: 'Washing' };
      case 'ironing':
        return { bg: 'bg-pink-50 text-pink-700 border-pink-200', text: 'Ironing' };
      case 'out_for_delivery':
        return { bg: 'bg-lime-50 text-lime-700 border-lime-200', text: 'Out for Delivery' };
      case 'delivered':
        return { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', text: 'Delivered' };
      case 'cancelled':
        return { bg: 'bg-rose-50 text-rose-700 border-rose-200', text: 'Cancelled' };
      default:
        return { bg: 'bg-slate-50 text-slate-700 border-slate-200', text: val };
    }
  };

  const getPaymentStyles = (val) => {
    switch (val) {
      case 'pending':
        return { bg: 'bg-amber-50 text-amber-700 border-amber-200', text: 'Unpaid' };
      case 'paid':
        return { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', text: 'Paid' };
      case 'refunded':
        return { bg: 'bg-slate-100 text-slate-700 border-slate-200', text: 'Refunded' };
      default:
        return { bg: 'bg-slate-50 text-slate-700 border-slate-200', text: val };
    }
  };

  const { bg, text } = type === 'payment' ? getPaymentStyles(status) : getOrderStyles(status);

  return (
    <motion.span
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${bg}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
      {text}
    </motion.span>
  );
}

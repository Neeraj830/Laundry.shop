import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Layers, Eye, MapPin } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';

export default function OrderCard({ order }) {
  const orderIdShort = order.id.substring(0, 8).toUpperCase();
  const serviceTitle = order.services?.title || 'Laundry Service';

  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="glass-card rounded-2xl p-5 shadow-premium hover:shadow-premium-hover border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all"
    >
      <div className="flex flex-col gap-2.5">
        {/* Order Identifier */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-md">
            #{orderIdShort}
          </span>
          <h4 className="text-base font-bold text-slate-800">
            {serviceTitle}
          </h4>
          <StatusBadge status={order.status} />
        </div>

        {/* Info Rows */}
        <div className="flex flex-wrap gap-x-6 gap-y-1.5 text-xs text-slate-500 font-medium">
          <span className="flex items-center gap-1">
            <Calendar size={13} className="text-emerald-500" />
            Pickup: {new Date(order.pickup_date).toLocaleDateString()}
          </span>
          <span className="flex items-center gap-1">
            <Layers size={13} className="text-emerald-500" />
            Qty: {order.quantity} item(s)
          </span>
          <span className="flex items-center gap-1">
            <MapPin size={13} className="text-emerald-500" />
            {order.pickup_address.substring(0, 30)}
            {order.pickup_address.length > 30 && '...'}
          </span>
        </div>
      </div>

      {/* Pricing & Link */}
      <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-6 pt-3 md:pt-0 border-t border-slate-100 md:border-none">
        <div className="flex flex-col md:text-right">
          <span className="text-xs text-slate-400 font-semibold">Total Price</span>
          <span className="text-base font-extrabold text-slate-800">
            ₹{order.total_price.toFixed(2)}
          </span>
        </div>

        <Link
          to={`/orders/${order.id}`}
          className="flex items-center justify-center gap-1.5 px-4 py-2 border border-emerald-500 hover:bg-emerald-50 text-emerald-600 rounded-xl text-xs font-bold transition-colors"
        >
          <Eye size={14} />
          Details
        </Link>
      </div>
    </motion.div>
  );
}

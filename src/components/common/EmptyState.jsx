import { motion } from 'framer-motion';
import { Archive } from 'lucide-react';

export default function EmptyState({
  icon: Icon = Archive,
  title = 'No records found',
  description = 'There is nothing here at the moment.',
  actionText,
  onAction,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center text-center p-8 glass-card rounded-2xl max-w-md mx-auto my-6"
    >
      <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-4 border border-emerald-100">
        <Icon size={28} className="stroke-[1.5]" />
      </div>
      <h3 className="text-lg font-bold text-slate-800 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 mb-6 max-w-xs">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-all hover:scale-105 active:scale-95"
        >
          {actionText}
        </button>
      )}
    </motion.div>
  );
}

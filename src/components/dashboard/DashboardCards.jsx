import { motion } from 'framer-motion';

export default function DashboardCards({ title, value, icon: Icon, description, color = 'emerald' }) {
  const colorMap = {
    emerald: {
      bg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      progress: 'bg-emerald-500',
    },
    blue: {
      bg: 'bg-blue-50 text-blue-600 border-blue-100',
      progress: 'bg-blue-500',
    },
    amber: {
      bg: 'bg-amber-50 text-amber-600 border-amber-100',
      progress: 'bg-amber-500',
    },
    purple: {
      bg: 'bg-purple-50 text-purple-600 border-purple-100',
      progress: 'bg-purple-500',
    },
  };

  const selectedColor = colorMap[color] || colorMap.emerald;

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      className="glass-card rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden group shadow-premium transition-all duration-300"
    >
      {/* Decorative gradient blur background */}
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br from-emerald-500/10 to-lime-500/10 rounded-full blur-xl group-hover:scale-125 transition-transform duration-500" />

      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="flex flex-col gap-0.5">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            {title}
          </span>
          <span className="text-2xl font-extrabold text-slate-800 tracking-tight mt-1">
            {value}
          </span>
        </div>
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${selectedColor.bg}`}>
          <Icon size={20} className="stroke-[1.75]" />
        </div>
      </div>

      {description && (
        <p className="text-xs text-slate-400 font-medium relative z-10 flex items-center gap-1.5 mt-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          {description}
        </p>
      )}
    </motion.div>
  );
}

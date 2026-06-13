import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SearchCode, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card max-w-md w-full p-8 text-center border border-slate-200 rounded-3xl shadow-premium flex flex-col items-center gap-6"
      >
        <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
          <SearchCode size={32} className="stroke-[1.5]" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Page Not Found</h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            The URL path you entered does not exist or may have been moved. Let's redirect you back to active links.
          </p>
        </div>

        <Link
          to="/"
          className="w-full py-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white rounded-xl text-sm font-semibold shadow-md flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all"
        >
          <ArrowLeft size={16} />
          Back to Homepage
        </Link>
      </motion.div>
    </div>
  );
}

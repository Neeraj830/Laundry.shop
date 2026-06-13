import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default function AccessDenied() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card max-w-md w-full p-8 text-center border border-slate-200 rounded-3xl shadow-premium flex flex-col items-center gap-6"
      >
        <div className="w-16 h-16 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500">
          <ShieldAlert size={32} className="stroke-[1.5]" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Access Denied</h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            You do not have the required permissions to view this administration panel. Please log in with an authorized administrator account or return to the safety of the homepage.
          </p>
        </div>

        <div className="flex gap-4 w-full">
          <Link
            to="/"
            className="flex-1 py-3 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft size={16} />
            Go Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

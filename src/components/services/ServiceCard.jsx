import { motion } from 'framer-motion';
import { Clock, Tag } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useModalStore } from '../../store/useModalStore';

export default function ServiceCard({ service }) {
  const { user } = useAuthStore();
  const { openAuth, openBooking } = useModalStore();

  const handleBookNow = () => {
    if (user) {
      openBooking(service);
    } else {
      // Pass a callback to open the booking modal immediately after successful auth
      openAuth('login', () => {
        openBooking(service);
      });
    }
  };

  // Fallback default image for laundry services if not supplied
  const defaultImages = {
    'Dry Cleaning': 'https://images.unsplash.com/photo-1545180853-c90a2665e71c?auto=format&fit=crop&w=600&q=80',
    'Wash & Fold': 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?auto=format&fit=crop&w=600&q=80',
    'Ironing Only': 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80',
    'Default': 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?auto=format&fit=crop&w=600&q=80'
  };

  const imgUrl = service.image_url || defaultImages[service.title] || defaultImages.Default;

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="glass-card rounded-2xl overflow-hidden flex flex-col h-full shadow-premium hover:shadow-premium-hover transition-shadow duration-300"
    >
      {/* Service Image banner */}
      <div className="relative h-48 overflow-hidden group">
        <img
          src={imgUrl}
          alt={service.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
        <div className="absolute bottom-4 left-4 flex gap-2">
          <span className="bg-emerald-500/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
            <Tag size={12} />
            ₹{service.price.toFixed(2)}/item
          </span>
          <span className="bg-slate-900/70 backdrop-blur-md text-slate-100 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
            <Clock size={12} />
            {service.estimated_time}
          </span>
        </div>
      </div>

      {/* Body contents */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-emerald-600 transition-colors">
          {service.title}
        </h3>
        <p className="text-slate-500 text-sm line-clamp-3 mb-6 flex-grow">
          {service.description || 'Professional premium cleaning treatment tailored for your garments.'}
        </p>

        {/* Action Button */}
        <button
          onClick={handleBookNow}
          className="w-full py-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-emerald-100 hover:shadow-emerald-200 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
        >
          Book Now
        </button>
      </div>
    </motion.div>
  );
}

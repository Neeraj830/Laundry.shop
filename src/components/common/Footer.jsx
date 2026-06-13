import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Shield, CheckCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Logo and Pitch */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center">
                <span className="text-white font-black text-lg">L</span>
              </div>
              <span className="font-extrabold text-lg text-white tracking-tight">
                Laundry<span className="text-emerald-400">Shop</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Premium doorstep laundry & dry cleaning service. We wash, iron, and deliver back to your doorstep within 24 hours.
            </p>
          </div>

          {/* Quick links */}
          <div className="flex flex-col gap-3.5">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider">
              Services
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/services" className="hover:text-emerald-400 transition-colors">
                  Dry Cleaning
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-emerald-400 transition-colors">
                  Wash & Fold
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-emerald-400 transition-colors">
                  Ironing & Pressing
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-emerald-400 transition-colors">
                  Express Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Company links */}
          <div className="flex flex-col gap-3.5">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider">
              Company
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="hover:text-emerald-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-emerald-400 transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <a href="#how" className="hover:text-emerald-400 transition-colors">
                  How it Works
                </a>
              </li>
              <li>
                <a href="#faqs" className="hover:text-emerald-400 transition-colors">
                  FAQs
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="flex flex-col gap-3.5">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider">
              Get in Touch
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-emerald-400 shrink-0" />
                <span>+91 88888 00000</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-emerald-400 shrink-0" />
                <span>support@laundryShop.com</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={16} className="text-emerald-400 shrink-0" />
                <span>102 Gandhipura, Balotra, Rajasthan</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom credits */}
        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-semibold text-slate-500">
          <p>© {new Date().getFullYear()} LaundryShop Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-400 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

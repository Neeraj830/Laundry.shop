import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Calendar, Heart, Shield, RefreshCw, ChevronDown, CheckCircle } from 'lucide-react';
import { useLaundryStore } from '../store/useLaundryStore';
import ServiceCard from '../components/services/ServiceCard';
import SkeletonLoader from '../components/common/SkeletonLoader';

export default function Home() {
  const { services, fetchServices, loading } = useLaundryStore();
  const [activeFaq, setActiveFaq] = useState(null);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const featuredServices = services.slice(0, 3);

  const steps = [
    {
      num: '01',
      title: 'Schedule a Pickup',
      desc: 'Choose your laundry services, pickup/dropoff dates, and details directly in our app.',
    },
    {
      num: '02',
      title: 'We Collect',
      desc: 'Our delivery agent arrives with specialized bags and collects your laundry right at your door.',
    },
    {
      num: '03',
      title: 'Expert Cleaning',
      desc: 'Our sorting team handles your clothes with care, treating stains and washing by fabric type.',
    },
    {
      num: '04',
      title: 'Express Delivery',
      desc: 'We iron, fold, and pack your fresh garments in premium bags and deliver them back in 24-48 hours.',
    },
  ];

  const faqs = [
    {
      q: 'How long does a standard cleaning order take?',
      a: 'Most standard orders are completed and returned to you within 24 to 48 hours. Express options are available for 24-hour delivery on specific services.',
    },
    {
      q: 'Do I need to separate my laundry before pickup?',
      a: 'No separation is required! Our professional processing team inspects and separates all fabrics, colors, and garments based on their wash-care labels.',
    },
    {
      q: 'How do I pay for my orders?',
      a: 'We support cashless transactions. You can pay securely online via credit card, Apple Pay, or Google Pay inside your dashboard after your order is confirmed.',
    },
    {
      q: 'What happens if my clothes get damaged?',
      a: 'We treat every item with premium care. In the rare event of damage or loss, your items are fully covered up to ₹250 per order under our LaundryShop Protection Guarantee.',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah',
      role: 'SaaS Founder',
      comment: 'LaundryShop is a lifesaver. The booking takes literally 30 seconds. The clothes return looking brand new and smell amazing.',
      rating: 5,
    },
    {
      name: 'Tarak Mehta',
      role: 'Software Engineer',
      comment: 'Very premium service. I love that I can track the status in realtime. Ironing quality is impeccable. Highly recommended.',
      rating: 5,
    },
    {
      name: ' Ranjit Singh',
      role: 'Creative Director',
      comment: 'Excellent customer support and fast delivery. The emerald theme UI is beautiful, matching the sleek clean laundry they deliver.',
      rating: 5,
    },
  ];

  return (
    <div className="pt-24 pb-12 space-y-24 bg-gradient-to-b from-[#f8fafc] via-white to-[#f0fdf4]/30">
      {/* 1. HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Hero Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-6"
          >
            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full text-xs font-bold w-fit border border-emerald-100">
              <Sparkles size={14} className="animate-pulse" />
              Smarter Laundry Services
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-800 tracking-tight leading-[1.1]">
              Fresh Clothes,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-green-600">
                Zero Effort.
              </span>
            </h1>
            <p className="text-slate-500 text-base sm:text-lg leading-relaxed max-w-lg">
              We collect, wash, iron, and deliver your garments right back to your door. Get premium dry cleaning and laundry with a 24-hour turnaround guarantee.
            </p>
            <div className="flex flex-wrap gap-4 mt-2">
              <Link
                to="/services"
                className="px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white rounded-2xl text-sm font-bold shadow-lg shadow-emerald-100 hover:shadow-emerald-200 transition-all hover:scale-[1.03] active:scale-[0.97]"
              >
                Schedule Pickup
              </Link>
              <a
                href="#how"
                className="px-8 py-3.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-2xl text-sm font-semibold transition-all"
              >
                How It Works
              </a>
            </div>
            {/* Badges bar */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-100 mt-4">
              <div>
                <span className="text-lg font-black text-slate-800">24h</span>
                <p className="text-xs text-slate-400 font-semibold uppercase">Turnaround</p>
              </div>
              <div>
                <span className="text-lg font-black text-slate-800">10k+</span>
                <p className="text-xs text-slate-400 font-semibold uppercase">Items Cleaned</p>
              </div>
              <div>
                <span className="text-lg font-black text-slate-800">99.8%</span>
                <p className="text-xs text-slate-400 font-semibold uppercase">Happy Rating</p>
              </div>
            </div>
          </motion.div>

          {/* Right Hero Image Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative h-[480px] lg:h-[520px] rounded-3xl overflow-hidden shadow-2xl border border-slate-100 group"
          >
            <img
              src="./../../../Images/Hero_Section_Image1.jpeg"
              alt="Laundry Service"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
            />
            {/* Float Floating Dashboard Widget */}
            <div className="absolute bottom-6 left-6 right-6 glass-nav backdrop-blur-md p-4 rounded-2xl border border-white/60 flex items-center justify-between shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center">
                  <CheckCircle size={20} />
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-bold block">Status Update</span>
                  <span className="text-sm font-bold text-slate-800">Order Out for Delivery</span>
                </div>
              </div>
              <span className="bg-emerald-100 text-emerald-700 text-xs font-extrabold px-3 py-1 rounded-full animate-pulse">
                Live
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. HOW IT WORKS */}
      <section id="how" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
            Logistics Flow
          </span>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight mt-1.5">
            Uber-Style Simple Delivery
          </h2>
          <p className="text-slate-500 text-sm mt-3">
            Getting fresh laundry has never been easier. We’ve automated the process down to four clear phases.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card rounded-2xl p-6 relative flex flex-col gap-3 group border border-slate-100"
            >
              <span className="text-4xl font-black text-emerald-500/20 group-hover:text-emerald-500 transition-colors">
                {step.num}
              </span>
              <h3 className="text-base font-extrabold text-slate-800 mt-1">
                {step.title}
              </h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. FEATURED SERVICES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
          <div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
              Pricing Options
            </span>
            <h2 className="text-3xl font-black text-slate-800 tracking-tight mt-1.5">
              Popular Cleaning Services
            </h2>
          </div>
          <Link
            to="/services"
            className="text-emerald-500 font-bold hover:text-emerald-600 transition-colors text-sm flex items-center gap-1 mt-3 md:mt-0"
          >
            Browse All Services →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {loading ? (
            <SkeletonLoader type="card" count={3} />
          ) : featuredServices.length > 0 ? (
            featuredServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))
          ) : (
            // Static mock placeholders if DB is empty
            [
              { id: '1', title: 'Wash & Fold', price: 2.50, estimated_time: '24 hours', description: 'Everyday apparel clean. Tumble dried and perfectly folded.' },
              { id: '2', title: 'Dry Cleaning', price: 6.99, estimated_time: '2 days', description: 'Delicate suits, coats, dresses, and fabrics dry processed.' },
              { id: '3', title: 'Ironing Only', price: 1.80, estimated_time: '24 hours', description: 'Steam pressed, hung and wrapped. Say goodbye to wrinkles.' }
            ].map((mock) => <ServiceCard key={mock.id} service={mock} />)
          )}
        </div>
      </section>

      {/* 4. TESTIMONIALS */}
      <section className="bg-emerald-950 text-white py-20 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
              Testimonials
            </span>
            <h2 className="text-3xl font-black tracking-tight mt-1.5">
              Loved By Busy Professionals
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col gap-4">
                <div className="flex gap-1 text-emerald-400">
                  {Array.from({ length: t.rating }).map((_, idx) => (
                    <span key={idx}>★</span>
                  ))}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed italic">
                  "{t.comment}"
                </p>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-white">{t.name}</span>
                  <span className="text-xs text-slate-400 font-semibold">{t.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. FAQs SECTION */}
      <section id="faqs" className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
            Got Questions?
          </span>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight mt-1.5">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = activeFaq === index;
            return (
              <div
                key={index}
                className="border border-slate-100 rounded-2xl bg-white overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : index)}
                  className="w-full flex justify-between items-center px-6 py-4.5 text-left font-bold text-slate-800 text-sm hover:bg-slate-50/50"
                >
                  {faq.q}
                  <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
                    <ChevronDown size={18} className="text-slate-400" />
                  </motion.div>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-5 text-slate-500 text-xs leading-relaxed border-t border-slate-50 pt-3">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

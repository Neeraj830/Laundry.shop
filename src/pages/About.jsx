import { Shield, Sparkles, Clock, Trees } from 'lucide-react';

export default function About() {
  const values = [
    {
      icon: Shield,
      title: 'Premium Quality Care',
      desc: 'We use premium solvent-free solutions and follow strict fabric inspection guidelines to safeguard your garments.',
    },
    {
      icon: Clock,
      title: 'Reliable 24h Turnaround',
      desc: 'Our delivery fleet works around the clock to pick up, wash, iron, and drop off orders within scheduled periods.',
    },
    {
      icon: Trees,
      title: 'Eco-Friendly Washing',
      desc: 'Our laundry processes save up to 40% water compared to standard machines, using 100% biodegradable detergents.',
    },
    {
      icon: Sparkles,
      title: 'Stain Treatment Experts',
      desc: 'From red wine spills to old oil residues, our specialized treatments restore fabrics back to pristine states.',
    },
  ];

  return (
    <div className="pt-28 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 min-h-screen">
      {/* 1. Page Header */}
      <div className="text-center max-w-3xl mx-auto flex flex-col gap-4">
        <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
          Who We Are
        </span>
        <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight leading-tight">
          We are redefining the way you look at laundry.
        </h1>
        <p className="text-slate-500 text-sm leading-relaxed max-w-xl mx-auto">
          Founded in 2024, LaundryShop was built to eliminate the weekly laundry chore for busy individuals. We combine modern routing tech, environment-first cleaning, and premium customer service.
        </p>
      </div>

      {/* 2. Visual Split banner */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="relative h-[380px] rounded-3xl overflow-hidden shadow-premium border border-slate-100">
          <img
            src="https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?auto=format&fit=crop&w=800&q=80"
            alt="Laundry Room"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="space-y-6">
          <h2 className="text-2xl font-black text-slate-800">
            Our Mission & Commitment
          </h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            We believe you should spend your weekends doing what you love, not folding shirts. LaundryShop works with top-tier dry cleaners and laundry experts in every city to ensure consistency, hygiene, and outstanding outcomes.
          </p>
          <div className="space-y-3.5">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs shrink-0">
                ✓
              </div>
              <span className="text-sm font-semibold text-slate-700">100% Cashless & Secure Online Payments</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs shrink-0">
                ✓
              </div>
              <span className="text-sm font-semibold text-slate-700">Real-time Order Status & Driver Mapping</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs shrink-0">
                ✓
              </div>
              <span className="text-sm font-semibold text-slate-700">Custom wash instructions per garment item</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Core Values Grid */}
      <div className="space-y-12">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-2xl font-black text-slate-800">Our Core Principles</h2>
          <p className="text-slate-500 text-sm mt-2">
            Why thousands of households trust LaundryShop with their premium wear.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {values.map((v, i) => (
            <div
              key={i}
              className="glass-card p-6 rounded-2xl border border-slate-100 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                <v.icon size={20} className="stroke-[1.5]" />
              </div>
              <h3 className="text-base font-bold text-slate-800">{v.title}</h3>
              <p className="text-slate-500 text-xs leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useLaundryStore } from '../store/useLaundryStore';
import ServiceCard from '../components/services/ServiceCard';
import SkeletonLoader from '../components/common/SkeletonLoader';
import EmptyState from '../components/common/EmptyState';
import { Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

export default function Services() {
  const { services, fetchServices, loading } = useLaundryStore();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('default'); // 'default' | 'price-asc' | 'price-desc'

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  // Filter based on search query
  const filteredServices = services
    .filter((s) => {
      const searchLower = search.toLowerCase();
      return (
        s.title.toLowerCase().includes(searchLower) ||
        (s.description && s.description.toLowerCase().includes(searchLower))
      );
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      return 0; // default
    });

  return (
    <div className="pt-28 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 min-h-screen">
      {/* Page Title Header */}
      <div className="flex flex-col gap-2 max-w-xl">
        <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
          Service Catalogue
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight">
          Select Professional Treatment
        </h1>
        <p className="text-slate-500 text-sm">
          Browse our premium wash treatments. Add to booking and let us collect right at your doorstep.
        </p>
      </div>

      {/* Filters Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl border border-slate-100 shadow-premium">
        {/* Search */}
        <div className="relative w-full md:max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search laundry treatments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 text-sm transition-all"
          />
        </div>

        {/* Sorting controls */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <SlidersHorizontal size={16} className="text-slate-400" />
          <span className="text-xs font-bold text-slate-500 hidden sm:inline">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="flex-1 md:flex-none border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 font-semibold text-slate-600 bg-white"
          >
            <option value="default">Default Order</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Catalog Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <SkeletonLoader type="card" count={3} />
        </div>
      ) : filteredServices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No services match your filters"
          description="Try modifying your keyword search or checking back later."
          actionText="Clear Filters"
          onAction={() => {
            setSearch('');
            setSortBy('default');
          }}
        />
      )}
    </div>
  );
}

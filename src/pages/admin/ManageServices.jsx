import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLaundryStore } from '../../store/useLaundryStore';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import EmptyState from '../../components/common/EmptyState';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Modal from '../../components/common/Modal';
import FormInput from '../../components/common/FormInput';
import { Plus, Edit2, Trash2, Sliders, ToggleLeft, ToggleRight, Loader2, Sparkles } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function ManageServices() {
  const { services, fetchServices, createService, updateService, deleteService, loading } = useLaundryStore();
  const [search, setSearch] = useState('');
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    fetchServices(true); // fetch all, including inactive ones
  }, [fetchServices]);

  const openAddModal = () => {
    setEditingService(null);
    reset({
      title: '',
      description: '',
      price: '',
      estimated_time: '24 hours',
      active: true,
      image_url: '',
    });
    setServiceModalOpen(true);
  };

  const openEditModal = (service) => {
    setEditingService(service);
    reset({
      title: service.title,
      description: service.description || '',
      price: service.price,
      estimated_time: service.estimated_time,
      active: service.active,
      image_url: service.image_url || '',
    });
    setServiceModalOpen(true);
  };

  const onSubmit = async (data) => {
    setActionLoading(true);
    try {
      const payload = {
        title: data.title,
        description: data.description,
        price: parseFloat(data.price),
        estimated_time: data.estimated_time,
        active: data.active,
        image_url: data.image_url || null,
      };

      let res;
      if (editingService) {
        res = await updateService(editingService.id, payload);
      } else {
        res = await createService(payload);
      }

      if (res.success) {
        setServiceModalOpen(false);
        fetchServices(true);
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleActive = async (service) => {
    const res = await updateService(service.id, { active: !service.active });
    if (res.success) {
      fetchServices(true);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!confirmDeleteId) return;
    const res = await deleteService(confirmDeleteId);
    if (res.success) {
      setConfirmDeleteId(null);
      fetchServices(true);
    }
  };

  const filteredServices = services.filter((s) => {
    const searchLower = search.toLowerCase();
    return (
      s.title.toLowerCase().includes(searchLower) ||
      (s.description && s.description.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className="pt-28 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col gap-2 max-w-xl">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
            Service Settings
          </span>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
            Manage Catalog Services
          </h1>
        </div>

        <button
          onClick={openAddModal}
          className="px-5 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-100 flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Plus size={16} />
          Add New Service
        </button>
      </div>

      {/* Filter toolbar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-3xl border border-slate-100 shadow-premium">
        <div className="relative w-full md:max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search catalog by title or keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 text-sm transition-all"
          />
        </div>
      </div>

      {/* Services grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <SkeletonLoader type="card" count={3} />
        </div>
      ) : filteredServices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className={`glass-card rounded-3xl overflow-hidden flex flex-col justify-between border shadow-premium hover:shadow-premium-hover transition-all duration-300 relative ${
                !service.active ? 'opacity-65 border-slate-200' : 'border-slate-100'
              }`}
            >
              <div>
                {/* Service Banner */}
                <div className="h-40 relative overflow-hidden bg-slate-100">
                  <img
                    src={service.image_url || 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?auto=format&fit=crop&w=600&q=80'}
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                  {!service.active && (
                    <span className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center text-white font-extrabold text-sm uppercase">
                      Inactive
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-extrabold text-slate-800 text-base">{service.title}</h3>
                    <span className="text-sm font-black text-emerald-600">${service.price.toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-slate-400 font-semibold">Est Delivery: {service.estimated_time}</p>
                  <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed mt-2">{service.description}</p>
                </div>
              </div>

              {/* Controls footer */}
              <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between gap-4">
                {/* Active switch */}
                <button
                  onClick={() => handleToggleActive(service)}
                  className="flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-slate-800 transition-colors"
                >
                  {service.active ? (
                    <>
                      <ToggleRight className="text-emerald-500" size={24} />
                      Active
                    </>
                  ) : (
                    <>
                      <ToggleLeft className="text-slate-300" size={24} />
                      Inactive
                    </>
                  )}
                </button>

                {/* Edit & Delete actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal(service)}
                    className="p-2 border border-slate-200 hover:bg-slate-100/50 text-slate-500 hover:text-slate-800 rounded-lg transition-colors"
                  >
                    <Edit2 size={13} />
                  </button>
                  <button
                    onClick={() => setConfirmDeleteId(service.id)}
                    className="p-2 border border-rose-200 hover:bg-rose-50 text-rose-500 rounded-lg transition-colors"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No services found"
          description="Create a new cleaning service to populate your store catalog."
          actionText="Add Service"
          onAction={openAddModal}
        />
      )}

      {/* service form modal */}
      <Modal
        isOpen={serviceModalOpen}
        onClose={() => setServiceModalOpen(false)}
        title={editingService ? 'Edit Cleaning Service' : 'Add New Service'}
        size="md"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          <FormInput
            label="Service Title"
            placeholder="Wash & Fold, dry cleaning, premium steam..."
            error={errors.title}
            {...register('title', { required: 'Service title is required' })}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Price ($ / item)"
              type="number"
              step="0.01"
              placeholder="4.99"
              error={errors.price}
              {...register('price', { required: 'Price is required' })}
            />

            <FormInput
              label="Estimated Turnaround Time"
              placeholder="e.g. 24 hours, 2 days"
              error={errors.estimated_time}
              {...register('estimated_time', { required: 'Time estimate is required' })}
            />
          </div>

          <FormInput
            label="Image URL (Unsplash or direct image link)"
            placeholder="https://images.unsplash.com/photo-..."
            error={errors.image_url}
            {...register('image_url')}
          />

          <FormInput
            label="Service Description"
            placeholder="Give users details about washing cycles, solvents used, drying processes..."
            textarea
            rows={3}
            error={errors.description}
            {...register('description', { required: 'Description is required' })}
          />

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="active"
              className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"
              {...register('active')}
            />
            <label htmlFor="active" className="text-sm font-semibold text-slate-700 select-none">
              Publish service catalog immediately
            </label>
          </div>

          <button
            type="submit"
            disabled={actionLoading}
            className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white rounded-xl text-sm font-bold shadow-md shadow-emerald-100 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-75 transition-all"
          >
            {actionLoading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              'Save Service Details'
            )}
          </button>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!confirmDeleteId}
        onClose={() => setConfirmDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Cleaning Service?"
        message="Are you sure you want to delete this laundry option from the catalog? This will delete the service, and any past orders referencing this service will lose details."
        confirmText="Yes, Delete Service"
        cancelText="No, Keep Service"
        isDanger
      />
    </div>
  );
}

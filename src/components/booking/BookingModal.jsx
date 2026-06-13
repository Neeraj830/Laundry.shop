import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Loader2, IndianRupee, ClipboardList, Plus, Minus, Check } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '../../store/useAuthStore';
import { useModalStore } from '../../store/useModalStore';
import { useLaundryStore } from '../../store/useLaundryStore';
import Modal from '../common/Modal';
import FormInput from '../common/FormInput';

export default function BookingModal() {
  const { isBookingOpen, closeBooking, selectedService } = useModalStore();
  const { profile } = useAuthStore();
  const { createOrdersBulk, platformSettings, fetchPlatformSettings, services, fetchServices } = useLaundryStore();
  const [loading, setLoading] = useState(false);
  
  // local map for selected services: { [serviceId]: quantity }
  const [selectedServicesMap, setSelectedServicesMap] = useState({});

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm();

  const pickupDate = watch('pickupDate');

  useEffect(() => {
    if (isBookingOpen) {
      fetchServices();
      if (!platformSettings) {
        fetchPlatformSettings();
      }
    }
  }, [isBookingOpen, platformSettings, fetchPlatformSettings, fetchServices]);

  // Pre-fill fields and selected services when modal opens
  useEffect(() => {
    if (isBookingOpen) {
      reset({
        notes: '',
        pickupAddress: profile?.address || '',
      });

      // Initialize selected services map
      if (selectedService) {
        setSelectedServicesMap({ [selectedService.id]: 1 });
      } else {
        setSelectedServicesMap({});
      }

      // Default pickup date to tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];
      setValue('pickupDate', tomorrowStr);

      // Default dropoff date to 3 days from now
      const delivery = new Date();
      delivery.setDate(delivery.getDate() + 3);
      const deliveryStr = delivery.toISOString().split('T')[0];
      setValue('dropoffDate', deliveryStr);
    }
  }, [isBookingOpen, profile, selectedService, setValue, reset]);

  // Adjust dropoff date when pickup changes (dropoff must be at least 1 day after pickup)
  useEffect(() => {
    if (pickupDate) {
      const pDate = new Date(pickupDate);
      const dDate = new Date(watch('dropoffDate'));
      
      const minDropoff = new Date(pDate);
      minDropoff.setDate(minDropoff.getDate() + 2); // default 48h turnaround

      if (dDate <= pDate) {
        setValue('dropoffDate', minDropoff.toISOString().split('T')[0]);
      }
    }
  }, [pickupDate, setValue, watch]);

  const toggleService = (serviceId) => {
    setSelectedServicesMap((prev) => {
      const next = { ...prev };
      if (next[serviceId]) {
        delete next[serviceId];
      } else {
        next[serviceId] = 1;
      }
      return next;
    });
  };

  const adjustQuantity = (serviceId, delta) => {
    setSelectedServicesMap((prev) => {
      if (!prev[serviceId]) return prev;
      const currentQty = prev[serviceId];
      const newQty = Math.max(1, currentQty + delta);
      return { ...prev, [serviceId]: newQty };
    });
  };

  const handleQtyInputChange = (serviceId, val) => {
    const parsed = parseInt(val, 10);
    setSelectedServicesMap((prev) => {
      if (!prev[serviceId]) return prev;
      return { ...prev, [serviceId]: isNaN(parsed) || parsed < 1 ? 1 : parsed };
    });
  };

  // Live Price Calculation
  const totalPrice = Object.keys(selectedServicesMap).reduce((sum, serviceId) => {
    const service = services.find((s) => s.id === serviceId);
    const qty = selectedServicesMap[serviceId] || 0;
    return sum + (service ? service.price * qty : 0);
  }, 0);

  const totalItems = Object.values(selectedServicesMap).reduce((sum, qty) => sum + qty, 0);

  const onSubmit = async (data) => {
    if (!profile) return;
    
    const selectedIds = Object.keys(selectedServicesMap);
    if (selectedIds.length === 0) {
      toast.error('Please select at least one service');
      return;
    }

    if (platformSettings && !platformSettings.booking_open) {
      toast.error('Bookings are temporarily closed. Please try again later.');
      return;
    }

    setLoading(true);
    try {
      const orderPayloads = selectedIds.map((serviceId) => {
        const service = services.find((s) => s.id === serviceId);
        const qty = selectedServicesMap[serviceId];
        return {
          user_id: profile.id,
          service_id: serviceId,
          pickup_date: new Date(data.pickupDate).toISOString(),
          dropoff_date: new Date(data.dropoffDate).toISOString(),
          pickup_address: data.pickupAddress,
          quantity: qty,
          notes: data.notes,
          total_price: service.price * qty,
          status: 'pending',
          payment_status: 'pending',
        };
      });

      const res = await createOrdersBulk(orderPayloads, profile);
      if (res.success) {
        closeBooking();
      }
    } finally {
      setLoading(false);
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <Modal
      isOpen={isBookingOpen}
      onClose={closeBooking}
      title="Schedule Laundry Pickup"
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-2">
        
        {/* Services Checklist Section */}
        <div className="space-y-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wide block">
            Select Services & Quantities
          </span>
          <div className="max-h-56 overflow-y-auto border border-slate-100 rounded-2xl p-3 bg-slate-50/50 space-y-2.5">
            {services && services.length > 0 ? (
              services.map((service) => {
                const isSelected = !!selectedServicesMap[service.id];
                const quantity = selectedServicesMap[service.id] || 0;
                
                return (
                  <div
                    key={service.id}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-white border-emerald-500/30 shadow-sm'
                        : 'bg-white/40 border-slate-100 hover:bg-white hover:border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3 shrink-0">
                      {/* Checkbox */}
                      <button
                        type="button"
                        onClick={() => toggleService(service.id)}
                        className={`w-5.5 h-5.5 rounded-lg flex items-center justify-center border transition-all ${
                          isSelected
                            ? 'bg-emerald-500 border-emerald-500 text-white'
                            : 'border-slate-300 hover:border-slate-400 bg-white'
                        }`}
                      >
                        {isSelected && <Check size={12} strokeWidth={3} />}
                      </button>
                      
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-800">{service.title}</span>
                        <span className="text-[10px] font-semibold text-slate-400">
                          ₹{service.price.toFixed(2)} / item
                        </span>
                      </div>
                    </div>

                    {/* Quantity Selector */}
                    {isSelected && (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => adjustQuantity(service.id, -1)}
                          className="w-7 h-7 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors"
                        >
                          <Minus size={12} />
                        </button>
                        <input
                          type="number"
                          value={quantity}
                          onChange={(e) => handleQtyInputChange(service.id, e.target.value)}
                          className="w-10 text-center text-xs font-bold text-slate-800 outline-none border border-slate-100 rounded p-1"
                        />
                        <button
                          type="button"
                          onClick={() => adjustQuantity(service.id, 1)}
                          className="w-7 h-7 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <p className="text-center py-4 text-xs font-semibold text-slate-400">No services available</p>
            )}
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Pickup Date"
            type="date"
            min={todayStr}
            error={errors.pickupDate}
            {...register('pickupDate', { required: 'Pickup date is required' })}
          />

          <FormInput
            label="Estimated Dropoff Date"
            type="date"
            min={pickupDate || todayStr}
            error={errors.dropoffDate}
            {...register('dropoffDate', { required: 'Dropoff date is required' })}
          />
        </div>

        {/* Pickup Address */}
        <FormInput
          label="Pickup Address"
          placeholder="Where should we pick up your laundry?"
          error={errors.pickupAddress}
          textarea
          rows={2}
          {...register('pickupAddress', { required: 'Address is required' })}
        />

        {/* Notes */}
        <FormInput
          label="Special Instructions / Garment Notes (Optional)"
          placeholder="E.g. Delicate wash, hang dry, stain on blue shirt..."
          textarea
          rows={2}
          {...register('notes')}
        />

        {/* Summary Board */}
        <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl text-xs space-y-2">
          <h4 className="font-bold text-slate-700 flex items-center gap-1.5">
            <ClipboardList size={14} className="text-emerald-500" />
            Order Summary
          </h4>
          <div className="space-y-1.5 max-h-24 overflow-y-auto pr-1">
            {Object.keys(selectedServicesMap).map((serviceId) => {
              const service = services.find((s) => s.id === serviceId);
              const qty = selectedServicesMap[serviceId];
              if (!service) return null;
              return (
                <div key={serviceId} className="flex justify-between font-semibold text-slate-500">
                  <span>{service.title} (x{qty}):</span>
                  <span className="text-slate-800">₹{(service.price * qty).toFixed(2)}</span>
                </div>
              );
            })}
          </div>
          <div className="h-px bg-slate-200 my-1" />
          <div className="flex justify-between text-sm font-extrabold text-slate-800">
            <span>Total Price ({totalItems} items):</span>
            <span className="text-emerald-600 flex items-center gap-0.5">
              <IndianRupee size={14} />
              {totalPrice.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white rounded-xl text-sm font-bold shadow-md shadow-emerald-100 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-75 transition-all"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            'Confirm & Book Pickup'
          )}
        </button>
      </form>
    </Modal>
  );
}

import { useEffect, useState } from 'react';
import { Settings, Clock, Coins, Mail, Save, ToggleLeft, ToggleRight } from 'lucide-react';
import { useLaundryStore } from '../../store/useLaundryStore';
import FormInput from '../../components/common/FormInput';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function AdminSettings() {
  const { platformSettings, fetchPlatformSettings, updatePlatformSettings, loading } = useLaundryStore();
  const [bookingOpen, setBookingOpen] = useState(true);
  const [deliveryFee, setDeliveryFee] = useState('4.99');
  const [taxRate, setTaxRate] = useState('8.25');
  const [hoursOpen, setHoursOpen] = useState('08:00');
  const [hoursClosed, setHoursClosed] = useState('20:00');
  const [supportEmail, setSupportEmail] = useState('notifications@laundryshop.com');
  const [saving, setSaving] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const settings = await fetchPlatformSettings();
      if (settings) {
        setBookingOpen(settings.booking_open);
        setDeliveryFee(String(settings.delivery_fee));
        setTaxRate(String(settings.tax_rate));
        setHoursOpen(settings.hours_open);
        setHoursClosed(settings.hours_closed);
        setSupportEmail(settings.support_email);
      }
      setInitialLoading(false);
    };
    load();
  }, [fetchPlatformSettings]);

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updatePlatformSettings({
        booking_open: bookingOpen,
        delivery_fee: parseFloat(deliveryFee),
        tax_rate: parseFloat(taxRate),
        hours_open: hoursOpen,
        hours_closed: hoursClosed,
        support_email: supportEmail,
      });
    } finally {
      setSaving(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="pt-28 pb-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 min-h-screen">
      <div className="flex flex-col gap-2 max-w-xl">
        <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
          Platform Parameters
        </span>
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
          Admin Settings Panel
        </h1>
        <p className="text-slate-500 text-sm">
          Configure business operating windows, delivery fees, tax variables, and global email sender templates.
        </p>
      </div>

      <form onSubmit={handleSaveSettings} className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        <div className="md:col-span-2 space-y-6">
          <div className="glass-card p-6 rounded-3xl border border-slate-100 shadow-premium space-y-6">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Clock size={16} className="text-emerald-500" />
              Store Operation Hours
            </h3>

            <div className="flex items-center justify-between py-2 border-b border-slate-50">
              <div>
                <span className="text-sm font-bold text-slate-700 block">Laundry Booking Availability</span>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">Toggle this off to temporarily freeze user bookings</p>
              </div>
              <button
                type="button"
                onClick={() => setBookingOpen(!bookingOpen)}
                className="transition-all"
              >
                {bookingOpen ? (
                  <ToggleRight className="text-emerald-500" size={36} />
                ) : (
                  <ToggleLeft className="text-slate-300" size={36} />
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput
                label="Opening Hour"
                type="time"
                value={hoursOpen}
                onChange={(e) => setHoursOpen(e.target.value)}
              />
              <FormInput
                label="Closing Hour"
                type="time"
                value={hoursClosed}
                onChange={(e) => setHoursClosed(e.target.value)}
              />
            </div>
          </div>

          <div className="glass-card p-6 rounded-3xl border border-slate-100 shadow-premium space-y-6">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Coins size={16} className="text-emerald-500" />
              Rates & Taxes Config
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput
                label="Standard Flat Delivery Fee (₹)"
                type="number"
                step="0.01"
                value={deliveryFee}
                onChange={(e) => setDeliveryFee(e.target.value)}
              />
              <FormInput
                label="Local Tax Rate (%)"
                type="number"
                step="0.01"
                value={taxRate}
                onChange={(e) => setTaxRate(e.target.value)}
              />
            </div>
          </div>

          <div className="glass-card p-6 rounded-3xl border border-slate-100 shadow-premium space-y-6">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Mail size={16} className="text-emerald-500" />
              SMTP Email Templates Default
            </h3>

            <FormInput
              label="Sender E-mail Address (From header)"
              type="email"
              value={supportEmail}
              onChange={(e) => setSupportEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="md:col-span-1 space-y-6">
          <div className="glass-card p-6 rounded-3xl border border-slate-100 shadow-premium space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Settings size={14} />
              Save Parameters
            </h3>
            <p className="text-xs text-slate-400 font-semibold leading-relaxed">
              Settings are stored in Supabase and applied across all client sessions in real time.
            </p>
            {platformSettings?.updated_at && (
              <p className="text-[10px] text-slate-400">
                Last saved: {new Date(platformSettings.updated_at).toLocaleString()}
              </p>
            )}
            <button
              type="submit"
              disabled={saving || loading}
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-100 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70"
            >
              <Save size={14} />
              {saving ? 'Saving...' : 'Apply Changes'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

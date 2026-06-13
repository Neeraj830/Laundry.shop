import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Mail, Phone, MapPin, Loader2, Send } from 'lucide-react';
import { useLaundryStore } from '../store/useLaundryStore';
import FormInput from '../components/common/FormInput';
import { toast } from 'react-hot-toast';

export default function Contact() {
  const { submitContactForm } = useLaundryStore();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await submitContactForm(data);
      if (res.success) {
        toast.success('Message sent successfully! Our team will respond within 24 hours.');
        reset();
      } else {
        toast.error(res.error || 'Failed to send message. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-28 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 min-h-screen">
      {/* Page Header */}
      <div className="flex flex-col gap-2 max-w-xl">
        <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
          Support Center
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight">
          How can we help?
        </h1>
        <p className="text-slate-500 text-sm">
          Have questions about our washing procedures or booking details? Fill out the form and our support team will reach out.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        {/* Left Columns - Contact Cards */}
        <div className="space-y-6 lg:col-span-1">
          <div className="glass-card p-6 rounded-2xl flex items-start gap-4 border border-slate-100 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shrink-0">
              <Phone size={18} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800">Phone Support</h4>
              <p className="text-xs text-slate-500 mt-1">Available Mon-Fri, 9am - 6pm</p>
              <span className="text-sm font-semibold text-emerald-600 mt-2 block">+1 (800) 555-FLOW</span>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl flex items-start gap-4 border border-slate-100 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shrink-0">
              <Mail size={18} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800">Email Inquiries</h4>
              <p className="text-xs text-slate-500 mt-1">Get replies within 1 business day</p>
              <span className="text-sm font-semibold text-emerald-600 mt-2 block">support@LaundryShop.com</span>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl flex items-start gap-4 border border-slate-100 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shrink-0">
              <MapPin size={18} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800">Our Wash Center</h4>
              <p className="text-xs text-slate-500 mt-1">Drop-offs by appointment only</p>
              <span className="text-sm font-semibold text-emerald-600 mt-2 block">123 Clean St, CA</span>
            </div>
          </div>
        </div>

        {/* Right Columns - Form Card */}
        <div className="glass-card p-8 rounded-3xl border border-slate-100 shadow-premium lg:col-span-2">
          <h3 className="text-xl font-bold text-slate-800 mb-6">Send Us a Message</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Full Name"
                placeholder="John Doe"
                error={errors.name}
                {...register('name', { required: 'Name is required' })}
              />
              <FormInput
                label="Email Address"
                placeholder="john@example.com"
                type="email"
                error={errors.email}
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
              />
            </div>

            <FormInput
              label="Subject"
              placeholder="Question about wash pricing / service issue"
              error={errors.subject}
              {...register('subject', { required: 'Subject is required' })}
            />

            <FormInput
              label="Message"
              placeholder="How can we assist you today? Please provide as much detail as possible..."
              textarea
              rows={4}
              error={errors.message}
              {...register('message', { required: 'Message body is required' })}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full md:w-auto px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white rounded-xl text-sm font-bold shadow-md shadow-emerald-100 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-75 transition-all mt-4"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <>
                  <Send size={16} />
                  Send Message
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '../../store/useAuthStore';
import FormInput from '../../components/common/FormInput';
import { User, Phone, MapPin, Loader2, Camera } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function UserProfile() {
  const { profile, updateProfile, loading } = useAuthStore();
  const [avatarPreview, setAvatarPreview] = useState('');
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  // Populate form with current profile details
  useEffect(() => {
    if (profile) {
      setValue('fullName', profile.full_name || '');
      setValue('phone', profile.phone || '');
      setValue('address', profile.address || '');
      setAvatarPreview(profile.avatar_url || '');
    }
  }, [profile, setValue]);

  // Convert uploaded image to Base64 so it stores easily in profiles.avatar_url
  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image size must be smaller than 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      const res = await updateProfile({
        full_name: data.fullName,
        phone: data.phone,
        address: data.address,
        avatar_url: avatarPreview,
      });
      if (res.success) {
        toast.success('Profile updated successfully!');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="pt-28 pb-16 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 min-h-screen">
      {/* Header */}
      <div className="flex flex-col gap-2 max-w-xl">
        <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
          Account Settings
        </span>
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
          Edit Profile Details
        </h1>
        <p className="text-slate-500 text-sm">
          Keep your contact information and default address updated to ensure seamless laundry collection.
        </p>
      </div>

      <div className="glass-card p-8 rounded-3xl border border-slate-100 shadow-premium">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Avatar Section */}
          <div className="flex flex-col items-center gap-3 pb-6 border-b border-slate-100">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-emerald-500 to-green-600 text-white flex items-center justify-center font-bold text-2xl overflow-hidden border-4 border-white shadow-md relative">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar Preview" className="w-full h-full object-cover" />
                ) : (
                  <span>{profile?.full_name?.charAt(0).toUpperCase() || 'U'}</span>
                )}
              </div>
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center cursor-pointer border-2 border-white shadow-md hover:bg-emerald-500 transition-colors"
              >
                <Camera size={14} />
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>
            <span className="text-xs font-bold text-slate-400">Click icon to change picture</span>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <FormInput
              label="Full Name"
              placeholder="John Doe"
              error={errors.fullName}
              {...register('fullName', { required: 'Full name is required' })}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Email Address (Linked with Account)"
                type="email"
                value={profile?.email || ''}
                disabled
                className="bg-slate-50 text-slate-400 border-slate-100 cursor-not-allowed"
              />

              <FormInput
                label="Phone Number"
                placeholder="+1 (555) 019-2834"
                error={errors.phone}
                {...register('phone', { required: 'Phone number is required' })}
              />
            </div>

            <FormInput
              label="Default Pickup Address"
              placeholder="123 Street Name, Apt, City, State"
              error={errors.address}
              textarea
              rows={3}
              {...register('address', { required: 'Address is required for scheduling pickups' })}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={saving}
            className="w-full md:w-auto px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white rounded-xl text-sm font-bold shadow-md shadow-emerald-100 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-75 transition-all"
          >
            {saving ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              'Save Changes'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

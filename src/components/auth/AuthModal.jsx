import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Phone, MapPin, Loader2 } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useModalStore } from '../../store/useModalStore';
import Modal from '../common/Modal';
import FormInput from '../common/FormInput';
import { toast } from 'react-hot-toast';

export default function AuthModal() {
  const { isAuthOpen, authTab, closeAuth, setAuthTab, onAuthSuccessCallback } = useModalStore();
  const { signIn, signUp, signInWithGoogle, resetPassword } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const handleTabChange = (tab) => {
    setAuthTab(tab);
    reset();
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (authTab === 'login') {
        const res = await signIn({ email: data.email, password: data.password });
        if (res.success) {
          closeAuth();
          if (onAuthSuccessCallback) onAuthSuccessCallback();
        }
      } else if (authTab === 'register') {
        const res = await signUp({
          email: data.email,
          password: data.password,
          fullName: data.fullName,
          phone: data.phone,
          address: data.address,
        });
        if (res.success) {
          setAuthTab('login');
          reset();
        }
      } else if (authTab === 'forgot') {
        const res = await resetPassword(data.email);
        if (res.success) {
          setAuthTab('login');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isAuthOpen}
      onClose={closeAuth}
      title={
        authTab === 'login'
          ? 'Welcome Back'
          : authTab === 'register'
          ? 'Create Account'
          : 'Reset Password'
      }
      size="md"
    >
      <div className="flex flex-col gap-5 mt-2">
        {/* Tabs switcher */}
        {authTab !== 'forgot' && (
          <div className="flex bg-slate-100 p-1.5 rounded-2xl">
            <button
              onClick={() => handleTabChange('login')}
              className={`flex-1 py-2 text-sm font-bold rounded-xl transition-all ${
                authTab === 'login'
                  ? 'bg-white text-emerald-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Log In
            </button>
            <button
              onClick={() => handleTabChange('register')}
              className={`flex-1 py-2 text-sm font-bold rounded-xl transition-all ${
                authTab === 'register'
                  ? 'bg-white text-emerald-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Sign Up
            </button>
          </div>
        )}

        {/* Auth form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {authTab === 'register' && (
            <>
              <FormInput
                label="Full Name"
                placeholder="John Doe"
                error={errors.fullName}
                {...register('fullName', { required: 'Full name is required' })}
              />
              <FormInput
                label="Phone Number"
                placeholder="+1 (555) 019-2834"
                error={errors.phone}
                {...register('phone', { required: 'Phone number is required' })}
              />
              <FormInput
                label="Pickup Address"
                placeholder="123 Street Name, Apt, City, State"
                error={errors.address}
                textarea
                rows={2}
                {...register('address', { required: 'Default address is required for pickups' })}
              />
            </>
          )}

          <FormInput
            label="Email Address"
            type="email"
            placeholder="name@example.com"
            error={errors.email}
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            })}
          />

          {authTab !== 'forgot' && (
            <FormInput
              label="Password"
              type="password"
              placeholder="••••••••"
              error={errors.password}
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
            />
          )}

          {authTab === 'login' && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setAuthTab('forgot')}
                className="text-xs font-semibold text-emerald-600 hover:underline"
              >
                Forgot Password?
              </button>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-emerald-100 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 transition-all"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : authTab === 'login' ? (
              'Log In'
            ) : authTab === 'register' ? (
              'Create Account'
            ) : (
              'Send Reset Link'
            )}
          </button>
        </form>

        {authTab !== 'forgot' && (
          <>
            <div className="relative flex items-center justify-center my-2">
              <div className="absolute w-full border-t border-slate-100" />
              <span className="relative bg-white px-3 text-xs font-bold text-slate-400 uppercase">
                Or continue with
              </span>
            </div>

            {/* Google OAuth Button */}
            <button
              onClick={signInWithGoogle}
              type="button"
              className="w-full py-3 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-bold flex items-center justify-center gap-2.5 shadow-sm transition-all transform hover:scale-[1.01] active:scale-[0.99]"
            >
              {/* Google Branded SVG */}
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.69c-.29 1.5-.14 3.03-3.3 5.14v4.28h5.34c3.12-2.88 4.93-7.12 4.93-11.27z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.97-1.08 7.96-2.93l-5.34-4.28c-1.48.99-3.37 1.58-5.34 1.58-4.11 0-7.59-2.77-8.83-6.5H.12v4.41C2.1 20.26 6.81 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M3.17 11.87c-.32-.96-.5-1.98-.5-3.03s.18-2.07.5-3.03V1.4H.12C.04 2.1 0 2.87 0 3.65s.04 1.55.12 2.25l3.05 5.97z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.97 1.19 15.24 0 12 0 6.81 0 2.1 3.74.12 7.84l3.05 5.97c1.24-3.73 4.72-6.5 8.83-6.5z"
                />
              </svg>
              Continue with Google
            </button>
          </>
        )}

        {authTab === 'forgot' && (
          <button
            onClick={() => setAuthTab('login')}
            className="text-xs font-bold text-slate-500 hover:text-slate-800 text-center hover:underline"
          >
            Back to Log In
          </button>
        )}
      </div>
    </Modal>
  );
}

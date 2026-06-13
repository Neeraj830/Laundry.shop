import { create } from 'zustand';
import { supabase } from '../supabase/client';
import { notificationService } from '../services/notificationService';
import { toast } from 'react-hot-toast';

export const useAuthStore = create((set, get) => ({
  user: null,
  profile: null,
  loading: true,
  error: null,

  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  // Initialize and listen to Auth state changes
  initialize: async () => {
    set({ loading: true });
    
    // Check active session
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Session retrieval error:', error);
      set({ loading: false });
      return;
    }

    if (session?.user) {
      set({ user: session.user });
      await get().fetchProfile(session.user.id);
    } else {
      set({ user: null, profile: null, loading: false });
    }

    // Listen to changes
    supabase.auth.onAuthStateChange(async (event, currentSession) => {
      if (currentSession?.user) {
        set({ user: currentSession.user });
        await get().fetchProfile(currentSession.user.id);
      } else {
        set({ user: null, profile: null, loading: false });
      }
    });
  },

  // Fetch profiles table record
  fetchProfile: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        // If profile doesn't exist, we might need to retry or it will be created by trigger
        console.warn('Profile not found, waiting for trigger or retrying...', error);
        // Wait 1.5s and retry once in case trigger is running
        await new Promise((r) => setTimeout(r, 1500));
        const { data: retryData, error: retryError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (retryError) throw retryError;
        set({ profile: retryData, loading: false });
      } else {
        set({ profile: data, loading: false });
      }
    } catch (err) {
      console.error('Fetch profile error:', err);
      set({ loading: false });
    }
  },

  // SignUp with Email and Password
  signUp: async ({ email, password, fullName, phone, address }) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone,
            address,
          },
        },
      });

      if (error) throw error;

      if (data?.user) {
        // Trigger welcome notification
        await notificationService.sendNotification({
          userId: data.user.id,
          email: email,
          type: 'welcome',
          subject: 'Welcome to LaundryShop! 🧺',
          body: `Hi ${fullName || 'there'},\n\nThank you for choosing LaundryShop! Your account has been registered successfully. You can now book laundry pickups directly from your dashboard.`
        });
      }

      toast.success('Registration successful! Please log in.');
      set({ loading: false });
      return { success: true };
    } catch (err) {
      toast.error(err.message || 'Registration failed');
      set({ error: err.message, loading: false });
      return { success: false, error: err.message };
    }
  },

  // SignIn with Email and Password
  signIn: async ({ email, password }) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      toast.success('Successfully logged in!');
      set({ loading: false });
      return { success: true };
    } catch (err) {
      toast.error(err.message || 'Login failed');
      set({ error: err.message, loading: false });
      return { success: false, error: err.message };
    }
  },

  // Google OAuth Login
  signInWithGoogle: async () => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/orders`
        }
      });
      if (error) throw error;
    } catch (err) {
      toast.error(err.message || 'Google authentication failed');
      set({ error: err.message, loading: false });
    }
  },

  // Password Reset
  resetPassword: async (email) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/orders`,
      });
      if (error) throw error;
      toast.success(`Password reset link sent to ${email}`);
      set({ loading: false });
      return { success: true };
    } catch (err) {
      toast.error(err.message || 'Failed to send reset link');
      set({ error: err.message, loading: false });
      return { success: false, error: err.message };
    }
  },

  // Sign Out
  signOut: async () => {
    set({ loading: true });
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Supabase signout error, proceeding with local signout:', err);
    } finally {
      set({ user: null, profile: null, loading: false });
      toast.success('Logged out successfully');
    }
  },

  // Update profile attributes
  updateProfile: async (profileUpdates) => {
    set({ loading: true });
    const { user } = get();
    if (!user) {
      toast.error('You must be logged in to update your profile');
      set({ loading: false });
      return { success: false };
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update(profileUpdates)
        .eq('id', user.id);

      if (error) throw error;

      set((state) => ({
        profile: { ...state.profile, ...profileUpdates },
        loading: false,
      }));
      toast.success('Profile updated successfully!');
      return { success: true };
    } catch (err) {
      toast.error(err.message || 'Profile update failed');
      set({ loading: false });
      return { success: false, error: err.message };
    }
  },
}));

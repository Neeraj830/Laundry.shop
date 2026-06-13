import { create } from 'zustand';

export const useModalStore = create((set) => ({
  // Auth Modal State
  isAuthOpen: false,
  authTab: 'login', // 'login' | 'register' | 'forgot'
  onAuthSuccessCallback: null, // Custom callback to trigger after login/signup completes

  openAuth: (tab = 'login', callback = null) => 
    set({ isAuthOpen: true, authTab: tab, onAuthSuccessCallback: callback }),
  closeAuth: () => 
    set({ isAuthOpen: false, onAuthSuccessCallback: null }),
  setAuthTab: (tab) => 
    set({ authTab: tab }),

  // Booking Modal State
  isBookingOpen: false,
  selectedService: null,

  openBooking: (service = null) => 
    set({ isBookingOpen: true, selectedService: service }),
  closeBooking: () => 
    set({ isBookingOpen: false, selectedService: null }),
}));

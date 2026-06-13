import { create } from 'zustand';
import { supabase } from '../supabase/client';
import { notificationService } from '../services/notificationService';
import { toast } from 'react-hot-toast';

export const useLaundryStore = create((set, get) => ({
  services: [],
  orders: [],
  adminOrders: [],
  users: [],
  notifications: [],
  faqs: [],
  platformSettings: null,
  loading: false,
  ordersListener: null,
  servicesListener: null,
  notificationsListener: null,
  faqsListener: null,

  setLoading: (loading) => set({ loading }),

  // 1. SERVICES CRUD
  fetchServices: async (showInactive = false) => {
    set({ loading: true });
    try {
      let query = supabase.from('services').select('*').order('created_at', { ascending: true });
      if (!showInactive) {
        query = query.eq('active', true);
      }
      const { data, error } = await query;
      if (error) throw error;
      set({ services: data, loading: false });
    } catch (err) {
      console.error('Error fetching services:', err);
      set({ loading: false });
    }
  },

  createService: async (serviceData) => {
    set({ loading: true });
    try {
      const { data, error } = await supabase.from('services').insert(serviceData).select().single();
      if (error) throw error;
      set((state) => ({
        services: [...state.services, data],
        loading: false
      }));
      toast.success('Service added successfully');
      return { success: true };
    } catch (err) {
      toast.error(err.message || 'Failed to add service');
      set({ loading: false });
      return { success: false, error: err.message };
    }
  },

  updateService: async (serviceId, updates) => {
    set({ loading: true });
    try {
      const { data, error } = await supabase.from('services').update(updates).eq('id', serviceId).select().single();
      if (error) throw error;
      set((state) => ({
        services: state.services.map((s) => (s.id === serviceId ? data : s)),
        loading: false
      }));
      toast.success('Service updated successfully');
      return { success: true };
    } catch (err) {
      toast.error(err.message || 'Failed to update service');
      set({ loading: false });
      return { success: false, error: err.message };
    }
  },

  deleteService: async (serviceId) => {
    set({ loading: true });
    try {
      const { error } = await supabase.from('services').delete().eq('id', serviceId);
      if (error) throw error;
      set((state) => ({
        services: state.services.filter((s) => s.id !== serviceId),
        loading: false
      }));
      toast.success('Service deleted successfully');
      return { success: true };
    } catch (err) {
      toast.error(err.message || 'Failed to delete service');
      set({ loading: false });
      return { success: false, error: err.message };
    }
  },

  // 2. ORDERS CRUD
  fetchUserOrders: async (userId) => {
    if (!userId) return;
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          services (
            title,
            estimated_time,
            price
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ orders: data, loading: false });
    } catch (err) {
      console.error('Error fetching user orders:', err);
      set({ loading: false });
    }
  },

  fetchAdminOrders: async () => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          profiles (
            full_name,
            email,
            phone
          ),
          services (
            title
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ adminOrders: data, loading: false });
    } catch (err) {
      console.error('Error fetching admin orders:', err);
      set({ loading: false });
    }
  },

  createOrder: async (orderData, userProfile) => {
    set({ loading: true });
    try {
      const { data, error } = await supabase.from('orders').insert(orderData).select().single();
      if (error) throw error;

      // Fetch the service title for email
      const { data: service } = await supabase.from('services').select('title').eq('id', orderData.service_id).single();

      // Trigger Confirmation notification
      await notificationService.sendNotification({
        userId: orderData.user_id,
        email: userProfile.email,
        type: 'booking_confirmed',
        subject: `Laundry Booking Confirmed! Order #${data.id.substring(0, 8).toUpperCase()}`,
        body: `Dear ${userProfile.full_name},\n\nWe have received your laundry booking for "${service?.title || 'Laundry Services'}".\n\nOrder Details:\n- Quantity: ${orderData.quantity} item(s)\n- Total Cost: ₹${orderData.total_price.toFixed(2)}\n- Pickup Scheduled: ${new Date(orderData.pickup_date).toLocaleDateString()}\n- Estimated Delivery: ${new Date(orderData.dropoff_date).toLocaleDateString()}\n- Pickup Address: ${orderData.pickup_address}\n\nOur delivery runner will arrive during the scheduled pickup window. Thank you for booking with LaundryShop!`
      });

      set({ loading: false });
      toast.success('Order booked successfully! Confirmation email simulated.');
      return { success: true, order: data };
    } catch (err) {
      toast.error(err.message || 'Failed to place booking');
      set({ loading: false });
      return { success: false, error: err.message };
    }
  },

  createOrdersBulk: async (ordersData, userProfile) => {
    set({ loading: true });
    try {
      const { data, error } = await supabase.from('orders').insert(ordersData).select();
      if (error) throw error;

      // Send confirmation emails for each order
      for (const order of data) {
        const service = get().services.find((s) => s.id === order.service_id);
        await notificationService.sendNotification({
          userId: order.user_id,
          email: userProfile.email,
          type: 'booking_confirmed',
          subject: `Laundry Booking Confirmed! Order #${order.id.substring(0, 8).toUpperCase()}`,
          body: `Dear ${userProfile.full_name},\n\nWe have received your laundry booking for "${service?.title || 'Laundry Services'}".\n\nOrder Details:\n- Quantity: ${order.quantity} item(s)\n- Total Cost: ₹${order.total_price.toFixed(2)}\n- Pickup Scheduled: ${new Date(order.pickup_date).toLocaleDateString()}\n- Estimated Delivery: ${new Date(order.dropoff_date).toLocaleDateString()}\n- Pickup Address: ${order.pickup_address}\n\nOur delivery runner will arrive during the scheduled pickup window. Thank you for booking with LaundryShop!`
        });
      }

      set({ loading: false });
      toast.success(`${data.length} order(s) booked successfully!`);
      return { success: true };
    } catch (err) {
      toast.error(err.message || 'Failed to place booking');
      set({ loading: false });
      return { success: false, error: err.message };
    }
  },

  updateOrderStatus: async (orderId, newStatus, paymentStatus = null, orderEmail = null, userName = null, userId = null) => {
    try {
      const updates = { status: newStatus };
      if (paymentStatus) {
        updates.payment_status = paymentStatus;
      }
      
      const { data, error } = await supabase
        .from('orders')
        .update(updates)
        .eq('id', orderId)
        .select()
        .single();

      if (error) throw error;

      // Trigger notification if email/user details are provided
      if (orderEmail && userName && userId) {
        const formattedStatus = newStatus.replace('_', ' ').toUpperCase();
        await notificationService.sendNotification({
          userId: userId,
          email: orderEmail,
          type: 'status_update',
          subject: `LaundryShop Order #${orderId.substring(0, 8).toUpperCase()} Status Update: ${formattedStatus}`,
          body: `Hi ${userName},\n\nYour LaundryShop order #${orderId.substring(0, 8).toUpperCase()} has updated to: ${formattedStatus}.\n\nEstimated Drop-off Date: ${new Date(data.dropoff_date).toLocaleDateString()}\nPayment Status: ${data.payment_status.toUpperCase()}\n\nYou can track the live progress in your dashboard. Thank you for laundry booking!`
        });
      }

      toast.success(`Order status updated to ${newStatus}`);
      return { success: true };
    } catch (err) {
      toast.error(err.message || 'Failed to update order status');
      return { success: false, error: err.message };
    }
  },

  updateOrderDates: async (orderId, pickupDate, dropoffDate, reason, orderEmail, userName, userId) => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update({
          pickup_date: pickupDate,
          dropoff_date: dropoffDate
        })
        .eq('id', orderId)
        .select()
        .single();

      if (error) throw error;

      // Trigger notification if email/user details are provided
      if (orderEmail && userName && userId) {
        await notificationService.sendNotification({
          userId: userId,
          email: orderEmail,
          type: 'status_update',
          subject: `LaundryShop Order Rescheduled: Order #${orderId.substring(0, 8).toUpperCase()}`,
          body: `Dear ${userName},\n\nYour LaundryShop order #${orderId.substring(0, 8).toUpperCase()} has been rescheduled.\n\nNew Schedule Details:\n- New Pickup Date: ${new Date(pickupDate).toLocaleString()}\n- New Estimated Delivery: ${new Date(dropoffDate).toLocaleString()}\n\nReason for rescheduling:\n"${reason}"\n\nWe apologize for any inconvenience. You can track your order status in your account.\n\nThank you for choosing LaundryShop!`
        });
      }

      toast.success('Order schedule updated successfully!');
      return { success: true };
    } catch (err) {
      toast.error(err.message || 'Failed to update order dates');
      return { success: false, error: err.message };
    }
  },

  deleteOrder: async (orderId) => {
    try {
      const { error } = await supabase.from('orders').delete().eq('id', orderId);
      if (error) throw error;
      set((state) => ({
        adminOrders: state.adminOrders.filter((o) => o.id !== orderId),
        orders: state.orders.filter((o) => o.id !== orderId)
      }));
      toast.success('Order deleted successfully');
      return { success: true };
    } catch (err) {
      toast.error(err.message || 'Failed to delete order');
      return { success: false, error: err.message };
    }
  },

  // 3. USER MANAGEMENT (Admin Only)
  fetchAdminUsers: async () => {
    set({ loading: true });
    try {
      const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      set({ users: data, loading: false });
    } catch (err) {
      console.error('Error fetching profiles:', err);
      set({ loading: false });
    }
  },

  updateUserRole: async (userId, role) => {
    try {
      const { error } = await supabase.from('profiles').update({ role }).eq('id', userId);
      if (error) throw error;
      set((state) => ({
        users: state.users.map((u) => (u.id === userId ? { ...u, role } : u))
      }));
      toast.success(`User role updated to ${role}`);
      return { success: true };
    } catch (err) {
      toast.error(err.message || 'Failed to update user role');
      return { success: false, error: err.message };
    }
  },

  // 4. PLATFORM SETTINGS
  fetchPlatformSettings: async () => {
    try {
      const { data, error } = await supabase
        .from('platform_settings')
        .select('*')
        .eq('id', 1)
        .single();

      if (error) throw error;
      set({ platformSettings: data });
      return data;
    } catch (err) {
      console.error('Error fetching platform settings:', err);
      return null;
    }
  },

  updatePlatformSettings: async (settings) => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('platform_settings')
        .update(settings)
        .eq('id', 1)
        .select()
        .single();

      if (error) throw error;
      set({ platformSettings: data, loading: false });
      toast.success('System settings saved successfully!');
      return { success: true };
    } catch (err) {
      toast.error(err.message || 'Failed to save settings');
      set({ loading: false });
      return { success: false, error: err.message };
    }
  },

  submitContactForm: async (formData) => {
    try {
      const { error } = await supabase.from('contact_submissions').insert({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
      });
      if (error) throw error;

      if (window.Email) {
        const host = import.meta.env.VITE_SMTP_HOST;
        const username = import.meta.env.VITE_SMTP_USERNAME;
        const password = import.meta.env.VITE_SMTP_PASSWORD;
        const toEmail = import.meta.env.VITE_SMTP_TO || 'support@laundryshop.com';
        const fromEmail = import.meta.env.VITE_SMTP_FROM || 'notifications@laundryshop.com';

        if (username && password) {
          const body = `
            <h3>New Contact Inquiry</h3>
            <p><strong>Name:</strong> ${formData.name}</p>
            <p><strong>Email:</strong> ${formData.email}</p>
            <p><strong>Subject:</strong> ${formData.subject}</p>
            <p><strong>Message:</strong></p>
            <p>${formData.message.replace(/\n/g, '<br/>')}</p>
          `;

          const emailRes = await window.Email.send({
            Host: host || 'smtp.elasticemail.com',
            Username: username,
            Password: password,
            To: toEmail,
            From: fromEmail,
            Subject: `LaundryShop Contact Form: ${formData.subject}`,
            Body: body,
          });

          if (emailRes !== 'OK') {
            console.error('[SMTP ERROR] Email send response:', emailRes);
          }
        } else {
          console.warn('SMTP credentials not configured in .env. Email dispatch skipped.');
        }
      } else {
        console.error('SMTPJS library not loaded on window. Email dispatch skipped.');
      }

      return { success: true };
    } catch (err) {
      console.error('Error submitting contact form:', err);
      return { success: false, error: err.message };
    }
  },

  // 5. NOTIFICATIONS
  fetchNotifications: async (userId) => {
    if (!userId) return;
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ notifications: data });
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  },

  markNotificationRead: async (notificationId) => {
    const success = await notificationService.markAsRead(notificationId);
    if (success) {
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === notificationId ? { ...n, read: true } : n
        ),
      }));
    }
    return success;
  },

  markAllNotificationsRead: async (userId) => {
    const success = await notificationService.markAllAsRead(userId);
    if (success) {
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, read: true })),
      }));
    }
    return success;
  },

  // 6. REALTIME SUBSCRIPTIONS
  subscribeToOrders: (userId, isAdmin = false) => {
    const existing = get().ordersListener;
    if (existing) {
      existing.unsubscribe();
    }

    const channel = supabase
      .channel('orders-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        async (payload) => {
          console.log('Realtime Order Event received:', payload);
          // Refetch orders list immediately depending on user role
          if (isAdmin) {
            get().fetchAdminOrders();
          } else {
            get().fetchUserOrders(userId);
          }
        }
      )
      .subscribe();

    set({ ordersListener: channel });
  },

  subscribeToServices: () => {
    const existing = get().servicesListener;
    if (existing) {
      existing.unsubscribe();
    }

    const channel = supabase
      .channel('services-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'services' },
        (payload) => {
          console.log('Realtime Service Event received:', payload);
          get().fetchServices(true);
        }
      )
      .subscribe();

    set({ servicesListener: channel });
  },

  subscribeToNotifications: (userId) => {
    if (!userId) return;
    const existing = get().notificationsListener;
    if (existing) {
      existing.unsubscribe();
    }

    const channel = supabase
      .channel('notifications-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` },
        (payload) => {
          console.log('Realtime Notification Event received:', payload);
          get().fetchNotifications(userId);
        }
      )
      .subscribe();

    set({ notificationsListener: channel });
  },

  unsubscribeAll: () => {
    const { ordersListener, servicesListener, notificationsListener } = get();
    if (ordersListener) ordersListener.unsubscribe();
    if (servicesListener) servicesListener.unsubscribe();
    if (notificationsListener) notificationsListener.unsubscribe();
    set({ ordersListener: null, servicesListener: null, notificationsListener: null });
  }
}));

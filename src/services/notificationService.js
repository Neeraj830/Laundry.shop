import { supabase } from '../supabase/client';
import { toast } from 'react-hot-toast';

export const notificationService = {
  /**
   * Simulates sending an email notification by showing a toast,
   * printing to the console, and inserting into the database notifications table.
   * 
   * @param {string} userId - UUID of the user
   * @param {string} email - Email address
   * @param {string} type - Notification type ('welcome', 'booking_confirmed', 'status_update', 'contact')
   * @param {string} subject - Subject line
   * @param {string} body - Email body message
   */
  async sendNotification({ userId, email, type, subject, body }) {
    // 1. Log to console in a nice styled format
    console.log(
      `%c[EMAIL DISPATCH] %cTo: ${email}\n%cSubject: ${subject}\n%cBody: ${body}`,
      'color: #10b981; font-weight: bold; font-size: 1.1em;',
      'color: #3b82f6; font-weight: bold;',
      'color: #f59e0b; font-weight: bold;',
      'color: #374151;'
    );

    // 2. Insert into the notifications table in Supabase if logged in
    if (userId) {
      try {
        const { error } = await supabase.from('notifications').insert({
          user_id: userId,
          type,
          subject,
          body,
          read: false,
        });
        if (error) throw error;
      } catch (err) {
        console.error('Error logging notification to database:', err);
      }
    }

    // 3. Inform the user visually (skip toast for contact form — caller handles it)
    if (type !== 'contact') {
      toast.success(`Notification sent to ${email}`, {
        duration: 4000,
        icon: '✉️',
      });
    }
  },

  async markAsRead(notificationId) {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);
      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Error marking notification as read:', err);
      return false;
    }
  },

  async markAllAsRead(userId) {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', userId);
      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
      return false;
    }
  }
};

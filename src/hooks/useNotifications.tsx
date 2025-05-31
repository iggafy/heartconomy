
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  data: any;
}

export function useNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const hasInitiallyLoaded = useRef(false);
  const isMarkingAllAsRead = useRef(false);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      setupRealtimeSubscription();
    }
  }, [user]);

  const setupRealtimeSubscription = () => {
    if (!user) return;

    const channel = supabase
      .channel('notifications-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('New notification received:', payload);
          const newNotification = payload.new as Notification;
          
          // Only add if we haven't seen this notification before
          setNotifications(prev => {
            const exists = prev.some(n => n.id === newNotification.id);
            if (exists) return prev;
            return [newNotification, ...prev];
          });
          
          if (!newNotification.read) {
            setUnreadCount(prev => prev + 1);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Notification updated:', payload);
          const updatedNotification = payload.new as Notification;
          const oldNotification = payload.old as Notification;
          
          setNotifications(prev => 
            prev.map(n => 
              n.id === updatedNotification.id ? updatedNotification : n
            )
          );
          
          // Update unread count based on read status change
          if (!oldNotification.read && updatedNotification.read) {
            setUnreadCount(prev => Math.max(0, prev - 1));
          } else if (oldNotification.read && !updatedNotification.read) {
            setUnreadCount(prev => prev + 1);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const fetchNotifications = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      // Only update if we haven't initially loaded or if we're forcing a refresh
      if (!hasInitiallyLoaded.current) {
        setNotifications(data || []);
        setUnreadCount((data || []).filter(n => !n.read).length);
        hasInitiallyLoaded.current = true;
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      // Update local state immediately for better UX
      const notificationToUpdate = notifications.find(n => n.id === notificationId);
      if (notificationToUpdate && !notificationToUpdate.read) {
        setNotifications(prev => 
          prev.map(n => 
            n.id === notificationId ? { ...n, read: true } : n
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }

      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId)
        .eq('user_id', user?.id);

      if (error) {
        console.error('Error marking notification as read:', error);
        // Revert local state on error
        if (notificationToUpdate && !notificationToUpdate.read) {
          setNotifications(prev => 
            prev.map(n => 
              n.id === notificationId ? { ...n, read: false } : n
            )
          );
          setUnreadCount(prev => prev + 1);
        }
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    if (!user || isMarkingAllAsRead.current) return;
    
    isMarkingAllAsRead.current = true;

    try {
      // Get all unread notification IDs first
      const unreadNotifications = notifications.filter(n => !n.read);
      
      if (unreadNotifications.length === 0) {
        isMarkingAllAsRead.current = false;
        return;
      }

      // Update local state immediately
      setNotifications(prev => 
        prev.map(n => ({ ...n, read: true }))
      );
      setUnreadCount(0);

      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id)
        .eq('read', false);

      if (error) {
        console.error('Error marking all notifications as read:', error);
        // Revert local state on error
        setNotifications(prev => 
          prev.map(n => {
            const wasUnread = unreadNotifications.some(un => un.id === n.id);
            return wasUnread ? { ...n, read: false } : n;
          })
        );
        setUnreadCount(unreadNotifications.length);
      } else {
        console.log('Successfully marked all notifications as read');
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      // Revert on error
      const unreadNotifications = notifications.filter(n => !n.read);
      setNotifications(prev => 
        prev.map(n => {
          const wasUnread = unreadNotifications.some(un => un.id === n.id);
          return wasUnread ? { ...n, read: false } : n;
        })
      );
      setUnreadCount(unreadNotifications.length);
    } finally {
      isMarkingAllAsRead.current = false;
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      // Update local state immediately
      const notificationToDelete = notifications.find(n => n.id === notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      if (notificationToDelete && !notificationToDelete.read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }

      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId)
        .eq('user_id', user?.id);

      if (error) {
        console.error('Error deleting notification:', error);
        // Revert local state on error
        if (notificationToDelete) {
          setNotifications(prev => [notificationToDelete, ...prev]);
          if (!notificationToDelete.read) {
            setUnreadCount(prev => prev + 1);
          }
        }
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  return {
    notifications,
    loading,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    fetchNotifications
  };
}

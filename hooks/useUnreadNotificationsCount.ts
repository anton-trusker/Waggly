import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export function useUnreadNotificationsCount() {
  const { user } = useAuth();
  const [count, setCount] = useState<number>(0);

  const fetchCount = useCallback(async () => {
    if (!user) {
      setCount(0);
      return;
    }
    const { count: c, error } = await supabase
      .from('notifications')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('is_read', false);
    if (!error && typeof c === 'number') setCount(c);
  }, [user]);

  useEffect(() => {
    fetchCount();
    if (!user) return;
    const channel = supabase
      .channel('unread-notifications')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` },
        () => fetchCount()
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchCount]);

  return { count, refresh: fetchCount };
}


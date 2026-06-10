import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const useAdvocateStatus = () => {
  const { user } = useAuth();
  const [isAdvocate, setIsAdvocate] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdvocateStatus = async () => {
      if (!user) {
        setIsAdvocate(false);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('advocates')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();

        setIsAdvocate(!!data && !error);
      } catch {
        setIsAdvocate(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdvocateStatus();
  }, [user]);

  return { isAdvocate, loading };
};

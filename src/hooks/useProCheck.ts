import { useEffect, useState } from 'react';
import { auth } from '../firebase';
import { supabase } from '../lib/supabase';

export function useProCheck() {
  const [isPro, setIsPro] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function checkStatus() {
      const user = auth.currentUser;
      if (!user) {
        setChecking(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('is_pro')
          .eq('user_id', user.uid)
          .single();
        
        if (error) {
          console.error("Error checking pro status:", error);
        } else {
          setIsPro(data?.is_pro || false);
        }
      } catch (err) {
        console.error("Unexpected error checking pro status:", err);
      } finally {
        setChecking(false);
      }
    }

    // Listen for auth state changes to re-check
    const unsubscribe = auth.onAuthStateChanged(() => {
      checkStatus();
    });

    checkStatus();

    return () => unsubscribe();
  }, []);

  return { isPro, checking };
}

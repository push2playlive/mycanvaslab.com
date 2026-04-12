// src/store/profileStore.ts
import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface ProfileState {
  profile: any | null;
  isAdmin: boolean;
  isPro: boolean;
  loading: boolean;
  fetchProfile: (userId: string) => Promise<void>;
  updateProfile: (updates: any) => Promise<void>;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  profile: null,
  isAdmin: false,
  isPro: false,
  loading: false,

  fetchProfile: async (userId) => {
    set({ loading: true });
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (data) {
      set({ profile: data, isAdmin: data.is_admin, isPro: data.is_pro, loading: false });
    } else {
      set({ loading: false });
    }
  },

  updateProfile: async (updates) => {
    const { profile } = get();
    if (!profile) return;
    const { error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('user_id', profile.user_id);
    
    if (!error) set({ profile: { ...profile, ...updates } });
  }
}));

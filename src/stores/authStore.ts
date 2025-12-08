import { create } from 'zustand';
import { supabase, authHelpers } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

interface Profile {
  id: string;
  full_name: string | null;
  display_name: string | null;
  email: string | null;
  avatar_url: string | null;
  location: string | null;
  bio: string | null;
  rating: number;
  is_verified: boolean;
}

interface AuthState {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  
  // Actions
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  loadUser: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ success: boolean; error?: string }>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  isLoading: true,
  isAuthenticated: false,

  signIn: async (email: string, password: string) => {
    try {
      const { data, error } = await authHelpers.signIn(email, password);
      
      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        // Profil bilgilerini getir
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        set({
          user: data.user,
          profile: profileData,
          isAuthenticated: true,
        });
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Giriş yapılırken bir hata oluştu' };
    }
  },

  signUp: async (email: string, password: string, fullName: string) => {
    try {
      const { data, error } = await authHelpers.signUp(email, password, fullName);
      
      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        // Profil oluştur
        await supabase.from('profiles').insert({
          id: data.user.id,
          email: data.user.email,
          full_name: fullName,
          display_name: fullName,
          is_verified: false,
          rating: 0,
        });

        set({
          user: data.user,
          isAuthenticated: true,
        });
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Kayıt olurken bir hata oluştu' };
    }
  },

  signOut: async () => {
    await authHelpers.signOut();
    set({
      user: null,
      profile: null,
      isAuthenticated: false,
    });
  },

  loadUser: async () => {
    try {
      set({ isLoading: true });
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Profil bilgilerini getir
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        set({
          user,
          profile: profileData,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({
          user: null,
          profile: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } catch (error) {
      set({
        user: null,
        profile: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  updateProfile: async (updates: Partial<Profile>) => {
    try {
      const { user } = get();
      if (!user) {
        return { success: false, error: 'Kullanıcı girişi gerekli' };
      }

      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      set({ profile: data });
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Profil güncellenirken bir hata oluştu' };
    }
  },
}));

// Auth state değişikliklerini dinle
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN' && session?.user) {
    useAuthStore.getState().loadUser();
  } else if (event === 'SIGNED_OUT') {
    useAuthStore.setState({
      user: null,
      profile: null,
      isAuthenticated: false,
    });
  }
});

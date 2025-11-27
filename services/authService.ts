import { supabase } from '../lib/supabaseClient';
import { User } from '../types';

export const AuthService = {
  login: async (email: string, password: string): Promise<boolean> => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Login failed:", error.message);
      return false;
    }

    return !!data.session;
  },

  logout: async () => {
    await supabase.auth.signOut();
  },

  getCurrentUser: async (): Promise<User | null> => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;

    return {
      email: user.email || '',
      name: 'Admin', // Supabase basic auth doesn't store name by default, simplified for now
      role: 'admin' 
    };
  },

  isAuthenticated: async (): Promise<boolean> => {
    const { data } = await supabase.auth.getSession();
    return !!data.session;
  }
};

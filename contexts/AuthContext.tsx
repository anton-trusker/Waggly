import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  profile: any | null; // Added profile state
  refreshProfile: () => Promise<void>; // Added refresh function
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null); // Store profile data
  const [loading, setLoading] = useState(true);
  const emailRedirectTo = process.env.EXPO_PUBLIC_EMAIL_REDIRECT_URL;

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (!error && data) {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session:', session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      setLoading(false);
    }).catch((error) => {
      console.error('Error getting session:', error);
      // If refresh token is invalid, ensure we clear any stale state
      if (error?.message?.includes('Invalid Refresh Token') || error?.message?.includes('Refresh Token Not Found')) {
        supabase.auth.signOut().catch(() => { });
        setSession(null);
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('Auth state changed:', _event, session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string) => {
    // Determine redirect URL: Use env var if set, otherwise fallback to window.origin on web
    let redirectTo = emailRedirectTo;

    // Safety check: specific fix for user having placeholder in env OR localhost
    if (redirectTo && (redirectTo.includes('your-domain.com') || redirectTo.includes('localhost'))) {
      console.log('Skipping explicit redirect_to for localhost/placeholder to avoid 422. Using Supabase default.');
      redirectTo = undefined;
    }

    // Fallback? No, if we cleared it, we leave it clear.
    // Only use window.origin if it's NOT localhost (e.g. valid deployed preview)
    if (!redirectTo && typeof window !== 'undefined' && !window.location.origin.includes('localhost')) {
      redirectTo = window.location.origin;
    }

    const options = redirectTo ? { emailRedirectTo: redirectTo } : undefined;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options,
    });
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
      options: {
        skipBrowserRedirect: true // Sometimes helpful for avoiding unnecessary redirects
      }
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('remember_me');
      }
    } catch { }
    setProfile(null);
  };

  const resetPassword = async (email: string) => {
    const options = emailRedirectTo ? { redirectTo: emailRedirectTo } : undefined;
    const { error } = await supabase.auth.resetPasswordForEmail(email, options as any);
    return { error };
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        loading,
        profile,
        refreshProfile,
        signUp,
        signIn,
        signOut,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

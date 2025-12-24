
// Test file to verify Supabase client initialization
import { supabase } from './supabase';

export async function testSupabaseConnection() {
  try {
    console.log('Testing Supabase connection...');
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Supabase connection error:', error);
      return false;
    }
    
    console.log('Supabase connection successful!');
    console.log('Session:', data.session ? 'Active' : 'No active session');
    return true;
  } catch (error) {
    console.error('Supabase connection test failed:', error);
    return false;
  }
}

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase, testSupabaseConnection } from '../../lib/supabase';

const OwnerLogin: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    console.log('Starting login process...');

    try {
      // Test connection first
      console.log('Testing Supabase connection...');
      const isConnected = await testSupabaseConnection();
      if (!isConnected) {
        throw new Error('Unable to connect to Supabase. Please check your internet connection and try again.');
      }

      // Try to get current session first
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      console.log('Current session:', { session, error: sessionError });

      console.log('Connection successful, attempting to sign in...', { email });
      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log('Sign in response:', { authData, error: signInError });

      if (signInError) {
        console.error('Sign in error:', signInError);
        throw new Error(signInError.message);
      }

      if (!authData?.user) {
        console.error('No user data returned from auth');
        throw new Error('No user data returned');
      }

      console.log('Successfully signed in, checking profile...', { userId: authData.user.id });
      
      // Check if profile exists and is an owner
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', authData.user.id)
        .single();

      console.log('Profile check result:', { profileData, profileError });

      if (profileError) {
        console.log('Profile error detected:', profileError);
        // If no profile exists, create one
        if (profileError.code === 'PGRST116') {
          console.log('Creating new profile...');
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert([
              {
                id: authData.user.id,
                role: 'owner',
                full_name: email.split('@')[0],
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              }
            ])
            .select()
            .single();

          if (createError) {
            console.error('Profile creation error:', createError);
            throw new Error('Failed to create profile: ' + createError.message);
          }
          console.log('Profile created successfully:', newProfile);
        } else {
          console.error('Profile fetch error:', profileError);
          throw new Error('Error fetching profile: ' + profileError.message);
        }
      } else if (profileData.role !== 'owner') {
        console.error('User is not an owner:', profileData);
        throw new Error('Unauthorized: Only retreat owners can access this area');
      }

      console.log('All checks passed, navigating to dashboard...');
      navigate('/dashboard');
    } catch (err) {
      console.error('Login process error:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const testConnection = async () => {
    try {
      const { data, error } = await supabase.from('profiles').select('count').single();
      return !error;
    } catch {
      return false;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your Retreat Owner Account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link to="/auth/owner/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
            register as a retreat owner
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  'Sign in'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Looking to book a retreat?
                </span>
              </div>
            </div>
            <div className="mt-6 text-center">
              <Link
                to="/auth/customer/login"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Sign in as a customer
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerLogin; 
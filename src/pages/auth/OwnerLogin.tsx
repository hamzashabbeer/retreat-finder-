import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@lib/supabase';

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
    
    try {
      // Step 1: Try to sign in
      console.log('🔑 Starting login process...');
      console.log('📧 Attempting to sign in with email:', email);
      
      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        console.error('❌ Sign in error:', signInError);
        throw new Error(`Login failed: ${signInError.message}`);
      }

      if (!authData?.user) {
        console.error('❌ No user data returned');
        throw new Error('No user data returned from authentication');
      }

      console.log('✅ Successfully signed in user:', authData.user.id);

      try {
        // Step 2: Try to create profile first (in case it doesn't exist)
        console.log('👤 Attempting to create/verify profile...');
        const { error: insertError } = await supabase
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
          .single();

        if (insertError) {
          console.log('ℹ️ Insert result:', insertError.message);
          if (!insertError.message.includes('duplicate')) {
            console.error('❌ Error creating profile:', insertError);
            throw insertError;
          }
        }

        // Step 3: Get the profile (whether it was just created or already existed)
        console.log('🔍 Fetching user profile...');
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authData.user.id)
          .single();

        if (profileError) {
          console.error('❌ Error fetching profile:', profileError);
          throw profileError;
        }

        console.log('📋 Profile data:', profileData);

        if (profileData.role !== 'owner') {
          console.error('❌ User is not an owner');
          throw new Error('Unauthorized. Only retreat owners can access this area.');
        }

        // If we get here, the profile exists and is an owner
        console.log('✅ Successfully verified owner profile');
        navigate('/dashboard');
      } catch (profileErr) {
        console.error('❌ Profile error:', profileErr);
        throw new Error('Error setting up user profile. Please contact support.');
      }
    } catch (err) {
      console.error('❌ Login error:', err);
      setError(err instanceof Error ? err.message : 'Failed to login. Please try again.');
    } finally {
      setIsLoading(false);
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

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link to="/auth/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
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
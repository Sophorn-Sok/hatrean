'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { getUserProfile } from '../../lib/database';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { signIn } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error } = await signIn(email, password);
      
      if (error) {
        setError(error.message);
        return;
      }

      if (data.user) {
        // Get user profile from database to check actual role
        try {
          const userProfile = await getUserProfile(data.user.id);
          
          // Redirect based on actual role from database
          if (userProfile && userProfile.role === 'admin') {
            router.push('/admin');
          } else {
            router.push('/homepage');
          }
        } catch (profileError) {
          console.error('Error fetching user profile:', profileError);
          // Fallback to homepage if profile fetch fails
          router.push('/homepage');
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100">
      {/* Header */}
      <header className="flex justify-between items-center p-6 px-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center overflow-hidden">
            <Image 
              src="/logo (2).png" 
              alt="Hat rean Logo" 
              width={24} 
              height={24} 
              className="object-contain"
            />
          </div>
          <h1 className="text-2xl font-bold text-purple-700">Hat rean</h1>
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-2 border border-purple-300 text-purple-700 rounded-full hover:bg-purple-50 transition-colors">
            Login
          </button>
          <Link href="/signuppage">
            <button className="px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors">
              Sign Up
            </button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex items-center justify-center px-4 py-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 w-full max-w-md">
          {/* Game Controller Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gray-600 rounded-lg flex items-center justify-center">
              <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7.5 6.5C7.5 8.981 9.519 11 12 11s4.5-2.019 4.5-4.5S14.481 2 12 2 7.5 4.019 7.5 6.5zM20 21h1v-1c0-3.859-3.141-7-7-7h-4c-3.859 0-7 3.141-7 7v1h1 1 14z"/>
                <path d="M16.5 15h-1c-.276 0-.5.224-.5.5s.224.5.5.5h1c.276 0 .5-.224.5-.5s-.224-.5-.5-.5zm-9 0h-1c-.276 0-.5.224-.5.5s.224.5.5.5h1c.276 0 .5-.224.5-.5s-.224-.5-.5-.5z"/>
              </svg>
            </div>
          </div>

          {/* Welcome Text */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-purple-700 mb-2">Welcome Back!</h2>
            <p className="text-gray-800">Login to continue your quiz journey</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
            
            <div>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full py-3 px-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-500"
                required
                disabled={loading}
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full py-3 px-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-500"
                required
                disabled={loading}
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging in...' : 'Login ✨'}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="text-center mt-6">
            <p className="text-gray-800">
              Don&apos;t have an account?{' '}
              <Link href="/signuppage" className="text-purple-600 hover:text-purple-700 font-medium">
                Sign Up! 🚀
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
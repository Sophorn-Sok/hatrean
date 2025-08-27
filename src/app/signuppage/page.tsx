'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../../../contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
  const [accountType, setAccountType] = useState<'admin' | 'user'>('user');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { signUp } = useAuth();
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long!');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await signUp(email, password, {
        username,
        accountType
      });
      
      if (error) {
        setError(error.message);
        return;
      }

      if (data.user) {
        // Show success message with different text for admin
        const message = accountType === 'admin' 
          ? 'Admin account created successfully! Please check your email to confirm your account. You will have admin privileges once confirmed. 👑' 
          : 'Account created successfully! Please check your email to confirm your account. 🎉';
        
        alert(message);
        
        // Redirect to login page for email confirmation
        router.push('/loginpage');
      }
    } catch (err) {
      console.error('Signup error:', err);
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
          <Link href="/loginpage">
            <button className="px-6 py-2 border border-purple-300 text-purple-700 rounded-full hover:bg-purple-50 transition-colors">
              Login
            </button>
          </Link>
          <button className="px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors">
            Sign Up
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex items-center justify-center px-4 py-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 w-full max-w-md">
          {/* Logo Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center overflow-hidden">
              <Image 
                src="/logo (2).png" 
                alt="Hat rean Logo" 
                width={48} 
                height={48} 
                className="object-contain"
              />
            </div>
          </div>

          {/* Welcome Text */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-purple-700 mb-2">Join Hat rean!</h2>
            <p className="text-gray-600">Start your quiz journey today</p>
          </div>

          {/* Account Type Selection */}
          <div className="mb-6">
            <p className="text-center text-purple-700 font-semibold mb-4">Please Select Your Account Type:</p>
            <div className="flex gap-3">
              <button
                onClick={() => setAccountType('admin')}
                className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all font-medium ${
                  accountType === 'admin'
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-300 text-gray-700 hover:border-purple-300 hover:bg-purple-50'
                }`}
              >
                Join as Admin
              </button>
              <button
                onClick={() => setAccountType('user')}
                className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all font-medium ${
                  accountType === 'user'
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-300 text-gray-700 hover:border-purple-300 hover:bg-purple-50'
                }`}
              >
                Join as User
              </button>
            </div>
          </div>

          {/* Sign Up Form */}
          <form onSubmit={handleSignUp} className="space-y-4">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
            
            <div>
              <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full py-3 px-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all placeholder-gray-500 text-gray-800 font-semibold"
                required
                disabled={loading}
              />
            </div>
            <div>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full py-3 px-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all placeholder-gray-500 text-gray-800 font-semibold"
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
                className="w-full py-3 px-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all placeholder-gray-500 text-gray-800 font-semibold"
                required
                disabled={loading}
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full py-3 px-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all placeholder-gray-500 text-gray-800 font-semibold"
                required
                disabled={loading}
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Sign Up ✨'}
            </button>
          </form>

          {/* Login Link */}
          <div className="text-center mt-6">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link href="/loginpage" className="text-purple-600 hover:text-purple-700 font-medium">
                Login! 🚀
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
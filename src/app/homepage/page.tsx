'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../../../contexts/AuthContext';
import ProtectedRoute from '../../../components/ProtectedRoute';
import { getLeaderboard, getCurrentUserProfile } from '../../lib/database';

interface TopPlayer {
  id: string;
  username: string;
  full_name: string;
  total_score: number;
  total_quizzes: number;
}

function HomePageContent() {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [sessionCode, setSessionCode] = useState<string>('');
  const [topPlayers, setTopPlayers] = useState<TopPlayer[]>([]);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const { user, signOut } = useAuth();

  useEffect(() => {
    loadTopPlayers();
    loadUserProfile();
  }, []);

  const loadTopPlayers = async () => {
    try {
      setLoadingLeaderboard(true);
      const leaderboardData = await getLeaderboard(undefined, 3); // Get top 3 players
      setTopPlayers(leaderboardData as TopPlayer[]);
    } catch (error) {
      console.error('Error loading top players:', error);
    } finally {
      setLoadingLeaderboard(false);
    }
  };

  const loadUserProfile = async () => {
    try {
      setLoadingProfile(true);
      const profile = await getCurrentUserProfile();
      if (profile) {
        setIsAdmin(profile.role === 'admin');
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
  };

  const categories = [
    { 
      name: 'General Knowledge', 
      icon: '🎯', 
      color: 'bg-green-100 border-green-200 hover:bg-green-200', 
      iconBg: 'bg-green-500',
      topics: 'Mixed questions from various topics' 
    },
    { 
      name: 'Science', 
      icon: '🧪', 
      color: 'bg-blue-100 border-blue-200 hover:bg-blue-200', 
      iconBg: 'bg-blue-500',
      topics: 'Biology, Chemistry, Physics and more' 
    },
    { 
      name: 'History', 
      icon: '🏛️', 
      color: 'bg-orange-100 border-orange-200 hover:bg-orange-200', 
      iconBg: 'bg-orange-500',
      topics: 'World history and civilizations' 
    },
    { 
      name: 'Sports', 
      icon: '⚽', 
      color: 'bg-red-100 border-red-200 hover:bg-red-200', 
      iconBg: 'bg-red-500',
      topics: 'Sports, games and athletics' 
    },
    { 
      name: 'Technology', 
      icon: '💻', 
      color: 'bg-purple-100 border-purple-200 hover:bg-purple-200', 
      iconBg: 'bg-purple-500',
      topics: 'Computers, programming and tech' 
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto flex justify-between items-center p-4 px-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center overflow-hidden">
              <Image 
                src="/logo (2).png" 
                alt="Hat rean Logo" 
                width={32} 
                height={32} 
                className="object-contain"
              />
            </div>
            <h1 className="text-2xl font-bold text-purple-700">Hat rean</h1>
          </div>
          
          <nav className="flex items-center gap-8">
            <Link href="/homepage" className="flex items-center gap-2 text-purple-600 font-medium">
              🏠 Home
            </Link>
            <Link href="/profile" className="flex items-center gap-2 text-gray-700 hover:text-purple-600 font-medium">
              👤 Profile
            </Link>
            <Link href="/admin/leaderboard" className="flex items-center gap-2 text-gray-700 hover:text-purple-600 font-medium">
              📊 Leaderboard
            </Link>
            {!loadingProfile && isAdmin && (
              <Link href="/admin" className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium">
                ⚙️ Admin
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Hi, {user?.user_metadata?.username || user?.email || 'User'}! 👋
            </span>
            <button 
              onClick={handleLogout}
              className="px-4 py-2 text-sm text-gray-600 hover:text-purple-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <h2 className="text-5xl md:text-6xl font-bold text-transparent bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text mb-4">
            Ready to Quiz? 🚀
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            Test your knowledge and have fun while learning! 🧠✨
          </p>

          {/* Feature Icons */}
          <div className="flex justify-center gap-12 mb-16">
            <div className="flex flex-col items-center group">
              <div className="w-20 h-20 bg-purple-200 rounded-3xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <span className="text-3xl">⚡</span>
              </div>
              <span className="text-base font-semibold text-gray-700">Lightning fast</span>
            </div>
            <div className="flex flex-col items-center group">
              <div className="w-20 h-20 bg-blue-200 rounded-3xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <span className="text-3xl">✓</span>
              </div>
              <span className="text-base font-semibold text-gray-700">Super Accurate</span>
            </div>
            <div className="flex flex-col items-center group">
              <div className="w-20 h-20 bg-green-200 rounded-3xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <span className="text-3xl">⭐</span>
              </div>
              <span className="text-base font-semibold text-gray-700">Mega Fun</span>
            </div>
          </div>
        </section>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {/* Left Column - Quiz Start */}
          <div className="space-y-8">
            {/* Start Quiz Card */}
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl p-8 text-white shadow-lg hover:shadow-xl transition-shadow">
              <h3 className="text-2xl font-bold mb-3">Start Your Quiz Adventure!</h3>
              <p className="text-purple-100 mb-6 text-lg">Test your knowledge with 10 randomized questions! 🧠</p>
              <div className="space-y-3 mb-8 text-purple-100">
                <div className="flex items-center gap-2">
                  <span>📝</span>
                  <span>10 questions per session</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>🎲</span>
                  <span>Random questions from 50+ database</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>💡</span>
                  <span>See correct answers & explanations</span>
                </div>
              </div>
              
              <Link href="/quiz?mode=instant">
                <button className="w-full px-8 py-4 bg-white text-purple-600 rounded-2xl font-semibold hover:bg-purple-50 transition-all transform hover:scale-105 shadow-lg">
                  Start Random Quiz 🚀
                </button>
              </Link>
            </div>

            {/* Category Selection Card */}
            

            {/* Session Code Card */}
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">🎯 Join Quiz Session</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Enter Session Code</label>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Enter session code from admin (e.g., QUIZ2025)"
                      value={sessionCode}
                      onChange={(e) => setSessionCode(e.target.value.toUpperCase())}
                      className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:outline-none text-gray-700 placeholder-gray-400 font-mono tracking-wider"
                      maxLength={10}
                    />
                    <p className="text-xs text-gray-500">Ask your admin for the session code to join a specific quiz</p>
                  </div>
                </div>

                {/* Session Action Button */}
                {sessionCode ? (
                  <button 
                    onClick={() => {
                      window.location.href = `/quiz?session=${sessionCode}`;
                    }}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 rounded-2xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all transform hover:scale-[1.02]"
                  >
                    Join Session: {sessionCode} 🎯
                  </button>
                ) : (
                  <button className="w-full bg-gradient-to-r from-gray-200 to-gray-300 text-gray-600 py-4 rounded-2xl font-semibold cursor-not-allowed">
                    Enter session code to join
                  </button>
                )}

                <div className="text-center pt-2">
                  <p className="text-xs text-gray-500">
                    {sessionCode ? '✅ Ready to join session' : 
                     '💡 Session codes are provided by your quiz admin'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Features & Leaderboard */}
          <div className="space-y-8">
            {/* Leaderboard */}
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800">🏆 Top Champions</h3>
                <Link href="/admin/leaderboard">
                  <button className="text-purple-600 hover:text-purple-700 font-medium text-sm">
                    View All →
                  </button>
                </Link>
              </div>
              
              {loadingLeaderboard ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
                  <p className="text-gray-500">Loading top players...</p>
                </div>
              ) : topPlayers.length > 0 ? (
                <div className="space-y-4">
                  {topPlayers.map((player, index) => (
                    <div 
                      key={player.id} 
                      className={`flex items-center gap-4 p-4 rounded-2xl transition-all hover:scale-[1.02] ${
                        index === 0 
                          ? 'bg-gradient-to-r from-yellow-100 to-amber-100 border-2 border-yellow-300' 
                          : index === 1 
                          ? 'bg-gradient-to-r from-gray-100 to-slate-100 border-2 border-gray-300'
                          : 'bg-gradient-to-r from-orange-100 to-amber-100 border-2 border-orange-300'
                      }`}
                    >
                      {/* Rank Badge */}
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${
                        index === 0 
                          ? 'bg-yellow-500 text-white' 
                          : index === 1 
                          ? 'bg-gray-500 text-white'
                          : 'bg-orange-500 text-white'
                      }`}>
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                      </div>
                      
                      {/* Player Info */}
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-800 text-lg">
                          {player.username || player.full_name || 'Unknown Player'}
                        </h4>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <span className="text-green-600">⭐</span>
                            {player.total_score} points
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="text-blue-600">📝</span>
                            {player.total_quizzes} quizzes
                          </span>
                        </div>
                      </div>
                      
                      {/* Average Score */}
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-800">
                          {player.total_quizzes > 0 ? Math.round(player.total_score / player.total_quizzes) : 0}%
                        </div>
                        <div className="text-xs text-gray-500">avg score</div>
                      </div>
                    </div>
                  ))}
                  
                  {/* View All Button */}
                  <div className="pt-4 border-t border-gray-200">
                    <Link href="/admin/leaderboard">
                      <button className="w-full py-3 text-purple-600 hover:text-purple-700 font-medium hover:bg-purple-50 rounded-xl transition-colors">
                        View Complete Leaderboard 📊
                      </button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <div className="text-6xl mb-4">🏆</div>
                  <p className="text-lg mb-2">No champions yet!</p>
                  <p className="text-sm mb-4">Be the first to take a quiz and claim the top spot!</p>
                  <Link href="/quiz?mode=instant">
                    <button className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                      Start First Quiz 🚀
                    </button>
                  </Link>
                </div>
              )}
            </div>

            {/* Quiz Features */}
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-6">📚 Quiz Features</h3>
              <div className="space-y-5">
                <div className="flex items-center gap-4 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <span className="text-blue-500 text-xl">🎲</span>
                  <span className="text-gray-700 font-medium">50+ randomized questions</span>
                </div>
                <div className="flex items-center gap-4 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <span className="text-green-500 text-xl">📝</span>
                  <span className="text-gray-700 font-medium">10 questions per session</span>
                </div>
                <div className="flex items-center gap-4 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <span className="text-purple-500 text-xl">�</span>
                  <span className="text-gray-700 font-medium">Instant answer explanations</span>
                </div>
                <div className="flex items-center gap-4 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <span className="text-orange-500 text-xl">🏆</span>
                  <span className="text-gray-700 font-medium">Points & achievements</span>
                </div>
                <div className="flex items-center gap-4 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <span className="text-red-500 text-xl">⏱️</span>
                  <span className="text-gray-700 font-medium">Timed challenges</span>
                </div>
              </div>
            </div>

            {/* Active Sessions */}
            
          </div>
        </div>

        {/* Explore Categories */}
        <section className="text-center">
          <h3 className="text-4xl font-bold text-gray-800 mb-4">Choose Your Category 📚</h3>
          <p className="text-lg text-gray-600 mb-12">Select a category for 10 focused questions with instant feedback!</p>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {categories.map((category, index) => (
              <div
                key={index}
                onClick={() => setSelectedCategory(category.name)}
                className={`border-2 rounded-3xl p-6 hover:scale-105 transition-all cursor-pointer shadow-lg hover:shadow-xl ${
                  selectedCategory === category.name 
                    ? 'border-purple-500 bg-purple-50 ring-4 ring-purple-200' 
                    : category.color
                }`}
              >
                <div className={`w-16 h-16 ${category.iconBg} rounded-2xl flex items-center justify-center mx-auto mb-4 ${
                  selectedCategory === category.name ? 'ring-2 ring-purple-400' : ''
                }`}>
                  <span className="text-2xl text-white">{category.icon}</span>
                </div>
                <h4 className={`font-bold mb-3 text-lg ${
                  selectedCategory === category.name ? 'text-purple-800' : 'text-gray-800'
                }`}>
                  {category.name}
                  {selectedCategory === category.name && <span className="ml-2">✓</span>}
                </h4>
                <p className={`text-sm leading-relaxed ${
                  selectedCategory === category.name ? 'text-purple-600' : 'text-gray-600'
                }`}>
                  {category.topics}
                </p>
              </div>
            ))}
          </div>
          
          {selectedCategory && (
            <div className="mt-8 p-6 bg-purple-50 rounded-3xl border-2 border-purple-200 max-w-2xl mx-auto">
              <h4 className="text-xl font-bold text-purple-800 mb-2">
                🎯 Selected: {selectedCategory}
              </h4>
              <p className="text-purple-600 mb-4">
                You&apos;re ready to start! Use the quiz controls above to begin.
              </p>
              <button 
                onClick={() => {
                  window.location.href = `/quiz?category=${encodeURIComponent(selectedCategory)}`;
                }}
                className="bg-purple-600 text-white px-8 py-3 rounded-2xl font-semibold hover:bg-purple-700 transition-all transform hover:scale-105 shadow-lg"
              >
                Start {selectedCategory} Quiz Now! 🚀
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default function HomePage() {
  return (
    <ProtectedRoute>
      <HomePageContent />
    </ProtectedRoute>
  );
}
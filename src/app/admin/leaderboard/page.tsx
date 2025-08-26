'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../../../../contexts/AuthContext';
import ProtectedRoute from '../../../../components/ProtectedRoute';
import { getLeaderboard, getCurrentUserProfile } from '../../../lib/database';

interface LeaderboardPlayer {
  id: string;
  username: string;
  full_name: string;
  total_score: number;
  total_quizzes: number;
  average_score: number;
  best_score?: number;
  latest_quiz?: string;
  rank: number;
}

function LeaderboardPageContent() {
  const { user, signOut } = useAuth();
  const [players, setPlayers] = useState<LeaderboardPlayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const handleLogout = async () => {
    await signOut();
  };

  useEffect(() => {
    loadLeaderboardData();
    loadUserProfile();
  }, []);

  const loadLeaderboardData = async () => {
    try {
      setLoading(true);
      
      // Get leaderboard data
      const leaderboardData = await getLeaderboard(undefined, 50); // Get top 50 players
      
      // Transform the data to match our interface
      const transformedPlayers: LeaderboardPlayer[] = leaderboardData.map((player: Record<string, unknown>, index: number) => ({
        id: (player.id as string) || '',
        username: (player.username as string) || 'Unknown User',
        full_name: (player.full_name as string) || 'Unknown User',
        total_score: (player.total_score as number) || 0,
        total_quizzes: (player.total_quizzes as number) || 0,
        average_score: (player.total_quizzes as number) > 0 ? Math.round((player.total_score as number) / (player.total_quizzes as number)) : 0,
        rank: index + 1
      }));

      setPlayers(transformedPlayers);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
      setError('Failed to load leaderboard data');
    } finally {
      setLoading(false);
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

  // For now, we'll show all players since we don't have category-specific leaderboard yet
  const filteredPlayers = players;

  const topThree = filteredPlayers.slice(0, 3);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return '🏅';
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'bg-yellow-400 border-yellow-500';
      case 2: return 'bg-gray-300 border-gray-400';
      case 3: return 'bg-orange-400 border-orange-500';
      default: return 'bg-gray-200 border-gray-300';
    }
  };

  const getRankLabel = (rank: number) => {
    switch (rank) {
      case 1: return 'Champion';
      case 2: return 'Runner-up';
      case 3: return 'Third place';
      default: return `#${rank}`;
    }
  };

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
            <Link href="/homepage" className="flex items-center gap-2 text-gray-700 hover:text-purple-600 font-medium">
              🏠 Home
            </Link>
            <Link href="/admin/leaderboard" className="flex items-center gap-2 text-purple-600 font-medium">
              📊 Leaderboard
            </Link>
            {!loadingProfile && isAdmin && (
              <>
                <Link href="/admin" className="flex items-center gap-2 text-gray-700 hover:text-purple-600 font-medium">
                  ⚙️ Admin
                </Link>
                <Link href="/admin/manage" className="flex items-center gap-2 text-gray-700 hover:text-purple-600 font-medium">
                  📝 Manage
                </Link>
              </>
            )}
          </nav>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Hi, {user?.user_metadata?.username || user?.email || 'Admin'}! 👋
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

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Loading State */}
        {loading && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">⏳</div>
            <h3 className="text-2xl font-bold text-gray-600 mb-2">Loading Leaderboard...</h3>
            <p className="text-gray-500">Fetching the latest rankings!</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">❌</div>
            <h3 className="text-2xl font-bold text-red-600 mb-2">Error Loading Data</h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <button 
              onClick={loadLeaderboardData}
              className="bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Content - only show when not loading and no error */}
        {!loading && !error && (
          <>
            {/* Hall of Fame Title */}
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="text-6xl">🏆</div>
                <h2 className="text-5xl font-bold text-transparent bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text">
                  Hall of Fame
                </h2>
                <div className="text-6xl">🏆</div>
              </div>
              <p className="text-xl text-gray-600">See who&apos;s crushing it in the quiz world! ⚡</p>
            </div>

            {/* Top 3 Podium */}
            {filteredPlayers.length > 0 && (
              <div className="flex justify-center items-end gap-8 mb-16">
                {/* Second Place */}
                {topThree[1] && (
                  <div className="bg-white rounded-3xl p-6 shadow-lg border-2 border-gray-200 text-center w-64">
                    <div className={`w-20 h-20 ${getRankColor(2)} rounded-full flex items-center justify-center mx-auto mb-4 border-4`}>
                      <span className="text-3xl">{getRankIcon(2)}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{topThree[1].username}</h3>
                    <div className="bg-gray-200 text-gray-700 px-4 py-2 rounded-full text-sm font-semibold mb-3">
                      {getRankLabel(2)}
                    </div>
                    <div className="text-lg font-bold text-gray-800 mb-1">{topThree[1].total_score} pts</div>
                    <div className="text-sm text-gray-600">{topThree[1].total_quizzes} quizzes</div>
                  </div>
                )}

                {/* First Place - Highlighted */}
                {topThree[0] && (
                  <div className="relative">
                    <div className="absolute -inset-3 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-3xl opacity-30 blur-xl"></div>
                    <div className="relative bg-white rounded-3xl p-8 shadow-xl border-4 border-yellow-400 text-center w-80 transform scale-110">
                      <div className={`w-24 h-24 ${getRankColor(1)} rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-yellow-500`}>
                        <span className="text-4xl">{getRankIcon(1)}</span>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">{topThree[0].username}</h3>
                      <div className="bg-yellow-400 text-yellow-900 px-6 py-2 rounded-full text-sm font-bold mb-4">
                        {getRankLabel(1)}
                      </div>
                      <div className="text-xl font-bold text-gray-800 mb-1">{topThree[0].total_score} pts</div>
                      <div className="text-base text-gray-600">{topThree[0].total_quizzes} quizzes</div>
                    </div>
                  </div>
                )}

                {/* Third Place */}
                {topThree[2] && (
                  <div className="bg-white rounded-3xl p-6 shadow-lg border-2 border-orange-200 text-center w-64">
                    <div className={`w-20 h-20 ${getRankColor(3)} rounded-full flex items-center justify-center mx-auto mb-4 border-4`}>
                      <span className="text-3xl">{getRankIcon(3)}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{topThree[2].username}</h3>
                    <div className="bg-orange-400 text-orange-900 px-4 py-2 rounded-full text-sm font-semibold mb-3">
                      {getRankLabel(3)}
                    </div>
                    <div className="text-lg font-bold text-gray-800 mb-1">{topThree[2].total_score} pts</div>
                    <div className="text-sm text-gray-600">{topThree[2].total_quizzes} quizzes</div>
                  </div>
                )}
              </div>
            )}

            {/* Complete Rankings */}
            {filteredPlayers.length > 0 && (
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl p-8 shadow-xl">
                <div className="flex items-center gap-4 mb-8">
                  <div className="bg-white/20 p-3 rounded-2xl">
                    <span className="text-3xl">⭐</span>
                  </div>
                  <h3 className="text-3xl font-bold text-white">Complete Rankings ⭐</h3>
                </div>

                <div className="space-y-4">
                  {/* Include all players */}
                  {filteredPlayers.map((player) => (
                    <div key={player.id} className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 ${getRankColor(player.rank)} rounded-full flex items-center justify-center border-2`}>
                              <span className="text-xl font-bold">{getRankIcon(player.rank)}</span>
                            </div>
                            <div>
                              <h4 className="text-xl font-bold text-gray-800">{player.username}</h4>
                              <p className="text-sm text-gray-600">{player.full_name}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold">
                              Champions
                            </span>
                            <span className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm">
                              All Categories
                            </span>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="flex items-center gap-6">
                            <div className="text-right">
                              <div className="text-2xl font-bold text-gray-800">{player.total_score}</div>
                              <div className="text-sm text-gray-600">Total Points</div>
                            </div>
                            <div className="text-right">
                              <div className="text-xl font-bold text-green-600">{player.total_quizzes}</div>
                              <div className="text-sm text-gray-500">Quizzes</div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-purple-600">{player.average_score}</div>
                              <div className="text-sm text-gray-500">Avg Score</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {filteredPlayers.length === 0 && (
              <div className="text-center py-16">
                <div className="text-8xl mb-4 opacity-30">🏆</div>
                <h3 className="text-2xl font-bold text-gray-400 mb-2">No rankings yet</h3>
                <p className="text-gray-500 mb-6">Start playing quizzes to see the leaderboard!</p>
                <Link href="/homepage">
                  <button className="bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700 transition-colors">
                    Take a Quiz
                  </button>
                </Link>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default function LeaderboardPage() {
  return (
    <ProtectedRoute>
      <LeaderboardPageContent />
    </ProtectedRoute>
  );
}
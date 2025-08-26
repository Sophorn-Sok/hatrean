'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import ProtectedRoute from '../../../components/ProtectedRoute';
import { getUserProfile, getUserQuizHistory, QuizAttempt, UserProfile } from '../../lib/database';
import Link from 'next/link';

function ProfileContent() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [quizHistory, setQuizHistory] = useState<QuizAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Load user profile
      const userProfile = await getUserProfile(user.id);
      setProfile(userProfile);

      // Load quiz history
      const history = await getUserQuizHistory(user.id);
      setQuizHistory(history);

    } catch (error) {
      console.error('Error loading user data:', error);
      setError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="bg-white rounded-3xl p-8 shadow-lg text-center">
          <div className="text-4xl mb-4">⏳</div>
          <h2 className="text-xl font-bold text-gray-800">Loading Profile...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="bg-white rounded-3xl p-8 shadow-lg text-center max-w-md">
          <div className="text-4xl mb-4">❌</div>
          <h2 className="text-xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link href="/homepage">
            <button className="bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700 transition-colors">
              Back to Homepage
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto flex justify-between items-center p-4 px-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">👑</span>
            </div>
            <h1 className="text-2xl font-bold text-purple-700">User Profile</h1>
          </div>
          <Link href="/homepage">
            <button className="px-4 py-2 text-sm text-gray-600 hover:text-purple-600 transition-colors">
              ← Back to Homepage
            </button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl text-white">👤</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {profile?.username || user?.user_metadata?.username || 'User'}
                </h2>
                <p className="text-gray-600">{user?.email}</p>
              </div>

              <div className="space-y-4">
                <div className="bg-purple-50 rounded-xl p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-purple-700 font-medium">Total Score</span>
                    <span className="text-2xl font-bold text-purple-800">{profile?.total_score || 0}</span>
                  </div>
                </div>
                
                <div className="bg-blue-50 rounded-xl p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-blue-700 font-medium">Quizzes Taken</span>
                    <span className="text-2xl font-bold text-blue-800">{profile?.total_quizzes || 0}</span>
                  </div>
                </div>

                <div className="bg-green-50 rounded-xl p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-green-700 font-medium">Average Score</span>
                    <span className="text-2xl font-bold text-green-800">
                      {profile?.total_quizzes && profile.total_quizzes > 0 
                        ? Math.round(profile.total_score / profile.total_quizzes) 
                        : 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quiz History */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Quiz History 📚</h3>
              
              {quizHistory.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📋</div>
                  <p className="text-xl text-gray-600 mb-4">No quiz history yet</p>
                  <p className="text-gray-500 mb-6">Take your first quiz to see your results here!</p>
                  <Link href="/homepage">
                    <button className="bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700 transition-colors">
                      Take a Quiz
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {quizHistory.map((attempt, index) => (
                    <div key={attempt.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-bold text-lg text-gray-800">
                            {attempt.questions_data?.quiz_type === 'mixed' 
                              ? '🎲 Mixed Categories Quiz' 
                              : `📚 ${attempt.questions_data?.category_name || 'Category Quiz'}`}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {formatDate(attempt.completed_at)}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-purple-600">{attempt.score}</div>
                          <div className="text-sm text-gray-500">points</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="bg-green-50 rounded-lg p-3">
                          <div className="text-lg font-bold text-green-800">{attempt.correct_answers}</div>
                          <div className="text-xs text-green-600">Correct</div>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-3">
                          <div className="text-lg font-bold text-blue-800">{attempt.total_questions}</div>
                          <div className="text-xs text-blue-600">Total</div>
                        </div>
                        <div className="bg-orange-50 rounded-lg p-3">
                          <div className="text-lg font-bold text-orange-800">
                            {attempt.time_taken ? formatTime(attempt.time_taken) : 'N/A'}
                          </div>
                          <div className="text-xs text-orange-600">Time</div>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                            style={{ width: `${(attempt.correct_answers / attempt.total_questions) * 100}%` }}
                          ></div>
                        </div>
                        <div className="text-center mt-2 text-sm text-gray-600">
                          {Math.round((attempt.correct_answers / attempt.total_questions) * 100)}% Accuracy
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}

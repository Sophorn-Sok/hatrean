'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../../contexts/AuthContext';
import ProtectedRoute from '../../../components/ProtectedRoute';
import { 
  getCategories, 
  getActiveQuizSessions, 
  getUserProfile,
  Category,
  QuizSession 
} from '../../lib/database';

function AdminPageContent() {
  const { user, signOut } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeSessions, setActiveSessions] = useState<QuizSession[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const [categoriesData, sessionsData, profileData] = await Promise.all([
        getCategories(),
        getActiveQuizSessions(),
        getUserProfile(user.id)
      ]);
      
      setCategories(categoriesData);
      setActiveSessions(sessionsData);
      setUserProfile(profileData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-8">
              <h1 className="text-2xl font-bold text-gray-800">⚙️ Admin Dashboard</h1>
              <nav className="flex items-center gap-6">
                <Link href="/admin/questions" className="text-gray-600 hover:text-purple-600 font-medium">
                  📝 Questions
                </Link>
                <Link href="/admin/sessions" className="text-gray-600 hover:text-purple-600 font-medium">
                  🎯 Sessions
                </Link>
                <Link href="/admin/leaderboard" className="text-gray-600 hover:text-purple-600 font-medium">
                  📊 Leaderboard
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Admin: {userProfile?.username || user?.email || 'User'} 👋
              </span>
              <Link href="/homepage" className="text-purple-600 hover:text-purple-800">
                🏠 Home
              </Link>
              <button 
                onClick={handleLogout}
                className="px-4 py-2 text-sm text-gray-600 hover:text-purple-600 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <section className="text-center mb-12">
          <h2 className="text-4xl font-bold text-transparent bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text mb-4">
            Welcome to Admin Panel! 🚀
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Manage your quiz platform with powerful admin tools
          </p>
        </section>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600">Categories</p>
                <p className="text-3xl font-bold text-purple-600">{categories.length}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">📚</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600">Active Sessions</p>
                <p className="text-3xl font-bold text-green-600">{activeSessions.length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🎯</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600">Total Questions</p>
                <p className="text-3xl font-bold text-blue-600">--</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">❓</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600">Total Users</p>
                <p className="text-3xl font-bold text-orange-600">--</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">👥</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Management Tools */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">🛠️ Management Tools</h3>
            <div className="space-y-4">
              <Link href="/admin/questions">
                <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors cursor-pointer">
                  <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                    <span className="text-white text-xl">📝</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Question Manager</h4>
                    <p className="text-sm text-gray-600">Add, edit, and organize quiz questions</p>
                  </div>
                </div>
              </Link>

              <Link href="/admin/sessions">
                <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors cursor-pointer">
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                    <span className="text-white text-xl">🎯</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Session Manager</h4>
                    <p className="text-sm text-gray-600">Create and manage quiz sessions</p>
                  </div>
                </div>
              </Link>

              <Link href="/admin/leaderboard">
                <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors cursor-pointer">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                    <span className="text-white text-xl">📊</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Analytics & Reports</h4>
                    <p className="text-sm text-gray-600">View user statistics and performance</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Active Sessions */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">🔥 Active Sessions</h3>
            {activeSessions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No active sessions</p>
                <Link href="/admin/sessions">
                  <button className="bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700 transition-colors">
                    Create First Session
                  </button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4 max-h-64 overflow-y-auto">
                {activeSessions.map((session) => (
                  <div key={session.id} className="border border-gray-200 rounded-xl p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-gray-800">{session.title}</h4>
                        <p className="text-sm text-gray-600">Code: {session.session_code}</p>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold mt-2 ${
                          session.status === 'waiting' ? 'bg-yellow-100 text-yellow-800' :
                          session.status === 'active' ? 'bg-green-100 text-green-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {session.status.toUpperCase()}
                        </span>
                      </div>
                      <Link href="/admin/sessions">
                        <button className="text-purple-600 hover:text-purple-800 text-sm font-semibold">
                          Manage →
                        </button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Categories Overview */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">📚 Categories Overview</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((category) => (
              <div key={category.id} className="text-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className={`w-12 h-12 ${category.icon_bg} rounded-xl flex items-center justify-center mx-auto mb-2`}>
                  <span className="text-white text-xl">{category.icon}</span>
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">{category.name}</h4>
                <p className="text-xs text-gray-500 mt-1">Click to manage questions</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function AdminPage() {
  return (
    <ProtectedRoute requireAdmin>
      <AdminPageContent />
    </ProtectedRoute>
  );
}

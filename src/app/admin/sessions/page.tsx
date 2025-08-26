'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import ProtectedRoute from '../../../../components/ProtectedRoute';
import { 
  getCategories, 
  createQuizSession,
  getActiveQuizSessions,
  updateQuizSessionStatus,
  getSessionParticipants,
  getQuestionsByCategory,
  generateSessionCode,
  Category,
  QuizSession
} from '../../../lib/database';

function AdminSessionsContent() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [sessions, setSessions] = useState<QuizSession[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedSession, setSelectedSession] = useState<QuizSession | null>(null);
  const [participants, setParticipants] = useState<Array<{
    id: string;
    joined_at?: string;
    user_profiles?: {
      username?: string;
    };
    quiz_attempts?: {
      score?: number;
      completed_at?: string;
    };
  }>>([]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_id: '',
    time_limit: 30,
    max_participants: 50,
    settings: {
      shuffle_questions: true,
      show_answers: false,
      allow_review: true
    }
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [categoriesData, sessionsData] = await Promise.all([
      getCategories(),
      getActiveQuizSessions()
    ]);
    setCategories(categoriesData);
    setSessions(sessionsData);
  };

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.category_id) return;

    setLoading(true);

    // Get questions for the selected category
    const questions = await getQuestionsByCategory(formData.category_id);
    if (questions.length === 0) {
      alert('No questions found for this category. Please add questions first.');
      setLoading(false);
      return;
    }

    // Create session
    const sessionData = {
      ...formData,
      session_code: generateSessionCode(),
      created_by: user?.id,
      status: 'waiting' as const,
      questions: questions.map(q => q.id), // Store question IDs
    };

    const result = await createQuizSession(sessionData);
    if (result) {
      setFormData({
        title: '',
        description: '',
        category_id: '',
        time_limit: 30,
        max_participants: 50,
        settings: {
          shuffle_questions: true,
          show_answers: false,
          allow_review: true
        }
      });
      setShowCreateForm(false);
      loadData();
    }

    setLoading(false);
  };

  const handleStatusChange = async (sessionId: string, status: QuizSession['status']) => {
    setLoading(true);
    const result = await updateQuizSessionStatus(sessionId, status);
    if (result) {
      loadData();
    }
    setLoading(false);
  };

  const loadParticipants = async (session: QuizSession) => {
    setSelectedSession(session);
    const data = await getSessionParticipants(session.id);
    setParticipants(data);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting': return 'bg-yellow-100 text-yellow-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-8">
              <h1 className="text-2xl font-bold text-gray-800">🎯 Session Manager</h1>
              <nav className="flex items-center gap-6">
                <a href="/admin" className="text-gray-800 hover:text-purple-600 font-medium">Dashboard</a>
                <a href="/admin/questions" className="text-gray-800 hover:text-purple-600 font-medium">Questions</a>
                <a href="/admin/leaderboard" className="text-gray-800 hover:text-purple-600 font-medium">Leaderboard</a>
              </nav>
            </div>
            <a href="/homepage" className="text-purple-700 hover:text-purple-900 font-medium">← Back to Home</a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Actions */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Quiz Sessions ({sessions.length})
          </h2>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700 transition-colors"
          >
            + Create Session
          </button>
        </div>

        {/* Create Session Form */}
        {showCreateForm && (
          <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Create New Quiz Session</h3>
              <button
                onClick={() => setShowCreateForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSession} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Session Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none placeholder-gray-700"
                    required
                    placeholder="e.g., Science Quiz - Chapter 5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Category *
                  </label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                    required
                  >
                    <option value="">Choose a category...</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.icon} {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none placeholder-gray-700"
                  rows={3}
                  placeholder="Describe this quiz session..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Time Limit (minutes)
                  </label>
                  <input
                    type="number"
                    value={formData.time_limit}
                    onChange={(e) => setFormData({...formData, time_limit: parseInt(e.target.value)})}
                    className="w-full p-3 border-2 border-blac-200 rounded-xl focus:border-purple-500 focus:outline-none"
                    min="5"
                    max="180"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Max Participants
                  </label>
                  <input
                    type="number"
                    value={formData.max_participants}
                    onChange={(e) => setFormData({...formData, max_participants: parseInt(e.target.value)})}
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                    min="1"
                    max="1000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  Session Settings
                </label>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.settings.shuffle_questions}
                      onChange={(e) => setFormData({
                        ...formData,
                        settings: {...formData.settings, shuffle_questions: e.target.checked}
                      })}
                      className="mr-3"
                    />
                    <span className="text-sm text-gray-800">Shuffle question order</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.settings.show_answers}
                      onChange={(e) => setFormData({
                        ...formData,
                        settings: {...formData.settings, show_answers: e.target.checked}
                      })}
                      className="mr-3"
                    />
                    <span className="text-sm text-gray-800">Show correct answers after submission</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.settings.allow_review}
                      onChange={(e) => setFormData({
                        ...formData,
                        settings: {...formData.settings, allow_review: e.target.checked}
                      })}
                      className="mr-3"
                    />
                    <span className="text-sm text-gray-800">Allow participants to review answers</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create Session'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="bg-gray-400 text-white px-8 py-3 rounded-xl font-semibold hover:bg-gray-500 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Sessions List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sessions */}
          <div className="space-y-4">
            {sessions.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
                <p className="text-gray-800 text-lg font-medium">No active sessions found.</p>
                <p className="text-gray-600 mt-2">Create a session to get started!</p>
              </div>
            ) : (
              sessions.map((session) => (
                <div key={session.id} className="bg-white rounded-2xl p-6 shadow-lg">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(session.status)}`}>
                          {session.status.toUpperCase()}
                        </span>
                        <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-semibold">
                          {session.session_code}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {session.title}
                      </h3>
                      {session.description && (
                        <p className="text-sm text-gray-700 mb-3">{session.description}</p>
                      )}
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>⏱️ {session.time_limit} minutes</p>
                        <p>👥 Max {session.max_participants} participants</p>
                        <p>📅 Created {new Date(session.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => loadParticipants(session)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition-colors"
                    >
                      View Participants
                    </button>
                    
                    {session.status === 'waiting' && (
                      <button
                        onClick={() => handleStatusChange(session.id, 'active')}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-600 transition-colors"
                      >
                        Start Session
                      </button>
                    )}
                    
                    {session.status === 'active' && (
                      <button
                        onClick={() => handleStatusChange(session.id, 'completed')}
                        className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-orange-600 transition-colors"
                      >
                        End Session
                      </button>
                    )}
                    
                    {(session.status === 'waiting' || session.status === 'active') && (
                      <button
                        onClick={() => handleStatusChange(session.id, 'cancelled')}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600 transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Participants Panel */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {selectedSession ? `Participants - ${selectedSession.title}` : 'Select a session to view participants'}
            </h3>
            
            {selectedSession ? (
              <div className="space-y-3">
                {participants.length === 0 ? (
                  <p className="text-gray-700 text-center py-4 font-medium">No participants yet</p>
                ) : (
                  participants.map((participant) => (
                    <div key={participant.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {participant.user_profiles?.username || 'Unknown User'}
                        </p>
                        <p className="text-sm text-gray-700">
                          Joined: {participant.joined_at ? new Date(participant.joined_at).toLocaleString() : 'Unknown'}
                        </p>
                      </div>
                      {participant.quiz_attempts && (
                        <div className="text-right">
                          <p className="font-semibold text-green-700">
                            Score: {participant.quiz_attempts.score}
                          </p>
                          <p className="text-xs text-gray-600">
                            Completed: {participant.quiz_attempts.completed_at ? new Date(participant.quiz_attempts.completed_at).toLocaleString() : 'Unknown'}
                          </p>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-700 font-medium">Click &quot;View Participants&quot; on any session to see who has joined.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function AdminSessionsPage() {
  return (
    <ProtectedRoute requireAdmin>
      <AdminSessionsContent />
    </ProtectedRoute>
  );
}

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import ProtectedRoute from '../../../../components/ProtectedRoute';
import { supabase } from '../../../../lib/supabase';
import { 
  getCategories, 
  createQuestion, 
  getQuestionsByCategory,
  updateQuestion,
  deleteQuestion,
  debugCurrentUser,
  Category,
  Question 
} from '../../../lib/database';

function AdminQuestionsContent() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    question_text: '',
    question_type: 'multiple_choice' as 'multiple_choice' | 'true_false' | 'text',
    difficulty: 'medium' as 'easy' | 'medium' | 'hard',
    options: { A: '', B: '', C: '', D: '' } as Record<string, string>,
    correct_answer: '',
    explanation: '',
    points: 10
  });

  const loadCategories = async () => {
    const data = await getCategories();
    setCategories(data);
  };

  const loadQuestions = useCallback(async () => {
    if (!selectedCategory) return;
    setLoading(true);
    const data = await getQuestionsByCategory(selectedCategory);
    setQuestions(data);
    setLoading(false);
  }, [selectedCategory]);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      loadQuestions();
    }
  }, [selectedCategory, loadQuestions]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory) return;

    setLoading(true);
    
    const questionData = {
      ...formData,
      category_id: selectedCategory,
      created_by: user?.id,
    };

    let success = false;
    if (editingQuestion) {
      const result = await updateQuestion(editingQuestion.id, questionData);
      success = !!result;
    } else {
      const result = await createQuestion(questionData);
      success = !!result;
    }

    if (success) {
      setFormData({
        question_text: '',
        question_type: 'multiple_choice',
        difficulty: 'medium',
        options: { A: '', B: '', C: '', D: '' },
        correct_answer: '',
        explanation: '',
        points: 10
      });
      setShowAddForm(false);
      setEditingQuestion(null);
      loadQuestions();
    }
    
    setLoading(false);
  };

  const handleEdit = (question: Question) => {
    setEditingQuestion(question);
    setFormData({
      question_text: question.question_text,
      question_type: question.question_type,
      difficulty: question.difficulty,
      options: (question.options as Record<string, string>) || { A: '', B: '', C: '', D: '' },
      correct_answer: question.correct_answer,
      explanation: question.explanation || '',
      points: question.points
    });
    setShowAddForm(true);
  };

  const handleDelete = async (questionId: string) => {
    if (!confirm('Are you sure you want to delete this question?')) return;
    
    setLoading(true);
    const success = await deleteQuestion(questionId);
    if (success) {
      loadQuestions();
    }
    setLoading(false);
  };

  const resetForm = () => {
    setFormData({
      question_text: '',
      question_type: 'multiple_choice',
      difficulty: 'medium',
      options: { A: '', B: '', C: '', D: '' } as Record<string, string>,
      correct_answer: '',
      explanation: '',
      points: 10
    });
    setShowAddForm(false);
    setEditingQuestion(null);
  };

  const handleDebugUser = async () => {
    console.log('=== DEBUG USER INFO ===');
    const debugInfo = await debugCurrentUser();
    console.log('Debug result:', debugInfo);
    alert(`Debug info logged to console. Check developer tools. User role: ${debugInfo.profile?.role || 'N/A'}`);
  };

  const handleMakeAdmin = async () => {
    if (!user?.id) {
      alert('No user logged in');
      return;
    }
    
    if (!confirm('Make current user an admin? This will update your role in the database.')) {
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update({ role: 'admin' })
        .eq('id', user.id)
        .select()
        .single();
      
      if (error) {
        console.error('Error making user admin:', error);
        alert('Failed to update role: ' + error.message);
      } else {
        console.log('Successfully updated user role:', data);
        alert('✅ Successfully updated role to admin! Please refresh the page.');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('An error occurred while updating role');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-8">
              <h1 className="text-2xl font-bold text-gray-900">📝 Question Manager</h1>
              <nav className="flex items-center gap-6">
                <a href="/admin" className="text-gray-800 hover:text-purple-600 font-medium">Dashboard</a>
                <a href="/admin/sessions" className="text-gray-800 hover:text-purple-600 font-medium">Sessions</a>
                <a href="/admin/leaderboard" className="text-gray-800 hover:text-purple-600 font-medium">Leaderboard</a>
              </nav>
            </div>
            <a href="/homepage" className="text-purple-600 hover:text-purple-800">← Back to Home</a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Category Selection */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Select Category</h2>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none text-gray-900"
          >
            <option value="">Choose a category...</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.icon} {category.name}
              </option>
            ))}
          </select>
        </div>

        {selectedCategory && (
          <>
            {/* Actions */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Questions ({questions.length})
              </h2>
              <div className="flex gap-3">
                <button
                  onClick={handleDebugUser}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition-colors"
                >
                  🔍 Debug User
                </button>
                <button
                  onClick={handleMakeAdmin}
                  className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-orange-600 transition-colors"
                >
                  👑 Make Admin
                </button>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700 transition-colors"
                >
                  + Add Question
                </button>
              </div>
            </div>

            {/* Add/Edit Form */}
            {showAddForm && (
              <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">
                    {editingQuestion ? 'Edit Question' : 'Add New Question'}
                  </h3>
                  <button
                    onClick={resetForm}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Question Text */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Question Text *
                    </label>
                    <textarea
                      value={formData.question_text}
                      onChange={(e) => setFormData({...formData, question_text: e.target.value})}
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none text-gray-900"
                      rows={3}
                      required
                    />
                  </div>

                  {/* Question Type and Difficulty */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Question Type
                      </label>
                      <select
                        value={formData.question_type}
                        onChange={(e) => setFormData({...formData, question_type: e.target.value as 'multiple_choice' | 'true_false' | 'text'})}
                        className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none text-gray-900"
                      >
                        <option value="multiple_choice">Multiple Choice</option>
                        <option value="true_false">True/False</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Difficulty
                      </label>
                      <select
                        value={formData.difficulty}
                        onChange={(e) => setFormData({...formData, difficulty: e.target.value as 'easy' | 'medium' | 'hard'})}
                        className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none text-gray-900"
                      >
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Points
                      </label>
                      <input
                        type="number"
                        value={formData.points}
                        onChange={(e) => setFormData({...formData, points: parseInt(e.target.value)})}
                        className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none text-gray-900"
                        min="1"
                        max="100"
                      />
                    </div>
                  </div>

                  {/* Options (for multiple choice) */}
                  {formData.question_type === 'multiple_choice' && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Answer Options
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {['A', 'B', 'C', 'D'].map((option) => (
                          <div key={option}>
                            <label className="block text-xs text-gray-800 mb-1">Option {option}</label>
                            <input
                              type="text"
                              value={formData.options[option]}
                              onChange={(e) => setFormData({
                                ...formData,
                                options: {...formData.options, [option]: e.target.value}
                              })}
                              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none text-gray-900"
                              required
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Correct Answer */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Correct Answer *
                    </label>
                    {formData.question_type === 'multiple_choice' ? (
                      <select
                        value={formData.correct_answer}
                        onChange={(e) => setFormData({...formData, correct_answer: e.target.value})}
                        className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none text-gray-900"
                        required
                      >
                        <option value="">Select correct option...</option>
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                      </select>
                    ) : (
                      <select
                        value={formData.correct_answer}
                        onChange={(e) => setFormData({...formData, correct_answer: e.target.value})}
                        className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none text-gray-900"
                        required
                      >
                        <option value="">Select...</option>
                        <option value="true">True</option>
                        <option value="false">False</option>
                      </select>
                    )}
                  </div>

                  {/* Explanation */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Explanation (Optional)
                    </label>
                    <textarea
                      value={formData.explanation}
                      onChange={(e) => setFormData({...formData, explanation: e.target.value})}
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none text-gray-900"
                      rows={2}
                      placeholder="Explain why this is the correct answer..."
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="flex gap-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50"
                    >
                      {loading ? 'Saving...' : editingQuestion ? 'Update Question' : 'Add Question'}
                    </button>
                    <button
                      type="button"
                      onClick={resetForm}
                      className="bg-gray-300 text-gray-700 px-8 py-3 rounded-xl font-semibold hover:bg-gray-400 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Questions List */}
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                  <p className="text-gray-800 mt-4">Loading questions...</p>
                </div>
              ) : questions.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
                  <p className="text-gray-800 text-lg">No questions found for this category.</p>
                  <p className="text-gray-700 mt-2">Add some questions to get started!</p>
                </div>
              ) : (
                questions.map((question) => (
                  <div key={question.id} className="bg-white rounded-2xl p-6 shadow-lg">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            question.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                            question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {question.difficulty}
                          </span>
                          <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-semibold">
                            {question.points} pts
                          </span>
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                            {question.question_type.replace('_', ' ')}
                          </span>
                        </div>
                        
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                          {question.question_text}
                        </h3>
                        
                        {question.question_type === 'multiple_choice' && question.options && (
                          <div className="grid grid-cols-2 gap-2 mb-3">
                            {Object.entries(question.options).map(([key, value]) => (
                              <div key={key} className={`p-2 rounded-lg text-sm ${
                                key === question.correct_answer 
                                  ? 'bg-green-100 text-green-800 font-semibold' 
                                  : 'bg-gray-50 text-gray-800'
                              }`}>
                                <span className="font-semibold">{key}:</span> {value}
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {question.question_type === 'true_false' && (
                          <div className="mb-3">
                            <span className="text-sm text-gray-800">Correct Answer: </span>
                            <span className="font-semibold text-green-600">
                              {question.correct_answer === 'true' ? 'True' : 'False'}
                            </span>
                          </div>
                        )}
                        
                        {question.explanation && (
                          <div className="bg-blue-50 p-3 rounded-lg">
                            <span className="text-sm text-blue-600 font-semibold">Explanation: </span>
                            <span className="text-sm text-blue-800">{question.explanation}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleEdit(question)}
                          className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(question.id)}
                          className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default function AdminQuestionsPage() {
  return (
    <ProtectedRoute requireAdmin>
      <AdminQuestionsContent />
    </ProtectedRoute>
  );
}

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../../../contexts/AuthContext';
import ProtectedRoute from '../../../../components/ProtectedRoute';

interface Question {
  id: string;
  question: string;
  category: string;
  difficulty: string;
  status: string;
  updatedDate: string;
  answers: number;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: string;
}

function ManageQuestionsPageContent() {
  const { user, signOut } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Question>>({});

  const handleLogout = async () => {
    await signOut();
  };

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockQuestions: Question[] = [
      {
        id: '1',
        question: 'What is the capital of France?',
        category: 'General Knowledge',
        difficulty: 'Easy',
        status: 'Draft',
        updatedDate: '9/1/2024',
        answers: 3,
        options: { A: 'Paris', B: 'London', C: 'Berlin', D: 'Madrid' },
        correctAnswer: 'A'
      },
      {
        id: '2',
        question: 'What is the capital of France?',
        category: 'History',
        difficulty: 'Easy',
        status: 'Draft',
        updatedDate: '9/1/2024',
        answers: 6,
        options: { A: 'Paris', B: 'London', C: 'Berlin', D: 'Madrid' },
        correctAnswer: 'A'
      },
      {
        id: '3',
        question: 'What is the capital of France?',
        category: 'Science',
        difficulty: 'Medium',
        status: 'Published',
        updatedDate: '9/1/2024',
        answers: 10,
        options: { A: 'Paris', B: 'London', C: 'Berlin', D: 'Madrid' },
        correctAnswer: 'A'
      },
      {
        id: '4',
        question: 'What is the capital of France?',
        category: 'General Knowledge',
        difficulty: 'Easy',
        status: 'Draft',
        updatedDate: '9/1/2024',
        answers: 4,
        options: { A: 'Paris', B: 'London', C: 'Berlin', D: 'Madrid' },
        correctAnswer: 'A'
      },
      {
        id: '5',
        question: 'What is the capital of France?',
        category: 'Technology',
        difficulty: 'Hard',
        status: 'Draft',
        updatedDate: '9/1/2024',
        answers: 4,
        options: { A: 'Paris', B: 'London', C: 'Berlin', D: 'Madrid' },
        correctAnswer: 'A'
      },
      {
        id: '6',
        question: 'What is the capital of France?',
        category: 'General Knowledge',
        difficulty: 'Easy',
        status: 'Draft',
        updatedDate: '9/1/2024',
        answers: 4,
        options: { A: 'Paris', B: 'London', C: 'Berlin', D: 'Madrid' },
        correctAnswer: 'A'
      }
    ];
    setQuestions(mockQuestions);
  }, []);

  const categories = ['General Knowledge', 'Science', 'History', 'Technology', 'Sports', 'Literature'];
  const difficulties = ['Easy', 'Medium', 'Hard'];

  const filteredQuestions = questions.filter(q => {
    return (
      q.question.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (categoryFilter === '' || q.category === categoryFilter) &&
      (difficultyFilter === '' || q.difficulty === difficultyFilter)
    );
  });

  const handleEdit = (question: Question) => {
    setSelectedQuestion(question);
    setEditForm(question);
    setIsEditing(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this question?')) {
      setQuestions(questions.filter(q => q.id !== id));
    }
  };

  const handleSave = () => {
    if (isCreating) {
      const newQuestion: Question = {
        ...editForm as Question,
        id: Date.now().toString(),
        updatedDate: new Date().toLocaleDateString(),
        answers: 0,
        status: 'Draft'
      };
      setQuestions([...questions, newQuestion]);
    } else {
      setQuestions(questions.map(q => 
        q.id === selectedQuestion?.id ? { ...q, ...editForm } : q
      ));
    }
    setIsEditing(false);
    setIsCreating(false);
    setSelectedQuestion(null);
    setEditForm({});
  };

  const handleCreateNew = () => {
    setEditForm({
      question: '',
      category: '',
      difficulty: '',
      options: { A: '', B: '', C: '', D: '' },
      correctAnswer: ''
    });
    setIsCreating(true);
    setIsEditing(true);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-700';
      case 'Medium': return 'bg-yellow-100 text-yellow-700';
      case 'Hard': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto flex justify-between items-center p-4 px-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">👑</span>
            </div>
            <h1 className="text-2xl font-bold text-purple-700">Hat rean</h1>
          </div>
          
          <nav className="flex items-center gap-8">
            <Link href="/homepage" className="flex items-center gap-2 text-gray-700 hover:text-purple-600 font-medium">
              🏠 Home
            </Link>
            <Link href="/admin/leaderboard" className="flex items-center gap-2 text-gray-700 hover:text-purple-600 font-medium">
              📊 Leaderboard
            </Link>
            <Link href="/admin" className="flex items-center gap-2 text-gray-700 hover:text-purple-600 font-medium">
              ⚙️ Admin
            </Link>
            <Link href="/admin/manage" className="flex items-center gap-2 text-purple-600 font-medium">
              📝 Manage
            </Link>
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

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Panel - Questions List */}
          <div className="lg:col-span-2">
            {/* Header Section */}
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Manage Questions</h2>
              <p className="text-gray-600">{questions.length} questions found</p>
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex-1 min-w-64">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search questions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none text-gray-800 font-semibold placeholder-gray-500"
                    />
                    <div className="absolute left-3 top-3.5 text-gray-400">🔍</div>
                  </div>
                </div>
                
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none bg-white text-gray-800 font-semibold"
                >
                  <option value="">Category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                
                <select
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value)}
                  className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none bg-white text-gray-800 font-semibold"
                >
                  <option value="">Difficulty</option>
                  {difficulties.map(diff => (
                    <option key={diff} value={diff}>{diff}</option>
                  ))}
                </select>
                
                <button
                  onClick={handleCreateNew}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
                >
                  New question
                </button>
              </div>
            </div>

            {/* Questions Section */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Questions</h3>
              <div className="space-y-4">
                {filteredQuestions.map((question) => (
                  <div key={question.id} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-800 mb-2">{question.question}</h4>
                        <div className="flex items-center gap-4 mb-2">
                          <span className="text-sm font-medium text-gray-600">{question.category}</span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
                            {question.difficulty}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(question.status)}`}>
                            {question.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">Updated {question.updatedDate} • {question.answers} answers</p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedQuestion(question)}
                          className="p-2 text-gray-400 hover:text-purple-600 transition-colors"
                          title="View"
                        >
                          👁️
                        </button>
                        <button
                          onClick={() => handleEdit(question)}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(question.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel - Question Details/Edit */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-lg sticky top-6">
              {isEditing ? (
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-6">
                    {isCreating ? 'Create New Question' : 'Edit Question'}
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Question</label>
                      <textarea
                        value={editForm.question || ''}
                        onChange={(e) => setEditForm({...editForm, question: e.target.value})}
                        className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none h-20 resize-none text-gray-800 font-semibold placeholder-gray-500"
                        placeholder="Enter your question..."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                      <select
                        value={editForm.category || ''}
                        onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                        className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none bg-white text-gray-800 font-semibold"
                      >
                        <option value="">Select category</option>
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                      <select
                        value={editForm.difficulty || ''}
                        onChange={(e) => setEditForm({...editForm, difficulty: e.target.value})}
                        className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none bg-white text-gray-800 font-semibold"
                      >
                        <option value="">Select difficulty</option>
                        {difficulties.map(diff => (
                          <option key={diff} value={diff}>{diff}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Options</label>
                      {['A', 'B', 'C', 'D'].map(option => (
                        <input
                          key={option}
                          type="text"
                          placeholder={`Option ${option}`}
                          value={editForm.options?.[option as keyof typeof editForm.options] || ''}
                          onChange={(e) => setEditForm({
                            ...editForm, 
                            options: {...(editForm.options || {A: '', B: '', C: '', D: ''}), [option]: e.target.value}
                          })}
                          className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none text-gray-800 font-semibold placeholder-gray-500"
                        />
                      ))}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Correct Answer</label>
                      <select
                        value={editForm.correctAnswer || ''}
                        onChange={(e) => setEditForm({...editForm, correctAnswer: e.target.value})}
                        className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none bg-white text-gray-800 font-semibold"
                      >
                        <option value="">Select correct answer</option>
                        <option value="A">Option A</option>
                        <option value="B">Option B</option>
                        <option value="C">Option C</option>
                        <option value="D">Option D</option>
                      </select>
                    </div>
                    
                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={handleSave}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
                      >
                        {isCreating ? 'Create' : 'Save'}
                      </button>
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setIsCreating(false);
                          setSelectedQuestion(null);
                          setEditForm({});
                        }}
                        className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ) : selectedQuestion ? (
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-6">Question Details</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Question</label>
                      <p className="text-gray-800 bg-gray-50 p-3 rounded-xl">{selectedQuestion.question}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                        <p className="text-gray-800">{selectedQuestion.category}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(selectedQuestion.difficulty)}`}>
                          {selectedQuestion.difficulty}
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
                      <div className="space-y-2">
                        {Object.entries(selectedQuestion.options).map(([key, value]) => (
                          <div 
                            key={key} 
                            className={`p-3 rounded-xl border-2 ${
                              selectedQuestion.correctAnswer === key 
                                ? 'border-green-300 bg-green-50 text-green-800' 
                                : 'border-gray-200 bg-gray-50'
                            }`}
                          >
                            <span className="font-semibold">{key}:</span> {value}
                            {selectedQuestion.correctAnswer === key && (
                              <span className="ml-2 text-green-600">✓ Correct</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={() => handleEdit(selectedQuestion)}
                        className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all"
                      >
                        Edit Question
                      </button>
                      <button
                        onClick={() => handleDelete(selectedQuestion.id)}
                        className="px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4 opacity-30">👁️</div>
                  <h3 className="text-lg font-semibold text-gray-400 mb-2">Select a question to view details</h3>
                  <p className="text-gray-400">Click on any question from the list to see its details here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ManageQuestionsPage() {
  return (
    <ProtectedRoute requireAdmin={true}>
      <ManageQuestionsPageContent />
    </ProtectedRoute>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import ProtectedRoute from '../../../components/ProtectedRoute';
import { 
  getSessionByCode, 
  getSessionQuestions, 
  joinSessionAsParticipant, 
  submitSessionQuizAttempt,
  getRandomQuestions,
  getCategories,
  Question,
  QuizSession
} from '../../lib/database';
import Link from 'next/link';

// Mock data for testing when database is empty
const getMockQuestions = (categoryName: string): Question[] => {
  const mockQuestionsData: Record<string, Question[]> = {
    'General Knowledge': [
      {
        id: 'mock-gk-1',
        category_id: 'mock-cat-gk',
        question_text: 'What is the capital of France?',
        question_type: 'multiple_choice',
        difficulty: 'easy',
        options: {
          'A': 'London',
          'B': 'Berlin',
          'C': 'Paris',
          'D': 'Madrid'
        },
        correct_answer: 'C',
        explanation: 'Paris is the capital and largest city of France.',
        points: 10,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'mock-gk-2',
        category_id: 'mock-cat-gk',
        question_text: 'Which planet is known as the Red Planet?',
        question_type: 'multiple_choice',
        difficulty: 'medium',
        options: {
          'A': 'Venus',
          'B': 'Mars',
          'C': 'Jupiter',
          'D': 'Saturn'
        },
        correct_answer: 'B',
        explanation: 'Mars is called the Red Planet due to its reddish appearance.',
        points: 15,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'mock-gk-3',
        category_id: 'mock-cat-gk',
        question_text: 'What is the largest ocean on Earth?',
        question_type: 'multiple_choice',
        difficulty: 'easy',
        options: {
          'A': 'Atlantic Ocean',
          'B': 'Indian Ocean',
          'C': 'Arctic Ocean',
          'D': 'Pacific Ocean'
        },
        correct_answer: 'D',
        explanation: 'The Pacific Ocean is the largest ocean covering about 1/3 of Earth\'s surface.',
        points: 10,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ],
    'Science': [
      {
        id: 'mock-sci-1',
        category_id: 'mock-cat-sci',
        question_text: 'What is the chemical symbol for gold?',
        question_type: 'multiple_choice',
        difficulty: 'medium',
        options: {
          'A': 'Go',
          'B': 'Gd',
          'C': 'Au',
          'D': 'Ag'
        },
        correct_answer: 'C',
        explanation: 'Au comes from the Latin word "aurum" meaning gold.',
        points: 15,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'mock-sci-2',
        category_id: 'mock-cat-sci',
        question_text: 'How many bones are there in an adult human body?',
        question_type: 'multiple_choice',
        difficulty: 'hard',
        options: {
          'A': '196',
          'B': '206',
          'C': '216',
          'D': '226'
        },
        correct_answer: 'B',
        explanation: 'An adult human body has 206 bones.',
        points: 20,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'mock-sci-3',
        category_id: 'mock-cat-sci',
        question_text: 'What gas do plants absorb from the atmosphere during photosynthesis?',
        question_type: 'multiple_choice',
        difficulty: 'easy',
        options: {
          'A': 'Oxygen',
          'B': 'Nitrogen',
          'C': 'Carbon Dioxide',
          'D': 'Hydrogen'
        },
        correct_answer: 'C',
        explanation: 'Plants absorb carbon dioxide and release oxygen during photosynthesis.',
        points: 10,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ],
    'History': [
      {
        id: 'mock-hist-1',
        category_id: 'mock-cat-hist',
        question_text: 'In which year did World War II end?',
        question_type: 'multiple_choice',
        difficulty: 'medium',
        options: {
          'A': '1944',
          'B': '1945',
          'C': '1946',
          'D': '1947'
        },
        correct_answer: 'B',
        explanation: 'World War II ended in 1945 with the surrender of Japan.',
        points: 15,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'mock-hist-2',
        category_id: 'mock-cat-hist',
        question_text: 'Who was the first person to walk on the moon?',
        question_type: 'multiple_choice',
        difficulty: 'easy',
        options: {
          'A': 'Buzz Aldrin',
          'B': 'Neil Armstrong',
          'C': 'John Glenn',
          'D': 'Alan Shepard'
        },
        correct_answer: 'B',
        explanation: 'Neil Armstrong was the first person to walk on the moon on July 20, 1969.',
        points: 10,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ],
    'Technology': [
      {
        id: 'mock-tech-1',
        category_id: 'mock-cat-tech',
        question_text: 'What does "HTML" stand for?',
        question_type: 'multiple_choice',
        difficulty: 'easy',
        options: {
          'A': 'Hyper Text Markup Language',
          'B': 'High Tech Modern Language',
          'C': 'Home Tool Markup Language',
          'D': 'Hyperlink and Text Markup Language'
        },
        correct_answer: 'A',
        explanation: 'HTML stands for Hyper Text Markup Language, used to create web pages.',
        points: 10,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'mock-tech-2',
        category_id: 'mock-cat-tech',
        question_text: 'Which company developed the iPhone?',
        question_type: 'multiple_choice',
        difficulty: 'easy',
        options: {
          'A': 'Samsung',
          'B': 'Google',
          'C': 'Apple',
          'D': 'Microsoft'
        },
        correct_answer: 'C',
        explanation: 'Apple developed and released the first iPhone in 2007.',
        points: 10,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ],
    'Sports': [
      {
        id: 'mock-sport-1',
        category_id: 'mock-cat-sport',
        question_text: 'How many players are on a basketball team on the court at one time?',
        question_type: 'multiple_choice',
        difficulty: 'easy',
        options: {
          'A': '4',
          'B': '5',
          'C': '6',
          'D': '7'
        },
        correct_answer: 'B',
        explanation: 'A basketball team has 5 players on the court at one time.',
        points: 10,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'mock-sport-2',
        category_id: 'mock-cat-sport',
        question_text: 'In which sport would you perform a slam dunk?',
        question_type: 'multiple_choice',
        difficulty: 'easy',
        options: {
          'A': 'Tennis',
          'B': 'Basketball',
          'C': 'Volleyball',
          'D': 'Football'
        },
        correct_answer: 'B',
        explanation: 'A slam dunk is a basketball move where a player scores by putting the ball directly through the hoop.',
        points: 10,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ]
  };

  return mockQuestionsData[categoryName] || mockQuestionsData['General Knowledge'];
};

// Get mixed questions from all categories for instant quiz
const getMixedQuestions = (): Question[] => {
  const allQuestions: Question[] = [];
  const categories = ['General Knowledge', 'Science', 'History', 'Technology', 'Sports'];
  
  // Get 2 questions from each category
  categories.forEach(category => {
    const categoryQuestions = getMockQuestions(category);
    allQuestions.push(...categoryQuestions.slice(0, 2));
  });
  
  // Shuffle the questions
  for (let i = allQuestions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allQuestions[i], allQuestions[j]] = [allQuestions[j], allQuestions[i]];
  }
  
  return allQuestions.slice(0, 8); // Return 8 mixed questions
};

function QuizContent() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get URL parameters
  const sessionCode = searchParams.get('session');
  const categoryName = searchParams.get('category');
  const quizMode = searchParams.get('mode'); // 'instant' for immediate mixed quiz
  
  // Quiz state
  const [session, setSession] = useState<QuizSession | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(30);
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  
  // Category selection state
  const [showCategorySelection, setShowCategorySelection] = useState(false);
  const [availableCategories, setAvailableCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  useEffect(() => {
    initializeQuiz();
  }, [sessionCode, categoryName, quizMode]);

  useEffect(() => {
    if (isQuizStarted && timeLeft > 0 && !isQuizCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && isQuizStarted) {
      handleNextQuestion(); // Auto-submit when time runs out
    }
  }, [timeLeft, isQuizStarted, isQuizCompleted]);

  const initializeQuiz = async () => {
    if (!user) return;
    
    setLoading(true);
    setError('');

    try {
      // Handle instant quiz mode
      if (quizMode === 'instant') {
        console.log('Starting instant mixed quiz');
        const mixedQuestions = getMixedQuestions();
        setQuestions(mixedQuestions);
        setTimeLeft(30);
        setLoading(false);
        return;
      }

      // Check if we need to show category selection
      if (!sessionCode && !categoryName) {
        try {
          const categories = await getCategories();
          if (categories.length === 0) {
            // If no categories in database, use default categories from homepage
            console.log('No categories found in database, using default categories');
            const defaultCategories = [
              { id: 'mock-gk', name: 'General Knowledge', icon: '🎯', color: 'bg-green-100 border-green-200 hover:bg-green-200', icon_bg: 'bg-green-500', description: 'Mixed questions from various topics' },
              { id: 'mock-sci', name: 'Science', icon: '🧪', color: 'bg-blue-100 border-blue-200 hover:bg-blue-200', icon_bg: 'bg-blue-500', description: 'Biology, Chemistry, Physics and more' },
              { id: 'mock-hist', name: 'History', icon: '🏛️', color: 'bg-orange-100 border-orange-200 hover:bg-orange-200', icon_bg: 'bg-orange-500', description: 'World history and civilizations' },
              { id: 'mock-sport', name: 'Sports', icon: '⚽', color: 'bg-red-100 border-red-200 hover:bg-red-200', icon_bg: 'bg-red-500', description: 'Sports, games and athletics' },
              { id: 'mock-tech', name: 'Technology', icon: '💻', color: 'bg-purple-100 border-purple-200 hover:bg-purple-200', icon_bg: 'bg-purple-500', description: 'Computers, programming and tech' }
            ];
            setAvailableCategories(defaultCategories);
          } else {
            setAvailableCategories(categories);
          }
        } catch (error) {
          console.log('Database error, using default categories:', error);
          const defaultCategories = [
            { id: 'mock-gk', name: 'General Knowledge', icon: '🎯', color: 'bg-green-100 border-green-200 hover:bg-green-200', icon_bg: 'bg-green-500', description: 'Mixed questions from various topics' },
            { id: 'mock-sci', name: 'Science', icon: '🧪', color: 'bg-blue-100 border-blue-200 hover:bg-blue-200', icon_bg: 'bg-blue-500', description: 'Biology, Chemistry, Physics and more' },
            { id: 'mock-hist', name: 'History', icon: '🏛️', color: 'bg-orange-100 border-orange-200 hover:bg-orange-200', icon_bg: 'bg-orange-500', description: 'World history and civilizations' },
            { id: 'mock-sport', name: 'Sports', icon: '⚽', color: 'bg-red-100 border-red-200 hover:bg-red-200', icon_bg: 'bg-red-500', description: 'Sports, games and athletics' },
            { id: 'mock-tech', name: 'Technology', icon: '💻', color: 'bg-purple-100 border-purple-200 hover:bg-purple-200', icon_bg: 'bg-purple-500', description: 'Computers, programming and tech' }
          ];
          setAvailableCategories(defaultCategories);
        }
        setShowCategorySelection(true);
        setLoading(false);
        return;
      }

      if (sessionCode) {
        // Session-based quiz
        const sessionData = await getSessionByCode(sessionCode);
        if (!sessionData) {
          setError('Session not found. Please check the session code.');
          setLoading(false);
          return;
        }

        if (sessionData.status !== 'active' && sessionData.status !== 'waiting') {
          setError('This session is not currently active.');
          setLoading(false);
          return;
        }

        // Join the session as a participant
        await joinSessionAsParticipant(sessionData.id, user.id);

        // Get session questions
        const sessionQuestions = await getSessionQuestions(sessionData.id);
        if (sessionQuestions.length === 0) {
          setError('No questions found for this session.');
          setLoading(false);
          return;
        }

        setSession(sessionData);
        setQuestions(sessionQuestions);
        setTimeLeft(sessionData.time_limit || 30);
      } else if (categoryName) {
        // Regular category-based quiz
        try {
          const categories = await getCategories();
          const category = categories.find(c => c.name === categoryName);
          
          if (!category) {
            // If category not found in database, create a mock category and use mock questions
            console.log('Category not found in database, using mock data for:', categoryName);
            const mockQuestions = getMockQuestions(categoryName);
            setQuestions(mockQuestions);
            setTimeLeft(30);
          } else {
            // Get random questions from the category
            const categoryQuestions = await getRandomQuestions(category.id, 10);
            if (categoryQuestions.length === 0) {
              // If no questions found in database, use mock data
              console.log('No questions found in database, using mock data for category:', categoryName);
              const mockQuestions = getMockQuestions(categoryName);
              setQuestions(mockQuestions);
            } else {
              setQuestions(categoryQuestions);
            }
            setTimeLeft(30); // Default time for regular quiz
          }
        } catch (error) {
          console.log('Database error, falling back to mock data:', error);
          const mockQuestions = getMockQuestions(categoryName);
          setQuestions(mockQuestions);
          setTimeLeft(30);
        }
      } else {
        setError('No session code or category specified.');
        setLoading(false);
        return;
      }

    } catch (error) {
      console.error('Error initializing quiz:', error);
      setError('Failed to load quiz. Please try again.');
    }

    setLoading(false);
  };

  const startQuiz = () => {
    setIsQuizStarted(true);
    setStartTime(new Date());
  };

  const handleCategorySelect = (categoryName: string) => {
    setSelectedCategory(categoryName);
    // Navigate to quiz with selected category
    router.push(`/quiz?category=${encodeURIComponent(categoryName)}`);
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleNextQuestion = () => {
    // Save the answer
    if (selectedAnswer) {
      const newAnswers = { ...userAnswers };
      newAnswers[questions[currentQuestion].id] = selectedAnswer;
      setUserAnswers(newAnswers);
      
      // Check if answer is correct
      if (selectedAnswer === questions[currentQuestion].correct_answer) {
        setCorrectAnswers(prev => prev + 1);
        setScore(prev => prev + (questions[currentQuestion].points || 10));
      }
    }

    // Move to next question or finish quiz
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer('');
      setTimeLeft(session?.time_limit || 30); // Reset timer for next question
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = async () => {
    setIsQuizCompleted(true);
    
    if (!user) return;

    // Calculate time taken
    const timeTaken = startTime ? Math.floor((new Date().getTime() - startTime.getTime()) / 1000) : 0;

    try {
      if (session) {
        // Submit session-based quiz attempt
        await submitSessionQuizAttempt(
          session.id,
          user.id,
          userAnswers,
          score,
          questions.length,
          correctAnswers,
          timeTaken
        );
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="bg-white rounded-3xl p-8 shadow-lg text-center">
          <div className="text-4xl mb-4">⏳</div>
          <h2 className="text-xl font-bold text-gray-800">Loading Quiz...</h2>
          <p className="text-gray-600">Please wait while we prepare your questions</p>
        </div>
      </div>
    );
  }

  // Show category selection if no category or session is specified
  if (showCategorySelection) {
    const defaultCategories = [
      { 
        name: 'General Knowledge', 
        icon: '🎯', 
        color: 'bg-green-100 border-green-200 hover:bg-green-200', 
        icon_bg: 'bg-green-500',
        description: 'Mixed questions from various topics' 
      },
      { 
        name: 'Science', 
        icon: '🧪', 
        color: 'bg-blue-100 border-blue-200 hover:bg-blue-200', 
        icon_bg: 'bg-blue-500',
        description: 'Biology, Chemistry, Physics and more' 
      },
      { 
        name: 'History', 
        icon: '🏛️', 
        color: 'bg-orange-100 border-orange-200 hover:bg-orange-200', 
        icon_bg: 'bg-orange-500',
        description: 'World history and civilizations' 
      },
      { 
        name: 'Sports', 
        icon: '⚽', 
        color: 'bg-red-100 border-red-200 hover:bg-red-200', 
        icon_bg: 'bg-red-500',
        description: 'Sports, games and athletics' 
      },
      { 
        name: 'Technology', 
        icon: '💻', 
        color: 'bg-purple-100 border-purple-200 hover:bg-purple-200', 
        icon_bg: 'bg-purple-500',
        description: 'Computers, programming and tech' 
      }
    ];

    const categoriesToShow = availableCategories.length > 0 ? availableCategories : defaultCategories;

    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-100">
          <div className="max-w-7xl mx-auto flex justify-between items-center p-4 px-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">👑</span>
              </div>
              <h1 className="text-2xl font-bold text-purple-700">Hat rean Quiz</h1>
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
          {/* Hero Section */}
          <section className="text-center mb-12">
            <h2 className="text-5xl md:text-6xl font-bold text-transparent bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text mb-4">
              Choose Your Category 🚀
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Select a category to start your quiz adventure! 🧠✨
            </p>
          </section>

          {/* Category Selection */}
          <section className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoriesToShow.map((category, index) => (
                <div
                  key={index}
                  onClick={() => handleCategorySelect(category.name)}
                  className={`border-2 rounded-3xl p-6 hover:scale-105 transition-all cursor-pointer shadow-lg hover:shadow-xl ${
                    selectedCategory === category.name 
                      ? 'border-purple-500 bg-purple-50 ring-4 ring-purple-200' 
                      : category.color || 'bg-gray-100 border-gray-200 hover:bg-gray-200'
                  }`}
                >
                  <div className={`w-16 h-16 ${category.icon_bg || 'bg-gray-500'} rounded-2xl flex items-center justify-center mx-auto mb-4 ${
                    selectedCategory === category.name ? 'ring-2 ring-purple-400' : ''
                  }`}>
                    <span className="text-2xl text-white">{category.icon || '📚'}</span>
                  </div>
                  <h4 className={`font-bold mb-3 text-lg text-center ${
                    selectedCategory === category.name ? 'text-purple-800' : 'text-gray-800'
                  }`}>
                    {category.name}
                    {selectedCategory === category.name && <span className="ml-2">✓</span>}
                  </h4>
                  <p className={`text-sm leading-relaxed text-center ${
                    selectedCategory === category.name ? 'text-purple-600' : 'text-gray-600'
                  }`}>
                    {category.description || 'Test your knowledge in this category'}
                  </p>
                </div>
              ))}
            </div>
            
            {selectedCategory && (
              <div className="mt-8 p-6 bg-purple-50 rounded-3xl border-2 border-purple-200 max-w-2xl mx-auto text-center">
                <h4 className="text-xl font-bold text-purple-800 mb-2">
                  🎯 Selected: {selectedCategory}
                </h4>
                <p className="text-purple-600 mb-4">
                  Click the category again to start your quiz!
                </p>
              </div>
            )}
          </section>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="bg-white rounded-3xl p-8 shadow-lg text-center max-w-md">
          <div className="text-4xl mb-4">❌</div>
          <h2 className="text-xl font-bold text-red-600 mb-4">Quiz Error</h2>
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

  if (isQuizCompleted) {
    const percentage = questions.length > 0 ? Math.round((correctAnswers / questions.length) * 100) : 0;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="bg-white rounded-3xl p-8 shadow-lg text-center max-w-md">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Quiz Completed!</h2>
          
          {session && (
            <div className="mb-4 p-3 bg-purple-50 rounded-lg">
              <p className="text-sm text-purple-600 font-medium">Session: {session.title}</p>
              <p className="text-xs text-purple-500">Code: {session.session_code}</p>
            </div>
          )}
          
          <div className="space-y-3 mb-6">
            <p className="text-lg">
              <span className="font-semibold">Score:</span> {score} points
            </p>
            <p className="text-lg">
              <span className="font-semibold">Correct:</span> {correctAnswers}/{questions.length}
            </p>
            <p className="text-lg">
              <span className="font-semibold">Percentage:</span> {percentage}%
            </p>
          </div>
          
          <div className="space-y-3">
            <Link href="/homepage">
              <button className="w-full bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700 transition-colors">
                Back to Homepage
              </button>
            </Link>
            {session && (
              <Link href={`/admin/sessions`}>
                <button className="w-full bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-600 transition-colors">
                  View Session Results
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!isQuizStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="bg-white rounded-3xl p-8 shadow-lg text-center max-w-md">
          <div className="text-4xl mb-4">🚀</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Ready to Start?</h2>
          
          {session ? (
            <div className="mb-6 p-4 bg-purple-50 rounded-lg">
              <h3 className="font-bold text-purple-800">{session.title}</h3>
              <p className="text-sm text-purple-600">Session Code: {session.session_code}</p>
              {session.description && (
                <p className="text-sm text-gray-600 mt-2">{session.description}</p>
              )}
            </div>
          ) : (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-bold text-blue-800">
                {quizMode === 'instant' ? 'Mixed Quiz' : `${categoryName} Quiz`}
              </h3>
              <p className="text-sm text-blue-600">
                {quizMode === 'instant' ? 'Questions from all categories' : 'Practice Mode'}
              </p>
            </div>
          )}
          
          <div className="space-y-3 mb-6 text-left">
            <p className="flex items-center gap-2">
              <span className="text-blue-500">📝</span>
              <span>{questions.length} questions</span>
            </p>
            <p className="flex items-center gap-2">
              <span className="text-green-500">⏱️</span>
              <span>{session?.time_limit || 30} seconds per question</span>
            </p>
            <p className="flex items-center gap-2">
              <span className="text-purple-500">🎯</span>
              <span>Answer as many as you can!</span>
            </p>
          </div>
          
          <button
            onClick={startQuiz}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105"
          >
            Start Quiz! 🚀
          </button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold text-gray-800">
                {session ? `${session.title} - ${session.session_code}` : 
                 quizMode === 'instant' ? 'Mixed Quiz' : `${categoryName} Quiz`}
              </h1>
              <div className="flex items-center gap-4 mt-1">
                <span className="text-sm text-gray-600">
                  Question {currentQuestion + 1} of {questions.length}
                </span>
                <span className={`text-sm font-medium ${timeLeft <= 5 ? 'text-red-600' : 'text-blue-600'}`}>
                  ⏱️ {timeLeft}s
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Score</p>
              <p className="text-lg font-bold text-purple-600">{score}</p>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </header>

      {/* Quiz Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-3xl p-8 shadow-lg">
          {/* Question */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                {currentQ.difficulty}
              </span>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {currentQ.points || 10} points
              </span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 leading-relaxed">
              {currentQ.question_text}
            </h2>
          </div>

          {/* Options */}
          <div className="space-y-4 mb-8">
            {Object.entries(currentQ.options as Record<string, string>).map(([key, value]) => (
              <button
                key={key}
                onClick={() => handleAnswerSelect(key)}
                className={`w-full p-4 text-left rounded-xl border-2 transition-all ${
                  selectedAnswer === key
                    ? 'border-purple-500 bg-purple-50 text-purple-800'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <span className="font-semibold mr-3">{key}.</span>
                {value}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center">
            <button
              onClick={() => router.push('/homepage')}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
            >
              Exit Quiz
            </button>
            
            <button
              onClick={handleNextQuestion}
              disabled={!selectedAnswer}
              className={`px-8 py-3 rounded-xl font-semibold transition-all ${
                selectedAnswer
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next Question'} →
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function QuizPage() {
  return (
    <ProtectedRoute>
      <QuizContent />
    </ProtectedRoute>
  );
}

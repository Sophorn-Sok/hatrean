'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '../../../contexts/AuthContext';
import ProtectedRoute from '../../../components/ProtectedRoute';
import { 
  getSessionByCode, 
  getSessionQuestions, 
  joinSessionAsParticipant, 
  submitSessionQuizAttempt,
  saveQuizAttempt,
  updateUserQuizStats,
  getCategories,
  QuizSession
} from '../../lib/database';
import { 
  getQuestionsByCategory,
  getMixedQuestions as getMixedQuizQuestions,
  QuizQuestion 
} from '../../lib/quizData';
import Link from 'next/link';

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
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
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
  const [showAnswer, setShowAnswer] = useState(false);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  
  // Category selection state
  const [showCategorySelection, setShowCategorySelection] = useState(false);
  const [availableCategories, setAvailableCategories] = useState<Array<{id: string; name: string; icon: string; color: string; icon_bg: string; description?: string}>>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const initializeQuiz = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    setError('');

    try {
      // Handle instant quiz mode - always use new quiz data with 10 random questions
      if (quizMode === 'instant') {
        console.log('Starting instant mixed quiz with 10 questions');
        const mixedQuestions = getMixedQuizQuestions(10);
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

        // Convert to QuizQuestion format and limit to 10
        const convertedQuestions: QuizQuestion[] = sessionQuestions.slice(0, 10).map(q => ({
          id: q.id,
          category: 'Session',
          question_text: q.question_text,
          options: q.options as Record<string, string>,
          correct_answer: q.correct_answer,
          explanation: q.explanation || 'No explanation provided.',
          difficulty: q.difficulty,
          points: q.points
        }));

        setSession(sessionData);
        setQuestions(convertedQuestions);
        setTimeLeft(sessionData.time_limit || 30);
      } else if (categoryName) {
        // Category-based quiz - always use new quiz data with 10 questions
        console.log('Starting category quiz for:', categoryName);
        const categoryQuestions = getQuestionsByCategory(categoryName, 10);
        if (categoryQuestions.length === 0) {
          // Fallback to mixed questions if category not found
          const mixedQuestions = getMixedQuizQuestions(10);
          setQuestions(mixedQuestions);
        } else {
          setQuestions(categoryQuestions);
        }
        setTimeLeft(30);
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
  }, [user, quizMode, sessionCode, categoryName]);

  const handleSubmitAnswer = useCallback(() => {
    if (!selectedAnswer) return;
    
    setIsAnswerSubmitted(true);
    setShowAnswer(true);
    
    // Save the answer
    const newAnswers = { ...userAnswers };
    newAnswers[questions[currentQuestion].id] = selectedAnswer;
    setUserAnswers(newAnswers);
    
    // Check if answer is correct
    if (selectedAnswer === questions[currentQuestion].correct_answer) {
      setCorrectAnswers(prev => prev + 1);
      setScore(prev => prev + (questions[currentQuestion].points || 10));
    }
  }, [selectedAnswer, userAnswers, questions, currentQuestion]);

  useEffect(() => {
    initializeQuiz();
  }, [sessionCode, categoryName, quizMode, initializeQuiz]);

  useEffect(() => {
    if (isQuizStarted && timeLeft > 0 && !isQuizCompleted && !isAnswerSubmitted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && isQuizStarted && !isAnswerSubmitted) {
      // Auto-submit when time runs out
      if (selectedAnswer) {
        handleSubmitAnswer();
      } else {
        // If no answer selected, mark as wrong and show correct answer
        setIsAnswerSubmitted(true);
        setShowAnswer(true);
      }
    }
  }, [timeLeft, isQuizStarted, isQuizCompleted, isAnswerSubmitted, selectedAnswer, handleSubmitAnswer]);

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
    if (!isAnswerSubmitted) {
      setSelectedAnswer(answer);
    }
  };

  const handleNextQuestion = () => {
    // If answer hasn't been submitted yet, submit it
    if (!isAnswerSubmitted) {
      handleSubmitAnswer();
      return;
    }

    // Move to next question or finish quiz
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer('');
      setShowAnswer(false);
      setIsAnswerSubmitted(false);
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
      } else {
        // Save regular quiz attempt (instant quiz or category-based quiz)
        const quizAttemptData = {
          user_id: user.id,
          session_id: undefined, // Not a session-based quiz
          category_id: undefined, // We can set this later if needed
          questions_data: userAnswers, // Just store the user answers
          score,
          total_questions: questions.length,
          correct_answers: correctAnswers,
          time_taken: timeTaken,
          completed_at: new Date().toISOString()
        };

        const savedAttempt = await saveQuizAttempt(quizAttemptData);
        
        if (savedAttempt) {
          console.log('Quiz attempt saved successfully:', savedAttempt);
          
          // Update user's total score and quiz count
          const updatedStats = await updateUserQuizStats(user.id, score);
          if (updatedStats) {
            console.log('User stats updated successfully:', updatedStats);
          }
        } else {
          console.error('Failed to save quiz attempt');
        }
      }
      
      // For session-based quizzes, also update user stats
      if (session) {
        const updatedStats = await updateUserQuizStats(user.id, score);
        if (updatedStats) {
          console.log('User stats updated for session quiz:', updatedStats);
        }
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
          <div className="max-w-7xl mx-auto flex justify-between items-center p-6 px-8">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center overflow-hidden">
                <Image 
                  src="/logo (2).png" 
                  alt="Hat rean Logo" 
                  width={32} 
                  height={32} 
                  className="object-contain"
                />
              </div>
              <h1 className="text-2xl font-bold text-purple-700">Hat rean Quiz</h1>
            </div>
            <Link href="/homepage">
              <button className="px-6 py-3 text-sm text-gray-800 hover:text-purple-700 font-semibold transition-colors border-2 border-gray-300 rounded-xl hover:border-purple-400 hover:bg-purple-50 shadow-sm hover:shadow-md">
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
            <p className="text-xl text-gray-700 mb-8">
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
                    selectedCategory === category.name ? 'text-purple-700' : 'text-gray-700'
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
                <p className="text-purple-700 mb-4">
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
          <h2 className="text-xl font-bold text-red-700 mb-4">Quiz Error</h2>
          <p className="text-gray-700 mb-6">{error}</p>
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
          <h2 className="text-3xl font-bold text-black mb-6">Quiz Completed!</h2>
          
          {session && (
            <div className="mb-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
              <p className="text-sm text-purple-700 font-semibold">Session: {session.title}</p>
              <p className="text-xs text-purple-600">Code: {session.session_code}</p>
            </div>
          )}
          
          <div className="space-y-4 mb-8">
            <p className="text-lg text-gray-900">
              <span className="font-bold">Score:</span> <span className="text-purple-700 font-bold">{score} points</span>
            </p>
            <p className="text-lg text-gray-900">
              <span className="font-bold">Correct:</span> <span className="text-green-600 font-bold">{correctAnswers}/{questions.length}</span>
            </p>
            <p className="text-lg text-gray-900">
              <span className="font-bold">Percentage:</span> <span className="text-blue-600 font-bold">{percentage}%</span>
            </p>
          </div>
          
          <div className="space-y-4">
            <Link href="/homepage">
              <button className="w-full bg-purple-600 text-white px-6 py-4 rounded-xl font-semibold hover:bg-purple-700 transition-colors shadow-md hover:shadow-lg">
                Back to Homepage
              </button>
            </Link>
            <Link href="/profile">
              <button className="w-full bg-blue-500 text-white px-6 py-4 rounded-xl font-semibold hover:bg-blue-600 transition-colors shadow-md hover:shadow-lg">
                View Profile & History
              </button>
            </Link>
            {session && (
              <Link href={`/admin/sessions`}>
                <button className="w-full bg-green-500 text-white px-6 py-4 rounded-xl font-semibold hover:bg-green-600 transition-colors shadow-md hover:shadow-lg">
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
              <span className="text-gray-800 font-semibold">10 questions per session</span>
            </p>
            <p className="flex items-center gap-2">
              <span className="text-green-500">⏱️</span>
              <span className="text-gray-800 font-semibold">{session?.time_limit || 30} seconds per question</span>
            </p>
            <p className="flex items-center gap-2">
              <span className="text-purple-500">🎯</span>
              <span className="text-gray-800 font-semibold">Answer and see explanations!</span>
            </p>
            <p className="flex items-center gap-2">
              <span className="text-orange-500">🏆</span>
              <span className="text-gray-800 font-semibold">Earn points for correct answers!</span>
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
            <div className="flex flex-wrap justify-between items-center gap-2">
            <div>
              <h1 className="text-lg md:text-xl font-bold text-gray-800">
                {session ? `${session.title} - ${session.session_code}` : 
                 quizMode === 'instant' ? 'Mixed Quiz' : `${categoryName} Quiz`}
              </h1>
              <div className="flex items-center gap-4 mt-1">
                <span className="text-sm text-gray-700 font-medium">
                  Question {currentQuestion + 1} of {questions.length}
                </span>
                <span className={`text-sm font-bold ${timeLeft <= 5 ? 'text-red-700' : 'text-blue-700'}`}>
                  ⏱️ {timeLeft}s
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-700 font-medium">Score</p>
              <p className="text-lg font-bold text-purple-700">{score}</p>
            </div>
          </div>          {/* Progress Bar */}
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
              <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-semibold">
                {currentQ.difficulty}
              </span>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                {currentQ.points || 10} points
              </span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 leading-relaxed">
              {currentQ.question_text}
            </h2>
          </div>

          {/* Options */}
          <div className="space-y-4 mb-8">
            {Object.entries(currentQ.options as Record<string, string>).map(([key, value]) => {
              let buttonClass = `w-full p-4 text-left rounded-xl border-2 transition-all `;
              
              if (showAnswer) {
                // Show correct/incorrect after answer is submitted
                if (key === currentQ.correct_answer) {
                  buttonClass += 'border-green-500 bg-green-50 text-green-800';
                } else if (key === selectedAnswer && key !== currentQ.correct_answer) {
                  buttonClass += 'border-red-500 bg-red-50 text-red-800';
                } else {
                  buttonClass += 'border-gray-200 bg-gray-50 text-gray-600';
                }
              } else {
                // Normal state before answer submission
                if (selectedAnswer === key) {
                  buttonClass += 'border-purple-500 bg-purple-50 text-purple-800 font-medium';
                } else {
                  buttonClass += 'border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-800';
                }
              }
              
              return (
                <button
                  key={key}
                  onClick={() => handleAnswerSelect(key)}
                  disabled={isAnswerSubmitted}
                  className={buttonClass}
                >
                  <div className="flex items-center justify-between">
                    <div className="text-gray-800">
                      <span className="font-bold mr-3">{key}.</span>
                      {value}
                    </div>
                    {showAnswer && key === currentQ.correct_answer && (
                      <span className="text-green-600 font-bold">✓ Correct</span>
                    )}
                    {showAnswer && key === selectedAnswer && key !== currentQ.correct_answer && (
                      <span className="text-red-600 font-bold">✗ Wrong</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Show explanation after answer is submitted */}
          {showAnswer && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <h4 className="font-semibold text-blue-800 mb-2">💡 Explanation:</h4>
              <p className="text-blue-700">{currentQ.explanation}</p>
              <div className="mt-3 flex items-center gap-4 text-sm">
                <span className={`font-medium ${selectedAnswer === currentQ.correct_answer ? 'text-green-600' : 'text-red-600'}`}>
                  {selectedAnswer === currentQ.correct_answer ? '🎉 Correct!' : '❌ Incorrect'}
                </span>
                {selectedAnswer === currentQ.correct_answer && (
                  <span className="text-purple-600">+{currentQ.points} points</span>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <button
              onClick={() => router.push('/homepage')}
              className="px-6 py-3 bg-gray-300 text-gray-800 rounded-xl font-semibold hover:bg-gray-400 transition-colors border border-gray-400"
            >
              Exit Quiz
            </button>
            
            {!isAnswerSubmitted ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={!selectedAnswer}
                className={`px-8 py-3 rounded-xl font-semibold transition-all ${
                  selectedAnswer
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed border border-gray-400'
                }`}
              >
                Submit Answer 📝
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="px-8 py-3 rounded-xl font-semibold transition-all bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
              >
                {currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next Question'} →
              </button>
            )}
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

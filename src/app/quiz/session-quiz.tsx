'use client';

import { useState, useEffect, useCallback } from 'react';
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

function QuizContent() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get URL parameters
  const sessionCode = searchParams.get('session');
  const categoryName = searchParams.get('category');
  
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

  const initializeQuiz = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    setError('');

    try {
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
        const categories = await getCategories();
        const category = categories.find(c => c.name === categoryName);
        
        if (!category) {
          setError('Category not found.');
          setLoading(false);
          return;
        }

        // Get random questions from the category
        const categoryQuestions = await getRandomQuestions(category.id, 10);
        if (categoryQuestions.length === 0) {
          setError('No questions found for this category.');
          setLoading(false);
          return;
        }

        setQuestions(categoryQuestions);
        setTimeLeft(30); // Default time for regular quiz
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
  }, [sessionCode, categoryName, user]);

  const startQuiz = () => {
    setIsQuizStarted(true);
    setStartTime(new Date());
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const finishQuiz = useCallback(async () => {
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
  }, [user, startTime, session, userAnswers, score, questions.length, correctAnswers]);

  const handleNextQuestion = useCallback(() => {
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
  }, [selectedAnswer, userAnswers, questions, currentQuestion, session?.time_limit, finishQuiz]);

  useEffect(() => {
    initializeQuiz();
  }, [initializeQuiz]);

  useEffect(() => {
    if (isQuizStarted && timeLeft > 0 && !isQuizCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && isQuizStarted) {
      handleNextQuestion(); // Auto-submit when time runs out
    }
  }, [timeLeft, isQuizStarted, isQuizCompleted, handleNextQuestion]);

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
              <h3 className="font-bold text-blue-800">{categoryName} Quiz</h3>
              <p className="text-sm text-blue-600">Practice Mode</p>
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
                {session ? `${session.title} - ${session.session_code}` : `${categoryName} Quiz`}
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
            {currentQ.question_type === 'true_false' ? (
              // True/False options
              <>
                <button
                  onClick={() => handleAnswerSelect('true')}
                  className={`w-full p-4 text-left rounded-xl border-2 transition-all ${
                    selectedAnswer === 'true'
                      ? 'border-purple-500 bg-purple-50 text-purple-800'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <span className="font-semibold mr-3">✓</span>
                  True
                </button>
                <button
                  onClick={() => handleAnswerSelect('false')}
                  className={`w-full p-4 text-left rounded-xl border-2 transition-all ${
                    selectedAnswer === 'false'
                      ? 'border-purple-500 bg-purple-50 text-purple-800'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <span className="font-semibold mr-3">✗</span>
                  False
                </button>
              </>
            ) : (
              // Multiple choice options
              Object.entries(currentQ.options as Record<string, string>).map(([key, value]) => (
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
              ))
            )}
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

export default function SessionQuizPage() {
  return (
    <ProtectedRoute>
      <QuizContent />
    </ProtectedRoute>
  );
}

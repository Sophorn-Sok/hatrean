// Database utilities for Hat Rean Quiz Platform
import { supabase } from '../../lib/supabase';

// Types
export interface UserProfile {
  id: string;
  username: string;
  full_name: string;
  avatar_url?: string;
  role: 'user' | 'admin';
  total_score: number;
  total_quizzes: number;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  icon: string;
  color: string;
  icon_bg: string;
  created_by?: string;
  created_at: string;
}

export interface Question {
  id: string;
  category_id: string;
  question_text: string;
  question_type: 'multiple_choice' | 'true_false' | 'text';
  difficulty: 'easy' | 'medium' | 'hard';
  options?: Record<string, string>; // For multiple choice
  correct_answer: string;
  explanation?: string;
  points: number;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface QuizSession {
  id: string;
  session_code: string;
  title: string;
  description?: string;
  category_id?: string;
  created_by?: string;
  status: 'waiting' | 'active' | 'completed' | 'cancelled';
  start_time?: string;
  end_time?: string;
  time_limit?: number;
  max_participants?: number;
  questions?: string[]; // Array of question IDs
  settings?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface QuizAttempt {
  id: string;
  user_id: string;
  session_id?: string;
  category_id?: string;
  questions_data: any;
  score: number;
  total_questions: number;
  correct_answers: number;
  time_taken?: number;
  completed_at: string;
  created_at: string;
}

export interface UserStatistics {
  id: string;
  user_id: string;
  category_id?: string;
  total_attempts: number;
  best_score: number;
  average_score: number;
  total_time: number;
  streak: number;
  last_attempt?: string;
}

// User Profile Functions
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }

  return data;
};

// Debug function to check current user's authentication and role
export const debugCurrentUser = async () => {
  try {
    // Get current authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.error('Auth error:', authError);
      return { error: 'Authentication error', details: authError };
    }
    
    if (!user) {
      console.error('No authenticated user');
      return { error: 'No authenticated user' };
    }
    
    console.log('Authenticated user ID:', user.id);
    console.log('User email:', user.email);
    
    // Get user profile from database
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (profileError) {
      console.error('Profile error:', profileError);
      return { 
        error: 'Profile fetch error', 
        details: profileError,
        userId: user.id,
        userEmail: user.email
      };
    }
    
    console.log('User profile:', profile);
    
    return {
      success: true,
      userId: user.id,
      userEmail: user.email,
      profile: profile
    };
    
  } catch (error) {
    console.error('Debug error:', error);
    return { error: 'Debug function error', details: error };
  }
};

export const updateUserProfile = async (userId: string, updates: Partial<UserProfile>) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating user profile:', error);
    return null;
  }

  return data;
};

export const makeUserAdmin = async (userId: string) => {
  return updateUserProfile(userId, { role: 'admin' });
};

// Category Functions
export const getCategories = async (): Promise<Category[]> => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }

  return data || [];
};

export const createCategory = async (category: Omit<Category, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('categories')
    .insert([category])
    .select()
    .single();

  if (error) {
    console.error('Error creating category:', error);
    return null;
  }

  return data;
};

// Question Functions
export const getQuestionsByCategory = async (categoryId: string): Promise<Question[]> => {
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('category_id', categoryId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching questions:', error);
    return [];
  }

  return data || [];
};

export const createQuestion = async (question: Omit<Question, 'id' | 'created_at' | 'updated_at'>) => {
  // Debug current user before attempting to create question
  console.log('Attempting to create question...');
  const debugInfo = await debugCurrentUser();
  console.log('Current user debug info:', debugInfo);
  
  const { data, error } = await supabase
    .from('questions')
    .insert([question])
    .select()
    .single();

  if (error) {
    console.error('Error creating question:', error);
    console.error('Question data:', question);
    return null;
  }

  return data;
};

export const updateQuestion = async (questionId: string, updates: Partial<Question>) => {
  const { data, error } = await supabase
    .from('questions')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', questionId)
    .select()
    .single();

  if (error) {
    console.error('Error updating question:', error);
    return null;
  }

  return data;
};

export const deleteQuestion = async (questionId: string) => {
  const { error } = await supabase
    .from('questions')
    .delete()
    .eq('id', questionId);

  if (error) {
    console.error('Error deleting question:', error);
    return false;
  }

  return true;
};

// Quiz Session Functions
export const createQuizSession = async (session: Omit<QuizSession, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('quiz_sessions')
    .insert([session])
    .select()
    .single();

  if (error) {
    console.error('Error creating quiz session:', error);
    return null;
  }

  return data;
};

export const getQuizSession = async (sessionCode: string): Promise<QuizSession | null> => {
  const { data, error } = await supabase
    .from('quiz_sessions')
    .select('*')
    .eq('session_code', sessionCode)
    .single();

  if (error) {
    console.error('Error fetching quiz session:', error);
    return null;
  }

  return data;
};

export const getActiveQuizSessions = async (): Promise<QuizSession[]> => {
  const { data, error } = await supabase
    .from('quiz_sessions')
    .select('*')
    .in('status', ['waiting', 'active'])
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching active sessions:', error);
    return [];
  }

  return data || [];
};

export const updateQuizSessionStatus = async (sessionId: string, status: QuizSession['status']) => {
  const { data, error } = await supabase
    .from('quiz_sessions')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', sessionId)
    .select()
    .single();

  if (error) {
    console.error('Error updating session status:', error);
    return null;
  }

  return data;
};

// Session Participation Functions
export const joinQuizSession = async (sessionId: string, userId: string) => {
  const { data, error } = await supabase
    .from('session_participants')
    .insert([{ session_id: sessionId, user_id: userId }])
    .select()
    .single();

  if (error) {
    console.error('Error joining session:', error);
    return null;
  }

  return data;
};

export const getSessionParticipants = async (sessionId: string) => {
  const { data, error } = await supabase
    .from('session_participants')
    .select(`
      *,
      user_profiles:user_id (username, full_name),
      quiz_attempts:attempt_id (score, completed_at)
    `)
    .eq('session_id', sessionId);

  if (error) {
    console.error('Error fetching session participants:', error);
    return [];
  }

  return data || [];
};

// Quiz Attempt Functions
export const saveQuizAttempt = async (attempt: Omit<QuizAttempt, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('quiz_attempts')
    .insert([attempt])
    .select()
    .single();

  if (error) {
    console.error('Error saving quiz attempt:', error);
    return null;
  }

  return data;
};

export const getUserQuizHistory = async (userId: string): Promise<QuizAttempt[]> => {
  const { data, error } = await supabase
    .from('quiz_attempts')
    .select(`
      *,
      categories:category_id (name, icon),
      quiz_sessions:session_id (title, session_code)
    `)
    .eq('user_id', userId)
    .order('completed_at', { ascending: false });

  if (error) {
    console.error('Error fetching quiz history:', error);
    return [];
  }

  return data || [];
};

// Statistics Functions
export const getUserStatistics = async (userId: string): Promise<UserStatistics[]> => {
  const { data, error } = await supabase
    .from('user_statistics')
    .select(`
      *,
      categories:category_id (name, icon)
    `)
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching user statistics:', error);
    return [];
  }

  return data || [];
};

export const getLeaderboard = async (categoryId?: string, limit: number = 10) => {
  let query = supabase
    .from('user_profiles')
    .select('id, username, full_name, total_score, total_quizzes')
    .order('total_score', { ascending: false })
    .limit(limit);

  // If category-specific leaderboard is needed, we'd need to join with user_statistics
  if (categoryId) {
    const { data, error } = await supabase
      .from('user_statistics')
      .select(`
        user_id,
        best_score,
        total_attempts,
        user_profiles:user_id (username, full_name)
      `)
      .eq('category_id', categoryId)
      .order('best_score', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching category leaderboard:', error);
      return [];
    }

    return data || [];
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }

  return data || [];
};

// Utility function to generate random session code
export const generateSessionCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Function to get random questions for a quiz
export const getRandomQuestions = async (categoryId: string, count: number = 10): Promise<Question[]> => {
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('category_id', categoryId);

  if (error) {
    console.error('Error fetching questions:', error);
    return [];
  }

  // Shuffle and take the requested count
  const shuffled = (data || []).sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Session-based Quiz Functions
export const getSessionQuestions = async (sessionId: string): Promise<Question[]> => {
  // First get the session to get the question IDs
  const { data: session, error: sessionError } = await supabase
    .from('quiz_sessions')
    .select('questions')
    .eq('id', sessionId)
    .single();

  if (sessionError || !session?.questions) {
    console.error('Error fetching session or no questions:', sessionError);
    return [];
  }

  // Then fetch the actual questions
  const { data: questions, error: questionsError } = await supabase
    .from('questions')
    .select('*')
    .in('id', session.questions);

  if (questionsError) {
    console.error('Error fetching session questions:', questionsError);
    return [];
  }

  return questions || [];
};

export const getSessionByCode = async (sessionCode: string): Promise<QuizSession | null> => {
  const { data, error } = await supabase
    .from('quiz_sessions')
    .select(`
      *,
      categories:category_id (name, icon, color)
    `)
    .eq('session_code', sessionCode.toUpperCase())
    .single();

  if (error) {
    console.error('Error fetching session by code:', error);
    return null;
  }

  return data;
};

export const joinSessionAsParticipant = async (sessionId: string, userId: string) => {
  // Check if user is already a participant
  const { data: existing } = await supabase
    .from('session_participants')
    .select('id')
    .eq('session_id', sessionId)
    .eq('user_id', userId)
    .single();

  if (existing) {
    return existing; // Already joined
  }

  // Join the session
  const { data, error } = await supabase
    .from('session_participants')
    .insert([{ session_id: sessionId, user_id: userId }])
    .select()
    .single();

  if (error) {
    console.error('Error joining session:', error);
    return null;
  }

  return data;
};

export const submitSessionQuizAttempt = async (
  sessionId: string,
  userId: string,
  answers: Record<string, string>,
  score: number,
  totalQuestions: number,
  correctAnswers: number,
  timeTaken?: number
) => {
  // Save the quiz attempt
  const attemptData = {
    user_id: userId,
    session_id: sessionId,
    questions_data: answers,
    score,
    total_questions: totalQuestions,
    correct_answers: correctAnswers,
    time_taken: timeTaken,
    completed_at: new Date().toISOString()
  };

  const { data: attempt, error: attemptError } = await supabase
    .from('quiz_attempts')
    .insert([attemptData])
    .select()
    .single();

  if (attemptError) {
    console.error('Error saving quiz attempt:', attemptError);
    return null;
  }

  // Update the session participant with the attempt ID
  const { error: participantError } = await supabase
    .from('session_participants')
    .update({ attempt_id: attempt.id })
    .eq('session_id', sessionId)
    .eq('user_id', userId);

  if (participantError) {
    console.error('Error updating participant attempt:', participantError);
  }

  return attempt;
};

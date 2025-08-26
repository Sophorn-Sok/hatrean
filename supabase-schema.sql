-- Hat Rean Quiz Platform Database Schema
-- Run this SQL in your Supabase SQL Editor

-- Create custom types
CREATE TYPE quiz_difficulty AS ENUM ('easy', 'medium', 'hard');
CREATE TYPE question_type AS ENUM ('multiple_choice', 'true_false', 'text');
CREATE TYPE session_status AS ENUM ('waiting', 'active', 'completed', 'cancelled');

-- 1. Users table (extends Supabase auth.users)
CREATE TABLE public.user_profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    username TEXT UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    total_score INTEGER DEFAULT 0,
    total_quizzes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Categories table
CREATE TABLE public.categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT DEFAULT '📚',
    color TEXT DEFAULT 'bg-blue-100',
    icon_bg TEXT DEFAULT 'bg-blue-500',
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Questions table
CREATE TABLE public.questions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_type question_type DEFAULT 'multiple_choice',
    difficulty quiz_difficulty DEFAULT 'medium',
    options JSONB, -- For multiple choice: {"A": "option1", "B": "option2", "C": "option3", "D": "option4"}
    correct_answer TEXT NOT NULL, -- For multiple choice: "A", for true/false: "true"/"false"
    explanation TEXT,
    points INTEGER DEFAULT 10,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Quiz Sessions table (for admin-created sessions)
CREATE TABLE public.quiz_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_code TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    category_id UUID REFERENCES public.categories(id),
    created_by UUID REFERENCES auth.users(id),
    status session_status DEFAULT 'waiting',
    start_time TIMESTAMP WITH TIME ZONE,
    end_time TIMESTAMP WITH TIME ZONE,
    time_limit INTEGER, -- in minutes
    max_participants INTEGER,
    questions JSONB, -- Array of question IDs
    settings JSONB DEFAULT '{}', -- Quiz settings like shuffle, show_answers, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. User Quiz Attempts table
CREATE TABLE public.quiz_attempts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    session_id UUID REFERENCES public.quiz_sessions(id) ON DELETE SET NULL,
    category_id UUID REFERENCES public.categories(id),
    questions_data JSONB NOT NULL, -- Questions and user answers
    score INTEGER DEFAULT 0,
    total_questions INTEGER NOT NULL,
    correct_answers INTEGER DEFAULT 0,
    time_taken INTEGER, -- in seconds
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Session Participants table
CREATE TABLE public.session_participants (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id UUID REFERENCES public.quiz_sessions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    attempt_id UUID REFERENCES public.quiz_attempts(id) ON DELETE SET NULL,
    UNIQUE(session_id, user_id)
);

-- 7. User Statistics table
CREATE TABLE public.user_statistics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    category_id UUID REFERENCES public.categories(id),
    total_attempts INTEGER DEFAULT 0,
    best_score INTEGER DEFAULT 0,
    average_score DECIMAL(5,2) DEFAULT 0,
    total_time INTEGER DEFAULT 0, -- total time spent in seconds
    streak INTEGER DEFAULT 0,
    last_attempt TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, category_id)
);

-- Insert default categories
INSERT INTO public.categories (name, description, icon, color, icon_bg) VALUES
('General Knowledge', 'Mixed questions from various topics', '🎯', 'bg-green-100', 'bg-green-500'),
('Science', 'Biology, Chemistry, Physics and more', '🧪', 'bg-blue-100', 'bg-blue-500'),
('History', 'World history and civilizations', '🏛️', 'bg-orange-100', 'bg-orange-500'),
('Sports', 'Sports, games and athletics', '⚽', 'bg-red-100', 'bg-red-500'),
('Technology', 'Computers, programming and tech', '💻', 'bg-purple-100', 'bg-purple-500');

-- Create indexes for better performance
CREATE INDEX idx_questions_category ON public.questions(category_id);
CREATE INDEX idx_quiz_attempts_user ON public.quiz_attempts(user_id);
CREATE INDEX idx_quiz_attempts_session ON public.quiz_attempts(session_id);
CREATE INDEX idx_session_participants_session ON public.session_participants(session_id);
CREATE INDEX idx_session_participants_user ON public.session_participants(user_id);
CREATE INDEX idx_user_statistics_user ON public.user_statistics(user_id);

-- Row Level Security Policies

-- User Profiles
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view all profiles" ON public.user_profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.user_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.user_profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Categories
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories are viewable by everyone" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Only admins can manage categories" ON public.categories FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.user_profiles 
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- Questions
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Questions are viewable by everyone" ON public.questions FOR SELECT USING (true);
CREATE POLICY "Only admins can insert questions" ON public.questions FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.user_profiles 
        WHERE id = auth.uid() AND role = 'admin'
    )
);
CREATE POLICY "Only admins can update questions" ON public.questions FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM public.user_profiles 
        WHERE id = auth.uid() AND role = 'admin'
    )
) WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.user_profiles 
        WHERE id = auth.uid() AND role = 'admin'
    )
);
CREATE POLICY "Only admins can delete questions" ON public.questions FOR DELETE USING (
    EXISTS (
        SELECT 1 FROM public.user_profiles 
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- Quiz Sessions
ALTER TABLE public.quiz_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Sessions are viewable by everyone" ON public.quiz_sessions FOR SELECT USING (true);
CREATE POLICY "Only admins can insert sessions" ON public.quiz_sessions FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.user_profiles 
        WHERE id = auth.uid() AND role = 'admin'
    )
);
CREATE POLICY "Only admins can update sessions" ON public.quiz_sessions FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM public.user_profiles 
        WHERE id = auth.uid() AND role = 'admin'
    )
) WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.user_profiles 
        WHERE id = auth.uid() AND role = 'admin'
    )
);
CREATE POLICY "Only admins can delete sessions" ON public.quiz_sessions FOR DELETE USING (
    EXISTS (
        SELECT 1 FROM public.user_profiles 
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- Quiz Attempts
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own attempts" ON public.quiz_attempts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own attempts" ON public.quiz_attempts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all attempts" ON public.quiz_attempts FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.user_profiles 
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- Session Participants
ALTER TABLE public.session_participants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view sessions they joined" ON public.session_participants FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can join sessions" ON public.session_participants FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all participants" ON public.session_participants FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.user_profiles 
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- User Statistics
ALTER TABLE public.user_statistics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own statistics" ON public.user_statistics FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can update statistics" ON public.user_statistics FOR ALL USING (true);

-- Functions for automatic user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    username_value TEXT;
    counter INTEGER := 0;
    base_username TEXT;
    user_role TEXT;
BEGIN
    BEGIN
        -- Get base username (either from metadata or email prefix)
        base_username := COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1));
        username_value := base_username;
        
        -- If username already exists, append a number
        WHILE EXISTS (SELECT 1 FROM public.user_profiles WHERE username = username_value) LOOP
            counter := counter + 1;
            username_value := base_username || counter::TEXT;
        END LOOP;
        
        -- Get role from metadata, default to 'user' if not specified
        user_role := COALESCE(NEW.raw_user_meta_data->>'accountType', 'user');
        
        -- Debug: Log the metadata and role (this will appear in Supabase logs)
        RAISE LOG 'Creating user profile for %, metadata: %, role: %', NEW.email, NEW.raw_user_meta_data, user_role;
        
        INSERT INTO public.user_profiles (id, username, full_name, role)
        VALUES (
            NEW.id,
            username_value,
            COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
            user_role
        );
        
        -- Log successful creation
        RAISE LOG 'Successfully created user profile with role: %', user_role;
        
    EXCEPTION WHEN OTHERS THEN
        RAISE EXCEPTION 'Database error saving new user: %', SQLERRM;
    END;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile on signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update user statistics after quiz completion
CREATE OR REPLACE FUNCTION public.update_user_statistics()
RETURNS TRIGGER AS $$
BEGIN
    -- Update or insert user statistics
    INSERT INTO public.user_statistics (
        user_id, 
        category_id, 
        total_attempts, 
        best_score, 
        average_score,
        total_time,
        last_attempt
    )
    VALUES (
        NEW.user_id,
        NEW.category_id,
        1,
        NEW.score,
        NEW.score,
        COALESCE(NEW.time_taken, 0),
        NEW.completed_at
    )
    ON CONFLICT (user_id, category_id)
    DO UPDATE SET
        total_attempts = user_statistics.total_attempts + 1,
        best_score = GREATEST(user_statistics.best_score, NEW.score),
        average_score = (user_statistics.average_score * user_statistics.total_attempts + NEW.score) / (user_statistics.total_attempts + 1),
        total_time = user_statistics.total_time + COALESCE(NEW.time_taken, 0),
        last_attempt = NEW.completed_at,
        updated_at = NOW();

    -- Update user profile totals
    UPDATE public.user_profiles
    SET 
        total_score = total_score + NEW.score,
        total_quizzes = total_quizzes + 1,
        updated_at = NOW()
    WHERE id = NEW.user_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update statistics after quiz completion
CREATE TRIGGER on_quiz_attempt_completed
    AFTER INSERT ON public.quiz_attempts
    FOR EACH ROW EXECUTE FUNCTION public.update_user_statistics();

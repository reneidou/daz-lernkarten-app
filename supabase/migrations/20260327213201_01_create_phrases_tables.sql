/*
  # DailyPhrases Database Schema

  1. New Tables
    - `phrases` - Vocabulary items with difficulty levels
      - `id` (uuid, primary key)
      - `german_phrase` (text) - The German word/phrase
      - `english_translation` (text) - English translation
      - `base_difficulty` (integer 1-10) - Base difficulty level (1=easiest, 10=hardest)
      - `context` (text) - Usage context or example sentence
      - `category` (text) - Category (work, daily, integration, etc)
      - `country` (text) - CH, DE, or AT specific usage
      - `created_at` (timestamp)

    - `user_progress` - Tracks user's learning progress per phrase
      - `id` (uuid, primary key)
      - `user_id` (uuid) - Reference to auth.users
      - `phrase_id` (uuid) - Reference to phrases
      - `correct_count` (integer) - Times answered correctly
      - `incorrect_count` (integer) - Times answered incorrectly
      - `last_reviewed` (timestamp) - Last time user saw this phrase
      - `next_review` (timestamp) - When to show again (spaced repetition)
      - `mastery_level` (integer 0-100) - User's mastery of this phrase
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `user_levels` - Tracks user's current German level
      - `user_id` (uuid, primary key) - Reference to auth.users
      - `current_level` (decimal 1-10) - Current German level based on performance
      - `total_phrases_learned` (integer) - Total phrases mastered
      - `streak_days` (integer) - Consecutive days of practice
      - `last_practice` (timestamp) - Last time user practiced
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Users can only see/modify their own progress and level
    - Phrases table is readable by all authenticated users
*/

CREATE TABLE IF NOT EXISTS phrases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  german_phrase text NOT NULL UNIQUE,
  english_translation text NOT NULL,
  base_difficulty integer NOT NULL CHECK (base_difficulty >= 1 AND base_difficulty <= 10),
  context text,
  category text,
  country text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE phrases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Phrases are readable by authenticated users"
  ON phrases FOR SELECT
  TO authenticated
  USING (true);

CREATE TABLE IF NOT EXISTS user_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  phrase_id uuid NOT NULL REFERENCES phrases(id) ON DELETE CASCADE,
  correct_count integer DEFAULT 0,
  incorrect_count integer DEFAULT 0,
  last_reviewed timestamptz,
  next_review timestamptz DEFAULT now(),
  mastery_level integer DEFAULT 0 CHECK (mastery_level >= 0 AND mastery_level <= 100),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, phrase_id)
);

ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own progress"
  ON user_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON user_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON user_progress FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS user_levels (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  current_level decimal(3,1) DEFAULT 1.0 CHECK (current_level >= 1 AND current_level <= 10),
  total_phrases_learned integer DEFAULT 0,
  streak_days integer DEFAULT 0,
  last_practice timestamptz,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_levels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own level"
  ON user_levels FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own level"
  ON user_levels FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert own level"
  ON user_levels FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Seed with initial phrases for testing
INSERT INTO phrases (german_phrase, english_translation, base_difficulty, context, category, country) VALUES
  ('Guten Morgen', 'Good morning', 1, 'Greeting in morning', 'daily', 'CH'),
  ('Wie geht es dir?', 'How are you?', 1, 'Polite greeting', 'daily', 'CH'),
  ('Danke dir', 'Thank you', 1, 'Expression of gratitude', 'daily', 'CH'),
  ('Bitte schön', 'You are welcome', 2, 'Response to thank you', 'daily', 'CH'),
  ('Ich bin neu hier', 'I am new here', 2, 'Integration phrase', 'integration', 'CH'),
  ('Wo ist die Toilette?', 'Where is the toilet?', 2, 'Common question', 'daily', 'CH'),
  ('Ich verstehe nicht', 'I do not understand', 2, 'Communication challenge', 'daily', 'CH'),
  ('Können Sie mir helfen?', 'Can you help me?', 2, 'Polite request', 'daily', 'CH'),
  ('Das kostet zu viel', 'That costs too much', 3, 'Shopping context', 'work', 'CH'),
  ('Ich bin arbeitslos', 'I am unemployed', 3, 'Integration phrase', 'integration', 'CH'),
  ('Mein Name ist...', 'My name is...', 1, 'Self introduction', 'daily', 'CH'),
  ('Ich komme aus...', 'I come from...', 2, 'Origin statement', 'daily', 'CH'),
  ('Sprechen Sie Englisch?', 'Do you speak English?', 2, 'Language question', 'daily', 'CH'),
  ('Ich lerne Deutsch', 'I am learning German', 2, 'Learning statement', 'daily', 'CH'),
  ('Das ist sehr schwierig', 'That is very difficult', 3, 'Expression of difficulty', 'daily', 'CH'),
  ('Können Sie langsamer sprechen?', 'Can you speak more slowly?', 3, 'Language learning phrase', 'daily', 'CH'),
  ('Ich suche einen Job', 'I am looking for a job', 3, 'Employment phrase', 'work', 'CH'),
  ('Das ist mein erstes Mal hier', 'This is my first time here', 3, 'Integration phrase', 'integration', 'CH'),
  ('Die Miete ist zu hoch', 'The rent is too high', 4, 'Housing/finance', 'work', 'CH'),
  ('Ich habe ein Praktikum', 'I have an internship', 4, 'Work phrase', 'work', 'CH')
ON CONFLICT DO NOTHING;

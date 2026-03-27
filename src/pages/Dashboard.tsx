import { useEffect, useState } from 'react';
import { BookOpen, TrendingUp, Calendar, Zap, LogOut, CreditCard } from 'lucide-react';
import { supabase } from '../supabase';
import { useNavigate } from '../hooks/useRouter';

interface UserLevel {
  current_level: number;
  total_phrases_learned: number;
  streak_days: number;
  last_practice: string;
}

interface Phrase {
  id: string;
  german_phrase: string;
}

interface UserProgress {
  phrase_id: string;
  mastery_level: number;
  correct_count: number;
  incorrect_count: number;
}

export function Dashboard() {
  const navigate = useNavigate();
  const [userLevel, setUserLevel] = useState<UserLevel | null>(null);
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [phrases, setPhrasesState] = useState<Record<string, Phrase>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) {
        navigate('login');
        return;
      }
      const { data: levelData } = await supabase
        .from('user_levels')
        .select('*')
        .eq('user_id', authUser.id)
        .maybeSingle();

      if (levelData) {
        const learned = levelData.total_phrases_learned || 0;
        setUserLevel({ ...levelData, total_phrases_learned: learned });
      }

      const { data: progressData } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', authUser.id);

      if (progressData) {
        setProgress(progressData);

        const phraseIds = [...new Set(progressData.map(p => p.phrase_id))];
        const { data: phrasesData } = await supabase
          .from('phrases')
          .select('id, german_phrase')
          .in('id', phraseIds);

        const phraseMap: Record<string, Phrase> = {};
        if (phrasesData) {
          phrasesData.forEach(p => {
            phraseMap[p.id] = p;
          });
        }
        setPhrasesState(phraseMap);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('landing');
  };

  const stats = {
    level: userLevel?.current_level || 1,
    streak: userLevel?.streak_days || 0,
    learned: progress.filter(p => p.mastery_level >= 80).length,
    total: progress.length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">DailyPhrases</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('pricing')}
              className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition font-semibold"
            >
              <CreditCard className="w-4 h-4" />
              Upgrade
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Current Level</p>
                <p className="text-3xl font-bold text-gray-900">{stats.level.toFixed(1)}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Phrases Mastered</p>
                <p className="text-3xl font-bold text-gray-900">{stats.learned}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Phrases</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Zap className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Streak</p>
                <p className="text-3xl font-bold text-gray-900">{stats.streak}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Ready to Learn?</h2>
          <p className="text-gray-600 mb-6">Complete 10 phrases today to maintain your streak and improve your level.</p>
          <button
            onClick={() => navigate('trainer')}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold text-lg"
          >
            Start Daily Practice
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Progress</h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {progress
              .sort((a, b) => b.mastery_level - a.mastery_level)
              .map(p => {
                const phrase = phrases[p.phrase_id];
                if (!phrase) return null;
                return (
                  <div key={p.phrase_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-semibold text-gray-900">{phrase.german_phrase}</p>
                      <p className="text-xs text-gray-600">
                        {p.correct_count} correct, {p.incorrect_count} incorrect
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="w-24 bg-gray-200 rounded-full h-2 mb-1">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${p.mastery_level}%` }}
                        />
                      </div>
                      <p className="text-sm font-semibold text-gray-700">{p.mastery_level}%</p>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </main>
    </div>
  );
}

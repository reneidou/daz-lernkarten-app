import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, ChevronRight, Zap } from 'lucide-react';
import { supabase } from '../supabase';
import { useNavigate } from '../hooks/useRouter';

interface Phrase {
  id: string;
  german_phrase: string;
  english_translation: string;
  context: string;
  category?: string;
}

interface UserProgress {
  id?: string;
  phrase_id: string;
  mastery_level: number;
  correct_count: number;
  incorrect_count: number;
}

export function Trainer() {
  const navigate = useNavigate();
  const [phrases, setPhrasesState] = useState<Phrase[]>([]);
  const [userProgress, setUserProgress] = useState<Record<string, UserProgress>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userLevel, setUserLevel] = useState(1);
  const [todayCount, setTodayCount] = useState(0);
  const [user, setUser] = useState<any>(null);

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
      setUser(authUser);

      const { data: levelData } = await supabase
        .from('user_levels')
        .select('current_level')
        .eq('user_id', authUser.id)
        .maybeSingle();

      if (levelData) setUserLevel(levelData.current_level);

      const { data: progressData } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', authUser.id);

      const progressMap: Record<string, UserProgress> = {};
      if (progressData) {
        progressData.forEach(p => {
          progressMap[p.phrase_id] = p;
        });
      }
      setUserProgress(progressMap);

      const { data: phrasesData } = await supabase
        .from('phrases')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (phrasesData) {
        const sorted = phrasesData.sort((a, b) => {
          const aProgress = progressMap[a.id];
          const bProgress = progressMap[b.id];
          const aScore = (aProgress?.correct_count || 0) / Math.max((aProgress?.correct_count || 0) + (aProgress?.incorrect_count || 0), 1);
          const bScore = (bProgress?.correct_count || 0) / Math.max((bProgress?.correct_count || 0) + (bProgress?.incorrect_count || 0), 1);
          return aScore - bScore;
        });
        setPhrasesState(sorted);
        setTodayCount(0);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleCorrect = async () => {
    if (!user || !phrases.length) return;

    const phrase = phrases[currentIndex];
    const progress = userProgress[phrase.id];

    try {
      if (progress) {
        await supabase
          .from('user_progress')
          .update({
            correct_count: progress.correct_count + 1,
            mastery_level: Math.min(100, (progress.mastery_level || 0) + 10),
            last_reviewed: new Date().toISOString(),
            next_review: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('id', progress.id);
      } else {
        await supabase
          .from('user_progress')
          .insert({
            user_id: user.id,
            phrase_id: phrase.id,
            correct_count: 1,
            mastery_level: 10,
            last_reviewed: new Date().toISOString(),
            next_review: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          });
      }

      setUserProgress(prev => ({
        ...prev,
        [phrase.id]: {
          ...prev[phrase.id],
          correct_count: (prev[phrase.id]?.correct_count || 0) + 1,
          mastery_level: Math.min(100, (prev[phrase.id]?.mastery_level || 0) + 10),
        }
      }));

      moveToNext();
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const handleIncorrect = async () => {
    if (!user || !phrases.length) return;

    const phrase = phrases[currentIndex];
    const progress = userProgress[phrase.id];

    try {
      if (progress) {
        await supabase
          .from('user_progress')
          .update({
            incorrect_count: progress.incorrect_count + 1,
            mastery_level: Math.max(0, (progress.mastery_level || 0) - 5),
            last_reviewed: new Date().toISOString(),
            next_review: new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('id', progress.id);
      } else {
        await supabase
          .from('user_progress')
          .insert({
            user_id: user.id,
            phrase_id: phrase.id,
            incorrect_count: 1,
            mastery_level: 0,
            last_reviewed: new Date().toISOString(),
            next_review: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
          });
      }

      setUserProgress(prev => ({
        ...prev,
        [phrase.id]: {
          ...prev[phrase.id],
          incorrect_count: (prev[phrase.id]?.incorrect_count || 0) + 1,
          mastery_level: Math.max(0, (prev[phrase.id]?.mastery_level || 0) - 5),
        }
      }));

      moveToNext();
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const moveToNext = () => {
    if (currentIndex < phrases.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowTranslation(false);
      setTodayCount(todayCount + 1);
    } else {
      setShowTranslation(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your daily practice...</p>
        </div>
      </div>
    );
  }

  if (!phrases.length) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No phrases available yet.</p>
        </div>
      </div>
    );
  }

  const phrase = phrases[currentIndex];
  const progress = userProgress[phrase.id];
  const masteryLevel = progress?.mastery_level || 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Daily Practice</h1>
            <p className="text-sm text-gray-600">Level {userLevel.toFixed(1)}</p>
          </div>
          <button
            onClick={() => navigate('dashboard')}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
          >
            Dashboard
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Progress Today</span>
            <span className="text-sm font-semibold text-blue-600">{todayCount}/10</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(todayCount / 10) * 100}%` }}
            />
          </div>
        </div>

        {todayCount >= 10 ? (
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-12 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Perfect!</h2>
            <p className="text-gray-600 mb-6">You've completed 10 phrases today. Come back tomorrow to continue your streak!</p>
            <button
              onClick={() => navigate('dashboard')}
              className="inline-block px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
            >
              View Dashboard
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-500 uppercase">Mastery</span>
                <span className="text-sm font-bold text-blue-600">{masteryLevel}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${masteryLevel}%` }}
                />
              </div>
            </div>

            <div className="text-center mb-12">
              <div className="inline-block mb-6">
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  <Zap className="w-4 h-4" />
                  {phrase.category}
                </span>
              </div>

              <p className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 break-words">
                {phrase.german_phrase}
              </p>

              {phrase.context && (
                <p className="text-gray-600 italic mb-8 text-lg">
                  {phrase.context}
                </p>
              )}

              {showTranslation && (
                <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mb-8">
                  <p className="text-2xl text-blue-900 font-semibold">
                    {phrase.english_translation}
                  </p>
                </div>
              )}

              {!showTranslation && (
                <button
                  onClick={() => setShowTranslation(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition mb-8"
                >
                  <ChevronRight className="w-5 h-5" />
                  Show Translation
                </button>
              )}
            </div>

            {showTranslation && (
              <div className="flex gap-4 flex-col sm:flex-row">
                <button
                  onClick={handleIncorrect}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-50 hover:bg-red-100 text-red-600 font-semibold rounded-lg transition border-2 border-red-200"
                >
                  <XCircle className="w-5 h-5" />
                  Not Yet
                </button>
                <button
                  onClick={handleCorrect}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-50 hover:bg-green-100 text-green-600 font-semibold rounded-lg transition border-2 border-green-200"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  Got It!
                </button>
              </div>
            )}

            {!showTranslation && (
              <button
                onClick={() => setShowTranslation(true)}
                className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
              >
                Check Answer
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

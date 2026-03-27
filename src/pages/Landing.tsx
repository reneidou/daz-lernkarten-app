import { BookOpen, Zap, Award, CheckCircle } from 'lucide-react';
import { useNavigate } from '../hooks/useRouter';

export function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">DailyPhrases</span>
          </div>
          <button
            onClick={() => navigate('login')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Sign In
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="py-20 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Learn German Daily, Stay in Flow
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Master everyday German phrases and vocabulary with intelligent spaced repetition. Our adaptive system adjusts difficulty based on your performance, keeping you motivated and in the optimal learning zone.
          </p>
          <button
            onClick={() => navigate('signup')}
            className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition text-lg"
          >
            Start Learning Free
          </button>
        </section>

        <section className="py-16 grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <Zap className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-3">Adaptive Learning</h3>
            <p className="text-gray-600">
              Difficulty automatically adjusts based on your performance. Struggle? Get easier words. Crushing it? Level up your challenge.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md">
            <Award className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-3">Spaced Repetition</h3>
            <p className="text-gray-600">
              Scientifically-proven method shows you phrases at exactly the right moment to maximize retention and long-term memory.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md">
            <CheckCircle className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-3">Real-World German</h3>
            <p className="text-gray-600">
              Learn everyday phrases and work-related vocabulary used in Switzerland, Germany, and Austria. Build real integration skills.
            </p>
          </div>
        </section>

        <section className="py-16 bg-blue-50 rounded-lg p-8 my-16">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">1</div>
              <h4 className="font-semibold mb-2">Sign Up</h4>
              <p className="text-sm text-gray-600">Create your account in seconds</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">2</div>
              <h4 className="font-semibold mb-2">Daily Practice</h4>
              <p className="text-sm text-gray-600">Complete 10 phrases per day</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">3</div>
              <h4 className="font-semibold mb-2">Level Up</h4>
              <p className="text-sm text-gray-600">Watch your level increase automatically</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">4</div>
              <h4 className="font-semibold mb-2">Master German</h4>
              <p className="text-sm text-gray-600">Build real conversation skills</p>
            </div>
          </div>
        </section>

        <section className="py-16">
          <h2 className="text-3xl font-bold text-center mb-8">Perfect for Everyone Learning German</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-lg mb-3">Beginners (A1-A2)</h4>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>Start with basic greetings and everyday phrases</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>Learn practical vocabulary for daily integration</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>Build confidence at your own pace</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-3">Advanced Learners (B1-C1)</h4>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>Challenge yourself with complex professional vocabulary</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>Stay sharp with daily practice</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>Master nuanced expressions and idioms</span>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-white py-12 mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="mb-2">© 2025 DailyPhrases. Learn German, Change Your Life.</p>
          <p className="text-gray-400 text-sm">Master German with daily adaptive learning</p>
        </div>
      </footer>
    </div>
  );
}

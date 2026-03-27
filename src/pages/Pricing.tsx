import { Check, BookOpen } from 'lucide-react';
import { useNavigate } from '../hooks/useRouter';

export function Pricing() {
  const navigate = useNavigate();

  const features = [
    'Daily adaptive vocabulary training',
    'Spaced repetition algorithm',
    'Real-time difficulty adjustment',
    'Progress tracking & statistics',
    'Work & daily life vocabulary',
    'Switzerland, Germany, Austria specific phrases',
    'No ads or distractions',
    'Offline mode (coming soon)',
    'Export your progress (coming soon)',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">DailyPhrases</span>
          </div>
          <button
            onClick={() => navigate('dashboard')}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
          >
            Back to Dashboard
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the plan that works for you. Start free, upgrade anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
            <p className="text-gray-600 mb-6">Perfect to start learning</p>
            <div className="mb-8">
              <span className="text-4xl font-bold text-gray-900">CHF 0</span>
              <span className="text-gray-600 ml-2">forever</span>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">5 phrases per day</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Basic progress tracking</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Spaced repetition</span>
              </div>
            </div>

            <button
              onClick={() => navigate('dashboard')}
              className="w-full px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition font-semibold"
            >
              Current Plan
            </button>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg shadow-lg p-8 border-2 border-blue-400 relative">
            <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 px-4 py-1 rounded-full text-sm font-bold">
              RECOMMENDED
            </div>

            <h3 className="text-2xl font-bold text-white mb-2">Premium</h3>
            <p className="text-blue-100 mb-6">Master German faster</p>
            <div className="mb-8">
              <span className="text-4xl font-bold text-white">CHF 3.99</span>
              <span className="text-blue-100 ml-2">/month</span>
            </div>

            <div className="space-y-4 mb-8">
              {features.map((feature, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-yellow-300 flex-shrink-0 mt-0.5" />
                  <span className="text-white">{feature}</span>
                </div>
              ))}
            </div>

            <a
              href="https://buy.stripe.com/test_00g8z5c0Zc6Q9vO9AA"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center px-4 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition font-bold text-lg"
            >
              Upgrade Now
            </a>
          </div>
        </div>

        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-8 text-center max-w-2xl mx-auto">
          <h3 className="text-xl font-bold text-gray-900 mb-3">Questions about Premium?</h3>
          <p className="text-gray-700 mb-4">
            Premium unlocks unlimited daily phrases, advanced analytics, offline mode, and priority support. Start with free forever, upgrade when you're ready!
          </p>
        </div>
      </main>
    </div>
  );
}

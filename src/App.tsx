import { useEffect, useState } from 'react';
import { Landing } from './pages/Landing';
import { Auth } from './pages/Auth';
import { Dashboard } from './pages/Dashboard';
import { Trainer } from './pages/Trainer';
import { Pricing } from './pages/Pricing';
import { supabase, supabaseConfigured } from './supabase';

function App() {
  const [page, setPage] = useState('landing');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) || 'landing';
      setPage(hash);
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    const checkUser = async () => {
      if (!supabaseConfigured) {
        setLoading(false);
        return;
      }

      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        setUser(authUser);

        if (authUser && page === 'landing') {
          window.location.hash = 'dashboard';
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading DailyPhrases...</p>
        </div>
      </div>
    );
  }

  switch (page) {
    case 'signup':
      return <Auth isSignUp={true} />;
    case 'login':
      return <Auth isSignUp={false} />;
    case 'dashboard':
      return user ? <Dashboard /> : <Auth isSignUp={false} />;
    case 'trainer':
      return user ? <Trainer /> : <Auth isSignUp={false} />;
    case 'pricing':
      return user ? <Pricing /> : <Auth isSignUp={false} />;
    default:
      return <Landing />;
  }
}

export default App;

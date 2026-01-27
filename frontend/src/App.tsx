import { useAuth } from './context/AuthContext';
import { useApp } from './context/AppContext';
import Welcome from './components/Welcome';
import Login from './components/Login';
import Register from './components/Register';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import CustomersList from './components/CustomersList';
import CustomerDetail from './components/CustomerDetail';
import AddPurchase from './components/AddPurchase';
import AddPayment from './components/AddPayment';
import Reminders from './components/Reminders';
import Settings from './components/Settings';
import AdminPanel from './components/AdminPanel';
import AdminLogin from './components/AdminLogin';
import Landing from './components/Landing';
import { useEffect } from 'react';

function App() {
  const { currentView, setCurrentView } = useApp();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (window.location.pathname === '/admin') {
      // If already authenticated as admin, go straight to panel
      if (isAuthenticated && ((useAuth as any)().user?.role === 'admin' || (localStorage.getItem('user_role') === 'admin'))) {
        // Note: Assuming we can get user role from context or local storage to be safe for initial load
        // The cleanest way is to let AdminLogin handle the redirect if already logged in, 
        // OR update this logic. Let's update this logic to check context.
        // Since 'user' object might be null initially before checkAuth completes, we rely on checkAuth to set isAuthenticated.
        // But this useEffect runs on mount.
      }
      // Actually, safest to just set it to admin-login, and let AdminLogin redirect if logged in.
      setCurrentView('admin-login');
    }
  }, [setCurrentView]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  const renderView = () => {
    switch (currentView) {
      case 'landing':
        return <Landing />;
      case 'welcome':
        return <Welcome />;
      case 'login':
        return <Login />;
      case 'admin-login':
        return <AdminLogin />;
      case 'register':
        return <Register />;
      case 'dashboard':
        return <Dashboard />;
      case 'customers':
        return <CustomersList />;
      case 'customer-detail':
        return <CustomerDetail />;
      case 'add-purchase':
        return <AddPurchase />;
      case 'add-payment':
        return <AddPayment />;
      case 'reminders':
        return <Reminders />;
      case 'settings':
        return <Settings />;
      case 'admin-panel':
        return <AdminPanel />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {isAuthenticated && currentView !== 'landing' && currentView !== 'welcome' && currentView !== 'login' && currentView !== 'register' && currentView !== 'admin-login' && <Navigation />}
      {renderView()}
    </div>
  );
}

export default App;

import { useApp } from './context/AppContext';
import Welcome from './components/Welcome';
import Login from './components/Login';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import CustomersList from './components/CustomersList';
import CustomerDetail from './components/CustomerDetail';
import AddPurchase from './components/AddPurchase';
import AddPayment from './components/AddPayment';
import Reminders from './components/Reminders';
import Settings from './components/Settings';

function App() {
  const { currentView } = useApp();

  const renderView = () => {
    switch (currentView) {
      case 'welcome':
        return <Welcome />;
      case 'login':
        return <Login />;
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
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {currentView !== 'welcome' && currentView !== 'login' && <Navigation />}
      {renderView()}
    </div>
  );
}

export default App;

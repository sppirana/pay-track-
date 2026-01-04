import { useState, useEffect } from 'react';
import { LayoutDashboard, Users, Bell, Moon, Sun, Clock, LogOut, Settings } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { View } from '../types';

export default function Navigation() {
  const { currentView, setCurrentView, setSelectedCustomerId, theme, toggleTheme, shopSettings } = useApp();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleNavigation = (view: View) => {
    setCurrentView(view);
    if (view !== 'customer-detail') {
      setSelectedCustomerId(null);
    }
  };

  const navItems = [
    { view: 'dashboard' as View, icon: LayoutDashboard, label: 'Dashboard' },
    { view: 'customers' as View, icon: Users, label: 'Customers' },
    { view: 'reminders' as View, icon: Bell, label: 'Reminders' },
  ];

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">{shopSettings.name}</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex space-x-1">
              {navItems.map(({ view, icon: Icon, label }) => (
                <button
                  key={view}
                  onClick={() => handleNavigation(view)}
                  className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${currentView === view
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                    }`}
                >
                  <Icon className="w-4 h-4 md:mr-2" />
                  <span className="hidden md:inline">{label}</span>
                </button>
              ))}
            </div>

            <div className="border-l border-gray-200 dark:border-gray-700 h-6 mx-2" />

            <button
              onClick={() => setCurrentView('settings')}
              className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${currentView === 'settings'
                ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                : 'text-gray-600 dark:text-gray-400'
                }`}
              aria-label="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>

            <div className="hidden md:flex flex-col items-end text-right border-l border-gray-200 dark:border-gray-700 pl-4 ml-2">
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {currentTime.toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                <Clock className="w-3 h-3 mr-1" />
                {currentTime.toLocaleTimeString(undefined, {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                })}
              </div>
            </div>

            <div className="border-l border-gray-200 dark:border-gray-700 h-6 mx-2 hidden md:block" />

            <button
              onClick={() => setCurrentView('welcome')}
              className="p-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              aria-label="Logout"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

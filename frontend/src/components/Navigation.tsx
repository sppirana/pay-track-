import { useState, useEffect } from 'react';
import { LayoutDashboard, Users, Bell, Moon, Sun, LogOut, Settings, UserCircle, Shield, Menu, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { View } from '../types';

export default function Navigation() {
  const { currentView, setCurrentView, setSelectedCustomerId, theme, toggleTheme, shopSettings } = useApp();
  const { user, logout, token } = useAuth();
  const [pendingCount, setPendingCount] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchPendingCount();
    }
  }, [user]);

  const fetchPendingCount = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setPendingCount(data.pending);
      }
    } catch (error) {
      console.error('Failed to fetch pending count:', error);
    }
  };

  const handleNavigation = (view: View) => {
    setCurrentView(view);
    if (view !== 'customer-detail') {
      setSelectedCustomerId(null);
    }
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setCurrentView('welcome');
    setIsMenuOpen(false);
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

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex space-x-1">
              {user?.role !== 'admin' && navItems.map(({ view, icon: Icon, label }) => (
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

              {/* Admin Panel - Only for admins */}
              {user?.role === 'admin' && (
                <button
                  onClick={() => handleNavigation('admin-panel')}
                  className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors relative ${currentView === 'admin-panel'
                    ? 'bg-purple-50 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                    }`}
                >
                  <Shield className="w-4 h-4 md:mr-2" />
                  <span className="hidden md:inline">Admin Panel</span>
                  {pendingCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {pendingCount}
                    </span>
                  )}
                </button>
              )}
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

            <div className="flex items-center border-l border-gray-200 dark:border-gray-700 pl-4 ml-2 space-x-3">
              <div className="flex items-center space-x-2">
                <UserCircle className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</span>
                </div>
              </div>
            </div>

            <div className="border-l border-gray-200 dark:border-gray-700 h-6 mx-2" />

            <button
              onClick={handleLogout}
              className="p-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              aria-label="Logout"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {/* User Info */}
            <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700 mb-2">
              <div className="flex items-center space-x-3">
                <UserCircle className="w-8 h-8 text-gray-600 dark:text-gray-400" />
                <div>
                  <div className="text-base font-medium text-gray-900 dark:text-white">{user?.name}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</div>
                </div>
              </div>
            </div>

            {/* Navigation Links */}
            {user?.role !== 'admin' && navItems.map(({ view, icon: Icon, label }) => (
              <button
                key={view}
                onClick={() => handleNavigation(view)}
                className={`w-full flex items-center px-3 py-2 rounded-lg text-base font-medium ${currentView === view
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                  }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {label}
              </button>
            ))}

            {/* Admin Panel Link */}
            {user?.role === 'admin' && (
              <button
                onClick={() => handleNavigation('admin-panel')}
                className={`w-full flex items-center px-3 py-2 rounded-lg text-base font-medium ${currentView === 'admin-panel'
                  ? 'bg-purple-50 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                  }`}
              >
                <Shield className="w-5 h-5 mr-3" />
                Admin Panel
                {pendingCount > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                    {pendingCount}
                  </span>
                )}
              </button>
            )}

            <button
              onClick={() => {
                setCurrentView('settings');
                setIsMenuOpen(false);
              }}
              className={`w-full flex items-center px-3 py-2 rounded-lg text-base font-medium ${currentView === 'settings'
                ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                }`}
            >
              <Settings className="w-5 h-5 mr-3" />
              Settings
            </button>

            <button
              onClick={handleLogout}
              className="w-full flex items-center px-3 py-2 rounded-lg text-base font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

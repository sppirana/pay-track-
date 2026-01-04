import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Lock, User, ArrowRight, ArrowLeft } from 'lucide-react';
import './Welcome.css'; // Reusing the same styles/backgrounds

export default function Login() {
    const { setCurrentView, adminPassword } = useApp();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (username === 'admin' && password === adminPassword) {
            setCurrentView('dashboard');
        } else {
            setError('Invalid credentials');
        }
    };

    return (
        <div className="welcome-container">
            {/* Reusing Animated Background */}
            <div className="welcome-bg-elements">
                <div className="blob"></div>
                <div className="blob"></div>
                <div className="blob"></div>
            </div>

            <div className="glass-panel animate-fade-in">
                <div className="text-center mb-8">
                    <h2 className="welcome-title" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Welcome Back</h2>
                    <p className="text-gray-600 dark:text-gray-300">Sign in to continue</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm text-center border border-red-200 dark:border-red-900/50">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Username</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-lg glass-input focus:outline-none"
                                placeholder="Enter username"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-lg glass-input focus:outline-none"
                                placeholder="Enter password"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-all hover:scale-[1.02] shadow-lg flex items-center justify-center space-x-2"
                    >
                        <span>Sign In</span>
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <button
                        onClick={() => setCurrentView('welcome')}
                        className="text-sm text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 flex items-center justify-center mx-auto transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        Back to Welcome
                    </button>
                </div>
            </div>
        </div>
    );
}

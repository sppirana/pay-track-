import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { Shield, Lock, Mail, ArrowRight, AlertTriangle } from 'lucide-react';
import './Welcome.css';

export default function AdminLogin() {
    const { login, isAuthenticated, user } = useAuth();
    const { setCurrentView } = useApp();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isAuthenticated && user?.role === 'admin') {
            setCurrentView('admin-panel');
        }
    }, [isAuthenticated, user, setCurrentView]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login({ email, password });
        setLoading(false);

        if (result.success) {
            // Context will handle the redirect, or we can force it here
            // But we should check if the user is actually an admin
            // This will be handled in the component that renders this view or after login
            // For now, let's trust the auth context or check user role
            if (result.role !== 'admin') {
                setError('Access Denied. You do not have administrator privileges.');
                // Optional: logout if strict, but maybe they are a valid user who just tried to access admin
                // logout(); 
                return;
            }
            setCurrentView('admin-panel');
        } else {
            setError(result.error || 'Login failed');
        }
    };

    return (
        <div className="welcome-container">
            <div className="welcome-bg-elements">
                <div className="blob bg-purple-500/30"></div>
                <div className="blob bg-blue-500/30"></div>
            </div>

            <div className="glass-panel animate-fade-in border-purple-500/30">
                <div className="text-center mb-8">
                    <Shield className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                    <h2 className="welcome-title" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Admin Portal</h2>
                    <p className="text-gray-600 dark:text-gray-300">Restricted Access Only</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm text-center border border-red-200 dark:border-red-900/50 flex items-center justify-center">
                            <AlertTriangle className="w-4 h-4 mr-2" />
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Admin Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-lg glass-input focus:outline-none focus:ring-purple-500"
                                placeholder="admin@example.com"
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
                                className="w-full pl-10 pr-4 py-3 rounded-lg glass-input focus:outline-none focus:ring-purple-500"
                                placeholder="Enter admin password"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold transition-all hover:scale-[1.02] shadow-lg flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <span>{loading ? 'Authenticating...' : 'Access Admin Panel'}</span>
                        {!loading && <ArrowRight className="w-5 h-5" />}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        Unauthorized access attempts will be logged.
                    </p>
                </div>
            </div>
        </div>
    );
}

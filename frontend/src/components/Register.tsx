import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { Lock, User, Mail, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import './Welcome.css';

export default function Register() {
    const { register } = useAuth();
    const { setCurrentView } = useApp();
    const [formData, setFormData] = useState({
        name: '',
        shopName: '',
        phoneNumber: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validation
        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        const result = await register({
            name: formData.name,
            shopName: formData.shopName,
            phoneNumber: formData.phoneNumber,
            email: formData.email,
            password: formData.password
        });
        setLoading(false);

        if (result.success) {
            setSuccess(true);
        } else {
            setError(result.error || 'Registration failed');
        }
    };

    if (success) {
        return (
            <div className="welcome-container">
                <div className="welcome-bg-elements">
                    <div className="blob"></div>
                    <div className="blob"></div>
                    <div className="blob"></div>
                </div>

                <div className="glass-panel animate-fade-in">
                    <div className="text-center">
                        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                        <h2 className="welcome-title" style={{ fontSize: '2rem', marginBottom: '1rem' }}>Account Created!</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                            Your account has been created successfully. Please wait for admin approval before logging in.
                        </p>
                        <button
                            onClick={() => setCurrentView('login')}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-all hover:scale-[1.02] shadow-lg flex items-center justify-center space-x-2"
                        >
                            <span>Go to Login</span>
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="welcome-container">
            <div className="welcome-bg-elements">
                <div className="blob"></div>
                <div className="blob"></div>
                <div className="blob"></div>
            </div>

            <div className="glass-panel animate-fade-in">
                <div className="text-center mb-8">
                    <h2 className="welcome-title" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Create Account</h2>
                    <p className="text-gray-600 dark:text-gray-300">Join our credit management system</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm text-center border border-red-200 dark:border-red-900/50">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full pl-10 pr-4 py-3 rounded-lg glass-input focus:outline-none"
                                placeholder="Enter your name"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Shop Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                value={formData.shopName}
                                onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                                className="w-full pl-10 pr-4 py-3 rounded-lg glass-input focus:outline-none"
                                placeholder="Enter your shop name"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Phone Number</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="tel"
                                value={formData.phoneNumber}
                                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                className="w-full pl-10 pr-4 py-3 rounded-lg glass-input focus:outline-none"
                                placeholder="Enter your phone number"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full pl-10 pr-4 py-3 rounded-lg glass-input focus:outline-none"
                                placeholder="Enter your email"
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
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full pl-10 pr-4 py-3 rounded-lg glass-input focus:outline-none"
                                placeholder="At least 8 characters"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Confirm Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="password"
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                className="w-full pl-10 pr-4 py-3 rounded-lg glass-input focus:outline-none"
                                placeholder="Re-enter password"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-all hover:scale-[1.02] shadow-lg flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <span>{loading ? 'Creating Account...' : 'Create Account'}</span>
                        {!loading && <ArrowRight className="w-5 h-5" />}
                    </button>
                </form>

                <div className="mt-8 text-center space-y-3">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Already have an account?{' '}
                        <button
                            onClick={() => setCurrentView('login')}
                            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                        >
                            Login here
                        </button>
                    </p>
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

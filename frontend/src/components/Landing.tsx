import { ArrowRight, ShieldCheck, Zap, BarChart3, Users } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Landing() {
    const { setCurrentView } = useApp();

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col overflow-x-hidden">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <ShieldCheck className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                            PayTrack
                        </span>
                    </div>

                    <button
                        onClick={() => setCurrentView('welcome')}
                        className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/25"
                    >
                        <span>Let's Go</span>
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </header>

            {/* Hero Section */}
            <main className="flex-1 pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative">
                {/* Abstract Background Shapes */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl -z-10 animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDelay: '1s' }} />

                <div className="max-w-5xl mx-auto text-center">
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
                        Manage Shop Credit <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400">
                            With Confidence.
                        </span>
                    </h1>

                    <p className="text-xl text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
                        The ultimate Customer Credit Management System designed for shop owners.
                        Track purchases, log payments, and get smart reminders—all in one place.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
                        <button
                            onClick={() => setCurrentView('welcome')}
                            className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-lg transition-all hover:shadow-2xl hover:shadow-blue-500/40 flex items-center justify-center gap-3 group"
                        >
                            Get Started Now
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button
                            className="w-full sm:w-auto px-8 py-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-2xl font-bold text-lg transition-all"
                        >
                            Learn More
                        </button>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                        <div className="p-8 bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-xl shadow-gray-200/50 dark:shadow-none hover:border-blue-500/50 transition-colors group">
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Instant Tracking</h3>
                            <p className="text-gray-600 dark:text-gray-400">Record every purchase and payment in seconds. Your records are always up to date.</p>
                        </div>

                        <div className="p-8 bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-xl shadow-gray-200/50 dark:shadow-none hover:border-indigo-500/50 transition-colors group">
                            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <BarChart3 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Balance Insights</h3>
                            <p className="text-gray-600 dark:text-gray-400">Get clear visibility on outstanding dues and payment history for every customer.</p>
                        </div>

                        <div className="p-8 bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-xl shadow-gray-200/50 dark:shadow-none hover:border-purple-500/50 transition-colors group">
                            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Customer Focused</h3>
                            <p className="text-gray-600 dark:text-gray-400">Keep contacts and purchase details organized. Build trust with transparent records.</p>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="py-10 border-t border-gray-200 dark:border-gray-800 mt-20">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                        &copy; {new Date().getFullYear()} PayTrack. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}

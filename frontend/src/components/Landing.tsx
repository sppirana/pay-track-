import { ArrowRight, ShieldCheck, Zap, BarChart3, Users } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Landing() {
    const { setCurrentView } = useApp();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-slate-900 dark:to-gray-900 text-gray-900 dark:text-gray-100 flex flex-col overflow-x-hidden">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/70 dark:bg-gray-950/70 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                            <ShieldCheck className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                            PayTrack
                        </span>
                    </div>

                    <button
                        onClick={() => setCurrentView('welcome')}
                        className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full font-semibold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40"
                    >
                        <span>Let's Go</span>
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            </header>

            {/* Hero Section */}
            <main className="flex-1 pt-40 pb-24 px-4 sm:px-6 lg:px-8 relative">
                {/* Abstract Background Elements */}
                <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl -z-10 animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl -z-10" />

                <div className="max-w-6xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100/80 dark:bg-blue-900/30 rounded-full text-sm font-medium text-blue-700 dark:text-blue-300 mb-8 backdrop-blur-sm border border-blue-200 dark:border-blue-800">
                        <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                        Customer Credit Management Made Simple
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-8 leading-tight">
                        Manage Shop Credit <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 inline-block mt-2">
                            With Confidence.
                        </span>
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-14 max-w-3xl mx-auto leading-relaxed font-light">
                        The ultimate Customer Credit Management System designed for shop owners.
                        Track purchases, log payments, and get smart reminders—all in one place.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-32">
                        <button
                            onClick={() => setCurrentView('welcome')}
                            className="w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl font-bold text-lg transition-all hover:shadow-2xl hover:shadow-blue-500/50 flex items-center justify-center gap-3 group hover:scale-105 active:scale-100"
                        >
                            Get Started Now
                            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                        </button>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left max-w-6xl mx-auto">
                        <div className="group relative p-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative">
                                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/30 group-hover:scale-110 group-hover:rotate-3 transition-all">
                                    <Zap className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Instant Tracking</h3>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">Record every purchase and payment in seconds. Your records are always up to date.</p>
                            </div>
                        </div>

                        <div className="group relative p-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative">
                                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/30 group-hover:scale-110 group-hover:rotate-3 transition-all">
                                    <BarChart3 className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Balance Insights</h3>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">Get clear visibility on outstanding dues and payment history for every customer.</p>
                            </div>
                        </div>

                        <div className="group relative p-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative">
                                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-purple-500/30 group-hover:scale-110 group-hover:rotate-3 transition-all">
                                    <Users className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Customer Focused</h3>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">Keep contacts and purchase details organized. Build trust with transparent records.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="py-12 border-t border-gray-200/50 dark:border-gray-800/50 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                        &copy; {new Date().getFullYear()} PayTrack. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}
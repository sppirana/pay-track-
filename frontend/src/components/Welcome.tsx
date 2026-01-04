import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ChevronRight } from 'lucide-react';
import './Welcome.css';

export default function Welcome() {
    const { setCurrentView } = useApp();
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="welcome-container">
            <div className="welcome-bg-elements">
                <div className="blob"></div>
                <div className="blob"></div>
                <div className="blob"></div>
            </div>

            <div className="welcome-content">
                <h1 className="welcome-title">PayTrack</h1>
                <p className="welcome-subtitle">Smart Financial Tracking System</p>

                <div className="clock-section">
                    <div className="digital-clock">
                        {currentTime.toLocaleTimeString(undefined, {
                            hour12: false,
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </div>
                    <div className="date-display">
                        {currentTime.toLocaleDateString(undefined, {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })}
                    </div>
                </div>

                <div className="login-options-grid">
                    <button
                        onClick={() => setCurrentView('login')}
                        className="login-option-card"
                    >
                        <div className="text-xl font-semibold mb-2">Login to Dashboard</div>
                        {/* <div className="flex items-center text-blue-500 font-medium">
                            Get Started <ChevronRight className="w-5 h-5 ml-1" />
                        </div> */}
                    </button>
                </div>
                <div className="mt-12 text-sm text-gray-500 font-medium">
                    Developed by{' '}
                    <a
                        href="https://www.linkedin.com/in/piranavansivanesan"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-600 transition-colors"
                    >
                        Piranav Dev
                    </a>
                </div>
            </div>
        </div>
    );
}

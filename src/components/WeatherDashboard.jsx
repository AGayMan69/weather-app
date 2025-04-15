// src/components/WeatherDashboard.jsx
// (This file should be the same as provided in the previous step,
// accepting weatherData, isLoading, error as props and rendering child components)

import React, { useState, useEffect } from 'react';
import './WeatherDashboard.css'; // Keep component-specific CSS import

// Import the NEW child components
import DashboardHeader from './DashboardHeader';
import CurrentWeatherDetails from './CurrentWeatherDetails';
import DailyForecastDisplay from './DailyForecastDisplay';
import SidebarHeaderDisplay from './SidebarHeaderDisplay';
import SidebarWeatherSummary from './SidebarWeatherSummary';
import AQIDisplay from './AQIDisplay';
import HourlyForecastDisplay from './HourlyForecastDisplay';

// Placeholder Icons (Ensure these have actual SVG content inside)
const PrecipIcon = ({ size = 16 }) => (<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.94 19.06a10 10 0 0 1 0-14.12M19.06 4.94a10 10 0 0 1 0 14.12"/><path d="M12 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"/><path d="M14 16a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"/><path d="M12 10v6"/></svg>);
const UVIcon = ({ size = 16 }) => (<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v1m9.07 3.93l-.7.7M3.63 7.63l-.7-.7M12 21v-1M4.93 16.37l.7-.7m14.14-.7l.7.7M18 12h1M5 12H4M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"/><path d="M12 18a6 6 0 0 0 6-6"/></svg>);
const SunriseIcon = ({ size = 16 }) => (<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v8"/><path d="m4.93 10.93 1.41 1.41"/><path d="M2 18h20"/><path d="M18 22H6"/><path d="M16 18a4 4 0 0 0-8 0"/><path d="m17.66 10.93 1.41-1.41"/></svg>);
const SunsetIcon = ({ size = 16 }) => (<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 10V2"/><path d="m4.93 10.93 1.41 1.41"/><path d="M2 18h20"/><path d="M18 22H6"/><path d="M16 18a4 4 0 0 0-8 0"/><path d="m17.66 10.93 1.41-1.41"/></svg>);
const TempUpIcon = ({ size = 16 }) => (<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 6v12m-4-6h8"/><path d="M17 11l-5-5-5 5"/></svg>);
const TempDownIcon = ({ size = 16 }) => (<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 6v12m-4-6h8"/><path d="M17 15l-5 5-5-5"/></svg>);


// --- Helper Functions (Keep these here or move to utils) ---
const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
};

const getCurrentTime = () => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const getTimeOfDayClass = () => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 18) return 'afternoon';
    return 'night';
};


// --- Main WeatherDashboard Component ---
function WeatherDashboard({ weatherData, isLoading, error, onNavigateToSearch }) {
    const [currentTime, setCurrentTime] = useState(getCurrentTime());
    const [activeNav, setActiveNav] = useState('Dashboard');

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(getCurrentTime());
        }, 60000);
        return () => clearInterval(timer);
    }, []);

    const timeOfDay = getTimeOfDayClass();
    const mainContentClass = `main-content main-content-${timeOfDay}`;
    const sidebarClass = `sidebar sidebar-${timeOfDay}`;

    // --- Conditional Rendering ---
    if (isLoading) {
        return ( <div className="weather-card"><div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%', fontSize: '1.5rem'}}>Loading weather data...</div></div> );
    }
    if (error) {
         return ( <div className="weather-card"><div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%', color: 'red', textAlign: 'center', padding: '20px'}}>Error: {error}</div></div> );
    }
    if (!weatherData) {
         return ( <div className="weather-card"><div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%'}}>No weather data available.</div></div> );
    }

    // --- If Data Exists, Render Dashboard ---
    const { location, date, hourly, daily } = weatherData; // Extract needed props

    return (
        <div className="weather-card">
            {/* --- Main Content Panel --- */}
            <div className={mainContentClass}>
                <div className="internal-navigation">
                    <button className={`nav-button ${activeNav === 'Dashboard' ? 'active' : ''}`} onClick={() => setActiveNav('Dashboard')}> Dashboard </button>
                    <button className={`nav-button`} onClick={onNavigateToSearch}> Search City </button>
                    <button className={`nav-button`} disabled> Hong Kong Regions </button>
                </div>

                <DashboardHeader location={location} date={date} />
                <CurrentWeatherDetails {...weatherData} /> {/* Pass all data down */}
                <DailyForecastDisplay dailyData={daily || []} />

            </div> {/* End main-content */}

            {/* --- Sidebar Panel --- */}
            <div className={sidebarClass}>
                 <SidebarHeaderDisplay greeting={getGreeting()} currentTime={currentTime} />
                 <SidebarWeatherSummary {...weatherData} /> {/* Pass all data down */}
                 <AQIDisplay aqi={weatherData.aqi} aqiStatus={weatherData.aqiStatus} />
                 <HourlyForecastDisplay hourlyData={hourly || []} />

            </div> {/* End sidebar */}
        </div> // End weather-card
    );
}

export default WeatherDashboard;


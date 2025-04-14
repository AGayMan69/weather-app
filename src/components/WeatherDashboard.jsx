// src/components/WeatherDashboard.jsx
import React, { useState, useEffect } from 'react';

// Import the component-specific CSS
import './WeatherDashboard.css';

// Import the shared WeatherIcon component
import WeatherIcon from './WeatherIcon';

// Import specific detail icons (adjust paths if needed)
import WindySvg from '../assets/windy.svg?react';
import HumiditySvg from '../assets/humility.svg?react';

// --- Placeholder SVG Icons (Make sure these have actual SVG content) ---
const PrecipIcon = ({ size = 16 }) => (<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.94 19.06a10 10 0 0 1 0-14.12M19.06 4.94a10 10 0 0 1 0 14.12"/><path d="M12 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"/><path d="M14 16a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"/><path d="M12 10v6"/></svg>);
const UVIcon = ({ size = 16 }) => (<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v1m9.07 3.93l-.7.7M3.63 7.63l-.7-.7M12 21v-1M4.93 16.37l.7-.7m14.14-.7l.7.7M18 12h1M5 12H4M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"/><path d="M12 18a6 6 0 0 0 6-6"/></svg>);
const SunriseIcon = ({ size = 16 }) => (<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v8"/><path d="m4.93 10.93 1.41 1.41"/><path d="M2 18h20"/><path d="M18 22H6"/><path d="M16 18a4 4 0 0 0-8 0"/><path d="m17.66 10.93 1.41-1.41"/></svg>);
const SunsetIcon = ({ size = 16 }) => (<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 10V2"/><path d="m4.93 10.93 1.41 1.41"/><path d="M2 18h20"/><path d="M18 22H6"/><path d="M16 18a4 4 0 0 0-8 0"/><path d="m17.66 10.93 1.41-1.41"/></svg>);
const TempUpIcon = ({ size = 16 }) => (<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 6v12m-4-6h8"/><path d="M17 11l-5-5-5 5"/></svg>);
const TempDownIcon = ({ size = 16 }) => (<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 6v12m-4-6h8"/><path d="M17 15l-5 5-5-5"/></svg>);
// --- End Placeholder Icons ---

const WindIcon = ({ size = 20 }) => <WindySvg width={size} height={size} />;
const HumidityIcon = ({ size = 20 }) => <HumiditySvg width={size} height={size} />;

// --- Mock Data (Keep or replace with actual API fetching logic) ---
const mockWeatherData = {
    location: 'Multan', date: '21.04.2021', temp: 20, condition: 'Cloudy', icon: 'cloudy', wind: 6.1, humidity: 85, precip: 10, uvIndex: 5, uvDesc: 'Moderate', tempMax: 24, tempMin: 18, sunrise: '6:05 AM', sunset: '7:15 PM', feelsLike: 19, aqi: 75, aqiStatus: 'Moderate', hourly: [ { time: '1 PM', temp: 20, icon: 'partly-cloudy-day' }, { time: '2 PM', temp: 21, icon: 'partly-cloudy-day' }, { time: '3 PM', temp: 21, icon: 'partly-cloudy-day' }, { time: '4 PM', temp: 20, icon: 'windy' }, { time: '5 PM', temp: 19, icon: 'cloudy' }, { time: '6 PM', temp: 18, icon: 'rainy' }, ], daily: [ { day: 'Today', temp: 20, icon: 'cloudy', isActive: true }, { day: 'Tue', temp: 32, icon: 'sunny' }, { day: 'Wed', temp: 12, icon: 'rainy' }, { day: 'Thu', temp: 13, icon: 'partly-cloudy-day' }, { day: 'Fri', temp: 22, icon: 'thunderstorm' }, { day: 'Sat', temp: 5, icon: 'snowy' }, ] };

// --- Helper Functions ---
const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
};

const getCurrentTime = () => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// *** THIS FUNCTION IS CRUCIAL FOR GRADIENTS ***
const getTimeOfDayClass = () => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) return 'morning'; // Morning: 6 AM to 11:59 AM
    if (hour >= 12 && hour < 18) return 'afternoon'; // Afternoon: 12 PM to 5:59 PM
    return 'night'; // Night: 6 PM to 5:59 AM
};

const getAqiClass = (aqi) => {
    if (aqi <= 50) return 'aqi-good';
    if (aqi <= 100) return 'aqi-moderate';
    if (aqi <= 150) return 'aqi-unhealthy-sensitive';
    if (aqi <= 200) return 'aqi-unhealthy';
    if (aqi <= 300) return 'aqi-very-unhealthy';
    return 'aqi-hazardous';
};

// --- Component Definition ---
function WeatherDashboard({ onNavigateToSearch }) { // Receive the prop
    const [weatherData, setWeatherData] = useState(mockWeatherData);
    const [currentTime, setCurrentTime] = useState(getCurrentTime());
    const [activeNav, setActiveNav] = useState('Dashboard'); // Internal state for button appearance

    // Effect to update time periodically
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(getCurrentTime());
        }, 60000); // Update every minute
        return () => clearInterval(timer);
    }, []);

    // *** GET THE TIME OF DAY CLASS ***
    const timeOfDay = getTimeOfDayClass();
    // *** CONSTRUCT THE DYNAMIC CLASS NAMES ***
    const mainContentClass = `main-content main-content-${timeOfDay}`;
    const sidebarClass = `sidebar sidebar-${timeOfDay}`;

    // Actual API call would go here, updating weatherData state
    // useEffect(() => {
    //   fetchWeatherData().then(data => setWeatherData(data));
    // }, []);

    if (!weatherData) {
        return <div>Loading weather data...</div>; // Or some loading indicator
    }

    return (
        <div className="weather-card">
            {/* --- Main Content (Left Panel) --- */}
            {/* *** APPLY THE DYNAMIC CLASS HERE *** */}
            <div className={mainContentClass}>
                {/* Internal Navigation */}
                <div className="internal-navigation">
                    <button
                        className={`nav-button ${activeNav === 'Dashboard' ? 'active' : ''}`}
                        onClick={() => setActiveNav('Dashboard')}
                        >
                          Dashboard
                    </button>
                    <button
                        className={`nav-button`} // No active class needed here
                        onClick={onNavigateToSearch} // Call the prop function
                    >
                        Search City
                    </button>
                    <button className={`nav-button ${activeNav === 'Regions' ? 'active' : ''}`} disabled>
                        Hong Kong Regions
                    </button>
                </div>

                {/* Header */}
                <div className="header">
                    <div className="location">{weatherData.location}</div>
                    <div className="date">{weatherData.date}</div>
                </div>

                {/* Current Weather */}
                <div className="current-weather">
                    <div className="temperature-wrapper">
                        <div className="temperature">
                            <span className="temp-value">{weatherData.temp}</span>
                            <span className="temp-degree">°</span>
                        </div>
                        <div className="weather-details-grid">
                            <div className="detail"><WindIcon size={20} /> <span>Wind: {weatherData.wind} mph</span></div>
                            <div className="detail"><HumidityIcon size={20} /> <span>Humidity: {weatherData.humidity}%</span></div>
                            <div className="detail"><PrecipIcon size={16} /> <span>Precip: {weatherData.precip}%</span></div>
                            <div className="detail"><UVIcon size={16} /> <span>UV Index: {weatherData.uvIndex} ({weatherData.uvDesc})</span></div>
                        </div>
                    </div>
                    <div className="current-condition-container">
                        <WeatherIcon type={weatherData.icon} className="current-weather-icon" />
                         <span className="weather-condition">{weatherData.condition}</span>
                         <div className="day-minmax-temp">
                            <span><TempUpIcon size={16} /> {weatherData.tempMax}°</span>
                            <span><TempDownIcon size={16} /> {weatherData.tempMin}°</span>
                         </div>
                    </div>
                    <div className="sunrise-sunset">
                       <div className="detail"><SunriseIcon size={20} /> <span>Sunrise: {weatherData.sunrise}</span></div>
                       <div className="detail"><SunsetIcon size={20} /> <span>Sunset: {weatherData.sunset}</span></div>
                    </div>
                </div>

                {/* Daily Forecast Section (Wrapped in white container) */}
                <div className="forecast-section">
                  <h2 className="forecast-heading">Daily Forecast</h2>
                  <div className="daily-forecast">
                    {weatherData.daily.map((day, index) => (
                      <div key={index} className={`day ${day.isActive ? 'active' : ''}`}>
                        <span className="day-name">{day.day}</span>
                        <WeatherIcon type={day.icon} className="day-condition-icon" />
                        <span className="day-temp">{day.temp}°</span>
                      </div>
                    ))}
                  </div>
                </div>

            </div> {/* End main-content */}

            {/* --- Sidebar (Right Panel) --- */}
            {/* *** APPLY THE DYNAMIC CLASS HERE *** */}
            <div className={sidebarClass}>
                <div className="sidebar-header">
                    <div className="greeting">{getGreeting()}</div>
                    <div className="time">{currentTime}</div>
                </div>

                <div className="sidebar-weather">
                    <WeatherIcon type={weatherData.icon} className="sidebar-condition-icon" />
                    <div className="sidebar-temp">{weatherData.temp}°</div>
                    <div className="sidebar-feels">Feels Like {weatherData.feelsLike}°</div>
                    <div className="sidebar-condition">{weatherData.condition}</div>
                </div>

                {/* Air Quality Section */}
                <div className="aqi-section">
                    <h3 className="aqi-title">Air Quality</h3>
                    <span className={`aqi-value ${getAqiClass(weatherData.aqi)}`}>{weatherData.aqi}</span>
                    <div className="aqi-status">{weatherData.aqiStatus}</div>
                </div>

                {/* Hourly Forecast Section */}
                <div className="hourly-forecast">
                    <h3 className="hourly-title">Hourly Forecast</h3>
                     <div className="hourly-grid">
                        {weatherData.hourly.map((hour, index) => (
                            <div key={index} className="hour-item">
                                <span className="hour-time">{hour.time}</span>
                                <WeatherIcon type={hour.icon} className="hour-condition-icon" />
                                <span className="hour-temp">{hour.temp}°</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div> {/* End sidebar */}
        </div> // End weather-card
    );
}

export default WeatherDashboard;

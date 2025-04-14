import React, { useState } from 'react';
import './App.css';
import WeatherIcon from './components/WeatherIcon'; // Assuming WeatherIcon.jsx is in src/components

// Import specific detail icons (ensure paths are correct)
import WindySvg from './assets/windy.svg?react';
import HumiditySvg from './assets/humility.svg?react'; // Make sure 'humility.svg' exists

// Reusable components for detail icons
const WindIcon = ({ size = 20 }) => <WindySvg width={size} height={size} className="detail-icon" />;
const HumidityIcon = ({ size = 20 }) => <HumiditySvg width={size} height={size} className="detail-icon" />;

// Placeholder forecast data
const dailyForecastData = [
    { day: 'Today', temp: '20°', weatherType: 'cloudy' },
    { day: 'Tue', temp: '32°', weatherType: 'sunny' },
    { day: 'Wed', temp: '12°', weatherType: 'rainy' },
    { day: 'Thu', temp: '13°', weatherType: 'partly-cloudy-day' },
    { day: 'Fri', temp: '22°', weatherType: 'thunderstorm' },
    { day: 'Sat', temp: '5°', weatherType: 'snowy' },
];
const hourlyForecastData = [
    { time: '1 PM', temp: '20°', weatherType: 'cloudy' },
    { time: '2 PM', temp: '21°', weatherType: 'partly-cloudy-day' },
    { time: '3 PM', temp: '21°', weatherType: 'partly-cloudy-day' },
    { time: '4 PM', temp: '20°', weatherType: 'windy' },
    { time: '5 PM', temp: '19°', weatherType: 'cloudy' },
    { time: '6 PM', temp: '18°', weatherType: 'rainy' },
];

function App() {
  // Keep timeOfDay state for background gradients, default to 'morning'
  const [timeOfDay, setTimeOfDay] = useState('morning');
  // State to track the visually active view, defaults to 'dashboard'
  const [activeView, setActiveView] = useState('dashboard');

  const currentCondition = 'Cloudy';
  const currentConditionType = 'cloudy';

  // Greeting function (optional now, could be static or based on actual time)
  const getGreeting = () => {
    // Basic time check can replace the state if you remove background changes later
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Assign dynamic background class (could be simplified if only one time is shown)
  const backgroundClass = `main-content-${timeOfDay}`;
  const sidebarBackgroundClass = `sidebar-${timeOfDay}`;

  return (
    // Main wrapper for centering content on the page
    <div className="weather-app-wrapper">
      {/* Weather App container */}
      <div className="weather-app">
        <div className="weather-card"> {/* Card is ROW layout */}

            {/* --- Left Panel --- */}
            <div className={`main-content ${backgroundClass}`}>

                {/* --- Internal Navigation --- */}
                <div className="internal-navigation">
                    <button
                        className={`nav-button ${activeView === 'dashboard' ? 'active' : ''}`}
                        // onClick={() => setActiveView('dashboard')} // Keep non-functional
                    >
                        Dashboard
                    </button>
                    <button
                        className={`nav-button ${activeView === 'search' ? 'active' : ''}`}
                        // onClick={() => setActiveView('search')} // Keep non-functional
                    >
                        Search City
                    </button>
                    <button
                        className={`nav-button ${activeView === 'hk-weather' ? 'active' : ''}`}
                        // onClick={() => setActiveView('hk-weather')} // Keep non-functional
                    >
                        Hong Kong Regions
                    </button>
                </div>
                {/* --- End Internal Navigation --- */}


                {/* --- Dashboard Content (Always Visible) --- */}
                <>
                    <div className="header">
                        <div className="location">Multan</div>
                        <div className="date">21.04.2021</div>
                    </div>

                    <div className="current-weather">
                        <div className="temperature-wrapper">
                            <div className="temperature">
                                <span className="temp-value">20</span>
                                <span className="temp-degree">°</span>
                            </div>
                            <div className="weather-details">
                                <div className="detail"><WindIcon size={24} /><span>6.1 mph</span></div>
                                <div className="detail"><HumidityIcon size={24} /><span>85%</span></div>
                            </div>
                        </div>
                        <div className="current-condition-container">
                            <WeatherIcon type={currentConditionType} size={50} className="current-weather-icon" />
                            <div className="weather-condition">{currentCondition}</div>
                        </div>
                    </div>

                    <div className="forecast-section">
                        <h3 className="forecast-heading">Daily Forecast</h3>
                        <div className="daily-forecast">
                            {dailyForecastData.map((item, index) => (
                                <div key={index} className={`day ${index === 0 ? 'active' : ''}`}>
                                    <div className="day-name">{item.day}</div>
                                    <WeatherIcon type={item.weatherType} size={38} className="day-condition-icon" />
                                    <div className="day-temp">{item.temp}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
                {/* --- End Dashboard Content --- */}

            </div> {/* End main-content */}


            {/* --- Right Panel (Sidebar) --- */}
            <div className={`sidebar ${sidebarBackgroundClass}`}>
                <div className="sidebar-header">
                    <div className="greeting">{getGreeting()}</div>
                    <div className="time">12:27 PM</div> {/* Static time */}
                </div>
                <div className="sidebar-weather">
                    <WeatherIcon type={currentConditionType} size={36} className="sidebar-condition-icon" />
                    <div className="sidebar-temp">20°</div>
                    <div className="sidebar-feels">Feels Like 19°</div>
                    <div className="sidebar-condition">{currentCondition}</div>
                </div>
                <div className="hourly-forecast">
                    <h3 className="hourly-title">Hourly Forecast</h3>
                    <div className="hourly-grid">
                        {hourlyForecastData.map((item, index) => (
                            <div key={index} className="hour-item">
                                <div className="hour-time">{item.time}</div>
                                <WeatherIcon type={item.weatherType} size={32} className="hour-condition-icon" />
                                <div className="hour-temp">{item.temp}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div> {/* End sidebar */}


        </div> {/* End weather-card */}
      </div> {/* End weather-app */}
    </div> // End wrapper
  );
}

export default App;


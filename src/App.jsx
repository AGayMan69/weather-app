import React, { useState } from 'react';
import './App.css';
import WeatherIcon from './components/WeatherIcon'; // Assuming WeatherIcon.jsx is in src/components

// Import specific detail icons (ensure paths are correct)
import WindySvg from './assets/windy.svg?react';
import HumiditySvg from './assets/humility.svg?react'; // Make sure 'humility.svg' exists

// Placeholder icons (replace with actual SVGs if you have them)
const PrecipIcon = ({ size = 16 }) => <svg viewBox="0 0 24 24" width={size} height={size} stroke="currentColor" strokeWidth="2" fill="none"><path d="M12 15.67l-4.95-4.95a7 7 0 1 1 9.9 0L12 15.67zM12 15.67V22" /></svg>;
const UVIcon = ({ size = 16 }) => <svg viewBox="0 0 24 24" width={size} height={size} stroke="currentColor" strokeWidth="2" fill="none"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>;
const SunriseIcon = ({ size = 16 }) => <svg viewBox="0 0 24 24" width={size} height={size} stroke="currentColor" strokeWidth="2" fill="none"><path d="M17 18a5 5 0 0 0-10 0M12 2v10m-4-3l4 4 4-4m-8 6h16M3 18h1"/></svg>;
const SunsetIcon = ({ size = 16 }) => <svg viewBox="0 0 24 24" width={size} height={size} stroke="currentColor" strokeWidth="2" fill="none"><path d="M17 18a5 5 0 0 0-10 0M12 9V2m-4 7l4-4 4 4m-8 6h16M3 18h1"/></svg>;
const TempUpIcon = ({ size = 16 }) => <svg viewBox="0 0 24 24" width={size} height={size} stroke="currentColor" strokeWidth="2" fill="none"><path d="M12 19V5m-4 4l4-4 4 4"/></svg>;
const TempDownIcon = ({ size = 16 }) => <svg viewBox="0 0 24 24" width={size} height={size} stroke="currentColor" strokeWidth="2" fill="none"><path d="M12 5v14m-4-4l4 4 4-4"/></svg>;

// Reusable components for detail icons
const WindIcon = ({ size = 20 }) => <WindySvg width={size} height={size} className="detail-icon" />;
const HumidityIcon = ({ size = 20 }) => <HumiditySvg width={size} height={size} className="detail-icon" />;

// Placeholder forecast data (use your actual data structure)
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
  // State for time of day (controls gradients)
  const [timeOfDay, setTimeOfDay] = useState('morning');
  // State for active view (controls which content/button is active)
  const [activeView, setActiveView] = useState('dashboard');

  // Placeholder weather data
  const currentCondition = 'Cloudy';
  const currentConditionType = 'cloudy';
  const precipitationChance = "10%";
  const uvIndex = "5";
  const uvIndexCategory = "Moderate";
  const sunriseTime = "6:05 AM";
  const sunsetTime = "7:15 PM";
  const maxTemp = "24°";
  const minTemp = "18°";
  const aqiValue = 75;
  const aqiCategory = "Moderate";

  // Function to determine greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Function to get AQI class based on value
  const getAqiClass = (value) => {
    if (value <= 50) return 'aqi-good';
    if (value <= 100) return 'aqi-moderate';
    if (value <= 150) return 'aqi-unhealthy-sensitive';
    if (value <= 200) return 'aqi-unhealthy';
    if (value <= 300) return 'aqi-very-unhealthy';
    return 'aqi-hazardous';
  };
  const aqiClass = getAqiClass(aqiValue);

  // Determine background classes based on timeOfDay state
  const backgroundClass = `main-content-${timeOfDay}`;
  const sidebarBackgroundClass = `sidebar-${timeOfDay}`;

  return (
    // Main wrapper for page layout
    <div className="weather-app-wrapper">
      {/* Weather App Card */}
      <div className="weather-app">
        <div className="weather-card">

            {/* Left Panel */}
            <div className={`main-content ${backgroundClass}`}>
                {/* Internal Navigation */}
                <div className="internal-navigation">
                    <button className={`nav-button ${activeView === 'dashboard' ? 'active' : ''}`}>Dashboard</button>
                    <button className={`nav-button ${activeView === 'search' ? 'active' : ''}`}>Search City</button>
                    <button className={`nav-button ${activeView === 'hk-weather' ? 'active' : ''}`}>Hong Kong Regions</button>
                </div>

                {/* Dashboard Content (Always Visible in this setup) */}
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
                            {/* Updated Weather Details Grid */}
                            <div className="weather-details-grid">
                                <div className="detail"><WindIcon /><span>Wind: {`6.1 mph`}</span></div>
                                <div className="detail"><HumidityIcon /><span>Humidity: {`85%`}</span></div>
                                <div className="detail"><PrecipIcon /><span>Precip: {precipitationChance}</span></div>
                                <div className="detail"><UVIcon /><span>UV Index: {uvIndex} ({uvIndexCategory})</span></div>
                            </div>
                        </div>
                        <div className="current-condition-container">
                            <WeatherIcon type={currentConditionType} size={40} className="current-weather-icon" />
                            <div className="weather-condition">{currentCondition}</div>
                            {/* Max/Min Temp */}
                            <div className="day-minmax-temp">
                                <span className="temp-max"><TempUpIcon size={14}/> {maxTemp}</span>
                                <span className="temp-min"><TempDownIcon size={14}/> {minTemp}</span>
                            </div>
                        </div>
                         {/* Sunrise/Sunset */}
                         <div className="sunrise-sunset">
                             <div className="detail"><SunriseIcon /><span>Sunrise: {sunriseTime}</span></div>
                             <div className="detail"><SunsetIcon /><span>Sunset: {sunsetTime}</span></div>
                         </div>
                    </div>
                    <div className="forecast-section">
                        <h3 className="forecast-heading">Daily Forecast</h3>
                        <div className="daily-forecast">
                            {dailyForecastData.map((item, index) => (
                                <div key={index} className={`day ${index === 0 ? 'active' : ''}`}>
                                    <div className="day-name">{item.day}</div>
                                    <WeatherIcon type={item.weatherType} size={35} className="day-condition-icon" />
                                    <div className="day-temp">{item.temp}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            </div> {/* End main-content */}

            {/* Right Panel (Sidebar) */}
            <div className={`sidebar ${sidebarBackgroundClass}`}>
                <div className="sidebar-header">
                    <div className="greeting">{getGreeting()}</div>
                    <div className="time">12:27 PM</div>
                </div>
                <div className="sidebar-weather">
                    <WeatherIcon type={currentConditionType} size={30} className="sidebar-condition-icon" />
                    <div className="sidebar-temp">20°</div>
                    <div className="sidebar-feels">Feels Like 19°</div>
                    <div className="sidebar-condition">{currentCondition}</div>
                </div>
                {/* Air Quality Section */}
                 <div className="aqi-section">
                     <h3 className="aqi-title">Air Quality</h3>
                     <div className={`aqi-value ${aqiClass}`}>{aqiValue}</div>
                     <div className="aqi-status">{aqiCategory}</div>
                 </div>
                <div className="hourly-forecast">
                    <h3 className="hourly-title">Hourly Forecast</h3>
                    <div className="hourly-grid">
                        {hourlyForecastData.map((item, index) => (
                            <div key={index} className="hour-item">
                                <div className="hour-time">{item.time}</div>
                                <WeatherIcon type={item.weatherType} size={30} className="hour-condition-icon" />
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

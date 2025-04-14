import React from 'react';
import './App.css';

// Simple SVG icons
const WindIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" stroke="#777" strokeWidth="2" fill="none">
    <path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2" />
    <path d="M9.6 4.6A2 2 0 1 1 11 8H2" />
    <path d="M12.6 19.4A2 2 0 1 0 14 16H2" />
  </svg>
);

const HumidityIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" stroke="#777" strokeWidth="2" fill="none">
    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0L12 2.69z" />
  </svg>
);

function App() {
  return (
    <div className="weather-app">
      <div className="weather-card">
        <div className="main-content">
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
                <div className="detail">
                  <WindIcon />
                  <span>6.1 mph</span>
                </div>
                <div className="detail">
                  <HumidityIcon />
                  <span>85%</span>
                </div>
              </div>
            </div>
            
            <div className="weather-condition">Cloudy</div>
          </div>
          
          <div className="forecast-section">
            <h3 className="forecast-heading">Daily Forecast</h3>
            <div className="daily-forecast">
              <div className="day active">
                <div className="day-name">Today</div>
                <div className="day-temp">20°</div>
                <div className="day-condition">Cloudy</div>
              </div>
              <div className="day">
                <div className="day-name">Tue</div>
                <div className="day-temp">32°</div>
                <div className="day-condition">Sunny</div>
              </div>
              <div className="day">
                <div className="day-name">Wed</div>
                <div className="day-temp">12°</div>
                <div className="day-condition">Rainy</div>
              </div>
              <div className="day">
                <div className="day-name">Thu</div>
                <div className="day-temp">13°</div>
                <div className="day-condition">Cloudy</div>
              </div>
              <div className="day">
                <div className="day-name">Fri</div>
                <div className="day-temp">22°</div>
                <div className="day-condition">Sunny</div>
              </div>
              <div className="day">
                <div className="day-name">Sat</div>
                <div className="day-temp">22°</div>
                <div className="day-condition">Sunny</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="sidebar">
          <div className="sidebar-header">
            <div className="greeting">Good Morning</div>
            <div className="time">12:27 PM</div>
          </div>
          
          <div className="sidebar-weather">
            <div className="sidebar-temp">20°</div>
            <div className="sidebar-feels">Feels Like 19°</div>
            <div className="sidebar-condition">Cloudy</div>
          </div>
          
          <div className="hourly-forecast">
            <h3 className="hourly-title">Hourly Forecast</h3>
            <div className="hourly-grid">
              <div className="hour-item">
                <div className="hour-time">1 PM</div>
                <div className="hour-temp">20°</div>
                <div className="hour-condition">Cloudy</div>
              </div>
              <div className="hour-item">
                <div className="hour-time">2 PM</div>
                <div className="hour-temp">21°</div>
                <div className="hour-condition">Cloudy</div>
              </div>
              <div className="hour-item">
                <div className="hour-time">3 PM</div>
                <div className="hour-temp">21°</div>
                <div className="hour-condition">Cloudy</div>
              </div>
              <div className="hour-item">
                <div className="hour-time">4 PM</div>
                <div className="hour-temp">20°</div>
                <div className="hour-condition">Cloudy</div>
              </div>
              <div className="hour-item">
                <div className="hour-time">5 PM</div>
                <div className="hour-temp">21°</div>
                <div className="hour-condition">Cloudy</div>
              </div>
              <div className="hour-item">
                <div className="hour-time">6 PM</div>
                <div className="hour-temp">21°</div>
                <div className="hour-condition">Cloudy</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

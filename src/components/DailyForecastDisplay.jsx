import React from 'react';
import WeatherIcon from './WeatherIcon';

function DailyForecastDisplay({ dailyData }) {
  return (
    <div className="forecast-section"> 
      <h2 className="forecast-heading">Daily Forecast</h2>
      <div className="daily-forecast">
        {dailyData.map((day, index) => (
          <div key={index} className={`day ${day.isActive ? 'active' : ''}`}>
            <span className="day-name">{day.day}</span>
            <WeatherIcon type={day.icon} className="day-condition-icon" />
            <span className="day-temp">{day.temp}°</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DailyForecastDisplay;

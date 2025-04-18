import React from 'react';
import WeatherIcon from './WeatherIcon';

function HourlyForecastDisplay({ hourlyData }) {
  return (
    <div className="hourly-forecast">
      <h3 className="hourly-title">Hourly Forecast</h3>
      <div className="hourly-grid">
        {hourlyData.map((hour, index) => (
          <div key={index} className="hour-item">
            <span className="hour-time">{hour.time}</span>
            <WeatherIcon type={hour.icon} className="hour-condition-icon" />
            <span className="hour-temp">{hour.temp}°</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HourlyForecastDisplay;

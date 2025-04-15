// src/components/SidebarWeatherSummary.jsx
import React from 'react';
import WeatherIcon from './WeatherIcon';

function SidebarWeatherSummary({ icon, temp, feelsLike, condition }) {
  return (
    <div className="sidebar-weather">
      <WeatherIcon type={icon} className="sidebar-condition-icon" />
      <div className="sidebar-temp">{temp}°</div>
      <div className="sidebar-feels">Feels Like {feelsLike}°</div>
      <div className="sidebar-condition">{condition}</div>
    </div>
  );
}

export default SidebarWeatherSummary;

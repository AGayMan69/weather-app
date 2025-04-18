import React from 'react';
import WeatherIcon from './WeatherIcon'; 

import PrecipIcon from '../assets/precip.svg?react';
import UVIcon from '../assets/uv.svg?react';
import SunriseIcon from '../assets/sunrise.svg?react';
import SunsetIcon from '../assets/sunset.svg?react';
import WindIcon from '../assets/windy.svg?react';
import HumidityIcon from '../assets/humidity.svg?react';
const TempUpIcon = ({ size = 16 }) => (<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 6v12m-4-6h8"/><path d="M17 11l-5-5-5 5"/></svg>);
const TempDownIcon = ({ size = 16 }) => (<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 6v12m-4-6h8"/><path d="M17 15l-5 5-5-5"/></svg>);

function CurrentWeatherDetails({
  temp,
  icon,
  condition,
  wind,
  humidity,
  precip,
  uvIndex,
  uvDesc,
  tempMax,
  tempMin,
  sunrise,
  sunset
}) {
  return (
    <div className="current-weather">
      <div className="temperature-wrapper">
        <div className="temperature">
          <span className="temp-value">{temp}</span>
          <span className="temp-degree">°</span>
        </div>
        <div className="weather-details-grid">
          <div className="detail">
            <WindIcon size={20} /> <span>Wind: {wind} mph</span>
          </div>
          <div className="detail">
            <HumidityIcon size={20} /> <span>Humidity: {humidity}%</span>
          </div>
          <div className="detail">
            <PrecipIcon size={16} /> <span>Precip: {precip}%</span>
          </div>
          <div className="detail">
            <UVIcon size={16} /> <span>UV Index: {uvIndex} ({uvDesc})</span>
          </div>
        </div>
      </div>

      <div className="current-condition-container">
        <WeatherIcon type={icon} className="current-weather-icon" />
        <span className="weather-condition">{condition}</span>
        <div className="day-minmax-temp">
          <span><TempUpIcon size={16} /> {tempMax}°</span>
          <span><TempDownIcon size={16} /> {tempMin}°</span>
        </div>
      </div>

      <div className="sunrise-sunset">
        <div className="detail">
          <SunriseIcon size={20} /> <span>Sunrise: {sunrise}</span>
        </div>
        <div className="detail">
          <SunsetIcon size={20} /> <span>Sunset: {sunset}</span>
        </div>
      </div>
    </div>
  );
}

export default CurrentWeatherDetails;
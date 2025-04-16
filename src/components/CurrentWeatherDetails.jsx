// src/components/CurrentWeatherDetails.jsx
import React from 'react';
import WeatherIcon from './WeatherIcon'; // Shared icon component

// Assume placeholder icons are passed down or defined globally/imported if needed elsewhere
// If they are only used here, they can be defined locally. For simplicity, let's assume they are passed/defined above.
import PrecipIcon from '../assets/precip.svg?react';
import UVIcon from '../assets/uv.svg?react';
import SunriseIcon from '../assets/sunrise.svg?react';
import SunsetIcon from '../assets/sunset.svg?react';
import WindIcon from '../assets/windy.svg?react';
import HumidityIcon from '../assets/humidity.svg?react';
const TempUpIcon = ({ size = 16 }) => (<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 6v12m-4-6h8"/><path d="M17 11l-5-5-5 5"/></svg>);
const TempDownIcon = ({ size = 16 }) => (<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 6v12m-4-6h8"/><path d="M17 15l-5 5-5-5"/></svg>);

/* const PrecipIcon = ({ size = 16 }) => (<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.94 19.06a10 10 0 0 1 0-14.12M19.06 4.94a10 10 0 0 1 0 14.12"/><path d="M12 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"/><path d="M14 16a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"/><path d="M12 10v6"/></svg>);
const UVIcon = ({ size = 16 }) => (<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v1m9.07 3.93l-.7.7M3.63 7.63l-.7-.7M12 21v-1M4.93 16.37l.7-.7m14.14-.7l.7.7M18 12h1M5 12H4M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"/><path d="M12 18a6 6 0 0 0 6-6"/></svg>);
const SunriseIcon = ({ size = 16 }) => (<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v8"/><path d="m4.93 10.93 1.41 1.41"/><path d="M2 18h20"/><path d="M18 22H6"/><path d="M16 18a4 4 0 0 0-8 0"/><path d="m17.66 10.93 1.41-1.41"/></svg>);
const SunsetIcon = ({ size = 16 }) => (<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 10V2"/><path d="m4.93 10.93 1.41 1.41"/><path d="M2 18h20"/><path d="M18 22H6"/><path d="M16 18a4 4 0 0 0-8 0"/><path d="m17.66 10.93 1.41-1.41"/></svg>);
const WindIcon = ({ size = 20 }) => (<svg width={size} height={size} viewBox="0 0 24 24"><path d="M17.7 7.7a7.5 7.5 0 1 0-10.6 10.6"/><path d="M14 14l-4-4m0 4l4-4"/></svg>); // Placeholder
const HumidityIcon = ({ size = 20 }) => (<svg width={size} height={size} viewBox="0 0 24 24"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.32 0L12 2.69z"/><path d="M12 12a3 3 0 0 0 3-3"/></svg>); // Placeholder */


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

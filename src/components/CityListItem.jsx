// src/components/CityListItem.jsx
import React from 'react';

// --- Icons ---
import SunnyIcon from '../assets/sunny.svg?react';
import CloudyIcon from '../assets/cloudy.svg?react';
import RainyIcon from '../assets/rainy.svg?react';
import PartlyCloudyDayIcon from '../assets/partly-cloudy-day.svg?react';
import SnowyIcon from '../assets/snowy.svg?react';
import ThunderstormIcon from '../assets/thunderstorm.svg?react';
import ClearNightIcon from '../assets/clear-night.svg?react';
import PartlyCloudyNightIcon from '../assets/partly-cloudy-night.svg?react';

const weatherIconMap = {
    'sunny': SunnyIcon, 'clear': SunnyIcon, 'cloudy': CloudyIcon,
    'partly cloudy': PartlyCloudyDayIcon, 'rain': RainyIcon, 'showers': RainyIcon,
    'snow': SnowyIcon, 'thunderstorm': ThunderstormIcon,
    'clear-night': ClearNightIcon || CloudyIcon,
    'rainy': RainyIcon, 'snowy': SnowyIcon,
    'partly-cloudy-day': PartlyCloudyDayIcon,
    'partly-cloudy-night': PartlyCloudyNightIcon || CloudyIcon,
    'windy': CloudyIcon, 'default': CloudyIcon
};

const WeatherIconDisplay = ({ condition, size = 38 }) => {
  const iconKey = typeof condition === 'string' ? condition.toLowerCase() : 'default';
  const IconComponent = weatherIconMap[iconKey] || weatherIconMap['default'];
  return IconComponent ? <IconComponent width={size} height={size} className="weather-svg-icon" /> : null;
};

const ArrowRightIcon = () => <span className="icon arrow-icon-svg">→</span>;

// --- Component ---
function CityListItem({ city, onCitySelect }) {
  if (!city) return null;

  const handleSelect = () => onCitySelect(city);
  const handleKeyPress = (e) => { if (e.key === 'Enter' || e.key === ' ') handleSelect(); };

  const locationString = city.region
    ? `${city.region}, ${city.country || ''}`.replace(/, $/, '')
    : city.country || 'N/A';

  // Use the temp passed in (could be formatted string or placeholder)
  const displayTemp = city.temp || '--°C';

  return (
    <li
      className="city-list-item card"
      onClick={handleSelect}
      onKeyPress={handleKeyPress}
      tabIndex={0} role="button" aria-label={`Select ${city.name}, ${locationString}`}
    >
      <div className="city-details">
        <span className="city-name">{city.name || 'N/A'}</span>
        <span className="city-location">{locationString}</span>
      </div>
      <div className="weather-info">
        {/* Use weatherCondition key passed in */}
        <WeatherIconDisplay condition={city.weatherCondition || 'default'} size={38}/>
        <span className="weather-temp">{displayTemp}</span>
      </div>
      <button
        className="select-button" aria-label={`Select ${city.name}`}
        onClick={(e) => { e.stopPropagation(); handleSelect(); }}
      >
        <ArrowRightIcon />
      </button>
    </li>
  );
}

export default CityListItem;

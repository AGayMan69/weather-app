// src/components/CityListItem.jsx
import React from 'react';

// --- Icons ---
// (Moved definitions here for completeness of this file)
import SunnyIcon from '../assets/sunny.svg?react';
import CloudyIcon from '../assets/cloudy.svg?react';
import RainyIcon from '../assets/rainy.svg?react';
import PartlyCloudyDayIcon from '../assets/partly-cloudy-day.svg?react';
import SnowyIcon from '../assets/snowy.svg?react';
import ThunderstormIcon from '../assets/thunderstorm.svg?react';
// Assuming default icons for night variants or missing mappings
import ClearNightIcon from '../assets/clear-night.svg?react'; // Add if you have this
import PartlyCloudyNightIcon from '../assets/partly-cloudy-night.svg?react'; // Add if you have this

// Updated Icon Mapping (include night variants if available)
const weatherIconMap = {
  'Sunny': SunnyIcon,
  'Clear': SunnyIcon, // Often used interchangeably for day
  'Cloudy': CloudyIcon,
  'Partly Cloudy': PartlyCloudyDayIcon, // Assume day for this key
  'Rain': RainyIcon,
  'Showers': RainyIcon,
  'Snow': SnowyIcon,
  'Thunderstorm': ThunderstormIcon,
  // Add keys based on your getIconConditionKey function output
  'sunny': SunnyIcon,
  'clear-night': ClearNightIcon || CloudyIcon, // Fallback if no night icon
  'rainy': RainyIcon,
  'snowy': SnowyIcon,
  'partly-cloudy-day': PartlyCloudyDayIcon,
  'partly-cloudy-night': PartlyCloudyNightIcon || CloudyIcon, // Fallback
  'thunderstorm': ThunderstormIcon,
  'windy': CloudyIcon, // Example fallback for windy
  'default': CloudyIcon // Default fallback
};

const WeatherIconDisplay = ({ condition, size = 38 }) => {
  const iconKey = condition?.toLowerCase() || 'default'; // Ensure lowercase key matching map
  const IconComponent = weatherIconMap[iconKey] || weatherIconMap['default'];
  return IconComponent ? <IconComponent width={size} height={size} className="weather-svg-icon" /> : null;
};

// Placeholder Arrow Icon
const ArrowRightIcon = () => <span className="icon arrow-icon-svg">→</span>;


// --- Component ---
function CityListItem({ city, onCitySelect }) {
  // Defensive check
  if (!city) {
    return null;
  }

  const handleSelect = () => {
    onCitySelect(city);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleSelect();
    }
  };

  // --- MODIFIED Location String Logic ---
  const locationString = city.region
    ? `${city.region}, ${city.country || ''}`.replace(/, $/, '') // Show Region, Country (remove trailing comma if country missing)
    : city.country || 'N/A'; // Otherwise, just show Country or N/A


  return (
    <li
      className="city-list-item card"
      onClick={handleSelect}
      onKeyPress={handleKeyPress}
      tabIndex={0} // Make it focusable
      role="button" // Indicate it's interactive
      aria-label={`Select ${city.name}, ${locationString}`} // Use combined location string for label
    >
      {/* City Details Section */}
      <div className="city-details">
        <span className="city-name">{city.name || 'N/A'}</span>
        {/* Use the generated locationString */}
        <span className="city-location">{locationString}</span>
      </div>

      {/* Weather Info (Placeholders from Search) */}
      <div className="weather-info">
        {/* Pass the placeholder condition */}
        <WeatherIconDisplay condition={city.weatherCondition || 'default'} size={38}/>
        <span className="weather-temp">{city.temp || '--°C'}</span>
      </div>

      {/* Selection Button */}
      <button
        className="select-button"
        aria-label={`Select ${city.name}`} // Simpler label is fine here too
        onClick={(e) => { e.stopPropagation(); handleSelect(); }} // Prevent li click from double-triggering
      >
        <ArrowRightIcon />
      </button>
    </li>
  );
}

export default CityListItem;

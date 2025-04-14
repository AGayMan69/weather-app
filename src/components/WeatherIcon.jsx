// src/components/WeatherIcon.jsx
import React from 'react';

// --- Corrected Imports ---
import SunnyIcon from '../assets/sunny.svg?react';
import ClearNightIcon from '../assets/clear-night.svg?react';
// Assuming you have a generic 'cloudy.svg' based on previous context
import CloudyIcon from '../assets/cloudy.svg?react';
import PartlyCloudyDayIcon from '../assets/partly-cloudy-day.svg?react';
import PartlyCloudyNightIcon from '../assets/partly-cloudy-night.svg?react';
import RainyIcon from '../assets/rainy.svg?react';
import SnowyIcon from '../assets/snowy.svg?react';
import ThunderstormIcon from '../assets/thunderstorm.svg?react';
import WindyIcon from '../assets/windy.svg?react';
// import UnknownIcon from '../assets/unknown.svg?react'; // If you have a fallback icon

// Map weather condition strings to the imported components
const iconMap = {
  sunny: SunnyIcon,
  'clear-day': SunnyIcon,
  'clear-night': ClearNightIcon,
  cloudy: CloudyIcon,
  'partly-cloudy-day': PartlyCloudyDayIcon,
  'partly-cloudy-night': PartlyCloudyNightIcon,
  rainy: RainyIcon,
  showers: RainyIcon,
  snowy: SnowyIcon,
  snow: SnowyIcon,
  thunderstorm: ThunderstormIcon,
  storm: ThunderstormIcon,
  windy: WindyIcon,
  wind: WindyIcon,
};

const WeatherIcon = ({ type, className = '', size }) => {
  const IconComponent = iconMap[type?.toLowerCase()];

  if (!IconComponent) {
    // --- Corrected Fallback ---
    return <span className={className} style={size ? { fontSize: size / 2 } : {}}>?</span>; // Simple text fallback
    // Or use a default icon:
    // return <UnknownIcon className={`weather-svg ${className}`} width={size} height={size} />;
  }

  // --- Corrected Props Application ---
  const props = {
    className: `weather-svg ${className}`,
    // Apply size directly if provided
    ...(size && { width: size, height: size }),
  };

  return <IconComponent {...props} />;
};

export default WeatherIcon;

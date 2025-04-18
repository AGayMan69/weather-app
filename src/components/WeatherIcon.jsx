import React from "react";

import SunnyIcon from "../assets/sunny.svg?react";
import ClearNightIcon from "../assets/clear-night.svg?react";
import CloudyIcon from "../assets/cloudy.svg?react";
import PartlyCloudyDayIcon from "../assets/partly-cloudy-day.svg?react";
import PartlyCloudyNightIcon from "../assets/partly-cloudy-night.svg?react";
import RainyIcon from "../assets/rainy.svg?react";
import SnowyIcon from "../assets/snowy.svg?react";
import ThunderstormIcon from "../assets/thunderstorm.svg?react";
import WindyIcon from "../assets/windy.svg?react";
const iconMap = {
  sunny: SunnyIcon,
  "clear-day": SunnyIcon,
  "clear-night": ClearNightIcon,
  cloudy: CloudyIcon,
  "partly-cloudy-day": PartlyCloudyDayIcon,
  "partly-cloudy-night": PartlyCloudyNightIcon,
  rainy: RainyIcon,
  showers: RainyIcon,
  snowy: SnowyIcon,
  snow: SnowyIcon,
  thunderstorm: ThunderstormIcon,
  storm: ThunderstormIcon,
  windy: WindyIcon,
  wind: WindyIcon,
};

const WeatherIcon = ({ type, className = "", size }) => {
  const IconComponent = iconMap[type?.toLowerCase()];

  if (!IconComponent) {
    return (
      <span className={className} style={size ? { fontSize: size / 2 } : {}}>
        ?
      </span>
    );
  }

  const props = {
    className: `weather-svg ${className}`,
    ...(size && { width: size, height: size }),
  };

  return <IconComponent {...props} />;
};

export default WeatherIcon;

import React from "react";

const getAqiClass = (aqi) => {
  if (aqi <= 50) return "aqi-good";
  if (aqi <= 100) return "aqi-moderate";
  if (aqi <= 150) return "aqi-unhealthy-sensitive";
  if (aqi <= 200) return "aqi-unhealthy";
  if (aqi <= 300) return "aqi-very-unhealthy";
  return "aqi-hazardous";
};

function AQIDisplay({ aqi, aqiStatus }) {
  return (
    <div className="aqi-section">
      <h3 className="aqi-title">Air Quality</h3>
      <span className={`aqi-value ${getAqiClass(aqi)}`}>{aqi}</span>
      <div className="aqi-status">{aqiStatus}</div>
    </div>
  );
}

export default AQIDisplay;

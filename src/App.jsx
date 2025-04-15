// src/App.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Using axios for fetching

// Import Components
import WeatherDashboard from './components/WeatherDashboard';
import CitySearch from './components/CitySearch';

// Get API Base URL from environment variables
// Make sure you have VITE_API_BASE_URL defined in your .env file
// pointing to your function URL (e.g., https://<region>-<project-id>.cloudfunctions.net/app)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Default Location (London coordinates) - Used as fallback
const DEFAULT_LOCATION = {
    lat: 51.5074,
    lon: -0.1278, // Corrected London longitude
    name: "London", // Provide a name for the default
};

// --- Helper Function: Map OWM condition codes/main to your icon keys ---
// (This assumes your WeatherIcon component uses keys like 'sunny', 'rainy', etc.)
const getIconConditionKey = (weather) => {
    if (!weather || !weather[0]) return 'default'; // Fallback icon key
    const main = weather[0].main.toLowerCase();
    const iconCode = weather[0].icon; // e.g., "01d", "10n"

    switch (main) {
        case 'thunderstorm': return 'thunderstorm';
        case 'drizzle':
        case 'rain': return 'rainy';
        case 'snow': return 'snowy';
        case 'clear':
            return iconCode.includes('n') ? 'clear-night' : 'sunny'; // Distinguish day/night
        case 'clouds':
            if (iconCode === '02d') return 'partly-cloudy-day';
            if (iconCode === '02n') return 'partly-cloudy-night';
            if (iconCode === '03d' || iconCode === '03n') return 'cloudy'; // Scattered clouds
            if (iconCode === '04d' || iconCode === '04n') return 'cloudy'; // Broken clouds / Overcast
            return 'cloudy'; // Default for clouds
        // Map atmosphere types
        case 'mist':
        case 'smoke':
        case 'haze':
        case 'dust':
        case 'fog':
        case 'sand':
        case 'ash':
             return 'cloudy'; // Represent most atmosphere as cloudy/foggy
        case 'squall':
        case 'tornado':
             return 'windy';
        default: return 'default'; // Use default for unknown
    }
};

// --- Helper Function: Get AQI Description ---
const getAqiDescription = (aqiValue) => {
    if (aqiValue === undefined || aqiValue === null || isNaN(aqiValue)) return '';
    switch (aqiValue) {
        case 1: return 'Good';
        case 2: return 'Fair';
        case 3: return 'Moderate';
        case 4: return 'Poor';
        case 5: return 'Very Poor';
        default: return '';
    }
};

// --- Helper Function: Get UV Description ---
const getUvDescription = (uvi) => {
    if (uvi === undefined || uvi === null || isNaN(uvi)) return '';
    const uviRounded = Math.round(uvi);
    if (uviRounded <= 2) return 'Low';
    if (uviRounded <= 5) return 'Moderate';
    if (uviRounded <= 7) return 'High';
    if (uviRounded <= 10) return 'Very High';
    return 'Extreme'; // For values 11+
};


// --- Helper Function: Transform Combined API Data ---
function transformOpenWeatherData(apiData, locationName = 'Selected Location') {
  console.log("--- START Transformation ---");
  console.log("Raw apiData received:", JSON.stringify(apiData, null, 2)); // Log the full structure

  // --- Check for ESSENTIAL data ---
  if (!apiData || !apiData.current || !apiData.forecast || !apiData.forecast.list) {
     console.error("Combined API data is missing essential weather/forecast fields");
     console.log("--- END Transformation (Error) ---");
     return null; // Cannot proceed without current/forecast
  } // <<< Missing brace added

  // --- Extract data, handling potentially missing optional parts ---
  const { current, forecast, aqiData, uvData } = apiData;
  // Use timezone offset FROM CURRENT WEATHER DATA (more reliable)
  const timezoneOffsetSeconds = current.timezone;

  // Helper to format Date objects correctly based on UTC + offset
  const getLocalDate = (unixTimestamp) => {
    // Convert UTC timestamp to milliseconds and apply offset
    return new Date((unixTimestamp + timezoneOffsetSeconds) * 1000);
  };

  // Formatting helpers using the local date
  const formatDate = (dateObj) => dateObj.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }); // DD.MM.YYYY
  const formatTime = (dateObj) => dateObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }); // hh:mm AM/PM
  const formatDay = (dateObj, index) => {
    if (index === 0) return 'Today';
    return dateObj.toLocaleDateString('en-US', { weekday: 'short' }); // Mon, Tue, etc.
  };
  const formatHour = (dateObj) => dateObj.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }).replace(' ', ''); // 1PM, 2AM, etc.

  // --- Extract Current Data ---
  const currentDate = getLocalDate(current.dt);
  const currentTemp = Math.round(current.main.temp);
  const currentCondition = current.weather[0]?.main || 'N/A';
  const currentIconKey = getIconConditionKey(current.weather);
  const feelsLikeTemp = Math.round(current.main.feels_like);
  const windSpeed = current.wind.speed; // m/s
  const humidityValue = current.main.humidity;
  const sunriseDate = getLocalDate(current.sys.sunrise);
  const sunsetDate = getLocalDate(current.sys.sunset);
  const todayTempMax = Math.round(current.main.temp_max);
  const todayTempMin = Math.round(current.main.temp_min);

  // --- Extract UV Data ---
  const currentUvi = uvData?.result?.uv;
  console.log("Extracted Raw UV:", currentUvi);
  const uvIndexDisplay = currentUvi !== undefined && currentUvi !== null ? Math.round(currentUvi) : 'N/A';
  const uvDescDisplay = getUvDescription(currentUvi);

  // --- Extract AQI Data ---
  const currentAqiValue = aqiData?.list?.[0]?.main?.aqi;
  console.log("Extracted Raw AQI Value:", currentAqiValue);
  const aqiDisplay = currentAqiValue !== undefined && currentAqiValue !== null ? currentAqiValue : 'N/A';
  const aqiStatusDisplay = getAqiDescription(currentAqiValue);

  // --- Process Forecast Data ---
  const hourly = [];
  const dailyAggData = {};
  const nowTimestamp = Date.now();

  forecast.list.forEach(item => {
      const itemDate = getLocalDate(item.dt);
      const itemTimestamp = item.dt * 1000;

      if (itemTimestamp > nowTimestamp && hourly.length < 6) {
          hourly.push({
              time: formatHour(itemDate),
              temp: Math.round(item.main.temp),
              icon: getIconConditionKey(item.weather),
          });
      } // <<< Missing brace added

      const dateKey = itemDate.toISOString().split('T')[0];
      if (!dailyAggData[dateKey]) {
          dailyAggData[dateKey] = { temps: [], pop: 0, weather: [], dt: item.dt };
      } // <<< Missing brace added
      dailyAggData[dateKey].temps.push(item.main.temp);
      dailyAggData[dateKey].weather.push(item.weather[0]);
      if (item.pop > dailyAggData[dateKey].pop) {
          dailyAggData[dateKey].pop = item.pop;
      } // <<< Missing brace added
  }); // <<< Missing brace added for forEach

  const daily = Object.keys(dailyAggData)
      .sort()
      .slice(0, 6)
      .map((dateKey, index) => {
          const dayData = dailyAggData[dateKey];
          const dayDate = getLocalDate(dayData.dt);
          const dayMinTemp = Math.round(Math.min(...dayData.temps));
          const dayMaxTemp = Math.round(Math.max(...dayData.temps));
          let dominantIcon = 'default';
          const conditions = dayData.weather.map(w => getIconConditionKey([w]));
          if (conditions.includes('thunderstorm')) dominantIcon = 'thunderstorm';
          else if (conditions.includes('snowy')) dominantIcon = 'snowy';
          else if (conditions.includes('rainy')) dominantIcon = 'rainy';
          else if (conditions.includes('cloudy')) dominantIcon = 'cloudy';
          else if (conditions.includes('partly-cloudy-day')) dominantIcon = 'partly-cloudy-day';
          else if (conditions.includes('partly-cloudy-night')) dominantIcon = 'partly-cloudy-night';
          else if (conditions.includes('sunny')) dominantIcon = 'sunny';
          else if (conditions.includes('clear-night')) dominantIcon = 'clear-night';

          return {
              day: formatDay(dayDate, index),
              temp: dayMaxTemp,
              icon: dominantIcon,
              isActive: index === 0,
              tempMin: dayMinTemp,
              tempMax: dayMaxTemp,
          };
      });

  const finalTempMax = daily.length > 0 ? (daily[0].tempMax ?? todayTempMax) : todayTempMax;
  const finalTempMin = daily.length > 0 ? (daily[0].tempMin ?? todayTempMin) : todayTempMin;

  // --- Combine and Return Final Structure ---
  const result = {
     location: current.name || locationName,
     date: formatDate(currentDate),
     temp: currentTemp,
     condition: currentCondition,
     icon: currentIconKey,
     wind: windSpeed,
     humidity: humidityValue,
     precip: Math.round((dailyAggData[Object.keys(dailyAggData)[0]]?.pop || 0) * 100),
     uvIndex: uvIndexDisplay,
     uvDesc: uvDescDisplay,
     tempMax: finalTempMax,
     tempMin: finalTempMin,
     sunrise: formatTime(sunriseDate),
     sunset: formatTime(sunsetDate),
     feelsLike: feelsLikeTemp,
     aqi: aqiDisplay,
     aqiStatus: aqiStatusDisplay,
     hourly: hourly,
     daily: daily,
  };

  console.log("Final processed UV Index:", result.uvIndex);
  console.log("Final processed AQI:", result.aqi);
  console.log("--- END Transformation (Success) ---");
  return result;
} // <<< Missing brace added for function transformOpenWeatherData


// --- Main App Component ---
function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- EFFECT: Get User Location on Mount ---
  useEffect(() => {
    console.log("Attempting geolocation...");
    if (!navigator.geolocation) {
      console.log("Geolocation not supported. Using default.");
      setSelectedLocation(DEFAULT_LOCATION);
      return;
    } // <<< Missing brace added

    const handleGeoSuccess = (position) => {
      console.log("Geolocation successful:", position.coords);
      setSelectedLocation({
        lat: position.coords.latitude,
        lon: position.coords.longitude,
        name: "Your Location",
      });
    };

    const handleGeoError = (geoError) => {
      console.warn(`Geolocation Error (${geoError.code}): ${geoError.message}. Using default location.`);
      setSelectedLocation(DEFAULT_LOCATION);
    };

    navigator.geolocation.getCurrentPosition(handleGeoSuccess, handleGeoError, {
      enableHighAccuracy: false, timeout: 10000, maximumAge: 600000
    });
  }, []);


  // --- EFFECT: Fetch Weather Data When Location is Ready ---
  useEffect(() => {
    if (!selectedLocation?.lat || !selectedLocation?.lon || !API_BASE_URL) {
      if (isLoading && selectedLocation === null) {
          console.log("Waiting for geolocation or default...");
          return;
      } // <<< Missing brace added
      console.log("Skipping fetch: Invalid location or API URL.");
      setIsLoading(false);
      setError(prevError => prevError || "Could not determine location.");
      setWeatherData(null);
      return;
    } // <<< Missing brace added

    const fetchWeather = async () => {
      if (!isLoading) setIsLoading(true);
      setError(null);
      console.log(`Fetching weather for: ${selectedLocation.name || 'coordinates'} (Lat=${selectedLocation.lat}, Lon=${selectedLocation.lon})`);

      try {
        const weatherUrl = `${API_BASE_URL}/weather?lat=${selectedLocation.lat}&lon=${selectedLocation.lon}`;
        const response = await axios.get(weatherUrl);
        console.log("Raw API Response from Function:", response.data);
        const transformedData = transformOpenWeatherData(response.data, selectedLocation.name);

        if (transformedData) {
            setWeatherData(transformedData);
        } else {
             throw new Error("Failed to transform weather data.");
        } // <<< Missing brace added
      } catch (err) {
        console.error("Failed to fetch or process weather data:", err);
        let message = "Could not load weather data. Please try again later.";
        if (err.response?.data?.message || typeof err.response?.data === 'string') {
            message = `Error: ${err.response.data.message || err.response.data}`;
        } else if (err.message) {
            message = err.message;
        } // <<< Missing brace added
        setError(message);
        setWeatherData(null);
      } finally {
        setIsLoading(false);
      } // <<< Missing brace added
    }; // <<< Missing brace added for async function fetchWeather

    fetchWeather();

  }, [selectedLocation]);


  // --- Handlers ---
  const handleCitySelection = (city) => {
    console.log("City selected in App:", city);
    setSelectedLocation(city);
    setActiveView('dashboard');
  };
  const navigateToSearch = () => setActiveView('search');
  const navigateToDashboard = () => setActiveView('dashboard');

  // --- Render Logic ---
  return ( // <<< Missing parenthesis added
    <div className="weather-app-wrapper">
      <div className="weather-app">
        {activeView === 'dashboard' && (
          <WeatherDashboard
            weatherData={weatherData}
            isLoading={isLoading}
            error={error}
            onNavigateToSearch={navigateToSearch}
          />
        )}
        {activeView === 'search' && (
          <CitySearch
            onCitySelect={handleCitySelection}
            onNavigateToDashboard={navigateToDashboard}
            apiBaseUrl={API_BASE_URL}
          />
        )}
      </div>
    </div>
  ); // <<< Missing parenthesis added
} // <<< Missing brace added for App component


export default App;

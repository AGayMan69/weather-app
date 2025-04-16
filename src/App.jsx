// src/App.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

// Import Component
import WeatherDashboard from "./components/WeatherDashboard";

// Get API Base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Default Location (London coordinates) - Used as fallback
const DEFAULT_LOCATION = {
  lat: 51.5074,
  lon: -0.1278,
  name: "London",
};

// --- Helper Function: Map OWM condition codes/main to icon keys ---
const getIconConditionKey = (weather) => {
  if (!weather || !weather[0]) return "default";
  const main = weather[0].main.toLowerCase();
  const iconCode = weather[0].icon;
  switch (main) {
    case "thunderstorm":
      return "thunderstorm";
    case "drizzle":
    case "rain":
      return "rainy";
    case "snow":
      return "snowy";
    case "clear":
      return iconCode.includes("n") ? "clear-night" : "sunny";
    case "clouds":
      if (iconCode === "02d") return "partly-cloudy-day";
      if (iconCode === "02n") return "partly-cloudy-night";
      if (iconCode === "03d" || iconCode === "03n") return "cloudy";
      if (iconCode === "04d" || iconCode === "04n") return "cloudy";
      return "cloudy";
    case "mist":
    case "smoke":
    case "haze":
    case "dust":
    case "fog":
    case "sand":
    case "ash":
      return "cloudy";
    case "squall":
    case "tornado":
      return "windy";
    default:
      return "default";
  }
};

// --- Helper Function: Get AQI Description ---
const getAqiDescription = (aqiValue) => {
  if (aqiValue === undefined || aqiValue === null || isNaN(aqiValue)) return "";
  switch (aqiValue) {
    case 1:
      return "Good";
    case 2:
      return "Fair";
    case 3:
      return "Moderate";
    case 4:
      return "Poor";
    case 5:
      return "Very Poor";
    default:
      return "";
  }
};

// --- Helper Function: Get UV Description ---
const getUvDescription = (uvi) => {
  if (uvi === undefined || uvi === null || isNaN(uvi)) return "";
  const uviRounded = Math.round(uvi);
  if (uviRounded <= 2) return "Low";
  if (uviRounded <= 5) return "Moderate";
  if (uviRounded <= 7) return "High";
  if (uviRounded <= 10) return "Very High";
  return "Extreme";
};

// --- Helper Function: Transform Combined API Data ---
function transformOpenWeatherData(apiData, locationName = "Selected Location") {
  console.log("--- START Transformation ---");
  // console.log("Raw apiData received:", JSON.stringify(apiData, null, 2)); // Keep for debugging if needed

  if (
    !apiData ||
    !apiData.current ||
    !apiData.forecast ||
    !apiData.forecast.list
  ) {
    console.error("Combined API data missing essential fields");
    console.log("--- END Transformation (Error) ---");
    return null;
  }

  const { current, forecast, aqiData, uvData, imageUrl } = apiData; // Include imageUrl
  const timezoneOffsetSeconds = current.timezone;

  const getLocalDate = (unixTimestamp) =>
    new Date((unixTimestamp + timezoneOffsetSeconds) * 1000);
  const formatDate = (d) =>
    d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  const formatTime = (d) =>
    d.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  const formatDay = (d, i) =>
    i === 0 ? "Today" : d.toLocaleDateString("en-US", { weekday: "short" });
  const formatHour = (d) =>
    d
      .toLocaleTimeString("en-US", { hour: "numeric", hour12: true })
      .replace(" ", "");

  const currentDate = getLocalDate(current.dt);
  const currentTemp = Math.round(current.main.temp);
  const currentCondition = current.weather[0]?.main || "N/A";
  const currentIconKey = getIconConditionKey(current.weather);
  const feelsLikeTemp = Math.round(current.main.feels_like);
  const windSpeed = current.wind.speed;
  const humidityValue = current.main.humidity;
  const sunriseDate = getLocalDate(current.sys.sunrise);
  const sunsetDate = getLocalDate(current.sys.sunset);
  const todayTempMax = Math.round(current.main.temp_max);
  const todayTempMin = Math.round(current.main.temp_min);
  const currentUvi = uvData?.result?.uv;
  const uvIndexDisplay =
    currentUvi !== undefined && currentUvi !== null
      ? Math.round(currentUvi)
      : "N/A";
  const uvDescDisplay = getUvDescription(currentUvi);
  const currentAqiValue = aqiData?.list?.[0]?.main?.aqi;
  const aqiDisplay =
    currentAqiValue !== undefined && currentAqiValue !== null
      ? currentAqiValue
      : "N/A";
  const aqiStatusDisplay = getAqiDescription(currentAqiValue);

  const hourly = [];
  const dailyAggData = {};
  const nowTimestamp = Date.now();
  forecast.list.forEach((item) => {
    const itemDate = getLocalDate(item.dt);
    const itemTimestamp = item.dt * 1000;
    if (itemTimestamp > nowTimestamp && hourly.length < 6) {
      hourly.push({
        time: formatHour(itemDate),
        temp: Math.round(item.main.temp),
        icon: getIconConditionKey(item.weather),
      });
    }
    const dateKey = itemDate.toISOString().split("T")[0];
    if (!dailyAggData[dateKey]) {
      dailyAggData[dateKey] = { temps: [], pop: 0, weather: [], dt: item.dt };
    }
    dailyAggData[dateKey].temps.push(item.main.temp);
    dailyAggData[dateKey].weather.push(item.weather[0]);
    if (item.pop > dailyAggData[dateKey].pop) {
      dailyAggData[dateKey].pop = item.pop;
    }
  });
  const daily = Object.keys(dailyAggData)
    .sort()
    .slice(0, 6)
    .map((dateKey, index) => {
      const dayData = dailyAggData[dateKey];
      const dayDate = getLocalDate(dayData.dt);
      const dayMinTemp = Math.round(Math.min(...dayData.temps));
      const dayMaxTemp = Math.round(Math.max(...dayData.temps));
      let dominantIcon = "default";
      const conditions = dayData.weather.map((w) => getIconConditionKey([w]));
      if (conditions.includes("thunderstorm")) dominantIcon = "thunderstorm";
      else if (conditions.includes("snowy")) dominantIcon = "snowy";
      else if (conditions.includes("rainy")) dominantIcon = "rainy";
      else if (conditions.includes("cloudy")) dominantIcon = "cloudy";
      else if (conditions.includes("partly-cloudy-day"))
        dominantIcon = "partly-cloudy-day";
      else if (conditions.includes("partly-cloudy-night"))
        dominantIcon = "partly-cloudy-night";
      else if (conditions.includes("sunny")) dominantIcon = "sunny";
      else if (conditions.includes("clear-night")) dominantIcon = "clear-night";
      return {
        day: formatDay(dayDate, index),
        temp: dayMaxTemp,
        icon: dominantIcon,
        isActive: index === 0,
        tempMin: dayMinTemp,
        tempMax: dayMaxTemp,
      };
    });
  const finalTempMax =
    daily.length > 0 ? daily[0].tempMax ?? todayTempMax : todayTempMax;
  const finalTempMin =
    daily.length > 0 ? daily[0].tempMin ?? todayTempMin : todayTempMin;

  const result = {
    location: current.name || locationName,
    date: formatDate(currentDate),
    temp: currentTemp,
    condition: currentCondition,
    icon: currentIconKey,
    wind: windSpeed,
    humidity: humidityValue,
    precip: Math.round(
      (dailyAggData[Object.keys(dailyAggData)[0]]?.pop || 0) * 100
    ),
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
    timezoneOffset: timezoneOffsetSeconds, // Pass offset
    imageUrl: imageUrl || null, // Pass image URL
  };
  console.log("--- END Transformation (Success) ---");
  return result;
}

// --- Main App Component ---
function App() {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get User Location on Mount
  useEffect(() => {
    if (!navigator.geolocation) {
      console.log("Geolocation not supported. Using default.");
      setSelectedLocation(DEFAULT_LOCATION);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        console.log("Geo success:", pos.coords);
        setSelectedLocation({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
          name: "Your Location",
        });
      },
      (err) => {
        console.warn(`Geo Error (${err.code}): ${err.message}. Using default.`);
        setSelectedLocation(DEFAULT_LOCATION);
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 600000 }
    );
  }, []);

  // Fetch Weather Data When Location is Ready
  useEffect(() => {
    if (!selectedLocation?.lat || !selectedLocation?.lon || !API_BASE_URL) {
      if (isLoading && selectedLocation === null) {
        console.log("Waiting for location...");
        return;
      }
      console.log("Skipping fetch: Invalid location/URL.");
      setIsLoading(false);
      setError((prev) => prev || "Could not determine location.");
      setWeatherData(null);
      return;
    }
    const fetchWeather = async () => {
      if (!isLoading) setIsLoading(true);
      setError(null);
      console.log(
        `Fetching weather: ${selectedLocation.name} (Lat=${selectedLocation.lat}, Lon=${selectedLocation.lon})`
      );
      try {
        const url = `${API_BASE_URL}/weather?lat=${selectedLocation.lat}&lon=${selectedLocation.lon}`;
        const res = await axios.get(url);
        const data = transformOpenWeatherData(res.data, selectedLocation.name);
        if (data) setWeatherData(data);
        else throw new Error("Transform failed.");
      } catch (err) {
        console.error("Fetch/process error:", err);
        let msg = "Could not load weather.";
        if (
          err.response?.data?.message ||
          typeof err.response?.data === "string"
        )
          msg = `Error: ${err.response.data.message || err.response.data}`;
        else if (err.message) msg = err.message;
        setError(msg);
        setWeatherData(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchWeather();
  }, [selectedLocation]); // Dependency: selectedLocation

  useEffect(() => {
    if (weatherData?.imageUrl) {
      document.body.style.setProperty(
        "background-image",
        `url(${weatherData.imageUrl})`
      );
      document.body.classList.add("city-bg-active");
    } else {
      document.body.style.removeProperty("background-image");
      document.body.classList.remove("city-bg-active");
    }
    return () => {
      document.body.style.removeProperty("background-image");
      document.body.classList.remove("city-bg-active");
    };
  }, [weatherData?.imageUrl]);

  // Handler for City Selection from Search
  const handleCitySelection = (city) => {
    console.log("City selected:", city);
    if (city?.lat && city?.lon) setSelectedLocation(city);
    else {
      console.error("Invalid city selected:", city);
      setError("Invalid city data.");
    }
  };

  // Render
  return (
    <div className="weather-app-wrapper">
      <div className="weather-app">
        <WeatherDashboard
          weatherData={weatherData}
          isLoading={isLoading}
          error={error}
          onCitySelect={handleCitySelection} // Pass handler down
          apiBaseUrl={API_BASE_URL} // Pass API URL for search use
        />
      </div>
    </div>
  );
}

export default App;

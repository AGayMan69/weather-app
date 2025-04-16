// src/components/WeatherDashboard.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { logEvent } from "firebase/analytics";
import { analytics } from "../firebase";
import "./WeatherDashboard.css";

// Import child components
import DashboardHeader from "./DashboardHeader";
import CurrentWeatherDetails from "./CurrentWeatherDetails";
import DailyForecastDisplay from "./DailyForecastDisplay";
import SidebarHeaderDisplay from "./SidebarHeaderDisplay";
import SidebarWeatherSummary from "./SidebarWeatherSummary";
import AQIDisplay from "./AQIDisplay";
import HourlyForecastDisplay from "./HourlyForecastDisplay";
import CitySearchInput from "./CitySearchInput";
import CitySearchResults from "./CitySearchResults";

// --- Popular Cities Data ---
const popularCitiesData = [
  {
    id: "lon",
    name: "London",
    country: "GB",
    region: "England",
    lat: 51.5074,
    lon: -0.1278,
  },
  {
    id: "nyc",
    name: "New York",
    country: "US",
    region: "New York",
    lat: 40.7128,
    lon: -74.006,
  },
  {
    id: "tky",
    name: "Tokyo",
    country: "JP",
    region: "",
    lat: 35.6895,
    lon: 139.6917,
  },
  {
    id: "par",
    name: "Paris",
    country: "FR",
    region: "Île-de-France",
    lat: 48.8566,
    lon: 2.3522,
  },
  {
    id: "hkg",
    name: "Hong Kong",
    country: "HK",
    region: "",
    lat: 22.3193,
    lon: 114.1694,
  },
  {
    id: "syd",
    name: "Sydney",
    country: "AU",
    region: "New South Wales",
    lat: -33.8688,
    lon: 151.2093,
  },
];

// --- Helper Functions (for time/gradient) ---
const getGreeting = (offsetSeconds = 0) => {
  const d = new Date(Date.now() + offsetSeconds * 1000);
  const h = d.getUTCHours();
  if (h < 12) return "Good Morning";
  if (h < 18) return "Good Afternoon";
  return "Good Evening";
};
const getCurrentTime = (offsetSeconds = 0) => {
  const d = new Date(Date.now() + offsetSeconds * 1000);
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC",
  });
};
const getTimeOfDayClass = (offsetSeconds = 0) => {
  const d = new Date(Date.now() + offsetSeconds * 1000);
  const h = d.getUTCHours();
  if (h >= 6 && h < 12) return "morning";
  if (h >= 12 && h < 18) return "afternoon";
  return "night";
};

// Debounce Hook
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

// --- Icons (with basic SVG placeholders) ---
const SearchIcon = ({ size = 20 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);
const CloseIcon = ({ size = 20 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

// Helper function to get icon key (needed for popular cities)
const getPopIconKey = (weather) => {
  if (!weather || !weather[0]) return "default";
  const main = weather[0].main.toLowerCase();
  const iconCode = weather[0].icon;
  switch (main) {
    case "clear":
      return iconCode.includes("n") ? "clear-night" : "sunny";
    case "clouds":
      if (iconCode === "02d" || iconCode === "02n") return "partly-cloudy-day";
      return "cloudy";
    default:
      return main;
  }
};

// --- Main WeatherDashboard Component ---
function WeatherDashboard({
  weatherData,
  isLoading,
  error,
  onCitySelect,
  apiBaseUrl,
}) {
  // Search State
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  // Popular Cities State
  const [popularCitiesWeather, setPopularCitiesWeather] = useState({});
  const [popularLoading, setPopularLoading] = useState(false);

  const debouncedQuery = useDebounce(searchQuery, 400);

  // Fetch Search Results
  useEffect(() => {
    if (debouncedQuery.trim() && apiBaseUrl) {
      setIsSearchLoading(true);
      setSearchError(null);
      setHasSearched(true);
      const url = `${apiBaseUrl}/search?q=${encodeURIComponent(
        debouncedQuery.trim()
      )}`;
      axios
        .get(url)
        .then((res) => {
          let results = res.data || [];
          if (debouncedQuery.toLowerCase().includes("hong kong")) {
            results = results.filter(
              (c) => c.country === "HK" || c.country === "CN"
            );
          }
          setSearchResults(results);
        })
        .catch((err) => {
          console.error("Search failed:", err);
          setSearchError("Search failed.");
          setSearchResults([]);
        })
        .finally(() => setIsSearchLoading(false));
    } else {
      setSearchResults([]);
      setSearchError(null);
      setIsSearchLoading(false);
      setHasSearched(searchQuery.trim().length > 0);
    }
  }, [debouncedQuery, apiBaseUrl, searchQuery]); // Incl. searchQuery for hasSearched

  // Fetch Popular Cities Weather
  useEffect(() => {
    if (
      isSearchActive &&
      Object.keys(popularCitiesWeather).length === 0 &&
      !popularLoading &&
      apiBaseUrl
    ) {
      console.log("Fetching popular cities weather...");
      setPopularLoading(true);
      const promises = popularCitiesData.map((city) =>
        axios
          .get(`${apiBaseUrl}/weather?lat=${city.lat}&lon=${city.lon}`)
          .then((res) => ({
            id: city.id,
            temp: res.data?.current?.main?.temp,
            weather: res.data?.current?.weather,
          }))
          .catch((err) => {
            console.warn(`Popular fetch fail ${city.name}:`, err.message);
            return { id: city.id, temp: null, weather: null };
          })
      );
      Promise.all(promises)
        .then((results) => {
          const weatherMap = {};
          results.forEach((r) => {
            weatherMap[r.id] = {
              temp: r.temp !== null ? Math.round(r.temp) : null,
              condition: getPopIconKey(r.weather),
            };
          });
          console.log("Popular cities weather:", weatherMap);
          setPopularCitiesWeather(weatherMap);
        })
        .finally(() => setPopularLoading(false));
    }
  }, [isSearchActive, popularCitiesWeather, popularLoading, apiBaseUrl]); // Dependencies

  // Handlers
  const handleQueryChange = (q) => {
    setSearchQuery(q);
    if (q.trim()) {
      logEvent(analytics, "search", { search_term: q });
    }
  };
  const handleSearchResultSelect = (city) => {
    logEvent(analytics, "select_city", {
      city_name: city.name,
      country: city.country,
      lat: city.lat,
      lon: city.lon,
    });
    onCitySelect(city);
    setIsSearchActive(false);
    setSearchQuery("");
    setSearchResults([]);
    setHasSearched(false);
  };
  const toggleSearch = () => {
    setIsSearchActive(!isSearchActive);
    if (isSearchActive) {
      setSearchQuery("");
      setSearchResults([]);
      setHasSearched(false);
    }
  };

  // --- Main Loading/Error States ---
  if (isLoading)
    return (
      <div className="weather-card loading-error-state">
        Loading weather data...
      </div>
    );
  if (error)
    return (
      <div className="weather-card loading-error-state error-text">
        Error: {error}
      </div>
    );
  if (!weatherData)
    return (
      <div className="weather-card loading-error-state">
        No weather data available.
      </div>
    );

  // --- If we have weatherData, proceed ---
  const cityTimezoneOffset = weatherData.timezoneOffset ?? 0;
  const timeOfDay = getTimeOfDayClass(cityTimezoneOffset);
  const mainContentClass = `main-content main-content-${timeOfDay}`;
  const sidebarClass = `sidebar sidebar-${timeOfDay}`;
  const cityCurrentTime = getCurrentTime(cityTimezoneOffset);
  const cityGreeting = getGreeting(cityTimezoneOffset);

  const { location, date, hourly, daily, imageUrl } = weatherData;

  // Prepare Style Object for background
  const mainContentStyle = {
    "--bg-image-url": imageUrl ? `url(${imageUrl})` : "none",
  };

  // Merge popular cities data
  const popularCitiesWithTemp = popularCitiesData.map((city) => ({
    ...city,
    temp:
      popularCitiesWeather[city.id]?.temp !== null
        ? `${popularCitiesWeather[city.id]?.temp}°C`
        : "--°C",
    weatherCondition: popularCitiesWeather[city.id]?.condition || "default",
  }));

  return (
    // Add dynamic class for search state
    <div
      className={`weather-card ${isSearchActive ? "search-active" : ""}`}
      style={{ position: "relative" }}
    >
      {/* Search Toggle Button */}
      <button
        onClick={toggleSearch}
        className="search-toggle-button"
        aria-label={isSearchActive ? "Close search" : "Open search"}
      >
        {isSearchActive ? <CloseIcon size={24} /> : <SearchIcon size={24} />}
      </button>

      {/* Search Overlay */}
      {isSearchActive && (
        <div className="search-overlay">
          <button
            className="return-button"
            onClick={() => setIsSearchActive(false)}
          >
            ← Return
          </button>
          <CitySearchInput
            query={searchQuery}
            onQueryChange={handleQueryChange}
            onSubmit={(e) => e.preventDefault()}
          />
          <CitySearchResults
            cities={searchResults}
            popularCities={popularCitiesWithTemp}
            isLoading={isSearchLoading || popularLoading}
            error={searchError}
            onCitySelect={handleSearchResultSelect}
            isSearchActive={isSearchActive}
            searchQuery={searchQuery}
            title={
              searchQuery.trim()
                ? `Results for "${searchQuery}"`
                : "Popular Destinations"
            }
            showNoResults={
              hasSearched &&
              !isSearchLoading &&
              !searchError &&
              searchResults.length === 0
            }
          />
        </div>
      )}

      {/* Main Content Panel */}
      <div className={mainContentClass} style={mainContentStyle}>
        <DashboardHeader location={location || "Loading..."} date={date} />
        <CurrentWeatherDetails {...weatherData} />
        <DailyForecastDisplay dailyData={daily || []} />
      </div>

      {/* Sidebar Panel */}
      <div className={sidebarClass}>
        <SidebarHeaderDisplay
          greeting={cityGreeting}
          currentTime={cityCurrentTime}
        />
        <SidebarWeatherSummary {...weatherData} />
        <AQIDisplay aqi={weatherData.aqi} aqiStatus={weatherData.aqiStatus} />
        <HourlyForecastDisplay hourlyData={hourly || []} />
      </div>
    </div>
  );
}

export default WeatherDashboard;

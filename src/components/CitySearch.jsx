import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CitySearch.css";

import CitySearchInput from "./CitySearchInput";
import CitySearchResults from "./CitySearchResults";

const getTimeOfDayClass = () => {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 12) return "morning";
  if (hour >= 12 && hour < 18) return "afternoon";
  return "night";
};

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

function CitySearch({ onCitySelect, onNavigateToDashboard, apiBaseUrl }) {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const debouncedQuery = useDebounce(query, 400);

  const [activeNav] = useState("Search");

  useEffect(() => {
    if (debouncedQuery.trim() && apiBaseUrl) {
      setIsLoading(true);
      setError(null);
      setHasSearched(true);
      console.log(`Searching for: ${debouncedQuery}`);

      const searchUrl = `${apiBaseUrl}/search?q=${encodeURIComponent(
        debouncedQuery.trim()
      )}`;

      axios
        .get(searchUrl)
        .then((response) => {
          console.log("Search API Response:", response.data);
          setSearchResults(response.data || []);
        })
        .catch((err) => {
          console.error("Failed to search cities:", err);
          let message = "Could not perform search. Please try again.";
          if (
            err.response?.data?.message ||
            typeof err.response?.data === "string"
          ) {
            message = `Error: ${
              err.response.data.message || err.response.data
            }`;
          } else if (err.message) {
            message = err.message;
          }
          setError(message);
          setSearchResults([]);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setSearchResults([]);
      setError(null);
      setIsLoading(false);
      setHasSearched(query.trim().length > 0);
    }
  }, [debouncedQuery, apiBaseUrl]);

  const handleQueryChange = (newQuery) => {
    setQuery(newQuery);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
  };

  // Calculate dynamic class for gradient
  const timeOfDay = getTimeOfDayClass();
  const containerClass = `city-search-container style-ref city-search-container-${timeOfDay}`;

  const displayCities = searchResults;
  const resultsTitle = query.trim()
    ? `Results for "${query}"`
    : "Search for a city";
  const showNoResultsMessage =
    hasSearched && !isLoading && !error && displayCities.length === 0;

  return (
    <div className={containerClass}>
      <div className="internal-navigation">
        <button
          className={`nav-button ${activeNav === "Dashboard" ? "active" : ""}`}
          onClick={onNavigateToDashboard}
        >
          {" "}
          Dashboard{" "}
        </button>
        <button
          className={`nav-button ${activeNav === "Search" ? "active" : ""}`}
        >
          {" "}
          Search City{" "}
        </button>
        <button className={`nav-button`} disabled>
          {" "}
          Hong Kong Regions{" "}
        </button>
      </div>

      <CitySearchInput
        query={query}
        onQueryChange={handleQueryChange}
        onSubmit={handleSearchSubmit}
      />

      <CitySearchResults
        title={resultsTitle}
        cities={displayCities}
        isLoading={isLoading}
        error={error}
        onCitySelect={onCitySelect}
        showNoResults={showNoResultsMessage}
      />
    </div>
  );
}

export default CitySearch;

// src/components/CitySearch.jsx
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './CitySearch.css';

// Import child components
import CitySearchInput from './CitySearchInput';
import CitySearchResults from './CitySearchResults';

// Helper function for gradients
const getTimeOfDayClass = () => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 18) return 'afternoon';
    return 'night';
};

// Custom hook for debouncing (optional but recommended)
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
    const [query, setQuery] = useState('');
    // State specific to search results
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hasSearched, setHasSearched] = useState(false); // Track if a search has been attempted

    // Use debounced query to trigger API call
    const debouncedQuery = useDebounce(query, 400); // Wait 400ms after typing stops

    // State for Navigation Button Appearance
    const [activeNav, setActiveNav] = useState('Search');

    // --- API Fetching Logic ---
    useEffect(() => {
      // Only search if debounced query is not empty and API URL is provided
      if (debouncedQuery.trim() && apiBaseUrl) {
        setIsLoading(true);
        setError(null);
        setHasSearched(true); // Mark that a search is being performed
        console.log(`Searching for: ${debouncedQuery}`);

        const searchUrl = `${apiBaseUrl}/search?q=${encodeURIComponent(debouncedQuery.trim())}`;

        axios.get(searchUrl)
          .then(response => {
            console.log("Search API Response:", response.data);
            setSearchResults(response.data || []); // Ensure it's an array
          })
          .catch(err => {
            console.error("Failed to search cities:", err);
            let message = "Could not perform search. Please try again.";
            if (err.response?.data?.message || typeof err.response?.data === 'string') {
                message = `Error: ${err.response.data.message || err.response.data}`;
            } else if (err.message) {
                message = err.message;
            }
            setError(message);
            setSearchResults([]); // Clear results on error
          })
          .finally(() => {
            setIsLoading(false);
          });
      } else {
        // Clear results and error if query is empty
        setSearchResults([]);
        setError(null);
        setIsLoading(false);
        setHasSearched(query.trim().length > 0); // Keep track if user typed then cleared
      }
    }, [debouncedQuery, apiBaseUrl]); // Depend on debounced query and base URL

    const handleQueryChange = (newQuery) => {
        setQuery(newQuery);
    };

    // Prevent default form submission (search happens via useEffect)
    const handleSearchSubmit = (event) => {
        event.preventDefault();
        // Optionally trigger immediate search here if needed, but debouncing usually covers it
    };

    // Calculate dynamic class for gradient
    const timeOfDay = getTimeOfDayClass();
    const containerClass = `city-search-container style-ref city-search-container-${timeOfDay}`;

    // Determine title and results to display
    const displayCities = searchResults; // Always show API results now
    const resultsTitle = query.trim() ? `Results for "${query}"` : 'Search for a city'; // Change title based on query
    const showNoResultsMessage = hasSearched && !isLoading && !error && displayCities.length === 0;

    return (
        <div className={containerClass}>
            {/* Internal Navigation */}
            <div className="internal-navigation">
                <button
                    className={`nav-button ${activeNav === 'Dashboard' ? 'active' : ''}`}
                    onClick={onNavigateToDashboard}
                > Dashboard </button>
                <button
                    className={`nav-button ${activeNav === 'Search' ? 'active' : ''}`}
                    // onClick={() => setActiveNav('Search')} // Can keep this if needed
                > Search City </button>
                <button className={`nav-button`} disabled> Hong Kong Regions </button>
            </div>

            {/* Search Input Component */}
            <CitySearchInput
                query={query}
                onQueryChange={handleQueryChange}
                onSubmit={handleSearchSubmit}
            />

            {/* Search Results Component */}
            <CitySearchResults
                title={resultsTitle}
                cities={displayCities}
                isLoading={isLoading}
                error={error}
                onCitySelect={onCitySelect} // Pass down the handler from App.jsx
                showNoResults={showNoResultsMessage}
            />
        </div>
    );
}

export default CitySearch;

// src/components/CitySearchResults.jsx
import React from 'react';
import CityListItem from './CityListItem';

function CitySearchResults({
  title,
  cities,          // Actual search results
  popularCities,   // Array of popular city objects with fetched temp/condition
  isLoading,
  error,
  onCitySelect,
  isSearchActive,
  searchQuery
}) {

  // Show popular cities if search query is empty, otherwise show search results
  const listToShow = searchQuery.trim() ? cities : popularCities;
  const currentTitle = searchQuery.trim() ? title : "Popular Destinations";

  // Determine if "No Results" should be shown (only after a search attempt)
  const showNoResults = searchQuery.trim() && !isLoading && !error && cities.length === 0;

  return (
    <div className="results-area">
      {/* Only show title if search overlay is active */}
      {isSearchActive && <h2 className="results-title">{currentTitle}</h2>}

      {isSearchActive && isLoading && (
        <p className="loading-message" style={{textAlign: 'center', padding: '20px', color: '#4a5568'}}>Loading...</p>
      )}

      {isSearchActive && error && (
        <p className="error-message" style={{textAlign: 'center', padding: '20px', color: 'red'}}>{error}</p>
      )}

      {isSearchActive && showNoResults && (
        <p className="no-results-message">No locations found matching your search.</p>
      )}

      {/* Show list if active, not loading, no error, and list has items */}
      {isSearchActive && !isLoading && !error && listToShow && listToShow.length > 0 && (
        <ul className="city-list">
          {listToShow.map((city) => (
            <CityListItem
              key={city.id || `${city.lat}-${city.lon}`}
              city={city}
              onCitySelect={onCitySelect}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

export default CitySearchResults;

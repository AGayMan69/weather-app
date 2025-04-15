// src/components/CitySearchResults.jsx
import React from 'react';
import CityListItem from './CityListItem'; // Import the item component

function CitySearchResults({
  title,
  cities,
  isLoading,
  error,
  onCitySelect,
  showNoResults // Flag to indicate if no results message should be shown
}) {
  return (
    <div className="results-area">
      <h2 className="results-title">{title}</h2>

      {isLoading && (
        <p className="loading-message" style={{textAlign: 'center', padding: '20px', color: '#4a5568'}}>Loading results...</p>
      )}

      {error && (
        <p className="error-message" style={{textAlign: 'center', padding: '20px', color: 'red'}}>{error}</p>
      )}

      {!isLoading && !error && showNoResults && (
        <p className="no-results-message">No locations found matching your search.</p>
      )}

      {!isLoading && !error && cities && cities.length > 0 && (
        <ul className="city-list">
          {cities.map((city) => (
            <CityListItem
              key={city.id || `${city.lat}-${city.lon}`} // Ensure a unique key
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

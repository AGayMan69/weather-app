import React from "react";
import CityListItem from "./CityListItem";

function CitySearchResults({
  title,
  cities,
  popularCities,
  isLoading,
  error,
  onCitySelect,
  isSearchActive,
  searchQuery,
}) {
  const listToShow = searchQuery.trim() ? cities : popularCities;
  const currentTitle = searchQuery.trim() ? title : "Popular Destinations";

  const showNoResults =
    searchQuery.trim() && !isLoading && !error && cities.length === 0;

  return (
    <div className="results-area">
      {isSearchActive && <h2 className="results-title">{currentTitle}</h2>}

      {isSearchActive && isLoading && (
        <p
          className="loading-message"
          style={{ textAlign: "center", padding: "20px", color: "#4a5568" }}
        >
          Loading...
        </p>
      )}

      {isSearchActive && error && (
        <p
          className="error-message"
          style={{ textAlign: "center", padding: "20px", color: "red" }}
        >
          {error}
        </p>
      )}

      {isSearchActive && showNoResults && (
        <p className="no-results-message">
          No locations found matching your search.
        </p>
      )}

      {isSearchActive &&
        !isLoading &&
        !error &&
        listToShow &&
        listToShow.length > 0 && (
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

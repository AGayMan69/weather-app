// src/components/CitySearchInput.jsx
import React from 'react';

function CitySearchInput({ query, onQueryChange, onSubmit }) {
  const handleInputChange = (event) => {
    onQueryChange(event.target.value);
  };

  return (
    <form className="search-area" onSubmit={onSubmit}>
      <div className="search-input-wrapper">
        <span className="search-input-icon">📍</span>
        <input
          type="text"
          className="search-input"
          placeholder="Search for city..."
          value={query}
          onChange={handleInputChange}
          aria-label="Search for city"
        />
      </div>
      {/* You could add an explicit search button here if desired */}
      {/* <button type="submit">Search</button> */}
    </form>
  );
}

export default CitySearchInput;

// src/components/CitySearch.jsx
import React, { useState, useEffect } from 'react'; // Added useEffect
import './CitySearch.css'; // Import the component-specific CSS

// --- Import Weather SVG Icons ---
import SunnyIcon from '../assets/sunny.svg?react';
import CloudyIcon from '../assets/cloudy.svg?react';
import RainyIcon from '../assets/rainy.svg?react';
import PartlyCloudyDayIcon from '../assets/partly-cloudy-day.svg?react';
import SnowyIcon from '../assets/snowy.svg?react';
import ThunderstormIcon from '../assets/thunderstorm.svg?react';

// --- Simple Icon Mapping ---
const weatherIconMap = {
  'Sunny': SunnyIcon, 'Clear': SunnyIcon, 'Cloudy': CloudyIcon,
  'Partly Cloudy': PartlyCloudyDayIcon, 'Rain': RainyIcon, 'Showers': RainyIcon,
  'Snow': SnowyIcon, 'Thunderstorm': ThunderstormIcon, 'default': CloudyIcon
};

// --- Helper component to render the correct icon ---
const WeatherIconDisplay = ({ condition, size = 38 }) => { // Adjusted default size
  const IconComponent = weatherIconMap[condition] || weatherIconMap['default'];
  // *** Corrected Render Logic from File [1] ***
  return <IconComponent width={size} height={size} className="weather-svg-icon" />;
};

// --- Placeholder Arrow Icon ---
const ArrowRightIcon = () => <span className="icon arrow-icon-svg">→</span>;

// --- Sample Data ---
const popularCities = [
    { id: 1, name: 'New York', country: 'USA', region: 'North America', temp: '18°C', weatherCondition: 'Partly Cloudy' },
    { id: 2, name: 'London', country: 'UK', region: 'Europe', temp: '15°C', weatherCondition: 'Cloudy' },
    { id: 3, name: 'Tokyo', country: 'Japan', region: 'Asia', temp: '22°C', weatherCondition: 'Sunny' },
    { id: 4, name: 'Paris', country: 'France', region: 'Europe', temp: '17°C', weatherCondition: 'Rain' },
    { id: 5, name: 'Singapore', country: 'Singapore', region: 'Asia', temp: '30°C', weatherCondition: 'Thunderstorm' },
    { id: 6, name: 'Sydney', country: 'Australia', region: 'Oceania', temp: '25°C', weatherCondition: 'Clear' },
    { id: 7, name: 'Moab', country: 'USA', region: 'North America', temp: '28°C', weatherCondition: 'Sunny' },
];

// Simulate API results
const fetchSimulatedResults = (query) => {
    // ... (fetchSimulatedResults logic remains the same) ...
    if (!query) return []; const lowerCaseQuery = query.toLowerCase(); const allCities = [ ...popularCities, { id: 100, name: 'San Francisco', country: 'USA', region: 'North America', temp: '16°C', weatherCondition: 'Cloudy' }, { id: 101, name: 'Berlin', country: 'Germany', region: 'Europe', temp: '14°C', weatherCondition: 'Partly Cloudy'}, { id: 102, name: 'Dubai', country: 'UAE', region: 'Asia', temp: '35°C', weatherCondition: 'Sunny'}, { id: 103, name: 'Rome', country: 'Italy', region: 'Europe', temp: '20°C', weatherCondition: 'Clear'}, { id: 104, name: 'Toronto', country: 'Canada', region: 'North America', temp: '12°C', weatherCondition: 'Snow'}, ]; return allCities.filter(city => city.name.toLowerCase().includes(lowerCaseQuery) || city.country.toLowerCase().includes(lowerCaseQuery) || city.region.toLowerCase().includes(lowerCaseQuery) );
};

// *** ADDED: Helper function for gradients (copied from WeatherDashboard) ***
const getTimeOfDayClass = () => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 18) return 'afternoon';
    return 'night';
};

// *** MODIFIED: Receive onNavigateToDashboard prop ***
function CitySearch({ onCitySelect, onNavigateToDashboard }) {
    const [query, setQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    // State to manage active button appearance (optional but good practice)
    const [activeNav, setActiveNav] = useState('Search');

    const handleInputChange = (event) => {
        const newQuery = event.target.value;
        setQuery(newQuery);
        if (newQuery.trim()) {
            setIsSearching(true);
            setSearchResults(fetchSimulatedResults(newQuery.trim()));
        } else {
            setIsSearching(false);
            setSearchResults([]);
        }
    };

    const handleSearchSubmit = (event) => {
        event.preventDefault();
         if (!isSearching && query.trim()) {
             setIsSearching(true);
             setSearchResults(fetchSimulatedResults(query.trim()));
         }
    };

    const handleCityClick = (city) => {
        console.log('Selected city:', city);
        if (onCitySelect) {
            onCitySelect(city);
        }
    };

    const listToDisplay = isSearching ? searchResults : popularCities;
    const showNoResults = isSearching && query.trim() && searchResults.length === 0;
    const sectionTitle = isSearching ? `Results for "${query}"` : 'Popular Destinations';

    // *** ADDED: Calculate dynamic class for gradient ***
    const timeOfDay = getTimeOfDayClass();
    // *** Construct className for the main container ***
    const containerClass = `city-search-container style-ref city-search-container-${timeOfDay}`;

    return (
        // *** MODIFIED: Apply dynamic class ***
        <div className={containerClass}>

            {/* *** ADDED: Internal Navigation (copied from WeatherDashboard) *** */}
            <div className="internal-navigation">
                <button
                    className={`nav-button ${activeNav === 'Dashboard' ? 'active' : ''}`}
                    onClick={onNavigateToDashboard} // Navigate back to dashboard
                >
                    Dashboard
                </button>
                <button
                    className={`nav-button ${activeNav === 'Search' ? 'active' : ''}`}
                    // No onClick needed, or could set internal state: onClick={() => setActiveNav('Search')}
                    // This button is already the active page, so disable interaction maybe?
                >
                    Search City
                </button>
                <button className={`nav-button ${activeNav === 'Regions' ? 'active' : ''}`} disabled>
                    Hong Kong Regions
                </button>
            </div>
            {/* *** End of Internal Navigation *** */}


            {/* Top Search Area */}
            <form className="search-area" onSubmit={handleSearchSubmit}>
                 <div className="search-input-wrapper">
                     <span className="search-input-icon">📍</span>
                     <input
                        type="text"
                        className="search-input"
                        placeholder="Search for city, region, or country..."
                        value={query}
                        onChange={handleInputChange}
                     />
                 </div>
            </form>

            {/* Results Area */}
            <div className="results-area">
                <h2 className="results-title">{sectionTitle}</h2>

                {showNoResults ? (
                    <p className="no-results-message">No locations found matching your search.</p>
                ) : (
                    <ul className="city-list">
                        {listToDisplay.map((city) => (
                            <li
                                key={city.id}
                                className="city-list-item card"
                                onClick={() => handleCityClick(city)}
                                tabIndex={0}
                                onKeyPress={(e) => e.key === 'Enter' && handleCityClick(city)}
                            >
                                <div className="city-details">
                                    <span className="city-name">{city.name}</span>
                                    <span className="city-location">{city.country}, {city.region}</span>
                                </div>
                                <div className="weather-info">
                                    <WeatherIconDisplay condition={city.weatherCondition} size={38}/>
                                    <span className="weather-temp">{city.temp}</span>
                                </div>
                                <button
                                    className="select-button"
                                    aria-label={`Select ${city.name}`}
                                    onClick={(e) => { e.stopPropagation(); handleCityClick(city); }}
                                >
                                    <ArrowRightIcon />
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default CitySearch;

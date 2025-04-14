// src/App.jsx
import React, { useState } from 'react';

// Import child components
import WeatherDashboard from './components/WeatherDashboard';
import CitySearch from './components/CitySearch';

// App.css is imported globally via main.jsx

function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedCityData, setSelectedCityData] = useState(null);

  // Function to handle city selection FROM CitySearch component
  const handleCitySelection = (city) => {
    console.log("City selected in App:", city);
    setSelectedCityData(city);
    setActiveView('dashboard');
    // TODO: Fetch real weather data for 'city'
  };

  // Function to navigate TO the search view FROM Dashboard
  const navigateToSearch = () => {
    setActiveView('search');
  };

  // *** NEW FUNCTION: To navigate TO the dashboard view FROM Search ***
  const navigateToDashboard = () => {
    setActiveView('dashboard');
  };

  return (
    <div className="weather-app-wrapper">
        <div className="weather-app">
            {activeView === 'dashboard' && (
                <WeatherDashboard
                    onNavigateToSearch={navigateToSearch}
                    /* cityData={selectedCityData} */
                 />
            )}

            {activeView === 'search' && (
                // *** MODIFIED: Pass navigateToDashboard function as a prop ***
                <CitySearch
                    onCitySelect={handleCitySelection}
                    onNavigateToDashboard={navigateToDashboard} // Pass the new function
                />
            )}
        </div>
    </div>
  );
}

export default App;

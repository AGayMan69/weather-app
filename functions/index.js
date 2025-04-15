// functions/index.js
const functions = require("firebase-functions/v1");
const express = require("express");
const cors = require("cors");
const axios = require("axios");

// Define Secrets (Replacing Unsplash with Pexels)
const { defineSecret } = require("firebase-functions/params");
const weatherApiKeySecret = defineSecret("WEATHER_API_KEY");
const openUvApiKeySecret = defineSecret("OPENUV_API_KEY");
const pexelsApiKeySecret = defineSecret("PEXELS_API_KEY"); // Changed from Unsplash

const app = express();
app.use(cors({ origin: true }));

// --- Weather Endpoint (Fetching OWM Weather, Forecast, AQI, OpenUV, PEXELS Image) ---
app.get("/weather", async (req, res) => {
  // Access secret values
  const owmApiKey = weatherApiKeySecret.value();
  const openUvApiKey = openUvApiKeySecret.value();
  const pexelsKey = pexelsApiKeySecret.value(); // Changed from unsplashKey

  // Check if all keys are available
  if (!owmApiKey || !openUvApiKey || !pexelsKey) { // Check pexelsKey
    console.error("One or more API Key secrets are not available.");
    return res.status(500).send("Server configuration error: API Key missing.");
  }

  const { lat, lon } = req.query;
  if (!lat || !lon) return res.status(400).send("Missing lat/lon parameters.");

  // Define API URLs
  const owmCurrentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${owmApiKey}&units=metric`;
  const owmForecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${owmApiKey}&units=metric`;
  const owmAirPollutionUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${owmApiKey}`;
  const openUvUrl = `https://api.openuv.io/api/v1/uv?lat=${lat}&lng=${lon}`;
  // Pexels URL constructed later

  console.log(`Fetching initial current weather (lat=${lat}, lon=${lon})`);

  try {
    // 1. Fetch Current Weather first for city name
    const currentResponse = await axios.get(owmCurrentUrl);
    const currentData = currentResponse.data;
    const cityName = currentData?.name;

    if (!cityName) console.warn("Could not get city name from OWM.");
    else console.log(`City name: ${cityName}. Fetching others...`);

    // 2. Construct Pexels Search URL
    const pexelsSearchUrl = cityName
      ? `https://api.pexels.com/v1/search?query=${encodeURIComponent(cityName)} city landscape&per_page=1&orientation=landscape`
      : null;

    // 3. Fetch remaining data concurrently
    const remainingPromises = [
      axios.get(owmForecastUrl),
      axios.get(owmAirPollutionUrl),
      axios.get(openUvUrl, { headers: { "x-access-token": openUvApiKey } }),
      // Pexels requires Authorization header
      pexelsSearchUrl ? axios.get(pexelsSearchUrl, { headers: { "Authorization": pexelsKey } }) : Promise.resolve({ status: "skipped", value: null })
    ];

    const results = await Promise.allSettled(remainingPromises);

    // 4. Process all results
    const combinedData = { current: currentData };
    const errors = [];

    // Process Forecast, AQI, UV (same as before)
    if (results[0].status === "fulfilled") combinedData.forecast = results[0].value.data; else { console.error("Failed OWM Forecast:", results[0].reason?.message); errors.push("forecast"); combinedData.forecast = null; }
    if (results[1].status === "fulfilled") combinedData.aqiData = results[1].value.data; else { console.error("Failed OWM AQI:", results[1].reason?.message); errors.push("aqi"); combinedData.aqiData = null; }
    if (results[2].status === "fulfilled") combinedData.uvData = results[2].value.data; else { console.error("Failed OpenUV:", results[2].reason?.message); errors.push("uv"); combinedData.uvData = null; }

    // Process Pexels Image URL
    if (results[3].status === "fulfilled" && results[3].value?.data?.photos?.length > 0) {
      // Pexels response structure: photos[0].src contains sizes like 'landscape', 'large', 'medium'
      const photoSources = results[3].value.data.photos[0].src;
      combinedData.imageUrl = photoSources.landscape || photoSources.large || photoSources.medium || null; // Prefer landscape, fallback
      console.log("Pexels image URL fetched:", combinedData.imageUrl);
    } else {
      if (results[3].status !== "skipped") {
           console.warn("Failed to fetch Pexels image or no results:", results[3].reason?.response?.data || results[3].reason?.message || "No results");
           errors.push("image");
      }
      combinedData.imageUrl = null; // Ensure null if skipped or failed
    }

    console.log(`Finished all fetches. Errors for: ${errors.join(", ") || "none"}`);
    res.status(200).json(combinedData);

  } catch (error) {
    console.error("Error during API fetch sequence:", error.response?.data ? JSON.stringify(error.response.data) : error.message);
    if (error.response) {
      return res.status(error.response.status).send(error.response.data || "Error fetching initial data.");
    } else {
      return res.status(500).send("Unexpected error fetching weather data.");
    }
  }
});

// --- Search Endpoint (Remains the same) ---
app.get("/search", async (req, res) => {
    const owmApiKey = weatherApiKeySecret.value();
    if (!owmApiKey) return res.status(500).send("Server config error: OWM Key missing.");
    const query = req.query.q;
    if (!query) return res.status(400).send("Missing q parameter.");
    const geocodeApiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${owmApiKey}`;
    try {
        console.log(`Searching cities for query: ${query}`);
        const response = await axios.get(geocodeApiUrl);
        const cities = response.data.map((city) => ({
            id: `${city.lat}-${city.lon}`, name: city.name, country: city.country,
            region: city.state || "", lat: city.lat, lon: city.lon,
            temp: "--°C", weatherCondition: "default",
        }));
        console.log(`Found ${cities.length} potential cities.`);
        res.status(200).json(cities);
    } catch (error) {
        console.error("Error during city search:", error.response?.data ? JSON.stringify(error.response.data) : error.message);
        res.status(error.response?.status || 500).send("Error searching cities.");
    }
});

// Export the Express app, binding the updated secrets list
exports.app = functions.runWith({ secrets: ["WEATHER_API_KEY", "OPENUV_API_KEY", "PEXELS_API_KEY"] }) // Replaced Unsplash with Pexels
  .https.onRequest(app);

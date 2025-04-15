// functions/index.js
const functions = require("firebase-functions/v1");
const express = require("express");
const cors = require("cors");
const axios = require("axios");

// Define BOTH secrets
const { defineSecret } = require("firebase-functions/params");
const weatherApiKeySecret = defineSecret("WEATHER_API_KEY");
const openUvApiKeySecret = defineSecret("OPENUV_API_KEY");

const app = express();
app.use(cors({ origin: true }));

// --- Weather Endpoint (Fetching OWM Weather, OWM Forecast, OWM AQI, OpenUV) ---
app.get("/weather", async (req, res) => {
  // Access both secrets
  const owmApiKey = weatherApiKeySecret.value();
  const openUvApiKey = openUvApiKeySecret.value();

  // Check if keys are available
  if (!owmApiKey) {
    console.error("WEATHER_API_KEY secret is not available.");
    return res.status(500).send("Server config error: OWM Key missing.");
  } // <- Added missing brace
  if (!openUvApiKey) {
    console.error("OPENUV_API_KEY secret is not available.");
    return res.status(500).send("Server config error: OpenUV Key missing.");
  } // <- Added missing brace

  const { lat, lon } = req.query;
  if (!lat || !lon) {
    return res.status(400).send("Missing lat/lon parameters.");
  } // <- Added missing brace

  // Define all API URLs
  const owmCurrentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${owmApiKey}&units=metric`;
  const owmForecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${owmApiKey}&units=metric`;
  const owmAirPollutionUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${owmApiKey}`;
  const openUvUrl = `https://api.openuv.io/api/v1/uv?lat=${lat}&lng=${lon}`; // Note: uses lng

  console.log(`Fetching data for lat=${lat}, lon=${lon}`);

  try {
    // Use Promise.allSettled to fetch all concurrently, allowing some to fail
    const results = await Promise.allSettled([
      axios.get(owmCurrentUrl),
      axios.get(owmForecastUrl),
      axios.get(owmAirPollutionUrl),
      // OpenUV requires the API key in the header
      axios.get(openUvUrl, { headers: { "x-access-token": openUvApiKey } }) // <- Use double quotes
    ]);

    // Process results
    const combinedData = {};
    // let hasError = false; // Removed unused variable
    const errors = [];

    // Check OWM Current Weather result
    if (results[0].status === "fulfilled") { // <- Use double quotes
      combinedData.current = results[0].value.data;
      console.log("OWM Current Weather fetched.");
    } else {
      console.error("Failed to fetch OWM Current Weather:", results[0].reason.response?.data || results[0].reason.message);
      errors.push("Could not load current weather.");
      // hasError = true; // Removed
    } // <- Added missing brace

    // Check OWM Forecast result
    if (results[1].status === "fulfilled") { // <- Use double quotes
      combinedData.forecast = results[1].value.data;
      console.log("OWM Forecast fetched.");
    } else {
      console.error("Failed to fetch OWM Forecast:", results[1].reason.response?.data || results[1].reason.message);
      errors.push("Could not load forecast.");
    } // <- Added missing brace

    // Check OWM Air Pollution result
    if (results[2].status === "fulfilled") { // <- Use double quotes
      combinedData.aqiData = results[2].value.data;
      console.log("OWM Air Pollution fetched.");
    } else {
      console.error("Failed to fetch OWM Air Pollution:", results[2].reason.response?.data || results[2].reason.message);
      errors.push("Could not load air quality.");
    } // <- Added missing brace

    // Check OpenUV result
    if (results[3].status === "fulfilled") { // <- Use double quotes
      combinedData.uvData = results[3].value.data;
      console.log("OpenUV fetched.");
    } else {
      console.error("Failed to fetch OpenUV:", results[3].reason.response?.data || results[3].reason.message);
      errors.push("Could not load UV index.");
    } // <- Added missing brace

    // If the critical data (current weather) failed, return an error
    if (!combinedData.current) {
      const owmErrorStatus = results[0].reason?.response?.status || 500;
      const owmErrorMessage = results[0].reason?.response?.data?.message || errors.join(" "); // <- Use double quotes
      return res.status(owmErrorStatus).send(owmErrorMessage || "Failed to fetch essential weather data.");
    } // <- Added missing brace

    // Send combined data (even if some parts failed)
    res.status(200).json(combinedData);

  } catch (error) { // Catch unexpected errors
    console.error("General error during multi-API fetch:", error.message);
    res.status(500).send("An unexpected error occurred fetching weather data.");
  } // <- Added missing brace
}); // <- Added missing brace for app.get("/weather",...)

// Search Endpoint (Corrected)
app.get("/search", async (req, res) => {
  const owmApiKey = weatherApiKeySecret.value();
  if (!owmApiKey) {
    console.error("WEATHER_API_KEY secret is not available.");
    return res.status(500).send("Server config error: OWM Key missing.");
  } // <- Added missing brace

  const query = req.query.q;
  if (!query) {
     return res.status(400).send("Missing q parameter.");
  } // <- Added missing brace

  const geocodeApiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${owmApiKey}`;
  try {
    const response = await axios.get(geocodeApiUrl);
    const cities = response.data.map((city) => ({
      id: `${city.lat}-${city.lon}`, name: city.name, country: city.country,
      region: city.state || "", lat: city.lat, lon: city.lon, // Use double quotes for empty string
      temp: "--°C", // Double quotes consistent, but not required by error
      weatherCondition: "default", // Use double quotes
    }));
    res.status(200).json(cities);
  } catch (error) {
    console.error("Error searching cities:", error.response?.data ? JSON.stringify(error.response.data) : error.message);
    res.status(error.response?.status || 500).send("Error searching cities.");
  } // <- Added missing brace
}); // <- Added missing brace for app.get("/search",...)

// Export the Express app binding BOTH secrets
exports.app = functions.runWith({ secrets: ["WEATHER_API_KEY", "OPENUV_API_KEY"] })
  .https.onRequest(app);

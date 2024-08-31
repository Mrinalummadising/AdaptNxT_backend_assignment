const express = require("express");
const path = require("path");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3002;
const API_ACCESS_KEY =
  process.env.API_ACCESS_KEY || "8016bddf38ab44e6f29889e471f15d51";

const initializeServer = async () => {
  try {
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Error: Internal server error.", error);
    process.exit(1);
  }
};

initializeServer();

// API routes

// URL: http://localhost:<port>/
// Method: GET
// Displays a default message
app.get("/", async (req, res) => {
  try {
    res.send(
      "Welcome to AdaptNXT weather service. Please access /weather/location path to get current weather data."
    );
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// URL: http://localhost:<port>/weather/location
// Method: GET
// Query parameter: location
// Fetches and displays weather data for the provided location
app.get("/weather/location", async (req, res) => {
  const location = req.query.location;
  console.log("Requested location:", location);

  if (!location) {
    return res.status(400).json({ error: "Location is required" });
  }

  try {
    const weatherstack_url = `http://api.weatherstack.com/current?access_key=${API_ACCESS_KEY}&query=${location}`;
    console.log("Weatherstack URL:", weatherstack_url);

    const response_data = await axios.get(weatherstack_url);
    const weatherData = response_data.data;

    console.log("Weather Data:", weatherData);
    res.json(weatherData);
  } catch (error) {
    console.error("Error fetching data from Weatherstack API:", error.message);
    res
      .status(500)
      .json({ error: "Failed to fetch response from Weatherstack API" });
  }
});

module.exports = app;

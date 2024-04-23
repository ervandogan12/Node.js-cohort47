import express from "express";
import { keys } from "./sources/keys.js";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello from backend to frontend!");
});



app.post("/weather", async (req, res) => {
  const { cityName, countryCode } = req.body;
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName},${countryCode}&APPID=${keys.API_KEY}`;
    const response = await fetch(url);
    if (response.status === 200) {
      const data = await response.json();
      const kelvinDegree = data.main.temp;
      const celsiusSymbol = '\u2103';
      const celciusDegree = Math.round(kelvinDegree-273);
      const responseData = {
        cityName: cityName,
        temperature: celciusDegree,
        temperatureUnit: celsiusSymbol
    };
      res.status(200).send(responseData);
    } else {
      const err = { weatherText: `${cityName} is not found!` };
      res.status(404).json( err.weatherText);
    }
  } catch (error) {
    console.error("Error fetching weather data:", error);
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
});

export default app;  
import express from "express";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.get("/api/weather/:city", async (req, res) => {
  const city = req.params.city;
  const apiKey = process.env.OPENWEATHER_API_KEY;
  console.log(apiKey);
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );

    const data = await response.json(); // always read it

    if (!response.ok) {
      console.error("OpenWeather error:", data); // 👈 log full error
      throw new Error(data.message || "Weather API request failed");
    }

    res.json({
      city: data.name,
      temperature: data.main.temp,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


export default app;
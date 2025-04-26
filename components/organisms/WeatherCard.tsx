import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios';

const API_KEY = '4472fd4b521350cee28798a50c1e401c'; // ✅ Your provided API key
const CITY_NAME = 'New York'; // Default city for now

const WeatherCard = () => {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchWeather();
  }, []);

  const fetchWeather = async () => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${CITY_NAME}&appid=${API_KEY}&units=metric`
      );
      setWeather(response.data);
    } catch (error) {
      console.error('Error fetching weather:', error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="m-4 p-4 rounded-xl bg-white shadow">
        <ActivityIndicator size="large" color="#4ade80" />
        <Text className="text-center mt-2 text-gray-500">Fetching Weather...</Text>
      </View>
    );
  }

  if (error || !weather) {
    return (
      <View className="m-4 p-4 rounded-xl bg-white shadow">
        <Text className="text-center text-red-500">Failed to fetch weather data.</Text>
      </View>
    );
  }

  return (
    <TouchableOpacity className="m-4 p-4 rounded-xl bg-white shadow">
      <Text className="text-xl font-bold text-green-600 text-center mb-2">Weather Forecast</Text>
      <Text className="text-center text-gray-700">City: {weather.name}</Text>
      <Text className="text-center text-gray-700">Temperature: {weather.main.temp}°C</Text>
      <Text className="text-center text-gray-700">Condition: {weather.weather[0].description}</Text>
    </TouchableOpacity>
  );
};

export default WeatherCard;

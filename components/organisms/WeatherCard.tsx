import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'
import axios from 'axios'

const API_KEY = '4472fd4b521350cee28798a50c1e401c'
const CITY_NAME = 'New York'
const primaryColor = '#3b8d75'

const WeatherCard = () => {
  const [weather, setWeather] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetchWeather()
  }, [])

  const fetchWeather = async () => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${CITY_NAME}&appid=${API_KEY}&units=metric`
      )
      setWeather(response.data)
    } catch (e) {
      console.error('Error fetching weather:', e)
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <View style={styles.card}>
        <ActivityIndicator size="large" color={primaryColor} />
        <Text style={styles.loadingText}>Fetching Weather...</Text>
      </View>
    )
  }

  if (error || !weather) {
    return (
      <View style={styles.card}>
        <Text style={styles.errorText}>Failed to load weather data.</Text>
      </View>
    )
  }

  return (
    <TouchableOpacity activeOpacity={0.8} style={styles.card} onPress={fetchWeather}>
      <Text style={styles.title}>Weather Forecast</Text>
      <Text style={styles.infoText}>City: {weather.name}</Text>
      <Text style={styles.infoText}>Temperature: {weather.main.temp}°C</Text>
      <Text style={styles.infoText}>Condition: {weather.weather[0].description}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginBottom: 24,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: primaryColor,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginBottom: 4,
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 14,
    color: 'red',
    textAlign: 'center',
  },
})

export default WeatherCard

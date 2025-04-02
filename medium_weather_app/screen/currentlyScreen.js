import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import {
  Text, 
  View,
  ActivityIndicator
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { WeatherIcon } from '../assets/weatherIcon.js';
import { getWeatherDescription } from '../weatherDescription.js';
import { styles } from '../styles/styles.js';

export const CurrentlyScreen = ({ weatherData, loading, error }) => {
	if (loading) {
	  return (
		<View style={styles.screenContainer}>
		  <ActivityIndicator size="large" color="#4A90E2" />
		</View>
	  );
	}
  
	if (error) {
	  return (
		<View style={styles.screenContainer}>
		  <Text style={styles.errorText}>{error}</Text>
		</View>
	  );
	}
  
	return (
	  <View style={styles.screenContainer}>
		<Text style={styles.screenTitle}>Agora</Text>
		{weatherData && (
		  <View style={styles.weatherContainer}>
			<Text style={styles.cityName}>
			  {weatherData.cityName}
			</Text>
			<View style={styles.currentWeather}>
			  <WeatherIcon code={weatherData.current.weather_code} />
			  <Text style={styles.temperature}>
				{Math.round(weatherData.current.temperature_2m)}°C
			  </Text>
			</View>
			<Text style={styles.weatherDescription}>
			  {getWeatherDescription(weatherData.current.weather_code)}
			</Text>
			<View style={styles.weatherDetails}>
			  <View style={styles.detailItem}>
				<MaterialIcons name="water" size={20} color="#4A90E2" />
				<Text>{weatherData.current.relative_humidity_2m}%</Text>
			  </View>
			  <View style={styles.detailItem}>
				<MaterialIcons name="air" size={20} color="#4A90E2" />
				<Text>{weatherData.current.wind_speed_10m} km/h</Text>
			  </View>
			  <View style={styles.detailItem}>
				<MaterialIcons name="speed" size={20} color="#4A90E2" />
				<Text>{weatherData.current.surface_pressure} hPa</Text>
			  </View>
			</View>
		  </View>
		)}
	  </View>
	);
  };
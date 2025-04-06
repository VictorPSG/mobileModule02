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

export const CurrentlyScreen = ({ weatherData, loading, error, State }) => {
	if (loading) {
		return (
			<View style={{ justifyContent: 'center', alignItems: 'center' }}>
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
			{weatherData && (
				<View style={styles.weatherContainer}>
					<View style={styles.currentWeather}>
						{/* <WeatherIcon code={weatherData.current.weather_code} size={64} /> */}
						<Text style={styles.temperature}>
							{Math.round(weatherData.current.temperature_2m)}°C
						</Text>
					</View>
					<View style={styles.weatherDetails}>
						{/* <View style={styles.detailItem}>
							<MaterialIcons name="water" size={20} color="#f3f2ef " fontWeight="500" />
							<Text>{weatherData.current.relative_humidity_2m}%</Text>
						</View> */}
						<View style={styles.detailItem}>
							<MaterialIcons name="air" size={20} color="#f3f2ef" />
							<Text style={{ color: 'rgb(253 233 183)', fontWeight: 'bold' }}>{weatherData.current.wind_speed_10m} km/h</Text>
						</View>
						<View style={styles.detailItem}>
							{/* <MaterialIcons name="speed" size={20} color="#f3f2ef" />
							<Text>{weatherData.current.surface_pressure} hPa</Text> */}
							<WeatherIcon code={weatherData.current.weather_code} size={20} />
							<Text style={{ color: 'rgb(253 233 183)', fontWeight: 'bold', textAlign: 'center' }}>
								{getWeatherDescription(weatherData.current.weather_code)}
							</Text>
						</View>
					</View>
					<View style={{ paddingTop: '16' }}>
						<Text style={styles.cityName}>{State}</Text>
						<Text style={styles.cityName}>
							{weatherData.cityName}
						</Text>
					</View>
				</View>
			)}
		</View>
	);
};
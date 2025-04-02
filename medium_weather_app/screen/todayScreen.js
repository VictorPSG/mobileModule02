import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { 
  Text, 
  View,
  FlatList,
  ActivityIndicator
} from 'react-native';
import { formatTime } from '../App.js';
import {styles} from '../styles/index.js';
import { WeatherIcon } from '../assets/weatherIcon.js';
import { WeeklyScreen } from './weeklyScreen.js';

export const TodayScreen = ({ weatherData, loading, error }) => {
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
		<Text style={styles.screenTitle}>Hoje</Text>
		{weatherData && (
		  <View style={styles.weatherContainer}>
			<Text style={styles.cityName}>
			  {weatherData.cityName}
			</Text>
			<View style={styles.hourlyContainer}>
			  <FlatList
				horizontal
				data={weatherData.hourly.slice(0, 24)}
				keyExtractor={(item, index) => index.toString()}
				renderItem={({ item, index }) => (
				  <View style={styles.hourlyItem}>
					<Text style={styles.hourlyTime}>
					  {new Date(item.time).getHours()}h
					</Text>
					<WeatherIcon code={item.weather_code} />
					<Text style={styles.hourlyTemp}>
					  {Math.round(item.temperature_2m)}°
					</Text>
				  </View>
				)}
				showsHorizontalScrollIndicator={false}
			  />
			</View>
			<View style={styles.todayDetails}>
			  <View style={styles.detailCard}>
				<Text style={styles.detailTitle}>Precipitação</Text>
				<Text>{weatherData.daily.precipitation_sum[0]} mm</Text>
			  </View>
			  <View style={styles.detailCard}>
				<Text style={styles.detailTitle}>Vento Máx</Text>
				<Text>{weatherData.daily.wind_speed_10m_max[0]} km/h</Text>
			  </View>
			  <View style={styles.detailCard}>
				<Text style={styles.detailTitle}>Nascer do Sol</Text>
				<Text>{formatTime(weatherData.daily.sunrise[0])}</Text>
			  </View>
			  <View style={styles.detailCard}>
				<Text style={styles.detailTitle}>Pôr do Sol</Text>
				<Text>{formatTime(weatherData.daily.sunset[0])}</Text>
			  </View>
			</View>
		  </View>
		)}
	  </View>
	);
  };
import {
	Text, 
	View, 
	FlatList,
	ActivityIndicator
  } from 'react-native';
import 'react-native-gesture-handler';
import { WeatherIcon } from "../assets/weatherIcon";
import { getWeatherDescription } from "../weatherDescription";
import { styles } from "../styles";

export const WeeklyScreen = ({ weatherData, loading, error }) => {
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
		<Text style={styles.screenTitle}>Semanal</Text>
		{weatherData && (
		  <FlatList
			data={weatherData.daily.time.map((time, index) => ({
			  time,
			  weather_code: weatherData.daily.weather_code[index],
			  temperature_2m_max: weatherData.daily.temperature_2m_max[index],
			  temperature_2m_min: weatherData.daily.temperature_2m_min[index],
			  precipitation_sum: weatherData.daily.precipitation_sum[index],
			  wind_speed_10m_max: weatherData.daily.wind_speed_10m_max[index],
			}))}
			keyExtractor={(item, index) => index.toString()}
			renderItem={({ item }) => (
			  <View style={styles.forecastItem}>
				<Text style={styles.forecastDate}>
				  {new Date(item.time).toLocaleDateString('pt-BR', { 
					weekday: 'long', 
					day: 'numeric', 
					month: 'short' 
				  })}
				</Text>
				<View style={styles.forecastTempContainer}>
				  <WeatherIcon code={item.weather_code} />
				  <Text style={styles.forecastTemp}>
					{Math.round(item.temperature_2m_max)}° / {Math.round(item.temperature_2m_min)}°
				  </Text>
				</View>
				<Text style={styles.forecastDesc}>
				  {getWeatherDescription(item.weather_code)}
				</Text>
				<View style={styles.forecastDetails}>
				  <Text style={styles.forecastDetail}>🌧️ {item.precipitation_sum}mm</Text>
				  <Text style={styles.forecastDetail}>💨 {item.wind_speed_10m_max}km/h</Text>
				</View>
			  </View>
			)}
			contentContainerStyle={styles.forecastList}
		  />
		)}
	  </View>
	);
  };
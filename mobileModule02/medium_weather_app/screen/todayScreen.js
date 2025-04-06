import 'react-native-gesture-handler';
import React from 'react';
import {
  Text,
  View,
  FlatList,
  ActivityIndicator,
  StyleSheet
} from 'react-native';
import { WeatherIcon } from '../assets/weatherIcon.js';

export const TodayScreen = ({ weatherData, loading, error, State }) => {
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{State}</Text>
      <Text style={styles.title}>{weatherData?.cityName}</Text>

      {weatherData && (
        <FlatList
          data={weatherData.hourly.slice(0, 24)}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.hourItem}>
              <Text style={styles.timeText}>
                {new Date(item.time).getHours()}h
              </Text>

              <View style={styles.weatherInfo}>
                <WeatherIcon code={item.weather_code} size={24} />
                <Text style={styles.tempText}>
                  {Math.round(item.temperature_2m)}°
                </Text>
              </View>

              <Text style={styles.windText}>
                {Math.round(item.wind_speed_10m)} km/h
              </Text>
            </View>
          )}
          ListHeaderComponent={
            <View style={styles.header}>
              <Text style={styles.headerText}>Hora</Text>
              <Text style={styles.headerText}>Temp.</Text>
              <Text style={styles.headerText}>Vento</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    //backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 8,
  },
  headerText: {
    fontWeight: 'bold',
    width: '33%',
    textAlign: 'center',
  },
  hourItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  timeText: {
    width: '33%',
    textAlign: 'center',
  },
  weatherInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '33%',
  },
  tempText: {
    marginLeft: 8,
  },
  windText: {
    width: '33%',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});
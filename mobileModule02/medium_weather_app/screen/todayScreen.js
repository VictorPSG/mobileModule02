import 'react-native-gesture-handler';
import React from 'react';
import {
  Text,
  View,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { WeatherIcon } from '../assets/weatherIcon.js';
import { MaterialIcons } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width;

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

  if (!weatherData || !weatherData.hourly) {
    return (
      <View style={styles.container}>
        <Text style={{ color: '#fff' }}>Carregando previsão do tempo...</Text>
      </View>
    );
  }

  const hourlyData = weatherData.hourly.slice(0, 12);
  const temperatures = hourlyData.map(item => item.temperature_2m);
  const hours = hourlyData.map(item => `${new Date(item.time).getHours()}h`);

  return (
    <View style={[styles.container, { justifyContent: 'flex-start' }]}>
      <Text style={styles.title}>
        {State}
        {'\n'}
        {weatherData?.cityName}
      </Text>

      <LineChart
        data={{
          labels: hours.filter((_, i) => i % 2 === 0),
          datasets: [{ data: temperatures }],
          legend: ["Temperatura em °C"],
        }}
        width={screenWidth - 32}
        height={330}
        yAxisSuffix="°"
        chartConfig={{
          backgroundColor: '#1F2C2F',
          backgroundGradientFrom: '#1F2C2F',
          backgroundGradientTo: '#1F2C2F',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(245, 210, 124, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          propsForDots: {
            r: '5',
            strokeWidth: '2',
            stroke: '#F5D27C',
          },
        }}
        bezier
        style={{
          borderRadius: 16,
        }}
      />

      <FlatList
        horizontal
        data={weatherData.hourly.slice(0, 24)}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.hourItem}>
            <View style={styles.weatherInfo}>
              <Text style={styles.timeText}>
                {new Date(item.time).getHours()}h
              </Text>
              <WeatherIcon code={item.weather_code} size={32} />
              <Text style={styles.tempText}>
                {Math.round(item.temperature_2m)}°
              </Text>
              <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}>
                <Text style={styles.windText}>
                  {Math.round(item.wind_speed_10m)} km/h
                </Text>
                <Text>
                  <MaterialIcons name={"air"} size={12} color={'rgb(253 233 183)'} />
                </Text>
              </View>
            </View>
          </View>
        )
        }
      />
    </View >
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#f3f2ef',
    textAlign: 'center',
  },
  hourItem: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingBottom: 70,
  },
  weatherInfo: {
    width: 100,
    height: 112,
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.25)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeText: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 4,
    fontWeight: '500'
  },
  tempText: {
    color: '#f3f2ef',
    fontWeight: 'bold',
  },
  windText: {
    textAlign: 'center',
    color: 'rgb(253 233 183)',
    fontWeight: '600',
    fontSize: 12,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

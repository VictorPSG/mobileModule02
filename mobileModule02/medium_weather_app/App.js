import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StatusBar,
  Keyboard,
  View,
  ImageBackground,
  Platform
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { styles } from './styles/index.js';
import { TodayScreen } from './screen/todayScreen.js';
import { CurrentlyScreen } from './screen/currentlyScreen.js';
import { WeeklyScreen } from './screen/weeklyScreen.js';
import { AppBar } from './appBar.js';
import { ScreenContainer } from 'react-native-screens';
import { enableScreens } from 'react-native-screens';
enableScreens();

import {
  useNavigation,
  createStaticNavigation,
  DefaultTheme,
} from '@react-navigation/native';

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'rgba(255, 255, 255, 0)',
    primary: 'rgb(255, 45, 85)',
  },
};


const GEOCODING_API_KEY = 'e33bb060431feb9d4189d9ba96987950';
const OPEN_METEO_URL = 'https://api.open-meteo.com/v1/forecast';

const Tab = createBottomTabNavigator();

export const formatTime = (timeString) => {
  const time = new Date(timeString);
  return time.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
};

const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [State, setState] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [debounceTimeout, setDebounceTimeout] = useState(null);

  useEffect(() => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    if (searchQuery.length > 2) {
      setLoading(true);
      const timer = setTimeout(() => {
        fetchCitySuggestions(searchQuery);
      }, 500);
      setDebounceTimeout(timer);
    } else {
      setLoading(false);
      setSuggestions([]);
      setShowSuggestions(false);
    }

    return () => {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }
    };
  }, [searchQuery]);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const fetchCitySuggestions = async (query) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${GEOCODING_API_KEY}`
      );

      if (!response.ok) {
        throw new Error(`Erro HTTP! status: ${response.status}`);
      }

      const data = await response.json();
      if (!Array.isArray(data)) {
        throw new Error('Formato de dados inválido da API');
      }

      const filteredData = data.filter(item =>
        item.lat && item.lon
      );
      filteredData.sort((a, b) => {
        if (a.country === 'BR' && b.country !== 'BR') return -1;
        if (a.country !== 'BR' && b.country === 'BR') return 1;
        return 0;
      });
      setSuggestions(filteredData.slice(0, 5));
      setError(null);
    } catch (err) {
      console.error('Erro ao buscar sugestões de cidade:', err);
      setError('Não foi possível buscar localizações');
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherData = async (lat, lon, cityName = 'Local atual', state) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${OPEN_METEO_URL}?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,surface_pressure,wind_speed_10m&hourly=temperature_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,wind_speed_10m_max&timezone=auto&forecast_days=7`
      );

      if (!response.ok) {
        throw new Error(`Erro ao buscar dados: ${response.status}`);
      }

      const data = await response.json();
      const formattedData = {
        cityName,
        current: {
          temperature_2m: data.current.temperature_2m,
          weather_code: data.current.weather_code,
          relative_humidity_2m: data.current.relative_humidity_2m,
          surface_pressure: data.current.surface_pressure,
          wind_speed_10m: data.current.wind_speed_10m,
        },
        hourly: data.hourly.time.map((time, index) => ({
          time,
          temperature_2m: data.hourly.temperature_2m[index],
          weather_code: data.hourly.weather_code[index],
          wind_speed_10m: data.hourly.wind_speed_10m[index],
        })),
        daily: {
          time: data.daily.time,
          weather_code: data.daily.weather_code,
          temperature_2m_max: data.daily.temperature_2m_max,
          temperature_2m_min: data.daily.temperature_2m_min,
          sunrise: data.daily.sunrise,
          sunset: data.daily.sunset,
          precipitation_sum: data.daily.precipitation_sum,
          wind_speed_10m_max: data.daily.wind_speed_10m_max,
        }
      };
      if (state) {
        setState(state);
      }
      setWeatherData(formattedData);
    } catch (err) {
      console.error('Erro ao buscar dados do tempo:', err);
      setError('Falha ao carregar dados meteorológicos');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSuggestion = (city) => {
    const displayName = city.local_names?.pt || city.name;
    const displayText = `${displayName}, ${city.country}`;
    setSearchQuery(displayText);
    setShowSuggestions(false);
    Keyboard.dismiss();

    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
      setDebounceTimeout(null);
    }
    fetchWeatherData(city.lat, city.lon, displayText, city.state);
  };

  const getCurrentLocation = async () => {
    setLoading(true);
    setError(null);

    try {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        throw new Error('Permissão de localização negada');
      }
      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      const cityName = await getCityName(latitude, longitude);
      await fetchWeatherData(
        latitude,
        longitude,
        cityName || 'Minha localização'

      );
    } catch (err) {
      setError('Erro ao obter localização\n' + err);
    } finally {
      setLoading(false);
    }
  };

  // Função auxiliar para obter o nome da cidade a partir das coordenadas
  const getCityName = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${GEOCODING_API_KEY}`
      );

      if (!response.ok) {
        throw new Error('Erro ao buscar nome da cidade');
      }

      const data = await response.json();
      setState(data[0].state);
      const name_and_country = data[0].local_names.pt + ", " + data[0].country;
      if (Array.isArray(data) && data.length > 0) {
        return name_and_country || data[0].name;
      }

      return null;
    } catch (error) {
      console.error('Erro no reverse geocoding:', error);
      return null;
    }
  };

  return (
    // <ScreenContainer style={{ flex: 1 }}>
    <View style={{ flex: 1 }}>
      <StatusBar
        barStyle="white-content"
        translucent={true}
        backgroundColor="transparent"
      />
      <ImageBackground
        source={require('./assets/ChatGPT Image Apr 4, 2025, 02_46_35 AM.png')}
        style={{ flex: 1, height: '100%', width: '100%' }}
        resizeMode="cover"
      >
        <SafeAreaView style={{
          flex: 1,
          backgroundColor: 'transparent',
          paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
        }}>
          <AppBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onLocationPress={getCurrentLocation}
            suggestions={suggestions}
            onSelectSuggestion={handleSelectSuggestion}
            showSuggestions={showSuggestions}
            setShowSuggestions={setShowSuggestions}
            loading={loading}
          />
          <View style={{ flex: 1 }}>
            <NavigationContainer theme={MyTheme}>
              <Tab.Navigator
                // detachInactiveScreens={Platform.OS !== 'web'}
                screenOptions={({ route }) => ({
                  tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Currently') {
                      iconName = 'schedule';
                    } else if (route.name === 'Today') {
                      iconName = 'today';
                    } else if (route.name === 'Weekly') {
                      iconName = 'date-range';
                    }

                    return <MaterialIcons name={iconName} size={size} color={color} />;
                  },
                  tabBarActiveTintColor: '#F5D27C',
                  tabBarInactiveTintColor: 'rgba(255,255,255,0.6)',
                  headerShown: false,
                  tabBarStyle: {
                    backgroundColor: 'rgba(0, 0, 0, 0.25)',
                    position: 'absolute',
                    borderTopWidth: 0,
                    borderRadius: 30,
                    marginHorizontal: 20,
                    marginBottom: 20,
                    height: 60,
                    paddingBottom: 5,
                    elevation: 0,
                  },
                  tabBarLabelStyle: {
                    fontSize: 14,
                    fontWeight: '500',
                  },
                })}
              >
                <Tab.Screen name="Currently">
                  {() => (
                    <View style={{ flex: 1, backgroundColor: 'transparent' }}>
                      <CurrentlyScreen
                        weatherData={weatherData}
                        loading={loading}
                        error={error}
                        State={State}
                      />
                    </View>
                  )}
                </Tab.Screen>
                <Tab.Screen name="Today">
                  {() => (
                    <View style={{ flex: 1, backgroundColor: 'transparent' }}>
                      <TodayScreen
                        weatherData={weatherData}
                        loading={loading}
                        error={error}
                        State={State}
                      />
                    </View>
                  )}
                </Tab.Screen>
                <Tab.Screen name="Weekly">
                  {() => (
                    <View style={{ flex: 1, backgroundColor: 'transparent' }}>
                      <WeeklyScreen
                        weatherData={weatherData}
                        loading={loading}
                        error={error}
                        State={State}
                      />
                    </View>
                  )}
                </Tab.Screen>
              </Tab.Navigator>
            </NavigationContainer>
          </View>
        </SafeAreaView>
      </ImageBackground>
    </View>
    //</ScreenContainer >
  );
};

export default App;
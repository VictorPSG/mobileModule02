import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { 
  SafeAreaView, 
  StatusBar, 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity,
  Alert,
  FlatList,
  Keyboard,
  ActivityIndicator
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';

const GEOCODING_API_KEY = 'e33bb060431feb9d4189d9ba96987950';
const OPEN_METEO_URL = 'https://api.open-meteo.com/v1/forecast';

const AppBar = ({ 
  searchQuery, 
  setSearchQuery, 
  onLocationPress,
  suggestions,
  onSelectSuggestion,
  showSuggestions,
  setShowSuggestions,
  loading
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.appBar}>
      <View style={[
        styles.searchContainer, 
        isFocused && styles.searchContainerFocused
      ]}>
        <MaterialIcons name="search" size={24} color={isFocused ? '#4A90E2' : 'gray'} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar localização..."
          placeholderTextColor="gray"
          value={searchQuery}
          onChangeText={(text) => {
            setSearchQuery(text);
            setShowSuggestions(text.length > 2);
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false);
            setTimeout(() => setShowSuggestions(false), 200);
          }}
        />
        {loading ? (
          <ActivityIndicator size="small" color="#4A90E2" />
        ) : searchQuery.length > 0 ? (
          <TouchableOpacity onPress={() => {
            setSearchQuery('');
            setShowSuggestions(false);
          }}>
            <MaterialIcons name="close" size={20} color="gray" />
          </TouchableOpacity>
        ) : null}
      </View>
      <TouchableOpacity 
        style={styles.locationButton} 
        onPress={onLocationPress}
        disabled={loading}
      >
        <MaterialIcons 
          name="my-location" 
          size={24} 
          color={loading ? 'gray' : 'black'} 
        />
      </TouchableOpacity>

      {showSuggestions && suggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          <FlatList
            data={suggestions}
            keyExtractor={(item, index) => `${item.lat}-${item.lon}-${index}`}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={styles.suggestionItem}
                onPress={() => {
                  onSelectSuggestion(item);
                  Keyboard.dismiss();
                }}
              >
                <Text style={styles.suggestionText}>
                  {item.local_names?.pt || item.name}, {item.state ? `${item.state}, ` : ''}{item.country}
                </Text>
              </TouchableOpacity>
            )}
            keyboardShouldPersistTaps="handled"
          />
        </View>
      )}
    </View>
  );
};

const WeatherIcon = ({ code }) => {
  const iconMap = {
    0: '☀️',  // Clear sky
    1: '🌤️',  // Mainly clear
    2: '⛅',  // Partly cloudy
    3: '☁️',  // Overcast
    45: '🌫️', // Fog
    48: '🌫️', // Depositing rime fog
    51: '🌧️', // Drizzle: Light
    53: '🌧️', // Drizzle: Moderate
    55: '🌧️', // Drizzle: Dense
    56: '🌧️', // Freezing Drizzle: Light
    57: '🌧️', // Freezing Drizzle: Dense
    61: '🌧️', // Rain: Slight
    63: '🌧️', // Rain: Moderate
    65: '🌧️', // Rain: Heavy
    66: '🌧️', // Freezing Rain: Light
    67: '🌧️', // Freezing Rain: Heavy
    71: '❄️', // Snow fall: Slight
    73: '❄️', // Snow fall: Moderate
    75: '❄️', // Snow fall: Heavy
    77: '❄️', // Snow grains
    80: '🌧️', // Rain showers: Slight
    81: '🌧️', // Rain showers: Moderate
    82: '🌧️', // Rain showers: Violent
    85: '❄️', // Snow showers: Slight
    86: '❄️', // Snow showers: Heavy
    95: '⛈️', // Thunderstorm: Slight or moderate
    96: '⛈️', // Thunderstorm with hail: Slight
    99: '⛈️', // Thunderstorm with hail: Heavy
  };

  return <Text style={styles.weatherIcon}>{iconMap[code] || '🌡️'}</Text>;
};

const CurrentlyScreen = ({ weatherData, loading, error }) => {
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

const TodayScreen = ({ weatherData, loading, error }) => {
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

const WeeklyScreen = ({ weatherData, loading, error }) => {
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

const Tab = createBottomTabNavigator();

// Funções auxiliares
const getWeatherDescription = (code) => {
  const descriptions = {
    0: 'Céu limpo',
    1: 'Principalmente limpo',
    2: 'Parcialmente nublado',
    3: 'Nublado',
    45: 'Nevoeiro',
    48: 'Nevoeiro com geada',
    51: 'Garoa leve',
    53: 'Garoa moderada',
    55: 'Garoa intensa',
    56: 'Garoa congelante leve',
    57: 'Garoa congelante intensa',
    61: 'Chuva leve',
    63: 'Chuva moderada',
    65: 'Chuva forte',
    66: 'Chuva congelante leve',
    67: 'Chuva congelante forte',
    71: 'Queda de neve leve',
    73: 'Queda de neve moderada',
    75: 'Queda de neve forte',
    77: 'Grãos de neve',
    80: 'Pancadas de chuva leves',
    81: 'Pancadas de chuva moderadas',
    82: 'Pancadas de chuva violentas',
    85: 'Pancadas de neve leves',
    86: 'Pancadas de neve pesadas',
    95: 'Trovoada leve ou moderada',
    96: 'Trovoada com granizo leve',
    99: 'Trovoada com granizo pesado',
  };
  return descriptions[code] || 'Condições desconhecidas';
};

const formatTime = (timeString) => {
  const time = new Date(timeString);
  return time.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
};

const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
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
      setSuggestions([]);
      setShowSuggestions(false);
    }

    return () => {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }
    };
  }, [searchQuery]);

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
  
      // Filtro simplificado - verificamos apenas se tem coordenadas
      const filteredData = data.filter(item => 
        item.lat && item.lon
      );
  
      // Ordenação por relevância (Brasil primeiro)
      filteredData.sort((a, b) => {
        if (a.country === 'BR' && b.country !== 'BR') return -1;
        if (a.country !== 'BR' && b.country === 'BR') return 1;
        return 0;
      });
  
      console.log('Dados filtrados:', filteredData);
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

  const fetchWeatherData = async (lat, lon, cityName = 'Local atual') => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `${OPEN_METEO_URL}?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,surface_pressure,wind_speed_10m&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,wind_speed_10m_max&timezone=auto&forecast_days=7`
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
    fetchWeatherData(city.lat, city.lon, displayName);
  };

  const getCurrentLocation = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // 1. Solicitar permissão de localização
      let { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        throw new Error('Permissão de localização negada');
      }
  
      // 2. Obter coordenadas atuais
      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
  
      // 3. Obter nome da cidade usando reverse geocoding
      const cityName = await getCityName(latitude, longitude);
      
      // 4. Buscar dados meteorológicos com o nome da cidade
      await fetchWeatherData(
        latitude, 
        longitude,
        cityName || 'Minha localização'
      );
    } catch (err) {
      console.error('Erro ao obter localização:', err);
      setError('Não foi possível obter sua localização');
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
      
      if (Array.isArray(data) && data.length > 0) {
        // Retorna o nome local em português se disponível, senão o nome padrão
        return data[0].local_names?.pt || data[0].name;
      }
      
      return null;
    } catch (error) {
      console.error('Erro no reverse geocoding:', error);
      return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
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
      <NavigationContainer>
        <Tab.Navigator
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
            tabBarActiveTintColor: '#4A90E2',
            tabBarInactiveTintColor: 'gray',
            headerShown: false,
            tabBarStyle: {
              backgroundColor: 'white',
              paddingBottom: 5,
              height: 60,
            },
          })}
        >
          <Tab.Screen name="Currently">
            {() => <CurrentlyScreen weatherData={weatherData} loading={loading} error={error} />}
          </Tab.Screen>
          <Tab.Screen name="Today">
            {() => <TodayScreen weatherData={weatherData} loading={loading} error={error} />}
          </Tab.Screen>
          <Tab.Screen name="Weekly">
            {() => <WeeklyScreen weatherData={weatherData} loading={loading} error={error} />}
          </Tab.Screen>
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  appBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    elevation: 4,
    position: 'relative',
    zIndex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flex: 1,
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  searchContainerFocused: {
    borderColor: '#4A90E2',
    backgroundColor: 'white',
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    color: 'black',
    paddingVertical: 0,
  },
  locationButton: {
    padding: 4,
  },
  loadingIndicator: {
    marginLeft: 8,
  },
  screenContainer: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  weatherContainer: {
    width: '100%',
  },
  cityName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  currentWeather: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  weatherIcon: {
    fontSize: 60,
    marginRight: 10,
  },
  temperature: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  weatherDescription: {
    fontSize: 18,
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
    textTransform: 'capitalize',
  },
  weatherDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  detailItem: {
    alignItems: 'center',
  },
  hourlyContainer: {
    marginVertical: 20,
  },
  hourlyItem: {
    alignItems: 'center',
    marginHorizontal: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
    width: 80,
  },
  hourlyTime: {
    fontWeight: 'bold',
  },
  hourlyTemp: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  todayDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  detailCard: {
    width: '48%',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
  },
  detailTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#4A90E2',
  },
  suggestionsContainer: {
    position: 'absolute',
    top: 70,
    left: 16,
    right: 72,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 4,
    maxHeight: 200,
    zIndex: 1000,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  suggestionText: {
    color: 'black',
  },
  forecastList: {
    paddingBottom: 20,
  },
  forecastItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  forecastDate: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
  forecastTempContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  forecastTemp: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  forecastDesc: {
    color: '#666',
    marginBottom: 8,
    textTransform: 'capitalize',
  },
  forecastDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  forecastDetail: {
    fontSize: 14,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default App;
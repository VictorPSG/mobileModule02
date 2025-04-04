// import React, { useState, useEffect } from 'react';

// const GEOCODING_API_KEY = 'e33bb060431feb9d4189d9ba96987950';
// const OPEN_METEO_URL = 'https://api.open-meteo.com/v1/forecast';

// export const fetchCitySuggestions = async (query, setLoading, setSuggestions, setError) => {
//     try {
//       const response = await fetch(
//         `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${GEOCODING_API_KEY}`
//       );
      
//       if (!response.ok) {
//         throw new Error(`Erro HTTP! status: ${response.status}`);
//       }
  
//       const data = await response.json();
      
//       if (!Array.isArray(data)) {
//         throw new Error('Formato de dados inválido da API');
//       }
  
//       // Filtro simplificado - verificamos apenas se tem coordenadas
//       const filteredData = data.filter(item => 
//         item.lat && item.lon
//       );
  
//       // Ordenação por relevância (Brasil primeiro)
//       filteredData.sort((a, b) => {
//         if (a.country === 'BR' && b.country !== 'BR') return -1;
//         if (a.country !== 'BR' && b.country === 'BR') return 1;
//         return 0;
//       });
  
//       setSuggestions(filteredData.slice(0, 5));
//       setError(null);
//     } catch (err) {
//       console.error('Erro ao buscar sugestões de cidade:', err);
//       setError('Não foi possível buscar localizações');
//       setSuggestions([]);
//     } finally {
//       setLoading(false);
//     }
//   };

// export const fetchWeatherData = async (lat, lon, cityName = 'Local atual', setLoading, setError,setWeatherData) => {
//     setLoading(true);
//     setError(null);
    
//     try {
//       const response = await fetch(
//         `${OPEN_METEO_URL}?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,surface_pressure,wind_speed_10m&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,wind_speed_10m_max&timezone=auto&forecast_days=7`
//       );
      
//       if (!response.ok) {
//         throw new Error(`Erro ao buscar dados: ${response.status}`);
//       }

//       const data = await response.json();
//       const formattedData = {
//         cityName,
//         current: {
//           temperature_2m: data.current.temperature_2m,
//           weather_code: data.current.weather_code,
//           relative_humidity_2m: data.current.relative_humidity_2m,
//           surface_pressure: data.current.surface_pressure,
//           wind_speed_10m: data.current.wind_speed_10m,
//         },
//         hourly: data.hourly.time.map((time, index) => ({
//           time,
//           temperature_2m: data.hourly.temperature_2m[index],
//           weather_code: data.hourly.weather_code[index],
//         })),
//         daily: {
//           time: data.daily.time,
//           weather_code: data.daily.weather_code,
//           temperature_2m_max: data.daily.temperature_2m_max,
//           temperature_2m_min: data.daily.temperature_2m_min,
//           sunrise: data.daily.sunrise,
//           sunset: data.daily.sunset,
//           precipitation_sum: data.daily.precipitation_sum,
//           wind_speed_10m_max: data.daily.wind_speed_10m_max,
//         }
//       };

//       setWeatherData(formattedData);
//     } catch (err) {
//       console.error('Erro ao buscar dados do tempo:', err);
//       setError('Falha ao carregar dados meteorológicos');
//     } finally {
//       setLoading(false);
//     }
//   };
import {
	Text,
	View,
	FlatList,
	ActivityIndicator,
	StyleSheet,
	Dimensions,
} from 'react-native';
import 'react-native-gesture-handler';
import { LineChart } from 'react-native-chart-kit';
import { WeatherIcon } from "../assets/weatherIcon";
import { styles as sharedStyles } from "../styles";
import { MaterialIcons } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width;

export const WeeklyScreen = ({ weatherData, loading, error, State }) => {
	if (loading) {
		return (
			<View style={sharedStyles.screenContainer}>
				<ActivityIndicator size="large" color="#4A90E2" />
			</View>
		);
	}

	if (error) {
		return (
			<View style={sharedStyles.screenContainer}>
				<Text style={sharedStyles.errorText}>{error}</Text>
			</View>
		);
	}

	const dailyData = weatherData.daily.time.map((time, index) => ({
		time,
		weather_code: weatherData.daily.weather_code[index],
		temperature_2m_max: weatherData.daily.temperature_2m_max[index],
		temperature_2m_min: weatherData.daily.temperature_2m_min[index],
		precipitation_sum: weatherData.daily.precipitation_sum[index],
		wind_speed_10m_max: weatherData.daily.wind_speed_10m_max[index],
	}));

	const labels = dailyData.map(item =>
		new Date(item.time).toLocaleDateString('pt-BR', {
			weekday: 'short',
		})
	);

	const maxTemps = dailyData.map(item => item.temperature_2m_max);
	const minTemps = dailyData.map(item => item.temperature_2m_min);

	return (
		<View style={{ flex: 1, padding: 16 }}>
			<Text style={sharedStyles.screenTitle}>{State}{'\n'}{weatherData?.cityName}</Text>

			{/* GRÁFICO */}
			<LineChart
				data={{
					labels,
					datasets: [
						{ data: maxTemps, color: () => '#F5D27C' },
						{ data: minTemps, color: () => '#72A1E5' },
					],
					legend: ['Máx °C', 'Mín °C'],
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
					labelColor: () => '#D0CFCB',
				}}
				bezier
				style={{ borderRadius: 16 }}
			/>

			{/* LISTA DE PREVISÃO DA SEMANA */}
			<FlatList
				horizontal
				data={dailyData}
				keyExtractor={(item, index) => index.toString()}
				renderItem={({ item }) => (
					<View style={{ paddingHorizontal: 4, justifyContent: 'flex-end', marginBottom: '60' }}>
						<View style={localStyles.forecastItem}>
							<Text style={localStyles.forecastDate}>
								{new Date(item.time).toLocaleDateString('pt-BR', {
									day: '2-digit',
									month: '2-digit',
								})}
							</Text>
							<View style={localStyles.forecastTempContainer}>
								<WeatherIcon code={item.weather_code} size={32} />
								<Text style={localStyles.forecastTemp}>
									{Math.round(item.temperature_2m_max)}° / {Math.round(item.temperature_2m_min)}°
								</Text>
								<View style={{ flexDirection: 'row', alignItems: 'center' }}>
									<Text style={localStyles.forecastDetail}>{item.wind_speed_10m_max}km/h</Text>
									<MaterialIcons name={"air"} size={12} color={'rgb(253 233 183)'} />
								</View>
							</View>
						</View>
					</View>
				)
				}
				contentContainerStyle={localStyles.forecastList}
				showsHorizontalScrollIndicator={false}
			/>
		</View >
	);
};

const localStyles = StyleSheet.create({
	forecastItem: {
		width: 100,
		height: 112,
		borderRadius: 24,
		backgroundColor: 'rgba(0, 0, 0, 0.25)',
		borderWidth: 1,
		borderColor: 'rgba(255,255,255,0.15)',
		padding: 8,
	},
	forecastDate: {
		color: '#ccc',
		fontSize: 14,
		fontWeight: '600',
		marginBottom: 6,
		textAlign: 'center',
	},
	forecastTempContainer: {
		alignItems: 'center',
		justifyContent: 'flex-end',
		marginBottom: 6,
	},
	forecastTemp: {
		color: '#f3f2ef',
		fontWeight: 'bold',
	},
	forecastDesc: {
		fontSize: 12,
		color: '#ccc',
		marginBottom: 6,
		textAlign: 'center',
	},
	forecastDetails: {
		alignItems: 'center',
	},
	forecastDetail: {
		color: 'rgb(253 233 183)',
		fontWeight: '600',
		fontSize: 12,
	},
	forecastList: {
		paddingVertical: 10,
	},
});

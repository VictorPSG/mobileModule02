import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	container: {
	  flex: 1,
	  backgroundColor: '#f5f5f5',
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
	  width: 150,
	},
	hourlyTime: {
	  fontWeight: 'bold',
	},
	hourlyTemp: {
	  fontSize: 16,
	  fontWeight: 'bold',
	  justifyContent: 'space-around',
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
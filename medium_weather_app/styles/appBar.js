import { StyleSheet } from 'react-native';

export const appBarStyles = StyleSheet.create({
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
  }
})
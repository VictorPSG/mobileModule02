import { StyleSheet } from 'react-native';

export const appBarStyles = StyleSheet.create({
	appBar: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: 16,
		backgroundColor: 'rgba(255,255,255,0)',
		elevation: 4,
		position: 'relative',
		zIndex: 1,
	},
	searchContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		borderRadius: 20,
		paddingHorizontal: 12,
		paddingVertical: 8,
		flex: 1,
		marginRight: 16,
		borderWidth: 1,
		borderColor: '#F3F2EF',
	},
	searchContainerFocused: {
		borderColor: '#4A90E2',
	},
	searchInput: {
		flex: 1,
		marginLeft: 8,
		color: 'white',
		paddingVertical: 0,
	},
	locationButton: {
		padding: 4,
	},
	loadingIndicator: {
		marginLeft: 8,
	}
})
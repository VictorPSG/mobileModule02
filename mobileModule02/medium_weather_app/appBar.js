import {
	Text,
	View,
	TextInput,
	TouchableOpacity,
	FlatList,
	Keyboard,
	ActivityIndicator
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { appBarStyles, styles } from './styles';
import { MaterialIcons } from '@expo/vector-icons';

export const AppBar = ({
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
		<View style={appBarStyles.appBar}>
			<View style={[
				appBarStyles.searchContainer,
				isFocused && appBarStyles.searchContainerFocused
			]}>
				<MaterialIcons name="search" size={24} color={isFocused ? '#4A90E2' : 'gray'} />
				<TextInput
					style={appBarStyles.searchInput}
					placeholder="Buscar localização..."
					placeholderTextColor="rgb(253 233 183)"
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
					onSubmitEditing={() => { }}
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
				style={appBarStyles.locationButton}
				onPress={onLocationPress}
				disabled={loading}
			>
				<MaterialIcons
					name="share-location"
					size={24}
					color={'rgb(253 233 183)'}
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

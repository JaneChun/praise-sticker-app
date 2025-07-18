import { FontAwesome6, MaterialCommunityIcons } from '@expo/vector-icons';
import { FC } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../constants/colors';
import { useUIStore } from '../store';

export type ViewMode = 'card' | 'grid';

const ViewToggle: FC = () => {
	const { currentView, setCurrentView } = useUIStore();

	return (
		<View style={styles.viewToggle}>
			<TouchableOpacity
				style={[
					styles.toggleBtn,
					currentView === 'card' && styles.toggleBtnActive,
				]}
				onPress={() => setCurrentView('card')}
			>
				<Text style={styles.toggleIcon}>
					<FontAwesome6 name='fire' size={16} color={COLORS.text.light} />
				</Text>
			</TouchableOpacity>
			<TouchableOpacity
				style={[
					styles.toggleBtn,
					currentView === 'grid' && styles.toggleBtnActive,
				]}
				onPress={() => setCurrentView('grid')}
			>
				<Text style={styles.toggleIcon}>
					<MaterialCommunityIcons
						name='view-grid'
						size={16}
						color={COLORS.text.light}
					/>
				</Text>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	viewToggle: {
		flexDirection: 'row',
		backgroundColor: 'rgba(255, 255, 255, 0.2)',
		borderRadius: 20,
		width: 80,
		justifyContent: 'space-between',
		padding: 4,
	},
	toggleBtn: {
		width: 32,
		height: 32,
		borderRadius: 16,
		alignItems: 'center',
		justifyContent: 'center',
	},
	toggleBtnActive: {
		backgroundColor: 'rgba(255, 255, 255, 0.9)',
	},
	toggleIcon: {
		color: 'rgba(255, 255, 255, 0.7)',
	},
});

export default ViewToggle;

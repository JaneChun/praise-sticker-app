import { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { COLORS } from '../constants/colors';
import CalendarPage from '../pages/CalendarPage';

const CalendarScreen: FC = () => {
	return (
		<View style={styles.container}>
			<CalendarPage />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: COLORS.background.primary,
	},
});

export default CalendarScreen;

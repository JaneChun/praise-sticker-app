import { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { COLORS } from '../constants/colors';
import DayDetailModal from '../modals/DayDetailModal';
import CalendarPage from '../pages/CalendarPage';
import { useUIStore } from '../store';

const CalendarScreen: FC = () => {
	const { dayDetailVisible, setDayDetailVisible, selectedDay, setSelectedDay } =
		useUIStore();

	const showDayDetail = (day: number): void => {
		setSelectedDay(day);
		setDayDetailVisible(true);
	};

	return (
		<View style={styles.container}>
			<CalendarPage showDayDetail={showDayDetail} />

			<DayDetailModal
				visible={dayDetailVisible}
				setVisible={setDayDetailVisible}
				selectedDay={selectedDay}
			/>
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

import { useCalendar } from '@/hooks/useCalendar';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { FC, useCallback, useState } from 'react';
import { ColorValue, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../constants/colors';
import DayDetailModal from '../modals/DayDetailModal';
import { useUIStore } from '../store/useUIStore';

const CalendarPage: FC = () => {
	const { weeklyStickerCnt, streakCnt, markedDates, refresh } = useCalendar();
	const setDayDetailVisible = useUIStore((state) => state.setDayDetailVisible);

	const insets = useSafeAreaInsets();
	const [selectedDate, setSelectedDate] = useState<string | null>(null);

	useFocusEffect(
		useCallback(() => {
			refresh();
		}, [refresh]),
	);

	const onDayPress = (day: any): void => {
		const dateString = day.dateString; // 'YYYY-MM-DD'
		const hasStickers = markedDates[dateString];

		if (hasStickers) {
			setSelectedDate(day.dateString); // 'YYYY-MM-DD'
			setDayDetailVisible(true);
		}
	};

	return (
		<ScrollView style={styles.container}>
			<LinearGradient
				colors={COLORS.gradients.calendar as [ColorValue, ColorValue]}
				style={[styles.header, { paddingTop: insets.top + 20 }]}
				start={{ x: 0, y: 0.3 }}
			>
				<Text style={styles.headerTitle}>칭찬 기록</Text>
				<Text style={styles.headerSubtitle}>매일매일 쌓인 나의 성장</Text>
			</LinearGradient>

			<View style={styles.statsSection}>
				<View style={styles.statsGrid}>
					<View style={styles.statItem}>
						<Text style={styles.statNumber}>{weeklyStickerCnt}</Text>
						<Text style={styles.statLabel}>{'이번주 모은\n스티커'}</Text>
					</View>

					<View style={styles.statItem}>
						<Text style={styles.statNumber}>{streakCnt}</Text>
						<Text style={styles.statLabel}>연속 일수</Text>
					</View>
				</View>
			</View>

			<View style={styles.calendarContainer}>
				<Calendar
					markingType='period'
					markedDates={markedDates}
					onDayPress={onDayPress}
					theme={{
						backgroundColor: COLORS.background.primary,
						calendarBackground: COLORS.background.primary,
						textSectionTitleColor: COLORS.text.secondary,
						selectedDayBackgroundColor: COLORS.secondary,
						selectedDayTextColor: COLORS.text.white,
						todayTextColor: COLORS.text.white,
						todayBackgroundColor: COLORS.primary,
						dayTextColor: COLORS.text.primary,
						textDisabledColor: COLORS.text.disabled,
						dotColor: COLORS.tertiary,
						selectedDotColor: COLORS.text.white,
						arrowColor: COLORS.secondary,
						monthTextColor: COLORS.text.primary,
						indicatorColor: COLORS.secondary,
						textDayFontWeight: '500',
						textMonthFontWeight: '600',
						textDayHeaderFontWeight: '600',
						textDayFontSize: 16,
						textMonthFontSize: 18,
						textDayHeaderFontSize: 12,
					}}
					style={styles.calendar}
				/>
			</View>

			{selectedDate && (
				<DayDetailModal selectedDate={selectedDate} onClose={() => setSelectedDate(null)} />
			)}
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: COLORS.background.primary,
	},
	header: {
		padding: 20,
		paddingTop: 40,
	},
	headerTitle: {
		fontSize: 24,
		fontWeight: '700',
		color: COLORS.text.white,
		marginBottom: 8,
	},
	headerSubtitle: {
		fontSize: 14,
		color: COLORS.text.white,
		opacity: 0.9,
	},
	statsSection: {
		margin: 16,
		padding: 16,
		backgroundColor: COLORS.background.primary,
		borderRadius: 16,
		elevation: 4,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 8,
	},
	statsGrid: {
		flexDirection: 'row',
		justifyContent: 'space-around',
	},
	statItem: {
		alignItems: 'center',
		padding: 16,
		backgroundColor: COLORS.background.secondary,
		borderRadius: 12,
		flex: 1,
		marginHorizontal: 8,
	},
	statNumber: {
		fontSize: 32,
		fontWeight: '700',
		color: COLORS.primary,
		marginBottom: 4,
	},
	statLabel: {
		fontSize: 12,
		color: COLORS.text.secondary,
		fontWeight: '500',
		textAlign: 'center',
	},
	calendarContainer: {
		padding: 20,
	},
	calendar: {
		borderRadius: 16,
		padding: 10,
		backgroundColor: COLORS.background.secondary,
		elevation: 2,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
	},
});

export default CalendarPage;

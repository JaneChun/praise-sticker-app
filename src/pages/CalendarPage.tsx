import { LinearGradient } from 'expo-linear-gradient';
import { FC, useEffect, useMemo } from 'react';
import { ColorValue, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../constants/colors';
import { useStickerDatabase } from '../hooks/useStickers';
import { CalendarPageProps } from '../types';

const CalendarPage: FC<CalendarPageProps> = ({ showDayDetail }) => {
	const insets = useSafeAreaInsets();
	const { calendarData, loadCalendarData } = useStickerDatabase();

	useEffect(() => {
		const currentDate = new Date();
		loadCalendarData({
			year: currentDate.getFullYear(),
			month: currentDate.getMonth() + 1,
		});
	}, [loadCalendarData]);

	const markedDates = useMemo(() => {
		const marked: { [key: string]: any } = {};
		const today = new Date();
		const todayString = today.toISOString().split('T')[0];

		// 오늘 날짜 마킹
		marked[todayString] = {
			selected: true,
			selectedColor: COLORS.secondary,
		};

		// 스티커가 있는 날짜들 마킹
		Object.values(calendarData).forEach((dayData) => {
			const dateString = dayData.date;

			if (dateString === todayString) {
				marked[dateString] = {
					...marked[dateString],
					dotColor: COLORS.success,
					marked: true,
				};
			} else {
				marked[dateString] = {
					dotColor: COLORS.success,
					marked: true,
				};
			}
		});

		return marked;
	}, [calendarData]);

	const onDayPress = (day: any): void => {
		const dateString = day.dateString;
		const hasStickers = calendarData[dateString]?.stickerCount > 0;
		if (hasStickers) {
			showDayDetail(parseInt(day.dateString.split('-')[2]));
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
						<Text style={styles.statNumber}>
							{Object.values(calendarData).reduce(
								(total, day) => total + day.stickerCount,
								0,
							)}
						</Text>
						<Text style={styles.statLabel}>이번달 칭찬스티커</Text>
					</View>
					<View style={styles.statItem}>
						<Text style={styles.statNumber}>
							{Object.keys(calendarData).length}
						</Text>
						<Text style={styles.statLabel}>활동 일수</Text>
					</View>
				</View>
			</View>

			<View style={styles.calendarContainer}>
				<Calendar
					markedDates={markedDates}
					onDayPress={onDayPress}
					theme={{
						backgroundColor: COLORS.background.primary,
						calendarBackground: COLORS.background.primary,
						textSectionTitleColor: COLORS.text.secondary,
						selectedDayBackgroundColor: COLORS.secondary,
						selectedDayTextColor: COLORS.text.white,
						todayTextColor: COLORS.secondary,
						dayTextColor: COLORS.text.primary,
						textDisabledColor: COLORS.text.disabled,
						dotColor: COLORS.success,
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

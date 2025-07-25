import { COLORS } from '@/constants/colors';
import * as calendarService from '@/services/calendarService';
import * as stickerLogService from '@/services/stickerLogService';
import type { CalendarDayData } from '@/types/database/api';
import { formatDateToString, getDate, getTodayString } from '@/utils/dateUtils';
import { useCallback, useEffect, useMemo, useState } from 'react';

export const useCalendar = () => {
	const [weeklyStickerCnt, setWeeklyStickerCnt] = useState<number>(0);
	const [streakCnt, setStreakCnt] = useState<number>(0);
	const [calendarData, setCalendarData] = useState<CalendarDayData>({});
	const [refreshTrigger, setRefreshTrigger] = useState<boolean>(false);

	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		(async () => {
			setIsLoading(true);
			setError(null);

			try {
				await Promise.all([
					loadCalendarData(),
					loadWeeklyStickerCnt(),
				]);
			} catch (e) {
				setError(e instanceof Error ? e.message : 'Unknown error');
			} finally {
				setIsLoading(false);
			}
		})();
	}, [refreshTrigger]);


	const loadCalendarData = useCallback(async () => {
		const today = getDate();

		const year = today.getFullYear();
		const month = today.getMonth() + 1;

		const monthlyData = await calendarService.getCalendarDataByMonth(
			year,
			month,
		);

		setCalendarData(monthlyData);
	}, []);

	const loadWeeklyStickerCnt = useCallback(async () => {
		const today = getDate();
		const currentDay = today.getDay(); // 요일

		const monday = new Date(today);
		monday.setDate(today.getDate() - currentDay + 1);

		const sunday = new Date(monday);
		sunday.setDate(monday.getDate() + 6);

		const startDate = monday.toISOString().split('T')[0]; // 'YYYY-MM-DD'
		const endDate = sunday.toISOString().split('T')[0];

		const weeklyLogs = await stickerLogService.getStickerLogsByRange(
			startDate,
			endDate,
		);
		setWeeklyStickerCnt(weeklyLogs.length);
	}, []);

	// 최근 연속 일수 계산
	const getStreakDates = (stickerDates: string[]) => {
		const streakDates: string[] = [];
		let currentDate = new Date(getDate());

		// 오늘부터 역순으로 연속된 날짜 카운트
		while (true) {
			const dateString = formatDateToString(currentDate);
			if (stickerDates.includes(dateString)) {
				streakDates.push(dateString);

				// 새로운 Date 객체를 생성하여 하루 전으로 설정
				currentDate = new Date(currentDate);
				currentDate.setDate(currentDate.getDate() - 1);
			} else {
				break;
			}
		}

		return streakDates.reverse();
	};

	const markedDates = useMemo(() => {
		const marked: { [key: string]: any } = {};

		const todayString = getTodayString();

		// 스티커가 있는 날짜들을 날짜순으로 정렬
		const stickerDates = Object.keys(calendarData)
			.filter((date) => {
				const hasSticker = calendarData[date] > 0;
				return hasSticker;
			})
			.sort();

		// 연속 날짜 계산
		const streakDates = getStreakDates(stickerDates);

		// 스티커가 있는 날짜들 마킹
		stickerDates.forEach((date) => {
			const isToday = date === todayString;
			const isInStreak = streakDates.includes(date);

			// 요일 확인 (0: 일요일, 6: 토요일)
			const dateObj = new Date(date);
			const dayOfWeek = dateObj.getDay();
			const isSunday = dayOfWeek === 0;
			const isSaturday = dayOfWeek === 6;

			// 오늘까지 연속되는 streak에 포함된 경우에만 period 연결
			if (isInStreak && streakDates.length > 1) {
				// period의 시작/끝 지점 확인 (streak 내에서만)
				const streakIndex = streakDates.indexOf(date);
				const isFirstInStreak = streakIndex === 0;
				const isLastInStreak = streakIndex === streakDates.length - 1;

				// 주간 단위 둥근 처리: 일요일은 왼쪽, 토요일은 오른쪽 둥글게
				const shouldStartRound = isFirstInStreak || isSunday;
				const shouldEndRound = isLastInStreak || isSaturday;

				marked[date] = {
					color: COLORS.secondary,
					textColor: COLORS.text.white,
					startingDay: shouldStartRound,
					endingDay: shouldEndRound,
				};
			} else {
				// 단독 날짜는 원형으로 표시
				marked[date] = {
					color: isToday ? COLORS.secondary : COLORS.tertiary,
					textColor: isToday ? COLORS.text.white : COLORS.text.primary,
					startingDay: true,
					endingDay: true,
				};
			}
		});

		return marked;
	}, [calendarData]);

	// streakCnt 계산을 별도 useEffect로 분리
	useEffect(() => {
		const stickerDates = Object.keys(calendarData)
			.filter((date) => {
				const hasSticker = calendarData[date] > 0;
				return hasSticker;
			})
			.sort();

		const streakDates = getStreakDates(stickerDates);
		setStreakCnt(streakDates?.length || 0);
	}, [calendarData]);

	const refresh = useCallback(() => {
		setRefreshTrigger((prev) => !prev);
	}, []);

	return {
		markedDates,
		weeklyStickerCnt,
		streakCnt,
		isLoading,
		error,
		refresh,
	};
};

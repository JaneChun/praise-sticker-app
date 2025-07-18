import * as calendarService from '@/services/calendarService';
import type {
	CalendarDayData,
	GetCalendarDataParams,
	GetDayDetailParams,
	GetDayDetailResponse,
} from '@/types/database/api';
import { useCallback, useState } from 'react';

export const useCalendar = () => {
	const [calendarData, setCalendarData] = useState<
		Record<string, CalendarDayData>
	>({});
	const [dayDetailData, setDayDetailData] =
		useState<GetDayDetailResponse | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const loadCalendarData = useCallback(
		async (params: GetCalendarDataParams) => {
			setIsLoading(true);
			setError(null);

			try {
				const monthlyData = await calendarService.getCalendarDataByMonth(
					params.year,
					params.month,
				);

				// 서비스 응답을 CalendarDayData 형태로 변환
				const calendarData: Record<string, CalendarDayData> = {};
				Object.entries(monthlyData).forEach(([date, count]) => {
					calendarData[date] = {
						stickerCount: count,
						hasStickers: count > 0,
					};
				});

				setCalendarData(calendarData);
			} catch (e) {
				setError(e instanceof Error ? e.message : 'Unknown error');
			} finally {
				setIsLoading(false);
			}
		},
		[],
	);

	const loadDayDetail = useCallback(async (params: GetDayDetailParams) => {
		setIsLoading(true);
		setError(null);
		try {
			const logs = await calendarService.getCalendarDetailsByDate(params.date);
			const dayDetail: GetDayDetailResponse = {
				date: params.date,
				logs: logs,
				totalStickers: logs.length,
			};
			setDayDetailData(dayDetail);
		} catch (e) {
			setError(e instanceof Error ? e.message : 'Unknown error');
		} finally {
			setIsLoading(false);
		}
	}, []);

	return {
		calendarData,
		dayDetailData,
		isLoading,
		error,
		loadCalendarData,
		loadDayDetail,
	};
};

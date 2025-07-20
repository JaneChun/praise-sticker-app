import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * 한국 시간 기준 날짜 유틸리티
 */

/**
 * 한국 시간 기준 오늘 날짜를 YYYY-MM-DD 형식으로 반환
 */
export const getTodayString = (): string => {
	return dayjs().format('YYYY-MM-DD');
};

/**
 * 한국 시간 기준 어제 날짜를 YYYY-MM-DD 형식으로 반환
 */
export const getYesterdayString = (): string => {
	return dayjs().subtract(1, 'day').format('YYYY-MM-DD');
};

/**
 * 한국 시간 기준 현재 Date 객체 반환
 */
export const getDate = (): Date => {
	return dayjs().toDate();
};

/**
 * 한국 시간 기준 현재 ISO 문자열 반환
 */
export const getISOString = (): string => {
	return dayjs().format('YYYY-MM-DDTHH:mm:ss.SSSZ');
};

/**
 * Date 객체를 한국 시간 기준 YYYY-MM-DD 형식으로 변환
 */
export const formatDateToString = (date: Date): string => {
	return dayjs(date).format('YYYY-MM-DD');
};

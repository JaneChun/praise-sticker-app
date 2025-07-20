import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * 한국 시간 기준 날짜 유틸리티
 */

/**
 * 한국 시간 기준 오늘 날짜를 YYYY-MM-DD 형식으로 반환
 */
export const getTodayString = (): string => {
  return dayjs().tz('Asia/Seoul').format('YYYY-MM-DD');
};

/**
 * 한국 시간 기준 어제 날짜를 YYYY-MM-DD 형식으로 반환
 */
export const getYesterdayString = (): string => {
  return dayjs().tz('Asia/Seoul').subtract(1, 'day').format('YYYY-MM-DD');
};

/**
 * 한국 시간 기준 현재 Date 객체 반환
 */
export const getDate = (): Date => {
  return dayjs().tz('Asia/Seoul').toDate();
};

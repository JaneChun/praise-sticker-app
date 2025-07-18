import type { DailyStickerLog } from '../types';
import { db } from './databaseService';

// 이번주 획득 스티커 개수와 연속 일수 계산 예시

export const getWeeklyStickerCount = async (
	startDate: string,
	endDate: string,
): Promise<number> => {
	try {
		const row = await db.getFirstAsync(
			'SELECT COUNT(*) as count FROM daily_sticker_logs WHERE date BETWEEN ? AND ?',
			[startDate, endDate],
		);
		return row?.count ?? 0;
	} catch (error) {
		throw error;
	}
};

export const getCalendarDataByMonth = async (
	year: number,
	month: number,
): Promise<Record<string, number>> => {
	try {
		// month는 1~12, date LIKE 'YYYY-MM%'
		const monthStr = `${year.toString().padStart(4, '0')}-${month
			.toString()
			.padStart(2, '0')}%`;
		const rows = await db.getAllAsync(
			`SELECT date, COUNT(*) as stickerCount FROM daily_sticker_logs WHERE date LIKE ? GROUP BY date`,
			[monthStr],
		);

		// { '2025-07-18': 3, ... } 형태 반환
		const result: Record<string, number> = {};
		rows.forEach((row: any) => {
			result[row.date] = row.stickerCount;
		});
		return result;
	} catch (error) {
		throw error;
	}
};

export const getCalendarDetailsByDate = async (
	date: string,
): Promise<DailyStickerLog[]> => {
	try {
		const rows = await db.getAllAsync(
			`SELECT * FROM daily_sticker_logs WHERE date = ? ORDER BY created_at DESC`,
			[date],
		);
		return rows.map((row: any) => ({
			id: row.id,
			challengeId: row.challenge_id,
			stickerId: row.sticker_id,
			date: row.date,
			createdAt: row.created_at,
		}));
	} catch (error) {
		throw error;
	}
};

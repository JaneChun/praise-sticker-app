import { v4 as uuidv4 } from 'uuid';
import type { DailyStickerLog } from '../types';
import { getDate } from '../utils/dateUtils';
import { db } from './databaseService';

export const addStickerLog = async (
	challengeId: string,
	stickerId: string,
	date: string, // 'YYYY-MM-DD'
): Promise<DailyStickerLog> => {
	try {
		// 스티커를 붙일 수 있는지 확인
		const existing = await db.getFirstAsync(
			'SELECT id FROM daily_sticker_logs WHERE challenge_id = ? AND date = ?',
			[challengeId, date],
		);
		if (existing) {
			throw new Error('하루에 한 번만 스티커를 붙일 수 있습니다.');
		}

		const id = uuidv4();
		const createdAt = getDate().toISOString();

		await db.runAsync(
			'INSERT INTO daily_sticker_logs (id, challenge_id, sticker_id, date, created_at) VALUES (?, ?, ?, ?, ?)',
			[id, challengeId, stickerId, date, createdAt],
		);

		// 총 스티커 수 업데이트
		await db.runAsync(
			'UPDATE user_stats SET total_stickers = total_stickers + 1, updated_at = CURRENT_TIMESTAMP',
		);

		// 생성된 로그 객체 반환
		return {
			id,
			challengeId,
			stickerId,
			date,
			createdAt,
		};
	} catch (error) {
		throw error;
	}
};

export const getStickerLogsByDate = async (
	date: string,
): Promise<DailyStickerLog[]> => {
	try {
		const rows = await db.getAllAsync(
			'SELECT * FROM daily_sticker_logs WHERE date = ? ORDER BY created_at DESC',
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

export const getAllStickerLogs = async (): Promise<DailyStickerLog[]> => {
	try {
		const rows = await db.getAllAsync(
			'SELECT * FROM daily_sticker_logs ORDER BY date ASC',
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

export const getStickerLogsByChallengeId = async (
	challengeId: string,
): Promise<DailyStickerLog[]> => {
	try {
		const rows = await db.getAllAsync(
			'SELECT * FROM daily_sticker_logs WHERE challenge_id = ? ORDER BY date ASC',
			[challengeId],
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

export const removeStickerLog = async (
	challengeId: string,
	date: string,
): Promise<string> => {
	try {
		// 해당 날짜의 스티커 로그 찾기
		const existing = await db.getFirstAsync(
			'SELECT id FROM daily_sticker_logs WHERE challenge_id = ? AND date = ?',
			[challengeId, date],
		);

		if (!existing) {
			throw new Error('제거할 스티커 로그가 없습니다.');
		}

		// 스티커 로그 제거
		await db.runAsync(
			'DELETE FROM daily_sticker_logs WHERE challenge_id = ? AND date = ?',
			[challengeId, date],
		);

		// 총 스티커 수 업데이트
		await db.runAsync(
			'UPDATE user_stats SET total_stickers = total_stickers - 1, updated_at = CURRENT_TIMESTAMP',
		);

		return (existing as any).id;
	} catch (error) {
		throw error;
	}
};

export const getStickerLogsByRange = async (
	startDate: string,
	endDate: string,
): Promise<DailyStickerLog[]> => {
	try {
		const rows = await db.getAllAsync(
			'SELECT * FROM daily_sticker_logs WHERE date >= ? AND date <= ? ORDER BY date ASC',
			[startDate, endDate],
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

export const removeExcessStickerLogs = async (
	challengeId: string,
	maxDays: number,
): Promise<number> => {
	try {
		// 현재 챌린지의 모든 스티커 로그를 날짜순으로 가져오기
		const logs = await db.getAllAsync(
			'SELECT * FROM daily_sticker_logs WHERE challenge_id = ? ORDER BY date ASC',
			[challengeId],
		);

		// 초과하는 로그들 삭제
		if (logs.length > maxDays) {
			const excessLogs = logs.slice(maxDays);
			const excessIds = excessLogs.map((log: any) => log.id);

			if (excessIds.length > 0) {
				const placeholders = excessIds.map(() => '?').join(',');
				await db.runAsync(
					`DELETE FROM daily_sticker_logs WHERE id IN (${placeholders})`,
					excessIds,
				);

				// 총 스티커 수 업데이트
				await db.runAsync(
					'UPDATE user_stats SET total_stickers = total_stickers - ?, updated_at = CURRENT_TIMESTAMP',
					[excessIds.length],
				);

				return excessIds.length;
			}
		}

		return 0;
	} catch (error) {
		throw error;
	}
};

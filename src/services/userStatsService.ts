import type { UserStats } from '../types';
import { getTodayString, getYesterdayString } from '../utils/dateUtils';
import { db } from './databaseService';

/**
 * 사용자 통계 데이터 가져오기
 */
export const getUserStats = async (): Promise<UserStats> => {
	try {
		const row = await db.getFirstAsync(
			'SELECT * FROM user_stats ORDER BY id DESC LIMIT 1',
		);
		if (!row) {
			throw new Error(
				'User stats not initialized. Did you forget to run initializeDatabase()?',
			);
		}

		return {
			id: (row as any).id,
			totalStickers: (row as any).total_stickers,
			currentStreak: (row as any).current_streak,
			longestStreak: (row as any).longest_streak,
			totalChallenges: (row as any).total_challenges,
			updatedAt: (row as any).updated_at,
		} as UserStats;
	} catch (error) {
		throw error;
	}
};

/**
 * 오늘과 어제 날짜 문자열(YYYY-MM-DD) 반환
 */
const getTodayAndYesterday = (): { today: string; yesterday: string } => {
	const today = getTodayString();
	const yesterday = getYesterdayString();
	return { today, yesterday };
};

/**
 * 특정 날짜에 스티커 기록이 있는지 확인
 */
const hasStickerOnDate = async (date: string): Promise<boolean> => {
	const result = await db.getFirstAsync(
		'SELECT COUNT(*) as count FROM daily_sticker_logs WHERE date = ?',
		[date],
	);
	return (result?.count ?? 0) > 0;
};

/**
 * streak 업데이트 핵심 로직
 */
export const updateStreak = async (): Promise<void> => {
	try {
		const { today, yesterday } = getTodayAndYesterday();

		const hasToday = await hasStickerOnDate(today);

		if (!hasToday) {
			// 오늘 스티커 없으면 streak 리셋
			await db.runAsync(
				'UPDATE user_stats SET current_streak = 0, updated_at = CURRENT_TIMESTAMP',
			);
			return;
		}

		const hasYesterday = await hasStickerOnDate(yesterday);

		if (!hasYesterday) {
			// 어제 없으면 streak 1로 시작, longest_streak 업데이트
			await db.runAsync(
				`UPDATE user_stats SET 
          current_streak = 1,
          longest_streak = CASE WHEN longest_streak < 1 THEN 1 ELSE longest_streak END,
          updated_at = CURRENT_TIMESTAMP`,
			);
		} else {
			// 어제도 있으면 current_streak +1, longest_streak 갱신
			await db.runAsync(
				`UPDATE user_stats SET 
          current_streak = current_streak + 1,
          longest_streak = CASE WHEN longest_streak < current_streak + 1 THEN current_streak + 1 ELSE longest_streak END,
          updated_at = CURRENT_TIMESTAMP`,
			);
		}
	} catch (error) {
		throw error;
	}
};

/**
 * updateStreakWithParams
 * (challengeId와 date 파라미터는 현재 사용처에 맞게 필요시 로직 추가 가능)
 */
export const updateStreakWithParams = async (
	challengeId: string,
	date: string,
): Promise<number> => {
	try {
		// 현재는 파라미터 활용 없이 streak 업데이트
		await updateStreak();

		const stats = await getUserStats();
		return stats.currentStreak;
	} catch (error) {
		console.error('Error updating streak:', error);
		return 0;
	}
};

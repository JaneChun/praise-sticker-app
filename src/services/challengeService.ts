import { v4 as uuidv4 } from 'uuid';
import type { Challenge, ChallengeProgress } from '../types';
import { db } from './databaseService';
import * as stickerLogService from './stickerLogService';

export const getChallengeById = async (id: string) => {
	const query = `SELECT * FROM challenges WHERE id = ?`;
	return db.getFirstAsync(query, [id]);
};

export const getChallenges = async (): Promise<Challenge[]> => {
	try {
		const rows = await db.getAllAsync(
			'SELECT * FROM challenges ORDER BY created_at DESC',
		);
		return rows.map((row: any) => ({
			id: row.id,
			title: row.title,
			icon: row.icon,
			days: row.days,
			reward: row.reward,
			createdAt: row.created_at,
		}));
	} catch (error) {
		throw error;
	}
};

export const createChallenge = async (
	title: string,
	icon: string,
	days: number,
	reward: string | null = null,
): Promise<string> => {
	try {
		const challengeId = uuidv4();

		// 도전 생성
		await db.runAsync(
			'INSERT INTO challenges (id, title, icon, days, reward) VALUES (?, ?, ?, ?, ?)',
			[challengeId, title, icon, days, reward],
		);

		// 총 도전 수 업데이트
		await db.runAsync(
			'UPDATE user_stats SET total_challenges = total_challenges + 1, updated_at = CURRENT_TIMESTAMP',
		);

		return challengeId;
	} catch (error) {
		throw error;
	}
};

export const updateChallenge = async (
	challengeId: string,
	title: string,
	icon: string,
	days: number,
	reward: string | null = null,
): Promise<void> => {
	try {
		// 현재 챌린지 정보 가져오기
		const currentChallenge = await getChallengeById(challengeId);
		if (!currentChallenge) {
			throw new Error('Challenge not found');
		}

		const currentDays = (currentChallenge as any).days;

		// 챌린지 업데이트
		await db.runAsync(
			'UPDATE challenges SET title = ?, icon = ?, days = ?, reward = ? WHERE id = ?',
			[title, icon, days, reward, challengeId],
		);

		// 일수가 줄어든 경우 초과 스티커 로그 삭제
		if (days < currentDays) {
			await stickerLogService.removeExcessStickerLogs(challengeId, days);
		}
	} catch (error) {
		throw error;
	}
};

export const deleteChallenge = async (challengeId: string): Promise<void> => {
	try {
		// 챌린지 삭제
		await db.runAsync('DELETE FROM challenges WHERE id = ?', [challengeId]);

		// 스티커 로그 삭제
		await db.runAsync('DELETE FROM daily_sticker_logs WHERE challenge_id = ?', [
			challengeId,
		]);
	} catch (error) {
		throw error;
	}
};

export const getChallengeProgress = async (
	challengeId: string,
): Promise<ChallengeProgress> => {
	try {
		const challengeResult = await db.getFirstAsync(
			'SELECT days FROM challenges WHERE id = ?',
			[challengeId],
		);

		if (!challengeResult) {
			throw new Error('Challenge not found');
		}

		const totalDays = (challengeResult as any).days;

		const progressResult = await db.getFirstAsync(
			'SELECT COUNT(DISTINCT date) as completed_days FROM daily_sticker_logs WHERE challenge_id = ?',
			[challengeId],
		);

		const completedDays = (progressResult as any)?.completed_days || 0;
		const progress: ChallengeProgress = {
			totalDays,
			completedDays,
			progressText: `${completedDays} / ${totalDays}`,
		};

		return progress;
	} catch (error) {
		throw error;
	}
};

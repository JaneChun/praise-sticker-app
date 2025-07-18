import type { Challenge, DailyStickerLog, UserStats } from '../database/entities';

export interface MonthlyStats {
	[day: number]: number;
}

export interface ExportData {
	challenges: Challenge[];
	stickers: DailyStickerLog[];
	stats: UserStats;
	exportDate: string;
}
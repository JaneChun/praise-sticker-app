import type { DailyStickerLog, Sticker, StickerPack } from './entities';

// Challenge API 타입
export interface ChallengeProgress {
	totalDays: number;
	completedDays: number;
	progressText: string; // '1 / 30'
}

// Calendar API 타입
export interface CalendarDayData {
	stickerCount: number;
	hasStickers: boolean;
}

export interface GetCalendarDataParams {
	year: number;
	month: number;
}

export interface GetCalendarDataResponse {
	calendarData: Record<string, CalendarDayData>;
}

export interface GetDayDetailParams {
	date: string;
}

export interface GetDayDetailResponse {
	date: string;
	logs: DailyStickerLog[];
	totalStickers: number;
}

// Sticker API 타입
export interface StickerPackWithStickers {
	pack: StickerPack;
	stickers: Sticker[];
}

export interface AddStickerParams {
	challengeId: string;
	stickerId: string;
	date: string;
}

export interface AddStickerResponse {
	success: boolean;
	message: string;
	stickerLogId?: string;
}

export interface RemoveStickerParams {
	stickerLogId: string;
	challengeId: string;
	date: string;
}

export interface RemoveStickerResponse {
	success: boolean;
	message: string;
}

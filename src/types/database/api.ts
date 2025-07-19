import type { Sticker, StickerPack } from './entities';

// Challenge API 타입
export interface ChallengeProgress {
	totalDays: number;
	completedDays: number;
	progressText: string; // '1 / 30'
}

// Calendar API 타입
export type CalendarDayData = Record<string, number>;

export interface GetCalendarDataParams {
	year: number;
	month: number;
}

export interface GetCalendarDataResponse {
	calendarData: CalendarDayData;
}

export interface GetDayDetailResponse {
	challengeWithStickers: ChallengeWithStickers[];
	totalStickers: number;
}

export interface ChallengeWithStickers {
	challengeId: string;
	challengeTitle: string;
	challengeIcon: string;
	stickers: Sticker[];
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

import { Dispatch, SetStateAction } from 'react';
import { Challenge, DailyStickerLog, UserStats, StickerData } from '../database/entities';

// 공통 유틸리티 타입
export type SetState<T> = Dispatch<SetStateAction<T>>;

// 비동기 타이머 타입
export type Timer = ReturnType<typeof setTimeout>;

// 호환성을 위한 타입 별칭 (점진적 마이그레이션)
export type StickerColor = string;

// 커스텀 스티커 생성 옵션
export interface CustomStickerOptions {
	name: string;
	imageUri: string;
	hasTransparentBackground?: boolean;
	hasBorder?: boolean;
	borderColor?: string;
	borderWidth?: number;
}

// 프리미엄 관련 타입
export interface UserPremiumStatus {
	isPremium: boolean;
	expiresAt?: Date;
	features: {
		canCreateCustomStickers: boolean;
		canUsePremiumStickers: boolean;
	};
}

// 스티커 팩 관련 타입
export interface StickerPackData {
	id: string;
	name: string;
	description?: string;
	thumbnailUri?: string;
	isPremium?: boolean;
	isUnlocked?: boolean;
	createdAt?: Date;
	updatedAt?: Date;
	// 프리미엄 관련 필드
	requiresPremium?: boolean; // 팩 전체가 프리미엄 전용인지
	isCustomPack?: boolean; // 사용자가 만든 커스텀 팩인지
}

// 일별 스티커 데이터 타입
export interface DailyStickerData {
	[challengeTitle: string]: StickerData[];
}

export interface SampleDailyStickerData {
	[day: number]: DailyStickerData;
}

// 훅 관련 타입
export interface ChallengeFormData {
	title: string;
	icon: string;
	duration: number;
}
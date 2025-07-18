import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const SCREEN_WIDTH: number = width;
export const SCREEN_HEIGHT: number = height;

// 간격 상수
export const SPACING: Record<string, number> = {
	xs: 4,
	sm: 8,
	md: 16,
	lg: 20,
	xl: 24,
	xxl: 32,
	xxxl: 40,
};

// 크기 상수
export const SIZES: Record<string, number> = {
	// 도전 카드
	challengeCard: (width - 60) / 2,

	// 캘린더
	calendarDay: (width - 40) / 7,

	// 아이콘
	iconItem: (width - 80) / 6,

	// 스티커
	stickerGrid: 300,
	stickerSlot: (300 - 32) / 5,
	stickerItem: 48,

	// 기타
	miniGrid: 60,
	miniDot: 8,
};

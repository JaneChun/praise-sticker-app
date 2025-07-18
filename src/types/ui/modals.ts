import { Challenge, StickerData } from '../database/entities';

// 스티커 관련 모달 타입
export interface StickerPageModalProps {
	visible: boolean;
	setVisible: (visible: boolean) => void;
	currentChallenge: Challenge | null;
}

export interface StickerSelectionModalProps {
	visible: boolean;
	setVisible: (visible: boolean) => void;
	onStickerSelect: (sticker: StickerData) => void;
	selectedSticker: StickerData;
}

// 축하 관련 모달 타입
export interface CelebrationMessage {
	title: string;
	subtitle?: string;
	description: string;
	icon: string;
}

export interface CelebrationModalProps {
	visible: boolean;
	setVisible: (visible: boolean) => void;
	celebrationData: CelebrationMessage | null;
}

// 일별 상세 모달 타입
export interface DayDetailModalProps {
	visible: boolean;
	setVisible: (visible: boolean) => void;
	selectedDay: number | null;
}

// 도전 생성 모달 타입
export interface CreateChallengeModalProps {
	visible: boolean;
	setVisible: (visible: boolean) => void;
	editMode?: boolean;
	existingChallenge?: Challenge;
}
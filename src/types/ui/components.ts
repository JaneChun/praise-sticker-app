import { Challenge, Sticker } from '../database/entities';

// 스티커 관련 컴포넌트 타입
export type StickerGridItem = Sticker | null;

export interface StickerGridProps {
	stickerGrid: StickerGridItem[];
	setStickerGrid: (grid: StickerGridItem[]) => void;
	onStickerAdd?: (index: number, sticker: Sticker) => void;
}

export interface StickerSlotItemProps {
	sticker: Sticker | null;
	index: number;
	onLayout: (index: number, event: any) => void;
	triggerAnimation: number | null;
	isValidDropTarget?: boolean;
	onStickerRemove?: (index: number) => void;
}

// 도전 관련 컴포넌트 타입
export interface ChallengeCardProps {
	challenge?: Challenge;
	isNew?: boolean;
	currentView?: 'card' | 'grid';
	onPress: () => void;
	onLongPress?: () => void;
	onEdit?: () => void;
	isSelected?: boolean;
}

// 페이지 관련 컴포넌트 타입
export interface CalendarPageProps {
	showDayDetail: (day: number) => void;
}

// 공통 컴포넌트 타입
export interface ViewToggleProps {
	viewMode: 'grid' | 'list';
	onToggle: (mode: 'grid' | 'list') => void;
}

export interface ActionSheetOption {
	title: string;
	onPress: () => void;
	destructive?: boolean;
}

export interface ActionSheetProps {
	visible: boolean;
	onClose: () => void;
	options: ActionSheetOption[];
	title?: string;
}

import { Challenge, DailyStickerLog, Sticker } from '../database/entities';

// 스티커 관련 컴포넌트 타입
export interface StickerWithLog {
	sticker: Sticker;
	log: DailyStickerLog;
}
export type StickerGridItem = StickerWithLog | null;

export interface StickerGridProps {
	stickerGrid: StickerGridItem[];
	setStickerGrid: (grid: StickerGridItem[]) => void;
	onStickerAdd?: (index: number, sticker: Sticker) => void;
}

export type Rect = {
	x: number;
	y: number;
	width: number;
	height: number;
};

export interface StickerSlotItemProps {
	sticker: StickerGridItem;
	index: number;
	onLayout: (index: number, event: any) => void;
	showScaleAnimation: boolean;
	removeStickerFromGrid: (index: number) => Promise<void>;
	isValidDropSlot: boolean;
	isDraggingSticker: boolean;
	isDragging: boolean;
	draggingSticker: any;

	handleDragStart: (x: number, y: number, sticker: any) => void;
	handleDragEnd: () => void;
	isInTodayStickerArea: (x: number, y: number) => boolean;
	updateDragPosition: (x: number, y: number) => void;
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

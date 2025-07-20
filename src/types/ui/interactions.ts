import { Sticker } from '../database/entities';

// 드래그 관련 타입
export interface DragState {
	isDragging: boolean;
	draggingSticker: Sticker | null;
	dragValue: any; // Animated.ValueXY
	isDraggingFromSlot: boolean;
}

export interface DragHandlers {
	handleTodayStickerDragStart: (x: number, y: number, sticker: any) => void;
	handleSlotStickerDragStart: (x: number, y: number, sticker: any) => void;
	handleSlotLayout: (index: number, event: any) => void;
	handleTodayStickerLayout: (event: any) => void;
	isInTodayStickerArea: (x: number, y: number) => boolean;
	isInNextSlotArea: (x: number, y: number) => boolean;
	updateDragPosition: (x: number, y: number) => void;
	handleDragEnd: () => void;
}

export interface UseStickerDragReturn extends DragState, DragHandlers {
	nextSlotIndex: number;
}

// 제스처 상태 타입
export interface GestureState {
	dx: number;
	dy: number;
	moveX: number;
	moveY: number;
	x0: number;
	y0: number;
	vx: number;
	vy: number;
}

// 이벤트 타입
export interface LayoutEvent {
	nativeEvent: {
		layout: {
			x: number;
			y: number;
			width: number;
			height: number;
		};
	};
	target: any;
}

// 크기 관련 타입
export interface Dimensions {
	screenWidth: number;
	screenHeight: number;
	stickerSlot: number;
	stickerGrid: number;
}

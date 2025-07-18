import { StickerData } from '../database/entities';

// 드래그 관련 타입
export interface DragState {
	isDragging: boolean;
	draggingSticker: StickerData | null;
	hoveredSlotIndex: number | null;
}

export interface DragHandlers {
	handleDragStart: (x: number, y: number, sticker: StickerData) => void;
	handleDragEnd: () => void;
	updateDragPosition: (x: number, y: number) => void;
	handleSlotLayout: (index: number, event: any) => void;
}

export interface UseStickerDragReturn extends DragState, DragHandlers {
	dragValue: any; // Animated.ValueXY
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
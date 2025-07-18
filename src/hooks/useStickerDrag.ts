import * as Haptics from 'expo-haptics';
import { useRef, useState } from 'react';
import { Animated } from 'react-native';
import {
	LayoutEvent,
	StickerData,
	StickerGridItem,
	UseStickerDragReturn,
} from '../types';

export const useStickerDrag = (
	stickerGrid: StickerGridItem[],
): UseStickerDragReturn => {
	// 드래그 관련 상태
	const [isDragging, setIsDragging] = useState<boolean>(false);
	const [draggingSticker, setDraggingSticker] = useState<StickerData | null>(
		null,
	);
	const [hoveredSlotIndex, setHoveredSlotIndex] = useState<number | null>(null);
	const dragValue = useRef(new Animated.ValueXY()).current;

	// 슬롯 위치 정보 저장
	const slotPositions = useRef<
		Record<number, { x: number; y: number; width: number; height: number }>
	>({}).current;

	// 슬롯 위치 정보 저장
	const handleSlotLayout = (index: number, event: LayoutEvent): void => {
		const { width, height } = event.nativeEvent.layout;
		// 절대 좌표 측정
		event.target.measureInWindow((pageX: number, pageY: number) => {
			slotPositions[index] = {
				x: pageX,
				y: pageY,
				width,
				height,
			};
		});
	};

	// 드래그 좌표로부터 슬롯 인덱스 계산
	const getSlotIndexFromPosition = (x: number, y: number): number => {
		if (!stickerGrid) return -1;
		let closestIndex = -1;
		let closestDistance = Infinity;
		const maxDistance = 80; // 더 큰 감지 범위

		// 가장 가까운 슬롯 찾기
		for (let index = 0; index < stickerGrid.length; index++) {
			const slot = slotPositions[index];
			if (!slot) continue;

			const centerX = slot.x + slot.width / 2;
			const centerY = slot.y + slot.height / 2;
			const distance = Math.sqrt(
				Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2),
			);

			if (distance < closestDistance && distance < maxDistance) {
				closestDistance = distance;
				closestIndex = index;
			}
		}

		return closestIndex;
	};

	// 드래그 시작 핸들러
	const handleDragStart = (
		x: number,
		y: number,
		sticker: StickerData,
	): void => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

		setIsDragging(true);
		setDraggingSticker(sticker);
		dragValue.setValue({ x, y });
	};

	// 드래그 종료 핸들러
	const handleDragEnd = (): void => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

		setIsDragging(false);
		setDraggingSticker(null);
		setHoveredSlotIndex(null);
	};

	// 드래그 중일 때 위치 업데이트
	const updateDragPosition = (x: number, y: number): void => {
		if (isDragging) {
			dragValue.setValue({
				x: x - 30, // 스티커 크기 보정
				y: y - 30,
			});

			// 드래그 위치에 따른 슬롯 인덱스 계산
			const targetSlotIndex = getSlotIndexFromPosition(x, y);

			const isTargetSlotValid =
				targetSlotIndex !== -1 && targetSlotIndex < stickerGrid.length;
			const isTargetSlotEmpty = stickerGrid[targetSlotIndex] === null;

			if (stickerGrid && isTargetSlotValid && isTargetSlotEmpty) {
				setHoveredSlotIndex(targetSlotIndex);
			} else {
				setHoveredSlotIndex(null);
			}
		}
	};

	return {
		// 상태
		isDragging,
		draggingSticker,
		hoveredSlotIndex,
		dragValue,

		// 핸들러
		handleDragStart,
		handleDragEnd,
		updateDragPosition,
		handleSlotLayout,
	};
};

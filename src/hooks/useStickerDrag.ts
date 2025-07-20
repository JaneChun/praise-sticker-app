import * as Haptics from 'expo-haptics';
import { useRef, useState } from 'react';
import { Animated } from 'react-native';
import {
	LayoutEvent,
	Rect,
	Sticker,
	StickerGridItem,
	UseStickerDragReturn,
} from '../types';

export const useStickerDrag = (
	stickerGrid: StickerGridItem[],
): UseStickerDragReturn => {
	// 드래그 관련 상태
	const [isDragging, setIsDragging] = useState<boolean>(false);
	const [draggingSticker, setDraggingSticker] = useState<Sticker | null>(null); // 현재 드래그 되고 있는 스티커
	const dragValue = useRef(new Animated.ValueXY()).current; // 드래그 X,Y 위치
	const [isDraggingFromSlot, setIsDraggingFromSlot] = useState<boolean>(false); // 두 가지 드래그 시나리오 구분 (슬롯 → 오늘의 스티커 vs 오늘의 스티커 → 슬롯)

	// 🔸 오늘의 스티커 영역의 좌표를 저장
	const todayStickerPosition = useRef<Rect | null>(null);

	// 🔹 캘린더의 각 슬롯의 좌표를 저장 [index]: { x, y, width, height }
	const slotPositions = useRef<Record<number, Rect>>({}).current;

	// 🔸 오늘의 스티커의 onLayout에 전달해 오늘의 스티커 위치 정보 저장
	const handleTodayStickerLayout = (event: LayoutEvent): void => {
		const { width, height } = event.nativeEvent.layout;
		event.target.measureInWindow((pageX: number, pageY: number) => {
			todayStickerPosition.current = {
				x: pageX,
				y: pageY,
				width,
				height,
			};
		});
	};

	// 🔹 슬롯의 onLayout에 전달해 슬롯 위치 정보 저장
	const handleSlotLayout = (index: number, event: LayoutEvent): void => {
		const { width, height } = event.nativeEvent.layout;
		event.target.measureInWindow((pageX: number, pageY: number) => {
			slotPositions[index] = {
				x: pageX,
				y: pageY,
				width,
				height,
			};
		});
	};

	// 🔸 다음 유효한 슬롯 인덱스
	const nextSlotIndex = stickerGrid.findIndex((slot) => slot === null);

	// 🔸 유효한 다음 슬롯 영역에 있는지 확인
	const isInNextSlotArea = (x: number, y: number): boolean => {
		if (nextSlotIndex === -1) {
			return false;
		}

		const targetSlotIndex = getSlotIndexFromPosition(x, y);

		return targetSlotIndex === nextSlotIndex;
	};

	// 🔹 오늘의 스티커 영역에 있는지 확인
	const isInTodayStickerArea = (x: number, y: number): boolean => {
		if (!todayStickerPosition.current) {
			return false;
		}

		const pos = todayStickerPosition.current;
		return (
			x >= pos.x &&
			x <= pos.x + pos.width &&
			y >= pos.y &&
			y <= pos.y + pos.height
		);
	};

	// 🔸 오늘의 스티커 드래그 시작 핸들러
	const handleTodayStickerDragStart = (
		x: number,
		y: number,
		sticker: Sticker,
	): void => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

		setIsDragging(true);
		setDraggingSticker(sticker);
		setIsDraggingFromSlot(false);
		dragValue.setValue({ x, y });
	};

	// 🔹 슬롯 스티커 드래그 시작 핸들러
	const handleSlotStickerDragStart = (
		x: number,
		y: number,
		sticker: Sticker,
	): void => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

		setIsDragging(true);
		setDraggingSticker(sticker);
		setIsDraggingFromSlot(true);
		dragValue.setValue({ x, y });
	};

	// 드래그 종료 핸들러
	const handleDragEnd = (): void => {
		setIsDragging(false);
		setDraggingSticker(null);
		setIsDraggingFromSlot(false);
		dragValue.setValue({ x: -1000, y: -1000 }); // 화면 밖으로 이동
	};

	// 🔸 드래그 중일 때 위치 업데이트
	const updateDragPosition = (x: number, y: number): void => {
		if (isDragging) {
			dragValue.setValue({
				x: x - 30, // 스티커 크기 보정
				y: y - 30,
			});
		}
	};

	// 🔸 드래그 좌표에서 반경 내 가장 가까운 슬롯 찾아 인덱스 반환
	const getSlotIndexFromPosition = (x: number, y: number): number => {
		if (!stickerGrid) {
			return -1;
		}

		let closestIndex = -1;
		let closestDistance = Infinity;

		const maxDistance = 80; // 80px 반경

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

	return {
		// 상태
		isDragging,
		draggingSticker,
		nextSlotIndex,
		dragValue,
		isDraggingFromSlot,

		// 핸들러
		handleTodayStickerDragStart,
		handleSlotStickerDragStart,
		handleDragEnd,
		updateDragPosition,
		handleSlotLayout,
		handleTodayStickerLayout,
		isInTodayStickerArea,
		isInNextSlotArea,
	};
};

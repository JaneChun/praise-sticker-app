import { FC, useCallback, useEffect, useRef } from 'react';
import { Animated, PanResponder, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../constants/colors';
import { SIZES } from '../constants/dimensions';
import { StickerSlotItemProps, Timer } from '../types';
import { getTodayString } from '../utils/dateUtils';
import StickerRenderer from './StickerRenderer';

const StickerSlotItem: FC<StickerSlotItemProps> = ({
	sticker,
	index,
	onLayout,
	showScaleAnimation,
	removeStickerFromGrid,
	isDragging,
	draggingSticker,
	isValidDropSlot,
	isDraggingSticker,
	isInTodayStickerArea,
	handleDragStart,
	handleDragEnd,
	updateDragPosition,
}) => {
	const scaleAnim = useRef<Animated.Value>(new Animated.Value(1)).current;

	// 스티커 붙이기 애니메이션
	useEffect(() => {
		if (showScaleAnimation) {
			Animated.sequence([
				// 1.3배로 확대
				Animated.timing(scaleAnim, {
					toValue: 1.3,
					duration: 150,
					useNativeDriver: true,
				}),
				// 원래 크기로 복귀
				Animated.timing(scaleAnim, {
					toValue: 1,
					duration: 150,
					useNativeDriver: true,
				}),
			]).start();
		}
	}, [showScaleAnimation, scaleAnim]);

	// 슬롯 드래그 레퍼런스
	const longPressTimer = useRef<Timer | null>(null);

	// 조건부 드래그 허용
	const onStartShouldSetPanResponder = useCallback(() => {
		if (!sticker) return false;

		const today = getTodayString();

		return sticker.log.date === today; // 오늘 붙인 스티커만 드래그 가능
	}, [sticker]);

	const onPanResponderGrant = useCallback(
		(_: any, gestureState: any) => {
			if (!sticker) return;

			longPressTimer.current = setTimeout(() => {
				handleDragStart(
					gestureState.x0 - 30, // 스티커 크기 보정
					gestureState.y0 - 30,
					sticker.sticker,
				);
			}, 500);
		},
		[sticker, handleDragStart],
	);

	const onPanResponderMove = useCallback(
		(_: any, gestureState: any) => {
			// 롱프레스 타이머가 진행 중이고 움직임이 감지되면 타이머 취소
			if (longPressTimer.current && !isDragging) {
				const dx = Math.abs(gestureState.dx);
				const dy = Math.abs(gestureState.dy);

				if (dx > 5 || dy > 5) {
					clearTimeout(longPressTimer.current);
					longPressTimer.current = null;
					return; // 드래그 취소
				}
			}

			if (isDragging) {
				updateDragPosition(gestureState.moveX - 30, gestureState.moveY - 30); // 스티커 크기 보정
			}
		},
		[isDragging, updateDragPosition],
	);

	const onPanResponderRelease = useCallback(
		(_: any, gestureState: any) => {
			// 타이머 정리
			if (longPressTimer.current) {
				clearTimeout(longPressTimer.current);
				longPressTimer.current = null;
			}

			if (!isDragging) return;

			if (isInTodayStickerArea(gestureState.moveX, gestureState.moveY)) {
				removeStickerFromGrid(index);
			}

			handleDragEnd();
		},
		[
			isDragging,
			isInTodayStickerArea,
			removeStickerFromGrid,
			handleDragEnd,
			index,
		],
	);

	// 슬롯 스티커 PanResponder
	const slotStickerPanResponder = PanResponder.create({
		onStartShouldSetPanResponder,
		onPanResponderGrant,
		onPanResponderMove,
		onPanResponderRelease,
	});

	return (
		<Animated.View
			style={[
				styles.stickerSlot,
				sticker && {
					borderStyle: 'solid',
					borderColor: 'transparent',
				},
				isValidDropSlot && styles.validDropSlot,
				{
					transform: [{ scale: scaleAnim }],
				},
			]}
		>
			{sticker ? (
				<Animated.View
					style={[
						styles.touchableArea,
						isDraggingSticker && styles.slotStickerDragging,
					]}
					onLayout={(event) => onLayout(index, event)}
					{...slotStickerPanResponder.panHandlers}
				>
					<StickerRenderer sticker={sticker.sticker} size={SIZES.stickerSlot} />
				</Animated.View>
			) : (
				<View
					style={styles.touchableArea}
					onLayout={(event) => onLayout(index, event)}
				>
					<Text style={styles.stickerSlotNumber}>{index + 1}</Text>
				</View>
			)}
		</Animated.View>
	);
};

const styles = StyleSheet.create({
	stickerSlot: {
		width: SIZES.stickerSlot,
		height: SIZES.stickerSlot,
		borderWidth: 2,
		borderColor: COLORS.border.secondary,
		borderStyle: 'dashed',
		borderRadius: '50%',
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: 8,
	},
	touchableArea: {
		width: '100%',
		height: '100%',
		alignItems: 'center',
		justifyContent: 'center',
	},
	validDropSlot: {
		borderStyle: 'solid',
		borderColor: COLORS.border.light,
		backgroundColor: COLORS.border.light,
	},
	stickerSlotNumber: {
		fontSize: 16,
		color: COLORS.text.light,
	},
	slotStickerDragging: {
		opacity: 0.5,
	},
});

export default StickerSlotItem;

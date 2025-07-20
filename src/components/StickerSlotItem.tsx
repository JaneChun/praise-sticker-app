import { FC, useEffect, useRef } from 'react';
import {
	Animated,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { COLORS } from '../constants/colors';
import { SIZES } from '../constants/dimensions';
import { StickerSlotItemProps } from '../types';
import StickerRenderer from './StickerRenderer';

const StickerSlotItem: FC<StickerSlotItemProps> = ({
	sticker,
	index,
	onLayout,
	triggerAnimation,
	isValidDropTarget,
	onStickerRemove,
}) => {
	const scaleAnim = useRef<Animated.Value>(new Animated.Value(1)).current;

	useEffect(() => {
		// 스티커가 붙을 때 애니메이션
		if (triggerAnimation === index && sticker) {
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
	}, [triggerAnimation, index, sticker, scaleAnim]);

	// 스티커 제거 핸들러
	const handleStickerPress = (): void => {
		if (sticker && onStickerRemove) {
			onStickerRemove(index);
		}
	};

	return (
		<Animated.View
			style={[
				styles.stickerSlot,
				sticker && {
					borderStyle: 'solid',
					borderColor: 'transparent',
				},
				// 유효한 드롭 위치에 강조 효과
				isValidDropTarget && styles.stickerSlotValidDrop,
				{
					transform: [{ scale: scaleAnim }],
				},
			]}
		>
			{sticker ? (
				<TouchableOpacity
					style={styles.touchableArea}
					onLayout={(event) => onLayout(index, event)}
					onPress={handleStickerPress}
					activeOpacity={0.7}
				>
					<StickerRenderer sticker={sticker.sticker} size={SIZES.stickerSlot} />
				</TouchableOpacity>
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
	stickerSlotValidDrop: {
		borderStyle: 'solid',
		borderColor: COLORS.border.light,
		backgroundColor: COLORS.border.light,
	},
	stickerSlotNumber: {
		fontSize: 16,
		color: COLORS.text.light,
	},
});

export default StickerSlotItem;

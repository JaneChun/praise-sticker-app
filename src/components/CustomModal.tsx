import { Portal } from '@gorhom/portal';
import { FC, useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { ModalProps } from 'react-native-modal';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

interface CustomModalProps extends Partial<ModalProps> {}

const CustomModal: FC<CustomModalProps> = ({
	isVisible,
	children,
	backdropOpacity = 0.5,
	onBackdropPress,
}) => {
	const opacity = useSharedValue(0);

	useEffect(() => {
		if (isVisible) {
			opacity.value = withTiming(1, { duration: 300 });
		} else {
			opacity.value = withTiming(0, { duration: 300 });
		}
	}, [isVisible, opacity]);

	const animatedStyle = useAnimatedStyle(() => {
		return {
			opacity: opacity.value,
		};
	});

	if (!isVisible) {
		return null;
	}

	return (
		<Portal>
			<Animated.View style={[styles.backdrop, animatedStyle]}>
				<Pressable style={StyleSheet.absoluteFillObject} onPress={onBackdropPress}>
					<View
						style={[
							StyleSheet.absoluteFillObject,
							{
								backgroundColor: `rgba(0, 0, 0, ${backdropOpacity})`,
							},
						]}
					/>
				</Pressable>
				<View style={styles.contentContainer} pointerEvents='box-none'>
					{children}
				</View>
			</Animated.View>
		</Portal>
	);
};

const styles = StyleSheet.create({
	backdrop: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		zIndex: 1000,
	},
	contentContainer: {
		width: '100%',
		height: '100%',
		justifyContent: 'center',
		alignItems: 'center',
		position: 'absolute',
	},
});

export default CustomModal;

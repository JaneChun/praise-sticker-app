import { useEffect, useRef } from 'react';
import { Animated, Dimensions } from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export function useParticleAnimation(delay: number, startX: number) {
	const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
	const translateX = useRef(new Animated.Value(0)).current;
	const rotate = useRef(new Animated.Value(0)).current;
	const opacity = useRef(new Animated.Value(0)).current;
	const scale = useRef(new Animated.Value(0.5)).current;

	useEffect(() => {
		const moveX = (Math.random() - 0.5) * 60;

		Animated.sequence([
			Animated.delay(delay),
			Animated.parallel([
				Animated.timing(opacity, {
					toValue: 1,
					duration: 300,
					useNativeDriver: true,
				}),
				Animated.timing(scale, {
					toValue: 1,
					duration: 500,
					useNativeDriver: true,
				}),
				Animated.timing(translateY, {
					toValue: SCREEN_HEIGHT / 3,
					duration: 1500,
					useNativeDriver: true,
				}),
				Animated.timing(translateX, {
					toValue: moveX,
					duration: 1500,
					useNativeDriver: true,
				}),
				Animated.timing(rotate, {
					toValue: 1,
					duration: 1500,
					useNativeDriver: true,
				}),
			]),
			Animated.parallel([
				Animated.timing(opacity, {
					toValue: 0,
					duration: 1000,
					useNativeDriver: true,
				}),
				Animated.timing(scale, {
					toValue: 0.3,
					duration: 1000,
					useNativeDriver: true,
				}),
				Animated.timing(translateY, {
					toValue: -SCREEN_HEIGHT / 10,
					duration: 1000,
					useNativeDriver: true,
				}),
			]),
		]).start();
	}, [delay, opacity, rotate, scale, translateX, translateY]);

	const rotateInterpolate = rotate.interpolate({
		inputRange: [0, 1],
		outputRange: ['0deg', '360deg'],
	});

	return {
		translateY,
		translateX,
		rotateInterpolate,
		opacity,
		scale,
	};
}

import * as Haptics from 'expo-haptics';
import { FC, useEffect, useState } from 'react';
import { Animated, Dimensions, Text, View } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface ParticleEffectProps {
	showParticleEffect: boolean;
	onComplete?: () => void;
}

const EMOJIS = [
	'🎉',
	'🔥',
	'✨',
	'🎀',
	'🌟',
	'💫',
	'🎈',
	'🎁',
	'🥂',
	'💖',
	'🌈',
	'⭐️',
	'💎',
	'💗',
	'🦋',
];

const ParticleEffect: FC<ParticleEffectProps> = ({
	showParticleEffect,
	onComplete,
}) => {
	const [particles, setParticles] = useState<
		Array<{
			x: Animated.Value;
			y: Animated.Value;
			opacity: Animated.Value;
			rotation: Animated.Value;
			emoji: string;
		}>
	>([]);

	const createRising = () => {
		const newParticles = [];
		const particleCount = 20; // 파티클 개수

		for (let i = 0; i < particleCount; i++) {
			// 화면을 3구역으로 나누어 균등 분배
			const animationType = i % 3; // 순차적으로 0, 1, 2 반복
			let startX, endX, endY, rotationDirection;

			switch (animationType) {
				case 0: // 왼쪽 구역에서 시작하여 왼쪽으로 휘어지며 올라가기
					startX = Math.random() * (screenWidth * 0.4); // 왼쪽 40% 구역
					endX = startX + (Math.random() - 0.8) * 120; // 왼쪽으로 더 치우치게
					endY = Math.random() * (screenHeight * 0.2) - 100; // 화면 상단 20%까지
					rotationDirection = -1;
					break;
				case 1: // 오른쪽 구역에서 시작하여 오른쪽으로 휘어지며 올라가기
					startX = screenWidth * 0.6 + Math.random() * (screenWidth * 0.4); // 오른쪽 40% 구역
					endX = startX + (Math.random() + 0.2) * 120; // 오른쪽으로 더 치우치게
					endY = Math.random() * (screenHeight * 0.2) - 100;
					rotationDirection = 1;
					break;
				default: // 중앙 구역에서 시작하여 중앙으로 직진하며 올라가기
					startX = screenWidth * 0.3 + Math.random() * (screenWidth * 0.4); // 중앙 40% 구역
					endX = startX + (Math.random() - 0.5) * 80; // 작은 좌우 움직임
					endY = Math.random() * (screenHeight * 0.15) - 150; // 더 높이
					rotationDirection = Math.random() > 0.5 ? 1 : -1; // 랜덤하게 시계/반시계 방향
			}

			const startY = screenHeight + 50;

			newParticles.push({
				x: new Animated.Value(startX),
				y: new Animated.Value(startY),
				opacity: new Animated.Value(0), // 처음엔 투명
				rotation: new Animated.Value(0), // 회전값 추가
				emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
				startX,
				startY,
				endX,
				endY,
				animationType,
				rotationDirection,
				delay: i * 100 + Math.random() * 100, // 순차적 + 랜덤 딜레이
				duration: 1800 + Math.random() * 400, // 애니메이션 시간 1.8~2.2초 (더 빠르게)
			});
		}

		setParticles(newParticles);

		const animations = newParticles.map((particle) => {
			const rotationValue = particle.rotationDirection * 360;

			return Animated.sequence([
				Animated.delay(particle.delay),
				Animated.parallel([
					// X축 이동
					Animated.timing(particle.x, {
						toValue: particle.endX,
						duration: particle.duration,
						useNativeDriver: false,
					}),
					// Y축 이동
					Animated.timing(particle.y, {
						toValue: particle.endY,
						duration: particle.duration,
						useNativeDriver: false,
					}),
					// 회전
					Animated.timing(particle.rotation, {
						toValue: rotationValue,
						duration: particle.duration,
						useNativeDriver: false,
					}),
					// 투명도 변화
					Animated.sequence([
						Animated.timing(particle.opacity, {
							toValue: 1,
							duration: particle.duration * 0.1,
							useNativeDriver: false,
						}),
						Animated.timing(particle.opacity, {
							toValue: 0,
							duration: particle.duration * 0.9,
							useNativeDriver: false,
						}),
					]),
				]),
			]);
		});

		// 연속 햅틱 효과
		const hapticPattern = [
			200, 400, 600, 800, 1000, 1200, 1400, 1600, 1800, 2000,
		]; // 진동 타이밍 (ms)

		hapticPattern.forEach((delay) => {
			setTimeout(() => {
				Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
			}, delay);
		});

		Animated.parallel(animations).start(() => {
			setParticles([]);
			onComplete?.();
		});
	};

	useEffect(() => {
		if (showParticleEffect) {
			// 파티클 효과 시작 시 성공 햅틱
			// Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
			createRising();
		}
	}, [showParticleEffect]);

	return (
		<View
			style={{
				position: 'absolute',
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				pointerEvents: 'none',
			}}
		>
			{particles.map((particle, index) => (
				<Animated.View
					key={index}
					style={{
						position: 'absolute',
						left: particle.x,
						top: particle.y,
						opacity: particle.opacity,
						transform: [
							{
								rotate: particle.rotation.interpolate({
									inputRange: [0, 360],
									outputRange: ['0deg', '360deg'],
								}),
							},
						],
					}}
				>
					<Text style={{ fontSize: 28 }}>{particle.emoji}</Text>
				</Animated.View>
			))}
		</View>
	);
};

export default ParticleEffect;

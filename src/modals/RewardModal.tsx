import { useCelebration } from '@/hooks/useCelebration';
import { useUIStore } from '@/store';
import { Portal } from '@gorhom/portal';
import { FC, useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../constants/colors';

const RewardModal: FC = () => {
	const reward = useUIStore((state) => state.reward);
	const setReward = useUIStore((state) => state.setReward);
	const isVisible = useUIStore((state) => state.rewardModalVisible);
	const setRewardModalVisible = useUIStore((state) => state.setRewardModalVisible);

	const { clearCelebration } = useCelebration();

	// 애니메이션 values
	const rewardPopupScale = useRef(new Animated.Value(0)).current;
	const rewardPopupOpacity = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		if (isVisible) {
			// Hero 애니메이션 실행
			Animated.parallel([
				Animated.spring(rewardPopupScale, {
					toValue: 1,
					useNativeDriver: true,
					tension: 100,
					friction: 8,
				}),
				Animated.timing(rewardPopupOpacity, {
					toValue: 1,
					duration: 300,
					useNativeDriver: true,
				}),
			]).start();
		}
	}, [isVisible]);

	const handleClose = () => {
		// 닫기 애니메이션
		Animated.parallel([
			Animated.timing(rewardPopupScale, {
				toValue: 0,
				duration: 200,
				useNativeDriver: true,
			}),
			Animated.timing(rewardPopupOpacity, {
				toValue: 0,
				duration: 200,
				useNativeDriver: true,
			}),
		]).start(() => {
			// 애니메이션 값 리셋
			rewardPopupScale.setValue(0);
			rewardPopupOpacity.setValue(0);

			// 애니메이션 종료 후 초기화
			setReward(null);
			setRewardModalVisible(false);
			clearCelebration();
		});
	};

	if (!isVisible) return null;

	return (
		<Portal>
			<Pressable style={styles.rewardPopupOverlay}>
				<Animated.View
					style={[
						styles.rewardPopupContent,
						{
							transform: [{ scale: rewardPopupScale }],
							opacity: rewardPopupOpacity,
						},
					]}
				>
					<Text style={styles.giftEmoji}>🎁</Text>
					<View style={styles.rewardContainer}>
						<Text style={styles.rewardLabel}> 보상</Text>
						<Text style={styles.rewardText}>{reward}🩷</Text>
					</View>
					<TouchableOpacity style={styles.celebrationButton} onPress={handleClose}>
						<Text style={styles.celebrationButtonText}>계속하기</Text>
					</TouchableOpacity>
				</Animated.View>
			</Pressable>
		</Portal>
	);
};

const styles = StyleSheet.create({
	rewardPopupOverlay: {
		backgroundColor: `rgba(0, 0, 0, 0.5)`,
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		alignItems: 'center',
		justifyContent: 'center',
	},
	rewardPopupContent: {
		backgroundColor: COLORS.background.primary,
		borderRadius: 18,
		padding: 32,
		alignItems: 'center',
		maxWidth: 280,
		width: '90%',
	},
	giftEmoji: {
		fontSize: 80,
	},
	rewardContainer: {
		backgroundColor: COLORS.background.light,
		borderRadius: 12,
		padding: 16,
		marginVertical: 24,
		width: '100%',
		alignItems: 'center',
	},
	rewardLabel: {
		fontSize: 16,
		color: COLORS.text.secondary,
		fontWeight: '600',
		marginBottom: 8,
	},
	rewardText: {
		fontSize: 16,
		color: COLORS.primary,
		fontWeight: '700',
		textAlign: 'center',
	},
	celebrationButton: {
		backgroundColor: COLORS.primary,
		paddingHorizontal: 32,
		paddingVertical: 12,
		borderRadius: 25,
	},
	celebrationButtonText: {
		color: COLORS.text.white,
		fontSize: 16,
		fontWeight: '600',
	},
});

export default RewardModal;

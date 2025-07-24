import CustomModal from '@/components/CustomModal';
import ParticleEffect from '@/components/ParticleEffect';
import { useCelebration } from '@/hooks/useCelebration';
import { useUIStore } from '@/store';
import { FC, useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../constants/colors';
import { FINAL_MESSAGES } from '../constants/data';

const CelebrationModal: FC = ({}) => {
	const { celebrationData, clearCelebration } = useCelebration();
	const celebrationVisible = useUIStore((state) => state.celebrationVisible);

	const reward = useUIStore((state) => state.reward);
	const setReward = useUIStore((state) => state.setReward);
	const setRewardModalVisible = useUIStore((state) => state.setRewardModalVisible);

	const [showParticleEffect, setShowParticleEffect] = useState<boolean>(false);

	// 축하 모달이 열릴 때 파티클 효과 실행
	useEffect(() => {
		if (!celebrationVisible || !celebrationData) {
			return;
		}

		const isFinalMessage = FINAL_MESSAGES.some(
			(message) => message.title === celebrationData.title,
		);

		// 최종 완료 메시지인 경우에만 파티클 효과 실행
		if (!isFinalMessage) return;
		setShowParticleEffect(isFinalMessage);

		// 보상이 있는 경우에만 보상 팝업 표시
		const rewardData = celebrationData?.reward;
		if (!rewardData) return;

		setReward(rewardData);
	}, [celebrationVisible, celebrationData]);

	const handleClose = () => {
		// 애니메이션이 진행 중이면 닫기 금지
		if (showParticleEffect) return;

		setShowParticleEffect(false);
		clearCelebration();
	};

	const handleRewardOpen = () => {
		handleClose();
		setRewardModalVisible(true); // 보상 모달 열기
	};

	return (
		<CustomModal isVisible={celebrationVisible} backdropOpacity={0.5}>
			<View style={styles.overlay}>
				<View style={styles.celebrationContent}>
					<View style={styles.celebrationIcon}>
						<Text style={styles.celebrationIconText}>{celebrationData?.icon}</Text>
					</View>
					<Text style={styles.celebrationTitle}>{celebrationData?.title}</Text>
					{celebrationData?.subtitle && (
						<Text style={styles.celebrationSubtitle}>{celebrationData.subtitle}</Text>
					)}
					<Text style={styles.celebrationDescription}>{celebrationData?.description}</Text>
					{!showParticleEffect && (
						<TouchableOpacity
							style={[
								styles.celebrationButton,
								{
									backgroundColor: reward ? COLORS.secondary : COLORS.primary,
								},
							]}
							onPress={reward ? handleRewardOpen : handleClose}
						>
							<Text style={styles.celebrationButtonText}>{reward ? '보상 열기' : '계속하기'}</Text>
						</TouchableOpacity>
					)}
				</View>
			</View>

			<ParticleEffect
				showParticleEffect={showParticleEffect}
				onComplete={() => setShowParticleEffect(false)}
			/>
		</CustomModal>
	);
};

const styles = StyleSheet.create({
	overlay: {
		alignItems: 'center',
		justifyContent: 'center',
	},
	celebrationContent: {
		backgroundColor: COLORS.background.primary,
		borderRadius: 18,
		padding: 40,
		alignItems: 'center',
		minWidth: 240,
		maxWidth: 280,
	},
	celebrationIcon: {
		width: 80,
		height: 80,
		backgroundColor: COLORS.background.light,
		borderRadius: 40,
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: 20,
	},
	celebrationIconText: {
		fontSize: 36,
		color: COLORS.text.white,
	},
	celebrationTitle: {
		fontSize: 20,
		fontWeight: '700',
		color: COLORS.text.primary,
		marginBottom: 8,
		textAlign: 'center',
	},
	celebrationSubtitle: {
		fontSize: 16,
		color: COLORS.primary,
		fontWeight: '600',
		marginBottom: 16,
	},
	celebrationDescription: {
		fontSize: 14,
		color: COLORS.text.secondary,
		lineHeight: 20,
		textAlign: 'center',
		marginBottom: 24,
	},
	celebrationButton: {
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

export default CelebrationModal;

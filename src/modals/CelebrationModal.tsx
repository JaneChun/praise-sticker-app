import ParticleEffect from '@/components/ParticleEffect';
import { useCelebration } from '@/hooks/useCelebration';
import { useUIStore } from '@/store';
import { useChallengeStore } from '@/store/useChallengeStore';
import { FC, useEffect, useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../constants/colors';
import { FINAL_MESSAGES } from '../constants/data';
import RewardModal from './RewardModal';

const CelebrationModal: FC = ({}) => {
	const { celebrationData, clearCelebration } = useCelebration();
	const { celebrationVisible, rewardModalVisible, setRewardModalVisible } = useUIStore();
	const { selectedChallengeId, challenges } = useChallengeStore();

	const [showParticleEffect, setShowParticleEffect] = useState<boolean>(false);
	const [showRewardPopup, setShowRewardPopup] = useState<boolean>(false);

	// 현재 챌린지 정보 가져오기
	const currentChallenge = challenges.find(
		(challenge) => challenge.id === selectedChallengeId,
	);

	// 축하 모달이 열릴 때 파티클 효과 실행
	useEffect(() => {
		if (celebrationVisible && celebrationData) {
			// 최종 완료 메시지인 경우에만 파티클 효과 실행
			const isFinalMessage = FINAL_MESSAGES.some(
				(message) => message.title === celebrationData.title,
			);

			setShowParticleEffect(isFinalMessage);
			if (currentChallenge?.reward) {
				setShowRewardPopup(true);
			}
		} else {
			setShowParticleEffect(false);
		}
	}, [celebrationVisible, celebrationData]);

	const handleClose = () => {
		// 애니메이션이 진행 중이면 닫기 금지
		if (showParticleEffect) return;

		setShowParticleEffect(false);
		setShowRewardPopup(false);
		clearCelebration();
	};

	const handleRewardOpen = () => {
		setRewardModalVisible(true);
	};

	const handleRewardClose = () => {
		setRewardModalVisible(false);
		handleClose();
	};

	return (
		<Modal visible={celebrationVisible} transparent animationType='fade'>
			<View style={styles.overlay}>
				<View style={styles.celebrationContent}>
					<View style={styles.celebrationIcon}>
						<Text style={styles.celebrationIconText}>
							{celebrationData?.icon}
						</Text>
					</View>
					<Text style={styles.celebrationTitle}>{celebrationData?.title}</Text>
					{celebrationData?.subtitle && (
						<Text style={styles.celebrationSubtitle}>
							{celebrationData.subtitle}
						</Text>
					)}
					<Text style={styles.celebrationDescription}>
						{celebrationData?.description}
					</Text>
					{!showParticleEffect && (
						<TouchableOpacity
							style={[
								styles.celebrationButton,
								{
									backgroundColor: showRewardPopup
										? COLORS.secondary
										: COLORS.primary,
								},
							]}
							onPress={showRewardPopup ? handleRewardOpen : handleClose}
						>
							<Text style={styles.celebrationButtonText}>
								{showRewardPopup ? '보상 열기' : '계속하기'}
							</Text>
						</TouchableOpacity>
					)}
				</View>
			</View>

			{/* 파티클 효과 */}
			<ParticleEffect
				showParticleEffect={showParticleEffect}
				onComplete={() => setShowParticleEffect(false)}
			/>

			{/* 보상 팝업 */}
			<RewardModal
				visible={rewardModalVisible}
				reward={currentChallenge?.reward || ''}
				onClose={handleRewardClose}
			/>
		</Modal>
	);
};

const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		backgroundColor: COLORS.background.opacity,
		alignItems: 'center',
		justifyContent: 'center',
	},
	celebrationContent: {
		backgroundColor: COLORS.background.primary,
		borderRadius: 18,
		padding: 40,
		alignItems: 'center',
		maxWidth: 280,
		width: '90%',
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

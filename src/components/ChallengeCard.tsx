import { getChallengeProgress } from '@/services';
import { Entypo, FontAwesome6 } from '@expo/vector-icons';
import { FC, useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../constants/colors';
import { SIZES } from '../constants/dimensions';
import { useUIStore } from '../store';
import { Challenge } from '../types';

interface ChallengeCardProps {
	challenge?: Challenge;
	isNew?: boolean;
	onPress: () => void;
	onLongPress?: () => void;
	refreshTrigger?: boolean;
}

const ChallengeCard: FC<ChallengeCardProps> = ({
	challenge,
	isNew = false,
	onPress,
	onLongPress,
	refreshTrigger,
}) => {
	const currentView = useUIStore((state) => state.currentView);
	const [progressText, setProgressText] = useState('');
	const [completedDays, setCompletedDays] = useState(0);

	useEffect(() => {
		if (challenge?.id) {
			getChallengeProgress(challenge.id).then((progress) => {
				setProgressText(progress.progressText);
				setCompletedDays(progress.completedDays);
			});
		}
	}, [challenge, refreshTrigger]);

	if (isNew) {
		return (
			<TouchableOpacity style={[styles.challengeCard, styles.newChallenge]} onPress={onPress}>
				<Text style={styles.challengeIcon}>
					<Entypo name='plus' size={32} color={COLORS.text.secondary} />
				</Text>
				<Text style={styles.challengeTitle}>새 미션 만들기</Text>
				<Text style={styles.challengeProgress}>지금 시작해보세요</Text>
			</TouchableOpacity>
		);
	}

	const isCompleted = completedDays >= (challenge?.days || 0);

	return (
		<TouchableOpacity
			style={[
				styles.challengeCard,
				styles.challengeExisting,
				isCompleted && styles.challengeCompleted,
			]}
			onPress={onPress}
			onLongPress={onLongPress}
		>
			<Text style={styles.challengeIcon}>{challenge?.icon}</Text>
			<Text
				numberOfLines={currentView === 'card' ? 2 : 1}
				ellipsizeMode='tail'
				style={styles.challengeTitle}
			>
				{challenge?.title || 'Unknown'}
			</Text>

			{currentView === 'card' ? (
				<View style={styles.challengeProgressContainer}>
					{isCompleted ? (
						<FontAwesome6 name='award' style={styles.medalIcon} />
					) : (
						<FontAwesome6 name='fire' style={styles.fireIcon} />
					)}
					<Text style={styles.challengeProgress}>{isCompleted ? '완료' : progressText}</Text>
				</View>
			) : (
				<View style={styles.miniGrid}>
					{Array(Math.min(challenge?.days || 30, 30))
						.fill(null)
						.map((_, index) => (
							<View
								key={index}
								style={[styles.miniDot, index < completedDays && styles.miniDotFilled]}
							/>
						))}
				</View>
			)}
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	challengeCard: {
		width: SIZES.challengeCard,
		height: SIZES.challengeCard,
		borderRadius: 16,
		padding: 16,
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: 16,
		backgroundColor: COLORS.background.primary,
	},
	newChallenge: {
		backgroundColor: COLORS.background.secondary,
		borderWidth: 2,
		borderColor: COLORS.border.secondary,
		borderStyle: 'dashed',
	},
	challengeExisting: {
		backgroundColor: COLORS.background.primary,
		elevation: 4,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 8,
	},
	challengeIcon: {
		fontSize: 32,
		marginBottom: 8,
	},
	challengeTitle: {
		fontSize: 16,
		fontWeight: '600',
		textAlign: 'center',
		marginBottom: 8,
		color: COLORS.text.primary,
	},
	challengeProgressContainer: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	challengeProgress: {
		fontSize: 14,
		opacity: 0.7,
		textAlign: 'center',
		color: COLORS.text.secondary,
	},
	fireIcon: {
		marginRight: 2,
		fontSize: 12,
		color: COLORS.text.light,
	},
	medalIcon: {
		marginRight: 3,
		fontSize: 13,
		color: COLORS.primary,
	},
	miniGrid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		width: SIZES.miniGrid,
		gap: 2,
	},
	miniDot: {
		width: SIZES.miniDot,
		height: SIZES.miniDot,
		borderRadius: 1,
		backgroundColor: COLORS.border.primary,
		marginBottom: 2,
	},
	miniDotFilled: {
		backgroundColor: COLORS.secondary,
	},
	challengeCompleted: {
		backgroundColor: COLORS.primary_light,
		borderWidth: 2,
		borderColor: COLORS.primary,
	},
});

export default ChallengeCard;

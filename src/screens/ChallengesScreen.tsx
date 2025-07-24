import { useCelebration } from '@/hooks/useCelebration';
import RewardModal from '@/modals/RewardModal';
import { useFocusEffect } from '@react-navigation/native';
import { FC, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { COLORS } from '../constants/colors';
import CelebrationModal from '../modals/CelebrationModal';
import CreateChallengeModal from '../modals/CreateChallengeModal';
import ChallengesPage from '../pages/ChallengesPage';
import { useChallengeStore, useUIStore } from '../store';

const ChallengesScreen: FC = () => {
	const { editingChallengeId, challenges } = useChallengeStore();

	const createChallengeVisible = useUIStore(
		(state) => state.createChallengeVisible,
	);
	const editChallengeVisible = useUIStore(
		(state) => state.editChallengeVisible,
	);
	const setCreateChallengeVisible = useUIStore(
		(state) => state.setCreateChallengeVisible,
	);
	const setEditChallengeVisible = useUIStore(
		(state) => state.setEditChallengeVisible,
	);
	const celebrationVisible = useUIStore((state) => state.celebrationVisible);
	const setCelebrationVisible = useUIStore(
		(state) => state.setCelebrationVisible,
	);

	const { celebrationData, clearCelebration } = useCelebration();

	useFocusEffect(
		useCallback(() => {
			if (celebrationData && !celebrationVisible) {
				setCelebrationVisible(true);
			}

			return () => {
				clearCelebration();
			};
		}, [celebrationData, setCelebrationVisible]),
	);

	return (
		<View style={styles.container}>
			<ChallengesPage />

			<CreateChallengeModal
				visible={createChallengeVisible}
				setVisible={setCreateChallengeVisible}
			/>

			<CreateChallengeModal
				visible={editChallengeVisible}
				setVisible={setEditChallengeVisible}
				editMode={true}
				existingChallenge={challenges.find(
					({ id }) => id === editingChallengeId,
				)}
			/>

			<CelebrationModal />

			<RewardModal />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: COLORS.background.primary,
	},
});

export default ChallengesScreen;

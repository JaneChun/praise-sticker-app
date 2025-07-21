import { useCelebration } from '@/hooks/useCelebration';
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

	const {
		createChallengeVisible,
		editChallengeVisible,
		setCreateChallengeVisible,
		setEditChallengeVisible,
		setCelebrationVisible,
	} = useUIStore();

	const { celebrationData } = useCelebration();

	useFocusEffect(
		useCallback(() => {
			if (celebrationData) {
				setCelebrationVisible(true);
			}
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

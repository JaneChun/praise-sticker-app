import { useCelebrationStore } from '@/store/useCelebrationStore';
import { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { COLORS } from '../constants/colors';
import CelebrationModal from '../modals/CelebrationModal';
import CreateChallengeModal from '../modals/CreateChallengeModal';
import StickerPageModal from '../modals/StickerPageModal';
import ChallengesPage from '../pages/ChallengesPage';
import { useChallengeStore, useUIStore } from '../store';

const ChallengesScreen: FC = () => {
	const { selectedChallengeId, editingChallengeId, challenges } =
		useChallengeStore();

	const { celebrationData } = useCelebrationStore();

	const {
		createChallengeVisible,
		editChallengeVisible,
		stickerPageVisible,
		celebrationVisible,
		setCreateChallengeVisible,
		setEditChallengeVisible,
		setStickerPageVisible,
		setCelebrationVisible,
	} = useUIStore();

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

			<StickerPageModal
				visible={stickerPageVisible}
				setVisible={setStickerPageVisible}
				currentChallenge={
					challenges.find(({ id }) => id == selectedChallengeId) || null
				}
			/>

			<CelebrationModal
				visible={celebrationVisible}
				setVisible={setCelebrationVisible}
				celebrationData={celebrationData}
			/>
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

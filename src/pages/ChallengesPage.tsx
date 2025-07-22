import { Entypo } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { FC, useCallback, useState } from 'react';
import {
	Alert,
	ColorValue,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ActionSheet from '../components/ActionSheet';
import ChallengeCard from '../components/ChallengeCard';
import ViewToggle from '../components/ViewToggle';
import { COLORS } from '../constants/colors';
import { StackParamList } from '../navigation/StackNavigator';
import { deleteChallenge } from '../services/challengeService';
import { useChallengeStore, useDatabaseStore, useUIStore } from '../store';
import { ActionSheetOption } from '../types';

type NavigationProp = NativeStackNavigationProp<StackParamList>;

const ChallengesPage: FC = () => {
	const navigation = useNavigation<NavigationProp>();

	const {
		selectedChallengeId,
		setSelectedChallengeId,
		setEditingChallengeId,
		challenges,
		loadChallenges,
	} = useChallengeStore();

	const setCreateChallengeVisible = useUIStore(
		(state) => state.setCreateChallengeVisible,
	);
	const setEditChallengeVisible = useUIStore(
		(state) => state.setEditChallengeVisible,
	);
	const { resetDatabase, isInitialized } = useDatabaseStore();

	const insets = useSafeAreaInsets();
	const [actionSheetVisible, setActionSheetVisible] = useState(false);
	const [refreshTrigger, setRefreshTrigger] = useState<boolean>(false);

	// 화면이 포커스될 때마다 카드 새로고침
	useFocusEffect(
		useCallback(() => {
			if (!isInitialized) return;

			const fetchChallenges = async () => {
				await loadChallenges();
				setRefreshTrigger((prev) => !prev);
			};

			fetchChallenges();
		}, [isInitialized, loadChallenges]),
	);

	// 카드 Press 핸들러
	const handleChallengePress = (challengeId: string) => {
		const currentChallenge = challenges.find(({ id }) => id === challengeId);
		if (currentChallenge) {
			navigation.navigate('StickerPage', { currentChallenge });
		}
	};

	// 카드 LongPress 핸들러
	const handleChallengeLongPress = (challengeId: string) => {
		setSelectedChallengeId(challengeId);
		setActionSheetVisible(true);
	};

	const handleChallengeEdit = (challengeId: string) => {
		setEditingChallengeId(challengeId);
		setEditChallengeVisible(true);
	};

	const handleChallengeDelete = async (challengeId: string) => {
		const challenge = challenges.find(({ id }) => id === challengeId);
		if (!challenge) return;

		Alert.alert(
			'미션 삭제',
			`"${challenge.title}" 미션을 정말 삭제하시겠습니까?\n삭제된 미션은 복구할 수 없습니다.`,
			[
				{ text: '취소', style: 'cancel' },
				{
					text: '삭제',
					style: 'destructive',
					onPress: async () => {
						try {
							await deleteChallenge(challengeId);
							await loadChallenges();
							Alert.alert('삭제 완료', '미션이 삭제되었습니다.');
						} catch (error) {
							console.error('Error deleting challenge:', error);
							Alert.alert('오류', '미션 삭제에 실패했습니다.');
						}
					},
				},
			],
		);
	};

	const actionSheetOptions: ActionSheetOption[] = [
		{
			title: '수정',
			onPress: () => {
				if (selectedChallengeId) {
					handleChallengeEdit(selectedChallengeId);
				}
			},
		},
		{
			title: '삭제',
			destructive: true,
			onPress: () => {
				if (selectedChallengeId) {
					handleChallengeDelete(selectedChallengeId);
				}
			},
		},
	];

	return (
		<View style={styles.container}>
			<ScrollView style={styles.scrollContainer}>
				<LinearGradient
					colors={COLORS.gradients.secondary as [ColorValue, ColorValue]}
					style={[styles.header, { paddingTop: insets.top + 20 }]}
					start={{ x: 0, y: 0.3 }}
				>
					<View style={styles.headerTop}>
						<View>
							<Text style={styles.headerTitle}>칭찬 스티커판</Text>
							<Text style={styles.headerSubtitle}>
								작은 성취도 소중한 발걸음이에요
							</Text>
						</View>
						<ViewToggle />
					</View>
				</LinearGradient>

				<View style={styles.challengesGrid}>
					{challenges.length === 0 && (
						<ChallengeCard
							isNew={true}
							onPress={() => setCreateChallengeVisible(true)}
						/>
					)}
					{challenges?.map((challenge) => (
						<ChallengeCard
							key={challenge.id}
							challenge={challenge}
							onPress={() => handleChallengePress(challenge.id)}
							onLongPress={() => handleChallengeLongPress(challenge.id)}
							refreshTrigger={refreshTrigger}
						/>
					))}
				</View>
			</ScrollView>

			{/* <Button title='test' onPress={() => runTestScenario()} /> */}

			{/* 플로팅 버튼 */}
			<TouchableOpacity
				style={[styles.floatingButton, { bottom: insets.bottom }]}
				onPress={() => setCreateChallengeVisible(true)}
			>
				<Entypo name='plus' size={32} color={COLORS.text.white} />
			</TouchableOpacity>

			{/* 액션 시트 */}
			<ActionSheet
				visible={actionSheetVisible}
				onClose={() => {
					setActionSheetVisible(false);
					setSelectedChallengeId(null);
				}}
				options={actionSheetOptions}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: COLORS.background.primary,
	},
	scrollContainer: {
		flex: 1,
	},
	header: {
		padding: 20,
		paddingTop: 40,
	},
	headerTop: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
	},
	headerTitle: {
		fontSize: 24,
		fontWeight: '700',
		color: COLORS.text.white,
		marginBottom: 8,
	},
	headerSubtitle: {
		fontSize: 14,
		color: COLORS.text.white,
		opacity: 0.9,
	},
	challengesGrid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		padding: 20,
		justifyContent: 'space-between',
	},
	floatingButton: {
		position: 'absolute',
		right: 20,
		width: 56,
		height: 56,
		borderRadius: 28,
		backgroundColor: COLORS.primary,
		justifyContent: 'center',
		alignItems: 'center',
		elevation: 8,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 6,
	},
});

export default ChallengesPage;

import { LinearGradient } from 'expo-linear-gradient';
import { FC, useEffect } from 'react';
import {
	Alert,
	ColorValue,
	KeyboardAvoidingView,
	Modal,
	Platform,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../constants/colors';
import { CHALLENGE_DURATIONS, CHALLENGE_ICONS } from '../constants/data';
import { SCREEN_WIDTH } from '../constants/dimensions';
import { useChallengeForm } from '../hooks/useChallengeForm';
import { createChallenge, updateChallenge } from '../services/challengeService';

import { useChallengeStore } from '../store';
import { CreateChallengeModalProps } from '../types';

const CreateChallengeModal: FC<CreateChallengeModalProps> = ({
	visible,
	setVisible,
	editMode = false,
	existingChallenge,
}) => {
	const { loadChallenges } = useChallengeStore();

	const insets = useSafeAreaInsets();

	const {
		challengeTitle,
		setChallengeTitle,
		challengeReward,
		setChallengeReward,
		selectedDays,
		setSelectedDays,
		selectedIcon,
		setSelectedIcon,
		customDays,
		setCustomDays,
		showCustomDays,
		setShowCustomDays,
		resetForm,
		setInitialValues,
		isValid,
		getFinalDays,
	} = useChallengeForm();

	// 수정 모드일 때 기존 값으로 초기화
	useEffect(() => {
		if (editMode && existingChallenge && visible) {
			setInitialValues(existingChallenge);
		} else if (!editMode && visible) {
			resetForm();
		}
	}, [editMode, existingChallenge, visible]);

	const handleSubmit = async (): Promise<void> => {
		if (!isValid) {
			Alert.alert('알림', '미션 이름을 입력해주세요.');
			return;
		}

		try {
			const finalDays = getFinalDays();

			if (editMode && existingChallenge) {
				// 수정 모드
				await updateChallenge(
					existingChallenge.id,
					challengeTitle.trim(),
					selectedIcon,
					finalDays,
					challengeReward.trim() || null,
				);
				Alert.alert('수정 완료', `"${challengeTitle}" 미션이 수정되었습니다.`);
			} else {
				// 생성 모드
				await createChallenge(
					challengeTitle.trim(),
					selectedIcon,
					finalDays,
					challengeReward.trim() || null,
				);
				Alert.alert(
					'생성 완료',
					`"${challengeTitle}" 미션이 생성되었습니다.\n${finalDays}일 동안 화이팅! 🎯`,
				);
			}

			// 도전 목록 새로고침
			await loadChallenges();

			resetForm();
			setVisible(false);
		} catch (error) {
			console.error('Error saving challenge:', error);
			Alert.alert(
				'오류',
				editMode ? '미션 수정에 실패했습니다.' : '미션 생성에 실패했습니다.',
			);
		}
	};

	const handleClose = () => {
		setVisible(false);
		resetForm();
	};

	return (
		<Modal
			visible={visible}
			animationType='slide'
			presentationStyle='pageSheet'
			onRequestClose={handleClose}
		>
			<KeyboardAvoidingView
				style={styles.container}
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
				keyboardVerticalOffset={insets.bottom}
			>
				<LinearGradient
					colors={COLORS.gradients.primary as [ColorValue, ColorValue]}
					style={[styles.header, { paddingTop: insets.top }]}
					start={{ x: 0, y: 0.3 }}
				>
					{/* 드래그 인디케이터 */}
					<View style={styles.dragIndicator} />

					<Text style={styles.headerTitle}>
						{editMode ? '칭찬 미션 수정하기' : '칭찬 미션 만들기'}
					</Text>
					<Text style={styles.headerSubtitle}>
						{editMode
							? '목표를 자유롭게 수정할 수 있어요'
							: '나만의 목표를 설정해보세요'}
					</Text>
				</LinearGradient>

				<ScrollView
					style={styles.createForm}
					keyboardShouldPersistTaps='handled'
				>
					<View style={styles.formSection}>
						<Text style={styles.formLabel}>어떤 목표를 세워볼까요? *</Text>
						<TextInput
							style={styles.formInput}
							placeholder='예: 매일 물 2L 마시기'
							placeholderTextColor={COLORS.text.placeholder}
							value={challengeTitle}
							onChangeText={(text) => setChallengeTitle(text)}
							maxLength={20}
						/>
						<Text style={styles.formHint}>작은 목표라도 좋아요</Text>
					</View>

					<View style={styles.formSection}>
						<Text style={styles.formLabel}>얼마나 이어가 보고 싶나요?</Text>
						<View style={styles.daysSelector}>
							{CHALLENGE_DURATIONS.map((days) => (
								<TouchableOpacity
									key={days}
									style={[
										styles.daysBtn,
										selectedDays === days && styles.daysBtnActive,
									]}
									onPress={() => {
										setSelectedDays(days);
										setShowCustomDays(false);
									}}
								>
									<Text
										style={[
											styles.daysBtnText,
											selectedDays === days && styles.daysBtnTextActive,
										]}
									>
										{days}일
									</Text>
								</TouchableOpacity>
							))}
							<TouchableOpacity
								style={[
									styles.daysBtn,
									selectedDays === 'custom' && styles.daysBtnActive,
								]}
								onPress={() => {
									setSelectedDays('custom');
									setShowCustomDays(true);
								}}
							>
								<Text
									style={[
										styles.daysBtnText,
										selectedDays === 'custom' && styles.daysBtnTextActive,
									]}
								>
									직접입력
								</Text>
							</TouchableOpacity>
						</View>
						{showCustomDays && (
							<TextInput
								style={styles.formInput}
								placeholder='원하는 일수를 입력해주세요'
								placeholderTextColor={COLORS.text.placeholder}
								value={customDays}
								onChangeText={setCustomDays}
								keyboardType='numeric'
							/>
						)}
					</View>

					<View style={styles.formSection}>
						<Text style={styles.formLabel}>아이콘</Text>
						<View style={styles.iconSelector}>
							{CHALLENGE_ICONS.map((icon) => (
								<TouchableOpacity
									key={icon}
									style={[
										styles.iconItem,
										selectedIcon === icon && styles.iconItemActive,
									]}
									onPress={() => setSelectedIcon(icon)}
								>
									<Text style={styles.iconItemText}>{icon}</Text>
								</TouchableOpacity>
							))}
						</View>
					</View>

					<View style={styles.formSection}>
						<Text style={styles.formLabel}>칭찬 스티커를 다 모은 보상 💝</Text>
						<TextInput
							style={styles.formInput}
							placeholder='예: 맛있는 디저트 먹기, 갖고 싶은 것 사기'
							placeholderTextColor={COLORS.text.placeholder}
							value={challengeReward}
							onChangeText={setChallengeReward}
							maxLength={30}
						/>
						<Text style={styles.formHint}>
							스티커 다 모으면 받을 나만의 보상을 생각해봐요 :)
						</Text>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>

			<View style={styles.createActions}>
				<TouchableOpacity style={styles.cancelBtn} onPress={handleClose}>
					<Text style={styles.cancelBtnText}>취소</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={[styles.createBtn, !isValid && styles.createBtnDisabled]}
					onPress={handleSubmit}
					disabled={!isValid}
				>
					<Text style={styles.createBtnText}>
						{editMode ? '수정 완료' : '미션 시작하기'}
					</Text>
				</TouchableOpacity>
			</View>
		</Modal>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: COLORS.background.primary,
	},
	header: {
		padding: 20,
		paddingTop: 40,
	},
	dragIndicator: {
		position: 'absolute',
		top: 10,
		width: 60,
		height: 4,
		backgroundColor: 'rgba(255, 255, 255, 0.3)',
		borderRadius: 2,
		alignSelf: 'center',
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
	createForm: {
		flex: 1,
		padding: 20,
	},
	formSection: {
		marginBottom: 40,
	},
	formLabel: {
		fontSize: 16,
		fontWeight: '600',
		color: COLORS.text.primary,
		marginBottom: 8,
	},
	formInput: {
		borderWidth: 2,
		borderColor: COLORS.border.primary,
		borderRadius: 12,
		padding: 14,
		fontSize: 16,
		backgroundColor: COLORS.background.primary,
	},
	formHint: {
		fontSize: 14,
		color: COLORS.text.light,
		marginTop: 8,
		marginLeft: 6,
		lineHeight: 20,
	},
	daysSelector: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		marginBottom: 12,
	},
	daysBtn: {
		paddingHorizontal: 16,
		paddingVertical: 10,
		borderWidth: 2,
		borderColor: COLORS.border.primary,
		borderRadius: 20,
		backgroundColor: COLORS.background.primary,
		marginRight: 8,
		marginBottom: 8,
	},
	daysBtnActive: {
		backgroundColor: COLORS.primary,
		borderColor: COLORS.primary,
	},
	daysBtnText: {
		fontSize: 14,
		fontWeight: '500',
		color: COLORS.text.secondary,
	},
	daysBtnTextActive: {
		color: COLORS.text.white,
	},
	iconSelector: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'space-between',
	},
	iconItem: {
		width: (SCREEN_WIDTH - 80) / 6,
		height: (SCREEN_WIDTH - 80) / 6,
		borderWidth: 2,
		borderColor: COLORS.border.primary,
		borderRadius: 12,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: COLORS.background.primary,
		marginBottom: 12,
	},
	iconItemActive: {
		borderColor: COLORS.primary,
		backgroundColor: '#f0f4ff',
	},
	iconItemText: {
		fontSize: 24,
	},
	createActions: {
		flexDirection: 'row',
		padding: 20,
		backgroundColor: COLORS.background.primary,
	},
	cancelBtn: {
		flex: 1,
		padding: 16,
		borderWidth: 2,
		borderColor: COLORS.border.primary,
		borderRadius: 12,
		backgroundColor: COLORS.background.primary,
		marginRight: 12,
		alignItems: 'center',
	},
	cancelBtnText: {
		fontSize: 16,
		fontWeight: '600',
		color: COLORS.text.secondary,
	},
	createBtn: {
		flex: 2,
		padding: 16,
		borderRadius: 12,
		backgroundColor: COLORS.primary,
		alignItems: 'center',
	},
	createBtnDisabled: {
		backgroundColor: '#ccc',
	},
	createBtnText: {
		fontSize: 16,
		fontWeight: '600',
		color: COLORS.text.white,
	},
});

export default CreateChallengeModal;

import BottomSheet, {
	BottomSheetBackdrop,
	BottomSheetHandle,
	BottomSheetScrollView,
	BottomSheetView,
} from '@gorhom/bottom-sheet';
import { Portal } from '@gorhom/portal';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { LinearGradient } from 'expo-linear-gradient';
import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
	Alert,
	ColorValue,
	Keyboard,
	KeyboardAvoidingView,
	Platform,
	Pressable,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';
import { COLORS } from '../constants/colors';
import { CHALLENGE_DURATIONS } from '../constants/data';
import { useChallengeForm } from '../hooks/useChallengeForm';
import { createChallenge, updateChallenge } from '../services/challengeService';

import EmojiSelector from 'react-native-emoji-selector';
import Modal from 'react-native-modal';
import { useChallengeStore } from '../store';
import { CreateChallengeModalProps } from '../types';

const CreateChallengeModal: FC<CreateChallengeModalProps> = ({
	visible,
	setVisible,
	editMode = false,
	existingChallenge,
}) => {
	const { loadChallenges } = useChallengeStore();
	const bottomSheetRef = useRef<BottomSheet>(null);
	const bottomTabBarHeight = useBottomTabBarHeight();

	const [showEmojiSelector, setShowEmojiSelector] = useState<boolean>(false);

	// Bottom sheet snap points
	const snapPoints = useMemo(() => ['90%'], []);

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

	// Visible 상태에 따라 bottom sheet 열기/닫기
	useEffect(() => {
		if (visible) {
			bottomSheetRef.current?.expand();
		} else {
			bottomSheetRef.current?.close();
			Keyboard.dismiss();
		}
	}, [visible]);

	// 수정 모드일 때 기존 값으로 초기화
	useEffect(() => {
		if (editMode && existingChallenge && visible) {
			setInitialValues(existingChallenge);
		} else if (!editMode && visible) {
			resetForm();
		}
	}, [editMode, existingChallenge, visible]);

	const handleSubmit = async (): Promise<void> => {
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
			} else {
				// 생성 모드
				await createChallenge(
					challengeTitle.trim(),
					selectedIcon,
					finalDays,
					challengeReward.trim() || null,
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

	const handleClose = useCallback(() => {
		bottomSheetRef.current?.close();
	}, []);

	// 닫힘 감지
	const handleSheetChanges = useCallback(
		(index: number) => {
			if (index === -1) {
				setVisible(false);
				setShowEmojiSelector(false);
				resetForm();
			}
		},
		[resetForm, setVisible],
	);

	const renderBackdrop = useCallback(
		(props: any) => (
			<BottomSheetBackdrop
				{...props}
				appearsOnIndex={0}
				disappearsOnIndex={-1}
				pressBehavior='close'
			/>
		),
		[],
	);

	const renderHandle = useCallback(
		(props: any) => (
			<LinearGradient
				colors={COLORS.gradients.primary as [ColorValue, ColorValue]}
				start={{ x: 0, y: 0 }}
				end={{ x: 1, y: 0 }}
			>
				<BottomSheetHandle {...props} />
			</LinearGradient>
		),
		[],
	);

	return (
		<>
			{showEmojiSelector && (
				<>
					{Platform.OS === 'ios' && (
						<Modal
							isVisible={showEmojiSelector}
							animationIn='fadeIn'
							animationOut='fadeOut'
							onBackdropPress={() => setShowEmojiSelector(false)}
							backdropOpacity={0.5}
						>
							<View style={styles.emojiSelectorContainer}>
								<EmojiSelector
									onEmojiSelected={(emoji) => {
										setSelectedIcon(emoji);
										setShowEmojiSelector(false);
									}}
									showSearchBar={false}
									showHistory={false}
									showTabs={false}
									showSectionTitles={false}
									columns={7}
								/>
							</View>
						</Modal>
					)}

					{Platform.OS === 'android' && (
						<Portal>
							<Pressable
								style={styles.emojiSelectorBackdrop}
								onPress={() => setShowEmojiSelector(false)}
							>
								<Pressable
									style={[styles.emojiSelectorContainer, { width: '80%' }]}
									onPress={(e) => e.stopPropagation()}
								>
									<EmojiSelector
										onEmojiSelected={(emoji) => {
											setSelectedIcon(emoji);
											setShowEmojiSelector(false);
										}}
										showSearchBar={false}
										showHistory={false}
										showTabs={false}
										showSectionTitles={false}
										columns={7}
									/>
								</Pressable>
							</Pressable>
						</Portal>
					)}
				</>
			)}

			<BottomSheet
				ref={bottomSheetRef}
				index={-1}
				snapPoints={snapPoints}
				onChange={handleSheetChanges}
				enableOverDrag={false}
				enablePanDownToClose={true}
				backdropComponent={renderBackdrop}
				handleComponent={renderHandle}
				style={styles.container}
			>
				<BottomSheetView style={styles.contentContainer}>
					<KeyboardAvoidingView
						style={{ flex: 1 }}
						behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
						keyboardVerticalOffset={bottomTabBarHeight + 20}
					>
						<LinearGradient
							colors={COLORS.gradients.primary as [ColorValue, ColorValue]}
							style={styles.header}
							start={{ x: 0, y: 0 }}
							end={{ x: 1, y: 0 }}
						>
							<Text style={styles.headerTitle}>
								{editMode ? '칭찬 미션 수정하기' : '칭찬 미션 만들기'}
							</Text>
							<Text style={styles.headerSubtitle}>
								{editMode
									? '목표를 자유롭게 수정할 수 있어요'
									: '나만의 목표를 설정해보세요'}
							</Text>
						</LinearGradient>

						<BottomSheetScrollView
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
										placeholder='원하는 일수를 입력해주세요 (최대 365일)'
										placeholderTextColor={COLORS.text.placeholder}
										value={customDays}
										onChangeText={setCustomDays}
										keyboardType='numeric'
										maxLength={3}
									/>
								)}
							</View>

							<View style={styles.formSection}>
								<Text style={styles.formLabel}>아이콘</Text>
								<TouchableOpacity
									style={styles.emojiButton}
									onPress={() => setShowEmojiSelector(true)}
								>
									<Text style={styles.emojiText}>{selectedIcon || '🏃‍♂️'}</Text>
								</TouchableOpacity>
							</View>

							<View style={styles.formSection}>
								<Text style={styles.formLabel}>
									칭찬 스티커를 다 모은 보상 💝
								</Text>
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
						</BottomSheetScrollView>

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
					</KeyboardAvoidingView>
				</BottomSheetView>
			</BottomSheet>
		</>
	);
};

const styles = StyleSheet.create({
	container: {
		borderTopLeftRadius: 16,
		borderTopRightRadius: 16,
		overflow: 'hidden',
	},
	contentContainer: {
		flex: 1,
	},
	header: {
		padding: 20,
		paddingTop: 20,
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
	emojiButton: {
		width: 60,
		height: 60,
		borderWidth: 2,
		borderColor: COLORS.border.primary,
		borderRadius: 12,
		// padding: 14,
		backgroundColor: COLORS.background.primary,
		alignItems: 'center',
		justifyContent: 'center',
	},
	emojiText: {
		fontSize: 30,
		color: COLORS.text.secondary,
	},
	emojiSelectorBackdrop: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		justifyContent: 'center',
		alignItems: 'center',
		zIndex: 1000,
	},
	emojiSelectorContainer: {
		height: '50%',
		backgroundColor: COLORS.background.primary,
		borderRadius: 16,
		overflow: 'hidden',
		padding: 16,
	},
	createActions: {
		flexDirection: 'row',
		padding: 10,
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

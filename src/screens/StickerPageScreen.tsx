import { useStickerPage } from '@/hooks/useStickerPage';
import { useStickers } from '@/hooks/useStickers';
import { getTodayString } from '@/utils/dateUtils';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import {
	Animated,
	ColorValue,
	PanResponder,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import StickerRenderer from '../components/StickerRenderer';
import StickerSlotItem from '../components/StickerSlotItem';
import { COLORS } from '../constants/colors';
import { SIZES } from '../constants/dimensions';
import { useCelebration } from '../hooks/useCelebration';
import { useStickerDrag } from '../hooks/useStickerDrag';
import StickerPackListModal from '../modals/StickerPackListModal';
import { StackParamList } from '../navigation/StackNavigator';
import * as stickerLogService from '../services/stickerLogService';
import { useUIStore } from '../store';
import { Sticker, Timer } from '../types';

type Props = NativeStackScreenProps<StackParamList, 'StickerPage'>;

const StickerPageScreen: FC<Props> = ({ route, navigation }) => {
	const { currentChallenge } = route.params;

	const { stickerGrid, setStickerGrid, canAddSticker, stickerCount } =
		useStickerPage(currentChallenge?.id, currentChallenge?.days);
	const { stickerPacks } = useStickers();
	const { showCelebration, clearCelebration } = useCelebration();

	const insets = useSafeAreaInsets();
	const scaleAnim = useRef<Animated.Value>(new Animated.Value(1)).current;
	const [selectedSticker, setSelectedSticker] = useState<Sticker | null>(null);
	const [scaleAnimSlotIndex, setScaleAnimSlotIndex] = useState<number | null>(
		null,
	);

	const stickerPackModalVisible = useUIStore(state => state.stickerPackModalVisible);
	const setStickerPackModalVisible = useUIStore(state => state.setStickerPackModalVisible);

	// 스티커팩이 로드된 후 첫 번째 스티커팩에서 랜덤 스티커 자동 선택
	useEffect(() => {
		if (stickerPacks.length > 0 && stickerPacks[0].stickers.length > 0) {
			const randomIndex = Math.floor(
				Math.random() * stickerPacks[0].stickers.length,
			);
			setSelectedSticker(stickerPacks[0].stickers[randomIndex]);
		}
	}, [currentChallenge?.id, stickerPacks]);

	const handleGoBack = () => {
		navigation.goBack();
	};

	/* ────────────────── 스티커 추가, 제거 로직 ────────────────── */
	const addStickerToGrid = async (
		index: number,
		sticker: Sticker,
	): Promise<void> => {
		// 1. 권한 확인 (하루에 한 번만)
		if (!canAddSticker) return;

		// 2. 햅틱 피드백
		Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

		try {
			// 3. 데이터베이스 저장
			const newLog = await stickerLogService.addStickerLog(
				String(currentChallenge?.id || 'default-challenge'),
				sticker.id,
				getTodayString(),
			);

			// 4. 로컬 상태 업데이트
			const newGrid = [...stickerGrid];
			newGrid[index] = { sticker, log: newLog };
			setStickerGrid(newGrid);

			// 5. 스티커 붙이기 애니메이션 트리거
			setScaleAnimSlotIndex(index);
			setTimeout(() => {
				setScaleAnimSlotIndex(null);
			}, 300);

			// 6. 축하 메세지 설정
			showCelebration(stickerCount + 1, currentChallenge?.days || 30, currentChallenge?.reward);
		} catch (error) {
			console.error('Error adding sticker:', error);
		}
	};

	const removeStickerFromGrid = async (index: number): Promise<void> => {
		const stickerWithLog = stickerGrid[index];
		if (!stickerWithLog) return;

		// 0. 햅틱 피드백
		Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

		try {
			// 1. 데이터베이스에서 삭제
			await stickerLogService.removeStickerLog(
				String(currentChallenge?.id || 'default-challenge'),
				stickerWithLog.log.date,
			);

			// 2. 로컬 상태 업데이트
			const newGrid = [...stickerGrid];
			newGrid[index] = null;
			setStickerGrid(newGrid);

			// 3. 오늘의 스티커로  복원
			setSelectedSticker(stickerWithLog.sticker);

			// 4. 오늘의 스티커 스케일 애니메이션 트리거
			Animated.sequence([
				Animated.timing(scaleAnim, {
					toValue: 1.3,
					duration: 150,
					useNativeDriver: true,
				}),
				Animated.timing(scaleAnim, {
					toValue: 1,
					duration: 150,
					useNativeDriver: true,
				}),
			]).start();

			// 5. 축하 메세지 제거
			clearCelebration();
		} catch (error) {
			console.error('Error removing sticker:', error);
		}
	};

	/* ────────────────── 드래그 UI helpers ────────────────── */
	const {
		isDragging,
		draggingSticker,
		dragValue,

		isDraggingFromSlot,
		nextSlotIndex,

		handleTodayStickerDragStart,
		handleSlotStickerDragStart,
		handleSlotLayout,
		handleTodayStickerLayout,
		isInTodayStickerArea,
		isInNextSlotArea,
		updateDragPosition,
		handleDragEnd,
	} = useStickerDrag(stickerGrid);

	// 오늘의 스티커 드래그 레퍼런스
	const longPressTimer = useRef<Timer | null>(null);

	const onPanResponderGrant = useCallback(
		(_: any, gestureState: any) => {
			if (!selectedSticker) return;

			longPressTimer.current = setTimeout(() => {
				handleTodayStickerDragStart(
					gestureState.x0 - 30, // 스티커 크기 보정
					gestureState.y0 - 30,
					selectedSticker,
				);
			}, 500);
		},
		[selectedSticker, handleTodayStickerDragStart],
	);

	const onPanResponderMove = useCallback(
		(_: any, gestureState: any) => {
			// 롱프레스 타이머가 진행 중이고 움직임이 감지되면 타이머 취소
			if (longPressTimer.current && !isDragging) {
				const dx = Math.abs(gestureState.dx);
				const dy = Math.abs(gestureState.dy);

				if (dx > 5 || dy > 5) {
					clearTimeout(longPressTimer.current);
					longPressTimer.current = null;
					return; // 드래그 취소
				}
			}

			if (isDragging) {
				updateDragPosition(gestureState.moveX - 30, gestureState.moveY - 30); // 스티커 크기 보정
			}
		},
		[isDragging, updateDragPosition],
	);

	const onPanResponderRelease = useCallback(
		(_: any, gestureState: any) => {
			// 타이머 정리
			if (longPressTimer.current) {
				clearTimeout(longPressTimer.current);
				longPressTimer.current = null;
			}

			if (!isDragging || !selectedSticker) return;

			if (isInNextSlotArea(gestureState.moveX, gestureState.moveY)) {
				addStickerToGrid(nextSlotIndex, selectedSticker);
			}

			handleDragEnd();
		},
		[
			isDragging,
			isInNextSlotArea,
			selectedSticker,
			addStickerToGrid,
			handleDragEnd,
		],
	);

	// 오늘의 스티커 PanResponder
	const selectedStickerPanResponder = PanResponder.create({
		onStartShouldSetPanResponder: () => canAddSticker, // 조건부 드래그 허용
		onPanResponderGrant,
		onPanResponderMove,
		onPanResponderRelease,
	});

	/* ────────────────── 스티커팩 모달 UI helpers ────────────────── */
	const openPackModal = async () => {
		setStickerPackModalVisible(true);
	};

	const handleSelectSticker = (sticker: Sticker) => {
		setSelectedSticker(sticker);
	};
	return (
		<View style={styles.container}>
			<LinearGradient
				colors={COLORS.gradients.challenge as [ColorValue, ColorValue]}
				style={[styles.header, { paddingTop: insets.top }]}
				start={{ x: 0, y: 0.3 }}
			>
				<View style={styles.headerContent}>
					<View style={styles.buttonsContainer}>
						<TouchableOpacity onPress={handleGoBack}>
							<Ionicons
								name='chevron-back'
								size={28}
								color={COLORS.background.primary}
							/>
						</TouchableOpacity>
					</View>

					<View>
						<Text style={styles.headerTitle}>{currentChallenge?.title}</Text>
						<Text style={styles.headerSubtitle}>
							오늘도 잘했어요! 스티커로 칭찬해주세요
						</Text>
					</View>
				</View>

				{/* 오늘의 스티커 */}
				<View style={styles.stickerSelection}>
					{canAddSticker && selectedSticker ? (
						<Animated.View
							style={[
								styles.selectedSticker,
								isDragging &&
									!isDraggingFromSlot &&
									styles.selectedStickerDragging,
								{
									transform: [{ scale: scaleAnim }],
								},
							]}
							onLayout={handleTodayStickerLayout}
							{...selectedStickerPanResponder.panHandlers}
						>
							<StickerRenderer
								sticker={selectedSticker}
								size={SIZES.stickerSlot}
							/>
						</Animated.View>
					) : (
						<View
							style={[
								styles.emptySticker,
								// 슬롯에서 드래그할 때 오늘의 스티커 영역 강조
								isDragging &&
									isDraggingFromSlot &&
									styles.todayStickerValidDrop,
							]}
							onLayout={handleTodayStickerLayout}
						/>
					)}

					<Text style={styles.stickerSelectionTitle}>오늘의 스티커</Text>

					{/* 스티커팩 열기 버튼 */}
					<TouchableOpacity style={styles.changeButton} onPress={openPackModal}>
						<FontAwesome
							name={stickerPackModalVisible ? 'folder-open' : 'folder'}
							size={22}
							color={COLORS.text.light}
						/>
					</TouchableOpacity>
				</View>
			</LinearGradient>

			{/* 스티커판 */}
			<ScrollView
				style={styles.stickerBoard}
				contentContainerStyle={styles.stickerBoardContent}
				scrollEnabled={!isDragging}
			>
				<View style={styles.stickerGrid}>
					{stickerGrid?.map((sticker, index) => {
						return (
							<StickerSlotItem
								key={index}
								sticker={sticker}
								index={index}
								onLayout={handleSlotLayout}
								showScaleAnimation={index === scaleAnimSlotIndex}
								removeStickerFromGrid={removeStickerFromGrid}
								isValidDropSlot={
									isDragging && !isDraggingFromSlot && index === nextSlotIndex
								}
								isDraggingSticker={
									isDragging &&
									isDraggingFromSlot &&
									index ===
										(nextSlotIndex >= 0
											? nextSlotIndex - 1
											: stickerGrid.length - 1)
								}
								isDragging={isDragging}
								draggingSticker={draggingSticker}
								isInTodayStickerArea={isInTodayStickerArea}
								handleDragStart={handleSlotStickerDragStart}
								handleDragEnd={handleDragEnd}
								updateDragPosition={updateDragPosition}
							/>
						);
					})}
				</View>
			</ScrollView>

			{/* 드래그 중인 스티커 표시 */}
			{isDragging && draggingSticker && (
				<Animated.View
					style={[
						styles.draggingSticker,
						{
							transform: dragValue.getTranslateTransform(),
						},
					]}
					pointerEvents='none'
				>
					<StickerRenderer sticker={draggingSticker} size={SIZES.stickerSlot} />
				</Animated.View>
			)}

			{/* 스티커팩 선택 모달 */}
			<StickerPackListModal onStickerSelect={handleSelectSticker} />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: COLORS.background.primary,
	},
	header: {
		paddingTop: 40,
	},
	headerContent: {
		padding: 20,
	},
	buttonsContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 20,
		marginLeft: -12,
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
	stickerSelection: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: COLORS.background.primary,
		padding: 16,
		marginBottom: 8,
		gap: 12,
	},
	stickerSelectionTitle: {
		fontSize: 16,
		fontWeight: '500',
		color: COLORS.text.secondary,
	},
	changeButton: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: COLORS.background.light,
		width: 45,
		height: 45,
		borderRadius: '50%',
		marginLeft: 'auto',
		marginRight: 8,
	},
	selectedSticker: {
		width: SIZES.stickerSlot,
		height: SIZES.stickerSlot,
		borderRadius: '50%',
		alignItems: 'center',
		justifyContent: 'center',
	},
	selectedStickerDragging: {
		opacity: 0.5,
	},
	emptySticker: {
		width: SIZES.stickerSlot,
		height: SIZES.stickerSlot,
		borderRadius: '50%',
		borderWidth: 2,
		borderColor: COLORS.border.secondary,
		borderStyle: 'dashed',
		backgroundColor: 'transparent',
	},
	draggingSticker: {
		width: SIZES.stickerSlot,
		height: SIZES.stickerSlot,
		borderRadius: '50%',
		position: 'absolute',
		top: 0,
		left: 0,
		zIndex: 1000,
		alignItems: 'center',
		justifyContent: 'center',
	},
	stickerBoard: {
		flex: 1,
	},
	stickerBoardContent: {
		flexGrow: 1,
		alignItems: 'center',
		paddingHorizontal: 24,
		paddingVertical: 32,
	},
	stickerGrid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		maxWidth: SIZES.stickerGrid,
		gap: 8,
	},
	errorText: {
		fontSize: 12,
		color: COLORS.text.white,
		opacity: 0.8,
		marginTop: 4,
	},
	todayStickerValidDrop: {
		borderStyle: 'solid',
		borderColor: COLORS.border.light,
		backgroundColor: COLORS.border.light,
	},
});

export default StickerPageScreen;

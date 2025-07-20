import { useStickerPage } from '@/hooks/useStickerPage';
import { useStickers } from '@/hooks/useStickers';
import { getTodayString } from '@/utils/dateUtils';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { FC, useEffect, useRef, useState } from 'react';
import {
	Animated,
	ColorValue,
	Modal,
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
import * as stickerLogService from '../services/stickerLogService';
import { useUIStore } from '../store';
import {
	Sticker,
	StickerPageModalProps,
	StickerWithLog,
	Timer,
} from '../types';
import StickerPackListModal from './StickerPackListModal';

const StickerPageModal: FC<StickerPageModalProps> = ({
	visible,
	setVisible,
	currentChallenge,
}) => {
	const { stickerGrid, setStickerGrid, canAddSticker, stickerCount } =
		useStickerPage(currentChallenge?.id, currentChallenge?.days);
	const { stickerPacks } = useStickers();
	const { celebrationData, showCelebration } = useCelebration();

	const insets = useSafeAreaInsets();
	const [selectedSticker, setSelectedSticker] = useState<Sticker | null>(null);
	const [animationTrigger, setAnimationTrigger] = useState<number | null>(null);

	const {
		stickerPackModalVisible,
		setStickerPackModalVisible,
		setCelebrationVisible,
	} = useUIStore();

	// 스티커팩이 로드된 후 첫 번째 스티커팩에서 랜덤 스티커 자동 선택
	useEffect(() => {
		if (stickerPacks.length > 0 && stickerPacks[0].stickers.length > 0) {
			const randomIndex = Math.floor(
				Math.random() * stickerPacks[0].stickers.length,
			);
			setSelectedSticker(stickerPacks[0].stickers[randomIndex]);
		}
	}, [currentChallenge?.id, stickerPacks]);

	const getNextSlotIndex = (grid: Array<StickerWithLog | null>): number => {
		return grid.findIndex((slot) => slot === null);
	};

	const addStickerToGrid = async (
		index: number,
		sticker: Sticker,
	): Promise<void> => {
		if (!canAddSticker) {
			console.warn('Already added sticker for today');
			return;
		}

		try {
			// 스티커 로그 생성
			const newLog = await stickerLogService.addStickerLog(
				String(currentChallenge?.id || 'default-challenge'),
				sticker.id,
				getTodayString(),
			);

			// 로컬 상태 업데이트
			const newGrid = [...stickerGrid];
			newGrid[index] = { sticker, log: newLog };
			setStickerGrid(newGrid);

			// 스티커 붙이기 애니메이션 트리거
			setAnimationTrigger(index);

			// 애니메이션 후 초기화
			setTimeout(() => {
				setAnimationTrigger(null);
			}, 300);

			// 축하 메세지 설정
			showCelebration(stickerCount + 1, currentChallenge?.days || 30);
		} catch (error) {
			console.error('Error adding sticker:', error);
		}
	};

	const removeStickerFromGrid = async (index: number): Promise<void> => {
		const stickerWithLog = stickerGrid[index];
		if (!stickerWithLog) return;

		try {
			// 스티커 로그 삭제 - 실제 스티커가 붙은 날짜 사용
			await stickerLogService.removeStickerLog(
				String(currentChallenge?.id || 'default-challenge'),
				stickerWithLog.log.date,
			);

			// 로컬 상태 업데이트
			const newGrid = [...stickerGrid];
			newGrid[index] = null;
			setStickerGrid(newGrid);

			// 오늘의 스티커 복원
			setSelectedSticker(stickerWithLog.sticker);
		} catch (error) {
			console.error('Error removing sticker:', error);
		}
	};

	/* ────────────────── 드래그 UI helpers ────────────────── */
	const {
		isDragging,
		draggingSticker,
		hoveredSlotIndex,
		dragValue,
		handleDragStart,
		handleDragEnd,
		updateDragPosition,
		handleSlotLayout,
	} = useStickerDrag(stickerGrid);

	// 오늘의 스티커 드래그 레퍼런스
	const longPressTimer = useRef<Timer | null>(null);

	// 모달 닫기용 스와이프 PanResponder
	const modalSwipePanResponder = PanResponder.create({
		onStartShouldSetPanResponder: () => !isDragging, // 드래그 중이 아닐 때만
		onMoveShouldSetPanResponder: (_, gestureState) => {
			// 오른쪽에서 왼쪽으로 스와이프 감지 (수평 이동이 수직 이동보다 클 때)
			return (
				!isDragging &&
				Math.abs(gestureState.dx) > Math.abs(gestureState.dy) &&
				gestureState.dx > 50 // 50px 이상 오른쪽으로 이동했을 때
			);
		},
		onPanResponderGrant: () => {
			// 스와이프 시작
		},
		onPanResponderMove: (_, gestureState) => {
			// 스와이프 진행 중 (필요시 시각적 피드백 추가 가능)
		},
		onPanResponderRelease: (_, gestureState) => {
			// 스와이프 완료 시 모달 닫기 (100px 이상 오른쪽으로 스와이프했을 때)
			if (gestureState.dx > 100 && Math.abs(gestureState.vx) > 0.5) {
				handleCloseModal();
			}
		},
	});

	// 오늘의 스티커 PanResponder
	const selectedStickerPanResponder = PanResponder.create({
		onStartShouldSetPanResponder: () => canAddSticker,
		onPanResponderGrant: (_, _gestureState) => {
			if (selectedSticker) {
				longPressTimer.current = setTimeout(() => {
					handleDragStart(
						_gestureState.x0 - 30, // 스티커 크기 보정
						_gestureState.y0 - 30,
						selectedSticker,
					);
				}, 500);
			}
		},
		onPanResponderMove: (_, _gestureState) => {
			if (isDragging) {
				updateDragPosition(_gestureState.moveX, _gestureState.moveY);
			}
		},
		onPanResponderRelease: (_, _gestureState) => {
			if (longPressTimer.current) {
				clearTimeout(longPressTimer.current);
				longPressTimer.current = null;
			}

			if (isDragging) {
				const nextSlotIndex = getNextSlotIndex(stickerGrid);

				// 오늘의 스티커에서 드래그하는 경우
				if (hoveredSlotIndex === nextSlotIndex && selectedSticker) {
					addStickerToGrid(hoveredSlotIndex, selectedSticker);
				}

				handleDragEnd();
			}
		},
	});

	/* ────────────────── 스티커팩 모달 UI helpers ────────────────── */
	const openPackModal = async () => {
		setStickerPackModalVisible(true);
	};

	const handleSelectSticker = (sticker: Sticker) => {
		setSelectedSticker(sticker);
	};

	const handleCloseModal = () => {
		setVisible(false);

		// celebrationData가 있으면 축하 모달을 표시
		if (celebrationData) {
			setCelebrationVisible(true);
		}
	};

	return (
		<Modal
			visible={visible}
			animationType='none'
			presentationStyle='fullScreen'
		>
			<View style={styles.container}>
				<LinearGradient
					colors={COLORS.gradients.challenge as [ColorValue, ColorValue]}
					style={[styles.header, { paddingTop: insets.top }]}
					start={{ x: 0, y: 0.3 }}
				>
					<View style={styles.headerContent}>
						<View style={styles.buttonsContainer}>
							<TouchableOpacity onPress={handleCloseModal}>
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
									isDragging && styles.selectedStickerDragging,
								]}
								{...selectedStickerPanResponder.panHandlers}
							>
								<StickerRenderer
									sticker={selectedSticker}
									size={SIZES.stickerSlot}
								/>
							</Animated.View>
						) : (
							<View style={styles.emptySticker} />
						)}

						<Text style={styles.stickerSelectionTitle}>오늘의 스티커</Text>

						{/* 스티커팩 열기 버튼 */}
						<TouchableOpacity
							style={styles.changeButton}
							onPress={openPackModal}
						>
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
							const nextSlotIndex = getNextSlotIndex(stickerGrid);
							const isValidDropTarget = isDragging && index === nextSlotIndex;

							return (
								<StickerSlotItem
									key={index}
									sticker={sticker}
									index={index}
									onLayout={handleSlotLayout}
									triggerAnimation={animationTrigger}
									isValidDropTarget={isValidDropTarget}
									onStickerRemove={() => removeStickerFromGrid(index)}
								/>
							);
						})}
					</View>
				</ScrollView>
			</View>

			{/* 드래그 중인 스티커 표시 */}
			{isDragging && draggingSticker && selectedSticker && (
				<Animated.View
					style={[
						styles.draggingSticker,
						{
							transform: dragValue.getTranslateTransform(),
						},
					]}
					pointerEvents='none'
				>
					<StickerRenderer sticker={selectedSticker} size={SIZES.stickerSlot} />
				</Animated.View>
			)}

			{/* 스티커팩 선택 모달 */}
			<StickerPackListModal onStickerSelect={handleSelectSticker} />
		</Modal>
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
		opacity: 0.7,
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
});

export default StickerPageModal;

import { Sticker } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import BottomSheet, {
	BottomSheetBackdrop,
	BottomSheetFlatList,
	BottomSheetView,
} from '@gorhom/bottom-sheet';
import { FC, useCallback, useEffect, useMemo, useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import StickerRenderer from '../components/StickerRenderer';
import { COLORS } from '../constants/colors';
import { SIZES } from '../constants/dimensions';
import { useStickers } from '../hooks/useStickers';
import { useUIStore } from '../store';
import type { StickerPackWithStickers } from '../types/database/api';

interface StickerPackListModalProps {
	onStickerSelect: (sticker: Sticker) => void;
}

const StickerPackListModal: FC<StickerPackListModalProps> = ({
	onStickerSelect,
}) => {
	const stickerPackModalVisible = useUIStore(
		(state) => state.stickerPackModalVisible,
	);
	const activeStickerPack = useUIStore((state) => state.activeStickerPack);
	const setStickerPackModalVisible = useUIStore(
		(state) => state.setStickerPackModalVisible,
	);
	const setActiveStickerPack = useUIStore(
		(state) => state.setActiveStickerPack,
	);

	// 스티커 관련 상태 및 훅
	const { stickerPacks, isLoading, error } = useStickers();

	// Bottom sheet ref and snap points
	const bottomSheetRef = useRef<BottomSheet>(null);
	const snapPoints = useMemo(() => ['40%'], []);

	// Visible 상태에 따라 bottom sheet 열기/닫기
	useEffect(() => {
		if (stickerPackModalVisible) {
			bottomSheetRef.current?.expand();
		} else {
			bottomSheetRef.current?.close();
		}
	}, [stickerPackModalVisible]);

	const handlePackSelect = (pack: StickerPackWithStickers) => {
		setActiveStickerPack(pack);
	};

	const handleBackToPacks = () => {
		setActiveStickerPack(null);
	};

	const handleStickerSelect = (sticker: Sticker) => {
		onStickerSelect(sticker);
		handleClose();
	};

	const handleClose = useCallback(() => {
		bottomSheetRef.current?.close();
	}, []);

	// 닫힘 감지
	const handleSheetChanges = useCallback(
		(index: number) => {
			if (index === -1) {
				setActiveStickerPack(null);
				setStickerPackModalVisible(false);
			}
		},
		[setActiveStickerPack, setStickerPackModalVisible],
	);

	const renderContent = () => {
		if (isLoading) {
			return (
				<BottomSheetView style={styles.packModal}>
					<Text style={styles.loadingText}>로딩 중...</Text>
				</BottomSheetView>
			);
		}

		if (error) {
			return (
				<BottomSheetView style={styles.packModal}>
					<Text style={styles.errorText}>{error}</Text>
				</BottomSheetView>
			);
		}

		// 스티커팩 목록
		if (activeStickerPack === null) {
			return (
				<BottomSheetView style={styles.packModal}>
					<BottomSheetFlatList
						data={stickerPacks}
						keyExtractor={(item) => item.pack.id}
						numColumns={2}
						contentContainerStyle={styles.packList}
						renderItem={({ item }) => (
							<TouchableOpacity
								style={styles.packCard}
								onPress={() => handlePackSelect(item)}
							>
								<StickerRenderer
									sticker={item.stickers[0]} /* 썸네일 대용 */
									size={60}
								/>
								<Text style={styles.packName}>{item.pack.name}</Text>
							</TouchableOpacity>
						)}
					/>
				</BottomSheetView>
			);
		}

		// 스티커 그리드
		return (
			<BottomSheetView style={styles.packModal}>
				<View style={styles.packHeader}>
					<TouchableOpacity onPress={handleBackToPacks}>
						<Ionicons
							name='chevron-back'
							size={24}
							color={COLORS.text.primary}
						/>
					</TouchableOpacity>
					<Text style={styles.packTitle}>{activeStickerPack.pack.name}</Text>
				</View>

				<BottomSheetFlatList
					data={activeStickerPack.stickers}
					keyExtractor={(item) => item.id}
					numColumns={4}
					contentContainerStyle={styles.stickerList}
					renderItem={({ item }) => (
						<TouchableOpacity
							style={styles.stickerCell}
							onPress={() => handleStickerSelect(item)}
						>
							<StickerRenderer sticker={item} size={48} />
						</TouchableOpacity>
					)}
				/>
			</BottomSheetView>
		);
	};

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

	return (
		<>
			{/* Backdrop */}
			{/* {stickerPackModalVisible && (
				<Pressable
					style={styles.backdrop}
					onPress={handleClose}
				/>
			)} */}

			<BottomSheet
				ref={bottomSheetRef}
				index={-1}
				snapPoints={snapPoints}
				onChange={handleSheetChanges}
				enableOverDrag={false}
				enablePanDownToClose={true}
				backdropComponent={renderBackdrop}
			>
				{renderContent()}
			</BottomSheet>
		</>
	);
};

const styles = StyleSheet.create({
	backdrop: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		zIndex: 1,
	},
	packModal: {
		flex: 1,
		backgroundColor: COLORS.background.primary,
		padding: 16,
		paddingBottom: 32,
	},
	packList: {
		gap: 12,
	},
	packCard: {
		flex: 1,
		alignItems: 'center',
		padding: 12,
		margin: 6,
		backgroundColor: COLORS.background.light,
		borderRadius: 12,
	},
	packName: { marginTop: 6, fontSize: 12, color: COLORS.text.primary },
	packHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 12,
		marginBottom: 18,
	},
	packTitle: {
		fontSize: 16,
		fontWeight: '600',
		marginLeft: 8,
		color: COLORS.text.primary,
	},
	stickerList: {
		gap: 8,
	},
	stickerCell: {
		flex: 1,
		alignItems: 'center',
		padding: 8,
	},
	loadingText: {
		textAlign: 'center',
		fontSize: 16,
		color: COLORS.text.primary,
		padding: 20,
	},
	errorText: {
		textAlign: 'center',
		fontSize: 16,
		color: COLORS.error,
		padding: 20,
	},
	selectedStickerSection: {
		alignItems: 'center',
		marginBottom: 16,
		padding: 16,
		backgroundColor: COLORS.background.light,
		borderRadius: 12,
	},
	selectedStickerTitle: {
		fontSize: 16,
		fontWeight: '600',
		color: COLORS.text.primary,
		marginBottom: 8,
	},
	selectedStickerContainer: {
		width: SIZES.stickerSlot,
		height: SIZES.stickerSlot,
		borderRadius: SIZES.stickerSlot / 2,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: COLORS.background.primary,
	},
});

export default StickerPackListModal;

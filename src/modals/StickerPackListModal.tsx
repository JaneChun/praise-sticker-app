import { Sticker } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { FC } from 'react';
import {
	FlatList,
	Modal,
	Pressable,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
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
	const {
		stickerPackModalVisible,
		activeStickerPack,
		setStickerPackModalVisible,
		setActiveStickerPack,
	} = useUIStore();

	// 스티커 관련 상태 및 훅
	const { stickerPacks, isLoading, error } = useStickers();


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

	const handleClose = () => {
		setActiveStickerPack(null);
		setStickerPackModalVisible(false);
	};

	if (isLoading) {
		return (
			<Modal
				visible={stickerPackModalVisible}
				transparent={true}
				animationType='fade'
			>
				<Pressable style={styles.overlay} onPress={handleClose} />
				<View style={styles.packModal}>
					<Text style={styles.loadingText}>로딩 중...</Text>
				</View>
			</Modal>
		);
	}

	if (error) {
		return (
			<Modal
				visible={stickerPackModalVisible}
				transparent={true}
				animationType='fade'
			>
				<Pressable style={styles.overlay} onPress={handleClose} />
				<View style={styles.packModal}>
					<Text style={styles.errorText}>{error}</Text>
				</View>
			</Modal>
		);
	}

	return (
		<Modal
			visible={stickerPackModalVisible}
			transparent={true}
			animationType='fade'
		>
			<Pressable style={styles.overlay} onPress={handleClose} />

			<View style={styles.packModal}>
				{/* 스티커팩 목록 */}
				{activeStickerPack === null ? (
					<FlatList
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
				) : (
					/* 스티커 그리드 */
					<>
						<View style={styles.packHeader}>
							<TouchableOpacity onPress={handleBackToPacks}>
								<Ionicons
									name='chevron-back'
									size={24}
									color={COLORS.text.primary}
								/>
							</TouchableOpacity>
							<Text style={styles.packTitle}>
								{activeStickerPack.pack.name}
							</Text>
						</View>

						<FlatList
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
					</>
				)}
			</View>
		</Modal>
	);
};

const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		backgroundColor: '#00000055',
	},
	packModal: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		maxHeight: '60%',
		backgroundColor: COLORS.background.primary,
		borderTopLeftRadius: 16,
		borderTopRightRadius: 16,
		padding: 16,
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

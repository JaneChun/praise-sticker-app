import { FC, useEffect } from 'react';
import {
	Modal,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { COLORS } from '../constants/colors';
import { useStickerDatabase } from '../hooks/useStickers';
import { DayDetailModalProps } from '../types';

const DayDetailModal: FC<DayDetailModalProps> = ({
	visible,
	setVisible,
	selectedDay,
}) => {
	const { dayDetailData, loadDayDetail } = useStickerDatabase();

	useEffect(() => {
		if (visible && selectedDay) {
			const currentDate = new Date();
			const year = currentDate.getFullYear();
			const month = currentDate.getMonth() + 1;
			const dateString = `${year}-${month
				.toString()
				.padStart(2, '0')}-${selectedDay.toString().padStart(2, '0')}`;

			loadDayDetail({ date: dateString });
		}
	}, [visible, selectedDay, loadDayDetail]);

	const totalStickers = dayDetailData?.totalStickers || 0;

	return (
		<Modal visible={visible} transparent animationType='slide'>
			<View style={styles.dayDetailOverlay}>
				<View style={styles.dayDetailContent}>
					<TouchableOpacity
						style={styles.closeDayDetail}
						onPress={() => setVisible(false)}
					>
						<Text style={styles.closeDayDetailText}>×</Text>
					</TouchableOpacity>

					<View style={styles.dayDetailHeader}>
						<Text style={styles.dayDetailDate}>7월 {selectedDay || 0}일</Text>
						<Text style={styles.dayDetailCount}>
							총 {totalStickers}개의 칭찬 스티커
						</Text>
					</View>

					<ScrollView style={styles.stickersByChallenge}>
						{totalStickers === 0 ? (
							<View style={styles.emptyDay}>
								<Text style={styles.emptyDayIcon}>😴</Text>
								<Text style={styles.emptyDayText}>이날은 쉬었네요</Text>
								<Text style={styles.emptyDaySubtext}>
									가끔 쉬는 것도 중요해요!
								</Text>
							</View>
						) : (
							dayDetailData?.challengeStickers.map((challenge) => (
								<View
									key={challenge.challengeId}
									style={styles.challengeSection}
								>
									<View style={styles.challengeInfo}>
										<Text style={styles.challengeEmoji}>
											{challenge.challengeIcon || '🎯'}
										</Text>
										<Text style={styles.challengeTitle}>
											{challenge.challengeTitle}
										</Text>
									</View>
									<View style={styles.stickersList}>
										{challenge.stickers.map((sticker, index) => (
											<View key={index} style={styles.stickerBadge}>
												<View
													style={[
														styles.stickerBadgeColor,
														{ backgroundColor: sticker.color || '#E8E8E8' },
													]}
												/>
												<Text style={styles.stickerBadgeText}>
													{sticker.name}
												</Text>
											</View>
										))}
									</View>
								</View>
							))
						)}
					</ScrollView>
				</View>
			</View>
		</Modal>
	);
};

const styles = StyleSheet.create({
	dayDetailOverlay: {
		flex: 1,
		backgroundColor: COLORS.background.overlay,
		alignItems: 'center',
		justifyContent: 'center',
	},
	dayDetailContent: {
		backgroundColor: COLORS.background.primary,
		borderRadius: 20,
		padding: 24,
		maxWidth: 320,
		width: '90%',
		maxHeight: '80%',
	},
	closeDayDetail: {
		position: 'absolute',
		top: 16,
		right: 16,
		width: 32,
		height: 32,
		borderRadius: 16,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: COLORS.background.light,
	},
	closeDayDetailText: {
		fontSize: 20,
		color: COLORS.text.secondary,
	},
	dayDetailHeader: {
		alignItems: 'center',
		marginBottom: 20,
		paddingBottom: 16,
		borderBottomWidth: 1,
		borderBottomColor: COLORS.border.primary,
	},
	dayDetailDate: {
		fontSize: 20,
		fontWeight: '700',
		color: COLORS.text.primary,
		marginBottom: 4,
	},
	dayDetailCount: {
		fontSize: 14,
		color: COLORS.text.secondary,
	},
	stickersByChallenge: {
		maxHeight: 400,
	},
	challengeSection: {
		marginBottom: 16,
		padding: 16,
		backgroundColor: COLORS.background.secondary,
		borderRadius: 12,
	},
	challengeInfo: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 12,
	},
	challengeEmoji: {
		fontSize: 18,
		marginRight: 8,
	},
	challengeTitle: {
		fontSize: 14,
		fontWeight: '600',
		color: COLORS.text.primary,
	},
	stickersList: {
		flexDirection: 'row',
		flexWrap: 'wrap',
	},
	stickerBadge: {
		backgroundColor: COLORS.background.primary,
		borderRadius: 8,
		padding: 8,
		marginRight: 8,
		marginBottom: 8,
		elevation: 2,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
	},
	stickerBadgeColor: {
		width: 16,
		height: 16,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: COLORS.border.primary,
	},
	stickerBadgeText: {
		fontSize: 14,
		color: COLORS.text.primary,
		fontWeight: '500',
	},
	emptyDay: {
		alignItems: 'center',
		padding: 40,
	},
	emptyDayIcon: {
		fontSize: 48,
		marginBottom: 16,
		opacity: 0.5,
	},
	emptyDayText: {
		fontSize: 16,
		color: COLORS.text.secondary,
		marginBottom: 8,
		textAlign: 'center',
	},
	emptyDaySubtext: {
		fontSize: 14,
		color: COLORS.text.secondary,
		opacity: 0.7,
		textAlign: 'center',
	},
});

export default DayDetailModal;

import StickerRenderer from '@/components/StickerRenderer';
import * as calendarService from '@/services/calendarService';
import * as challengeService from '@/services/challengeService';
import * as stickerService from '@/services/stickerService';
import { useUIStore } from '@/store';
import { FC, useCallback, useEffect, useState } from 'react';
import {
	FlatList,
	StyleSheet,
	Text,
	TouchableWithoutFeedback,
	View,
} from 'react-native';
import Modal from 'react-native-modal';
import { COLORS } from '../constants/colors';
import {
	ChallengeWithStickers,
	DayDetailModalProps,
	GetDayDetailResponse,
} from '../types';

const DayDetailModal: FC<DayDetailModalProps> = ({ selectedDate, onClose }) => {
	const dayDetailVisible = useUIStore((state) => state.dayDetailVisible);
	const setDayDetailVisible = useUIStore((state) => state.setDayDetailVisible);

	const [dayDetailData, setDayDetailData] =
		useState<GetDayDetailResponse | null>(null);

	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (dayDetailVisible && selectedDate) {
			loadDayDetail(selectedDate);
		}
	}, [dayDetailVisible, selectedDate]);

	const loadDayDetail = useCallback(async (date: string) => {
		try {
			setIsLoading(true);
			setError(null);

			const logs = await calendarService.getCalendarDetailsByDate(date);

			// 챌린지별로 스티커 로그를 그룹화
			const challengeGroups: Record<string, any> = {};

			for (const log of logs) {
				if (!challengeGroups[log.challengeId]) {
					// 챌린지 정보 가져오기
					const challenge = (await challengeService.getChallengeById(
						log.challengeId,
					)) as any;
					challengeGroups[log.challengeId] = {
						challengeId: log.challengeId,
						challengeTitle: challenge?.title || '챌린지',
						challengeIcon: challenge?.icon || '🎯',
						stickers: [],
					};
				}

				// 스티커 정보 가져오기
				const sticker = await stickerService.getStickerById(log.stickerId);
				if (sticker) {
					challengeGroups[log.challengeId].stickers.push(sticker);
				}
			}

			const challengeWithStickers = Object.values(
				challengeGroups,
			) as ChallengeWithStickers[];

			const dayDetail: GetDayDetailResponse = {
				challengeWithStickers,
				totalStickers: logs.length,
			};
			setDayDetailData(dayDetail);
		} catch (e) {
			setError(e instanceof Error ? e.message : 'Unknown error');
		} finally {
			setIsLoading(false);
		}
	}, []);

	const totalStickers = dayDetailData?.totalStickers || 0;

	const handleClose = useCallback(() => {
		setDayDetailVisible(false);
		onClose();
	}, [setDayDetailVisible]);

	if (isLoading) return null;

	return (
		<Modal
			isVisible={dayDetailVisible}
			animationIn='fadeIn'
			animationOut='fadeOut'
			onBackdropPress={handleClose}
			backdropOpacity={0.5}
		>
			<View style={styles.overlay}>
				<TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
					<View style={styles.dayDetailContent}>
						<View style={styles.dayDetailHeader}>
							<Text style={styles.dayDetailDate}>
								{selectedDate &&
									new Date(selectedDate).toLocaleDateString('ko-KR', {
										month: 'long',
										day: 'numeric',
									})}
							</Text>
							<Text style={styles.dayDetailCount}>
								총 {totalStickers}개의 칭찬 스티커
							</Text>
						</View>

						<FlatList
							data={dayDetailData?.challengeWithStickers ?? []}
							keyExtractor={(item) => item.challengeId}
							style={styles.stickersByChallenge}
							contentContainerStyle={{ paddingBottom: 20, flexGrow: 1 }}
							nestedScrollEnabled={true}
							showsVerticalScrollIndicator={false}
							renderItem={({ item: challenge }) => (
								<View
									style={styles.challengeSection}
									onStartShouldSetResponder={() => true}
								>
									<View style={styles.challengeInfo}>
										<Text style={styles.challengeEmoji}>
											{challenge.challengeIcon || '🎯'}
										</Text>
										<Text
											numberOfLines={1}
											ellipsizeMode='tail'
											style={styles.challengeTitle}
										>
											{challenge.challengeTitle}
										</Text>
									</View>
									<View style={styles.stickersList}>
										{challenge.stickers.map((sticker) => (
											<StickerRenderer
												key={sticker.id}
												sticker={sticker}
												size={30}
											/>
										))}
									</View>
								</View>
							)}
						/>
					</View>
				</TouchableWithoutFeedback>
			</View>
		</Modal>
	);
};

const styles = StyleSheet.create({
	overlay: {
		alignItems: 'center',
		justifyContent: 'center',
	},
	dayDetailContent: {
		backgroundColor: COLORS.background.primary,
		borderRadius: 20,
		padding: 24,
		maxWidth: 320,
		width: '90%',
		height: '65%',
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
		flex: 1,
		minHeight: 100,
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
		flex: 1,
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

import { useEffect, useState } from 'react';
import * as stickerLogService from '../services/stickerLogService';
import * as stickerService from '../services/stickerService';
import { StickerGridItem } from '../types';

export const useStickerPage = (
	challengeId?: string,
	challengeDays: number = 30,
) => {
	const [stickerGrid, setStickerGrid] = useState<Array<StickerGridItem | null>>(
		Array(challengeDays).fill(null),
	);
	const [stickerCount, setStickerCount] = useState<number>(0);
	const [canAddSticker, setCanAddSticker] = useState(true);

	// challengeId 또는 challengeDays가 변경될 때 stickerGrid 로드
	useEffect(() => {
		if (challengeId) {
			loadStickerGrid();
		}
	}, [challengeId, challengeDays]);

	// stickerGrid가 변경될 때마다 stickerCount, canAddSticker 재계산
	useEffect(() => {
		updateStickerCount();
		checkCanAddSticker();
	}, [stickerGrid]);

	const loadStickerGrid = async () => {
		try {
			const logs = await stickerLogService.getStickerLogsByChallengeId(
				challengeId!,
			);
			const newGrid = Array(challengeDays).fill(null);

			for (let i = 0; i < logs.length && i < challengeDays; i++) {
				const log = logs[i];
				const sticker = await stickerService.getStickerById(log.stickerId);
				if (sticker) {
					newGrid[i] = sticker;
				}
			}

			setStickerGrid(newGrid);
		} catch (error) {
			console.error('Error loading sticker grid:', error);
		}
	};

	const updateStickerCount = () => {
		setStickerCount(stickerGrid.filter(Boolean).length);
	};

	const checkCanAddSticker = async () => {
		if (!challengeId) {
			setCanAddSticker(true);
			return;
		}

		try {
			const today = new Date().toISOString().split('T')[0];

			const logsForDate = await stickerLogService.getStickerLogsByDate(today);
			const challengeLogsForDate = logsForDate.filter(
				(log) => log.challengeId === challengeId,
			);

			const canAdd = challengeLogsForDate.length === 0;

			setCanAddSticker(canAdd);
		} catch (error) {
			console.error('Error checking canAddSticker:', error);
			setCanAddSticker(false);
		}
	};

	return {
		stickerGrid,
		setStickerGrid,
		canAddSticker,
		stickerCount,
	};
};

import * as stickerService from '@/services/stickerService';
import { useDatabaseStore } from '@/store/useDatabaseStore';
import type { StickerPackWithStickers } from '@/types/database/api';
import { useEffect, useState } from 'react';

export const useStickers = () => {
	const [stickerPacks, setStickerPacks] = useState<StickerPackWithStickers[]>(
		[],
	);

	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const { isInitialized } = useDatabaseStore();

	useEffect(() => {
		if (isInitialized) {
			loadStickerPacks();
		}
	}, [isInitialized]);

	const loadStickerPacks = async () => {
		setIsLoading(true);
		setError(null);

		try {
			const packs = await stickerService.getStickerPacks();
			const packsWithStickers: StickerPackWithStickers[] = await Promise.all(
				packs.map(async (pack) => {
					const stickers = await stickerService.getStickersByPackId(pack.id);
					return { pack, stickers };
				}),
			);

			setStickerPacks(packsWithStickers);
		} catch (e) {
			console.error('Error loading sticker packs:', e);
			setError(e instanceof Error ? e.message : 'Unknown error');
		} finally {
			setIsLoading(false);
		}
	};

	return {
		stickerPacks,
		isLoading,
		error,
	};
};

import type { Sticker, StickerPack } from '../types';
import { db } from './databaseService';

export const getStickersByPackId = async (
	packId: string,
): Promise<Sticker[]> => {
	try {
		const rows = await db.getAllAsync(
			'SELECT * FROM stickers WHERE pack_id = ? ORDER BY name',
			[packId],
		);
		return rows.map((row: any) => ({
			id: row.id,
			packId: row.pack_id,
			name: row.name,
			type: row.type,
			data: row.data,
		}));
	} catch (error) {
		throw error;
	}
};

export const getStickerPacks = async (): Promise<StickerPack[]> => {
	try {
		const rows = await db.getAllAsync(
			'SELECT * FROM sticker_packs WHERE is_active = 1 ORDER BY created_at DESC',
		);
		return rows.map((row: any) => ({
			id: row.id,
			name: row.name,
			description: row.description,
			thumbnailUri: row.thumbnail_uri,
			isPremium: !!row.is_premium,
			isCustom: !!row.is_custom,
			createdBy: row.created_by,
			price: row.price,
			isActive: !!row.is_active,
			createdAt: row.created_at,
		}));
	} catch (error) {
		throw error;
	}
};

export const getStickerById = async (stickerId: string): Promise<Sticker | null> => {
	try {
		const row = await db.getFirstAsync(
			'SELECT * FROM stickers WHERE id = ?',
			[stickerId],
		);
		if (!row) {
			return null;
		}
		return {
			id: (row as any).id,
			packId: (row as any).pack_id,
			name: (row as any).name,
			type: (row as any).type,
			data: (row as any).data,
		};
	} catch (error) {
		throw error;
	}
};

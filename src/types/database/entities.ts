export interface Challenge {
	id: string;
	title: string;
	icon: string;
	days: number;
	reward?: string;
	createdAt: string;
}

export enum StickerType {
	COLOR = 'color',
	IMAGE = 'image',
	CUSTOM = 'custom',
}

export interface StickerPack {
	id: string;
	name: string;
	description?: string;
	thumbnailUri?: string;
	isPremium: boolean;
	isCustom: boolean;
	createdBy?: string;
	price: number;
	isActive: boolean;
	createdAt: string;
}

export interface Sticker {
	id: string;
	packId: string;
	name: string;
	type: string;
	data: string;
}

export interface DailyStickerLog {
	id: string;
	challengeId: string;
	stickerId: string;
	date: string;
	createdAt: string;
}


export interface User {
	id: string;
	deviceId: string;
	isPremium: boolean;
	createdAt: string;
}

import { create } from 'zustand';
import type { StickerPackWithStickers } from '../types/database/api';

interface UIState {
	// 페이지 상태
	currentView: string;

	// 모달 상태
	createChallengeVisible: boolean;
	editChallengeVisible: boolean;
	stickerPageVisible: boolean;
	celebrationVisible: boolean;
	dayDetailVisible: boolean;
	stickerPackModalVisible: boolean;

	// 스티커팩 모달 상태
	activeStickerPack: StickerPackWithStickers | null;
}

interface UIActions {
	// 페이지 액션
	setCurrentView: (view: string) => void;

	// 모달 액션
	setCreateChallengeVisible: (visible: boolean) => void;
	setEditChallengeVisible: (visible: boolean) => void;
	setStickerPageVisible: (visible: boolean) => void;
	setCelebrationVisible: (visible: boolean) => void;
	setDayDetailVisible: (visible: boolean) => void;
	setStickerPackModalVisible: (visible: boolean) => void;

	// 스티커팩 모달 액션
	setActiveStickerPack: (pack: StickerPackWithStickers | null) => void;
}

type UIStore = UIState & UIActions;

export const useUIStore = create<UIStore>((set) => ({
	// 초기 상태
	currentView: 'card',
	createChallengeVisible: false,
	editChallengeVisible: false,
	stickerPageVisible: false,
	celebrationVisible: false,
	dayDetailVisible: false,
	stickerPackModalVisible: false,
	activeStickerPack: null,

	// 액션
	setCurrentView: (view: string) => set({ currentView: view }),
	setCreateChallengeVisible: (visible: boolean) =>
		set({ createChallengeVisible: visible }),
	setEditChallengeVisible: (visible: boolean) =>
		set({ editChallengeVisible: visible }),
	setStickerPageVisible: (visible: boolean) =>
		set({ stickerPageVisible: visible }),
	setCelebrationVisible: (visible: boolean) =>
		set({ celebrationVisible: visible }),
	setDayDetailVisible: (visible: boolean) => set({ dayDetailVisible: visible }),
	setStickerPackModalVisible: (visible: boolean) =>
		set({ stickerPackModalVisible: visible }),
	setActiveStickerPack: (pack: StickerPackWithStickers | null) =>
		set({ activeStickerPack: pack }),
}));

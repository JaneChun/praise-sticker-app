import { create } from 'zustand';
import type { StickerPackWithStickers } from '../types/database/api';

interface UIState {
	// 페이지 상태
	currentView: string;

	// 모달 상태
	createChallengeVisible: boolean;
	editChallengeVisible: boolean;
	celebrationVisible: boolean;
	dayDetailVisible: boolean;
	stickerPackModalVisible: boolean;
	rewardModalVisible: boolean;

	// 스티커팩 모달 상태
	activeStickerPack: StickerPackWithStickers | null;

	// 보상 모달 상태
	reward: string | null;
}

interface UIActions {
	// 페이지 액션
	setCurrentView: (view: string) => void;

	// 모달 액션
	setCreateChallengeVisible: (visible: boolean) => void;
	setEditChallengeVisible: (visible: boolean) => void;
	setCelebrationVisible: (visible: boolean) => void;
	setDayDetailVisible: (visible: boolean) => void;
	setStickerPackModalVisible: (visible: boolean) => void;
	setRewardModalVisible: (visible: boolean) => void;

	// 스티커팩 모달 액션
	setActiveStickerPack: (pack: StickerPackWithStickers | null) => void;

	// 보상 모달 액션
	setReward: (reward: string | null) => void;
}

type UIStore = UIState & UIActions;

export const useUIStore = create<UIStore>((set) => ({
	// 초기 상태
	currentView: 'card',
	createChallengeVisible: false,
	editChallengeVisible: false,
	celebrationVisible: false,
	dayDetailVisible: false,
	stickerPackModalVisible: false,
	rewardModalVisible: false,
	activeStickerPack: null,
	reward: null,

	// 액션
	setCurrentView: (view: string) => set({ currentView: view }),
	setCreateChallengeVisible: (visible: boolean) => set({ createChallengeVisible: visible }),
	setEditChallengeVisible: (visible: boolean) => set({ editChallengeVisible: visible }),
	setCelebrationVisible: (visible: boolean) => set({ celebrationVisible: visible }),
	setDayDetailVisible: (visible: boolean) => set({ dayDetailVisible: visible }),
	setStickerPackModalVisible: (visible: boolean) => set({ stickerPackModalVisible: visible }),
	setRewardModalVisible: (visible: boolean) => set({ rewardModalVisible: visible }),
	setActiveStickerPack: (pack: StickerPackWithStickers | null) => set({ activeStickerPack: pack }),
	setReward: (reward: string | null) => set({ reward }),
}));

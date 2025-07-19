import { CelebrationMessage } from '@/types';
import { create } from 'zustand';

interface CelebrationState {
	celebrationData: CelebrationMessage | null;
}

interface CelebrationActions {
	setCelebrationData: (celebrationData: CelebrationMessage | null) => void;
}

type CelebrationStore = CelebrationState & CelebrationActions;

export const useCelebrationStore = create<CelebrationStore>((set) => ({
	// 초기 상태
	celebrationData: null,

	// 액션
	setCelebrationData: (celebrationData: CelebrationMessage | null) =>
		set({ celebrationData: celebrationData }),
}));

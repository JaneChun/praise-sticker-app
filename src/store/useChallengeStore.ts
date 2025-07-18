import { create } from 'zustand';
import { getChallenges } from '../services';
import { Challenge } from '../types';

interface ChallengeState {
	selectedChallengeId: string | null;
	editingChallengeId: string | null;
	challenges: Challenge[];
	loading: boolean;
	error: string | null;
}

interface ChallengeActions {
	setSelectedChallengeId: (selectedChallengeId: string | null) => void;
	setEditingChallengeId: (editingChallengeId: string | null) => void;
	setChallenges: (challenges: Challenge[]) => void;
	loadChallenges: () => Promise<void>;
}

type ChallengeStore = ChallengeState & ChallengeActions;

export const useChallengeStore = create<ChallengeStore>((set) => ({
	// 초기 상태
	selectedChallengeId: null,
	editingChallengeId: null,
	challenges: [],
	loading: false,
	error: null,

	// 액션
	setSelectedChallengeId: (id: string | null) =>
		set({ selectedChallengeId: id }),

	setEditingChallengeId: (id: string | null) => set({ editingChallengeId: id }),

	setChallenges: (challenges: Challenge[]) => set({ challenges }),

	loadChallenges: async () => {
		set({ loading: true, error: null });

		try {
			const challengeList = await getChallenges();
			set({ challenges: challengeList as Challenge[] });
		} catch (err) {
			console.error('Failed to load challenges:', err);
			set({
				error: err instanceof Error ? err.message : 'Unknown error',
			});
		} finally {
			set({ loading: false });
		}
	},
}));

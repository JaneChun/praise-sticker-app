import { create } from 'zustand';
import { getChallengeProgress, getChallenges } from '../services';
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

			// 각 챌린지의 완료 상태를 확인하고 정렬
			const challengesWithCompletion = await Promise.all(
				challengeList.map(async (challenge) => {
					const progress = await getChallengeProgress(challenge.id);
					const isCompleted = progress.completedDays >= challenge.days;
					return { challenge, isCompleted };
				}),
			);

			// 정렬: 미완료 챌린지 먼저, 각 그룹 내에서는 최신순
			const sortedChallenges = challengesWithCompletion
				.sort((a, b) => {
					// 1차: 완료 상태별 정렬 (미완료 우선)
					if (a.isCompleted !== b.isCompleted) {
						return a.isCompleted ? 1 : -1;
					}
					// 2차: 생성 날짜별 정렬 (최신 우선)
					return (
						new Date(b.challenge.createdAt).getTime() -
						new Date(a.challenge.createdAt).getTime()
					);
				})
				.map((item) => item.challenge);

			set({ challenges: sortedChallenges as Challenge[] });
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

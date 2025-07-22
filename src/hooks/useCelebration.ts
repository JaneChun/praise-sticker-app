import { useCelebrationStore } from '@/store/useCelebrationStore';
import {
	CELEBRATION_MESSAGES,
	DEFAULT_MESSAGES,
	FINAL_MESSAGES,
	MILESTONES,
} from '../constants/data';
import { useUIStore } from '../store';
import { CelebrationMessage } from '../types';

interface UseCelebrationReturn {
	celebrationData: CelebrationMessage | null;
	showCelebration: (count: number, totalDays: number, reward?: string) => void;
	clearCelebration: () => void;
}

export const useCelebration = (): UseCelebrationReturn => {
	const { celebrationData, setCelebrationData } = useCelebrationStore();
	const setCelebrationVisible = useUIStore(state => state.setCelebrationVisible);

	const showCelebration = (count: number, totalDays: number, reward?: string): void => {
		let celebrationInfo: CelebrationMessage;

		// 1. 스티커를 다 모은 경우 (최종 메시지)
		if (count === totalDays) {
			celebrationInfo =
				FINAL_MESSAGES[Math.floor(Math.random() * FINAL_MESSAGES.length)];
		}
		// 2. 기본 마일스톤 (1, 3, 5, 10, 20, 30, 40, 50, 60, 70, 80, 100)
		else {
			const milestoneIndex = MILESTONES.indexOf(count);

			if (milestoneIndex >= 0) {
				// 마일스톤에 해당하는 경우 - 특별한 축하 메시지
				celebrationInfo = CELEBRATION_MESSAGES[milestoneIndex];
			} else {
				// 마일스톤이 아닌 경우 - 기본 메시지 중 랜덤 선택
				celebrationInfo =
					DEFAULT_MESSAGES[Math.floor(Math.random() * DEFAULT_MESSAGES.length)];
			}
		}

		// reward 정보 추가
		const celebrationWithReward: CelebrationMessage = {
			...celebrationInfo,
			reward,
		};

		// 모달 표시는 하지 않고 데이터만 저장
		setCelebrationData(celebrationWithReward);
	};

	const clearCelebration = () => {
		setCelebrationData(null);
		setCelebrationVisible(false);
	};

	return {
		celebrationData,
		showCelebration,
		clearCelebration,
	};
};

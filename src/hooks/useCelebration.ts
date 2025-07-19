import { useCelebrationStore } from '@/store/useCelebrationStore';
import {
	CELEBRATION_MESSAGES,
	DEFAULT_CELEBRATIONS,
	MILESTONES,
} from '../constants/data';
import { useUIStore } from '../store';
import { CelebrationMessage } from '../types';

interface UseCelebrationReturn {
	celebrationData: CelebrationMessage | null;
	showCelebration: (count: number) => void;
	clearCelebration: () => void;
}

export const useCelebration = (): UseCelebrationReturn => {
	const { celebrationData, setCelebrationData } = useCelebrationStore();
	const { setCelebrationVisible } = useUIStore();

	const showCelebration = (count: number): void => {
		// 마일스톤에 해당하면 해당하는 축하 메세지, 아니면 기본 메세지
		const milestoneIndex = MILESTONES.indexOf(count);

		let celebrationInfo: CelebrationMessage;

		if (milestoneIndex >= 0) {
			// 마일스톤에 해당하는 경우 - 특별한 축하 메시지
			celebrationInfo =
				CELEBRATION_MESSAGES[milestoneIndex] ||
				CELEBRATION_MESSAGES[CELEBRATION_MESSAGES.length - 1];
		} else {
			// 마일스톤이 아닌 경우 - 기본 메시지 중 랜덤 선택
			celebrationInfo =
				DEFAULT_CELEBRATIONS[
					Math.floor(Math.random() * DEFAULT_CELEBRATIONS.length)
				];
		}

		// TODO: 최종 메세지와 파티클 효과 표시

		setCelebrationData(celebrationInfo);
		setCelebrationVisible(true);
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

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
}

export const useCelebration = (): UseCelebrationReturn => {
	const { celebrationData, setCelebrationData } = useCelebrationStore();
	const { setCelebrationVisible } = useUIStore();

	const showCelebration = (count: number): void => {
		// 마일스톤에 해당하면 해당하는 축하 메세지, 아니면 기본 메세지
		const milestoneIndex = MILESTONES.indexOf(count) - 1;

		let celebrationInfo: CelebrationMessage;

		if (milestoneIndex < 0) {
			celebrationInfo =
				CELEBRATION_MESSAGES[milestoneIndex] ||
				CELEBRATION_MESSAGES[CELEBRATION_MESSAGES.length - 1];
		} else {
			celebrationInfo =
				DEFAULT_CELEBRATIONS[
					Math.floor(Math.random() * DEFAULT_CELEBRATIONS.length)
				];
		}

		setCelebrationData(celebrationInfo);
		setCelebrationVisible(true);
	};

	return {
		celebrationData,
		showCelebration,
	};
};

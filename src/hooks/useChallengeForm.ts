import { useState } from 'react';
import { Challenge, SetState } from '../types';

interface UseChallengeFormReturn {
	// 폼 상태
	challengeTitle: string;
	setChallengeTitle: SetState<string>;
	challengeReward: string;
	setChallengeReward: SetState<string>;
	selectedDays: number | 'custom';
	setSelectedDays: SetState<number | 'custom'>;
	selectedIcon: string;
	setSelectedIcon: SetState<string>;
	customDays: string;
	setCustomDays: SetState<string>;
	showCustomDays: boolean;
	setShowCustomDays: SetState<boolean>;

	// 유틸리티 함수
	resetForm: () => void;
	setInitialValues: (challenge: Challenge) => void;
	isValid: boolean;
	getFinalDays: () => number;
}

export const useChallengeForm = (): UseChallengeFormReturn => {
	// 폼 상태
	const [challengeTitle, setChallengeTitle] = useState<string>('');
	const [challengeReward, setChallengeReward] = useState<string>('');
	const [selectedDays, setSelectedDays] = useState<number | 'custom'>(7);
	const [selectedIcon, setSelectedIcon] = useState<string>('🏃‍♂️');
	const [customDays, setCustomDays] = useState<string>('');
	const [showCustomDays, setShowCustomDays] = useState<boolean>(false);

	// 폼 리셋
	const resetForm = (): void => {
		setChallengeTitle('');
		setChallengeReward('');
		setCustomDays('');
		setSelectedDays(7);
		setSelectedIcon('🏃‍♂️');
		setShowCustomDays(false);
	};

	// 초기값 설정 (수정 모드용)
	const setInitialValues = (challenge: Challenge): void => {
		setChallengeTitle(challenge.title);
		setChallengeReward(challenge.reward || '');
		setSelectedIcon(challenge.icon);
		
		// 일수 설정 - CHALLENGE_DURATIONS에 있는 값인지 확인
		const CHALLENGE_DURATIONS = [7, 14, 21, 30, 100];
		if (CHALLENGE_DURATIONS.includes(challenge.days)) {
			setSelectedDays(challenge.days);
			setShowCustomDays(false);
		} else {
			setSelectedDays('custom');
			setCustomDays(challenge.days.toString());
			setShowCustomDays(true);
		}
	};

	// 폼 유효성 검증
	const isValid = challengeTitle.trim().length > 0;

	// 최종 일수 계산
	const getFinalDays = (): number => {
		return selectedDays === 'custom' ? parseInt(customDays) || 0 : selectedDays;
	};

	return {
		// 폼 상태
		challengeTitle,
		setChallengeTitle,
		challengeReward,
		setChallengeReward,
		selectedDays,
		setSelectedDays,
		selectedIcon,
		setSelectedIcon,
		customDays,
		setCustomDays,
		showCustomDays,
		setShowCustomDays,

		// 유틸리티 함수
		resetForm,
		setInitialValues,
		isValid,
		getFinalDays,
	};
};

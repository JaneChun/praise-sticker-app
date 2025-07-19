import { CelebrationMessage } from '../types';

// 도전 아이콘 데이터
export const CHALLENGE_ICONS: string[] = [
	'🏃‍♂️',
	'📚',
	'💧',
	'🧘‍♀️',
	'🌙',
	'🥗',
	'💪',
	'🎯',
	'🎵',
	'✍️',
	'🌱',
	'✨',
	'🛌',
	'🔥',
	'💡',
	'🧹',
	'🌞',
	'⭐',
];

// 도전 기간 옵션
export const CHALLENGE_DURATIONS: number[] = [7, 14, 21, 30];

// 마일스톤 데이터
export const MILESTONES: number[] = [
	1, 3, 5, 10, 20, 30, 40, 50, 60, 70, 80, 100,
];

export const DEFAULT_MESSAGES: CelebrationMessage[] = [
	{
		title: '또 하나 완료!',
		// subtitle: '+5 XP',
		description: '작은 실천이 큰 변화를 만들어요\n오늘도 잘하고 있어요! 👍',
		icon: '✅',
	},
	{
		title: '좋아요!',
		// subtitle: '+5 XP',
		description: '매일의 작은 성취가\n나를 더 나은 사람으로 만들어요 🌟',
		icon: '😊',
	},
	{
		title: '한 걸음 더!',
		description: '조금씩 나아가는 지금 이 순간이\n가장 중요해요 🚶‍♂️',
		icon: '👣',
	},
	{
		title: '계속해볼까요?',
		description: '지금처럼만 해도 충분해요\n중요한건 꾸준함 🐢',
		icon: '🍀',
	},
	{
		title: '잘하고 있어요!',
		description: '작은 습관이 쌓여\n놀라운 변화를 만들어낼 거예요 🌈',
		icon: '💡',
	},
	{
		title: '멋져요!',
		description: '자신을 위한 실천\n그게 바로 최고의 투자예요 💖',
		icon: '🌟',
	},
];

// 축하 메시지 데이터
export const CELEBRATION_MESSAGES: CelebrationMessage[] = [
	{
		title: '첫 번째 스티커!',
		// subtitle: '+10 XP',
		description: '새로운 여정의 시작이에요!\n첫 걸음을 내딛었네요 🎯',
		icon: '🌟',
	},
	{
		title: '3개 달성!',
		// subtitle: '+15 XP',
		description: '습관의 씨앗이 싹트고 있어요\n이대로 계속 해보세요! 💪',
		icon: '🌱',
	},
	{
		title: '5개 달성!',
		// subtitle: '+20 XP',
		description: '꾸준함이 빛을 발하고 있어요\n정말 멋진 성과예요! ✨',
		icon: '⭐',
	},
	{
		title: '10개 달성!',
		description: '10개의 성취!\n쌓아온 결과가 자랑스러워요 🎉',
		icon: '🎖️',
	},
	{
		title: '20개 달성!',
		description: '이젠 꽤 익숙해졌죠?\n당신만의 리듬을 잘 찾아가고 있어요 🧭',
		icon: '👑',
	},
	{
		title: '30개 달성!',
		description: '꾸준함이 빛나고 있어요\n여기까지 온 당신, 정말 대단해요 🌟',
		icon: '🚀',
	},
	{
		title: '40개 달성!',
		description: '성장의 속도가 붙었어요\n멋진 흐름을 이어가고 있어요 💫',
		icon: '📈',
	},
	{
		title: '50개 달성!',
		description: '50개의 스티커가 쌓였어요\n이제 당신만의 페이스가 느껴져요 🏅',
		icon: '🥇',
	},
	{
		title: '60개 달성!',
		description: '꾸준함은 결국 힘이 돼요\n스스로가 자랑스러울 거예요 💖',
		icon: '🔥',
	},
	{
		title: '70개 달성!',
		description:
			'매일의 노력이 쌓여 든든한 습관이 되어가고 있어요\n계속 멋지게 나아가요 🏆',
		icon: '🎯',
	},
	{
		title: '80개 달성!',
		description: '눈앞에 목표가 보이네요\n마지막까지 함께 달려봐요 🌈',
		icon: '🎊',
	},
	{
		title: '100개 달성!',
		description: '이걸 해낸 당신이라면\n앞으로 무엇이든 해낼 수 있어요 🌟',
		icon: '🏁',
	},
];

export const FINAL_MESSAGES = [
	{
		title: '목표 달성!',
		description: '목표 달성!\n자신을 향한 최고의 선물이에요 🎁',
		icon: '🚀',
	},
	{
		title: '목표 달성!',
		description: '작은 노력이 모여\n크고 멋진 결과가 되었어요 ✨',
		icon: '🌟',
	},
	{
		title: '목표 달성!',
		description: '한 걸음 한 걸음이\n당신을 여기까지 이끌었어요 👣',
		icon: '🎉',
	},
	{
		title: '목표 달성!',
		description: '자신에게 보내는\n가장 따뜻한 박수예요 👏',
		icon: '💖',
	},
	{
		title: '목표 달성!',
		description: '목표를 향한 여정,\n끝까지 잘 마쳤어요 🎯',
		icon: '🏁',
	},
];

export const COLOR_PACKS = [
	[
		// 🌸 Pink & Rose
		'#FADADD',
		'#FFE4E1',
		'#FFB6C1',
		'#FFBCD9',
		'#FFCBDB',
		'#FFDDE2',
		'#FDBCB4',
		'#FFA07A',
		'#FFD8B1',
		'#F08080',
		'#F2BDCD',
		'#F8C8DC',
		'#FFE0E5',
		'#FFF0F5',
		'#E9D6EC',
		'#FDE2E4',
	],
	[
		// 🍑 Peach & Yellow
		'#FAF3A0',
		'#FFDAB9',
		'#FFF5CC',
		'#FFE5B4',
		'#FBCEB1',
		'#F8B878',
		'#DCAE96',
		'#FFE5D9',
		'#FAEBD7',
		'#FFE4C4',
		'#F9F0B3',
		'#F0D98C',
		'#F3E5AB',
		'#F5DEB3',
		'#FAF0C5',
		'#FFF9DB',
	],
	[
		// 🌿 Mint & Blue
		'#BEE7C6',
		'#DDEEFF',
		'#BBDDEE',
		'#C3E8F9',
		'#B2D8D8',
		'#C9D2D2',
		'#D0F0C0',
		'#A9D5A8',
		'#D6F1FF',
		'#B0E0E6',
		'#AEC6CF',
		'#BFEFFF',
		'#ADD8E6',
		'#87CEEB',
		'#87CEFA',
		'#F0F8FF',
	],
	[
		// 💜 Lavender & Neutrals
		'#E4D3FF',
		'#CCCCFF',
		'#E6DAF3',
		'#E6E6FA',
		'#D8BFD8',
		'#CBC3E3',
		'#E0BBE4',
		'#CBC3E3',
		'#CB99C9',
		'#D8B7DD',
		'#D3D3D3',
		'#E8E8E8',
		'#F0F0F0',
		'#D8D4E6',
		'#B7A8D0',
		'#8F82B9',
	],
];

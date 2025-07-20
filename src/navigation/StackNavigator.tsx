import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FC } from 'react';
import StickerPageScreen from '../screens/StickerPageScreen';
import { Challenge } from '../types';
import TabNavigator from './TabNavigator';

export type StackParamList = {
	MainTabs: undefined;
	StickerPage: {
		currentChallenge: Challenge;
	};
};

const Stack = createNativeStackNavigator<StackParamList>();

const StackNavigator: FC = () => {
	return (
		<Stack.Navigator
			screenOptions={{
				headerShown: false, // 모든 스크린에서 헤더 숨기기
				gestureEnabled: true, // 뒤로가기 제스처 활성화
			}}
		>
			<Stack.Screen name='MainTabs' component={TabNavigator} />
			<Stack.Screen
				name='StickerPage'
				component={StickerPageScreen}
				options={{
					presentation: 'card', // 모달 스타일 프레젠테이션
					gestureEnabled: true,
				}}
			/>
		</Stack.Navigator>
	);
};

export default StackNavigator;

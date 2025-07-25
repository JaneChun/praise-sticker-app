import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FC } from 'react';
import { Platform } from 'react-native';
import { COLORS } from '../constants/colors';
import CalendarScreen from '../screens/CalendarScreen';
import ChallengesScreen from '../screens/ChallengesScreen';

type TabParamList = {
	Challenges: undefined;
	Calendar: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

const TabNavigator: FC = () => {
	return (
		<Tab.Navigator
			screenOptions={{
				headerShown: false,
				tabBarHideOnKeyboard: true,
				tabBarActiveTintColor: COLORS.primary,
				tabBarInactiveTintColor: COLORS.text.secondary,
				tabBarStyle: {
					height: 60,
				},
				tabBarIconStyle: {
					marginTop: 4,
				},
				tabBarLabelStyle: {
					fontSize: 12,
					fontWeight: '600',
					paddingTop: Platform.OS === 'ios' ? 4 : 0,
				},
			}}
		>
			<Tab.Screen
				name='Challenges'
				component={ChallengesScreen}
				options={{
					tabBarLabel: '스티커',
					tabBarIcon: ({ color, size }: { color: string; size: number }) => (
						<MaterialCommunityIcons name='sticker-circle-outline' size={size} color={color} />
					),
				}}
			/>
			<Tab.Screen
				name='Calendar'
				component={CalendarScreen}
				options={{
					tabBarLabel: '캘린더',
					tabBarIcon: ({ color, size }: { color: string; size: number }) => (
						<MaterialCommunityIcons name='calendar-blank-outline' size={size} color={color} />
					),
				}}
			/>
		</Tab.Navigator>
	);
};

export default TabNavigator;

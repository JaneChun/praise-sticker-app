import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FC } from 'react';
import { Text } from 'react-native';
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
				tabBarActiveTintColor: COLORS.primary,
				tabBarInactiveTintColor: COLORS.text.secondary,
				tabBarStyle: {
					paddingVertical: 8,
					paddingBottom: 20,
					height: 80,
				},
				tabBarLabelStyle: {
					fontSize: 12,
					fontWeight: '600',
					paddingTop: 2,
				},
			}}
		>
			<Tab.Screen
				name='Challenges'
				component={ChallengesScreen}
				options={{
					tabBarLabel: '스티커',
					tabBarIcon: ({ color, size }: { color: string; size: number }) => (
						<Text style={{ fontSize: size, color }}>
							<MaterialCommunityIcons
								name='sticker-circle-outline'
								size={size}
								color={color}
							/>
						</Text>
					),
				}}
			/>
			<Tab.Screen
				name='Calendar'
				component={CalendarScreen}
				options={{
					tabBarLabel: '캘린더',
					tabBarIcon: ({ color, size }: { color: string; size: number }) => (
						<Text style={{ fontSize: size, color }}>
							<MaterialCommunityIcons
								name='calendar-blank-outline'
								size={size}
								color={color}
							/>
						</Text>
					),
				}}
			/>
		</Tab.Navigator>
	);
};

export default TabNavigator;

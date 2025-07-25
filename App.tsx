import { PortalProvider } from '@gorhom/portal';
import { NavigationContainer } from '@react-navigation/native';
import { useEffect } from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-get-random-values';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import StackNavigator from './src/navigation/StackNavigator';
import { useChallengeStore, useDatabaseStore } from './src/store';

const App = () => {
	const { initDatabase, isInitialized } = useDatabaseStore();
	const loadChallenges = useChallengeStore((state) => state.loadChallenges);

	useEffect(() => {
		(async () => {
			try {
				await initDatabase(); // 데이터베이스 초기화
			} catch (error) {
				console.error('App initialization failed:', error);
			}
		})();
	}, [initDatabase]);

	useEffect(() => {
		if (isInitialized) {
			loadChallenges();
		}
	}, [isInitialized, loadChallenges]);

	return (
		<GestureHandlerRootView style={styles.container}>
			<PortalProvider>
				<SafeAreaProvider>
					<SafeAreaView style={styles.container} edges={['bottom']}>
						<StatusBar barStyle='light-content' backgroundColor='transparent' translucent />
						<NavigationContainer>
							<StackNavigator />
						</NavigationContainer>
					</SafeAreaView>
				</SafeAreaProvider>
			</PortalProvider>
		</GestureHandlerRootView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
});

export default App;

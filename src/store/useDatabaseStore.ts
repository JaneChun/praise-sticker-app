import { create } from 'zustand';
import { initializeDatabase } from '../services/databaseService';

interface DatabaseState {
	isInitialized: boolean;
	loading: boolean;
	error: string | null;
}

interface DatabaseActions {
	initDatabase: () => Promise<void>;
}

type DatabaseStore = DatabaseState & DatabaseActions;

export const useDatabaseStore = create<DatabaseStore>((set) => ({
	// 초기 상태
	isInitialized: false,
	loading: false,
	error: null,

	// 액션
	initDatabase: async () => {
		set({ loading: true, error: null });

		try {
			await initializeDatabase();
			set({ isInitialized: true });

			console.log('Database initialized successfully');
		} catch (err) {
			console.error('Failed to initialize database:', err);
			set({
				error: err instanceof Error ? err.message : 'Unknown error',
				loading: false,
			});
		} finally {
			set({ loading: false });
		}
	},
}));

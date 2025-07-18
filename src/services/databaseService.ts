import * as SQLite from 'expo-sqlite';
import { v4 as uuidv4 } from 'uuid';

// DB 인스턴스 - 다른 서비스에서 사용할 수 있도록 export
export let db: SQLite.SQLiteDatabase;

// ===================================
//             DB 초기화
// ===================================

export const initializeDatabase = async (): Promise<void> => {
	db = await SQLite.openDatabaseAsync('praise_sticker');
	await initDatabase();
};

const initDatabase = async (): Promise<void> => {
	try {
		// 마이그레이션 체크 및 실행
		await runMigrations();

		// 사용자 테이블
		await db.execAsync(
			`CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        device_id TEXT UNIQUE,
        is_premium BOOLEAN DEFAULT false,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
		);

		// 도전 테이블
		await db.execAsync(
			`CREATE TABLE IF NOT EXISTS challenges (
        id TEXT PRIMARY KEY,
        title VARCHAR(20) NOT NULL,
        icon VARCHAR(255) NOT NULL,
        days INTEGER NOT NULL,
        reward VARCHAR(255),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
		);

		// 스티커팩 테이블
		await db.execAsync(
			`CREATE TABLE IF NOT EXISTS sticker_packs (
        id TEXT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        thumbnail_uri VARCHAR(500),
        is_premium BOOLEAN DEFAULT false,
        is_custom BOOLEAN DEFAULT false,
        created_by TEXT REFERENCES users(id),
        price INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
		);

		// 스티커 테이블 (개별 스티커 아이템)
		await db.execAsync(
			`CREATE TABLE IF NOT EXISTS stickers (
        id TEXT PRIMARY KEY,
        pack_id TEXT REFERENCES sticker_packs(id),
        name VARCHAR(255),
        type VARCHAR(20) NOT NULL,
        data TEXT NOT NULL
      )`,
		);

		// 일별 스티커 기록 (사용자가 붙인 스티커)
		await db.execAsync(
			`CREATE TABLE IF NOT EXISTS daily_sticker_logs (
        id TEXT PRIMARY KEY,
        challenge_id TEXT REFERENCES challenges(id),
        sticker_id TEXT REFERENCES stickers(id),
        date DATE NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(challenge_id, date)
      )`,
		);

		// 사용자 통계 테이블
		await db.execAsync(
			`CREATE TABLE IF NOT EXISTS user_stats (
        id TEXT PRIMARY KEY,
        total_stickers INTEGER DEFAULT 0,
        current_streak INTEGER DEFAULT 0,
        longest_streak INTEGER DEFAULT 0,
        total_challenges INTEGER DEFAULT 0,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
		);

		await insertDefaultUserStats();
		await insertDefaultStickerPackAndStickers();
	} catch (error) {
		throw error;
	}
};

// ===================================
//             유틸리티 함수
// ===================================

// DB 리셋 (테이블 삭제 후 재생성)
export const resetDatabase = async (): Promise<void> => {
	try {
		// 기존 테이블 삭제
		const tablesResult = await db.getAllAsync(
			`SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'`,
		);

		for (const table of tablesResult as any) {
			await db.execAsync(`DROP TABLE IF EXISTS ${table.name}`);
			console.log(`Dropped table ${table.name}`);
		}

		// 테이블 재생성
		await initDatabase();

		console.log('Database reset successfully');
	} catch (error) {
		console.error('Failed to reset database:', error);
		throw error;
	}
};

// ===================================
//          마이그레이션 시스템
// ===================================

const DATABASE_VERSION = 0; // 스키마 변경 시 증가

// 현재 데이터베이스 버전 조회
export const getCurrentDatabaseVersion = async (): Promise<number> => {
	try {
		const result = await db.getFirstAsync('PRAGMA user_version');
		return (result as any)?.user_version || 0;
	} catch (error) {
		console.error('Failed to get database version:', error);
		return 0;
	}
};

// 데이터베이스 버전 설정
const setDatabaseVersion = async (version: number): Promise<void> => {
	await db.execAsync(`PRAGMA user_version = ${version}`);
};

// 마이그레이션 정의
const migrations: {
	[version: number]: (db: SQLite.SQLiteDatabase) => Promise<void>;
} = {
	// 예: v0 -> v1 마이그레이션
	// 1: async (db) => {
	//   await db.execAsync('ALTER TABLE challenges ADD COLUMN category TEXT DEFAULT "general"');
	// },
};

// 마이그레이션 실행
export const runMigrations = async (): Promise<void> => {
	try {
		const currentVersion = await getCurrentDatabaseVersion();

		if (currentVersion < DATABASE_VERSION) {
			console.log(
				`Migrating from version ${currentVersion} to ${DATABASE_VERSION}`,
			);

			// 순차적으로 마이그레이션 실행
			for (
				let version = currentVersion + 1;
				version <= DATABASE_VERSION;
				version++
			) {
				if (migrations[version]) {
					console.log(`Running migration ${version}`);
					await migrations[version](db);
				}
			}

			// 버전 업데이트
			await setDatabaseVersion(DATABASE_VERSION);
			console.log(`Migration completed. Database version: ${DATABASE_VERSION}`);
		} else {
			console.log('Database is up to date');
		}
	} catch (error) {
		console.error('Migration failed:', error);
		throw error;
	}
};

// ===================================
//          기본 데이터 초기화
// ===================================

const insertDefaultUserStats = async () => {
	try {
		// 기존 사용자 통계 존재 여부
		const existingUserStats = await db.getFirstAsync(
			'SELECT COUNT(*) as count FROM user_stats',
		);

		if (existingUserStats && (existingUserStats as any).count > 0) {
			return;
		}

		// 사용자 통계 생성
		const statsId = uuidv4();
		await db.runAsync(
			'INSERT INTO user_stats (id, total_stickers, current_streak, longest_streak, total_challenges) VALUES (?, ?, ?, ?, ?)',
			[statsId, 0, 0, 0, 0],
		);

		console.log('초기 사용자 통계 데이터가 성공적으로 추가되었습니다.');
	} catch (error) {
		console.error('초기 사용자 통계 데이터 삽입 중 오류:', error);
	}
};

const insertDefaultStickerPackAndStickers = async (): Promise<void> => {
	try {
		// 기존 스티커팩 존재 여부 확인
		const existingPack = await db.getFirstAsync(
			'SELECT COUNT(*) as count FROM sticker_packs',
		);

		if (existingPack && (existingPack as any).count > 0) {
			return;
		}

		// 스티커팩 생성
		const packId = uuidv4();
		await db.runAsync(
			`INSERT INTO sticker_packs (id, name, description, is_premium, is_custom, price, is_active, created_at)
				VALUES (?, ?, ?, 0, 0, 0, 1, CURRENT_TIMESTAMP)`,
			[packId, '기본 컬러팩', '기본 색상 스티커 팩'],
		);

		const colors = [
			'#FADADD',
			'#FFE4E1',
			'#FFB6C1',
			'#FFBCD9',
			'#FFCBDB',
			'#FFDDE2',
			'#EDCDC2',
			'#FFDAB9',
			'#FFE5B4',
			'#FBCEB1',
			'#F8B878',
			'#F7E7CE',
		];

		// 스티커 생성
		for (const color of colors) {
			const stickerId = uuidv4();
			await db.runAsync(
				`INSERT INTO stickers (id, pack_id, name, type, data)
					VALUES (?, ?, ?, ?, ?)`,
				[stickerId, packId, color, 'color', color],
			);
		}

		console.log('기본 스티커팩과 스티커가 성공적으로 추가되었습니다.');
	} catch (error) {
		console.error('기본 스티커팩/스티커 삽입 중 오류:', error);
	}
};

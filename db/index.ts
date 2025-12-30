import { drizzle } from "drizzle-orm/expo-sqlite";
import * as SQLite from "expo-sqlite";

export const dbName = "db.db";

// LiveQuery를 쓸 거면 enableChangeListener: true 권장
const expo = SQLite.openDatabaseSync(dbName, { enableChangeListener: true });

export const db = drizzle(expo);

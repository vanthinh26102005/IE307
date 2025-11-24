import {
  openDatabaseAsync,
  openDatabaseSync,
  SQLiteDatabase,
} from "expo-sqlite";

export type NoteRow = {
  id: number;
  title: string;
  content: string | null;
  createdAt: number;
  updatedAt: number;
};

export type SettingsRow = {
  darkMode: boolean;
  fontSize: number;
};

const DB_NAME = "notes.db";
let dbPromise: Promise<SQLiteDatabase> | null = null;

async function getDb(): Promise<SQLiteDatabase> {
  if (dbPromise) return dbPromise;

  // Prefer sync API if available; fallback to async.
  if (typeof openDatabaseSync === "function") {
    try {
      const db = openDatabaseSync(DB_NAME);
      dbPromise = Promise.resolve(db);
      return db;
    } catch (err) {
      console.warn("openDatabaseSync failed, falling back to openDatabaseAsync", err);
    }
  }

  dbPromise = openDatabaseAsync(DB_NAME);
  return dbPromise;
}

export async function initDb() {
  const db = await getDb();
  await db.withTransactionAsync(async () => {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT,
        createdAt INTEGER DEFAULT (strftime('%s','now')),
        updatedAt INTEGER DEFAULT (strftime('%s','now'))
      );
      CREATE TABLE IF NOT EXISTS settings (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        darkMode INTEGER NOT NULL DEFAULT 0,
        fontSize INTEGER NOT NULL DEFAULT 16
      );
      INSERT OR IGNORE INTO settings (id, darkMode, fontSize) VALUES (1, 0, 16);
    `);
  });
}

export async function addNote(title: string, content: string) {
  const now = Date.now();
  const db = await getDb();
  const result = await db.runAsync(
    "INSERT INTO notes (title, content, createdAt, updatedAt) VALUES (?, ?, ?, ?)",
    [title, content, now, now]
  );
  return result.lastInsertRowId ?? null;
}

export async function getAllNotes(): Promise<NoteRow[]> {
  const db = await getDb();
  return db.getAllAsync<NoteRow>("SELECT * FROM notes ORDER BY updatedAt DESC");
}

export async function updateNote(id: number, title: string, content: string) {
  const now = Date.now();
  const db = await getDb();
  await db.runAsync(
    "UPDATE notes SET title = ?, content = ?, updatedAt = ? WHERE id = ?",
    [title, content, now, id]
  );
}

export async function deleteNote(id: number) {
  const db = await getDb();
  await db.runAsync("DELETE FROM notes WHERE id = ?", [id]);
}

export async function getSettings(): Promise<SettingsRow> {
  const db = await getDb();
  const row = await db.getFirstAsync<{ darkMode: number; fontSize: number }>(
    "SELECT darkMode, fontSize FROM settings WHERE id = 1"
  );
  return {
    darkMode: row ? row.darkMode === 1 : false,
    fontSize: row ? row.fontSize : 16,
  };
}

export async function saveSettings({ darkMode, fontSize }: SettingsRow) {
  const db = await getDb();
  await db.runAsync("UPDATE settings SET darkMode = ?, fontSize = ? WHERE id = 1", [
    darkMode ? 1 : 0,
    fontSize,
  ]);
}

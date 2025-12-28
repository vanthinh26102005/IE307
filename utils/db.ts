import * as SQLite from "expo-sqlite";

export type Place = {
  id: number;
  title: string;
  imageUri: string;
  lat: number;
  lng: number;
  address: string;
};

export type NewPlace = Omit<Place, "id">;

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

async function getDb() {
  if (!dbPromise) {
    dbPromise = SQLite.openDatabaseAsync("places.db");
  }
  return dbPromise;
}

export async function initDb() {
  const db = await getDb();
  await db.execAsync(
    "CREATE TABLE IF NOT EXISTS places (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, imageUri TEXT, lat REAL, lng REAL, address TEXT);"
  );
}

export async function insertPlace(place: NewPlace) {
  const db = await getDb();
  await initDb();
  const result = await db.runAsync(
    "INSERT INTO places (title, imageUri, lat, lng, address) VALUES (?, ?, ?, ?, ?)",
    [place.title, place.imageUri, place.lat, place.lng, place.address]
  );
  return result.lastInsertRowId ?? null;
}

export async function getPlaces() {
  const db = await getDb();
  await initDb();
  return db.getAllAsync<Place>(
    "SELECT id, title, imageUri, lat, lng, address FROM places ORDER BY id DESC"
  );
}

export async function getPlaceById(id: number) {
  const db = await getDb();
  await initDb();
  return db.getFirstAsync<Place>(
    "SELECT id, title, imageUri, lat, lng, address FROM places WHERE id = ?",
    [id]
  );
}

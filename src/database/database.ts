import type { SQLiteDatabase } from "expo-sqlite";
import categories from "../../constants/categories";

export async function initializeDatabase(db: SQLiteDatabase) {
  console.log("SQLite: начинаем инициализацию");
  await db.execAsync("PRAGMA foreign_keys = ON;");

  // Проверяем существующие столбцы таблицы users
  const userColumns = await db.getAllAsync<{ name: string }>(
    "PRAGMA table_info(users)",
  );

  const existingUserColumns = userColumns.map((column) => column.name);

  // Добавляем поле логина
  if (!existingUserColumns.includes("login")) {
    await db.execAsync("ALTER TABLE users ADD COLUMN login TEXT");
  }

  // Добавляем поле хеша пароля
  if (!existingUserColumns.includes("password_hash")) {
    await db.execAsync("ALTER TABLE users ADD COLUMN password_hash TEXT");
  }

  // Запрещаем регистрацию с уже существующим логином
  await db.execAsync(`
  CREATE UNIQUE INDEX IF NOT EXISTS idx_users_login
  ON users(login)
`);

  for (const category of categories) {
    await db.runAsync(
      `INSERT OR IGNORE INTO categories (name, description)
       VALUES (?, ?)`,
      category.label,
      "",
    );

    console.log("SQLite: проверена категория:", category.label);
  }

  const savedCategories = await db.getAllAsync<{
    id: number;
    name: string;
  }>("SELECT id, name FROM categories");
}

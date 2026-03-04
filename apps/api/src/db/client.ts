import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { getConfig } from "../config.js";
import * as schema from "./schema.js";

let db: ReturnType<typeof createDb>;
let sql: ReturnType<typeof postgres>;

function createDb() {
  const config = getConfig();

  sql = postgres(config.DATABASE_URL, {
    max: 10,
    idle_timeout: 20,
    connect_timeout: 10,
  });

  return drizzle(sql, { schema });
}

export function getDb() {
  if (!db) {
    db = createDb();
  }
  return db;
}

export async function closeDb() {
  if (sql) {
    await sql.end();
  }
}

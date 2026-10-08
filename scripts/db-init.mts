import { readFileSync } from "node:fs";
import postgres from "postgres";

process.loadEnvFile(".env");
const sql = postgres(process.env.DATABASE_URL!, { prepare: false });
await sql.unsafe(readFileSync("db/schema.sql", "utf8"));
console.log("Tables ready: call_records, blast_campaigns, blast_messages");
await sql.end();

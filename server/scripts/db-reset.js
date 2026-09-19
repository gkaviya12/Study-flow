/**
 * StudyFlow V2 — Database Reset Script
 *
 * Drops all tables, re-runs schema.sql, then seed.sql.
 * Usage: npm run db:reset
 *
 * Prerequisites:
 *   - Docker MySQL container running (docker compose up -d)
 *   - .env in project root with DB_HOST, DB_USER, DB_PASSWORD, DB_NAME
 *   - database/schema.sql and database/seed.sql present
 */

import "dotenv/config.js";
import mysql from "mysql2/promise";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

async function resetDatabase() {
  console.log("🔄  Connecting to MySQL...");

  // Connect WITHOUT a database first so we can create/drop it
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "root",
    multipleStatements: true, // allow semicolon-separated commands
  });

  const dbName = process.env.DB_NAME || "studyflow_db";

  try {
    console.log(`📦  Dropping database '${dbName}'...`);
    await connection.query(`DROP DATABASE IF EXISTS ${dbName}`);

    console.log(`📦  Creating database '${dbName}'...`);
    await connection.query(`CREATE DATABASE ${dbName}`);
    await connection.query(`USE ${dbName}`);

    console.log("📄  Applying schema.sql...");
    const schema = readFileSync(resolve(__dirname, "../../database/schema.sql"), "utf8");
    await connection.query(schema);
    console.log("✅  Schema applied.");

    console.log("🌱  Applying seed.sql...");
    const seed = readFileSync(resolve(__dirname, "../../database/seed.sql"), "utf8");
    await connection.query(seed);
    console.log("✅  Seed data inserted.");

    console.log(`\n✅  Database '${dbName}' is ready.`);
    console.log("   Test credentials: demo@studyflow.com / Test1234!\n");
  } catch (err) {
    console.error("❌  Database reset failed:", err.message);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

resetDatabase();
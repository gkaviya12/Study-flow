/**
 * StudyFlow V2 — MySQL connection pool
 * mysql2 with a single shared pool. Uses parameterized queries
 * (TRD §15: "SQL parameterized queries").
 *
 * Import: import db from "../config/database.js"
 * Query:  const [rows] = await db.query("SELECT ...", [param1, param2]);
 */

import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "root",
  database: process.env.DB_NAME || "studyflow_db",
  port: Number(process.env.DB_PORT || 3306),
  // Connection limits — keep it light for free-tier MySQL
  connectionLimit: 10,
  queueLimit: 0, // unlimited queue
  acquireTimeout: 15000,
  // Reuse idle connections; the pool handles this for us
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

export default pool;
/**
 * StudyFlow V2 — Models Entry Point
 * Exports the database pool so controllers can import it.
 * This is the top of the models layer in the TRD architecture:
 *   routes → controllers → models → database
 */

import db from "../config/database.js";

export default db;
export { db };
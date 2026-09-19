import { Router } from "express";
import { listNotes, createNote, updateNote, deleteNote, validateNotePayload, validateNoteQuery } from "../controllers/note.controller.js";

const router = Router();

/**
 * GET /api/notes
 * Query: ?subjectId=, ?page=, ?limit=
 * Returns paginated notes list
 */
router.get("/", validateNoteQuery, listNotes);

/**
 * POST /api/notes
 * Body: { title, content, subject_id?, tags?, is_checklist? }
 */
router.post("/", validateNotePayload, createNote);

/**
 * PUT /api/notes/:id
 * Body: { title?, content?, subject_id?, tags?, is_checklist? }
 * Note: call PUT on debounce for auto-save as per TRD §9
 */
router.put("/:id", validateNotePayload, updateNote);

/**
 * DELETE /api/notes/:id
 */
router.delete("/:id", deleteNote);

export default router;
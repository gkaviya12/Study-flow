import { Router } from "express";

const router = Router();

// GET /api/subjects
router.get("/", async (req, res) => {
  res.json({ success: true, message: "GET /api/subjects — not yet implemented in Phase 1" });
});

// POST /api/subjects
router.post("/", async (req, res) => {
  res.status(201).json({ success: true, message: "POST /api/subjects – placeholder" });
});

// PUT /api/subjects/:id
router.put("/:id", async (req, res) => {
  res.json({ success: true, message: "PUT /api/subjects/:id – placeholder" });
});

// DELETE /api/subjects/:id
router.delete("/:id", async (req, res) => {
  res.json({ success: true, message: "DELETE /api/subjects/:id – placeholder" });
});

export default router;
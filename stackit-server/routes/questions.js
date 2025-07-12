import express from "express";
import { getAllQuestions, askQuestion } from "../controllers/questionController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllQuestions);
router.post("/", protect, askQuestion); 

export default router;

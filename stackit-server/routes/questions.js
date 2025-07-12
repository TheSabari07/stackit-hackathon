import express from "express";
import { askQuestion, getAllQuestions } from "../controllers/questionController.js";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllQuestions);
router.post("/", auth, askQuestion);

export default router;

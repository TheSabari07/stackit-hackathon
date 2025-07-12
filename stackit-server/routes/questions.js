import express from "express";
import { getAllQuestions, askQuestion, postAnswer, voteAnswer } from "../controllers/questionController.js";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllQuestions);
router.post("/", auth, askQuestion);
router.post("/:id/answers", auth, postAnswer);
router.patch("/:qid/answers/:aid/vote", auth, voteAnswer);

export default router;
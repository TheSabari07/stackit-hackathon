import Question from "../models/Question.js";

export const getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find().sort({ createdAt: -1 });
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: "Failed to load questions" });
  }
};

export const askQuestion = async (req, res) => {
  try {
    const { title, description, tags } = req.body;
    const userId = req.user._id;

    if (!title || !description || !tags || tags.length === 0) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const newQuestion = new Question({
      title,
      description,
      tags,
      author: userId,
    });

    await newQuestion.save();

    res.status(201).json({ message: "Question posted successfully." });
  } catch (err) {
    res.status(500).json({ message: "Failed to post question." });
  }
};

export const postAnswer = async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const userId = req.user._id;

  if (!content) return res.status(400).json({ message: "Answer content is required." });

  try {
    const question = await Question.findById(id);
    if (!question) return res.status(404).json({ message: "Question not found." });

    question.answers.push({ content, author: userId });
    await question.save();

    res.status(201).json({ message: "Answer posted successfully." });
  } catch (err) {
    res.status(500).json({ message: "Failed to post answer." });
  }
};

export const voteAnswer = async (req, res) => {
  const { qid, aid } = req.params;
  const { vote } = req.body; 
  const userId = req.user._id;

  try {
    const question = await Question.findById(qid);
    const answer = question.answers.id(aid);

    if (!answer) return res.status(404).json({ message: "Answer not found" });

    if (!answer.votes) answer.votes = new Map();
    answer.votes.set(userId.toString(), vote);

    await question.save();
    res.json({ message: "Vote recorded" });
  } catch (err) {
    res.status(500).json({ message: "Failed to vote", error: err.message });
  }
};
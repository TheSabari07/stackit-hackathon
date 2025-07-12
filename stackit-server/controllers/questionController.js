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


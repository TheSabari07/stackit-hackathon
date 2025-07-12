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
  const { title, description, tags } = req.body;

  try {
    const newQuestion = new Question({
      title,
      description,
      tags,
      userId: req.user.userId, 
    });

    const saved = await newQuestion.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: "Failed to post question" });
  }
};

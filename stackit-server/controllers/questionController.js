import Question from "../models/Question.js";

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
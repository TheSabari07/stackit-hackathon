import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../utils/axios";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { toast } from "react-toastify";

export default function QuestionDetail() {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const isLoggedIn = !!localStorage.getItem("token");

  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
  });

  useEffect(() => {
    axios
      .get(`/questions`)
      .then((res) => {
        const found = res.data.find((q) => q._id === id);
        setQuestion(found);
        setLoading(false);
      })
      .catch((err) => {
        toast.error("Failed to load question");
        setLoading(false);
      });
  }, [id]);

  const handleAnswerSubmit = async () => {
    if (!isLoggedIn) return toast.warn("Login required to answer.");
    const content = editor.getHTML();
    if (!content || content === "<p></p>") return toast.warn("Answer is empty.");
    try {
      setSubmitting(true);
      await axios.post(`/questions/${id}/answers`, { content });
      toast.success("Answer submitted");
      const updated = await axios.get(`/questions`);
      setQuestion(updated.data.find((q) => q._id === id));
      editor.commands.clearContent();
    } catch (err) {
      toast.error("Failed to submit answer");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center p-8">Loading...</div>;
  if (!question) return <div className="text-center text-red-500">Question not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 min-h-[calc(100vh-5rem)]">
      <h1 className="text-3xl font-bold text-blue-700 dark:text-blue-400 mb-4">{question.title}</h1>
      <div className="text-gray-700 dark:text-gray-300 mb-4" dangerouslySetInnerHTML={{ __html: question.description }} />
      <div className="flex flex-wrap gap-2 mb-6">
        {question.tags.map((tag) => (
          <span key={tag} className="bg-blue-100 text-blue-800 px-2 py-1 text-xs rounded-full">#{tag}</span>
        ))}
      </div>

      <h2 className="text-xl font-semibold mb-3 dark:text-white">Answers ({question.answers.length})</h2>
      {question.answers.length === 0 ? (
        <p className="text-gray-500">No answers yet.</p>
      ) : (
        <div className="space-y-4 mb-6">
          {question.answers.map((ans, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 border dark:border-gray-700 p-4 rounded shadow-sm">
              <div
                className="text-gray-800 dark:text-gray-100 text-sm"
                dangerouslySetInnerHTML={{ __html: ans.content }}
              />
              <div className="text-xs text-right text-gray-500 dark:text-gray-400 mt-2">
                Answered on {new Date(ans.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}

      {isLoggedIn && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-2 dark:text-white">Your Answer</h3>
          <div className="border dark:border-gray-700 rounded mb-4 bg-white dark:bg-gray-900">
            <EditorContent editor={editor} className="min-h-[120px] p-3 text-gray-800 dark:text-gray-100" />
          </div>
          <button
            disabled={submitting}
            onClick={handleAnswerSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
          >
            {submitting ? "Submitting..." : "Submit Answer"}
          </button>
        </div>
      )}
    </div>
  );
}

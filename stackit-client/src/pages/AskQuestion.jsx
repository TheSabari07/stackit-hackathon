import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ReactSelect from "react-select";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AskQuestion() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState([]);

  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const description = editor?.getHTML();
    if (!title || !description || tags.length === 0) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "/questions",
        {
          title,
          description,
          tags: tags.map((tag) => tag.value),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Question posted successfully!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to post question");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 mt-10 bg-white dark:bg-gray-900 rounded-lg shadow-xl space-y-6">
      <h2 className="text-3xl font-bold text-blue-600 dark:text-blue-400">
        Ask a Question
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block font-medium mb-1 text-gray-700 dark:text-gray-300">
            Title
          </label>
          <input
            type="text"
            placeholder="Enter a short and descriptive title"
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <label className="block font-medium mb-1 text-gray-700 dark:text-gray-300">
            Description
          </label>
          <div className="border rounded p-2 dark:bg-gray-800 dark:border-gray-600">
            <EditorContent editor={editor} className="min-h-[200px] dark:text-white" />
          </div>
        </div>

        <div>
          <label className="block font-medium mb-1 text-gray-700 dark:text-gray-300">
            Tags
          </label>
          <ReactSelect
            isMulti
            options={[
              { value: "React", label: "React" },
              { value: "JWT", label: "JWT" },
              { value: "MongoDB", label: "MongoDB" },
              { value: "Express", label: "Express" },
              { value: "Node", label: "Node" },
            ]}
            onChange={setTags}
            placeholder="Select or type tags"
            className="text-sm"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow transition duration-200"
        >
          Submit Question
        </button>
      </form>
    </div>
  );
}

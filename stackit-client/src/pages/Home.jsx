import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../utils/axios";

export default function Home() {
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    axios.get("/questions")
      .then((res) => setQuestions(res.data))
      .catch((err) => console.error("Error fetching questions", err));
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">📋 All Questions</h1>
        <button
          onClick={() => {
            if (!isLoggedIn) {
              alert("Please login to ask a question.");
              navigate("/login");
            } else {
              navigate("/ask");
            }
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
        >
          + Ask Question
        </button>
      </div>

      {questions.length === 0 ? (
        <p className="text-gray-500">No questions posted yet.</p>
      ) : (
        <div className="space-y-4">
          {questions.map((q) => (
            <Link
              key={q._id}
              to={`/question/${q._id}`}
              className="block bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md p-4 transition"
            >
              <div className="flex flex-col gap-2">
                <h2 className="text-xl font-semibold text-blue-600 hover:underline">
                  {q.title}
                </h2>
                <p
                  className="text-gray-600 text-sm"
                  dangerouslySetInnerHTML={{
                    __html: q.description.slice(0, 150) + "...",
                  }}
                ></p>
                <div className="flex flex-wrap gap-2">
                  {q.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-blue-100 text-blue-800 px-2 py-1 text-xs rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                <div className="text-xs text-right text-gray-500">
                  Asked on {new Date(q.createdAt).toLocaleDateString()}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

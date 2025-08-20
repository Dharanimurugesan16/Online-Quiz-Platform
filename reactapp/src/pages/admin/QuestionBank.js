import React, { useState } from "react";

export default function QuestionBank({
  questions = [],
  questionForm = { text: "", type: "MULTIPLE_CHOICE", options: "", answer: "" },
  setQuestionForm = () => {},
  isEditingQuestion = false,
  handleQuestionChange = () => {},
  handleQuestionSubmit = () => {},
  handleQuestionEdit = () => {},
  handleQuestionDelete = () => {},
}) {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header + Add Button */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Question Bank</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {showForm ? "Cancel" : "Add Question"}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {isEditingQuestion ? "Edit Question" : "Add New Question"}
          </h2>
          <div className="space-y-4">
            {/* Question Text */}
            <input
              name="text"
              placeholder="Question Text"
              value={questionForm.text}
              onChange={handleQuestionChange}
              className="w-full border rounded-lg px-3 py-2"
            />

            {/* Question Type */}
            <select
              name="type"
              value={questionForm.type}
              onChange={(e) => {
                handleQuestionChange(e);
                if (e.target.value === "TRUE_FALSE") {
                  setQuestionForm((prev) => ({
                    ...prev,
                    type: "TRUE_FALSE",
                    options: "true,false",
                    answer: "true",
                  }));
                } else {
                  setQuestionForm((prev) => ({
                    ...prev,
                    type: "MULTIPLE_CHOICE",
                    options: "",
                    answer: "",
                  }));
                }
              }}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="MULTIPLE_CHOICE">Multiple Choice</option>
              <option value="TRUE_FALSE">True/False</option>
            </select>

            {/* Options */}
            {questionForm.type === "MULTIPLE_CHOICE" ? (
              <input
                name="options"
                placeholder="Options (comma separated)"
                value={questionForm.options}
                onChange={handleQuestionChange}
                className="w-full border rounded-lg px-3 py-2"
              />
            ) : (
              <div className="px-3 py-2 bg-gray-100 border rounded-lg text-gray-600">
                true, false
              </div>
            )}

            {/* Answer */}
            {questionForm.type === "MULTIPLE_CHOICE" ? (
              <input
                name="answer"
                placeholder="Correct Answer"
                value={questionForm.answer}
                onChange={handleQuestionChange}
                className="w-full border rounded-lg px-3 py-2"
              />
            ) : (
              <select
                name="answer"
                value={questionForm.answer}
                onChange={handleQuestionChange}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="true">True</option>
                <option value="false">False</option>
              </select>
            )}

            <div className="flex space-x-3">
              <button
                onClick={(e) => { handleQuestionSubmit(e); setShowForm(false); }}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
              >
                {isEditingQuestion ? "Update Question" : "Add Question"}
              </button>
              <button
                onClick={() => {
                  setShowForm(false);
                  setQuestionForm({ text: "", type: "MULTIPLE_CHOICE", options: "", answer: "" });
                }}
                className="px-4 py-2 text-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Question List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">All Questions ({questions.length})</h3>
        </div>
        <div className="divide-y">
          {questions.length > 0 ? questions.map(q => (
            <div key={q.id} className="p-6 flex items-center justify-between hover:bg-gray-50">
              <div>
                <h4 className="text-lg font-medium">{q.text}</h4>
                <p className="text-gray-600">Type: {q.type}</p>
                <div className="flex space-x-4 mt-2 text-sm text-gray-500">
                  <span className="flex items-center">
                    <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Options: {q.options}
                  </span>
                  <span className="flex items-center">
                    <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Answer: {q.answer}
                  </span>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => { handleQuestionEdit(q); setShowForm(true); }}
                  className="flex items-center text-blue-600"
                >
                  <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </button>
                <button
                  onClick={() => handleQuestionDelete(q.id)}
                  className="flex items-center text-red-600"
                >
                  <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          )) : <div className="p-6 text-center text-gray-500">No questions yet</div>}
        </div>
      </div>
    </div>
  );
}
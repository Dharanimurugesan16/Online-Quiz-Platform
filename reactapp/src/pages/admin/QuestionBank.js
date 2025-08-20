//
//import React from "react";
//
//export default function QuestionBank({
//  questions,
//  questionForm,
//  setQuestionForm,
//  isEditingQuestion,
//  handleQuestionChange,
//  handleQuestionSubmit,
//  handleQuestionEdit,
//  handleQuestionDelete,
//}) {
//  return (
//    <div className="space-y-8">
//      {/* Add/Edit Question Form */}
//      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-100 shadow">
//        <h2 className="text-xl font-semibold text-gray-800 mb-6">
//          {isEditingQuestion ? "Edit Question" : "Add New Question"}
//        </h2>
//
//        <form onSubmit={handleQuestionSubmit} className="space-y-6">
//          {/* Question Text */}
//          <div>
//            <label className="block text-sm font-medium text-gray-700 mb-2">
//              Question Text
//            </label>
//            <input
//              type="text"
//              name="text"
//              value={questionForm.text}
//              onChange={handleQuestionChange}
//              required
//              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
//            />
//          </div>
//
//          {/* Question Type */}
//          <div>
//            <label className="block text-sm font-medium text-gray-700 mb-2">
//              Question Type
//            </label>
//            <select
//              name="type"
//              value={questionForm.type}
//              onChange={(e) => {
//                handleQuestionChange(e);
//                if (e.target.value === "TRUE_FALSE") {
//                  setQuestionForm((prev) => ({
//                    ...prev,
//                    type: "TRUE_FALSE",
//                    options: "true,false", // string, lowercase (backend expects exactly this)
//                    answer: "true",        // lowercase default
//                  }));
//                } else {
//                  setQuestionForm((prev) => ({
//                    ...prev,
//                    type: "MULTIPLE_CHOICE",
//                    options: "",
//                    answer: "",
//                  }));
//                }
//              }}
//              required
//              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
//            >
//              <option value="MULTIPLE_CHOICE">Multiple Choice</option>
//              <option value="TRUE_FALSE">True/False</option>
//            </select>
//          </div>
//
//          {/* Options */}
//          {questionForm.type === "MULTIPLE_CHOICE" ? (
//            <div>
//              <label className="block text-sm font-medium text-gray-700 mb-2">
//                Options (comma separated)
//              </label>
//              <input
//                type="text"
//                name="options"
//                value={questionForm.options}
//                onChange={handleQuestionChange}
//                placeholder="Option1,Option2,Option3,Option4"
//                required
//                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
//              />
//            </div>
//          ) : (
//            <div>
//              <label className="block text-sm font-medium text-gray-700 mb-2">
//                Options
//              </label>
//              {/* Display only; actual value is set in state as 'true,false' */}
//              <p className="px-4 py-3 bg-gray-100 border border-gray-300 rounded-xl">
//                true, false
//              </p>
//            </div>
//          )}
//
//          {/* Answer */}
//          <div>
//            <label className="block text-sm font-medium text-gray-700 mb-2">
//              Correct Answer
//            </label>
//            {questionForm.type === "MULTIPLE_CHOICE" ? (
//              <input
//                type="text"
//                name="answer"
//                value={questionForm.answer}
//                onChange={handleQuestionChange}
//                required
//                placeholder="Correct answer text"
//                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
//              />
//            ) : (
//              <select
//                name="answer"
//                value={questionForm.answer}
//                onChange={handleQuestionChange}
//                required
//                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
//              >
//                <option value="true">True</option>
//                <option value="false">False</option>
//              </select>
//            )}
//          </div>
//
//
//          {/* Submit Button */}
//          <button
//            type="submit"
//            className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
//          >
//            {isEditingQuestion ? "Update Question" : "Add Question"}
//          </button>
//        </form>
//      </div>
//
//      {/* Question List */}
//      <div className="bg-white rounded-2xl shadow border border-gray-200 p-6">
//        <h2 className="text-xl font-semibold text-gray-800 mb-6">Question Bank</h2>
//        <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
//          <thead className="bg-gray-100">
//            <tr>
//              <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Text</th>
//              <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Type</th>
//              <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Options</th>
//              <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Answer</th>
//              <th className="py-3 px-4 text-right text-sm font-medium text-gray-600">Actions</th>
//            </tr>
//          </thead>
//          <tbody className="divide-y divide-gray-200">
//            {questions.map((q) => (
//              <tr key={q.id}>
//                <td className="py-3 px-4">{q.text}</td>
//                <td className="py-3 px-4">{q.type}</td>
//                <td className="py-3 px-4">{q.options}</td>
//                <td className="py-3 px-4">{q.answer}</td>
//                <td className="py-3 px-4 text-right space-x-2">
//                  <button
//                    onClick={() => handleQuestionEdit(q)}
//                    className="text-blue-600 hover:text-blue-800 font-medium"
//                  >
//                    Edit
//                  </button>
//                  <button
//                    onClick={() => handleQuestionDelete(q.id)}
//                    className="text-red-600 hover:text-red-800 font-medium"
//                  >
//                    Delete
//                  </button>
//                </td>
//              </tr>
//            ))}
//            {questions.length === 0 && (
//              <tr>
//                <td colSpan="5" className="py-6 text-center text-gray-500">
//                  No questions available.
//                </td>
//              </tr>
//            )}
//          </tbody>
//        </table>
//      </div>
//    </div>
//  );
//}
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
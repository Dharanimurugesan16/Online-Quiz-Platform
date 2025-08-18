import React, { useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";

export default function QuestionBank({
  questions,
  questionForm,
  setQuestionForm,
  isEditingQuestion,
  setIsEditingQuestion,
  error,
  handleQuestionChange,
  handleQuestionSubmit,
  handleQuestionEdit,
  handleQuestionDelete
}) {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Question Bank</h1>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg">
          <Plus className="h-5 w-5 mr-2" /> {showForm ? "Cancel" : "Add Question"}
        </button>
      </div>

      {error && <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg">{error}</div>}

      {/* Form */}
      {showForm && (
        <div className="bg-white border p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">{isEditingQuestion ? "Edit Question" : "Add Question"}</h2>
          <input name="text" placeholder="Question text" value={questionForm.text} onChange={handleQuestionChange} className="w-full border rounded-lg px-3 py-2 mb-3" />
          <input name="options" placeholder="Options (comma separated)" value={questionForm.options} onChange={handleQuestionChange} className="w-full border rounded-lg px-3 py-2 mb-3" />
          <input name="answer" placeholder="Correct Answer" value={questionForm.answer} onChange={handleQuestionChange} className="w-full border rounded-lg px-3 py-2 mb-3" />
          <div className="flex space-x-3">
            <button onClick={(e) => { handleQuestionSubmit(e); setShowForm(false); }} className="flex-1 bg-green-600 text-white py-2 rounded-lg">
              {isEditingQuestion ? "Update Question" : "Add Question"}
            </button>
            <button onClick={() => { setShowForm(false); setIsEditingQuestion(false); setQuestionForm({ id: null, text: "", options: "", answer: "" }); }} className="px-4 py-2 text-gray-600">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Question List */}
      <div className="bg-white border rounded-lg">
        <div className="p-6 border-b"><h3 className="text-lg font-semibold">All Questions ({questions.length})</h3></div>
        {questions.length > 0 ? questions.map(q => (
          <div key={q.id} className="p-6 flex justify-between hover:bg-gray-50">
            <div>
              <h4 className="font-medium">{q.text}</h4>
              <p className="text-sm text-gray-600 mt-1">Options: {q.options}</p>
              <p className="text-sm text-green-700 mt-1">Answer: {q.answer}</p>
            </div>
            <div className="flex space-x-2">
              <button onClick={() => { handleQuestionEdit(q); setShowForm(true); }} className="flex items-center text-blue-600"><Edit className="h-4 w-4 mr-1" />Edit</button>
              <button onClick={() => handleQuestionDelete(q.id)} className="flex items-center text-red-600"><Trash2 className="h-4 w-4 mr-1" />Delete</button>
            </div>
          </div>
        )) : <div className="p-6 text-center text-gray-500">No questions yet</div>}
      </div>
    </div>
  );
}

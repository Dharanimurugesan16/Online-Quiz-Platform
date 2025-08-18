import React, { useState } from "react";
import { Plus, Clock, FileText, Edit, Trash2 } from "lucide-react";

export default function QuizManagement({
  quizzes,
  questions,
  quizForm,
  setQuizForm,
  isEditingQuiz,
  setIsEditingQuiz,
  error,
  handleQuizChange,
  handleQuizCheckbox,
  handleQuizSubmit,
  handleQuizEdit,
  handleQuizDelete
}) {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header + Add Button */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Quiz Management</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          {showForm ? "Cancel" : "Add Quiz"}
        </button>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>}

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {isEditingQuiz ? "Edit Quiz" : "Create New Quiz"}
          </h2>
          <div className="space-y-4">
            <input name="title" placeholder="Quiz Title" value={quizForm.title} onChange={handleQuizChange} className="w-full border rounded-lg px-3 py-2" />
            <input name="description" placeholder="Quiz Description" value={quizForm.description} onChange={handleQuizChange} className="w-full border rounded-lg px-3 py-2" />
            <input type="number" name="timeLimit" placeholder="Time Limit" value={quizForm.timeLimit} onChange={handleQuizChange} className="w-full border rounded-lg px-3 py-2" />

            {/* Question Selection */}
            <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto border rounded-lg p-3">
              {questions.map(q => (
                <label key={q.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
                  <input type="checkbox" checked={quizForm.questions.includes(q.id)} onChange={() => handleQuizCheckbox(q.id)} className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
                  <span className="text-sm">{q.text}</span>
                </label>
              ))}
            </div>

            <div className="flex space-x-3">
              <button onClick={(e) => { handleQuizSubmit(e); setShowForm(false); }} className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
                {isEditingQuiz ? "Update Quiz" : "Create Quiz"}
              </button>
              <button onClick={() => { setShowForm(false); setIsEditingQuiz(false); setQuizForm({ id: null, title: "", description: "", timeLimit: 0, questions: [] }); }} className="px-4 py-2 text-gray-600">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quiz List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b"><h3 className="text-lg font-semibold">All Quizzes ({quizzes.length})</h3></div>
        <div className="divide-y">
          {quizzes.length > 0 ? quizzes.map(q => (
            <div key={q.id} className="p-6 flex items-center justify-between hover:bg-gray-50">
              <div>
                <h4 className="text-lg font-medium">{q.title}</h4>
                <p className="text-gray-600">{q.description}</p>
                <div className="flex space-x-4 mt-2 text-sm text-gray-500">
                  <span className="flex items-center"><Clock className="h-4 w-4 mr-1" />{q.timeLimit} min</span>
                  <span className="flex items-center"><FileText className="h-4 w-4 mr-1" />{q.questions?.length || 0} questions</span>
                </div>
              </div>
              <div className="flex space-x-2">
                <button onClick={() => { handleQuizEdit(q); setShowForm(true); }} className="flex items-center text-blue-600"><Edit className="h-4 w-4 mr-1" />Edit</button>
                <button onClick={() => handleQuizDelete(q.id)} className="flex items-center text-red-600"><Trash2 className="h-4 w-4 mr-1" />Delete</button>
              </div>
            </div>
          )) : <div className="p-6 text-center text-gray-500">No quizzes yet</div>}
        </div>
      </div>
    </div>
  );
}

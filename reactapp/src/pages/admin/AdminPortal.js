import React, { useState, useEffect } from "react";
import { Menu, X, Home, FileText, HelpCircle, Settings, LogOut, GraduationCap, User, ChevronRight } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import Dashboard from "./Dashboard";
import QuizManagement from "./QuizManagement";
import QuestionBank from "./QuestionBank";

export default function AdminPortal() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const navigate = useNavigate();

  // States
  const [quizzes, setQuizzes] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [students, setStudents] = useState([]);
  const [error, setError] = useState("");

  const [quizForm, setQuizForm] = useState({
    id: null,
    title: "",
    description: "",
    timeLimit: 0,
    questions: [],
  });

  const [questionForm, setQuestionForm] = useState({
    id: null,
    text: "",
    options: "",
    answer: "",
  });

  const [isEditingQuiz, setIsEditingQuiz] = useState(false);
  const [isEditingQuestion, setIsEditingQuestion] = useState(false);

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  const axiosInstance = axios.create({
    baseURL: "http://localhost:8080/api",
    withCredentials: true,
  });

  // Fetch data
  const fetchData = async () => {
    try {
      const [quizRes, questionRes, studentRes] = await Promise.all([
        axiosInstance.get("/quiz/all"),
        axiosInstance.get("/question/all"),
        axiosInstance.get("/users/students"),
      ]);
      setQuizzes(quizRes.data);
      setQuestions(questionRes.data);
      setStudents(studentRes.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch data");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Quiz Handlers
  const handleQuizChange = (e) =>
    setQuizForm({ ...quizForm, [e.target.name]: e.target.value });

  const handleQuizCheckbox = (id) =>
    setQuizForm({
      ...quizForm,
      questions: quizForm.questions.includes(id)
        ? quizForm.questions.filter((q) => q !== id)
        : [...quizForm.questions, id],
    });

  const handleQuizSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...quizForm,
        questions: quizForm.questions.map((id) => ({ id })),
      };
      if (isEditingQuiz) {
        await axiosInstance.put(`/quiz/update/${quizForm.id}`, payload);
      } else {
        await axiosInstance.post("/quiz/create", payload);
      }
      setQuizForm({ id: null, title: "", description: "", timeLimit: 0, questions: [] });
      setIsEditingQuiz(false);
      fetchData();
    } catch {
      setError("Failed to save quiz");
    }
  };

  const handleQuizEdit = (q) => {
    setQuizForm({
      id: q.id,
      title: q.title,
      description: q.description,
      timeLimit: q.timeLimit,
      questions: q.questions.map((qs) => qs.id),
    });
    setIsEditingQuiz(true);
  };

  const handleQuizDelete = async (id) => {
    if (!id) return;
    if (window.confirm("Delete this quiz?")) {
      try {
        console.log("Deleting quiz ID:", id);
        await axiosInstance.delete(`/quiz/delete/${Number(id)}`);
        setQuizzes(prev => prev.filter(q => q.id !== id));
      } catch (err) {
        console.error(err);
        setError("Failed to delete quiz");
      }
    }
  };

  // Question Handlers
  const handleQuestionChange = (e) =>
    setQuestionForm({ ...questionForm, [e.target.name]: e.target.value });

  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditingQuestion) {
        await axiosInstance.put(`/question/update/${questionForm.id}`, questionForm);
      } else {
        await axiosInstance.post("/question/create", questionForm);
      }
      setQuestionForm({ id: null, text: "", options: "", answer: "" });
      setIsEditingQuestion(false);
      fetchData();
    } catch {
      setError("Failed to save question");
    }
  };

  const handleQuestionEdit = (q) => {
    setQuestionForm({ id: q.id, text: q.text, options: q.options, answer: q.answer });
    setIsEditingQuestion(true);
  };

  const handleQuestionDelete = async (id) => {
    if (window.confirm("Delete this question?")) {
      try {
        await axiosInstance.delete(`/question/delete/${id}`);
        fetchData();
      } catch {
        setError("Failed to delete question");
      }
    }
  };

  // Assign Quiz to Student
  const handleAssignQuiz = async () => {
    if (!selectedStudent || !selectedQuiz) return alert("Select student and quiz");
    try {
      await axiosInstance.post(`/users/assign?userId=${selectedStudent}&quizId=${selectedQuiz}`);
      alert("Quiz assigned successfully");
    } catch {
      alert("Failed to assign quiz");
    }
  };

  const sidebarItems = [
    { name: "Dashboard", id: "dashboard", icon: Home, description: "Overview & stats" },
    { name: "Quizzes", id: "quizzes", icon: FileText, description: "Manage quizzes" },
    { name: "Questions", id: "questions", icon: HelpCircle, description: "Question bank" },
    { name: "Settings", id: "settings", icon: Settings, description: "Configuration" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Modern Sidebar */}
      <div
        className={`bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white flex flex-col justify-between transition-all duration-300 ease-in-out shadow-2xl ${
          sidebarOpen ? "w-72" : "w-20"
        }`}
      >
        {/* Header Section */}
        <div className="flex flex-col">
          {/* Logo and Toggle */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            {sidebarOpen && (
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    QuizMaster
                  </h1>
                  <p className="text-xs text-gray-400">Admin Portal</p>
                </div>
              </div>
            )}

            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-700 transition-colors duration-200 group"
            >
              {sidebarOpen ? (
                <X className="h-5 w-5 group-hover:rotate-90 transition-transform duration-200" />
              ) : (
                <Menu className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
              )}
            </button>
          </div>

          {/* Navigation Items */}
          <div className="flex flex-col p-4 space-y-2">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`group relative flex items-center w-full p-3 rounded-xl transition-all duration-200 ${
                  activeTab === item.id
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105"
                    : "hover:bg-gray-700 hover:transform hover:scale-105"
                }`}
              >
                {/* Active Indicator */}
                {activeTab === item.id && (
                  <div className="absolute left-0 w-1 h-8 bg-white rounded-r-full"></div>
                )}

                {/* Icon */}
                <div className={`flex items-center justify-center min-w-[2rem] ${
                  activeTab === item.id ? "text-white" : "text-gray-300 group-hover:text-white"
                }`}>
                  <item.icon className="h-5 w-5" />
                </div>

                {/* Text Content */}
                {sidebarOpen && (
                  <div className="flex-1 ml-4 text-left">
                    <div className={`font-medium text-sm ${
                      activeTab === item.id ? "text-white" : "text-gray-200 group-hover:text-white"
                    }`}>
                      {item.name}
                    </div>
                    <div className={`text-xs mt-0.5 ${
                      activeTab === item.id ? "text-blue-100" : "text-gray-400 group-hover:text-gray-300"
                    }`}>
                      {item.description}
                    </div>
                  </div>
                )}

                {/* Arrow Indicator */}
                {sidebarOpen && activeTab === item.id && (
                  <ChevronRight className="h-4 w-4 text-white ml-2" />
                )}

                {/* Tooltip for collapsed state */}
                {!sidebarOpen && (
                  <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                    {item.name}
                    <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Admin Profile Section */}
        <div className="p-4 border-t border-gray-700">
          {sidebarOpen ? (
            <div className="bg-gray-800 rounded-xl p-4 mb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-full">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-white text-sm truncate">
                    Admin User
                  </div>
                  <div className="text-xs text-gray-400">Administrator</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-full">
                <User className="h-5 w-5 text-white" />
              </div>
            </div>
          )}

          {/* Logout Button */}
          <button
            onClick={() => navigate("/")}
            className={`group flex items-center w-full p-3 rounded-xl bg-red-600 hover:bg-red-700 transition-all duration-200 transform hover:scale-105 ${
              sidebarOpen ? "justify-start" : "justify-center"
            }`}
          >
            <LogOut className="h-5 w-5 text-white" />
            {sidebarOpen && (
              <span className="ml-4 text-white font-medium">Logout</span>
            )}

            {/* Tooltip for collapsed logout */}
            {!sidebarOpen && (
              <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                Logout
                <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto bg-white">
        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl text-red-700 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              {error}
            </div>
          </div>
        )}

        <div className="max-w-6xl mx-auto">

        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            <Dashboard quizzes={quizzes} questions={questions} />
          </div>
        )}

        {/* Quizzes Tab */}
        {activeTab === "quizzes" && (
          <div className="space-y-6">


            <QuizManagement
              quizzes={quizzes}
              questions={questions}
              quizForm={quizForm}
              setQuizForm={setQuizForm}
              isEditingQuiz={isEditingQuiz}
              handleQuizChange={handleQuizChange}
              handleQuizCheckbox={handleQuizCheckbox}
              handleQuizSubmit={handleQuizSubmit}
              handleQuizEdit={handleQuizEdit}
              handleQuizDelete={handleQuizDelete}
            />

            {/* Assign Quiz Section */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Assign Quiz to Student
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Student
                  </label>
                  <select
                    value={selectedStudent || ""}
                    onChange={e => setSelectedStudent(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                  >
                    <option value="">Choose a student...</option>
                    {students.map(s => (
                      <option key={s.id} value={s.id}>{s.username}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Quiz
                  </label>
                  <select
                    value={selectedQuiz || ""}
                    onChange={e => setSelectedQuiz(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                  >
                    <option value="">Choose a quiz...</option>
                    {quizzes.map(q => (
                      <option key={q.id} value={q.id}>{q.title}</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleAssignQuiz}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Assign Quiz
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Questions Tab */}
        {activeTab === "questions" && (
          <div className="space-y-6">
          <QuestionBank
              questions={questions}
              questionForm={questionForm}
              setQuestionForm={setQuestionForm}
              isEditingQuestion={isEditingQuestion}
              handleQuestionChange={handleQuestionChange}
              handleQuestionSubmit={handleQuestionSubmit}
              handleQuestionEdit={handleQuestionEdit}
              handleQuestionDelete={handleQuestionDelete}
            />
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Settings</h1>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-100 text-center">
              <div className="text-6xl mb-4">⚙️</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Settings Panel</h3>
              <p className="text-gray-600">Advanced configuration options will be available here soon.</p>
            </div>
          </div>
        )}

        </div>
      </div>
    </div>
  );
}
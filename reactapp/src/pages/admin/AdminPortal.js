import React, { useEffect, useState } from "react";
import { Menu, X, Home, FileText, HelpCircle, Settings, LogOut, GraduationCap, User, ChevronRight, Repeat, BarChart2 } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import Dashboard from "./Dashboard";
import QuizManagement from "./QuizManagement";
import QuestionBank from "./QuestionBank";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function AdminPortal() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [quizzes, setQuizzes] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [students, setStudents] = useState([]);
  const [retakeRequests, setRetakeRequests] = useState([]);
  const [quizAttempts, setQuizAttempts] = useState([]);
  const [selectedQuizForScores, setSelectedQuizForScores] = useState("");
  const [error, setError] = useState("");
  const [quizForm, setQuizForm] = useState({
    id: null,
    title: "",
    description: "",
    timeLimit: 0,
    difficulty: "EASY",
    deadline: "",
    questions: [],
  });
  const [questionForm, setQuestionForm] = useState({
    id: null,
    text: "",
    options: "",
    answer: "",
    type: "MULTIPLE_CHOICE",
  });
  const [isEditingQuiz, setIsEditingQuiz] = useState(false);
  const [isEditingQuestion, setIsEditingQuestion] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [viewMode, setViewMode] = useState("table"); // Toggle for table/chart view
  const navigate = useNavigate();

  const axiosInstance = axios.create({
    baseURL: "http://localhost:8080/api",
    withCredentials: true,
  });

  const sidebarItems = [
    { name: "Dashboard", id: "dashboard", icon: Home, description: "Overview & stats" },
    { name: "Quizzes", id: "quizzes", icon: FileText, description: "Manage quizzes" },
    { name: "Questions", id: "questions", icon: HelpCircle, description: "Question bank" },
    { name: "Retake Requests", id: "retake-requests", icon: Repeat, description: "Manage retake requests" },
    { name: "Student Scores", id: "student-scores", icon: BarChart2, description: "View student scores" },

  ];

  const fetchData = async () => {
    try {
      const [quizRes, questionRes, studentRes, retakeRes] = await Promise.all([
        axiosInstance.get("/quiz/all"),
        axiosInstance.get("/question/all"),
        axiosInstance.get("/users/students"),
        axiosInstance.get("/quiz-retake/requests").catch((err) => {
          if (err.response?.status === 404) {
            console.warn("Retake requests endpoint not found, returning empty array");
            return { data: [] };
          }
          throw err;
        }),
      ]);
      setQuizzes(quizRes.data);
      setQuestions(questionRes.data);
      setStudents(studentRes.data);
      setRetakeRequests(retakeRes.data);
      console.log("Fetched retake requests:", retakeRes.data);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to fetch data. Some features may not work as expected.");
    }
  };

  const fetchQuizAttempts = async (quizId) => {
    if (!quizId) {
      setQuizAttempts([]);
      return;
    }
    try {
      const response = await axiosInstance.get(`/quiz-attempt/quiz/${quizId}`);
      setQuizAttempts(response.data);
      console.log(`Fetched attempts for quiz ID ${quizId}:`, response.data);
    } catch (err) {
      console.error(`Error fetching attempts for quiz ID ${quizId}:`, err);
      const quizTitle = quizzes.find((q) => q.id === Number(quizId))?.title || quizId;
      if (err.response?.status === 404) {
        setError(`No attempts found for quiz "${quizTitle}".`);
      } else {
        setError(`Failed to fetch attempts for quiz "${quizTitle}". Please try again later.`);
      }
      setQuizAttempts([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (activeTab === "student-scores" && selectedQuizForScores) {
      fetchQuizAttempts(selectedQuizForScores);
    } else if (activeTab === "student-scores") {
      setQuizAttempts([]);
    }
  }, [activeTab, selectedQuizForScores]);

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
        deadline: quizForm.deadline ? new Date(quizForm.deadline).toISOString() : null,
      };
      if (isEditingQuiz) {
        await axiosInstance.put(`/quiz/update/${quizForm.id}`, payload);
      } else {
        await axiosInstance.post("/quiz/create", payload);
      }
      setQuizForm({ id: null, title: "", description: "", timeLimit: 0, difficulty: "EASY", deadline: "", questions: [] });
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
      difficulty: q.difficulty,
      deadline: q.deadline ? new Date(q.deadline).toISOString().slice(0, 16) : "",
      questions: q.questions.map((qs) => qs.id),
    });
    setIsEditingQuiz(true);
  };

  const handleQuizDelete = async (id) => {
    if (!id) return;
    if (window.confirm("Delete this quiz and all its associated retake requests?")) {
      try {
        console.log("Deleting quiz ID:", id);
        await axiosInstance.delete(`/quiz/delete/${Number(id)}`);
        setQuizzes((prev) => prev.filter((q) => q.id !== id));
        setRetakeRequests((prev) => {
          const updatedRequests = prev.filter((r) => Number(r.quizId) !== Number(id));
          console.log("Updated retake requests after deletion:", updatedRequests);
          return updatedRequests;
        });
        await fetchData();
        console.log("Quiz deleted and all retake requests removed for quiz ID:", id);
      } catch (err) {
        console.error("Delete quiz error:", err);
        setError(`Failed to delete quiz or retake requests: ${err.response?.data?.error || err.message}`);
      }
    }
  };

  const handleQuestionChange = (e) =>
    setQuestionForm({ ...questionForm, [e.target.name]: e.target.value });

  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    try {
      let updatedForm = { ...questionForm };

      if (questionForm.type === "TRUE_FALSE") {
        updatedForm.options = "true,false";
        updatedForm.answer = updatedForm.answer.toLowerCase();
      }

      if (isEditingQuestion) {
        await axiosInstance.put(`/question/update/${questionForm.id}`, updatedForm);
      } else {
        await axiosInstance.post("/question/create", updatedForm);
      }

      setQuestionForm({
        id: null,
        text: "",
        options: "",
        answer: "",
        type: "MULTIPLE_CHOICE",
      });
      setIsEditingQuestion(false);
      fetchData();
    } catch (err) {
      console.error("Question submit error:", err);
      setError("Failed to save question");
    }
  };

  const handleQuestionEdit = (q) => {
    setQuestionForm({ id: q.id, text: q.text, options: q.options, answer: q.answer, type: q.type || "MULTIPLE_CHOICE" });
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

  const handleAssignQuiz = async () => {
    if (!selectedStudent || !selectedQuiz) return alert("Select student and quiz");
    try {
      const response = await axiosInstance.get(`/users/${selectedStudent}/quizzes`);
      const assignedQuizzes = response.data;
      if (assignedQuizzes.some(quiz => quiz.id === Number(selectedQuiz))) {
        alert("Quiz is already assigned to this student");
        return;
      }
      await axiosInstance.post(`/users/assign?userId=${selectedStudent}&quizId=${selectedQuiz}`);
      console.log(`Assigned quiz ID ${selectedQuiz} to user ID ${selectedStudent}`);
      alert("Quiz assigned successfully");
    } catch (err) {
      console.error("Assign quiz error:", err);
      alert("Failed to assign quiz");
    }
  };

  const handleRetakeAction = async (requestId, action) => {
    try {
      console.log(`Attempting to ${action} retake request ID: ${requestId}`);
      const response = await axiosInstance.post(`/quiz-retake/${action.toLowerCase()}/${requestId}`);
      if (!response.data.success) {
        throw new Error(response.data.error || `Failed to ${action.toLowerCase()} retake request`);
      }

      setRetakeRequests((prev) =>
        prev.map((request) =>
          request.id === requestId
            ? { ...request, status: action.toUpperCase() }
            : request
        )
      );
      console.log(`Retake request ID ${requestId} ${action.toLowerCase()} successfully`);
      alert(`Retake request ${action.toLowerCase()} successfully`);

      await fetchData();
    } catch (err) {
      console.error(`Retake ${action} error:`, err);
      setError(`Failed to ${action.toLowerCase()} retake request: ${err.message}`);
    }
  };

  // Chart data for student scores
  const chartData = {
    labels: quizAttempts.map((attempt) => attempt.username),
    datasets: [
      {
        label: "Score Percentage",
        data: quizAttempts.map((attempt) => Math.round((attempt.score / attempt.totalQuestions) * 100)),
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            size: 14,
            family: "Inter, sans-serif",
          },
          color: "#1f2937",
        },
      },
      title: {
        display: true,
        text: `Score Distribution for ${quizzes.find((q) => q.id === Number(selectedQuizForScores))?.title || "Selected Quiz"}`,
        font: {
          size: 18,
          family: "Inter, sans-serif",
          weight: "bold",
        },
        color: "#1f2937",
      },
      tooltip: {
        backgroundColor: "#1f2937",
        titleFont: { size: 14 },
        bodyFont: { size: 12 },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: "Percentage (%)",
          font: { size: 14 },
          color: "#1f2937",
        },
        grid: {
          color: "rgba(209, 213, 219, 0.3)",
        },
        ticks: {
          color: "#1f2937",
        },
      },
      x: {
        title: {
          display: true,
          text: "Students",
          font: { size: 14 },
          color: "#1f2937",
        },
        grid: {
          display: false,
        },
        ticks: {
          color: "#1f2937",
        },
      },
    },
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div
        className={`bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white flex flex-col justify-between transition-all duration-300 ease-in-out shadow-2xl ${
          sidebarOpen ? "w-72" : "w-20"
        }`}
      >
        <div className="flex flex-col">
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
                {activeTab === item.id && (
                  <div className="absolute left-0 w-1 h-8 bg-white rounded-r-full"></div>
                )}
                <div
                  className={`flex items-center justify-center min-w-[2rem] ${
                    activeTab === item.id ? "text-white" : "text-gray-300 group-hover:text-white"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                </div>
                {sidebarOpen && (
                  <div className="flex-1 ml-4 text-left">
                    <div
                      className={`font-medium text-sm ${
                        activeTab === item.id ? "text-white" : "text-gray-200 group-hover:text-white"
                      }`}
                    >
                      {item.name}
                    </div>
                    <div
                      className={`text-xs mt-0.5 ${
                        activeTab === item.id ? "text-blue-100" : "text-gray-400 group-hover:text-gray-300"
                      }`}
                    >
                      {item.description}
                    </div>
                  </div>
                )}
                {sidebarOpen && activeTab === item.id && (
                  <ChevronRight className="h-4 w-4 text-white ml-2" />
                )}
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
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={() => navigate("/")}
            className={`group flex items-center w-full p-3 rounded-xl bg-red-600 hover:bg-red-700 transition-all duration-200 transform hover:scale-105 ${
              sidebarOpen ? "justify-start" : "justify-center"
            }`}
          >
            <LogOut className="h-5 w-5 text-white" />
            {sidebarOpen && <span className="ml-4 text-white font-medium">Logout</span>}
            {!sidebarOpen && (
              <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                Logout
                <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
              </div>
            )}
          </button>
        </div>
      </div>
      <div className="flex-1 p-8 overflow-y-auto bg-white">
        {error && (
          <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl text-red-700 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              {error}
            </div>
          </div>
        )}
        <div className="max-w-6xl mx-auto">
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <Dashboard quizzes={quizzes} questions={questions} />
            </div>
          )}
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
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-100">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Assign Quiz to Student</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Student</label>
                    <select
                      value={selectedStudent || ""}
                      onChange={(e) => setSelectedStudent(e.target.value)}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                    >
                      <option value="">Choose a student...</option>
                      {students.map((s) => (
                        <option key={s.id} value={s.id}>{s.username}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Quiz</label>
                    <select
                      value={selectedQuiz || ""}
                      onChange={(e) => setSelectedQuiz(e.target.value)}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                    >
                      <option value="">Choose a quiz...</option>
                      {quizzes.map((q) => (
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
          {activeTab === "retake-requests" && (
            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-gray-800 mb-6">Retake Requests</h1>
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <div className="space-y-4">
                  {retakeRequests.length > 0 ? (
                    retakeRequests.map((request) => (
                      <div
                        key={request.id}
                        className="p-4 bg-gray-50 rounded-xl flex items-center justify-between hover:bg-gray-100 transition-colors duration-200"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="bg-blue-100 p-2 rounded-full">
                            <Repeat className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {request.studentUsername} requested to retake "{request.quizTitle}"
                            </h3>
                            <p className="text-sm text-gray-600">
                              Requested on {new Date(request.requestDate).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </p>
                          </div>
                        </div>
                        {request.status === "PENDING" && (
                          <div className="flex gap-3">
                            <button
                              onClick={() => handleRetakeAction(request.id, "approve")}
                              className="bg-green-600 text-white py-2 px-4 rounded-xl hover:bg-green-700 transition-all duration-200"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleRetakeAction(request.id, "reject")}
                              className="bg-red-600 text-white py-2 px-4 rounded-xl hover:bg-red-700 transition-all duration-200"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                        {request.status !== "PENDING" && (
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              request.status === "APPROVED" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                            }`}
                          >
                            {request.status}
                          </span>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Repeat className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No retake requests found</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          {activeTab === "student-scores" && (
            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <BarChart2 className="h-8 w-8 text-blue-600" />
                Student Performance
              </h1>
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-100 shadow-lg">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">Select Quiz to View Performance</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setViewMode("table")}
                      className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                        viewMode === "table"
                          ? "bg-blue-600 text-white shadow-md"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      Table View
                    </button>
                    <button
                      onClick={() => setViewMode("chart")}
                      className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                        viewMode === "chart"
                          ? "bg-blue-600 text-white shadow-md"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      Chart View
                    </button>
                  </div>
                </div>
                <select
                  value={selectedQuizForScores || ""}
                  onChange={(e) => setSelectedQuizForScores(e.target.value)}
                  className="w-full max-w-md border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
                >
                  <option value="">Choose a quiz...</option>
                  {quizzes.map((q) => (
                    <option key={q.id} value={q.id}>{q.title}</option>
                  ))}
                </select>
              </div>
              {selectedQuizForScores && quizAttempts.length > 0 ? (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                    Performance for {quizzes.find((q) => q.id === Number(selectedQuizForScores))?.title}
                  </h2>
                  {viewMode === "table" ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-gradient-to-r from-blue-50 to-purple-50 text-gray-800">
                            <th className="px-6 py-4 text-sm font-semibold uppercase tracking-wide">Student</th>
                            <th className="px-6 py-4 text-sm font-semibold uppercase tracking-wide">Score</th>
                            <th className="px-6 py-4 text-sm font-semibold uppercase tracking-wide">Total</th>
                            <th className="px-6 py-4 text-sm font-semibold uppercase tracking-wide">Percentage</th>
                            <th className="px-6 py-4 text-sm font-semibold uppercase tracking-wide">Time Spent</th>
                            <th className="px-6 py-4 text-sm font-semibold uppercase tracking-wide">Attempt</th>
                            <th className="px-6 py-4 text-sm font-semibold uppercase tracking-wide">Completed On</th>
                          </tr>
                        </thead>
                        <tbody>
                          {quizAttempts.map((attempt) => (
                            <tr
                              key={attempt.attemptId}
                              className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200"
                            >
                              <td className="px-6 py-4 text-sm text-gray-600 font-medium">{attempt.username}</td>
                              <td className="px-6 py-4 text-sm text-gray-600">{attempt.score}</td>
                              <td className="px-6 py-4 text-sm text-gray-600">{attempt.totalQuestions}</td>
                              <td className="px-6 py-4 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                  <div className="w-16 bg-gray-200 rounded-full h-2">
                                    <div
                                      className="bg-blue-500 h-2 rounded-full"
                                      style={{ width: `${Math.round((attempt.score / attempt.totalQuestions) * 100)}%` }}
                                    ></div>
                                  </div>
                                  {Math.round((attempt.score / attempt.totalQuestions) * 100)}%
                                </div>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-600">
                                {Math.floor(attempt.timeSpent / 60)}:{(attempt.timeSpent % 60).toString().padStart(2, "0")}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-600">{attempt.attempts}</td>
                              <td className="px-6 py-4 text-sm text-gray-600">
                                {new Date(attempt.completedDate).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="h-96">
                      <Bar data={chartData} options={chartOptions} />
                    </div>
                  )}
                </div>
              ) : selectedQuizForScores ? (
                <div className="text-center py-12 text-gray-500 bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                  <BarChart2 className="h-16 w-16 mx-auto mb-4 text-blue-300" />
                  <p className="text-lg">No attempts found for this quiz.</p>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500 bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                  <BarChart2 className="h-16 w-16 mx-auto mb-4 text-blue-300" />
                  <p className="text-lg">Please select a quiz to view student performance.</p>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
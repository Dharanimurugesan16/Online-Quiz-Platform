import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Clock,
  FileText,
  Play,
  Calendar,
  Target,
  BookOpen,
  Timer,
  Award,
  TrendingUp,
  Users,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

export default function AssignedQuizzes() {
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) fetchAssignedQuizzes(userId);
  }, []);

    const navigate = useNavigate();

    const startQuiz = (quizId) => {
      navigate(`/quiz/${quizId}`);
    };
  const fetchAssignedQuizzes = async (userId) => {
    try {
      const res = await axios.get(`http://localhost:8080/api/users/${userId}/quizzes`);
      setQuizzes(res.data);
    } catch (err) {
      console.error("Failed to fetch quizzes:", err);
    }
  };

  // Helper function to get difficulty based on question count
  const getDifficulty = (questionCount) => {
    if (questionCount <= 5) return { level: "Easy", color: "bg-green-100 text-green-700", icon: "🟢" };
    if (questionCount <= 10) return { level: "Medium", color: "bg-yellow-100 text-yellow-700", icon: "🟡" };
    return { level: "Hard", color: "bg-red-100 text-red-700", icon: "🔴" };
  };

  // Helper function to get time difficulty
  const getTimeDifficulty = (timeLimit) => {
    if (timeLimit <= 10) return "Quick";
    if (timeLimit <= 30) return "Standard";
    return "Extended";
  };

  return (
    <div className="space-y-8">
      {/* Enhanced Header Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-20 translate-x-20"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-16 -translate-x-16"></div>
        <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-white/5 rounded-full"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-white/20 p-3 rounded-xl">
              <Target className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Assigned Quizzes</h1>
              <p className="text-blue-100 text-lg mt-1">Challenge yourself with these quizzes</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-6 mt-6">
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
              <BookOpen className="h-5 w-5 text-white" />
              <span className="font-medium">{quizzes.length} Total Quizzes</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
              <Users className="h-5 w-5 text-white" />
              <span className="font-medium">Ready to Start</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
              <TrendingUp className="h-5 w-5 text-white" />
              <span className="font-medium">Boost Your Skills</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      {quizzes.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Questions</p>
                <p className="text-2xl font-bold text-gray-900">
                  {quizzes.reduce((sum, q) => sum + (q.questions?.length || 0), 0)}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Time</p>
                <p className="text-2xl font-bold text-gray-900">
                  {quizzes.reduce((sum, q) => sum + (q.timeLimit || 0), 0)} min
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Timer className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Duration</p>
                <p className="text-2xl font-bold text-gray-900">
                  {quizzes.length ? Math.round(quizzes.reduce((sum, q) => sum + (q.timeLimit || 0), 0) / quizzes.length) : 0} min
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Available</p>
                <p className="text-2xl font-bold text-gray-900">{quizzes.length}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <Award className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quiz Cards */}
      {quizzes.length === 0 ? (
        <div className="text-center py-16">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-12 max-w-lg mx-auto border border-gray-200">
            <div className="bg-gradient-to-r from-gray-400 to-gray-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">No Quizzes Yet</h3>
            <p className="text-gray-600 text-lg leading-relaxed">
              You don't have any assigned quizzes at the moment. Check back later or contact your instructor.
            </p>
            <div className="mt-8 flex justify-center space-x-4">
              <div className="flex items-center text-gray-500">
                <CheckCircle2 className="h-5 w-5 mr-2" />
                <span>Ready to learn</span>
              </div>
              <div className="flex items-center text-gray-500">
                <AlertCircle className="h-5 w-5 mr-2" />
                <span>Stay tuned</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {quizzes.map((q, index) => {
            const difficulty = getDifficulty(q.questions?.length || 0);
            const timeDifficulty = getTimeDifficulty(q.timeLimit || 0);

            return (
              <div
                key={q.id}
                className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 hover:border-blue-200 relative overflow-hidden"
              >
                {/* Decorative Background Elements */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full -translate-y-12 translate-x-12 group-hover:scale-110 transition-transform duration-500"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-green-100 to-blue-100 rounded-full translate-y-8 -translate-x-8 group-hover:scale-110 transition-transform duration-500"></div>

                {/* Quiz Number Badge */}
                <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>

                <div className="relative z-10">
                  {/* Quiz Header */}
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-lg">
                        <BookOpen className="h-5 w-5 text-white" />
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${difficulty.color}`}>
                        {difficulty.icon} {difficulty.level}
                      </span>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                      {q.title}
                    </h2>
                    <p className="text-gray-600 leading-relaxed line-clamp-3">
                      {q.description || "Test your knowledge with this comprehensive quiz covering key concepts and practical applications."}
                    </p>
                  </div>

                  {/* Quiz Stats Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-5 w-5 text-blue-600" />
                        <span className="text-blue-700 font-medium text-sm">Duration</span>
                      </div>
                      <p className="text-blue-900 font-bold text-lg">{q.timeLimit} min</p>
                      <p className="text-blue-600 text-xs">{timeDifficulty} time</p>
                    </div>

                    <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="h-5 w-5 text-purple-600" />
                        <span className="text-purple-700 font-medium text-sm">Questions</span>
                      </div>
                      <p className="text-purple-900 font-bold text-lg">{q.questions?.length || 0}</p>
                      <p className="text-purple-600 text-xs">Total items</p>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="bg-gray-50 rounded-xl p-4 mb-6">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">Available Now</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">Single Attempt</span>
                      </div>
                    </div>
                  </div>

                  {/* Start Quiz Button */}
                  <button  onClick={() => startQuiz(q.id)} className="group/btn w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 px-6 rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold text-lg relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700"></div>
                    <div className="flex items-center justify-center gap-3 relative z-10">
                      <Play className="h-6 w-6 group-hover/btn:scale-110 transition-transform duration-300" />
                      <span>Start Quiz</span>
                    </div>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Motivational Footer */}
      {quizzes.length > 0 && (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 border border-green-100">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Ready to Challenge Yourself?</h3>
            <p className="text-gray-600 text-lg mb-6 max-w-2xl mx-auto">
              Each quiz is an opportunity to learn and grow. Take your time, read carefully, and trust your knowledge.
            </p>
            <div className="flex justify-center items-center gap-8 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>No time pressure</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Learn at your pace</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span>Track your progress</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
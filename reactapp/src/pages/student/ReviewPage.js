import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CheckCircle, XCircle, Home, Trophy, Target, Clock, TrendingUp, BookOpen, RotateCcw } from "lucide-react";
import axios from "axios";

export default function ReviewPage() {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAttempt = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/quiz-attempt/attempt/${attemptId}`);
        console.log("Backend response for attempt:", JSON.stringify(response.data, null, 2));
        setAttempt(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching quiz attempt:", err);
        setError("Failed to load quiz attempt. Please try again.");
        setLoading(false);
      }
    };
    fetchAttempt();
  }, [attemptId]);

  const handleNavigate = (path) => navigate(path);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading quiz attempt...</p>
        </div>
      </div>
    );
  }

  if (error || !attempt) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-100">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
          <XCircle className="w-16 h-16 text-purple-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error || "Quiz attempt not found."}</p>
          <button
            onClick={() => handleNavigate("/student/completed-quizzes")}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Back to Completed Quizzes
          </button>
        </div>
      </div>
    );
  }

  const percentage = attempt.totalQuestions ? Math.round((attempt.score / attempt.totalQuestions) * 100) : 0;
  const getPerformanceData = () => {
    if (percentage >= 90) return { level: "Excellent", bgClass: "bg-gradient-to-r from-purple-600 to-violet-600", fromClass: "from-purple-600", toClass: "to-violet-600", icon: Trophy };
    if (percentage >= 80) return { level: "Very Good", bgClass: "bg-gradient-to-r from-purple-500 to-violet-500", fromClass: "from-purple-500", toClass: "to-violet-500", icon: Trophy };
    if (percentage >= 70) return { level: "Good", bgClass: "bg-gradient-to-r from-purple-500 via-violet-500 to-fuchsia-500", fromClass: "from-purple-500", toClass: "to-fuchsia-500", icon: Target };
    if (percentage >= 60) return { level: "Fair", bgClass: "bg-gradient-to-r from-violet-500 to-purple-500", fromClass: "from-violet-500", toClass: "to-purple-500", icon: TrendingUp };
    return { level: "Needs Improvement", bgClass: "bg-gradient-to-r from-fuchsia-500 to-purple-500", fromClass: "from-fuchsia-500", toClass: "to-purple-500", icon: BookOpen };
  };

  const performance = getPerformanceData();
  const PerformanceIcon = performance.icon;

  const isAnswerCorrect = (question) => {
    const answerDetails = attempt.answers[question.id];
    if (!answerDetails?.selectedAnswer || !answerDetails?.correctAnswer) {
      console.warn(`Missing answer data for question ID ${question?.id}:`, answerDetails);
      return false;
    }
    return answerDetails.selectedAnswer.trim().toLowerCase() === answerDetails.correctAnswer.trim().toLowerCase();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-20 h-20 ${performance.bgClass} rounded-3xl mb-6 shadow-lg`}>
            <PerformanceIcon className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3">
            Quiz Attempt Review
          </h1>
          <p className="text-xl text-gray-600">
            {attempt.quizTitle || "Quiz"} - Attempt #{attempt.attempts || 1}
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden mb-8">
          <div className={`bg-gradient-to-r ${performance.fromClass} ${performance.toClass} px-8 py-12`}>
            <div className="text-center text-white">
              <div className="text-6xl md:text-7xl font-bold mb-4">
                {attempt.score || 0}<span className="text-3xl">/{attempt.totalQuestions || 0}</span>
              </div>
              <div className="text-2xl md:text-3xl font-semibold mb-2">
                {percentage}% Score
              </div>
              <div className="text-lg opacity-90">
                Performance Level: {performance.level}
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-purple-50 rounded-2xl">
                <CheckCircle className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-700">{attempt.score || 0}</div>
                <div className="text-sm text-purple-600 font-medium">Correct Answers</div>
              </div>

              <div className="text-center p-4 bg-violet-50 rounded-2xl">
                <XCircle className="w-8 h-8 text-violet-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-violet-700">{(attempt.totalQuestions || 0) - (attempt.score || 0)}</div>
                <div className="text-sm text-violet-600 font-medium">Incorrect Answers</div>
              </div>

              <div className="text-center p-4 bg-fuchsia-50 rounded-2xl">
                <Clock className="w-8 h-8 text-fuchsia-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-fuchsia-700">{Math.round((attempt.timeSpent || 0) / 60)}:{((attempt.timeSpent || 0) % 60).toString().padStart(2, "0")}</div>
                <div className="text-sm text-fuchsia-600 font-medium">Time Spent</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-gray-800">Overall Performance</h3>
            <span className="text-sm font-medium text-gray-600">{percentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${performance.fromClass} ${performance.toClass} rounded-full transition-all duration-1000 ease-out relative`}
              style={{ width: `${percentage}%` }}
            >
              <div className="absolute inset-0 bg-white opacity-20 animate-pulse rounded-full"></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="bg-gray-50 px-8 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <Target className="w-5 h-5 mr-2 text-purple-600" />
              Detailed Review
            </h2>
          </div>

          <div className="p-8">
            <div className="space-y-6">
              {attempt.questions && attempt.questions.length > 0 ? (
                attempt.questions.map((question, index) => {
                  const answerDetails = attempt.answers[question.id] || {};
                  const isCorrect = isAnswerCorrect(question);

                  return (
                    <div
                      key={question.id || index}
                      className={`
                        p-6 rounded-2xl border-2 transition-all duration-300
                        ${isCorrect
                          ? 'border-purple-200 bg-purple-50 hover:bg-purple-100'
                          : 'border-violet-200 bg-violet-50 hover:bg-violet-100'
                        }
                      `}
                    >
                      <div className="flex items-start space-x-4">
                        <div className={`
                          flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold
                          ${isCorrect ? 'bg-purple-500' : 'bg-violet-500'}
                        `}>
                          {isCorrect ? (
                            <CheckCircle className="w-5 h-5" />
                          ) : (
                            <XCircle className="w-5 h-5" />
                          )}
                        </div>

                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-800 mb-3">
                            Question {index + 1}: {question.questionText || "N/A"}
                          </h3>

                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium text-gray-600">Your Answer:</span>
                              <span className={`
                                px-3 py-1 rounded-full text-sm font-semibold
                                ${isCorrect
                                  ? 'bg-purple-200 text-purple-800'
                                  : 'bg-violet-200 text-violet-800'
                                }
                              `}>
                                {answerDetails.selectedAnswer || "No Answer"}
                              </span>
                            </div>

                            {!isCorrect && (
                              <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium text-gray-600">Correct Answer:</span>
                                <span className="px-3 py-1 rounded-full text-sm font-semibold bg-purple-200 text-purple-800">
                                  {answerDetails.correctAnswer || question.correctAnswer || "N/A"}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-600 text-center">No questions available for this attempt.</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <button
            onClick={() => handleNavigate("/student/completed-quizzes")}
            className="flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-purple-500 via-violet-500 to-fuchsia-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:via-violet-600 hover:to-fuchsia-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            <Home className="w-5 h-5" />
            <span>Back to Completed Quizzes</span>
          </button>

          <button
            onClick={() => handleNavigate(`/quiz/${attempt.quizId || ''}`)}
            className="flex items-center space-x-2 px-8 py-4 bg-white text-gray-700 border-2 border-gray-300 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-400 transform hover:scale-105 transition-all duration-200"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Retake Quiz</span>
          </button>
        </div>

        <div className="text-center mt-12 p-6 bg-gradient-to-r from-purple-50 to-fuchsia-50 rounded-2xl border border-purple-200">
          {percentage >= 80 ? (
            <p className="text-lg text-purple-800">
              🎉 <strong>Congratulations!</strong> You've demonstrated excellent knowledge in this assessment.
            </p>
          ) : percentage >= 60 ? (
            <p className="text-lg text-violet-800">
              👍 <strong>Good effort!</strong> You're on the right track. Keep studying to improve further.
            </p>
          ) : (
            <p className="text-lg text-fuchsia-800">
              💪 <strong>Keep learning!</strong> Every expert was once a beginner. Review the material and try again.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
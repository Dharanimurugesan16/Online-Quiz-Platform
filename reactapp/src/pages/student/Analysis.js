import React from "react";
import {
  BarChart2,
  TrendingUp,
  Target,
  Clock,
  Star,
  CheckCircle,
  Trophy,
  PieChart,
  Filter,
  Download
} from "lucide-react";

export default function Analysis() {
  // Static data for analysis
  const performanceData = {
    totalQuizzes: 18,
    averageScore: 87,
    totalTimeSpent: 420, // minutes
    perfectScores: 3,
    improvement: 5, // percentage improvement from last month
    scoreTrend: [
      { id: 1, title: "Python Fundamentals", score: 100, date: "2024-08-06" },
      { id: 2, title: "Database Design", score: 85, date: "2024-08-08" },
      { id: 3, title: "Node.js Basics", score: 78, date: "2024-08-10" },
      { id: 4, title: "CSS Grid & Flexbox", score: 92, date: "2024-08-12" },
      { id: 5, title: "JavaScript ES6+", score: 88, date: "2024-08-14" },
      { id: 6, title: "React Fundamentals", score: 95, date: "2024-08-15" }
    ],
    categoryPerformance: [
      { category: "Frontend", averageScore: 90, completed: 5, total: 6 },
      { category: "JavaScript", averageScore: 85, completed: 4, total: 5 },
      { category: "CSS", averageScore: 88, completed: 3, total: 3 },
      { category: "Backend", averageScore: 80, completed: 2, total: 3 },
      { category: "Database", averageScore: 82, completed: 2, total: 3 },
      { category: "Python", averageScore: 95, completed: 2, total: 2 }
    ],
    questionAccuracy: [
      { difficulty: "Easy", correct: 45, total: 50, category: "Python" },
      { difficulty: "Medium", correct: 60, total: 75, category: "Frontend" },
      { difficulty: "Hard", correct: 30, total: 50, category: "JavaScript" },
      { category: "CSS", correct: 25, total: 30 },
      { category: "Backend", correct: 20, total: 30 },
      { category: "Database", correct: 15, total: 20 }
    ]
  };

  // Helper functions
  const getScoreColor = (score) => {
    if (score >= 90) return "text-green-600";
    if (score >= 75) return "text-blue-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy": return "bg-green-100 text-green-700";
      case "Medium": return "bg-yellow-100 text-yellow-700";
      case "Hard": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-white/20 p-3 rounded-xl">
              <BarChart2 className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Performance Analysis</h1>
              <p className="text-blue-100 text-lg mt-1">Insights into your learning progress</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-6 mt-6">
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
              <Trophy className="h-5 w-5 text-yellow-300" />
              <span className="font-medium">{performanceData.totalQuizzes} Quizzes Taken</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
              <Star className="h-5 w-5 text-yellow-300" />
              <span className="font-medium">{performanceData.averageScore}% Average</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
              <TrendingUp className="h-5 w-5 text-yellow-300" />
              <span className="font-medium">+{performanceData.improvement}% Improvement</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Quizzes</p>
              <p className="text-3xl font-bold text-gray-900">{performanceData.totalQuizzes}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <BarChart2 className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600">+3 this month</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Score</p>
              <p className="text-3xl font-bold text-gray-900">{performanceData.averageScore}%</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <Star className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Accuracy</span>
              <span className="font-medium text-gray-900">
                {Math.round(
                  (performanceData.questionAccuracy.reduce((sum, q) => sum + q.correct, 0) /
                    performanceData.questionAccuracy.reduce((sum, q) => sum + q.total, 0)) * 100
                )}%
              </span>
            </div>
            <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${
                    (performanceData.questionAccuracy.reduce((sum, q) => sum + q.correct, 0) /
                      performanceData.questionAccuracy.reduce((sum, q) => sum + q.total, 0)) * 100
                  }%`
                }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Time Spent</p>
              <p className="text-3xl font-bold text-gray-900">{performanceData.totalTimeSpent}</p>
              <p className="text-sm text-gray-500">minutes</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-orange-600">
              Avg: {Math.round(performanceData.totalTimeSpent / performanceData.totalQuizzes)} min/quiz
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Perfect Scores</p>
              <p className="text-3xl font-bold text-gray-900">{performanceData.perfectScores}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <Trophy className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-yellow-600">
              {Math.round((performanceData.perfectScores / performanceData.totalQuizzes) * 100)}% success rate
            </span>
          </div>
        </div>
      </div>

      {/* Score Trend Chart */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Score Trend</h2>
          <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">View Details</button>
        </div>
        <div className="flex items-end h-64 space-x-4">
          {performanceData.scoreTrend.map((quiz, index) => (
            <div key={quiz.id} className="flex-1 flex flex-col items-center">
              <div
                className={`bg-green-500 rounded-t-lg transition-all duration-300`}
                style={{ height: `${quiz.score}%`, width: "100%" }}
              ></div>
              <p className="text-xs text-gray-600 mt-2 text-center">{quiz.date}</p>
              <p className={`text-sm font-semibold ${getScoreColor(quiz.score)}`}>{quiz.score}%</p>
            </div>
          ))}
        </div>
        <div className="mt-4 border-t border-gray-200 pt-4">
          <p className="text-gray-600 text-sm">
            Your scores have improved by {performanceData.improvement}% over the last month.
          </p>
        </div>
      </div>

      {/* Category Performance */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Category Performance</h2>
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              className="border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            >
              <option value="all">All Categories</option>
              {performanceData.categoryPerformance.map((cat) => (
                <option key={cat.category} value={cat.category}>
                  {cat.category}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {performanceData.categoryPerformance.map((cat) => (
            <div
              key={cat.category}
              className="p-4 border border-gray-200 rounded-xl hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">{cat.category}</h3>
                <div className="bg-blue-100 p-2 rounded-full">
                  <Target className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Average Score</span>
                  <span className={`font-medium ${getScoreColor(cat.averageScore)}`}>{cat.averageScore}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${cat.averageScore}%` }}
                  ></div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Completion</span>
                  <span className="font-medium text-gray-900">{cat.completed}/{cat.total}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Question Accuracy */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Question Accuracy</h2>
          <button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200">
            <Download className="h-5 w-5" />
            <span>Export Data</span>
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">By Difficulty</h3>
            {performanceData.questionAccuracy
              .filter((q) => q.difficulty)
              .map((q) => (
                <div key={q.difficulty} className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`font-medium ${getDifficultyColor(q.difficulty)} px-3 py-1 rounded-full text-sm`}>
                      {q.difficulty}
                    </span>
                    <span className="text-gray-900 font-medium">
                      {Math.round((q.correct / q.total) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(q.correct / q.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">By Category</h3>
            {performanceData.questionAccuracy
              .filter((q) => q.category && !q.difficulty)
              .map((q) => (
                <div key={q.category} className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-700">{q.category}</span>
                    <span className="text-gray-900 font-medium">
                      {Math.round((q.correct / q.total) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(q.correct / q.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-lg">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-full">
              <Star className="h-8 w-8 text-white" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">Keep Up the Great Work!</h3>
          <p className="text-gray-600 text-lg mb-6 max-w-2xl mx-auto">
            Your performance is strong, with an average score of {performanceData.averageScore}%. Focus on improving in Backend and Database categories to boost your overall accuracy.
          </p>
          <div className="flex justify-center gap-4">
            <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-105 font-semibold">
              Start New Quiz
            </button>
            <button className="bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-6 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 transform hover:scale-105 font-semibold">
              Review Weak Areas
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
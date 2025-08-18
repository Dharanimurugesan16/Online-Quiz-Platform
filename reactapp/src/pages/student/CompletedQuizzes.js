import React, { useState } from "react";
import {
  CheckCircle,
  Trophy,
  Clock,
  FileText,
  Star,
  TrendingUp,
  Calendar,
  Award,
  Target,
  BarChart2,
  Filter,
  Search,
  Download,
  Eye,
  Medal,
  Zap,
  BookOpen,
  Brain
} from "lucide-react";

export default function CompletedQuizzes() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

  // Static data for completed quizzes
  const completedQuizzes = [
    {
      id: 1,
      title: "React Fundamentals",
      description: "Master the basics of React including components, props, and state management",
      score: 95,
      totalQuestions: 20,
      correctAnswers: 19,
      timeSpent: 28,
      timeLimit: 30,
      completedDate: "2024-08-15",
      difficulty: "Medium",
      category: "Frontend",
      attempts: 1,
      rank: 1
    },
    {
      id: 2,
      title: "JavaScript ES6+ Features",
      description: "Advanced JavaScript concepts including arrow functions, destructuring, and async/await",
      score: 88,
      totalQuestions: 25,
      correctAnswers: 22,
      timeSpent: 35,
      timeLimit: 40,
      completedDate: "2024-08-14",
      difficulty: "Hard",
      category: "JavaScript",
      attempts: 2,
      rank: 3
    },
    {
      id: 3,
      title: "CSS Grid & Flexbox",
      description: "Modern CSS layout techniques for responsive web design",
      score: 92,
      totalQuestions: 15,
      correctAnswers: 14,
      timeSpent: 18,
      timeLimit: 25,
      completedDate: "2024-08-12",
      difficulty: "Medium",
      category: "CSS",
      attempts: 1,
      rank: 2
    },
    {
      id: 4,
      title: "Node.js & Express Basics",
      description: "Server-side JavaScript with Node.js and Express framework fundamentals",
      score: 78,
      totalQuestions: 30,
      correctAnswers: 23,
      timeSpent: 42,
      timeLimit: 45,
      completedDate: "2024-08-10",
      difficulty: "Hard",
      category: "Backend",
      attempts: 1,
      rank: 8
    },
    {
      id: 5,
      title: "Database Design Principles",
      description: "Learn about relational databases, normalization, and SQL basics",
      score: 85,
      totalQuestions: 18,
      correctAnswers: 15,
      timeSpent: 22,
      timeLimit: 30,
      completedDate: "2024-08-08",
      difficulty: "Medium",
      category: "Database",
      attempts: 1,
      rank: 5
    },
    {
      id: 6,
      title: "Python Fundamentals",
      description: "Introduction to Python programming language and basic concepts",
      score: 100,
      totalQuestions: 12,
      correctAnswers: 12,
      timeSpent: 15,
      timeLimit: 20,
      completedDate: "2024-08-06",
      difficulty: "Easy",
      category: "Python",
      attempts: 1,
      rank: 1
    }
  ];

  // Calculate statistics
  const stats = {
    totalCompleted: completedQuizzes.length,
    averageScore: Math.round(completedQuizzes.reduce((sum, quiz) => sum + quiz.score, 0) / completedQuizzes.length),
    perfectScores: completedQuizzes.filter(q => q.score === 100).length,
    totalTimeSpent: completedQuizzes.reduce((sum, quiz) => sum + quiz.timeSpent, 0),
    bestStreak: 6, // Static value
    totalQuestions: completedQuizzes.reduce((sum, quiz) => sum + quiz.totalQuestions, 0),
    correctAnswers: completedQuizzes.reduce((sum, quiz) => sum + quiz.correctAnswers, 0)
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

  const getCategoryIcon = (category) => {
    switch (category) {
      case "Frontend": return <BookOpen className="h-4 w-4" />;
      case "JavaScript": return <Zap className="h-4 w-4" />;
      case "CSS": return <Target className="h-4 w-4" />;
      case "Backend": return <Brain className="h-4 w-4" />;
      case "Database": return <BarChart2 className="h-4 w-4" />;
      case "Python": return <FileText className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  const getPerformanceBadge = (score) => {
    if (score === 100) return { text: "Perfect", color: "bg-yellow-100 text-yellow-600", icon: <Medal className="h-4 w-4" /> };
    if (score >= 90) return { text: "Excellent", color: "bg-green-100 text-green-600", icon: <Trophy className="h-4 w-4" /> };
    if (score >= 75) return { text: "Great", color: "bg-blue-100 text-blue-600", icon: <Star className="h-4 w-4" /> };
    if (score >= 60) return { text: "Good", color: "bg-purple-100 text-purple-600", icon: <Award className="h-4 w-4" /> };
    return { text: "Pass", color: "bg-gray-100 text-gray-600", icon: <CheckCircle className="h-4 w-4" /> };
  };

  // Filter and sort logic
  const filteredQuizzes = completedQuizzes.filter(quiz => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quiz.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterBy === "all" ||
                         (filterBy === "excellent" && quiz.score >= 90) ||
                         (filterBy === "good" && quiz.score >= 75 && quiz.score < 90) ||
                         (filterBy === "needs-improvement" && quiz.score < 75);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-white/20 p-3 rounded-xl">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Completed Quizzes</h1>
              <p className="text-blue-100 text-lg mt-1">Your learning journey achievements</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-6 mt-6">
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
              <Trophy className="h-5 w-5 text-yellow-300" />
              <span className="font-medium">{stats.totalCompleted} Completed</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
              <Star className="h-5 w-5 text-yellow-300" />
              <span className="font-medium">{stats.averageScore}% Average</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
              <Medal className="h-5 w-5 text-yellow-300" />
              <span className="font-medium">{stats.perfectScores} Perfect Scores</span>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Completed</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalCompleted}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <CheckCircle className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600">+2 this week</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Score</p>
              <p className="text-3xl font-bold text-gray-900">{stats.averageScore}%</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <BarChart2 className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Accuracy</span>
              <span className="font-medium text-gray-900">
                {Math.round((stats.correctAnswers / stats.totalQuestions) * 100)}%
              </span>
            </div>
            <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(stats.correctAnswers / stats.totalQuestions) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Time Spent</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalTimeSpent}</p>
              <p className="text-sm text-gray-500">minutes</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-orange-600">
              Avg: {Math.round(stats.totalTimeSpent / stats.totalCompleted)} min/quiz
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Perfect Scores</p>
              <p className="text-3xl font-bold text-gray-900">{stats.perfectScores}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <Medal className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-yellow-600">
              {Math.round((stats.perfectScores / stats.totalCompleted) * 100)}% success rate
            </span>
          </div>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search quizzes by title or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                className="border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              >
                <option value="all">All Scores</option>
                <option value="excellent">Excellent (90%+)</option>
                <option value="good">Good (75-89%)</option>
                <option value="needs-improvement">Needs Improvement (&lt;75%)</option>
              </select>
            </div>

            <button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200">
              <Download className="h-5 w-5" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quiz Cards */}
      <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
        {filteredQuizzes.map((quiz, index) => {
          const performanceBadge = getPerformanceBadge(quiz.score);

          return (
            <div
              key={quiz.id}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-300"
            >
              {/* Performance Badge */}
              <div className="absolute top-4 right-4">
                <div className={`${performanceBadge.color} px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1`}>
                  {performanceBadge.icon}
                  {performanceBadge.text}
                </div>
              </div>

              <div className="relative z-10">
                {/* Quiz Header */}
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      {getCategoryIcon(quiz.category)}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(quiz.difficulty)}`}>
                        {quiz.difficulty}
                      </span>
                      <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold">
                        {quiz.category}
                      </span>
                    </div>
                  </div>

                  <h2 className="text-2xl font-bold text-gray-800 mb-2">{quiz.title}</h2>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    {quiz.description}
                  </p>
                </div>

                {/* Score Display */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-600 font-medium">Your Score</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-3xl font-bold ${getScoreColor(quiz.score)}`}>
                        {quiz.score}%
                      </span>
                      <div className="bg-green-100 p-2 rounded-full">
                        <Trophy className="h-5 w-5 text-green-600" />
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-green-500 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${quiz.score}%` }}
                    ></div>
                  </div>
                </div>

                {/* Quiz Statistics */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <span className="text-blue-700 font-medium text-sm">Questions</span>
                    </div>
                    <p className="text-blue-900 font-bold text-lg">{quiz.correctAnswers}/{quiz.totalQuestions}</p>
                    <p className="text-blue-600 text-xs">Correct answers</p>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-5 w-5 text-purple-600" />
                      <span className="text-purple-700 font-medium text-sm">Time</span>
                    </div>
                    <p className="text-purple-900 font-bold text-lg">{quiz.timeSpent}/{quiz.timeLimit}</p>
                    <p className="text-purple-600 text-xs">Minutes used</p>
                  </div>
                </div>

                {/* Additional Details */}
                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">Completed: {quiz.completedDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">Attempts: {quiz.attempts}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-105 font-semibold flex items-center justify-center gap-2">
                    <Eye className="h-5 w-5" />
                    Review Answers
                  </button>
                  <button className="bg-gray-100 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-200 transition-colors duration-200 font-semibold">
                    Retake
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Motivational Footer */}
      <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-lg">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-full">
              <Trophy className="h-8 w-8 text-white" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">Excellent Progress!</h3>
          <p className="text-gray-600 text-lg mb-6 max-w-2xl mx-auto">
            You've completed {stats.totalCompleted} quizzes with an average score of {stats.averageScore}%.
            Keep up the great work and continue challenging yourself!
          </p>
          <div className="flex justify-center items-center gap-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>{stats.correctAnswers} questions mastered</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>{stats.totalTimeSpent} minutes invested</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span>{stats.perfectScores} perfect scores achieved</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
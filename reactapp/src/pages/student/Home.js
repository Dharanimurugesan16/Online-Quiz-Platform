import React from "react";
import {
  Clock,
  CheckCircle,
  BarChart2,
  Trophy,
  Target,
  TrendingUp,
  Calendar,
  Star,
  BookOpen,
  Award,
  Zap,
  Users
} from "lucide-react";

export default function Home() {
  // Fake data for demonstration
  const stats = {
    totalQuizzes: 24,
    completedQuizzes: 18,
    pendingQuizzes: 6,
    averageScore: 87,
    totalPoints: 1420,
    rank: 3,
    streak: 12
  };

  const recentQuizzes = [
    { id: 1, title: "React Fundamentals", score: 92, date: "2024-08-15", status: "completed" },
    { id: 2, title: "JavaScript ES6+", score: 88, date: "2024-08-14", status: "completed" },
    { id: 3, title: "CSS Grid & Flexbox", score: 85, date: "2024-08-12", status: "completed" },
    { id: 4, title: "Node.js Basics", score: null, date: "2024-08-20", status: "pending" },
    { id: 5, title: "Database Design", score: null, date: "2024-08-22", status: "pending" }
  ];

  const achievements = [
    { id: 1, title: "First Perfect Score", description: "Scored 100% on a quiz", icon: Trophy, color: "text-yellow-600", bgColor: "bg-yellow-100" },
    { id: 2, title: "Quiz Master", description: "Completed 15 quizzes", icon: Award, color: "text-purple-600", bgColor: "bg-purple-100" },
    { id: 3, title: "Speed Runner", description: "Finished quiz in under 5 minutes", icon: Zap, color: "text-blue-600", bgColor: "bg-blue-100" },
    { id: 4, title: "Consistent Learner", description: "10-day learning streak", icon: Target, color: "text-green-600", bgColor: "bg-green-100" }
  ];

  const upcomingQuizzes = [
    { id: 1, title: "Advanced React Patterns", date: "2024-08-20", time: "10:00 AM", difficulty: "Hard" },
    { id: 2, title: "API Integration", date: "2024-08-22", time: "2:00 PM", difficulty: "Medium" },
    { id: 3, title: "Testing with Jest", date: "2024-08-25", time: "11:30 AM", difficulty: "Medium" }
  ];

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
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>

        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-2">Welcome back, Student!</h1>
          <p className="text-blue-100 text-lg">Ready to continue your learning journey? You're doing great!</p>

          <div className="flex items-center gap-6 mt-6">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-300" />
              <span className="font-medium">{stats.streak} Day Streak</span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-300" />
              <span className="font-medium">Rank #{stats.rank}</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-300" />
              <span className="font-medium">{stats.totalPoints} Points</span>
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
              <p className="text-3xl font-bold text-gray-900">{stats.totalQuizzes}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <BookOpen className="h-6 w-6 text-blue-600" />
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
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-3xl font-bold text-gray-900">{stats.completedQuizzes}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Progress</span>
              <span className="font-medium text-gray-900">
                {Math.round((stats.completedQuizzes / stats.totalQuizzes) * 100)}%
              </span>
            </div>
            <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(stats.completedQuizzes / stats.totalQuizzes) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-3xl font-bold text-gray-900">{stats.pendingQuizzes}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-orange-600">Due this week</span>
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
          <div className="mt-4 flex items-center">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600">+5% from last month</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Quiz Activity */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recent Quiz Activity</h2>
            <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">View All</button>
          </div>

          <div className="space-y-4">
            {recentQuizzes.map((quiz) => (
              <div key={quiz.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-full ${quiz.status === 'completed' ? 'bg-green-100' : 'bg-orange-100'}`}>
                    {quiz.status === 'completed' ?
                      <CheckCircle className="h-5 w-5 text-green-600" /> :
                      <Clock className="h-5 w-5 text-orange-600" />
                    }
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{quiz.title}</h3>
                    <p className="text-sm text-gray-600">{quiz.date}</p>
                  </div>
                </div>

                <div className="text-right">
                  {quiz.status === 'completed' ? (
                    <div>
                      <span className={`text-xl font-bold ${getScoreColor(quiz.score)}`}>
                        {quiz.score}%
                      </span>
                      <p className="text-xs text-gray-500">Score</p>
                    </div>
                  ) : (
                    <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
                      Pending
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Quizzes */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Upcoming Quizzes</h2>
            <Calendar className="h-5 w-5 text-gray-400" />
          </div>

          <div className="space-y-4">
            {upcomingQuizzes.map((quiz) => (
              <div key={quiz.id} className="p-4 border border-gray-200 rounded-xl hover:border-blue-300 transition-colors duration-200">
                <h3 className="font-semibold text-gray-900 mb-2">{quiz.title}</h3>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    {quiz.date} at {quiz.time}
                  </div>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(quiz.difficulty)}`}>
                    {quiz.difficulty}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Achievements Section */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Recent Achievements</h2>
          <Users className="h-5 w-5 text-gray-400" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {achievements.map((achievement) => (
            <div key={achievement.id} className="p-4 border border-gray-200 rounded-xl hover:shadow-md transition-shadow duration-200">
              <div className={`p-3 rounded-full w-fit ${achievement.bgColor} mb-3`}>
                <achievement.icon className={`h-6 w-6 ${achievement.color}`} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{achievement.title}</h3>
              <p className="text-sm text-gray-600">{achievement.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-2xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-105 shadow-lg">
          <BookOpen className="h-8 w-8 mb-3" />
          <h3 className="font-bold text-lg mb-2">Start New Quiz</h3>
          <p className="text-blue-100 text-sm">Continue your learning journey</p>
        </button>

        <button className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 rounded-2xl hover:from-green-700 hover:to-green-800 transition-all duration-200 transform hover:scale-105 shadow-lg">
          <BarChart2 className="h-8 w-8 mb-3" />
          <h3 className="font-bold text-lg mb-2">View Analytics</h3>
          <p className="text-green-100 text-sm">Track your progress</p>
        </button>

        <button className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 rounded-2xl hover:from-purple-700 hover:to-purple-800 transition-all duration-200 transform hover:scale-105 shadow-lg">
          <Trophy className="h-8 w-8 mb-3" />
          <h3 className="font-bold text-lg mb-2">Leaderboard</h3>
          <p className="text-purple-100 text-sm">See your ranking</p>
        </button>
      </div>
    </div>
  );
}
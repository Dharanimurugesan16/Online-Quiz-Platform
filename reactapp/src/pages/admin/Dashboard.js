import React from "react";
import { BookOpen, HelpCircle, BarChart3, FileText, Plus } from "lucide-react";

export default function Dashboard({ quizzes = [], questions = [] }) {
  const stats = [
    { title: "Total Quizzes", value: quizzes.length.toString(), change: "+12%", icon: BookOpen, color: "bg-blue-500" },
    { title: "Total Questions", value: questions.length.toString(), change: "+23%", icon: HelpCircle, color: "bg-green-500" },
    { title: "Completed Tests", value: "0", change: "+8%", icon: BarChart3, color: "bg-purple-500" },
    { title: "Average Score", value: "85%", change: "+3%", icon: FileText, color: "bg-orange-500" }
  ];

  const recentQuizzes = quizzes.slice(0, 4);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="text-sm text-gray-500">
          Welcome back, Admin! Here's what's happening today.
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <p className="text-sm text-green-600 mt-1">{stat.change} from last month</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Quizzes + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Quizzes</h3>
          <div className="space-y-4">
            {recentQuizzes.length > 0 ? recentQuizzes.map((quiz) => (
              <div key={quiz.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{quiz.title}</p>
                  <p className="text-sm text-gray-600">{quiz.description}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{quiz.timeLimit} min</p>
                  <p className="text-sm text-gray-600">{quiz.questions?.length || 0} questions</p>
                </div>
              </div>
            )) : (
              <p className="text-gray-500 text-center py-4">No quizzes available</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
              <span className="font-medium text-blue-900">Create New Quiz</span>
              <Plus className="h-5 w-5 text-blue-600" />
            </button>
            <button className="w-full flex items-center justify-between p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
              <span className="font-medium text-green-900">Add Questions</span>
              <HelpCircle className="h-5 w-5 text-green-600" />
            </button>
            <button className="w-full flex items-center justify-between p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
              <span className="font-medium text-purple-900">View Reports</span>
              <BarChart3 className="h-5 w-5 text-purple-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

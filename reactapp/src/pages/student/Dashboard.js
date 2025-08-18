import React, { useState } from "react";
import {
  Clock,
  CheckCircle,
  BarChart2,
  User,
  Home,
  Menu,
  X,
  LogOut,
  GraduationCap,
  ChevronRight
} from "lucide-react";

// Import the tab components
import HomeTab from "./Home";
import AssignedQuizzes from "./AssignedQuizzes";
import CompletedQuizzes from "./CompletedQuizzes";
import Analysis from "./Analysis";

export default function StudentDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("home");

  const sidebarItems = [
    { name: "Home", id: "home", icon: Home },
    { name: "Assigned Quizzes", id: "assigned", icon: Clock },
    { name: "Completed Quizzes", id: "completed", icon: CheckCircle },
    { name: "Analysis", id: "analysis", icon: BarChart2 },

  ];

  const renderContent = () => {
    switch (activeTab) {
      case "home": return <HomeTab />;
      case "assigned": return <AssignedQuizzes />;
      case "completed": return <CompletedQuizzes />;
      case "analysis": return <Analysis />;
      default: return <HomeTab />;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    window.location.href = "/";
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white flex flex-col justify-between transition-all duration-300 ${sidebarOpen ? "w-72" : "w-20"}`}>
        {/* Header */}
        <div>
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            {sidebarOpen && (
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  QuizMaster
                </h1>
              </div>
            )}
            <button onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {/* Items */}
          <div className="flex flex-col p-4 space-y-2">
            {sidebarItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center w-full p-3 rounded-xl transition-all ${
                  activeTab === item.id ? "bg-blue-600 text-white" : "hover:bg-gray-700"
                }`}
              >
                <item.icon className="h-5 w-5" />
                {sidebarOpen && <span className="ml-4">{item.name}</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Logout */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className={`flex items-center w-full p-3 rounded-xl bg-red-600 hover:bg-red-700 transition-all ${
              sidebarOpen ? "justify-start" : "justify-center"
            }`}
          >
            <LogOut className="h-5 w-5 text-white" />
            {sidebarOpen && <span className="ml-4 text-white">Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 bg-white overflow-y-auto">{renderContent()}</div>
    </div>
  );
}

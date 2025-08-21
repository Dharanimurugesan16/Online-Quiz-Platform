//import React, { useState, useEffect } from "react";
//import {
//  Clock,
//  CheckCircle,
//  BarChart2,
//  Trophy,
//  Target,
//  TrendingUp,
//  Calendar,
//  Star,
//  BookOpen,
//  Award,
//  Zap,
//  Users
//} from "lucide-react";
//
//// Configure the API base URL
//const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";
//
//export default function Home() {
//  const [stats, setStats] = useState({
//    totalQuizzes: 0,
//    completedQuizzes: 0,
//    averageScore: 0,
//    totalPoints: 0,
//    averageTimePerQuiz: 0, // New metric
//    rank: 0,
//    streak: 0
//  });
//
//  const [recentQuizzes, setRecentQuizzes] = useState([]);
//  const [achievements, setAchievements] = useState([]);
//  const [isLoading, setIsLoading] = useState(true);
//  const [error, setError] = useState(null);
//
//  // Fetch data from backend on component mount
//  useEffect(() => {
//    const fetchDashboardData = async () => {
//      const userId = localStorage.getItem("userId");
//      if (!userId) {
//        setError("Please log in to view your dashboard");
//        setIsLoading(false);
//        return;
//      }
//
//      try {
//        setIsLoading(true);
//
//        // Fetch user quiz attempts
//        const attemptsResponse = await fetch(`${API_BASE_URL}/api/quiz-attempt/${userId}`, {
//          method: "GET",
//          headers: {
//            "Content-Type": "application/json",
//          },
//        });
//
//        if (!attemptsResponse.ok) {
//          throw new Error(`Failed to fetch quiz attempts: ${attemptsResponse.status}`);
//        }
//
//        const attemptsData = await attemptsResponse.json();
//
//        // Process the data
//        processDashboardData(attemptsData);
//
//      } catch (err) {
//        console.error("Fetch Error:", err);
//        setError(err.message);
//      } finally {
//        setIsLoading(false);
//      }
//    };
//
//    fetchDashboardData();
//  }, []);
//
//  const processDashboardData = (attemptsData) => {
//    // Filter out invalid attempts
//    const validAttempts = attemptsData.filter(attempt =>
//      attempt && typeof attempt.score === 'number'
//    );
//
//    // Calculate stats from quiz attempts
//    const completedAttempts = validAttempts.filter(attempt => attempt.score !== null);
//    const totalQuizzes = new Set(validAttempts.map(attempt => attempt.quizId)).size;
//
//    const totalScore = completedAttempts.reduce((sum, attempt) => sum + attempt.score, 0);
//    const averageScore = completedAttempts.length > 0 ? Math.round(totalScore / completedAttempts.length) : 0;
//
//    // Calculate average time per quiz (in minutes)
//    const totalTimeSpent = completedAttempts.reduce((sum, attempt) =>
//      sum + (attempt.timeSpent || 0), 0
//    );
//    const averageTimePerQuiz = completedAttempts.length > 0
//      ? Math.round(totalTimeSpent / completedAttempts.length / 60) // Convert seconds to minutes
//      : 0;
//
//    // Calculate points (example: 10 points per correct percentage point)
//    const totalPoints = completedAttempts.reduce((sum, attempt) =>
//      sum + Math.round(attempt.score / 10), 0
//    );
//
//    // Set stats
//    setStats({
//      totalQuizzes,
//      completedQuizzes: completedAttempts.length,
//      averageScore,
//      totalPoints,
//      averageTimePerQuiz, // New metric
//      rank: calculateRank(completedAttempts.length, averageScore),
//      streak: calculateStreak(validAttempts)
//    });
//
//    // Set recent quizzes (last 5 attempts)
//    const recent = validAttempts
//      .sort((a, b) => new Date(b.completedDate) - new Date(a.completedDate))
//      .slice(0, 5)
//      .map(attempt => ({
//        id: attempt.attemptId,
//        title: attempt.quizTitle || "Unnamed Quiz",
//        score: attempt.score,
//        date: formatDate(attempt.completedDate),
//        status: attempt.score !== null ? "completed" : "pending"
//      }));
//
//    setRecentQuizzes(recent);
//
//    // Set achievements (based on user performance)
//    setAchievements(calculateAchievements(validAttempts, completedAttempts.length));
//  };
//
//  // Helper functions
//  const calculateRank = (completedCount, averageScore) => {
//    // Example ranking logic
//    if (averageScore >= 90 && completedCount >= 10) return 1;
//    if (averageScore >= 80 && completedCount >= 5) return 2;
//    if (averageScore >= 70 && completedCount >= 3) return 3;
//    return Math.max(4, Math.floor(20 - completedCount));
//  };
//
//  const calculateStreak = (attempts) => {
//    // Simple streak calculation - counts consecutive days with completed attempts
//    const completedDates = attempts
//      .filter(a => a.score !== null && a.completedDate)
//      .map(a => new Date(a.completedDate).toDateString())
//      .filter((date, i, arr) => arr.indexOf(date) === i)
//      .sort()
//      .reverse();
//
//    let streak = 0;
//    let currentDate = new Date();
//
//    for (let i = 0; i < completedDates.length; i++) {
//      const attemptDate = new Date(completedDates[i]);
//      const diffTime = Math.abs(currentDate - attemptDate);
//      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//
//      if (diffDays === streak + 1) {
//        streak++;
//        currentDate = attemptDate;
//      } else {
//        break;
//      }
//    }
//
//    return streak;
//  };
//
//  const formatDate = (dateString) => {
//    if (!dateString) return "No date";
//    const date = new Date(dateString);
//    return date.toLocaleDateString('en-US', {
//      year: 'numeric',
//      month: 'short',
//      day: 'numeric'
//    });
//  };
//
//  const calculateAchievements = (attempts, completedCount) => {
//    const achievements = [];
//
//    // Check for perfect score achievement
//    const hasPerfectScore = attempts.some(attempt => attempt.score === 100);
//    if (hasPerfectScore) {
//      achievements.push({
//        id: 1,
//        title: "Perfect Score",
//        description: "Scored 100% on a quiz",
//        icon: Trophy,
//        color: "text-yellow-600",
//        bgColor: "bg-yellow-100"
//      });
//    }
//
//    // Quiz master achievement
//    if (completedCount >= 5) {
//      achievements.push({
//        id: 2,
//        title: "Quiz Master",
//        description: `Completed ${completedCount} quizzes`,
//        icon: Award,
//        color: "text-purple-600",
//        bgColor: "bg-purple-100"
//      });
//    }
//
//    // Speed runner achievement (assuming timeSpent is in seconds)
//    const fastAttempt = attempts.find(attempt => attempt.timeSpent && attempt.timeSpent < 180); // 3 minutes
//    if (fastAttempt) {
//      achievements.push({
//        id: 3,
//        title: "Speed Runner",
//        description: "Finished quiz in under 3 minutes",
//        icon: Zap,
//        color: "text-blue-600",
//        bgColor: "bg-blue-100"
//      });
//    }
//
//    // Consistent learner achievement
//    const streak = calculateStreak(attempts);
//    if (streak >= 3) {
//      achievements.push({
//        id: 4,
//        title: "Consistent Learner",
//        description: `${streak}-day learning streak`,
//        icon: Target,
//        color: "text-green-600",
//        bgColor: "bg-green-100"
//      });
//    }
//
//    // Time efficient achievement
//    const efficientAttempts = attempts.filter(attempt => attempt.timeSpent && attempt.timeSpent < 300 && attempt.score >= 80); // <5 min & good score
//    if (efficientAttempts.length >= 3) {
//      achievements.push({
//        id: 5,
//        title: "Time Efficient",
//        description: "Scored 80%+ in under 5 minutes",
//        icon: Clock,
//        color: "text-orange-600",
//        bgColor: "bg-orange-100"
//      });
//    }
//
//    // Add default achievements if none earned yet
//    if (achievements.length === 0 && completedCount > 0) {
//      achievements.push({
//        id: 6,
//        title: "Getting Started",
//        description: "Complete more quizzes to earn achievements!",
//        icon: Star,
//        color: "text-gray-600",
//        bgColor: "bg-gray-100"
//      });
//    }
//
//    // If no quizzes completed at all
//    if (achievements.length === 0) {
//      achievements.push({
//        id: 7,
//        title: "Welcome!",
//        description: "Complete your first quiz to earn achievements!",
//        icon: Star,
//        color: "text-gray-600",
//        bgColor: "bg-gray-100"
//      });
//    }
//
//    return achievements;
//  };
//
//  const getScoreColor = (score) => {
//    if (score >= 90) return "text-green-600";
//    if (score >= 75) return "text-blue-600";
//    if (score >= 60) return "text-yellow-600";
//    return "text-red-600";
//  };
//
//  const getTimeEfficiencyColor = (time) => {
//    if (time < 3) return "text-green-600";
//    if (time < 5) return "text-blue-600";
//    if (time < 8) return "text-yellow-600";
//    return "text-red-600";
//  };
//
//  // Render loading state
//  if (isLoading) {
//    return (
//      <div className="flex justify-center items-center h-screen">
//        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600"></div>
//      </div>
//    );
//  }
//
//  // Render error state
//  if (error) {
//    return (
//      <div className="flex justify-center items-center h-screen">
//        <div className="text-red-600 text-lg">
//          Error: {error}
//          <br />
//          <button
//            className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
//            onClick={() => window.location.reload()}
//          >
//            Retry
//          </button>
//        </div>
//      </div>
//    );
//  }
//
//  return (
//    <div className="space-y-8">
//      {/* Welcome Header */}
//      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white relative overflow-hidden">
//        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
//        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
//
//        <div className="relative z-10">
//          <h1 className="text-4xl font-bold mb-2">Welcome back, Student!</h1>
//          <p className="text-blue-100 text-lg">Ready to continue your learning journey? You're doing great!</p>
//
//          <div className="flex items-center gap-6 mt-6">
//            <div className="flex items-center gap-2">
//              <Zap className="h-5 w-5 text-yellow-300" />
//              <span className="font-medium">{stats.streak} Day Streak</span>
//            </div>
//            <div className="flex items-center gap-2">
//              <Trophy className="h-5 w-5 text-yellow-300" />
//              <span className="font-medium">Rank #{stats.rank}</span>
//            </div>
//            <div className="flex items-center gap-2">
//              <Star className="h-5 w-5 text-yellow-300" />
//              <span className="font-medium">{stats.totalPoints} Points</span>
//            </div>
//          </div>
//        </div>
//      </div>
//
//      {/* Quick Stats Grid */}
//      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
//          <div className="flex items-center justify-between">
//            <div>
//              <p className="text-sm font-medium text-gray-600">Total Quizzes</p>
//              <p className="text-3xl font-bold text-gray-900">{stats.totalQuizzes}</p>
//            </div>
//            <div className="bg-blue-100 p-3 rounded-full">
//              <BookOpen className="h-6 w-6 text-blue-600" />
//            </div>
//          </div>
//          <div className="mt-4 flex items-center">
//            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
//            <span className="text-sm text-green-600">{stats.completedQuizzes > 0 ? `${stats.completedQuizzes} completed` : 'No quizzes yet'}</span>
//          </div>
//        </div>
//
//        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
//          <div className="flex items-center justify-between">
//            <div>
//              <p className="text-sm font-medium text-gray-600">Completed</p>
//              <p className="text-3xl font-bold text-gray-900">{stats.completedQuizzes}</p>
//            </div>
//            <div className="bg-green-100 p-3 rounded-full">
//              <CheckCircle className="h-6 w-6 text-green-600" />
//            </div>
//          </div>
//          <div className="mt-4">
//            <div className="flex items-center justify-between text-sm mb-2">
//              <span className="text-gray-600">Avg Time/Quiz</span>
//              <span className={`font-medium ${getTimeEfficiencyColor(stats.averageTimePerQuiz)}`}>
//                {stats.averageTimePerQuiz}m
//              </span>
//            </div>
//            <div className="w-full bg-gray-200 rounded-full h-2">
//              <div
//                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
//                style={{
//                  width: `${Math.min(stats.averageTimePerQuiz * 10, 100)}%`,
//                  backgroundColor: stats.averageTimePerQuiz < 3 ? '#10B981' :
//                                 stats.averageTimePerQuiz < 5 ? '#3B82F6' :
//                                 stats.averageTimePerQuiz < 8 ? '#F59E0B' : '#EF4444'
//                }}
//              ></div>
//            </div>
//            <div className="mt-1 text-xs text-gray-500">
//              {stats.averageTimePerQuiz === 0 ? 'No data' :
//               stats.averageTimePerQuiz < 3 ? 'Very fast!' :
//               stats.averageTimePerQuiz < 5 ? 'Good pace' :
//               stats.averageTimePerQuiz < 8 ? 'Average' : 'Take your time'}
//            </div>
//          </div>
//        </div>
//
//        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
//          <div className="flex items-center justify-between">
//            <div>
//              <p className="text-sm font-medium text-gray-600">Average Score</p>
//              <p className="text-3xl font-bold text-gray-900">{stats.averageScore}%</p>
//            </div>
//            <div className="bg-purple-100 p-3 rounded-full">
//              <BarChart2 className="h-6 w-6 text-purple-600" />
//            </div>
//          </div>
//          <div className="mt-4 flex items-center">
//            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
//            <span className="text-sm text-green-600">
//              {stats.completedQuizzes > 0 ? 'Great progress!' : 'Start your first quiz'}
//            </span>
//          </div>
//        </div>
//
//        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
//          <div className="flex items-center justify-between">
//            <div>
//              <p className="text-sm font-medium text-gray-600">Total Points</p>
//              <p className="text-3xl font-bold text-gray-900">{stats.totalPoints}</p>
//            </div>
//            <div className="bg-yellow-100 p-3 rounded-full">
//              <Star className="h-6 w-6 text-yellow-600" />
//            </div>
//          </div>
//          <div className="mt-4">
//            <span className="text-sm text-yellow-600">
//              Earned from quizzes
//            </span>
//          </div>
//        </div>
//      </div>
//
//      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//        {/* Recent Quiz Activity */}
//        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
//          <div className="flex items-center justify-between mb-6">
//            <h2 className="text-2xl font-bold text-gray-900">Recent Quiz Activity</h2>
//          </div>
//
//          <div className="space-y-4">
//            {recentQuizzes.length > 0 ? (
//              recentQuizzes.map((quiz) => (
//                <div key={quiz.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
//                  <div className="flex items-center space-x-4">
//                    <div className={`p-2 rounded-full ${quiz.status === 'completed' ? 'bg-green-100' : 'bg-orange-100'}`}>
//                      {quiz.status === 'completed' ?
//                        <CheckCircle className="h-5 w-5 text-green-600" /> :
//                        <Clock className="h-5 w-5 text-orange-600" />
//                      }
//                    </div>
//                    <div>
//                      <h3 className="font-semibold text-gray-900">{quiz.title}</h3>
//                      <p className="text-sm text-gray-600">{quiz.date}</p>
//                    </div>
//                  </div>
//
//                  <div className="text-right">
//                    {quiz.status === 'completed' ? (
//                      <div>
//                        <span className={`text-xl font-bold ${getScoreColor(quiz.score)}`}>
//                          {quiz.score}%
//                        </span>
//                        <p className="text-xs text-gray-500">Score</p>
//                      </div>
//                    ) : (
//                      <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
//                        In Progress
//                      </span>
//                    )}
//                  </div>
//                </div>
//              ))
//            ) : (
//              <div className="text-center py-8 text-gray-500">
//                <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
//                <p>No quiz activity yet</p>
//                <p className="text-sm mt-2">Complete a quiz to see your progress here</p>
//              </div>
//            )}
//          </div>
//        </div>
//
//        {/* Achievements Section */}
//        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
//          <div className="flex items-center justify-between mb-6">
//            <h2 className="text-2xl font-bold text-gray-900">Your Achievements</h2>
//            <Trophy className="h-5 w-5 text-gray-400" />
//          </div>
//
//          <div className="space-y-4">
//            {achievements.length > 0 ? (
//              achievements.map((achievement) => (
//                <div key={achievement.id} className="p-4 border border-gray-200 rounded-xl hover:shadow-md transition-shadow duration-200">
//                  <div className="flex items-center space-x-4">
//                    <div className={`p-3 rounded-full ${achievement.bgColor}`}>
//                      <achievement.icon className={`h-6 w-6 ${achievement.color}`} />
//                    </div>
//                    <div>
//                      <h3 className="font-semibold text-gray-900">{achievement.title}</h3>
//                      <p className="text-sm text-gray-600">{achievement.description}</p>
//                    </div>
//                  </div>
//                </div>
//              ))
//            ) : (
//              <div className="text-center py-8 text-gray-500">
//                <Award className="h-12 w-12 mx-auto mb-2 opacity-50" />
//                <p>Complete quizzes to earn achievements!</p>
//              </div>
//            )}
//          </div>
//        </div>
//      </div>
//    </div>
//  );
//}
//import React, { useState, useEffect } from "react";
//import {
//  Clock,
//  CheckCircle,
//  BarChart2,
//  Trophy,
//  Target,
//  TrendingUp,
//  Star,
//  BookOpen,
//  Award,
//  Zap,
//  Bell,
//  X,
//  ChevronDown,
//  ChevronUp,
//} from "lucide-react";
//
//// Configure the API base URL
//const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";
//
//export default function Home() {
//  const [stats, setStats] = useState({
//    totalQuizzes: 0,
//    completedQuizzes: 0,
//    averageScore: 0,
//    totalPoints: 0,
//    averageTimePerQuiz: 0,
//    rank: 0,
//    streak: 0,
//  });
//  const [recentQuizzes, setRecentQuizzes] = useState([]);
//  const [achievements, setAchievements] = useState([]);
//  const [notifications, setNotifications] = useState([]);
//  const [dismissedNotifications, setDismissedNotifications] = useState([]);
//  const [recentlyDismissed, setRecentlyDismissed] = useState(null);
//  const [isNotificationsOpen, setIsNotificationsOpen] = useState(true); // New state for notifications section
//  const [isLoading, setIsLoading] = useState(true);
//  const [error, setError] = useState(null);
//
//  // Load dismissed notifications from localStorage
//  useEffect(() => {
//    const storedDismissed = localStorage.getItem("dismissedNotifications");
//    if (storedDismissed) {
//      setDismissedNotifications(JSON.parse(storedDismissed));
//    }
//  }, []);
//
//  // Save dismissed notifications to localStorage
//  useEffect(() => {
//    localStorage.setItem("dismissedNotifications", JSON.stringify(dismissedNotifications));
//  }, [dismissedNotifications]);
//
//  // Fetch dashboard data
//  useEffect(() => {
//    const fetchDashboardData = async () => {
//      const userId = localStorage.getItem("userId");
//      if (!userId) {
//        setError("Please log in to view your dashboard");
//        setIsLoading(false);
//        return;
//      }
//
//      try {
//        setIsLoading(true);
//
//        const [attemptsResponse, retakeResponse] = await Promise.all([
//          fetch(`${API_BASE_URL}/api/quiz-attempt/${userId}`, {
//            method: "GET",
//            headers: { "Content-Type": "application/json" },
//          }),
//          fetch(`${API_BASE_URL}/api/quiz-retake/requests`, {
//            method: "GET",
//            headers: { "Content-Type": "application/json" },
//          }),
//        ]);
//
//        if (!attemptsResponse.ok) {
//          throw new Error(`Failed to fetch quiz attempts: ${attemptsResponse.status}`);
//        }
//        if (!retakeResponse.ok) {
//          throw new Error(`Failed to fetch retake requests: ${retakeResponse.status}`);
//        }
//
//        const attemptsData = await attemptsResponse.json();
//        const retakeData = await retakeResponse.json();
//
//        // Process quiz attempts
//        processDashboardData(attemptsData);
//
//        // Process notifications
//        const userRetakeRequests = retakeData.filter(request => request.userId === parseInt(userId));
//        const retakeNotifications = userRetakeRequests.map((request) => ({
//          id: `retake-${request.id}`,
//          quizTitle: request.quizTitle || "Unknown Quiz",
//          status: request.status || "PENDING",
//          message: `Retake request for "${request.quizTitle || "Unknown Quiz"}" is ${request.status?.toLowerCase() || "pending"}.`,
//          date: formatDate(request.requestDate),
//          type: "retake",
//        }));
//
//        const completionNotifications = attemptsData
//          .filter(attempt => attempt.score !== null)
//          .map(attempt => ({
//            id: `completion-${attempt.attemptId}`,
//            quizTitle: attempt.quizTitle || "Unnamed Quiz",
//            status: "COMPLETED",
//            message: `You completed "${attempt.quizTitle || "Unnamed Quiz"}" with a score of ${attempt.score || 0}%.`,
//            date: formatDate(attempt.completedDate),
//            type: "completion",
//          }));
//
//        // Combine and filter notifications
//        const allNotifications = [...retakeNotifications, ...completionNotifications]
//          .filter(notification => !dismissedNotifications.includes(notification.id))
//          .sort((a, b) => new Date(b.date) - new Date(a.date));
//
//        setNotifications(allNotifications);
//      } catch (err) {
//        console.error("Fetch Error:", err);
//        setError(err.message || "Failed to load dashboard data");
//      } finally {
//        setIsLoading(false);
//      }
//    };
//
//    fetchDashboardData();
//  }, [dismissedNotifications]);
//
//  // Dismiss a notification
//  const dismissNotification = (notificationId) => {
//    setNotifications(notifications.filter(n => n.id !== notificationId));
//    setDismissedNotifications([...dismissedNotifications, notificationId]);
//    setRecentlyDismissed(notificationId);
//    setTimeout(() => {
//      setRecentlyDismissed(null);
//    }, 5000);
//  };
//
//  // Undo dismiss
//  const undoDismiss = async () => {
//    if (!recentlyDismissed) return;
//    setDismissedNotifications(dismissedNotifications.filter(id => id !== recentlyDismissed));
//    setRecentlyDismissed(null);
//
//    // Refetch notifications to restore
//    const userId = localStorage.getItem("userId");
//    try {
//      const [attemptsResponse, retakeResponse] = await Promise.all([
//        fetch(`${API_BASE_URL}/api/quiz-attempt/${userId}`, { headers: { "Content-Type": "application/json" } }),
//        fetch(`${API_BASE_URL}/api/quiz-retake/requests`, { headers: { "Content-Type": "application/json" } }),
//      ]);
//
//      const attemptsData = await attemptsResponse.json();
//      const retakeData = await retakeResponse.json();
//
//      const userRetakeRequests = retakeData.filter(request => request.userId === parseInt(userId));
//      const retakeNotifications = userRetakeRequests.map((request) => ({
//        id: `retake-${request.id}`,
//        quizTitle: request.quizTitle || "Unknown Quiz",
//        status: request.status || "PENDING",
//        message: `Retake request for "${request.quizTitle || "Unknown Quiz"}" is ${request.status?.toLowerCase() || "pending"}.`,
//        date: formatDate(request.requestDate),
//        type: "retake",
//      }));
//
//      const completionNotifications = attemptsData
//        .filter(attempt => attempt.score !== null)
//        .map(attempt => ({
//          id: `completion-${attempt.attemptId}`,
//          quizTitle: attempt.quizTitle || "Unnamed Quiz",
//          status: "COMPLETED",
//          message: `You completed "${attempt.quizTitle || "Unnamed Quiz"}" with a score of ${attempt.score || 0}%.`,
//          date: formatDate(attempt.completedDate),
//          type: "completion",
//        }));
//
//      setNotifications([...retakeNotifications, ...completionNotifications]
//        .filter(n => !dismissedNotifications.includes(n.id) || n.id === recentlyDismissed)
//        .sort((a, b) => new Date(b.date) - new Date(a.date)));
//    } catch (err) {
//      console.error("Error restoring notification:", err);
//    }
//  };
//
//  // Toggle show/hide dismissed notifications
//  const toggleShowDismissed = async () => {
//    if (dismissedNotifications.length === 0) return;
//
//    if (notifications.some(n => dismissedNotifications.includes(n.id))) {
//      // Hide dismissed notifications
//      setNotifications(notifications.filter(n => !dismissedNotifications.includes(n.id)));
//    } else {
//      // Show all notifications
//      const userId = localStorage.getItem("userId");
//      try {
//        const [attemptsResponse, retakeResponse] = await Promise.all([
//          fetch(`${API_BASE_URL}/api/quiz-attempt/${userId}`, { headers: { "Content-Type": "application/json" } }),
//          fetch(`${API_BASE_URL}/api/quiz-retake/requests`, { headers: { "Content-Type": "application/json" } }),
//        ]);
//
//        const attemptsData = await attemptsResponse.json();
//        const retakeData = await retakeResponse.json();
//
//        const userRetakeRequests = retakeData.filter(request => request.userId === parseInt(userId));
//        const retakeNotifications = userRetakeRequests.map((request) => ({
//          id: `retake-${request.id}`,
//          quizTitle: request.quizTitle || "Unknown Quiz",
//          status: request.status || "PENDING",
//          message: `Retake request for "${request.quizTitle || "Unknown Quiz"}" is ${request.status?.toLowerCase() || "pending"}.`,
//          date: formatDate(request.requestDate),
//          type: "retake",
//        }));
//
//        const completionNotifications = attemptsData
//          .filter(attempt => attempt.score !== null)
//          .map(attempt => ({
//            id: `completion-${attempt.attemptId}`,
//            quizTitle: attempt.quizTitle || "Unnamed Quiz",
//            status: "COMPLETED",
//            message: `You completed "${attempt.quizTitle || "Unnamed Quiz"}" with a score of ${attempt.score || 0}%.`,
//            date: formatDate(attempt.completedDate),
//            type: "completion",
//          }));
//
//        setNotifications([...retakeNotifications, ...completionNotifications]
//          .sort((a, b) => new Date(b.date) - new Date(a.date)));
//      } catch (err) {
//        console.error("Error fetching notifications:", err);
//        setError("Failed to load notifications");
//      }
//    }
//  };
//
//  // Toggle notifications section visibility
//  const toggleNotificationsSection = () => {
//    setIsNotificationsOpen(!isNotificationsOpen);
//  };
//
//  const processDashboardData = (attemptsData) => {
//    const validAttempts = attemptsData.filter((attempt) => attempt && typeof attempt.score === "number");
//    const completedAttempts = validAttempts.filter((attempt) => attempt.score !== null);
//    const totalQuizzes = new Set(validAttempts.map((attempt) => attempt.quizId)).size;
//
//    const totalScore = completedAttempts.reduce((sum, attempt) => sum + (attempt.score || 0), 0);
//    const averageScore = completedAttempts.length > 0 ? Math.round(totalScore / completedAttempts.length) : 0;
//
//    const totalTimeSpent = completedAttempts.reduce((sum, attempt) => sum + (attempt.timeSpent || 0), 0);
//    const averageTimePerQuiz = completedAttempts.length > 0 ? Math.round(totalTimeSpent / completedAttempts.length / 60) : 0;
//
//    const totalPoints = completedAttempts.reduce((sum, attempt) => sum + Math.round((attempt.score || 0) / 10), 0);
//
//    setStats({
//      totalQuizzes,
//      completedQuizzes: completedAttempts.length,
//      averageScore,
//      totalPoints,
//      averageTimePerQuiz,
//      rank: calculateRank(completedAttempts.length, averageScore),
//      streak: calculateStreak(validAttempts),
//    });
//
//    const recent = validAttempts
//      .sort((a, b) => new Date(b.completedDate) - new Date(a.completedDate))
//      .slice(0, 5)
//      .map((attempt) => ({
//        id: attempt.attemptId,
//        title: attempt.quizTitle || "Unnamed Quiz",
//        score: attempt.score,
//        date: formatDate(attempt.completedDate),
//        status: attempt.score !== null ? "completed" : "pending",
//      }));
//
//    setRecentQuizzes(recent);
//    setAchievements(calculateAchievements(validAttempts, completedAttempts.length));
//  };
//
//  const calculateRank = (completedCount, averageScore) => {
//    if (averageScore >= 90 && completedCount >= 10) return 1;
//    if (averageScore >= 80 && completedCount >= 5) return 2;
//    if (averageScore >= 70 && completedCount >= 3) return 3;
//    return Math.max(4, Math.floor(20 - completedCount));
//  };
//
//  const calculateStreak = (attempts) => {
//    const completedDates = attempts
//      .filter((a) => a.score !== null && a.completedDate)
//      .map((a) => new Date(a.completedDate).toDateString())
//      .filter((date, i, arr) => arr.indexOf(date) === i)
//      .sort()
//      .reverse();
//
//    let streak = 0;
//    let currentDate = new Date();
//
//    for (let i = 0; i < completedDates.length; i++) {
//      const attemptDate = new Date(completedDates[i]);
//      const diffTime = Math.abs(currentDate - attemptDate);
//      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//
//      if (diffDays === streak + 1) {
//        streak++;
//        currentDate = attemptDate;
//      } else {
//        break;
//      }
//    }
//
//    return streak;
//  };
//
//  const formatDate = (dateString) => {
//    if (!dateString) return "No date";
//    const date = new Date(dateString);
//    return date.toLocaleDateString("en-US", {
//      year: "numeric",
//      month: "short",
//      day: "numeric",
//    });
//  };
//
//  const calculateAchievements = (attempts, completedCount) => {
//    const achievements = [];
//
//    const hasPerfectScore = attempts.some((attempt) => attempt.score === 100);
//    if (hasPerfectScore) {
//      achievements.push({
//        id: 1,
//        title: "Perfect Score",
//        description: "Scored 100% on a quiz",
//        icon: Trophy,
//        color: "text-yellow-600",
//        bgColor: "bg-yellow-100",
//      });
//    }
//
//    if (completedCount >= 5) {
//      achievements.push({
//        id: 2,
//        title: "Quiz Master",
//        description: `Completed ${completedCount} quizzes`,
//        icon: Award,
//        color: "text-purple-600",
//        bgColor: "bg-purple-100",
//      });
//    }
//
//    const fastAttempt = attempts.find((attempt) => attempt.timeSpent && attempt.timeSpent < 180);
//    if (fastAttempt) {
//      achievements.push({
//        id: 3,
//        title: "Speed Runner",
//        description: "Finished quiz in under 3 minutes",
//        icon: Zap,
//        color: "text-blue-600",
//        bgColor: "bg-blue-100",
//      });
//    }
//
//    const streak = calculateStreak(attempts);
//    if (streak >= 3) {
//      achievements.push({
//        id: 4,
//        title: "Consistent Learner",
//        description: `${streak}-day learning streak`,
//        icon: Target,
//        color: "text-green-600",
//        bgColor: "bg-green-100",
//      });
//    }
//
//    const efficientAttempts = attempts.filter((attempt) => attempt.timeSpent && attempt.timeSpent < 300 && attempt.score >= 80);
//    if (efficientAttempts.length >= 3) {
//      achievements.push({
//        id: 5,
//        title: "Time Efficient",
//        description: "Scored 80%+ in under 5 minutes",
//        icon: Clock,
//        color: "text-orange-600",
//        bgColor: "bg-orange-100",
//      });
//    }
//
//    if (achievements.length === 0 && completedCount > 0) {
//      achievements.push({
//        id: 6,
//        title: "Getting Started",
//        description: "Complete more quizzes to earn achievements!",
//        icon: Star,
//        color: "text-gray-600",
//        bgColor: "bg-gray-100",
//      });
//    }
//
//    if (achievements.length === 0) {
//      achievements.push({
//        id: 7,
//        title: "Welcome!",
//        description: "Complete your first quiz to earn achievements!",
//        icon: Star,
//        color: "text-gray-600",
//        bgColor: "bg-gray-100",
//      });
//    }
//
//    return achievements;
//  };
//
//  const getScoreColor = (score) => {
//    if (score >= 90) return "text-green-600";
//    if (score >= 75) return "text-blue-600";
//    if (score >= 60) return "text-yellow-600";
//    return "text-red-600";
//  };
//
//  const getTimeEfficiencyColor = (time) => {
//    if (time < 3) return "text-green-600";
//    if (time < 5) return "text-blue-600";
//    if (time < 8) return "text-yellow-600";
//    return "text-red-600";
//  };
//
//  if (isLoading) {
//    return (
//      <div className="flex justify-center items-center h-screen">
//        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600"></div>
//      </div>
//    );
//  }
//
//  if (error) {
//    return (
//      <div className="flex justify-center items-center h-screen">
//        <div className="text-red-600 text-lg">
//          Error: {error}
//          <br />
//          <button
//            className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
//            onClick={() => window.location.reload()}
//          >
//            Retry
//          </button>
//        </div>
//      </div>
//    );
//  }
//
//  return (
//    <div className="space-y-8">
//      {/* Welcome Header */}
//      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white relative overflow-hidden">
//        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
//        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
//        <div className="relative z-10">
//          <h1 className="text-4xl font-bold mb-2">Welcome back, Student!</h1>
//          <p className="text-blue-100 text-lg">Ready to continue your learning journey? You're doing great!</p>
//          <div className="flex items-center gap-6 mt-6">
//            <div className="flex items-center gap-2">
//              <Zap className="h-5 w-5 text-yellow-300" />
//              <span className="font-medium">{stats.streak} Day Streak</span>
//            </div>
//            <div className="flex items-center gap-2">
//              <Trophy className="h-5 w-5 text-yellow-300" />
//              <span className="font-medium">Rank #{stats.rank}</span>
//            </div>
//            <div className="flex items-center gap-2">
//              <Star className="h-5 w-5 text-yellow-300" />
//              <span className="font-medium">{stats.totalPoints} Points</span>
//            </div>
//          </div>
//        </div>
//      </div>
//
//      {/* Notifications Section */}
//      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
//        <div className="flex items-center justify-between mb-6">
//          <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
//          <div className="flex items-center space-x-4">
//            {dismissedNotifications.length > 0 && (
//              <button
//                onClick={toggleShowDismissed}
//                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
//              >
//                {notifications.some(n => dismissedNotifications.includes(n.id))
//                  ? "Hide Dismissed Notifications"
//                  : "Show Dismissed Notifications"}
//              </button>
//            )}
//            <button
//              onClick={toggleNotificationsSection}
//              className="flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium"
//            >
//              {isNotificationsOpen ? (
//                <>
//                  <ChevronUp className="h-5 w-5 mr-1" />
//                  Hide Notifications
//                </>
//              ) : (
//                <>
//                  <ChevronDown className="h-5 w-5 mr-1" />
//                  Show Notifications
//                </>
//              )}
//            </button>
//            <Bell className="h-5 w-5 text-gray-400" />
//          </div>
//        </div>
//
//        {isNotificationsOpen && (
//          <div className="space-y-4">
//            {notifications.length > 0 ? (
//              notifications.map((notification) => (
//                <div
//                  key={notification.id}
//                  className={`p-4 rounded-xl border flex items-center justify-between space-x-4 ${
//                    notification.status === "APPROVED" || notification.status === "COMPLETED"
//                      ? "bg-green-50 border-green-200"
//                      : notification.status === "REJECTED"
//                      ? "bg-red-50 border-red-200"
//                      : "bg-yellow-50 border-yellow-200"
//                  }`}
//                >
//                  <div className="flex items-center space-x-4">
//                    <div
//                      className={`p-2 rounded-full ${
//                        notification.status === "APPROVED" || notification.status === "COMPLETED"
//                          ? "bg-green-100"
//                          : notification.status === "REJECTED"
//                          ? "bg-red-100"
//                          : "bg-yellow-100"
//                      }`}
//                    >
//                      <Bell
//                        className={`h-5 w-5 ${
//                          notification.status === "APPROVED" || notification.status === "COMPLETED"
//                            ? "text-green-600"
//                            : notification.status === "REJECTED"
//                            ? "text-red-600"
//                            : "text-yellow-600"
//                        }`}
//                      />
//                    </div>
//                    <div>
//                      <p className="text-gray-900 font-semibold">{notification.message}</p>
//                      <p className="text-sm text-gray-600">{notification.date}</p>
//                    </div>
//                  </div>
//                  <button
//                    onClick={() => dismissNotification(notification.id)}
//                    className="text-gray-500 hover:text-gray-700"
//                  >
//                    <X className="h-5 w-5" />
//                  </button>
//                </div>
//              ))
//            ) : (
//              <div className="text-center py-8 text-gray-500">
//                <Bell className="h-12 w-12 mx-auto mb-2 opacity-50" />
//                <p>No notifications yet</p>
//              </div>
//            )}
//            {recentlyDismissed && (
//              <div className="text-center mt-4">
//                <button
//                  onClick={undoDismiss}
//                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
//                >
//                  Undo Dismiss
//                </button>
//              </div>
//            )}
//          </div>
//        )}
//      </div>
//
//      {/* Quick Stats Grid */}
//      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
//          <div className="flex items-center justify-between">
//            <div>
//              <p className="text-sm font-medium text-gray-600">Total Quizzes</p>
//              <p className="text-3xl font-bold text-gray-900">{stats.totalQuizzes}</p>
//            </div>
//            <div className="bg-blue-100 p-3 rounded-full">
//              <BookOpen className="h-6 w-6 text-blue-600" />
//            </div>
//          </div>
//          <div className="mt-4 flex items-center">
//            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
//            <span className="text-sm text-green-600">{stats.completedQuizzes > 0 ? `${stats.completedQuizzes} completed` : "No quizzes yet"}</span>
//          </div>
//        </div>
//
//        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
//          <div className="flex items-center justify-between">
//            <div>
//              <p className="text-sm font-medium text-gray-600">Completed</p>
//              <p className="text-3xl font-bold text-gray-900">{stats.completedQuizzes}</p>
//            </div>
//            <div className="bg-green-100 p-3 rounded-full">
//              <CheckCircle className="h-6 w-6 text-green-600" />
//            </div>
//          </div>
//          <div className="mt-4">
//            <div className="flex items-center justify-between text-sm mb-2">
//              <span className="text-gray-600">Avg Time/Quiz</span>
//              <span className={`font-medium ${getTimeEfficiencyColor(stats.averageTimePerQuiz)}`}>{stats.averageTimePerQuiz}m</span>
//            </div>
//            <div className="w-full bg-gray-200 rounded-full h-2">
//              <div
//                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
//                style={{
//                  width: `${Math.min(stats.averageTimePerQuiz * 10, 100)}%`,
//                  backgroundColor:
//                    stats.averageTimePerQuiz < 3
//                      ? "#10B981"
//                      : stats.averageTimePerQuiz < 5
//                      ? "#3B82F6"
//                      : stats.averageTimePerQuiz < 8
//                      ? "#F59E0B"
//                      : "#EF4444",
//                }}
//              ></div>
//            </div>
//            <div className="mt-1 text-xs text-gray-500">
//              {stats.averageTimePerQuiz === 0
//                ? "No data"
//                : stats.averageTimePerQuiz < 3
//                ? "Very fast!"
//                : stats.averageTimePerQuiz < 5
//                ? "Good pace"
//                : stats.averageTimePerQuiz < 8
//                ? "Average"
//                : "Take your time"}
//            </div>
//          </div>
//        </div>
//
//        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
//          <div className="flex items-center justify-between">
//            <div>
//              <p className="text-sm font-medium text-gray-600">Average Score</p>
//              <p className="text-3xl font-bold text-gray-900">{stats.averageScore}%</p>
//            </div>
//            <div className="bg-purple-100 p-3 rounded-full">
//              <BarChart2 className="h-6 w-6 text-purple-600" />
//            </div>
//          </div>
//          <div className="mt-4 flex items-center">
//            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
//            <span className="text-sm text-green-600">{stats.completedQuizzes > 0 ? "Great progress!" : "Start your first quiz"}</span>
//          </div>
//        </div>
//
//        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
//          <div className="flex items-center justify-between">
//            <div>
//              <p className="text-sm font-medium text-gray-600">Total Points</p>
//              <p className="text-3xl font-bold text-gray-900">{stats.totalPoints}</p>
//            </div>
//            <div className="bg-yellow-100 p-3 rounded-full">
//              <Star className="h-6 w-6 text-yellow-600" />
//            </div>
//          </div>
//          <div className="mt-4">
//            <span className="text-sm text-yellow-600">Earned from quizzes</span>
//          </div>
//        </div>
//      </div>
//
//      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//        {/* Recent Quiz Activity */}
//        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
//          <div className="flex items-center justify-between mb-6">
//            <h2 className="text-2xl font-bold text-gray-900">Recent Quiz Activity</h2>
//          </div>
//
//          <div className="space-y-4">
//            {recentQuizzes.length > 0 ? (
//              recentQuizzes.map((quiz) => (
//                <div
//                  key={quiz.id}
//                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200"
//                >
//                  <div className="flex items-center space-x-4">
//                    <div className={`p-2 rounded-full ${quiz.status === "completed" ? "bg-green-100" : "bg-orange-100"}`}>
//                      {quiz.status === "completed" ? (
//                        <CheckCircle className="h-5 w-5 text-green-600" />
//                      ) : (
//                        <Clock className="h-5 w-5 text-orange-600" />
//                      )}
//                    </div>
//                    <div>
//                      <h3 className="font-semibold text-gray-900">{quiz.title}</h3>
//                      <p className="text-sm text-gray-600">{quiz.date}</p>
//                    </div>
//                  </div>
//
//                  <div className="text-right">
//                    {quiz.status === "completed" ? (
//                      <div>
//                        <span className={`text-xl font-bold ${getScoreColor(quiz.score)}`}>{quiz.score}%</span>
//                        <p className="text-xs text-gray-500">Score</p>
//                      </div>
//                    ) : (
//                      <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
//                        In Progress
//                      </span>
//                    )}
//                  </div>
//                </div>
//              ))
//            ) : (
//              <div className="text-center py-8 text-gray-500">
//                <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
//                <p>No quiz activity yet</p>
//                <p className="text-sm mt-2">Complete a quiz to see your progress here</p>
//              </div>
//            )}
//          </div>
//        </div>
//
//        {/* Achievements Section */}
//        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
//          <div className="flex items-center justify-between mb-6">
//            <h2 className="text-2xl font-bold text-gray-900">Your Achievements</h2>
//            <Trophy className="h-5 w-5 text-gray-400" />
//          </div>
//
//          <div className="space-y-4">
//            {achievements.length > 0 ? (
//              achievements.map((achievement) => (
//                <div
//                  key={achievement.id}
//                  className="p-4 border border-gray-200 rounded-xl hover:shadow-md transition-shadow duration-200"
//                >
//                  <div className="flex items-center space-x-4">
//                    <div className={`p-3 rounded-full ${achievement.bgColor}`}>
//                      <achievement.icon className={`h-6 w-6 ${achievement.color}`} />
//                    </div>
//                    <div>
//                      <h3 className="font-semibold text-gray-900">{achievement.title}</h3>
//                      <p className="text-sm text-gray-600">{achievement.description}</p>
//                    </div>
//                  </div>
//                </div>
//              ))
//            ) : (
//              <div className="text-center py-8 text-gray-500">
//                <Award className="h-12 w-12 mx-auto mb-2 opacity-50" />
//                <p>Complete quizzes to earn achievements!</p>
//              </div>
//            )}
//          </div>
//        </div>
//      </div>
//    </div>
//  );
//}
import React, { useState, useEffect } from "react";
import {
  Clock,
  CheckCircle,
  BarChart2,
  Trophy,
  Target,
  TrendingUp,
  Star,
  BookOpen,
  Award,
  Zap,
  Bell,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

// Configure the API base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

export default function Home() {
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    completedQuizzes: 0,
    averageScore: 0,
    totalPoints: 0,
    averageTimePerQuiz: 0,
    rank: 0,
    streak: 0,
  });
  const [recentQuizzes, setRecentQuizzes] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [dismissedNotifications, setDismissedNotifications] = useState(() => {
    // Load synchronously on initialization
    const stored = localStorage.getItem("dismissedNotifications");
    try {
      return stored ? JSON.parse(stored) : [];
    } catch (err) {
      console.error("Error parsing dismissedNotifications from localStorage:", err);
      return [];
    }
  });
  const [recentlyDismissed, setRecentlyDismissed] = useState(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false); // Default to hidden
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Save dismissed notifications to localStorage
  useEffect(() => {
    try {
      console.log("Saving dismissedNotifications to localStorage:", dismissedNotifications);
      localStorage.setItem("dismissedNotifications", JSON.stringify(dismissedNotifications));
    } catch (err) {
      console.error("Error saving dismissedNotifications to localStorage:", err);
    }
  }, [dismissedNotifications]);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        setError("Please log in to view your dashboard");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        const [attemptsResponse, retakeResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/api/quiz-attempt/${userId}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }),
          fetch(`${API_BASE_URL}/api/quiz-retake/requests`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }),
        ]);

        if (!attemptsResponse.ok) {
          throw new Error(`Failed to fetch quiz attempts: ${attemptsResponse.status}`);
        }
        if (!retakeResponse.ok) {
          throw new Error(`Failed to fetch retake requests: ${retakeResponse.status}`);
        }

        const attemptsData = await attemptsResponse.json();
        const retakeData = await retakeResponse.json();

        // Process quiz attempts
        processDashboardData(attemptsData);

        // Process notifications
        const userRetakeRequests = retakeData.filter(request => request.userId === parseInt(userId));
        const retakeNotifications = userRetakeRequests.map((request) => ({
          id: `retake-${request.id}`,
          quizTitle: request.quizTitle || "Unknown Quiz",
          status: request.status || "PENDING",
          message: `Retake request for "${request.quizTitle || "Unknown Quiz"}" is ${request.status?.toLowerCase() || "pending"}.`,
          date: formatDate(request.requestDate),
          type: "retake",
        }));

        const completionNotifications = attemptsData
          .filter(attempt => attempt.score !== null)
          .map(attempt => ({
            id: `completion-${attempt.attemptId}`,
            quizTitle: attempt.quizTitle || "Unnamed Quiz",
            status: "COMPLETED",
            message: `You completed "${attempt.quizTitle || "Unnamed Quiz"}" with a score of ${attempt.score || 0}%.`,
            date: formatDate(attempt.completedDate),
            type: "completion",
          }));

        // Combine notifications
        const allNotifications = [...retakeNotifications, ...completionNotifications]
          .sort((a, b) => new Date(b.date) - new Date(a.date));

        // Filter out dismissed notifications
        console.log("Filtering notifications with dismissed IDs:", dismissedNotifications);
        const filteredNotifications = allNotifications.filter(
          notification => !dismissedNotifications.includes(notification.id)
        );
        setNotifications(filteredNotifications);
      } catch (err) {
        console.error("Fetch Error:", err);
        setError(err.message || "Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []); // Empty dependencies to run only on mount

  // Dismiss a notification
  const dismissNotification = (notificationId) => {
    console.log("Dismissing notification:", notificationId);
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
    setDismissedNotifications(prev => {
      const updated = [...new Set([...prev, notificationId])]; // Prevent duplicates
      console.log("Updated dismissedNotifications:", updated);
      return updated;
    });
    setRecentlyDismissed(notificationId);
    setTimeout(() => {
      setRecentlyDismissed(null);
    }, 5000);
  };

  // Undo dismiss
  const undoDismiss = () => {
    if (!recentlyDismissed) return;
    console.log("Undoing dismiss for:", recentlyDismissed);
    setDismissedNotifications(prev => prev.filter(id => id !== recentlyDismissed));
    setRecentlyDismissed(null);
    const restoredNotification = notifications.find(n => n.id === recentlyDismissed) ||
      (recentQuizzes.find(q => `completion-${q.id}` === recentlyDismissed) ? {
        id: recentlyDismissed,
        quizTitle: recentQuizzes.find(q => `completion-${q.id}` === recentlyDismissed)?.title || "Unnamed Quiz",
        status: "COMPLETED",
        message: `You completed "${recentQuizzes.find(q => `completion-${q.id}` === recentlyDismissed)?.title || "Unnamed Quiz"}" with a score of ${recentQuizzes.find(q => `completion-${q.id}` === recentlyDismissed)?.score || 0}%.`,
        date: recentQuizzes.find(q => `completion-${q.id}` === recentlyDismissed)?.date || formatDate(new Date()),
        type: "completion",
      } : null);
    if (restoredNotification) {
      setNotifications(prev => [...prev, restoredNotification].sort((a, b) => new Date(b.date) - new Date(a.date)));
    }
  };

  // Toggle notifications section visibility
  const toggleNotificationsSection = () => {
    setIsNotificationsOpen(prev => !prev);
  };

  const processDashboardData = (attemptsData) => {
    const validAttempts = attemptsData.filter((attempt) => attempt && typeof attempt.score === "number");
    const completedAttempts = validAttempts.filter((attempt) => attempt.score !== null);
    const totalQuizzes = new Set(validAttempts.map((attempt) => attempt.quizId)).size;

    const totalScore = completedAttempts.reduce((sum, attempt) => sum + (attempt.score || 0), 0);
    const averageScore = completedAttempts.length > 0 ? Math.round(totalScore / completedAttempts.length) : 0;

    const totalTimeSpent = completedAttempts.reduce((sum, attempt) => sum + (attempt.timeSpent || 0), 0);
    const averageTimePerQuiz = completedAttempts.length > 0 ? Math.round(totalTimeSpent / completedAttempts.length / 60) : 0;

    const totalPoints = completedAttempts.reduce((sum, attempt) => sum + Math.round((attempt.score || 0) / 10), 0);

    setStats({
      totalQuizzes,
      completedQuizzes: completedAttempts.length,
      averageScore,
      totalPoints,
      averageTimePerQuiz,
      rank: calculateRank(completedAttempts.length, averageScore),
      streak: calculateStreak(validAttempts),
    });

    const recent = validAttempts
      .sort((a, b) => new Date(b.completedDate) - new Date(a.completedDate))
      .slice(0, 5)
      .map((attempt) => ({
        id: attempt.attemptId,
        title: attempt.quizTitle || "Unnamed Quiz",
        score: attempt.score,
        date: formatDate(attempt.completedDate),
        status: attempt.score !== null ? "completed" : "pending",
      }));

    setRecentQuizzes(recent);
    setAchievements(calculateAchievements(validAttempts, completedAttempts.length));
  };

  const calculateRank = (completedCount, averageScore) => {
    if (averageScore >= 90 && completedCount >= 10) return 1;
    if (averageScore >= 80 && completedCount >= 5) return 2;
    if (averageScore >= 70 && completedCount >= 3) return 3;
    return Math.max(4, Math.floor(20 - completedCount));
  };

  const calculateStreak = (attempts) => {
    const completedDates = attempts
      .filter((a) => a.score !== null && a.completedDate)
      .map((a) => new Date(a.completedDate).toDateString())
      .filter((date, i, arr) => arr.indexOf(date) === i)
      .sort()
      .reverse();

    let streak = 0;
    let currentDate = new Date();

    for (let i = 0; i < completedDates.length; i++) {
      const attemptDate = new Date(completedDates[i]);
      const diffTime = Math.abs(currentDate - attemptDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === streak + 1) {
        streak++;
        currentDate = attemptDate;
      } else {
        break;
      }
    }

    return streak;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No date";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const calculateAchievements = (attempts, completedCount) => {
    const achievements = [];

    const hasPerfectScore = attempts.some((attempt) => attempt.score === 100);
    if (hasPerfectScore) {
      achievements.push({
        id: 1,
        title: "Perfect Score",
        description: "Scored 100% on a quiz",
        icon: Trophy,
        color: "text-yellow-600",
        bgColor: "bg-yellow-100",
      });
    }

    if (completedCount >= 5) {
      achievements.push({
        id: 2,
        title: "Quiz Master",
        description: `Completed ${completedCount} quizzes`,
        icon: Award,
        color: "text-purple-600",
        bgColor: "bg-purple-100",
      });
    }

    const fastAttempt = attempts.find((attempt) => attempt.timeSpent && attempt.timeSpent < 180);
    if (fastAttempt) {
      achievements.push({
        id: 3,
        title: "Speed Runner",
        description: "Finished quiz in under 3 minutes",
        icon: Zap,
        color: "text-blue-600",
        bgColor: "bg-blue-100",
      });
    }

    const streak = calculateStreak(attempts);
    if (streak >= 3) {
      achievements.push({
        id: 4,
        title: "Consistent Learner",
        description: `${streak}-day learning streak`,
        icon: Target,
        color: "text-green-600",
        bgColor: "bg-green-100",
      });
    }

    const efficientAttempts = attempts.filter((attempt) => attempt.timeSpent && attempt.timeSpent < 300 && attempt.score >= 80);
    if (efficientAttempts.length >= 3) {
      achievements.push({
        id: 5,
        title: "Time Efficient",
        description: "Scored 80%+ in under 5 minutes",
        icon: Clock,
        color: "text-orange-600",
        bgColor: "bg-orange-100",
      });
    }

    if (achievements.length === 0 && completedCount > 0) {
      achievements.push({
        id: 6,
        title: "Getting Started",
        description: "Complete more quizzes to earn achievements!",
        icon: Star,
        color: "text-gray-600",
        bgColor: "bg-gray-100",
      });
    }

    if (achievements.length === 0) {
      achievements.push({
        id: 7,
        title: "Welcome!",
        description: "Complete your first quiz to earn achievements!",
        icon: Star,
        color: "text-gray-600",
        bgColor: "bg-gray-100",
      });
    }

    return achievements;
  };

  const getScoreColor = (score) => {
    if (score >= 90) return "text-green-600";
    if (score >= 75) return "text-blue-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getTimeEfficiencyColor = (time) => {
    if (time < 3) return "text-green-600";
    if (time < 5) return "text-blue-600";
    if (time < 8) return "text-yellow-600";
    return "text-red-600";
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-600 text-lg">
          Error: {error}
          <br />
          <button
            className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

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

      {/* Notifications Section */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleNotificationsSection}
              className="flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              {isNotificationsOpen ? (
                <>
                  <ChevronUp className="h-5 w-5 mr-1" />
                  Hide Notifications
                </>
              ) : (
                <>
                  <ChevronDown className="h-5 w-5 mr-1" />
                  Show Notifications
                </>
              )}
            </button>
            <Bell className="h-5 w-5 text-gray-400" />
          </div>
        </div>

        {isNotificationsOpen && (
          <div className="space-y-4">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-xl border flex items-center justify-between space-x-4 ${
                    notification.status === "APPROVED" || notification.status === "COMPLETED"
                      ? "bg-green-50 border-green-200"
                      : notification.status === "REJECTED"
                      ? "bg-red-50 border-red-200"
                      : "bg-yellow-50 border-yellow-200"
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`p-2 rounded-full ${
                        notification.status === "APPROVED" || notification.status === "COMPLETED"
                          ? "bg-green-100"
                          : notification.status === "REJECTED"
                          ? "bg-red-100"
                          : "bg-yellow-100"
                      }`}
                    >
                      <Bell
                        className={`h-5 w-5 ${
                          notification.status === "APPROVED" || notification.status === "COMPLETED"
                            ? "text-green-600"
                            : notification.status === "REJECTED"
                            ? "text-red-600"
                            : "text-yellow-600"
                        }`}
                      />
                    </div>
                    <div>
                      <p className="text-gray-900 font-semibold">{notification.message}</p>
                      <p className="text-sm text-gray-600">{notification.date}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => dismissNotification(notification.id)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Bell className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No notifications yet</p>
              </div>
            )}
            {recentlyDismissed && (
              <div className="text-center mt-4">
                <button
                  onClick={undoDismiss}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Undo Dismiss
                </button>
              </div>
            )}
          </div>
        )}
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
            <span className="text-sm text-green-600">{stats.completedQuizzes > 0 ? `${stats.completedQuizzes} completed` : "No quizzes yet"}</span>
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
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-600">Avg Time/Quiz</span>
              <span className={`font-medium ${getTimeEfficiencyColor(stats.averageTimePerQuiz)}`}>{stats.averageTimePerQuiz}m</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(stats.averageTimePerQuiz * 10, 100)}%`,
                  backgroundColor:
                    stats.averageTimePerQuiz < 3
                      ? "#10B981"
                      : stats.averageTimePerQuiz < 5
                      ? "#3B82F6"
                      : stats.averageTimePerQuiz < 8
                      ? "#F59E0B"
                      : "#EF4444",
                }}
              ></div>
            </div>
            <div className="mt-1 text-xs text-gray-500">
              {stats.averageTimePerQuiz === 0
                ? "No data"
                : stats.averageTimePerQuiz < 3
                ? "Very fast!"
                : stats.averageTimePerQuiz < 5
                ? "Good pace"
                : stats.averageTimePerQuiz < 8
                ? "Average"
                : "Take your time"}
            </div>
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
            <span className="text-sm text-green-600">{stats.completedQuizzes > 0 ? "Great progress!" : "Start your first quiz"}</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Points</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalPoints}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <Star className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-yellow-600">Earned from quizzes</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Quiz Activity */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recent Quiz Activity</h2>
          </div>

          <div className="space-y-4">
            {recentQuizzes.length > 0 ? (
              recentQuizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-full ${quiz.status === "completed" ? "bg-green-100" : "bg-orange-100"}`}>
                      {quiz.status === "completed" ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <Clock className="h-5 w-5 text-orange-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{quiz.title}</h3>
                      <p className="text-sm text-gray-600">{quiz.date}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    {quiz.status === "completed" ? (
                      <div>
                        <span className={`text-xl font-bold ${getScoreColor(quiz.score)}`}>{quiz.score}%</span>
                        <p className="text-xs text-gray-500">Score</p>
                      </div>
                    ) : (
                      <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
                        In Progress
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No quiz activity yet</p>
                <p className="text-sm mt-2">Complete a quiz to see your progress here</p>
              </div>
            )}
          </div>
        </div>

        {/* Achievements Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Your Achievements</h2>
            <Trophy className="h-5 w-5 text-gray-400" />
          </div>

          <div className="space-y-4">
            {achievements.length > 0 ? (
              achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className="p-4 border border-gray-200 rounded-xl hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-full ${achievement.bgColor}`}>
                      <achievement.icon className={`h-6 w-6 ${achievement.color}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{achievement.title}</h3>
                      <p className="text-sm text-gray-600">{achievement.description}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Award className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Complete quizzes to earn achievements!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
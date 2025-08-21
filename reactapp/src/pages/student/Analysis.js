import React, { useState, useEffect } from "react";
import {
  BarChart2,
  TrendingUp,
  Target,
  Clock,
  Star,
  CheckCircle,
  Trophy,
  PieChart as PieChartIcon,
  Filter,
  Download
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PieChart, Pie, Cell, ResponsiveContainer as ResponsiveContainerPie, Tooltip as PieTooltip, Legend as PieLegend } from 'recharts';

// Colors for pie chart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d'];

// Configure the API base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

// Helper function to log unknown values
const logUnknownValues = (attempts) => {
  console.log("=== ANALYZING QUIZ ATTEMPTS FOR UNKNOWN VALUES ===");

  if (!attempts || !Array.isArray(attempts)) {
    console.log("No attempts data or invalid format");
    return;
  }

  // Check for unknown values in each attempt
  attempts.forEach((attempt, index) => {
    console.log(`--- Attempt ${index + 1} ---`);

    const unknownFields = [];

    if (attempt.category === "Unknown" || !attempt.category) unknownFields.push('category');
    if (attempt.difficulty === "UNKNOWN" || !attempt.difficulty) unknownFields.push('difficulty');
    if (!attempt.quizTitle || attempt.quizTitle === "Unknown Quiz") unknownFields.push('quizTitle');

    if (unknownFields.length > 0) {
      console.log(`Fields with unknown values: ${unknownFields.join(', ')}`);
      console.log('Attempt object:', attempt);
    } else {
      console.log('No unknown values found');
    }
  });

  // Count how many attempts have unknown categories
  const unknownCategoryCount = attempts.filter(attempt =>
    attempt.category === "Unknown" || !attempt.category
  ).length;

  console.log(`Attempts with unknown category: ${unknownCategoryCount}/${attempts.length}`);

  console.log("=== END ANALYSIS ===");
};

// Helper function to process quiz attempts into performanceData structure
const processQuizAttempts = (attempts) => {
  // Log unknown values for debugging
  logUnknownValues(attempts);

  // Handle empty or invalid attempts
  if (!attempts || !Array.isArray(attempts) || attempts.length === 0) {
    console.log("No quiz attempts found or invalid data format");
    return {
      totalQuizzes: 0,
      averageScore: 0,
      totalTimeSpent: 0,
      perfectScores: 0,
      improvement: 0,
      scoreTrend: [],
      categoryPerformance: [],
      categoryPieData: [],
      questionAccuracy: [],
    };
  }

  // Filter out invalid attempts
  const validAttempts = attempts.filter(attempt =>
    attempt && typeof attempt.score === 'number' && attempt.score >= 0
  );

  if (validAttempts.length === 0) {
    console.log("No valid quiz attempts found after filtering");
    return {
      totalQuizzes: 0,
      averageScore: 0,
      totalTimeSpent: 0,
      perfectScores: 0,
      improvement: 0,
      scoreTrend: [],
      categoryPerformance: [],
      categoryPieData: [],
      questionAccuracy: [],
    };
  }

  console.log(`Processing ${validAttempts.length} valid quiz attempts`);

  // Calculate total quizzes
  const totalQuizzes = validAttempts.length;

  // Calculate average score
  const totalScore = validAttempts.reduce((sum, attempt) => sum + attempt.score, 0);
  const averageScore = Math.round(totalScore / totalQuizzes);

  // Calculate total time spent
  const totalTimeSpent = Math.round(validAttempts.reduce((sum, attempt) =>
    sum + ((attempt.timeSpent || 0) / 60), 0));

  // Calculate perfect scores (score === 100)
  const perfectScores = validAttempts.filter((attempt) => attempt.score === 100).length;

  // Calculate improvement (current month vs previous month)
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const currentMonthAttempts = validAttempts.filter((attempt) => {
    if (!attempt.completedDate) {
      console.log("Attempt missing completedDate:", attempt);
      return false;
    }
    const date = new Date(attempt.completedDate);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  });

  const previousMonthAttempts = validAttempts.filter((attempt) => {
    if (!attempt.completedDate) return false;
    const date = new Date(attempt.completedDate);
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    return date.getMonth() === prevMonth && date.getFullYear() === prevYear;
  });

  console.log(`Current month attempts: ${currentMonthAttempts.length}, Previous month attempts: ${previousMonthAttempts.length}`);

  const currentMonthAvg = currentMonthAttempts.length > 0
    ? currentMonthAttempts.reduce((sum, attempt) => sum + attempt.score, 0) / currentMonthAttempts.length
    : 0;

  const previousMonthAvg = previousMonthAttempts.length > 0
    ? previousMonthAttempts.reduce((sum, attempt) => sum + attempt.score, 0) / previousMonthAttempts.length
    : 0;

  const improvement = previousMonthAvg > 0
    ? Math.round(((currentMonthAvg - previousMonthAvg) / previousMonthAvg) * 100)
    : currentMonthAvg > 0 ? 100 : 0;

  // Map to scoreTrend
  const scoreTrend = validAttempts
    .map((attempt) => {
      const attemptDate = attempt.completedDate
        ? attempt.completedDate.split('T')[0]
        : new Date().toISOString().split('T')[0];

      return {
        id: attempt.attemptId || `unknown-${Math.random().toString(36).substr(2, 9)}`,
        title: attempt.quizTitle || "Unnamed Quiz",
        score: attempt.score,
        date: attemptDate,
      };
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  // Group by category for categoryPerformance - use quiz title if category is unknown
  const categoryGroups = validAttempts.reduce((acc, attempt) => {
    let category = attempt.category;

    // If category is unknown, try to use quiz title or default to "General"
    if (category === "Unknown" || !category) {
      category = attempt.quizTitle || "General Knowledge";
    }

    if (!acc[category]) {
      acc[category] = { scores: [], completed: 0, total: 0 };
    }
    acc[category].scores.push(attempt.score);
    acc[category].completed += 1;
    acc[category].total += 1;
    return acc;
  }, {});

  console.log("Category groups:", categoryGroups);

  const categoryPerformance = Object.keys(categoryGroups).map((category) => ({
    category,
    averageScore: Math.round(
      categoryGroups[category].scores.reduce((sum, score) => sum + score, 0) /
      categoryGroups[category].scores.length
    ),
    completed: categoryGroups[category].completed,
    total: categoryGroups[category].total,
  }));

  // Prepare data for pie chart
  const categoryPieData = categoryPerformance.map((cat) => ({
    name: cat.category,
    value: cat.averageScore,
  }));

  // Group by difficulty and category for questionAccuracy
  const difficultyGroups = validAttempts.reduce((acc, attempt) => {
    const difficulty = attempt.difficulty || "MIXED";
    if (!acc[difficulty]) {
      acc[difficulty] = { correct: 0, total: 0 };
    }
    acc[difficulty].correct += attempt.correctAnswers || 0;
    acc[difficulty].total += attempt.totalQuestions || 0;
    return acc;
  }, {});

  const categoryAccuracyGroups = validAttempts.reduce((acc, attempt) => {
    let category = attempt.category;

    // If category is unknown, try to use quiz title or default to "General"
    if (category === "Unknown" || !category) {
      category = attempt.quizTitle || "General Knowledge";
    }

    if (!acc[category]) {
      acc[category] = { correct: 0, total: 0 };
    }
    acc[category].correct += attempt.correctAnswers || 0;
    acc[category].total += attempt.totalQuestions || 0;
    return acc;
  }, {});

  const questionAccuracy = [
    ...Object.keys(difficultyGroups).map((difficulty) => ({
      difficulty,
      correct: difficultyGroups[difficulty].correct,
      total: difficultyGroups[difficulty].total,
    })),
    ...Object.keys(categoryAccuracyGroups).map((category) => ({
      category,
      correct: categoryAccuracyGroups[category].correct,
      total: categoryAccuracyGroups[category].total,
    })),
  ];

  console.log("Processed performance data:", {
    totalQuizzes,
    averageScore,
    totalTimeSpent,
    perfectScores,
    improvement,
    scoreTrendCount: scoreTrend.length,
    categoryPerformance,
    categoryPieData,
    questionAccuracy,
  });

  return {
    totalQuizzes,
    averageScore,
    totalTimeSpent,
    perfectScores,
    improvement,
    scoreTrend,
    categoryPerformance,
    categoryPieData,
    questionAccuracy,
  };
};

export default function Analysis() {
  // State for performance data, loading, and error
  const [performanceData, setPerformanceData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rawData, setRawData] = useState(null);

  // Fetch data from backend on component mount
  useEffect(() => {
    const fetchPerformanceData = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        setError("Please log in to view your performance");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/quiz-attempt/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        console.log("Response Status:", response.status);
        console.log("Response Headers:", [...response.headers.entries()]);

        if (!response.ok) {
          const text = await response.text();
          throw new Error(`HTTP error! Status: ${response.status}, Response: ${text}`);
        }

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          const text = await response.text();
          throw new Error(`Expected JSON, but received: ${text.substring(0, 100)}...`);
        }

        const data = await response.json();
        setRawData(data); // Store raw data for debugging

        console.log("Raw API response data:", data);

        if (data.length > 0 && data[0].error) {
          throw new Error(data[0].error);
        }

        // Process the quiz attempts into performanceData structure
        const processedData = processQuizAttempts(data);
        setPerformanceData(processedData);
      } catch (err) {
        console.error("Fetch Error:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPerformanceData();
  }, []);

  // Helper functions
  const getScoreColor = (score) => {
    if (score >= 90) return "text-green-600";
    if (score >= 75) return "text-blue-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "EASY": return "bg-green-100 text-green-700";
      case "MEDIUM": return "bg-yellow-100 text-yellow-700";
      case "HARD": return "bg-red-100 text-red-700";
      case "MIXED": return "bg-purple-100 text-purple-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  // Debug button to show raw data
  const showRawData = () => {
    console.log("Raw API data:", rawData);
    alert("Raw data logged to console. Check the browser developer tools.");
  };

  // Render loading or error states
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

  // Handle empty quiz attempts
  if (!performanceData.totalQuizzes) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-gray-600 text-lg">No quiz attempts found. Start a quiz to see your performance!</div>
        <button
          className="mt-4 ml-4 bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700"
          onClick={showRawData}
        >
          Debug: Show Raw Data
        </button>
      </div>
    );
  }

  // Calculate total accuracy for the progress bar
  const totalCorrect = performanceData.questionAccuracy.reduce((sum, q) => sum + q.correct, 0);
  const totalQuestions = performanceData.questionAccuracy.reduce((sum, q) => sum + q.total, 0);
  const totalAccuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

  // Render the component with fetched data
  return (
    <div className="space-y-8">
      {/* Debug button */}
      <div className="fixed bottom-4 right-4 z-50">
        <button
          className="bg-gray-800 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-gray-700 text-sm"
          onClick={showRawData}
          title="View raw API data in console"
        >
          Debug Data
        </button>
      </div>

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
            <span className="text-sm text-green-600">+{performanceData.improvement}% this month</span>
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
              <span className="font-medium text-gray-900">{totalAccuracy}%</span>
            </div>
            <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${totalAccuracy}%` }}
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
              Avg: {Math.round(performanceData.totalTimeSpent / (performanceData.totalQuizzes || 1))} min/quiz
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
              {Math.round((performanceData.perfectScores / (performanceData.totalQuizzes || 1)) * 100)}% success rate
            </span>
          </div>
        </div>
      </div>

      {/* Score Trend Bar Chart using Recharts */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Score Trend</h2>
          <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">View Details</button>
        </div>
        <div style={{ height: '300px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={performanceData.scoreTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="score" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 border-t border-gray-200 pt-4">
          <p className="text-gray-600 text-sm">
            Your scores have {performanceData.improvement >= 0 ? 'improved' : 'decreased'} by {Math.abs(performanceData.improvement)}% over the last month.
          </p>
        </div>
      </div>

      {/* Category Performance with Pie Chart */}
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* List View */}
          <div className="space-y-4">
            {performanceData.categoryPerformance.length > 0 ? (
              performanceData.categoryPerformance.map((cat) => (
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
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Target className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No category data available</p>
              </div>
            )}
          </div>
          {/* Pie Chart View */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <PieChartIcon className="h-5 w-5 mr-2" />
              Average Score Distribution by Category
            </h3>
            {performanceData.categoryPieData.length > 0 ? (
              <div style={{ height: '300px' }}>
                <ResponsiveContainerPie width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={performanceData.categoryPieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {performanceData.categoryPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <PieTooltip />
                    <PieLegend />
                  </PieChart>
                </ResponsiveContainerPie>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <PieChartIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No data available for pie chart</p>
              </div>
            )}
          </div>
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
            {performanceData.questionAccuracy.filter((q) => q.difficulty).length > 0 ? (
              performanceData.questionAccuracy
                .filter((q) => q.difficulty)
                .map((q) => (
                  <div key={q.difficulty} className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`font-medium ${getDifficultyColor(q.difficulty)} px-3 py-1 rounded-full text-sm`}>
                        {q.difficulty}
                      </span>
                      <span className="text-gray-900 font-medium">
                        {Math.round((q.correct / (q.total || 1)) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(q.correct / (q.total || 1)) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))
            ) : (
              <div className="text-center py-4 text-gray-500">
                <p>No difficulty data available</p>
              </div>
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">By Category</h3>
            {performanceData.questionAccuracy.filter((q) => q.category && !q.difficulty).length > 0 ? (
              performanceData.questionAccuracy
                .filter((q) => q.category && !q.difficulty)
                .map((q) => (
                  <div key={q.category} className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-700">{q.category}</span>
                      <span className="text-gray-900 font-medium">
                        {Math.round((q.correct / (q.total || 1)) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(q.correct / (q.total || 1)) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))
            ) : (
              <div className="text-center py-4 text-gray-500">
                <p>No category accuracy data available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
//import React, { useEffect, useState } from "react";
//import { useLocation, useNavigate } from "react-router-dom";
//import {
//  Trophy,
//  Target,
//  CheckCircle,
//  XCircle,
//  RotateCcw,
//  Home,
//  TrendingUp,
//  Award,
//  BookOpen,
//  Clock
//} from "lucide-react";
//
//export default function ResultPage() {
//  const location = useLocation();
//  const navigate = useNavigate();
//  const { quiz, answers, score } = location.state || {};
//
//  const [animatedScore, setAnimatedScore] = useState(0);
//
//  useEffect(() => {
//    if (score !== undefined) {
//      let current = 0;
//      const increment = score / 30;
//      const timer = setInterval(() => {
//        current += increment;
//        if (current >= score) {
//          setAnimatedScore(score);
//          clearInterval(timer);
//        } else {
//          setAnimatedScore(Math.floor(current));
//        }
//      }, 50);
//      return () => clearInterval(timer);
//    }
//  }, [score]);
//
//  const handleNavigate = (path) => navigate(path);
//
//  if (!quiz) {
//    return (
//      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-100 flex items-center justify-center">
//        <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
//          <XCircle className="w-16 h-16 text-purple-500 mx-auto mb-4" />
//          <h2 className="text-2xl font-bold text-gray-800 mb-2">No Results Available</h2>
//          <p className="text-gray-600 mb-6">Please complete a quiz first to view results.</p>
//          <button
//            onClick={() => handleNavigate("/student/dashboard")}
//            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
//          >
//            Go to Dashboard
//          </button>
//        </div>
//      </div>
//    );
//  }
//
//  const percentage = Math.round((score / quiz.questions.length) * 100);
//  const correctAnswers = score;
//  const totalQuestions = quiz.questions.length;
//
//  const getPerformanceData = () => {
//    if (percentage >= 90) return { level: "Excellent", bgClass: "bg-gradient-to-r from-purple-600 to-violet-600", fromClass: "from-purple-600", toClass: "to-violet-600", icon: Trophy };
//    if (percentage >= 80) return { level: "Very Good", bgClass: "bg-gradient-to-r from-purple-500 to-violet-500", fromClass: "from-purple-500", toClass: "to-violet-500", icon: Award };
//    if (percentage >= 70) return { level: "Good", bgClass: "bg-gradient-to-r from-purple-500 via-violet-500 to-fuchsia-500", fromClass: "from-purple-500", toClass: "to-fuchsia-500", icon: Target };
//    if (percentage >= 60) return { level: "Fair", bgClass: "bg-gradient-to-r from-violet-500 to-purple-500", fromClass: "from-violet-500", toClass: "to-purple-500", icon: TrendingUp };
//    return { level: "Needs Improvement", bgClass: "bg-gradient-to-r from-fuchsia-500 to-purple-500", fromClass: "from-fuchsia-500", toClass: "to-purple-500", icon: BookOpen };
//  };
//
//  const performance = getPerformanceData();
//  const PerformanceIcon = performance.icon;
//
//  return (
//    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-100 py-8 px-4">
//      <div className="max-w-4xl mx-auto">
//        {/* Header Section */}
//        <div className="text-center mb-8">
//          <div className={`inline-flex items-center justify-center w-20 h-20 ${performance.bgClass} rounded-3xl mb-6 shadow-lg`}>
//            <PerformanceIcon className="w-10 h-10 text-white" />
//          </div>
//          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3">
//            Quiz Results
//          </h1>
//          <p className="text-xl text-gray-600">
//            {quiz.title} - Assessment Complete
//          </p>
//        </div>
//
//        {/* Score Summary Card */}
//        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden mb-8">
//          <div className={`bg-gradient-to-r ${performance.fromClass} ${performance.toClass} px-8 py-12`}>
//            <div className="text-center text-white">
//              <div className="text-6xl md:text-7xl font-bold mb-4">
//                {animatedScore}<span className="text-3xl">/{totalQuestions}</span>
//              </div>
//              <div className="text-2xl md:text-3xl font-semibold mb-2">
//                {percentage}% Score
//              </div>
//              <div className="text-lg opacity-90">
//                Performance Level: {performance.level}
//              </div>
//            </div>
//          </div>
//
//          <div className="p-8">
//            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//              <div className="text-center p-4 bg-purple-50 rounded-2xl">
//                <CheckCircle className="w-8 h-8 text-purple-600 mx-auto mb-2" />
//                <div className="text-2xl font-bold text-purple-700">{correctAnswers}</div>
//                <div className="text-sm text-purple-600 font-medium">Correct Answers</div>
//              </div>
//
//              <div className="text-center p-4 bg-violet-50 rounded-2xl">
//                <XCircle className="w-8 h-8 text-violet-600 mx-auto mb-2" />
//                <div className="text-2xl font-bold text-violet-700">{totalQuestions - correctAnswers}</div>
//                <div className="text-sm text-violet-600 font-medium">Incorrect Answers</div>
//              </div>
//
//              <div className="text-center p-4 bg-fuchsia-50 rounded-2xl">
//                <Clock className="w-8 h-8 text-fuchsia-600 mx-auto mb-2" />
//                <div className="text-2xl font-bold text-fuchsia-700">{totalQuestions}</div>
//                <div className="text-sm text-fuchsia-600 font-medium">Total Questions</div>
//              </div>
//            </div>
//          </div>
//        </div>
//
//        {/* Progress Bar */}
//        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
//          <div className="flex justify-between items-center mb-3">
//            <h3 className="text-lg font-semibold text-gray-800">Overall Performance</h3>
//            <span className="text-sm font-medium text-gray-600">{percentage}%</span>
//          </div>
//          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
//            <div
//              className={`h-full bg-gradient-to-r ${performance.fromClass} ${performance.toClass} rounded-full transition-all duration-1000 ease-out relative`}
//              style={{ width: `${percentage}%` }}
//            >
//              <div className="absolute inset-0 bg-white opacity-20 animate-pulse rounded-full"></div>
//            </div>
//          </div>
//        </div>
//
//        {/* Detailed Results */}
//        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
//          <div className="bg-gray-50 px-8 py-4 border-b border-gray-200">
//            <h2 className="text-xl font-bold text-gray-800 flex items-center">
//              <Target className="w-5 h-5 mr-2 text-purple-600" />
//              Detailed Review
//            </h2>
//          </div>
//
//          <div className="p-8">
//            <div className="space-y-6">
//              {quiz.questions.map((question, index) => {
//                const userAnswer = answers[question.id];
//                const isCorrect = userAnswer === question.correctAnswer;
//
//                return (
//                  <div
//                    key={question.id}
//                    className={`
//                      p-6 rounded-2xl border-2 transition-all duration-300
//                      ${isCorrect
//                        ? 'border-purple-200 bg-purple-50 hover:bg-purple-100'
//                        : 'border-violet-200 bg-violet-50 hover:bg-violet-100'
//                      }
//                    `}
//                  >
//                    <div className="flex items-start space-x-4">
//                      <div className={`
//                        flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold
//                        ${isCorrect ? 'bg-purple-500' : 'bg-violet-500'}
//                      `}>
//                        {isCorrect ? (
//                          <CheckCircle className="w-5 h-5" />
//                        ) : (
//                          <XCircle className="w-5 h-5" />
//                        )}
//                      </div>
//
//                      <div className="flex-1">
//                        <h3 className="text-lg font-semibold text-gray-800 mb-3">
//                          Question {index + 1}: {question.questionText}
//                        </h3>
//
//                        <div className="space-y-2">
//                          <div className="flex items-center space-x-2">
//                            <span className="text-sm font-medium text-gray-600">Your Answer:</span>
//                            <span className={`
//                              px-3 py-1 rounded-full text-sm font-semibold
//                              ${isCorrect
//                                ? 'bg-purple-200 text-purple-800'
//                                : 'bg-violet-200 text-violet-800'
//                              }
//                            `}>
//                              {userAnswer || "No Answer"}
//                            </span>
//                          </div>
//
//                          {!isCorrect && (
//                            <div className="flex items-center space-x-2">
//                              <span className="text-sm font-medium text-gray-600">Correct Answer:</span>
//                              <span className="px-3 py-1 rounded-full text-sm font-semibold bg-purple-200 text-purple-800">
//                                {question.correctAnswer}
//                              </span>
//                            </div>
//                          )}
//                        </div>
//                      </div>
//                    </div>
//                  </div>
//                );
//              })}
//            </div>
//          </div>
//        </div>
//
//        {/* Action Buttons */}
//        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
//          <button
//            onClick={() => handleNavigate("/student/dashboard")}
//            className="flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-purple-500 via-violet-500 to-fuchsia-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:via-violet-600 hover:to-fuchsia-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
//          >
//            <Home className="w-5 h-5" />
//            <span>Back to Dashboard</span>
//          </button>
//
//          <button
//            onClick={() => window.location.reload()}
//            className="flex items-center space-x-2 px-8 py-4 bg-white text-gray-700 border-2 border-gray-300 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-400 transform hover:scale-105 transition-all duration-200"
//          >
//            <RotateCcw className="w-5 h-5" />
//            <span>Retake Quiz</span>
//          </button>
//        </div>
//
//        {/* Motivational Message */}
//        <div className="text-center mt-12 p-6 bg-gradient-to-r from-purple-50 to-fuchsia-50 rounded-2xl border border-purple-200">
//          {percentage >= 80 ? (
//            <p className="text-lg text-purple-800">
//              🎉 <strong>Congratulations!</strong> You've demonstrated excellent knowledge in this assessment.
//            </p>
//          ) : percentage >= 60 ? (
//            <p className="text-lg text-violet-800">
//              👍 <strong>Good effort!</strong> You're on the right track. Keep studying to improve further.
//            </p>
//          ) : (
//            <p className="text-lg text-fuchsia-800">
//              💪 <strong>Keep learning!</strong> Every expert was once a beginner. Review the material and try again.
//            </p>
//          )}
//        </div>
//      </div>
//    </div>
//  );
//}

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Trophy,
  Target,
  CheckCircle,
  XCircle,
  RotateCcw,
  Home,
  TrendingUp,
  Award,
  BookOpen,
  Clock
} from "lucide-react";

export default function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { quiz, answers, score } = location.state || {};

  const [animatedScore, setAnimatedScore] = useState(0);
  const [recalculatedScore, setRecalculatedScore] = useState(0);

  useEffect(() => {
    if (quiz && answers) {
      // Recalculate score to ensure accuracy
      let correctCount = 0;
      quiz.questions.forEach(question => {
        const userAnswer = answers[question.id];
        if (userAnswer && userAnswer.toString().trim().toLowerCase() ===
            question.correctAnswer.toString().trim().toLowerCase()) {
          correctCount++;
        }
      });
      setRecalculatedScore(correctCount);

      // Animate the score display
      let current = 0;
      const increment = correctCount / 30;
      const timer = setInterval(() => {
        current += increment;
        if (current >= correctCount) {
          setAnimatedScore(correctCount);
          clearInterval(timer);
        } else {
          setAnimatedScore(Math.floor(current));
        }
      }, 50);

      return () => clearInterval(timer);
    }
  }, [quiz, answers]);

  const handleNavigate = (path) => navigate(path);

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-100 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
          <XCircle className="w-16 h-16 text-purple-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No Results Available</h2>
          <p className="text-gray-600 mb-6">Please complete a quiz first to view results.</p>
          <button
            onClick={() => handleNavigate("/student/dashboard")}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const percentage = Math.round((recalculatedScore / quiz.questions.length) * 100);
  const correctAnswers = recalculatedScore;
  const totalQuestions = quiz.questions.length;

  const getPerformanceData = () => {
    if (percentage >= 90) return { level: "Excellent", bgClass: "bg-gradient-to-r from-purple-600 to-violet-600", fromClass: "from-purple-600", toClass: "to-violet-600", icon: Trophy };
    if (percentage >= 80) return { level: "Very Good", bgClass: "bg-gradient-to-r from-purple-500 to-violet-500", fromClass: "from-purple-500", toClass: "to-violet-500", icon: Award };
    if (percentage >= 70) return { level: "Good", bgClass: "bg-gradient-to-r from-purple-500 via-violet-500 to-fuchsia-500", fromClass: "from-purple-500", toClass: "to-fuchsia-500", icon: Target };
    if (percentage >= 60) return { level: "Fair", bgClass: "bg-gradient-to-r from-violet-500 to-purple-500", fromClass: "from-violet-500", toClass: "to-purple-500", icon: TrendingUp };
    return { level: "Needs Improvement", bgClass: "bg-gradient-to-r from-fuchsia-500 to-purple-500", fromClass: "from-fuchsia-500", toClass: "to-purple-500", icon: BookOpen };
  };

  const performance = getPerformanceData();
  const PerformanceIcon = performance.icon;

  // Function to check if answer is correct
  const isAnswerCorrect = (questionId) => {
    const userAnswer = answers[questionId];
    const correctAnswer = quiz.questions.find(q => q.id === questionId)?.correctAnswer;

    if (!userAnswer || !correctAnswer) return false;

    return userAnswer.toString().trim().toLowerCase() ===
           correctAnswer.toString().trim().toLowerCase();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-20 h-20 ${performance.bgClass} rounded-3xl mb-6 shadow-lg`}>
            <PerformanceIcon className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3">
            Quiz Results
          </h1>
          <p className="text-xl text-gray-600">
            {quiz.title} - Assessment Complete
          </p>
        </div>

        {/* Score Summary Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden mb-8">
          <div className={`bg-gradient-to-r ${performance.fromClass} ${performance.toClass} px-8 py-12`}>
            <div className="text-center text-white">
              <div className="text-6xl md:text-7xl font-bold mb-4">
                {animatedScore}<span className="text-3xl">/{totalQuestions}</span>
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
                <div className="text-2xl font-bold text-purple-700">{correctAnswers}</div>
                <div className="text-sm text-purple-600 font-medium">Correct Answers</div>
              </div>

              <div className="text-center p-4 bg-violet-50 rounded-2xl">
                <XCircle className="w-8 h-8 text-violet-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-violet-700">{totalQuestions - correctAnswers}</div>
                <div className="text-sm text-violet-600 font-medium">Incorrect Answers</div>
              </div>

              <div className="text-center p-4 bg-fuchsia-50 rounded-2xl">
                <Clock className="w-8 h-8 text-fuchsia-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-fuchsia-700">{totalQuestions}</div>
                <div className="text-sm text-fuchsia-600 font-medium">Total Questions</div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
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

        {/* Detailed Results */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="bg-gray-50 px-8 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <Target className="w-5 h-5 mr-2 text-purple-600" />
              Detailed Review
            </h2>
          </div>

          <div className="p-8">
            <div className="space-y-6">
              {quiz.questions.map((question, index) => {
                const userAnswer = answers[question.id];
                const isCorrect = isAnswerCorrect(question.id);

                return (
                  <div
                    key={question.id}
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
                          Question {index + 1}: {question.questionText}
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
                              {userAnswer || "No Answer"}
                            </span>
                          </div>

                          {!isCorrect && (
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium text-gray-600">Correct Answer:</span>
                              <span className="px-3 py-1 rounded-full text-sm font-semibold bg-purple-200 text-purple-800">
                                {question.correctAnswer}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <button
            onClick={() => handleNavigate("/student/dashboard")}
            className="flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-purple-500 via-violet-500 to-fuchsia-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:via-violet-600 hover:to-fuchsia-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            <Home className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>

          <button
            onClick={() => window.location.reload()}
            className="flex items-center space-x-2 px-8 py-4 bg-white text-gray-700 border-2 border-gray-300 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-400 transform hover:scale-105 transition-all duration-200"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Retake Quiz</span>
          </button>
        </div>

        {/* Motivational Message */}
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
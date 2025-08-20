import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Check, Clock, BookOpen, Timer } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export default function QuizPage() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(null); // Time in seconds
  const [startTime, setStartTime] = useState(null); // Track quiz start time

  useEffect(() => {
    console.log("Quiz ID from useParams:", quizId);
    const fetchQuiz = async () => {
      if (!quizId || isNaN(quizId)) {
        console.error("Invalid quiz ID detected:", quizId);
        setError("Invalid quiz ID. Please select a valid quiz from your assigned quizzes.");
        setLoading(false);
        return;
      }

      try {
        console.log("Fetching quiz with ID:", quizId);
        const response = await axios.get(`http://localhost:8080/api/quiz/${quizId}`);
        console.log("Quiz data received:", response.data);
        const mappedQuiz = {
          ...response.data,
          questions: response.data.questions.map((q) => ({
            id: q.id,
            questionText: q.text,
            options: q.options.split(","),
            correctAnswer: q.answer,
          })),
        };
        setQuiz(mappedQuiz);
        setTimeRemaining(mappedQuiz.timeLimit * 60); // Convert minutes to seconds
        setStartTime(Date.now()); // Record start time
        setLoading(false);
      } catch (err) {
        console.error("Error fetching quiz:", err);
        if (err.response?.status === 404) {
          setError("Quiz not found. Please check the quiz ID or contact your instructor.");
        } else if (err.response?.status === 410) {
          setError("Quiz is no longer available due to passed deadline.");
        } else {
          setError("Failed to load quiz. Please try again or contact your instructor.");
        }
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [quizId]);

  // Timer logic
  useEffect(() => {
    if (timeRemaining === null || timeRemaining <= 0 || loading || error) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          submitQuiz(); // Auto-submit when time is up
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, loading, error]);

  const handleAnswer = (selected) => {
    setAnswers({ ...answers, [quiz?.questions[currentQuestion]?.id]: selected?.trim() });
  };

  const nextQuestion = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
        setIsTransitioning(false);
      }, 200);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentQuestion(currentQuestion - 1);
        setIsTransitioning(false);
      }, 200);
    }
  };

  const submitQuiz = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setError("Please log in to submit the quiz.");
      navigate("/login");
      return;
    }

    const score = quiz.questions.reduce(
      (total, q) => total + (answers[q.id]?.trim() === q.correctAnswer?.trim() ? 1 : 0),
      0
    );
    const timeSpent = Math.round((Date.now() - startTime) / 1000); // Calculate time spent in seconds
    const attemptData = {
      quizId: parseInt(quizId),
      userId, // Use userId from localStorage
      answers: quiz.questions.reduce((acc, q) => ({
        ...acc,
        [q.id]: {
          selectedAnswer: answers[q.id]?.trim() || null,
          correctAnswer: q.correctAnswer,
        },
      }), {}),
      score,
      totalQuestions: quiz.questions.length,
      timeSpent,
      completedDate: new Date().toISOString(),
      difficulty: quiz.difficulty,
      category: quiz.category,
      attempts: 1,
    };

    try {
      const response = await axios.post("http://localhost:8080/api/quiz-attempt", attemptData);
      console.log("Quiz attempt saved:", response.data);
      setTimeRemaining(0); // Stop the timer
      navigate("/result", { state: { quiz, answers, score, attemptId: response.data.attemptId, timeSpent } });
    } catch (err) {
      console.error("Error saving quiz attempt:", err.response?.data, err.response?.status);
      setError("Failed to save quiz attempt. Please try again.");
    }
  };

  const formatTime = (seconds) => {
    if (seconds === null) return "N/A";
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-red-200">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  const question = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;
  const isAnswered = answers[question.id];
  const isLastQuestion = currentQuestion === quiz.questions.length - 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl mb-4 shadow-lg">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            {quiz.title}
          </h1>
          <p className="text-gray-600 text-lg">
            {quiz.description || "Test your knowledge with this quiz"}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">
                Question {currentQuestion + 1} of {quiz.questions.length}
              </span>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Timer className="w-5 h-5 text-gray-500" />
                <span className={`text-sm font-medium ${timeRemaining <= 60 ? "text-red-600" : "text-gray-700"}`}>
                  Time Left: {formatTime(timeRemaining)}
                </span>
              </div>
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {Math.round(progress)}% Complete
              </span>
            </div>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-500 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-white opacity-30 animate-pulse rounded-full"></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-8 py-6">
            <h2 className="text-xl md:text-2xl font-semibold text-white leading-relaxed">
              {question.questionText}
            </h2>
          </div>

          <div className={`p-8 transition-opacity duration-200 ${isTransitioning ? 'opacity-50' : 'opacity-100'}`}>
            <div className="grid gap-4">
              {question.options.map((option, index) => {
                const isSelected = answers[question.id] === option;
                return (
                  <button
                    key={index}
                    className={`
                      group relative w-full p-5 rounded-2xl border-2 text-left transition-all duration-300 ease-out
                      ${isSelected
                        ? 'border-indigo-500 bg-indigo-50 shadow-md transform scale-[1.02]'
                        : 'border-gray-200 bg-white hover:border-indigo-300 hover:bg-indigo-25 hover:shadow-sm hover:transform hover:scale-[1.01]'
                      }
                      focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50
                    `}
                    onClick={() => handleAnswer(option)}
                    disabled={timeRemaining === 0}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-lg font-medium transition-colors duration-200 ${
                        isSelected ? 'text-indigo-800' : 'text-gray-700 group-hover:text-indigo-700'
                      }`}>
                        {option}
                      </span>

                      <div className={`
                        w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200
                        ${isSelected
                          ? 'border-indigo-500 bg-indigo-500'
                          : 'border-gray-300 group-hover:border-indigo-400'
                        }
                      `}>
                        {isSelected && (
                          <Check className="w-3.5 h-3.5 text-white animate-in fade-in zoom-in duration-200" />
                        )}
                      </div>
                    </div>

                    <div className={`
                      absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300
                      ${!isSelected && 'bg-gradient-to-r from-indigo-50 to-purple-50'}
                    `}></div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center mt-8 gap-4">
          <button
            onClick={prevQuestion}
            disabled={currentQuestion === 0 || timeRemaining === 0}
            className={`
              flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200
              ${currentQuestion === 0 || timeRemaining === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400 hover:shadow-sm'
              }
            `}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="hidden sm:flex space-x-2">
            {quiz.questions.map((_, index) => (
              <div
                key={index}
                className={`
                  w-3 h-3 rounded-full transition-all duration-300
                  ${index === currentQuestion
                    ? 'bg-indigo-600 scale-125'
                    : index < currentQuestion
                      ? 'bg-green-500'
                      : 'bg-gray-300'
                  }
                `}
              />
            ))}
          </div>

          {isLastQuestion ? (
            <button
              onClick={submitQuiz}
              disabled={!isAnswered || timeRemaining === 0}
              className={`
                flex items-center space-x-2 px-8 py-3 rounded-xl font-semibold transition-all duration-200
                ${!isAnswered || timeRemaining === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 hover:shadow-lg transform hover:scale-105 active:scale-100'
                }
              `}
            >
              <Check className="w-4 h-4" />
              <span>Submit Quiz</span>
            </button>
          ) : (
            <button
              onClick={nextQuestion}
              disabled={!isAnswered || timeRemaining === 0}
              className={`
                flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200
                ${!isAnswered || timeRemaining === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 hover:shadow-lg transform hover:scale-105 active:scale-100'
                }
              `}
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="text-center mt-12 text-gray-500 text-sm">
          <p>Take your time and choose the best answer for each question.</p>
        </div>
      </div>
    </div>
  );
}
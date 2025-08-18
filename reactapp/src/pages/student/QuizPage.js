import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Check, Clock, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ResultPage from "./ResultPage";
export default function QuizPage() {
  const quiz = {
    title: "Professional Knowledge Assessment",
    questions: [
      {
        id: 1,
        questionText: "What is the capital city of France?",
        options: ["Paris", "London", "Berlin", "Rome"],
        correctAnswer: "Paris"
      },
      {
        id: 2,
        questionText: "Which planet is the largest in our solar system?",
        options: ["Earth", "Jupiter", "Mars", "Venus"],
        correctAnswer: "Jupiter"
      },
      {
        id: 3,
        questionText: "What programming language is primarily used with React?",
        options: ["Python", "Java", "JavaScript", "C++"],
        correctAnswer: "JavaScript"
      },
    ],
  };
const navigate = useNavigate();
  const submitQuiz = () => {
    const score = quiz.questions.reduce(
      (total, q) => total + (answers[q.id] === q.correctAnswer ? 1 : 0),
      0
    );
    navigate("/result", { state: { quiz, answers, score } });
  };
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleAnswer = (selected) => {
    setAnswers({ ...answers, [quiz.questions[currentQuestion].id]: selected });
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



  const question = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;
  const isAnswered = answers[question.id];
  const isLastQuestion = currentQuestion === quiz.questions.length - 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl mb-4 shadow-lg">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            {quiz.title}
          </h1>
          <p className="text-gray-600 text-lg">
            Test your knowledge with our comprehensive assessment
          </p>
        </div>

        {/* Progress Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">
                Question {currentQuestion + 1} of {quiz.questions.length}
              </span>
            </div>
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {Math.round(progress)}% Complete
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-500 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-white opacity-30 animate-pulse rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Question Card */}
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
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-lg font-medium transition-colors duration-200 ${
                        isSelected ? 'text-indigo-800' : 'text-gray-700 group-hover:text-indigo-700'
                      }`}>
                        {option}
                      </span>

                      {/* Selection Indicator */}
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

                    {/* Subtle gradient overlay on hover */}
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

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-8 gap-4">
          <button
            onClick={prevQuestion}
            disabled={currentQuestion === 0}
            className={`
              flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200
              ${currentQuestion === 0
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
              disabled={!isAnswered}
              className={`
                flex items-center space-x-2 px-8 py-3 rounded-xl font-semibold transition-all duration-200
                ${!isAnswered
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
              disabled={!isAnswered}
              className={`
                flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200
                ${!isAnswered
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

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500 text-sm">
          <p>Take your time and choose the best answer for each question.</p>
        </div>
      </div>
    </div>
  );
}
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import AdminPortal from "./pages/admin/AdminPortal";
import QuizManagement from "./pages/admin/QuizManagement";
import QuestionBank from "./pages/admin/QuestionBank";
import StudentDashboard from "./pages/student/Dashboard";
import QuizPage from "./pages/student/QuizPage";
import ResultPage from "./pages/student/ResultPage";
import AssignedQuizzes from "./pages/student/AssignedQuizzes";
import ReviewPage from "./pages/student/ReviewPage";
import CompletedQuizzes from "./pages/student/CompletedQuizzes";

import NotFound from "./pages/NotFound";
import Home from "./pages/auth/Home";

export default function AppRouter() {
  return (
    <Router>
      <Routes>
       <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />


        <Route path="/admin/dashboard" element={<AdminPortal />} />
        <Route path="/admin/quizzes" element={<QuizManagement />} />
        <Route path="/admin/question-bank" element={<QuestionBank />} />

        <Route path="/admin/*" element={<AdminPortal />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/quiz/:quizId" element={<QuizPage />} />
        <Route path="/result" element={<ResultPage />} />
         <Route path="/assigned-quizzes" element={<AssignedQuizzes />} />
         <Route path="/review/:attemptId" element={<ReviewPage />} />

         <Route path="completed-quizzes" element={<CompletedQuizzes />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

import React from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Users,
  Award,
  Clock,
  BarChart3,
  PlusCircle,
  Search,
  Timer,
  TrendingUp,
  Shield,
  CheckCircle
} from "lucide-react";

const Button = ({ text, onClick, variant = "primary" }) => {
  const baseClasses = "px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 cursor-pointer";
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-lg",
    secondary: "bg-white hover:bg-gray-50 text-blue-600 border-2 border-blue-600 shadow-lg",
    accent: "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg"
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]}`}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

const FeatureCard = ({ icon: Icon, title, description, userType }) => (
  <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
    <div className="flex items-center mb-4">
      <div className={`p-3 rounded-lg ${userType === 'admin' ? 'bg-purple-100' : 'bg-blue-100'}`}>
        <Icon className={`h-6 w-6 ${userType === 'admin' ? 'text-purple-600' : 'text-blue-600'}`} />
      </div>
      <div className="ml-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <span className={`text-sm px-2 py-1 rounded-full ${
          userType === 'admin'
            ? 'bg-purple-100 text-purple-700'
            : 'bg-blue-100 text-blue-700'
        }`}>
          {userType === 'admin' ? 'Admin' : 'Student'}
        </span>
      </div>
    </div>
    <p className="text-gray-600 leading-relaxed">{description}</p>
  </div>
);

const StatCard = ({ number, label, icon: Icon }) => (
  <div className="bg-gradient-to-br from-white to-gray-50 rounded-lg p-6 text-center shadow-md border border-gray-100">
    <Icon className="h-8 w-8 mx-auto mb-3 text-blue-600" />
    <div className="text-3xl font-bold text-gray-800 mb-1">{number}</div>
    <div className="text-gray-600 text-sm">{label}</div>
  </div>
);

export default function Home() {
  const navigate = useNavigate();
  const adminFeatures = [
    {
      icon: BarChart3,
      title: "Admin Dashboard",
      description: "Comprehensive control center with quick access to quiz management, question bank, and detailed student performance analytics."
    },
    {
      icon: PlusCircle,
      title: "Quiz Creation Form",
      description: "Intuitive form to create engaging quizzes with customizable titles, descriptions, time limits, and question selection from your question bank."
    },
    {
      icon: BookOpen,
      title: "Question Bank Manager",
      description: "Powerful searchable database to organize, edit, and manage all your quiz questions with advanced filtering and categorization."
    },
    {
      icon: TrendingUp,
      title: "Student Results Analytics",
      description: "Detailed insights into student performance, quiz statistics, and comprehensive reporting tools for educational assessment."
    }
  ];

  const studentFeatures = [
    {
      icon: Users,
      title: "Student Dashboard",
      description: "Personalized learning hub displaying assigned quizzes, scores, attempt history, and progress tracking across all subjects."
    },
    {
      icon: Timer,
      title: "Interactive Quiz Interface",
      description: "Engaging quiz-taking experience with one question at a time, built-in timer, and intuitive navigation for optimal focus."
    },
    {
      icon: Award,
      title: "Detailed Results Page",
      description: "Comprehensive performance breakdown showing scores, correct/incorrect answers, and personalized feedback for continuous improvement."
    },
    {
      icon: CheckCircle,
      title: "Progress Tracking",
      description: "Monitor your learning journey with detailed analytics, performance trends, and achievement milestones."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="relative container mx-auto px-6 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
              QuizMaster Pro
            </h1>
            <p className="text-xl text-gray-700 mb-8 leading-relaxed">
              The ultimate quiz management platform for educators and students. Create, manage, and take quizzes with powerful analytics and an intuitive interface.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                text="Login to Continue"
                onClick={() => navigate("/login")}
                variant="accent"
              />
              <Button
                text="Create New Account"
                onClick={() => navigate("/register")}
                variant="secondary"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-16 shadow-sm">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <StatCard number="500+" label="Active Students" icon={Users} />
            <StatCard number="1,200+" label="Quizzes Created" icon={BookOpen} />
            <StatCard number="15,000+" label="Questions Bank" icon={Search} />
            <StatCard number="98%" label="Success Rate" icon={TrendingUp} />
          </div>
        </div>
      </div>

      {/* Admin Features Section */}
      <div className="py-20 bg-gradient-to-r from-purple-50 to-blue-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-4">
              <Shield className="h-8 w-8 text-purple-600 mr-3" />
              <h2 className="text-4xl font-bold text-gray-800">Admin Features</h2>
            </div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive tools for educators to create, manage, and analyze quiz performance
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {adminFeatures.map((feature, index) => (
              <FeatureCard
                key={index}
                {...feature}
                userType="admin"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Student Features Section */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-4">
              <BookOpen className="h-8 w-8 text-blue-600 mr-3" />
              <h2 className="text-4xl font-bold text-gray-800">Student Experience</h2>
            </div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Engaging and intuitive quiz-taking experience with detailed performance insights
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {studentFeatures.map((feature, index) => (
              <FeatureCard
                key={index}
                {...feature}
                userType="student"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Key Benefits Section */}
      <div className="py-20 bg-gradient-to-br from-gray-900 to-blue-900 text-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Why Choose QuizMaster Pro?</h2>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Built for modern education with cutting-edge features that enhance both teaching and learning experiences
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="text-center p-8">
              <div className="bg-blue-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <Clock className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Real-time Analytics</h3>
              <p className="opacity-90">
                Get instant insights into student performance with live dashboards and comprehensive reporting tools.
              </p>
            </div>
            <div className="text-center p-8">
              <div className="bg-purple-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <Search className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Smart Question Bank</h3>
              <p className="opacity-90">
                Organize thousands of questions with intelligent search, filtering, and categorization features.
              </p>
            </div>
            <div className="text-center p-8">
              <div className="bg-green-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <Award className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Engaging Experience</h3>
              <p className="opacity-90">
                Modern, intuitive interface that makes quiz creation and taking an enjoyable experience for everyone.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Details Section */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">Complete Feature Overview</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Every tool you need for comprehensive quiz management and student assessment
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <Users className="h-6 w-6 text-blue-600 mr-3" />
                Authentication System
              </h3>
              <p className="text-gray-600 mb-4">
                Secure login and registration system for both students and administrators with role-based access control.
              </p>
              <ul className="text-gray-600 space-y-2">
                <li>• Student account creation and management</li>
                <li>• Admin authentication and permissions</li>
                <li>• Password recovery and security features</li>
              </ul>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <Timer className="h-6 w-6 text-blue-600 mr-3" />
                Quiz Taking Interface
              </h3>
              <p className="text-gray-600 mb-4">
                Intuitive quiz interface designed for optimal focus with one question at a time and built-in timer functionality.
              </p>
              <ul className="text-gray-600 space-y-2">
                <li>• Single question focus mode</li>
                <li>• Real-time countdown timer</li>
                <li>• Auto-save progress feature</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of educators and students who are already using QuizMaster Pro to enhance their learning experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              text="Start Your Journey"
              onClick={() => navigate("/register")}
              variant="secondary"
            />
            <Button
              text="Login Now"
              onClick={() => navigate("/login")}
              variant="primary"
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">QuizMaster Pro</h3>
            <p className="text-gray-400 mb-6">
              Empowering education through intelligent quiz management
            </p>
            <div className="flex justify-center space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">About</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Support</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms</a>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-800">
              <p className="text-gray-400">© 2025 QuizMaster Pro. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
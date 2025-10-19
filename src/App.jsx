// ...existing code...
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";

// Pages
import PlatformHome from "./pages/platform/PlatformHome.jsx";
import Login from "./pages/Auth/Login.jsx";
import Signup from "./pages/Auth/Signup.jsx";
import DashboardHome from "./pages/dashboard/DashboardHome.jsx";
import CoursesList from "./pages/dashboard/CoursesList.jsx";
import QuestionsList from "./pages/dashboard/QuestionsList.jsx";
import QuestionForm from "./pages/dashboard/QuestionForm.jsx";
import ExamsList from "./pages/dashboard/ExamsList.jsx";
import ExamForm from "./pages/dashboard/ExamForm.jsx";
import LessonsList from "./pages/dashboard/LessonsList.jsx";
import LessonForm from "./pages/dashboard/LessonForm.jsx";
import AdminsList from "./pages/dashboard/AdminsList.jsx";
import UsersList from "./pages/dashboard/UsersList.jsx";
import CreateAdmin from "./pages/dashboard/CreateAdmin.jsx";
import Courses from "./pages/Courses/Courses.jsx";
import StudentExamsList from "./pages/StudentExams/StudentExamsList.jsx";

// Components
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import StudentExam from "./components/StudentExam.jsx";
import { EntitlementsProvider } from "./context/EntitlementsContext.jsx";
import PublicRoute from "./components/routes/PublicRoute.jsx";
import PrivateRoute from "./components/routes/PrivateRoute.jsx";
import StudentRoute from "./components/routes/StudentRoute.jsx";
import AdminRoute from "./components/routes/AdminRoute.jsx";
import About from "./pages/About/About.jsx";

function App() {
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <EntitlementsProvider>
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<PublicRoute><PlatformHome /></PublicRoute>} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
      <Route path="/courses" element={<PublicRoute><Courses /></PublicRoute>} />
      <Route path="/about" element={<PublicRoute><About /></PublicRoute>} />
      <Route
        path="/student-exam/:examId"
        element={
          <StudentRoute>
            <StudentExam />
          </StudentRoute>
        }
      />

      {/* Student exams list */}
      <Route
        path="/student-exams"
        element={
          <StudentRoute>
            <StudentExamsList />
          </StudentRoute>
        }
      />

      {/* Dashboard routes - admin only */}
      <Route
        path="/dashboard"
        element={
          <AdminRoute>
            <DashboardHome />
          </AdminRoute>
        }
      />

      {/* Admins */}
      <Route
        path="/dashboard/admins"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminsList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/admins/new"
        element={
          <ProtectedRoute requiredRole="admin">
            <CreateAdmin />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/users"
        element={
          <ProtectedRoute requiredRole="admin">
            <UsersList />
          </ProtectedRoute>
        }
      />
      {/* Lessons management */}
      <Route
        path="/dashboard/lessons"
        element={
          <AdminRoute>
            <LessonsList />
          </AdminRoute>
        }
      />
      <Route
        path="/dashboard/lessons/new"
        element={
          <AdminRoute>
            <LessonForm />
          </AdminRoute>
        }
      />
      <Route
        path="/dashboard/lessons/edit/:lessonId"
        element={
          <AdminRoute>
            <LessonForm />
          </AdminRoute>
        }
      />
      <Route
        path="/dashboard/courses"
        element={
          <AdminRoute>
            <CoursesList />
          </AdminRoute>
        }
      />

      <Route
        path="/dashboard/questions"
        element={
          <AdminRoute>
            <QuestionsList />
          </AdminRoute>
        }
      />
      <Route
        path="/dashboard/questions/new"
        element={
          <AdminRoute>
            <QuestionForm />
          </AdminRoute>
        }
      />
      <Route
        path="/dashboard/questions/edit/:questionId"
        element={
          <AdminRoute>
            <QuestionForm />
          </AdminRoute>
        }
      />

      {/* Exams management */}
      <Route
        path="/dashboard/exams"
        element={
          <AdminRoute>
            <ExamsList />
          </AdminRoute>
        }
      />
      <Route
        path="/dashboard/exams/new"
        element={
          <AdminRoute>
            <ExamForm />
          </AdminRoute>
        }
      />
      <Route
        path="/dashboard/exams/edit/:examId"
        element={
          <AdminRoute>
            <ExamForm />
          </AdminRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </EntitlementsProvider>
  );
}

export default App;
// ...existing code...

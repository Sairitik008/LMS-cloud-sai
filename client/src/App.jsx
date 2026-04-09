import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import ProtectedRoute from './components/routes/ProtectedRoute';
import AdminRoute from './components/routes/AdminRoute';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageCourses from './pages/admin/ManageCourses';
import ManageTutorials from './pages/admin/ManageTutorials';
import ManageStudyMaterial from './pages/admin/ManageStudyMaterial';
import ManageMockTests from './pages/admin/ManageMockTests';
import ManageStudents from './pages/admin/ManageStudents';
import Announcements from './pages/admin/Announcements';

// Student Pages
import Tutorials from './pages/student/Tutorials';
import Courses from './pages/student/Courses';
import StudyMaterials from './pages/student/StudyMaterials';
import MockTest from './pages/student/MockTest';
import TestResult from './pages/student/TestResult';
import Leaderboard from './pages/student/Leaderboard';
import Settings from './pages/Settings';

import Layout from './components/common/Layout';

function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Authenticated Routes with Sidebar/Navbar */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            {/* Common Authenticated Routes */}
            <Route path="/settings" element={<Settings />} />

            {/* Student Routes */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tutorials" element={<Tutorials />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/materials" element={<StudyMaterials />} />
            <Route path="/mocktests" element={<MockTest />} />
            <Route path="/test-result/:id" element={<TestResult />} />
            <Route path="/leaderboard" element={<Leaderboard />} />

            {/* Admin Routes */}
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/courses" element={<ManageCourses />} />
              <Route path="/admin/tutorials" element={<ManageTutorials />} />
              <Route path="/admin/materials" element={<ManageStudyMaterial />} />
              <Route path="/admin/mocktests" element={<ManageMockTests />} />
              <Route path="/admin/students" element={<ManageStudents />} />
              <Route path="/admin/announcements" element={<Announcements />} />
            </Route>
          </Route>
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

export default App;

import React from "react";
import Navbar from "./pages/navbar";
import Footer from "./pages/footer";

import IndexPage from "./pages/home";
import Profile from "./pages/profile";
import ExplorePage from "./pages/Explore";
import Services from "./pages/Services";
import OurTeam from "./pages/OurTeam";

import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

function PublicOnlyRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="auth-page">
        <p className="loading-text">Loading...</p>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  return children;
}

function App() {
  return (
    <>
      <AuthProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<IndexPage />} />
            <Route path="/home" element={<IndexPage />} />
            <Route path="/Home" element={<IndexPage />} />

            <Route path="/Explore" element={<ExplorePage />} />
            <Route path="/OurTeam" element={<OurTeam />} />
            <Route path="/Services" element={<Services />} />
            <Route path="/Profile" element={<Profile />} />

            <Route
              path="/login"
              element={
                <PublicOnlyRoute>
                  <Login />
                </PublicOnlyRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicOnlyRoute>
                  <Register />
                </PublicOnlyRoute>
              }
            />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
          <Footer />
        </Router>
      </AuthProvider>
    </>
  );
}

export default App;

